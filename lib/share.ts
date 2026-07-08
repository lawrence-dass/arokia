import type { RefObject } from 'react';
import type { View } from 'react-native';
import * as Sentry from '@sentry/react-native';

import { captureVerseCard } from '@/lib/verseCard';
import { logEvent } from '@/lib/analytics';

// Captures the branded verse card to a PNG (on-device, offline-safe) and opens the system share
// sheet with the image (WhatsApp, Messages, any installed app). The card itself carries the verbatim
// text + reference + Arokia mark, so attribution travels with the image (FR42). Logs share_triggered.
// No navigation side effects — control returns to the caller when the sheet closes.
export async function shareVerseCard(
  ref: RefObject<View | null>,
  contentId: string
): Promise<void> {
  try {
    // Required lazily (not at module load) so a JS bundle running ahead of a native rebuild —
    // expo-sharing not yet linked into the installed binary — degrades to this caught error
    // instead of crashing the verse screen at import time.
    const Sharing: typeof import('expo-sharing') =
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- intentional lazy native load
      require('expo-sharing');
    const uri = await captureVerseCard(ref as RefObject<View>);
    logEvent('share_triggered', contentId);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error('[share] shareVerseCard failed:', e);
  }
}
