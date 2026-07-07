import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAudioStore } from '@/store/audioStore';

const OPTIONS = [0.75, 1, 1.25] as const;

export function SpeedControl() {
  const { t } = useTranslation();
  const speed = useAudioStore((s) => s.speed);
  const setSpeed = useAudioStore((s) => s.setSpeed);

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-text-secondary">{t('audio.speed')}</Text>
      <View className="flex-row gap-2">
        {OPTIONS.map((option) => {
          const active = speed === option;
          return (
            <Pressable
              key={option}
              onPress={() => setSpeed(option)}
              accessibilityRole="button"
              className={`min-h-12 flex-1 items-center justify-center rounded-pill px-3 py-2 ${
                active ? 'bg-primary' : 'border border-border bg-transparent'
              }`}>
              {/* Numeric speed multiplier — a locale-neutral value label, not translatable prose. */}
              <Text
                className={`text-sm font-semibold ${
                  active ? 'text-text-on-primary' : 'text-text-primary'
                }`}>
                {option}×
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
