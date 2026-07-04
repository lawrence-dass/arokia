import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ScriptureCard } from '@/components/scripture';
import { useContentStore } from '@/store/contentStore';

export default function WordScreen() {
  const { t } = useTranslation();
  const quotes = useContentStore((state) => state.quotes);
  const isLoading = useContentStore((state) => state.isLoading);
  const error = useContentStore((state) => state.error);
  const fetchQuotes = useContentStore((state) => state.fetchQuotes);
  // `isLoading` starts false until the effect below fires, so without this flag the empty
  // state would flash for one frame before the fetch actually begins.
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    fetchQuotes('ta').finally(() => setHasFetched(true));
  }, [fetchQuotes]);

  const isPending = isLoading || !hasFetched;

  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Text className="mb-6 text-3xl font-bold text-text-primary">{t('word.title')}</Text>

      {isPending && <Text className="text-base text-text-secondary">{t('word.loading')}</Text>}

      {!isPending && error && <Text className="text-base text-error">{t(error)}</Text>}

      {!isPending && !error && quotes.length === 0 && (
        <Text className="text-base text-text-secondary">{t('word.empty')}</Text>
      )}

      {!isPending && !error && quotes.length > 0 && (
        <FlatList
          data={quotes}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-4 pb-10"
          renderItem={({ item }) => (
            <ScriptureCard
              text={item.scriptureText}
              reference={item.verseReference}
              languageCode={item.languageCode}
              onPress={() => router.push(`/verse/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}
