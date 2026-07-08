import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { create } from 'zustand';
import type {
  ContentItem,
  LanguageCode,
  PracticePath,
  MoodTag,
  CategoryTag,
  TimeOfDay,
} from '@/types';
import { getQuotes, getMeditations } from '@/lib/content';

// Maps the active UI language (i18next / device locale) to the content language to fetch, so an
// English device gets English scripture and a Tamil device gets Tamil. Falls back to 'ta' (the
// shipped default) for any locale we don't yet have a content pack for.
export function useContentLanguage(): LanguageCode {
  const { i18n } = useTranslation();
  const lang = i18n.language ?? 'ta';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('te')) return 'te';
  return 'ta';
}

interface ContentState {
  quotes: ContentItem[];
  meditations: ContentItem[];
  activeFilters: {
    practicePath: PracticePath | null;
    moodTag: MoodTag | null; // emotional-state filter for the scripture (quote) browser
    category: CategoryTag | null; // path-aware filter for the meditation library
  };
  isLoading: boolean;
  error: string | null;
  // The language `quotes` currently reflects (null before the first fetch). Scoping "already
  // fetched" to a language — not a one-time boolean — lets the in-app language switcher trigger a
  // re-fetch when the user changes language, instead of showing stale content for the old language.
  quotesFetchedLang: LanguageCode | null;
  // The `practicePath|category` combination `meditations` currently reflects (null before the
  // first fetch) — unlike quotes, meditations are filtered, so "already fetched" must be scoped
  // to a specific filter combination, not a single one-time flag.
  meditationsFetchedFilterKey: string | null;
  // Actions
  fetchQuotes: (lang: LanguageCode) => Promise<void>;
  fetchMeditations: (
    lang: LanguageCode,
    practicePath?: PracticePath,
    category?: CategoryTag,
    timeOfDay?: TimeOfDay
  ) => Promise<void>;
  setFilter: (filter: Partial<ContentState['activeFilters']>) => void;
  clearFilters: () => void;
}

export const useContentStore = create<ContentState>()((set, get) => ({
  quotes: [],
  meditations: [],
  activeFilters: { practicePath: null, moodTag: null, category: null },
  isLoading: false,
  error: null,
  quotesFetchedLang: null,
  meditationsFetchedFilterKey: null,

  fetchQuotes: async (lang) => {
    const { activeFilters } = get();
    set({ isLoading: true, error: null });
    try {
      const quotes = await getQuotes(
        lang,
        activeFilters.practicePath ?? undefined,
        activeFilters.moodTag ?? undefined
      );
      set({ quotes, isLoading: false, quotesFetchedLang: lang });
    } catch {
      set({ error: 'errors.offline', isLoading: false, quotesFetchedLang: lang });
    }
  },

  fetchMeditations: async (lang, practicePath, category, timeOfDay) => {
    set((state) => ({
      isLoading: true,
      error: null,
      activeFilters: {
        ...state.activeFilters,
        practicePath: practicePath ?? null,
        category: category ?? null,
      },
    }));
    try {
      const meditations = await getMeditations(lang, practicePath, category, timeOfDay);
      set({
        meditations,
        isLoading: false,
        meditationsFetchedFilterKey: `${lang}|${practicePath ?? ''}|${category ?? ''}|${timeOfDay ?? ''}`,
      });
    } catch {
      set({ error: 'errors.offline', isLoading: false });
    }
  },

  setFilter: (filter) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, ...filter },
    })),
  clearFilters: () => set({ activeFilters: { practicePath: null, moodTag: null, category: null } }),
}));

// Triggers fetchQuotes on mount only if the cached quotes aren't already for `lang`
// (`quotesFetchedLang` lives in the store, shared across every screen using this hook) — so
// navigating between /word and /search doesn't re-fetch and flash the loading state, but changing
// language (via the in-app switcher) does re-fetch. Also covers the gap before the first fetch.
export function useQuotesFetch(lang: LanguageCode) {
  const fetchQuotes = useContentStore((state) => state.fetchQuotes);
  const isLoading = useContentStore((state) => state.isLoading);
  const quotesFetchedLang = useContentStore((state) => state.quotesFetchedLang);
  const isCurrent = quotesFetchedLang === lang;

  useEffect(() => {
    if (!isCurrent) {
      fetchQuotes(lang);
    }
  }, [fetchQuotes, isCurrent, lang]);

  return { isPending: isLoading || !isCurrent };
}

// Same purpose as useQuotesFetch, but meditations are filtered — "already fetched" is scoped to
// the specific practicePath/category combination requested, not a one-time flag, so changing the
// filter correctly triggers a re-fetch instead of showing stale results for a different filter.
export function useMeditationsFetch(
  lang: LanguageCode,
  practicePath?: PracticePath,
  category?: CategoryTag,
  timeOfDay?: TimeOfDay
) {
  const fetchMeditations = useContentStore((state) => state.fetchMeditations);
  const isLoading = useContentStore((state) => state.isLoading);
  const fetchedFilterKey = useContentStore((state) => state.meditationsFetchedFilterKey);
  const requestedKey = `${lang}|${practicePath ?? ''}|${category ?? ''}|${timeOfDay ?? ''}`;
  const isCurrent = fetchedFilterKey === requestedKey;

  useEffect(() => {
    if (!isCurrent) {
      fetchMeditations(lang, practicePath, category, timeOfDay);
    }
  }, [fetchMeditations, lang, practicePath, category, timeOfDay, isCurrent]);

  return { isPending: isLoading || !isCurrent };
}
