import type { AudioPlayer } from 'expo-audio';

// SPIKE — optional soothing background bed for meditations. Runs as a SECOND audio layer beneath
// the react-native-track-player voice: RNTP keeps the lockscreen/background transport; this just
// loops quietly underneath at low volume. One shared, bundled loop is reused by every meditation
// (no per-track music), so storage cost is a single small file and the on/off toggle is trivial.
//
// The unproven part this spike validates on-device: two simultaneous audio streams coexisting
// (mix, not interrupt) and both surviving background + lockscreen. `interruptionMode: 'mixWithOthers'`
// is what lets the bed sit under RNTP instead of pausing it.
//
// `expo-audio` is a NATIVE module and is loaded lazily (not a top-level import), so a JS bundle
// running ahead of a native rebuild degrades to a no-op bed instead of crashing the whole
// meditation screen at import time. The bed simply won't play until the app is rebuilt.
const BED_SOURCE = require('@/assets/audio/ambient-bed.m4a');
// Subtle level — present but never competing with the voice. Tune to taste.
const BED_VOLUME = 0.25;

let player: AudioPlayer | null = null;
let audioModeReady = false;
// Once we learn the native module isn't in this binary (JS ahead of a rebuild), stop retrying so we
// don't re-trigger expo-modules-core's "missing native module" error on every play/pause.
let bedUnavailable = false;

async function ensurePlayer(): Promise<AudioPlayer | null> {
  if (bedUnavailable) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const audio = require('expo-audio') as typeof import('expo-audio');
    if (!audioModeReady) {
      await audio.setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'mixWithOthers',
      });
      audioModeReady = true;
    }
    if (!player) {
      player = audio.createAudioPlayer(BED_SOURCE);
      player.loop = true;
      player.volume = BED_VOLUME;
    }
    return player;
  } catch (e) {
    bedUnavailable = true;
    console.warn('[backgroundMusic] expo-audio unavailable (needs a native rebuild):', e);
    return null;
  }
}

// Start (or resume) the looping bed.
export async function startBed(): Promise<void> {
  const p = await ensurePlayer();
  if (!p) return;
  p.volume = BED_VOLUME;
  p.play();
}

// Pause the bed but keep it loaded (voice paused → bed pauses in sync).
export function pauseBed(): void {
  player?.pause();
}

// Stop and rewind — call when leaving the meditation so it doesn't bleed into the next one.
export async function stopBed(): Promise<void> {
  if (!player) return;
  player.pause();
  await player.seekTo(0);
}
