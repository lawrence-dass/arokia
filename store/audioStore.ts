import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from 'react-native-track-player';
import * as Sentry from '@sentry/react-native';
import type { ContentItem } from '@/types';
import { resolveAudioUrl, downloadTrack, prefetchQueue } from '@/lib/audio';
import { logEvent } from '@/lib/analytics';
import { usePrefsStore } from '@/store/prefsStore';

// Sleep-timer handle lives at module scope (not store state) — it's not serialisable or renderable.
let sleepTimeoutId: ReturnType<typeof setTimeout> | null = null;
function clearSleepTimeout() {
  if (sleepTimeoutId) {
    clearTimeout(sleepTimeoutId);
    sleepTimeoutId = null;
  }
}

interface AudioState {
  currentTrack: ContentItem | null;
  isPlaying: boolean;
  isBuffering: boolean;
  // Runtime active speed. Initialise from prefsStore.playbackSpeed on app start (Story 4.4).
  speed: 0.75 | 1 | 1.25;
  sleepTimerMinutes: 0 | 15 | 30 | 45;
  downloadedTracks: Record<string, string>; // contentId -> localFilePath (persisted)
  // Progress of the manual "Download This Week" bulk download.
  bulkDownload: { total: number; completed: number; active: boolean };
  // Actions
  // queueIds = ordered content ids of the current browsing context, so the next 2 can be prefetched.
  playTrack: (content: ContentItem, queueIds?: string[]) => Promise<void>;
  pauseAudio: () => Promise<void>;
  resumeAudio: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  downloadWeek: (contentIds: string[]) => Promise<void>;
  // Syncs isPlaying from real RNTP playback state (e.g. flips back to false when a track ends
  // on its own). Wired to Event.PlaybackState in app/_layout.tsx.
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: AudioState['speed']) => void;
  setSleepTimer: (minutes: AudioState['sleepTimerMinutes']) => void;
  addDownload: (contentId: string, localPath: string) => void;
  clearDownloads: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      isBuffering: false,
      speed: 1,
      sleepTimerMinutes: 0,
      downloadedTracks: {},
      bulkDownload: { total: 0, completed: 0, active: false },

      playTrack: async (content, queueIds) => {
        if (!content.audioAssetId) return;
        try {
          const { downloadedTracks } = get();
          const url = downloadedTracks[content.id] ?? (await resolveAudioUrl(content.audioAssetId));
          await TrackPlayer.reset();
          await TrackPlayer.add({ id: content.id, url, title: content.title, artist: 'Arokia' });
          await TrackPlayer.play();
          // Rate resets per track, so re-apply the active playback speed after starting.
          await TrackPlayer.setRate(get().speed);
          set({ currentTrack: content, isPlaying: true });
          // Log once per fresh play (not resume). Scoped to meditations so quote plays don't over-count.
          if (content.contentType === 'meditation') logEvent('meditation_started', content.id);

          // Auto-cache the current track for offline (FR18) — streams now, caches in parallel.
          if (!downloadedTracks[content.id]) {
            downloadTrack(content.id)
              .then((uri) => get().addDownload(content.id, uri))
              .catch((e) => Sentry.captureException(e));
          }
          // Silently prefetch the next 2 tracks in the queue, recording them in the manifest.
          if (queueIds && queueIds.length) {
            const idx = queueIds.indexOf(content.id);
            const next = idx >= 0 ? queueIds.slice(idx + 1, idx + 3) : [];
            const uncached = next.filter((id) => !get().downloadedTracks[id]);
            if (uncached.length) {
              prefetchQueue(uncached)
                .then((cached) =>
                  set((state) => ({
                    downloadedTracks: { ...state.downloadedTracks, ...cached },
                  }))
                )
                .catch((e) => Sentry.captureException(e));
            }
          }
        } catch (e) {
          Sentry.captureException(e);
          console.error('[audioStore] playTrack failed:', e);
        }
      },

      downloadWeek: async (contentIds) => {
        set({ bulkDownload: { total: contentIds.length, completed: 0, active: true } });
        for (const id of contentIds) {
          try {
            if (!get().downloadedTracks[id]) {
              const uri = await downloadTrack(id);
              get().addDownload(id, uri);
            }
          } catch (e) {
            Sentry.captureException(e);
          }
          set((state) => ({
            bulkDownload: { ...state.bulkDownload, completed: state.bulkDownload.completed + 1 },
          }));
        }
        set((state) => ({ bulkDownload: { ...state.bulkDownload, active: false } }));
      },

      pauseAudio: async () => {
        try {
          await TrackPlayer.pause();
          set({ isPlaying: false });
        } catch (e) {
          Sentry.captureException(e);
          console.error('[audioStore] pauseAudio failed:', e);
        }
      },

      resumeAudio: async () => {
        const { currentTrack } = get();
        if (!currentTrack) return;
        try {
          // If the track ran to the end, restart from the top instead of resuming at the end (which
          // is a silent no-op). Centralised here so every play surface (list, mini-player, full player)
          // behaves the same.
          const { position, duration } = await TrackPlayer.getProgress();
          if (duration > 0 && position >= duration - 0.5) await TrackPlayer.seekTo(0);
          await TrackPlayer.play();
          set({ isPlaying: true });
        } catch (e) {
          Sentry.captureException(e);
          console.error('[audioStore] resumeAudio failed:', e);
        }
      },

      seekTo: async (seconds) => {
        try {
          await TrackPlayer.seekTo(seconds);
        } catch (e) {
          Sentry.captureException(e);
          console.error('[audioStore] seekTo failed:', e);
        }
      },

      setPlaying: (playing) => set({ isPlaying: playing }),

      setSpeed: (speed) => {
        set({ speed });
        // Persist the preference and apply immediately to the current track.
        usePrefsStore.getState().setPlaybackSpeed(speed);
        TrackPlayer.setRate(speed).catch((e) => {
          Sentry.captureException(e);
          console.error('[audioStore] setRate failed:', e);
        });
      },

      setSleepTimer: (minutes) => {
        clearSleepTimeout();
        set({ sleepTimerMinutes: minutes });
        if (minutes > 0) {
          sleepTimeoutId = setTimeout(
            () => {
              sleepTimeoutId = null;
              set({ sleepTimerMinutes: 0 });
              get().pauseAudio();
            },
            minutes * 60 * 1000
          );
        }
      },
      addDownload: (contentId, localPath) =>
        set((state) => ({
          downloadedTracks: { ...state.downloadedTracks, [contentId]: localPath },
        })),
      clearDownloads: () => set({ downloadedTracks: {} }),
    }),
    {
      name: 'arokia-audio-cache',
      storage: createJSONStorage(() => AsyncStorage),
      // Only the offline cache manifest persists — playback/session state stays in-memory.
      partialize: (state) => ({ downloadedTracks: state.downloadedTracks }),
    }
  )
);
