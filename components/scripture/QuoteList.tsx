import { FlatList, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ScriptureCard } from './ScriptureCard';
import { useContentStore } from '@/store/contentStore';

interface QuoteListProps {
  isPending: boolean;
}

// Renders the curated quotes list (loading/error/empty/list), shared by app/word.tsx and
// app/search.tsx's empty-query baseline state — both read from the same useContentStore data.
export function QuoteList({ isPending }: QuoteListProps) {
  const { t } = useTranslation();
  const quotes = useContentStore((state) => state.quotes);
  const error = useContentStore((state) => state.error);

  if (isPending) {
    return <Text className="text-base text-text-secondary">{t('word.loading')}</Text>;
  }

  if (error) {
    return <Text className="text-base text-error">{t(error)}</Text>;
  }

  if (quotes.length === 0) {
    return <Text className="text-base text-text-secondary">{t('word.empty')}</Text>;
  }

  return (
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
  );
}
