import { View } from 'react-native';

import { VerseText } from './VerseText';

interface VerseCardViewProps {
  text: string;
  reference: string;
  languageCode: string;
}

// Stub for Story 5.1 (Verse Card Generation) — the real implementation adds react-native-view-shot
// PNG capture, the Arokia mark, and share-sheet wiring. This stub only locks in the attribution
// invariant (a required `reference` prop, plus `languageCode` reserved for future per-language
// rendering) by composing VerseText — the single source of verse+reference rendering — inside the
// card surface, so the two never drift.
export function VerseCardView({ text, reference, languageCode }: VerseCardViewProps) {
  return (
    <View className="rounded-card bg-surface p-6">
      <VerseText text={text} reference={reference} languageCode={languageCode} />
    </View>
  );
}
