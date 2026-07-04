import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <Text className="text-2xl font-bold text-text-primary">{t('home.soul')}</Text>
      {/* Temporary — Epic 4 replaces this placeholder screen with the real triune home nav,
          which will surface the About page properly. */}
      <Link href="/about" className="text-base font-semibold text-primary">
        {t('about.linkLabel')}
      </Link>
    </View>
  );
}
