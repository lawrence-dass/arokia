import { Text, View } from 'react-native';

interface VerseTextProps {
  text: string;
  reference: string;
  // Reserved for v1.1 (hi/te) per-language font/style handling — system Tamil fonts render
  // `ta` correctly today with no per-language branching needed.
  languageCode: string;
}

export function VerseText({ text, reference }: VerseTextProps) {
  return (
    <View className="gap-2">
      <Text className="text-lg leading-8 text-text-primary">{text}</Text>
      <Text className="text-sm font-semibold text-text-secondary">{reference}</Text>
    </View>
  );
}
