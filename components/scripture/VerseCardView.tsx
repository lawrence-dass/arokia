import { Text, View } from 'react-native';

interface VerseCardViewProps {
  text: string;
  reference: string;
  languageCode: string;
}

// Stub for Story 5.1 (Verse Card Generation) — the real implementation adds react-native-view-shot
// PNG capture, the Arokia mark, and share-sheet wiring. This stub only locks in the attribution
// invariant (a required `reference` prop, plus `languageCode` reserved for future per-language
// rendering, same as VerseText) alongside VerseText/ScriptureCard.
export function VerseCardView({ text, reference }: VerseCardViewProps) {
  return (
    <View className="gap-2 rounded-card bg-surface p-6">
      <Text className="text-lg leading-8 text-text-primary">{text}</Text>
      <Text className="text-sm font-semibold text-text-secondary">{reference}</Text>
    </View>
  );
}
