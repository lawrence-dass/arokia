import { useEffect, useState } from 'react';
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

  fetchQuotes: async (lang) => {
    const { activeFilters } = get();
    set({ isLoading: true, error: null });
    try {
      const quotes = await getQuotes(
        lang,
        activeFilters.practicePath ?? undefined,
        activeFilters.moodTag ?? undefined
      );
      set({ quotes, isLoading: false });
    } catch {
      set({ error: 'errors.offline', isLoading: false });
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

// Triggers fetchQuotes on mount and reports a single "pending" flag that also covers the gap
// before the fetch actually starts — `isLoading` alone is false for one frame on mount, which
// would otherwise flash the empty state before the fetch begins.
export function useQuotesFetch(lang: LanguageCode) {
  const fetchQuotes = useContentStore((state) => state.fetchQuotes);
  const isLoading = useContentStore((state) => state.isLoading);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    fetchQuotes(lang).finally(() => setHasFetched(true));
  }, [fetchQuotes, lang]);

  return { isPending: isLoading || !hasFetched };
}
