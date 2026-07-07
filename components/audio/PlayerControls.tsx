import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { colors } from '@/constants/colors';
import { useAudioProgress } from '@/lib/audio';
import { useAudioStore } from '@/store/audioStore';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Full-player transport: play/pause + a tap-to-seek progress bar.
 * Reads live position/duration from RNTP's useProgress (~1 Hz) — keep this scoped to the
 * player screen so the 1 Hz re-render never touches the tab layout.
 */
export function PlayerControls() {
  const { t } = useTranslation();
  const { position, duration } = useAudioProgress(500);
  const [trackWidth, setTrackWidth] = useState(0);

  const isPlaying = useAudioStore((s) => s.isPlaying);
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const pauseAudio = useAudioStore((s) => s.pauseAudio);
  const resumeAudio = useAudioStore((s) => s.resumeAudio);
  const seekTo = useAudioStore((s) => s.seekTo);

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  const onTrackLayout = (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width);

  const onSeekPress = (e: { nativeEvent: { locationX: number } }) => {
    if (duration <= 0 || trackWidth <= 0) return;
    const ratio = Math.min(Math.max(e.nativeEvent.locationX / trackWidth, 0), 1);
    seekTo(ratio * duration);
  };

  const onPlayToggle = () => {
    if (isPlaying) pauseAudio();
    else if (currentTrack) resumeAudio(); // resumeAudio restarts from 0 if the track has ended
  };

  return (
    <View className="gap-3">
      <Pressable
        onLayout={onTrackLayout}
        onPress={onSeekPress}
        accessibilityRole="adjustable"
        accessibilityLabel={t('audio.seek')}
        hitSlop={12}
        className="h-2 justify-center rounded-pill bg-border">
        <View className="h-2 rounded-pill bg-secondary" style={{ width: `${progress * 100}%` }} />
      </Pressable>

      <View className="flex-row justify-between">
        <Text className="text-xs text-text-muted">{formatTime(position)}</Text>
        <Text className="text-xs text-text-muted">{formatTime(duration)}</Text>
      </View>

      <Pressable
        onPress={onPlayToggle}
        accessibilityRole="button"
        accessibilityLabel={t(isPlaying ? 'audio.pause' : 'audio.play')}
        className="h-14 w-14 items-center justify-center self-center rounded-full bg-secondary">
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color={colors.surface} />
      </Pressable>
    </View>
  );
}
