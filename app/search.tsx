import { useEffect, useState } from 'react';
import { FlatList, Text, TextInput } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';

import { QuoteList, ScriptureCard } from '@/components/scripture';
import { SafeScreen } from '@/components/shared';
import { searchContent } from '@/lib/content';
import { useContentLanguage, useQuotesFetch } from '@/store/contentStore';
import type { ScriptureVerse } from '@/types';

type SearchStatus = 'idle' | 'searching' | 'error';

export default function SearchScreen() {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const { isPending } = useQuotesFetch(useContentLanguage());
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ScriptureVerse[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('searching');
    let cancelled = false;
    // Debounce so the full FTS scan runs once the user pauses typing, not on every keystroke.
    const handle = setTimeout(() => {
      searchContent(db, 'ta', trimmed)
        .then((matches) => {
          if (cancelled) return;
          setResults(matches);
          setStatus('idle');
        })
        .catch(() => {
          // searchContent already reported to Sentry; surface a retryable error to the user
          // rather than a misleading "no matches" empty state.
          if (cancelled) return;
          setResults([]);
          setStatus('error');
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [db, query]);

  const isSearching = query.trim().length > 0;

  function renderResults() {
    // Gate the empty state on status so "no matches" never flashes while a search is in flight.
    if (status === 'searching') {
      return <Text className="text-base text-text-secondary">{t('search.searching')}</Text>;
    }
    if (status === 'error') {
      return <Text className="text-base text-error">{t('search.error')}</Text>;
    }
    if (results.length === 0) {
      return <Text className="text-base text-text-secondary">{t('search.empty')}</Text>;
    }
    return (
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="gap-4 pb-10"
        renderItem={({ item }) => (
          // Display-only: results are raw bundled-scripture verses (ScriptureVerse), NOT curated
          // content_items quotes, so they have no /verse/[id] detail target. Do not add a quote
          // onPress here — item.id is a scripture rowid, a different id space than quote uuids.
          <ScriptureCard
            text={item.text}
            reference={`${item.book} ${item.chapter}:${item.verse}`}
            languageCode={item.languageCode}
          />
        )}
      />
    );
  }

  return (
    <SafeScreen back className="px-6 pt-4">
      <Text className="mb-6 text-3xl font-bold text-text-primary">{t('search.title')}</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('search.placeholder')}
        className="mb-6 min-h-12 rounded-card border border-border bg-surface px-4 py-3 text-base text-text-primary"
      />

      {isSearching ? renderResults() : <QuoteList isPending={isPending} />}
    </SafeScreen>
  );
}
