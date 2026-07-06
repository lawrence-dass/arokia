import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { MoodTag } from '@/types';

const MOODS: Exclude<MoodTag, 'none'>[] = ['anxious', 'grieving', 'angry', 'lonely', 'tempted'];

interface MoodFilterProps {
  selected: MoodTag | null;
  onSelect: (mood: MoodTag | null) => void;
}

export function MoodFilter({ selected, onSelect }: MoodFilterProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row flex-wrap gap-2">
      {MOODS.map((mood) => {
        const isActive = selected === mood;
        return (
          <Pressable
            key={mood}
            onPress={() => onSelect(isActive ? null : mood)}
            accessibilityRole="button"
            className={`min-h-12 items-center justify-center rounded-pill px-4 py-2 ${
              isActive ? 'bg-primary' : 'border border-border bg-transparent'
            }`}>
            <Text
              className={`text-sm font-semibold ${
                isActive ? 'text-text-on-primary' : 'text-text-primary'
              }`}>
              {t(`mood.${mood}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
