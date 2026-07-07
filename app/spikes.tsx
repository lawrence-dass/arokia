import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TrackPlayer from 'react-native-track-player';
import * as Sentry from '@sentry/react-native';

import { getFirstAudioTrack } from '@/lib/content';
import { downloadTrack } from '@/lib/audio';
import { useAudioStore } from '@/store/audioStore';
import type { ContentItem } from '@/types';

type OfflineState = 'idle' | 'downloading' | 'ready';

export default function SpikesScreen() {
  const { t } = useTranslation();

  const [track, setTrack] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState<OfflineState>('idle');
  const [localUri, setLocalUri] = useState<string | null>(null);

  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const playTrack = useAudioStore((s) => s.playTrack);
  const pauseAudio = useAudioStore((s) => s.pauseAudio);
  const resumeAudio = useAudioStore((s) => s.resumeAudio);

  useEffect(() => {
    (async () => {
      try {
        setTrack(await getFirstAudioTrack());
      } catch {
        setError(t('spikes.audio.error'));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  const isThisPlaying = !!track && currentTrack?.id === track.id && isPlaying;

  const onPlayToggle = async () => {
    if (!track) return;
    setError(null);
    try {
      if (isThisPlaying) await pauseAudio();
      else if (currentTrack?.id === track.id) await resumeAudio();
      else await playTrack(track);
    } catch {
      setError(t('spikes.audio.error'));
    }
  };

  const onDownload = async () => {
    if (!track) return;
    setError(null);
    setOffline('downloading');
    try {
      setLocalUri(await downloadTrack(track.id));
      setOffline('ready');
    } catch (e) {
      Sentry.captureException(e);
      setError(t('spikes.audio.error'));
      setOffline('idle');
    }
  };

  // Plays the cached local file directly (bypasses Supabase) so it works in airplane mode.
  const onPlayOffline = async () => {
    if (!track || !localUri) return;
    setError(null);
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({ id: track.id, url: localUri, title: track.title, artist: 'Arokia' });
      await TrackPlayer.play();
    } catch (e) {
      Sentry.captureException(e);
      setError(t('spikes.audio.error'));
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="items-center px-5 py-10">
      <View className="w-full max-w-[360px] gap-6">
        <View>
          <Text className="text-sm font-semibold uppercase text-text-muted">
            {t('spikes.routeLabel')}
          </Text>
          <Text className="mt-2 text-3xl font-bold text-text-primary">{t('spikes.title')}</Text>
          <Text className="mt-3 text-base leading-7 text-text-secondary">
            {t('spikes.subtitle')}
          </Text>
        </View>

        <View className="rounded-lg border border-border bg-surface p-4">
          <Text className="text-sm font-semibold text-text-secondary">
            {t('spikes.tamilRendering.title')}
          </Text>
          <View className="bg-surfaceWarm mt-4 w-[320px] max-w-full rounded-lg p-4">
            <Text className="text-2xl leading-10 text-text-primary" testID="spike-tamil-phrase">
              {t('spikes.tamilRendering.phrase')}
            </Text>
          </View>
          <Text className="mt-4 text-sm leading-6 text-text-secondary">
            {t('spikes.tamilRendering.instruction')}
          </Text>
        </View>

        {/* SPIKE 1.6/1.7 — RNTP background, lockscreen & offline cache validation harness */}
        <View className="rounded-lg border border-border bg-surface p-4">
          <Text className="text-sm font-semibold text-text-secondary">
            {t('spikes.audio.title')}
          </Text>

          {loading ? (
            <Text className="mt-3 text-sm text-text-secondary">{t('spikes.audio.loading')}</Text>
          ) : !track ? (
            <Text className="mt-3 text-sm text-text-secondary">{t('spikes.audio.noTrack')}</Text>
          ) : (
            <View className="mt-3 gap-3">
              <Text className="text-sm text-text-secondary">
                {t('spikes.audio.track', { title: track.title })}
              </Text>
              <Text className="text-sm text-text-muted">
                {t(
                  isThisPlaying
                    ? 'spikes.audio.statusPlaying'
                    : currentTrack?.id === track.id
                      ? 'spikes.audio.statusPaused'
                      : 'spikes.audio.statusIdle'
                )}
              </Text>

              <Pressable
                onPress={onPlayToggle}
                accessibilityRole="button"
                className="min-h-12 items-center justify-center rounded-pill bg-primary px-4 py-2">
                <Text className="text-sm font-semibold text-text-on-primary">
                  {t(isThisPlaying ? 'spikes.audio.pause' : 'spikes.audio.play')}
                </Text>
              </Pressable>

              <Text className="text-xs leading-5 text-text-muted">
                {t('spikes.audio.instruction')}
              </Text>

              <View className="mt-2 h-px bg-border" />

              <Pressable
                onPress={onDownload}
                disabled={offline === 'downloading'}
                accessibilityRole="button"
                className="min-h-12 items-center justify-center rounded-pill border border-border px-4 py-2">
                <Text className="text-sm font-semibold text-text-primary">
                  {t(
                    offline === 'downloading'
                      ? 'spikes.audio.downloading'
                      : offline === 'ready'
                        ? 'spikes.audio.downloaded'
                        : 'spikes.audio.downloadOffline'
                  )}
                </Text>
              </Pressable>

              {offline === 'ready' && (
                <>
                  <Pressable
                    onPress={onPlayOffline}
                    accessibilityRole="button"
                    className="min-h-12 items-center justify-center rounded-pill bg-secondary px-4 py-2">
                    <Text className="text-sm font-semibold text-text-on-primary">
                      {t('spikes.audio.playOffline')}
                    </Text>
                  </Pressable>
                  <Text className="text-xs leading-5 text-text-muted">
                    {t('spikes.audio.offlineInstruction')}
                  </Text>
                </>
              )}
            </View>
          )}

          {error && <Text className="mt-3 text-sm text-error">{error}</Text>}
        </View>

        <View className="rounded-lg border border-border bg-surface p-4">
          <Text className="text-sm font-semibold text-text-secondary">
            {t('spikes.deviceChecklist.title')}
          </Text>
          <View className="mt-3 gap-2">
            <Text className="text-sm leading-6 text-text-secondary">
              {t('spikes.deviceChecklist.ios')}
            </Text>
            <Text className="text-sm leading-6 text-text-secondary">
              {t('spikes.deviceChecklist.android')}
            </Text>
            <Text className="text-sm leading-6 text-text-secondary">
              {t('spikes.deviceChecklist.record')}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
