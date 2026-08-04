import '@/lib/i18n'; // must be first — initialises i18next before any component renders
import * as Sentry from '@sentry/react-native';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  State,
} from 'react-native-track-player';
import '../global.css';

import { useEffect } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { initSchema } from '@/lib/sqlite';
import { supabaseConfigError } from '@/lib/supabase';
import { usePrefsStore, useVowGate } from '@/store/prefsStore';
import { useAudioStore } from '@/store/audioStore';

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

// Calm, self-contained diagnostic surface. Uses inline styles (not NativeWind) so it renders even
// when something upstream is broken — its whole job is to make a failure legible on a real device.
function DiagnosticScreen({
  title,
  message,
  detail,
  onRetry,
}: {
  title: string;
  message: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#F5EFE6', padding: 24, justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1C1917', marginBottom: 10 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 15, color: '#57534E', lineHeight: 22, marginBottom: 16 }}>
          {message}
        </Text>
        {detail ? (
          <ScrollView
            style={{
              maxHeight: 260,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 14,
              marginBottom: 18,
            }}>
            <Text
              selectable
              style={{
                fontSize: 12,
                lineHeight: 18,
                color: '#57534E',
                fontFamily: Platform.select({
                  ios: 'Menlo',
                  android: 'monospace',
                  default: 'monospace',
                }),
              }}>
              {detail}
            </Text>
          </ScrollView>
        ) : null}
        {onRetry ? (
          <Pressable
            onPress={onRetry}
            style={{
              backgroundColor: '#F0C040',
              borderRadius: 999,
              paddingVertical: 15,
              alignItems: 'center',
            }}>
            <Text style={{ fontWeight: '700', color: '#2A2410', fontSize: 15 }}>Try again</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaProvider>
  );
}

// expo-router renders this when a route throws during render. It shows the error on screen (so a
// tester can screenshot it) and reports it to Sentry — turning "app keeps stopping" into a real bug.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <DiagnosticScreen
      title="Something went wrong"
      message={error?.message ?? 'An unexpected error occurred while opening Arokia.'}
      detail={process.env.APP_ENV === 'production' ? undefined : (error?.stack ?? String(error))}
      onRetry={retry}
    />
  );
}

let configReported = false;

export default function Layout() {
  // Config gate — a build without backend keys can't function; show a legible screen instead of the
  // silent crash a top-level throw would cause. `supabaseConfigError` is a build-time constant, so
  // this branch is stable across renders (safe to sit before the hooks below).
  if (supabaseConfigError) {
    if (!configReported) {
      configReported = true;
      Sentry.captureMessage(`config-gate: ${supabaseConfigError}`, 'fatal');
    }
    SplashScreen.hideAsync().catch(() => {});
    return (
      <DiagnosticScreen
        title="Configuration missing"
        message={supabaseConfigError}
        detail="Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in the EAS Preview environment, then rebuild."
      />
    );
  }
  return <AppShell />;
}

function AppShell() {
  const hasHydrated = usePrefsStore((state) => state._hasHydrated);
  const { vowSatisfied } = useVowGate();

  useEffect(() => {
    setupRNTP();
  }, []);

  // Keep audioStore.isPlaying in sync with real RNTP playback state — most importantly, flip the
  // play/pause buttons back to "play" when a track finishes on its own (State.Ended), not just on
  // a manual pause.
  useEffect(() => {
    const sub = TrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
      if (state === State.Playing) {
        useAudioStore.getState().setPlaying(true);
      } else if (
        state === State.Paused ||
        state === State.Stopped ||
        state === State.Ended ||
        state === State.None
      ) {
        useAudioStore.getState().setPlaying(false);
      }
    });
    return () => sub.remove();
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
          {/* Pre-vow screens (reachable before acknowledgment, or when a re-vow is required
              after a significant update — see constants/vow.ts) go here. Declared first so that on
              a guarded cold start (URL "/" resolves into the guarded (tabs) group), the router's
              fallback anchor is the vow screen, not an unguarded utility route. */}
          <Stack.Protected guard={!vowSatisfied}>
            <Stack.Screen name="vow" />
          </Stack.Protected>
          {/* Post-vow content screens go here — every new route must be added to this
              block or it renders unguarded (expo-router only excludes routes explicitly
              listed inside a false-guarded Stack.Protected). */}
          <Stack.Protected guard={vowSatisfied}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="spikes" />
            <Stack.Screen name="about" />
            <Stack.Screen name="report-concern" />
            <Stack.Screen name="verse/[id]" />
            <Stack.Screen name="search" />
            <Stack.Screen name="meditation/[id]" />
          </Stack.Protected>
          {/* Always reachable, regardless of vow state — FR5 requires the Privacy Policy to be
              accessible before the Opening Vow is acknowledged. Declared LAST so it never becomes
              the initial/fallback route; being unguarded, its position does not affect reachability. */}
          <Stack.Screen name="privacy" />
        </Stack>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
