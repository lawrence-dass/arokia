import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getCurrentAppVersion, isVowSatisfied, needsReVow } from '@/constants/vow';
import i18n from '@/lib/i18n';
import type { LanguageCode } from '@/types';

interface PrefsState {
  // Persisted user preference. On app start, seed audioStore.speed from this value (Story 1.6/2.1).
  playbackSpeed: 0.75 | 1 | 1.25;
  // User-chosen app language (UI + content). Tamil-first default; overrides device locale so a user
  // on an English phone can still choose Tamil without changing their device settings. Applied to
  // i18next on change and re-applied on rehydration.
  language: LanguageCode;
  vowAcknowledged: boolean;
  lastVowAppVersion: string;
  // Sunday church attendance (Story 5.3) — attended Sundays as local 'YYYY-MM-DD' strings.
  // A date's presence IS the "attended" record; unmarking removes it. Deliberately no streak,
  // count, or aggregate is derived or exposed here (FR35), and no identity/PII is stored (NFR-PR1).
  sundayAttendance: string[];
  _hasHydrated: boolean;
  // Actions
  setPlaybackSpeed: (speed: PrefsState['playbackSpeed']) => void;
  setLanguage: (language: LanguageCode) => void;
  acknowledgeVow: (appVersion: string) => void;
  resetVow: () => void;
  toggleSundayAttendance: (date: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      playbackSpeed: 1,
      language: 'ta',
      vowAcknowledged: false,
      lastVowAppVersion: '',
      sundayAttendance: [],
      _hasHydrated: false,

      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      setLanguage: (language) => {
        set({ language });
        i18n.changeLanguage(language);
      },
      acknowledgeVow: (appVersion) => {
        if (!appVersion) return;
        set({ vowAcknowledged: true, lastVowAppVersion: appVersion });
      },
      resetVow: () => set({ vowAcknowledged: false, lastVowAppVersion: '' }),
      toggleSundayAttendance: (date) =>
        set((state) => ({
          sundayAttendance: state.sundayAttendance.includes(date)
            ? state.sundayAttendance.filter((d) => d !== date)
            : [...state.sundayAttendance, date],
        })),
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: 'arokia-prefs',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        playbackSpeed: state.playbackSpeed,
        language: state.language,
        vowAcknowledged: state.vowAcknowledged,
        lastVowAppVersion: state.lastVowAppVersion,
        sundayAttendance: state.sundayAttendance,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[prefsStore] Failed to rehydrate persisted state:', error);
        }
        // `state` is undefined on a failed rehydration — fall back to the live store so
        // hydration always completes and the app never blanks on a corrupted storage value.
        const hydrated = state ?? usePrefsStore.getState();
        // Apply the saved language to i18next so a returning user keeps their choice (i18n
        // initializes to the Tamil-first default before persisted state is available).
        if (hydrated.language) i18n.changeLanguage(hydrated.language);
        hydrated.setHasHydrated(true);
      },
    }
  )
);

// Single source of truth for "is the vow gate satisfied" / "is this a re-acknowledgment"
// so app/_layout.tsx, app/vow.tsx, and app/+not-found.tsx can't drift out of sync with
// each other (Story 2.1's +not-found fix and Story 2.2's re-vow gate both depend on this).
export function useVowGate() {
  const vowAcknowledged = usePrefsStore((state) => state.vowAcknowledged);
  const lastVowAppVersion = usePrefsStore((state) => state.lastVowAppVersion);
  const currentAppVersion = getCurrentAppVersion();

  return {
    vowSatisfied: isVowSatisfied(vowAcknowledged, lastVowAppVersion, currentAppVersion),
    isUpdate: vowAcknowledged && needsReVow(lastVowAppVersion, currentAppVersion),
    currentAppVersion,
  };
}
