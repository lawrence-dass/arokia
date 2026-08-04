import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useContentLanguage, useMeditationsFetch } from '@/store/contentStore';
import type { PracticePath, TimeOfDay } from '@/types';

interface TriuneGridProps {
  timeFilter: TimeOfDay;
}

const TILES: { practicePath: PracticePath; emoji: string; labelKey: string }[] = [
  { practicePath: 'mind', emoji: '🧠', labelKey: 'home.mind' },
  { practicePath: 'body', emoji: '💪', labelKey: 'home.body' },
  { practicePath: 'soul', emoji: '🕊️', labelKey: 'home.soul' },
];

export function TriuneGrid({ timeFilter }: TriuneGridProps) {
  const { t } = useTranslation();
  // Unfiltered-by-path fetch — needed so the Soul tile can check for an available Soul
  // meditation to jump straight to (see app/(tabs)/index.tsx's Scope Note on "today's featured").
  const { meditations } = useMeditationsFetch(
    useContentLanguage(),
    undefined,
    undefined,
    timeFilter
  );

  const handlePress = (practicePath: PracticePath) => {
    if (practicePath === 'soul') {
      const featured = meditations.find((item) => item.practicePath === 'soul');
      if (featured) {
        router.push(`/meditation/${featured.id}`);
        return;
      }
    }
    router.push({ pathname: '/walk', params: { practicePath } });
  };

  return (
    <View className="flex-row gap-4">
      {TILES.map((tile) => (
        <Pressable
          key={tile.practicePath}
          onPress={() => handlePress(tile.practicePath)}
          accessibilityRole="button"
          className="min-h-12 flex-1 items-center justify-center gap-2 rounded-card bg-surface p-6">
          <Text className="text-3xl">{tile.emoji}</Text>
          <Text className="text-base font-semibold text-text-primary">{t(tile.labelKey)}</Text>
        </Pressable>
      ))}
    </View>
  );
}
