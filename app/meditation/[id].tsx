import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { PlayerControls } from '@/components/audio';
import { useAudioStore } from '@/store/audioStore';
import { useContentStore } from '@/store/contentStore';

export default function MeditationScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const meditationInList = useContentStore((state) =>
    state.meditations.find((item) => item.id === id)
  );
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const playTrack = useAudioStore((state) => state.playTrack);

  // The player can be opened for the currently-playing track (e.g. a quote opened from the
  // PlayerBar) that isn't in contentStore.meditations — fall back to currentTrack when the id matches.
  const track = meditationInList ?? (currentTrack?.id === id ? currentTrack : undefined);

  // Start playback on open if this track has audio and isn't already the active track.
  useEffect(() => {
    if (track?.audioAssetId && currentTrack?.id !== track.id) {
      playTrack(track);
    }
  }, [track, currentTrack?.id, playTrack]);

  if (!track) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
        <Text className="text-text-secondary">{t('errors.notFound')}</Text>
        <Link href="/" replace className="text-primary">
          {t('errors.backHome')}
        </Link>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 px-6 py-10">
      <Text className="text-2xl font-bold text-text-primary">{track.title}</Text>
      <Text className="text-base text-text-secondary">{track.verseReference}</Text>

      {track.audioAssetId ? (
        <PlayerControls />
      ) : (
        <Text className="text-sm text-text-muted">{t('audio.noAudio')}</Text>
      )}
    </ScrollView>
  );
}
