import '@/lib/i18n'; // must be first — initialises i18next before any component renders
import * as Sentry from '@sentry/react-native';
import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';
import '../global.css';

import { useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { initSchema } from '@/lib/sqlite';
import { usePrefsStore, useVowGate } from '@/store/prefsStore';

// Held open until prefsStore finishes hydrating, so the vow/home guard never flashes
// the wrong screen and the app never shows a blank frame while AsyncStorage is read.
SplashScreen.preventAutoHideAsync().catch(() => {});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: process.env.APP_ENV === 'preview' || process.env.APP_ENV === 'production',
  tracesSampleRate: 0,
  attachStacktrace: true,
  beforeSend: (event) => {
    delete event.user;
    delete event.contexts;
    delete event.breadcrumbs;
    delete event.tags;
    delete event.extra;
    delete event.request;
    delete event.modules;
    return event;
  },
});

// Must be called at module load time before any TrackPlayer interaction.
// require() is mandatory here — registerPlaybackService expects a CommonJS factory, not an ES module.
// eslint-disable-next-line @typescript-eslint/no-require-imports
TrackPlayer.registerPlaybackService(() => require('@/lib/trackPlayerService'));

let rnptSetupDone = false;

async function setupRNTP() {
  if (rnptSetupDone) return;
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
      compactCapabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
      progressUpdateEventInterval: 2,
    });
    rnptSetupDone = true;
  } catch (e) {
    console.warn('[RNTP] setup failed:', e);
  }
}

export default function Layout() {
  const hasHydrated = usePrefsStore((state) => state._hasHydrated);
  const { vowSatisfied } = useVowGate();

  useEffect(() => {
    setupRNTP();
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hasHydrated]);

  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName="scripture.db"
        assetSource={{ assetId: require('@/assets/db/scripture.db') }}
        onInit={initSchema}
        onError={(e) => console.error('[SQLite] DB failed to open:', e)}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Always reachable, regardless of vow state — FR5 requires the Privacy Policy to be
              accessible before the Opening Vow is acknowledged. This is the one deliberate
              exception to "every screen must be in a guarded block". */}
          <Stack.Screen name="privacy" />
          {/* Pre-vow screens (reachable before acknowledgment, or when a re-vow is required
              after a significant update — see constants/vow.ts) go here. */}
          <Stack.Protected guard={!vowSatisfied}>
            <Stack.Screen name="vow" />
          </Stack.Protected>
          {/* Post-vow content screens go here — every new route must be added to this
              block or it renders unguarded (expo-router only excludes routes explicitly
              listed inside a false-guarded Stack.Protected). */}
          <Stack.Protected guard={vowSatisfied}>
            <Stack.Screen name="index" />
            <Stack.Screen name="spikes" />
            <Stack.Screen name="about" />
            <Stack.Screen name="report-concern" />
          </Stack.Protected>
        </Stack>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
