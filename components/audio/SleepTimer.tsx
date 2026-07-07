import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAudioStore } from '@/store/audioStore';

const OPTIONS = [15, 30, 45] as const;

export function SleepTimer() {
  const { t } = useTranslation();
  const sleepTimerMinutes = useAudioStore((s) => s.sleepTimerMinutes);
  const setSleepTimer = useAudioStore((s) => s.setSleepTimer);

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-text-secondary">{t('audio.sleepTimer')}</Text>
      <View className="flex-row gap-2">
        {OPTIONS.map((minutes) => {
          const active = sleepTimerMinutes === minutes;
          return (
            <Pressable
              key={minutes}
              // Tapping the active value clears the timer.
              onPress={() => setSleepTimer(active ? 0 : minutes)}
              accessibilityRole="button"
              className={`min-h-12 flex-1 items-center justify-center rounded-pill px-3 py-2 ${
                active ? 'bg-primary' : 'border border-border bg-transparent'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  active ? 'text-text-on-primary' : 'text-text-primary'
                }`}>
                {t('audio.sleepMinutes', { count: minutes })}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
