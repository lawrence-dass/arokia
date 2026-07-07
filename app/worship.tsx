import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SafeScreen } from '@/components/shared';
import { SundayTracker } from '@/components/worship';

export default function WorshipScreen() {
  const { t } = useTranslation();

  return (
    <SafeScreen scroll back contentContainerClassName="gap-6 px-6 pb-10 pt-4">
      <Text className="text-3xl font-bold text-text-primary">{t('worship.title')}</Text>
      <SundayTracker />
    </SafeScreen>
  );
}
