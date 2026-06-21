import { create } from 'zustand';
import TrackPlayer from 'react-native-track-player';
import * as Sentry from '@sentry/react-native';
import type { ContentItem } from '@/types';
import { resolveAudioUrl } from '@/lib/audio';

interface AudioState {
  currentTrack: ContentItem | null;
  isPlaying: boolean;
  isBuffering: boolean;
  // Runtime active speed. Initialise from prefsStore.playbackSpeed on app start (Story 4.4).
  speed: 0.75 | 1 | 1.25;
  sleepTimerMinutes: 0 | 15 | 30 | 45;
  downloadedTracks: Record<string, string>; // contentId -> localFilePath
  // Actions
  playTrack: (content: ContentItem) => Promise<void>;
  pauseAudio: () => Promise<void>;
  resumeAudio: () => Promise<void>;
  setSpeed: (speed: AudioState['speed']) => void;
  setSleepTimer: (minutes: AudioState['sleepTimerMinutes']) => void;
  addDownload: (contentId: string, localPath: string) => void;
  clearDownloads: () => void;
}

export const useAudioStore = create<AudioState>()((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  isBuffering: false,
  speed: 1,
  sleepTimerMinutes: 0,
  downloadedTracks: {},

  playTrack: async (content) => {
    if (!content.audioAssetId) return;
    try {
      const { downloadedTracks } = get();
      const url = downloadedTracks[content.id] ?? (await resolveAudioUrl(content.audioAssetId));
      await TrackPlayer.reset();
      await TrackPlayer.add({ id: content.id, url, title: content.title, artist: 'Arokia' });
      await TrackPlayer.play();
      set({ currentTrack: content, isPlaying: true });
    } catch (e) {
      Sentry.captureException(e);
      console.error('[audioStore] playTrack failed:', e);
    }
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
      await TrackPlayer.play();
      set({ isPlaying: true });
    } catch (e) {
      Sentry.captureException(e);
      console.error('[audioStore] resumeAudio failed:', e);
    }
  },

  setSpeed: (speed) => set({ speed }),
  setSleepTimer: (minutes) => set({ sleepTimerMinutes: minutes }),
  addDownload: (contentId, localPath) =>
    set((state) => ({
      downloadedTracks: { ...state.downloadedTracks, [contentId]: localPath },
    })),
  clearDownloads: () => set({ downloadedTracks: {} }),
}));
