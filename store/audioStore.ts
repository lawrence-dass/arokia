import { create } from 'zustand';
import type { ContentItem } from '@/types';

interface AudioState {
  currentTrack: ContentItem | null;
  isPlaying: boolean;
  isBuffering: boolean;
  // Runtime active speed. Initialise from prefsStore.playbackSpeed on app start (Story 1.6/2.1).
  speed: 0.75 | 1 | 1.25;
  sleepTimerMinutes: 0 | 15 | 30 | 45;
  downloadedTracks: Record<string, string>; // contentId -> localFilePath
  // Actions
  playTrack: (content: ContentItem) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
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

  playTrack: (content) => {
    if (!content.audioAssetId) return; // no audio asset yet — cannot play
    set({ currentTrack: content, isPlaying: true });
  },
  pauseAudio: () => set({ isPlaying: false }),
  resumeAudio: () => {
    const { currentTrack } = get();
    if (currentTrack) set({ isPlaying: true });
  },
  setSpeed: (speed) => set({ speed }),
  setSleepTimer: (minutes) => set({ sleepTimerMinutes: minutes }),
  addDownload: (contentId, localPath) =>
    set((state) => ({
      downloadedTracks: { ...state.downloadedTracks, [contentId]: localPath },
    })),
  clearDownloads: () => set({ downloadedTracks: {} }),
}));
