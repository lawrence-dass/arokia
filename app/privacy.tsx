import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SafeScreen } from '@/components/shared';

export default function PrivacyScreen() {
  const { t } = useTranslation();

  return (
    <SafeScreen scroll contentContainerClassName="gap-4 px-6 pb-10 pt-4">
      <Text className="text-3xl font-bold text-text-primary">{t('privacy.title')}</Text>
      <Text className="text-base leading-7 text-text-secondary">{t('privacy.body')}</Text>
    </SafeScreen>
  );
}
