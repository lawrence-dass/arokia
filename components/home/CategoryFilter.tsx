import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CategoryTag, PracticePath } from '@/types';

// The second filter axis is path-specific: emotional states only make sense for Mind. Body and Soul
// each browse by their own categories. This is the single source of truth for which chips a path
// shows; the values are stored in `content_items.mood_tag` (DB constraint widens at Story 4-6).
export const CATEGORIES_BY_PATH: Record<PracticePath, CategoryTag[]> = {
  mind: ['anxious', 'grieving', 'angry', 'lonely', 'tempted'],
  body: ['rest', 'movement', 'breathwork', 'sleep'],
  soul: ['prayer', 'lectio', 'silence', 'communion'],
};

interface CategoryFilterProps {
  practicePath: PracticePath;
  selected: CategoryTag | null;
  onSelect: (category: CategoryTag | null) => void;
}

export function CategoryFilter({ practicePath, selected, onSelect }: CategoryFilterProps) {
  const { t } = useTranslation();
  // `?? []` guards against a malformed practicePath (e.g. a deep link `/walk?practicePath=foo`),
  // which arrives as a raw string despite the PracticePath type — indexing would otherwise crash.
  const categories = CATEGORIES_BY_PATH[practicePath] ?? [];

  return (
    <View className="flex-row flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = selected === category;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(isActive ? null : category)}
            accessibilityRole="button"
            className={`min-h-12 items-center justify-center rounded-pill px-4 py-2 ${
              isActive ? 'bg-primary' : 'border border-border bg-transparent'
            }`}>
            <Text
              className={`text-sm font-semibold ${
                isActive ? 'text-text-on-primary' : 'text-text-primary'
              }`}>
              {t(`category.${category}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
