import { useEffect } from 'react';
import { create } from 'zustand';
import type { ContentItem, LanguageCode, PracticePath, MoodTag } from '@/types';
import { getQuotes, getMeditations } from '@/lib/content';

interface ContentState {
  quotes: ContentItem[];
  meditations: ContentItem[];
  activeFilters: {
    practicePath: PracticePath | null;
    moodTag: MoodTag | null;
  };
  isLoading: boolean;
  error: string | null;
  // True once fetchQuotes has completed at least once (success or failure) this session —
  // lets useQuotesFetch avoid a redundant re-fetch every time a new screen mounts.
  hasFetchedQuotes: boolean;
  // Actions
  fetchQuotes: (lang: LanguageCode) => Promise<void>;
  fetchMeditations: (lang: LanguageCode) => Promise<void>;
  setFilter: (filter: Partial<ContentState['activeFilters']>) => void;
  clearFilters: () => void;
}

export const useContentStore = create<ContentState>()((set, get) => ({
  quotes: [],
  meditations: [],
  activeFilters: { practicePath: null, moodTag: null },
  isLoading: false,
  error: null,
  hasFetchedQuotes: false,

  fetchQuotes: async (lang) => {
    const { activeFilters } = get();
    set({ isLoading: true, error: null });
    try {
      const quotes = await getQuotes(
        lang,
        activeFilters.practicePath ?? undefined,
        activeFilters.moodTag ?? undefined
      );
      set({ quotes, isLoading: false, hasFetchedQuotes: true });
    } catch {
      set({ error: 'errors.offline', isLoading: false, hasFetchedQuotes: true });
    }
  },

  fetchMeditations: async (lang) => {
    const { activeFilters } = get();
    set({ isLoading: true, error: null });
    try {
      const meditations = await getMeditations(lang, activeFilters.practicePath ?? undefined);
      set({ meditations, isLoading: false });
    } catch {
      set({ error: 'errors.offline', isLoading: false });
    }
  },

  setFilter: (filter) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, ...filter },
    })),
  clearFilters: () => set({ activeFilters: { practicePath: null, moodTag: null } }),
}));

// Triggers fetchQuotes on mount ONLY if it hasn't already run this session (`hasFetchedQuotes`
// lives in the store, shared across every screen using this hook) — otherwise navigating between
// /word and /search would re-fetch and flash the loading state every time, even though the data
// is already cached. Also covers the one-frame gap before the very first fetch actually starts.
export function useQuotesFetch(lang: LanguageCode) {
  const fetchQuotes = useContentStore((state) => state.fetchQuotes);
  const isLoading = useContentStore((state) => state.isLoading);
  const hasFetchedQuotes = useContentStore((state) => state.hasFetchedQuotes);

  useEffect(() => {
    if (!hasFetchedQuotes) {
      fetchQuotes(lang);
    }
  }, [fetchQuotes, hasFetchedQuotes, lang]);

  return { isPending: isLoading || !hasFetchedQuotes };
}
