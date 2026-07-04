import '@/lib/i18n'; // must be first — initialises i18next before any component renders
import * as Sentry from '@sentry/react-native';
import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';
import '../global.css';

import { useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { initSchema } from '@/lib/sqlite';
import { usePrefsStore } from '@/store/prefsStore';

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
  const vowAcknowledged = usePrefsStore((state) => state.vowAcknowledged);
  const hasHydrated = usePrefsStore((state) => state._hasHydrated);

  useEffect(() => {
    setupRNTP();
  }, []);

  if (!hasHydrated) return null;

  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName="scripture.db"
        assetSource={{ assetId: require('@/assets/db/scripture.db') }}
        onInit={initSchema}
        onError={(e) => console.error('[SQLite] DB failed to open:', e)}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!vowAcknowledged}>
            <Stack.Screen name="vow" />
          </Stack.Protected>
          <Stack.Protected guard={vowAcknowledged}>
            <Stack.Screen name="index" />
            <Stack.Screen name="spikes" />
          </Stack.Protected>
        </Stack>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
