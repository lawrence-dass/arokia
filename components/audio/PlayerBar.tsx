import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { colors } from '@/constants/colors';
import { useAudioStore } from '@/store/audioStore';

/**
 * Persistent mini-player rendered above the tab bar (mounted in app/(tabs)/_layout.tsx).
 * Renders nothing when no track is loaded. Tapping the bar opens the full player.
 * Subscribes only to currentTrack/isPlaying — no useProgress here, so it never re-renders at 1 Hz.
 */
export function PlayerBar() {
  const { t } = useTranslation();
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const pauseAudio = useAudioStore((s) => s.pauseAudio);
  const resumeAudio = useAudioStore((s) => s.resumeAudio);

  if (!currentTrack) return null;

  return (
    <Pressable
      onPress={() => router.push(`/meditation/${currentTrack.id}`)}
      accessibilityRole="button"
      accessibilityLabel={t('audio.miniPlayerLabel')}
      className="flex-row items-center gap-3 border-t border-border-light bg-surface px-4 py-3">
      <Ionicons name="musical-notes" size={20} color={colors.secondary} />
      <Text numberOfLines={1} className="flex-1 text-base font-semibold text-text-primary">
        {currentTrack.title}
      </Text>
      <Pressable
        onPress={() => (isPlaying ? pauseAudio() : resumeAudio())}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={t(isPlaying ? 'audio.pause' : 'audio.play')}
        className="h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={22} color={colors.secondary} />
      </Pressable>
    </Pressable>
  );
}
