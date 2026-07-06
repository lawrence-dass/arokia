import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { MoodFilter } from '@/components/home';
import { useContentStore, useMeditationsFetch } from '@/store/contentStore';
import type { MoodTag, PracticePath } from '@/types';

export default function WalkScreen() {
  const { t } = useTranslation();
  const { practicePath } = useLocalSearchParams<{ practicePath?: PracticePath }>();
  const [moodTag, setMoodTag] = useState<MoodTag | null>(null);

  const { isPending } = useMeditationsFetch('ta', practicePath, moodTag ?? undefined, 'any');
  const meditations = useContentStore((state) => state.meditations);
  const error = useContentStore((state) => state.error);

  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Text className="mb-4 text-3xl font-bold text-text-primary">{t('walk.title')}</Text>
      <MoodFilter selected={moodTag} onSelect={setMoodTag} />

      <View className="mt-4 flex-1">
        {isPending ? (
          <Text className="text-base text-text-secondary">{t('walk.loading')}</Text>
        ) : meditations.length > 0 ? (
          <FlatList
            data={meditations}
            keyExtractor={(item) => item.id}
            contentContainerClassName="gap-4 pb-10"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/meditation/${item.id}`)}
                accessibilityRole="button"
                className="rounded-card border border-border-light bg-surface p-4">
                <Text className="text-lg font-semibold text-text-primary">{item.title}</Text>
                {item.moodTag !== 'none' && (
                  <Text className="text-sm text-text-secondary">{t(`mood.${item.moodTag}`)}</Text>
                )}
              </Pressable>
            )}
          />
        ) : error ? (
          <Text className="text-base text-error">{t(error)}</Text>
        ) : (
          <Text className="text-base text-text-secondary">{t('walk.empty')}</Text>
        )}
      </View>
    </View>
  );
}
