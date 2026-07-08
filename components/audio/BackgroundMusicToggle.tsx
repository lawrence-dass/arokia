import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { colors } from '@/constants/colors';
import { usePrefsStore } from '@/store/prefsStore';

// Toggles the optional soothing background bed under a meditation (spike). Icon reflects state;
// the player screen watches `backgroundMusicEnabled` and starts/stops the bed in sync with playback.
export function BackgroundMusicToggle() {
  const { t } = useTranslation();
  const enabled = usePrefsStore((state) => state.backgroundMusicEnabled);
  const setEnabled = usePrefsStore((state) => state.setBackgroundMusicEnabled);

  return (
    <Pressable
      onPress={() => setEnabled(!enabled)}
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={t('audio.backgroundMusic')}
      className="flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-4 py-2">
      <Ionicons
        name={enabled ? 'musical-notes' : 'musical-notes-outline'}
        size={20}
        color={enabled ? colors.secondary : colors.textMuted}
      />
      <Text className={enabled ? 'text-base text-text-primary' : 'text-base text-text-muted'}>
        {t('audio.backgroundMusic')}
      </Text>
    </Pressable>
  );
}
