import type { RefObject } from 'react';
import type { View } from 'react-native';

// Captures a VerseCardView (by ref) to a PNG file entirely on-device — no network (NFR-P6).
// Returns the local file uri, which Story 5.2 hands to the system/WhatsApp share sheet.
// `react-native-view-shot` is required lazily (at capture time, not module load) so that a JS
// bundle running ahead of a native rebuild — the module not yet linked into the installed binary —
// does not crash the whole screen at import time. Only an actual capture touches the native module.
export async function captureVerseCard(ref: RefObject<View>): Promise<string> {
  const viewShot: typeof import('react-native-view-shot') =
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- intentional lazy native load
    require('react-native-view-shot');
  return viewShot.captureRef(ref, { format: 'png', quality: 1, result: 'tmpfile' });
}
