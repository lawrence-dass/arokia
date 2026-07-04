import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { usePrefsStore } from '@/store/prefsStore';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const vowAcknowledged = usePrefsStore((state) => state.vowAcknowledged);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-text-secondary">{t('errors.notFound')}</Text>
      {/* '/' is excluded from the Stack before the vow is acknowledged (see app/_layout.tsx
          Stack.Protected guards) — route to whichever screen is currently reachable. */}
      <Link href={vowAcknowledged ? '/' : '/vow'} replace className="mt-4 text-primary">
        {t('errors.backHome')}
      </Link>
    </View>
  );
}
