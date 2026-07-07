import { FlatList, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ScriptureCard } from './ScriptureCard';
import { useContentStore } from '@/store/contentStore';
import { useAudioStore } from '@/store/audioStore';

interface QuoteListProps {
  isPending: boolean;
}

// Renders the curated quotes list (loading/error/empty/list), shared by app/word.tsx and
// app/search.tsx's empty-query baseline state — both read from the same useContentStore data.
export function QuoteList({ isPending }: QuoteListProps) {
  const { t } = useTranslation();
  const quotes = useContentStore((state) => state.quotes);
  const error = useContentStore((state) => state.error);
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const playTrack = useAudioStore((state) => state.playTrack);
  const pauseAudio = useAudioStore((state) => state.pauseAudio);
  const resumeAudio = useAudioStore((state) => state.resumeAudio);

  if (isPending) {
    return <Text className="text-base text-text-secondary">{t('word.loading')}</Text>;
  }

  // Cached quotes win over a transient error — e.g. a redundant background re-fetch failing
  // shouldn't blank out a list that already loaded successfully.
  if (quotes.length > 0) {
    return (
      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4 pb-10"
        renderItem={({ item }) => {
          const isCurrent = currentTrack?.id === item.id;
          const isThisPlaying = isPlaying && isCurrent;
          return (
            <ScriptureCard
              text={item.scriptureText}
              reference={item.verseReference}
              languageCode={item.languageCode}
              onPress={() => router.push(`/verse/${item.id}`)}
              hasAudio={!!item.audioAssetId}
              isPlaying={isThisPlaying}
              onPlayToggle={() => {
                if (isThisPlaying) pauseAudio();
                else if (isCurrent) resumeAudio();
                else playTrack(item);
              }}
            />
          );
        }}
      />
    );
  }

  if (error) {
    return <Text className="text-base text-error">{t(error)}</Text>;
  }

  return <Text className="text-base text-text-secondary">{t('word.empty')}</Text>;
}
