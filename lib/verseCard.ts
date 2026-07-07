import type { RefObject } from 'react';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

// Captures a VerseCardView (by ref) to a PNG file entirely on-device — no network (NFR-P6).
// Returns the local file uri, which Story 5.2 hands to the system/WhatsApp share sheet.
export async function captureVerseCard(ref: RefObject<View>): Promise<string> {
  return captureRef(ref, { format: 'png', quality: 1, result: 'tmpfile' });
}
