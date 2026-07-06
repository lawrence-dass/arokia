import { ScrollView, Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/shared';
import { useAudioStore } from '@/store/audioStore';
import { useContentStore } from '@/store/contentStore';

export default function MeditationScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const meditation = useContentStore((state) => state.meditations.find((item) => item.id === id));
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const playTrack = useAudioStore((state) => state.playTrack);
  const pauseAudio = useAudioStore((state) => state.pauseAudio);

  if (!meditation) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
        <Text className="text-text-secondary">{t('errors.notFound')}</Text>
        <Link href="/" replace className="text-primary">
          {t('errors.backHome')}
        </Link>
      </View>
    );
  }

  const isThisPlaying = isPlaying && currentTrack?.id === meditation.id;

  const handlePlayToggle = () => {
    if (isThisPlaying) {
      pauseAudio();
    } else {
      playTrack(meditation);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 px-6 py-10">
      <Text className="text-2xl font-bold text-text-primary">{meditation.title}</Text>
      <Text className="text-base text-text-secondary">{meditation.verseReference}</Text>

      {meditation.audioAssetId && (
        <Button
          label={t(isThisPlaying ? 'audio.pause' : 'audio.play')}
          onPress={handlePlayToggle}
        />
      )}
    </ScrollView>
  );
}
