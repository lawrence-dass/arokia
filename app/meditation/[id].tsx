import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  BackgroundMusicToggle,
  BibleHandoff,
  PlayerControls,
  SleepTimer,
  SpeedControl,
} from '@/components/audio';
import { VerseText } from '@/components/scripture';
import { SafeScreen } from '@/components/shared';
import { pauseBed, startBed, stopBed } from '@/lib/backgroundMusic';
import { useAudioStore } from '@/store/audioStore';
import { useContentStore } from '@/store/contentStore';
import { usePrefsStore } from '@/store/prefsStore';

export default function MeditationScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const meditationInList = useContentStore((state) =>
    state.meditations.find((item) => item.id === id)
  );
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const playTrack = useAudioStore((state) => state.playTrack);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const backgroundMusicEnabled = usePrefsStore((state) => state.backgroundMusicEnabled);

  // The player can be opened for the currently-playing track (e.g. a quote opened from the
  // PlayerBar) that isn't in contentStore.meditations — fall back to currentTrack when the id matches.
  const track = meditationInList ?? (currentTrack?.id === id ? currentTrack : undefined);

  // Start playback on open if this track has audio and isn't already the active track.
  useEffect(() => {
    if (track?.audioAssetId && currentTrack?.id !== track.id) {
      playTrack(track);
    }
  }, [track, currentTrack?.id, playTrack]);

  // SPIKE: sync the optional soothing bed to playback — meditations only, only when enabled.
  useEffect(() => {
    if (track?.contentType === 'meditation' && isPlaying && backgroundMusicEnabled) {
      void startBed();
    } else {
      pauseBed();
    }
  }, [track?.contentType, isPlaying, backgroundMusicEnabled]);

  // Stop the bed when leaving the player so it doesn't bleed into the next screen.
  useEffect(() => () => void stopBed(), []);

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
    <SafeScreen scroll back className="px-6" contentContainerClassName="gap-6 pb-10">
      {!!track.title && <Text className="text-2xl font-bold text-text-primary">{track.title}</Text>}

      <VerseText
        text={track.scriptureText}
        reference={track.verseReference}
        languageCode={track.languageCode}
      />

      {track.audioAssetId ? (
        <>
          <PlayerControls />
          <SpeedControl />
          <SleepTimer />
          {track.contentType === 'meditation' && <BackgroundMusicToggle />}
          <BibleHandoff reference={track.verseReference} contentId={track.id} />
        </>
      ) : (
        <Text className="text-sm text-text-muted">{t('audio.noAudio')}</Text>
      )}
    </SafeScreen>
  );
}
