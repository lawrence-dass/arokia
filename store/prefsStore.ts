import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface PrefsState {
  // Persisted user preference. On app start, seed audioStore.speed from this value (Story 1.6/2.1).
  playbackSpeed: 0.75 | 1 | 1.25;
  vowAcknowledged: boolean;
  lastVowAppVersion: string;
  _hasHydrated: boolean;
  // Actions
  setPlaybackSpeed: (speed: PrefsState['playbackSpeed']) => void;
  acknowledgeVow: (appVersion: string) => void;
  resetVow: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      playbackSpeed: 1,
      vowAcknowledged: false,
      lastVowAppVersion: '',
      _hasHydrated: false,

      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      acknowledgeVow: (appVersion) => {
        if (!appVersion) return;
        set({ vowAcknowledged: true, lastVowAppVersion: appVersion });
      },
      resetVow: () => set({ vowAcknowledged: false, lastVowAppVersion: '' }),
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: 'arokia-prefs',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        playbackSpeed: state.playbackSpeed,
        vowAcknowledged: state.vowAcknowledged,
        lastVowAppVersion: state.lastVowAppVersion,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);
