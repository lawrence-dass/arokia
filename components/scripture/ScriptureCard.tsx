import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { colors } from '@/constants/colors';
import { VerseText } from './VerseText';

interface ScriptureCardProps {
  text: string;
  reference: string;
  languageCode: string;
  onPress?: () => void;
  // Audio (optional): when hasAudio, a play/pause button shows on the card and toggles playback.
  hasAudio?: boolean;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
}

export function ScriptureCard({
  text,
  reference,
  languageCode,
  onPress,
  hasAudio,
  isPlaying,
  onPlayToggle,
}: ScriptureCardProps) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className="flex-row items-center gap-3 rounded-card border border-border-light bg-surface p-4">
      <View className="flex-1">
        <VerseText text={text} reference={reference} languageCode={languageCode} />
      </View>
      {hasAudio && (
        <Pressable
          onPress={onPlayToggle}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t(isPlaying ? 'audio.pause' : 'audio.play')}
          className="h-11 w-11 items-center justify-center rounded-full bg-secondary/10">
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={22} color={colors.secondary} />
        </Pressable>
      )}
    </Pressable>
  );
}
