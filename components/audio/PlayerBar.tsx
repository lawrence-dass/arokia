import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useProgress } from 'react-native-track-player';

import { colors } from '@/constants/colors';
import { useAudioStore } from '@/store/audioStore';

/**
 * Persistent mini-player rendered above the tab bar (mounted in app/(tabs)/_layout.tsx).
 * Renders nothing when no track is loaded. Tapping the bar opens the full player.
 * useProgress here re-renders only this component (~1 Hz), never the tab layout above it.
 */
export function PlayerBar() {
  const { t } = useTranslation();
  const { position, duration } = useProgress(1000);
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const pauseAudio = useAudioStore((s) => s.pauseAudio);
  const resumeAudio = useAudioStore((s) => s.resumeAudio);

  if (!currentTrack) return null;

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  const onPlayToggle = () => {
    if (isPlaying) pauseAudio();
    else resumeAudio(); // resumeAudio restarts from 0 if the track has ended
  };

  return (
    <View className="border-t border-border-light bg-surface">
      {/* Thin progress line across the top of the bar. */}
      <View className="h-0.5 bg-border">
        <View className="h-0.5 bg-secondary" style={{ width: `${progress * 100}%` }} />
      </View>

      <Pressable
        onPress={() => router.push(`/meditation/${currentTrack.id}`)}
        accessibilityRole="button"
        accessibilityLabel={t('audio.miniPlayerLabel')}
        className="flex-row items-center gap-3 px-4 py-3">
        <Ionicons name="musical-notes" size={20} color={colors.secondary} />
        <Text numberOfLines={1} className="flex-1 text-base font-semibold text-text-primary">
          {currentTrack.title}
        </Text>
        <Pressable
          onPress={onPlayToggle}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t(isPlaying ? 'audio.pause' : 'audio.play')}
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={22} color={colors.secondary} />
        </Pressable>
      </Pressable>
    </View>
  );
}
