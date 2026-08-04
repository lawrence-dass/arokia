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

// Cache identity for a meditation query. Both the fetch action and the hook derive their key from
// this one function so they can never drift apart.
function meditationsKey(
  lang: LanguageCode,
  practicePath?: PracticePath,
  category?: CategoryTag,
  timeOfDay?: TimeOfDay
): string {
  return `${lang}|${practicePath ?? ''}|${category ?? ''}|${timeOfDay ?? ''}`;
}

// In-flight keys live outside the store: they are transient request bookkeeping, not rendered
// state, and keeping them out of the store avoids re-rendering every subscriber on each request.
const meditationsInFlight = new Set<string>();

// Stable identity for the "no results yet" case — a fresh [] each render would be a new reference
// and defeat memoisation in every consumer.
const EMPTY_MEDITATIONS: ContentItem[] = [];

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
  // Meditation results cached per `lang|practicePath|category|timeOfDay` key. Several screens
  // request different filter combinations while mounted at once (the home grid asks unfiltered,
  // the walk screen asks per practice path), so a single shared result slot + single "fetched key"
  // made each consumer invalidate the other's cache on every render — an unbounded refetch loop
  // that pinned the loading state on forever. Keying the cache lets each consumer settle
  // independently. Presence of a key means "fetched" (an empty array is a valid, settled result).
  meditationsByKey: Record<string, ContentItem[]>;
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
  meditationsByKey: {},

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
    const key = meditationsKey(lang, practicePath, category, timeOfDay);
    // Guard against a second fetch for a key already in flight: the key is absent from
    // `meditationsByKey` until it resolves, so without this any re-render would queue a duplicate.
    if (meditationsInFlight.has(key)) return;
    meditationsInFlight.add(key);

    set((state) => ({
      error: null,
      activeFilters: {
        ...state.activeFilters,
        practicePath: practicePath ?? null,
        category: category ?? null,
      },
    }));
    try {
      const meditations = await getMeditations(lang, practicePath, category, timeOfDay);
      set((state) => ({
        meditations,
        meditationsByKey: { ...state.meditationsByKey, [key]: meditations },
      }));
    } catch {
      // Record the key as settled (with no results) even on failure. Leaving it unset would keep
      // every consumer of this key permanently "pending", which both hides the error state behind
      // a spinner and re-triggers the fetch on every render.
      set((state) => ({
        error: 'errors.offline',
        meditationsByKey: { ...state.meditationsByKey, [key]: [] },
      }));
    } finally {
      meditationsInFlight.delete(key);
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
  const requestedKey = meditationsKey(lang, practicePath, category, timeOfDay);
  // Subscribe to this key's slice only, so another screen fetching a different filter combination
  // neither re-renders this consumer nor resets it to "pending".
  const items = useContentStore((state) => state.meditationsByKey[requestedKey]);
  const isCurrent = items !== undefined;

  useEffect(() => {
    if (!isCurrent) {
      fetchMeditations(lang, practicePath, category, timeOfDay);
    }
  }, [fetchMeditations, lang, practicePath, category, timeOfDay, isCurrent]);

  return { meditations: items ?? EMPTY_MEDITATIONS, isPending: !isCurrent };
}
