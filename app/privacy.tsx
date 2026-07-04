import { ScrollView, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function PrivacyScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 px-6 py-10">
      <Text className="text-3xl font-bold text-text-primary">{t('privacy.title')}</Text>
      <Text className="text-base leading-7 text-text-secondary">{t('privacy.body')}</Text>
    </ScrollView>
  );
}
