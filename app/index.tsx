import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-text-primary">{t('home.soul')}</Text>
    </View>
  );
}
