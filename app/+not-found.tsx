import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-text-secondary">{t('errors.notFound')}</Text>
      <Link href="/" replace className="text-primary mt-4">
        {t('errors.backHome')}
      </Link>
    </View>
  );
}
