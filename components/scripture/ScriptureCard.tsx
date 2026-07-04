import { Pressable } from 'react-native';

import { VerseText } from './VerseText';

interface ScriptureCardProps {
  text: string;
  reference: string;
  languageCode: string;
  onPress?: () => void;
}

export function ScriptureCard({ text, reference, languageCode, onPress }: ScriptureCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className="rounded-card border border-border-light bg-surface p-4">
      <VerseText text={text} reference={reference} languageCode={languageCode} />
    </Pressable>
  );
}
