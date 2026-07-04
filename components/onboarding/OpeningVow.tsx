import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface OpeningVowProps {
  onAcknowledge: () => void;
}

export function OpeningVow({ onAcknowledge }: OpeningVowProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center gap-8 bg-background px-6">
      <View className="gap-4">
        <Text className="text-center text-3xl font-bold text-text-primary">{t('vow.title')}</Text>
        <Text className="text-center text-lg leading-8 text-text-primary">{t('vow.body')}</Text>
      </View>
      <Pressable
        onPress={onAcknowledge}
        accessibilityRole="button"
        className="min-h-12 items-center justify-center rounded-pill bg-primary px-8 py-3">
        <Text className="text-lg font-semibold text-text-on-primary">{t('vow.cta')}</Text>
      </Pressable>
    </View>
  );
}
