import { ScrollView, Share, Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { VerseText } from '@/components/scripture';
import { Button } from '@/components/shared';
import { useAudioStore } from '@/store/audioStore';
import { useContentStore } from '@/store/contentStore';

export default function VerseScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const quote = useContentStore((state) => state.quotes.find((item) => item.id === id));
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const playTrack = useAudioStore((state) => state.playTrack);
  const pauseAudio = useAudioStore((state) => state.pauseAudio);

  if (!quote) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
        <Text className="text-text-secondary">{t('errors.notFound')}</Text>
        <Link href="/word" replace className="text-primary">
          {t('errors.backHome')}
        </Link>
      </View>
    );
  }

  const isThisPlaying = isPlaying && currentTrack?.id === quote.id;

  const handlePlayToggle = () => {
    if (isThisPlaying) {
      pauseAudio();
    } else {
      playTrack(quote);
    }
  };

  const handleShare = () => {
    Share.share({ message: `${quote.scriptureText}\n\n— ${quote.verseReference}\n\nArokia` });
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-8 px-6 py-10">
      <VerseText
        text={quote.scriptureText}
        reference={quote.verseReference}
        languageCode={quote.languageCode}
      />

      <View className="flex-row gap-4">
        {quote.audioAssetId && (
          <Button
            label={t(isThisPlaying ? 'audio.pause' : 'audio.play')}
            onPress={handlePlayToggle}
          />
        )}
        <Button label={t('word.shareCta')} onPress={handleShare} variant="secondary" />
      </View>
    </ScrollView>
  );
}
