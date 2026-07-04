import { useEffect } from 'react';
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

  useEffect(() => {
    fetchQuotes('ta');
  }, [fetchQuotes]);

  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Text className="mb-6 text-3xl font-bold text-text-primary">{t('word.title')}</Text>

      {isLoading && <Text className="text-base text-text-secondary">{t('word.loading')}</Text>}

      {!isLoading && error && <Text className="text-base text-error">{t(error)}</Text>}

      {!isLoading && !error && quotes.length === 0 && (
        <Text className="text-base text-text-secondary">{t('word.empty')}</Text>
      )}

      {!isLoading && !error && quotes.length > 0 && (
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
