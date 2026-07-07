import { Share, Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { VerseText } from '@/components/scripture';
import { Button, SafeScreen } from '@/components/shared';
import { useAudioStore } from '@/store/audioStore';
import { useContentStore, useQuotesFetch } from '@/store/contentStore';

export default function VerseScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  // Self-hydrate the quotes store so a deep link or cold start straight to /verse/[id] works even
  // when neither /word nor /search has triggered the fetch yet.
  const { isPending } = useQuotesFetch('ta');
  const quote = useContentStore((state) => state.quotes.find((item) => item.id === id));
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const playTrack = useAudioStore((state) => state.playTrack);
  const pauseAudio = useAudioStore((state) => state.pauseAudio);
  const resumeAudio = useAudioStore((state) => state.resumeAudio);

  if (isPending) {
    return (
      <SafeScreen back className="items-center justify-center px-6">
        <Text className="text-text-secondary">{t('word.loading')}</Text>
      </SafeScreen>
    );
  }

  if (!quote) {
    return (
      <SafeScreen back className="items-center justify-center gap-4 px-6">
        <Text className="text-text-secondary">{t('errors.notFound')}</Text>
        <Link href="/word" replace className="text-primary">
          {t('errors.backHome')}
        </Link>
      </SafeScreen>
    );
  }

  const isCurrent = currentTrack?.id === quote.id;
  const isThisPlaying = isPlaying && isCurrent;

  const handlePlayToggle = () => {
    if (isThisPlaying) {
      pauseAudio();
    } else if (isCurrent) {
      // Same track, currently paused — resume from position rather than reset + restart from 0.
      resumeAudio();
    } else {
      playTrack(quote);
    }
  };

  const handleShare = () => {
    Share.share({ message: `${quote.scriptureText}\n\n— ${quote.verseReference}\n\nArokia` });
  };

  return (
    <SafeScreen scroll back contentContainerClassName="gap-8 px-6 pb-10 pt-4">
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
    </SafeScreen>
  );
}
