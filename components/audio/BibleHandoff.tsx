import { Linking, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { colors } from '@/constants/colors';
import { useAudioProgress } from '@/lib/audio';
import { logEvent } from '@/lib/analytics';
import { buildBibleUrl } from '@/lib/bible';

interface BibleHandoffProps {
  reference: string;
  contentId: string;
}

/**
 * FR14 hand-off: once the track has finished, offer a link to the full passage in an external Tamil
 * Bible. Tapping logs scripture_link_opened and leaves Arokia (no framing/interception).
 */
export function BibleHandoff({ reference, contentId }: BibleHandoffProps) {
  const { t } = useTranslation();
  const { position, duration } = useAudioProgress(1000);
  const ended = duration > 0 && position >= duration - 0.5;

  if (!ended) return null;

  const onPress = () => {
    logEvent('scripture_link_opened', contentId);
    Linking.openURL(buildBibleUrl(reference));
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      className="flex-row items-center gap-2 rounded-card border border-border-light bg-surface p-4">
      <Ionicons name="book-outline" size={20} color={colors.tertiary} />
      <Text className="flex-1 text-base font-semibold text-text-primary">
        {t('audio.readFullPassage')}
      </Text>
      <Text className="text-sm text-text-secondary">{reference}</Text>
    </Pressable>
  );
}
