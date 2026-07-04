import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/shared';

interface OpeningVowProps {
  onAcknowledge: () => void;
  isUpdate?: boolean;
}

export function OpeningVow({ onAcknowledge, isUpdate = false }: OpeningVowProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center gap-8 bg-background px-6">
      <View className="gap-4">
        <Text className="text-center text-3xl font-bold text-text-primary">{t('vow.title')}</Text>
        <Text className="text-center text-lg leading-8 text-text-primary">{t('vow.body')}</Text>
        {isUpdate && (
          <Text className="text-center text-base leading-6 text-text-secondary">
            {t('vow.updatedNotice')}
          </Text>
        )}
      </View>
      <Button label={t('vow.cta')} onPress={onAcknowledge} />
    </View>
  );
}
