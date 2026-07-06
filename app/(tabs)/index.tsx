import { View } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { TimeOfDayBanner, TriuneGrid } from '@/components/home';

const TIME_FILTER = 'any' as const;

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center gap-6 bg-background px-6">
      <TimeOfDayBanner timeFilter={TIME_FILTER} />
      <TriuneGrid timeFilter={TIME_FILTER} />

      {/* Not a tab (About isn't a daily-practice destination) — kept reachable here since it has
          no other entry point in the app yet. */}
      <Link href="/about" className="text-center text-base font-semibold text-primary">
        {t('about.linkLabel')}
      </Link>
    </View>
  );
}
