import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react-native';

import { colors } from '@/constants/colors';
import { getDownloadableTracks } from '@/lib/content';
import { useAudioStore } from '@/store/audioStore';
import type { ContentItem } from '@/types';

// Rough per-track estimate (64 kbps mono AAC, ~7 min). Refine once 4-6 sets real durations.
const MB_PER_TRACK = 3.3;

/**
 * Manual "Download This Week" control (FR19): shows the estimated size, downloads all published
 * audio tracks with progress, and confirms offline availability. Placed on the meditation library.
 */
export function OfflineDownloadCard() {
  const { t } = useTranslation();
  const [tracks, setTracks] = useState<ContentItem[] | null>(null);
  const downloadedTracks = useAudioStore((s) => s.downloadedTracks);
  const bulkDownload = useAudioStore((s) => s.bulkDownload);
  const downloadWeek = useAudioStore((s) => s.downloadWeek);

  useEffect(() => {
    getDownloadableTracks()
      .then(setTracks)
      .catch((e) => {
        Sentry.captureException(e);
        setTracks([]);
      });
  }, []);

  if (!tracks || tracks.length === 0) return null;

  const ids = tracks.map((track) => track.id);
  const allCached = ids.every((id) => downloadedTracks[id]);
  const estMb = Math.max(1, Math.round(tracks.length * MB_PER_TRACK));

  return (
    <View className="gap-2 rounded-card border border-border-light bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <Ionicons name="cloud-download-outline" size={20} color={colors.tertiary} />
        <Text className="text-base font-semibold text-text-primary">{t('offline.title')}</Text>
      </View>

      {bulkDownload.active ? (
        <Text className="text-sm text-text-secondary">
          {t('offline.downloading', {
            completed: bulkDownload.completed,
            total: bulkDownload.total,
          })}
        </Text>
      ) : allCached ? (
        <Text className="text-sm font-semibold text-tertiary">{t('offline.available')}</Text>
      ) : (
        <Pressable
          onPress={() => downloadWeek(ids)}
          accessibilityRole="button"
          className="min-h-12 items-center justify-center rounded-pill bg-primary px-4 py-2">
          <Text className="text-sm font-semibold text-text-on-primary">
            {t('offline.downloadWeek', { size: estMb })}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
