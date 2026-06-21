import { create } from 'zustand';

interface PrefsState {
  // Persisted user preference. On app start, seed audioStore.speed from this value (Story 1.6/2.1).
  playbackSpeed: 0.75 | 1 | 1.25;
  vowAcknowledged: boolean;
  lastVowAppVersion: string;
  // Actions
  setPlaybackSpeed: (speed: PrefsState['playbackSpeed']) => void;
  acknowledgeVow: (appVersion: string) => void;
  resetVow: () => void;
}

export const usePrefsStore = create<PrefsState>()((set) => ({
  playbackSpeed: 1,
  vowAcknowledged: false,
  lastVowAppVersion: '',

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  acknowledgeVow: (appVersion) => {
    if (!appVersion) return;
    set({ vowAcknowledged: true, lastVowAppVersion: appVersion });
  },
  resetVow: () => set({ vowAcknowledged: false, lastVowAppVersion: '' }),
}));
