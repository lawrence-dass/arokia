import { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';

import { QuoteList, ScriptureCard } from '@/components/scripture';
import { searchContent } from '@/lib/content';
import { useQuotesFetch } from '@/store/contentStore';
import type { ScriptureVerse } from '@/types';

export default function SearchScreen() {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const { isPending } = useQuotesFetch('ta');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ScriptureVerse[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    // Clear stale results immediately so a fast retype never shows matches for the previous
    // query while the new one is still resolving.
    setResults([]);
    let cancelled = false;
    searchContent(db, 'ta', query).then((matches) => {
      if (!cancelled) setResults(matches);
    });
    return () => {
      cancelled = true;
    };
  }, [db, query]);

  const isSearching = query.trim().length > 0;

  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Text className="mb-6 text-3xl font-bold text-text-primary">{t('search.title')}</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('search.placeholder')}
        className="mb-6 min-h-12 rounded-card border border-border bg-surface px-4 py-3 text-base text-text-primary"
      />

      {isSearching ? (
        results.length === 0 ? (
          <Text className="text-base text-text-secondary">{t('search.empty')}</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => String(item.id)}
            contentContainerClassName="gap-4 pb-10"
            renderItem={({ item }) => (
              <ScriptureCard
                text={item.text}
                reference={`${item.book} ${item.chapter}:${item.verse}`}
                languageCode={item.languageCode}
              />
            )}
          />
        )
      ) : (
        <QuoteList isPending={isPending} />
      )}
    </View>
  );
}
