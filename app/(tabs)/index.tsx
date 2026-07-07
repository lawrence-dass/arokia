import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { TimeOfDayBanner, TriuneGrid } from '@/components/home';
import { SafeScreen } from '@/components/shared';

const TIME_FILTER = 'any' as const;

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <SafeScreen className="justify-center gap-6 px-6">
      <TimeOfDayBanner timeFilter={TIME_FILTER} />
      <TriuneGrid timeFilter={TIME_FILTER} />

      {/* Not a tab (About isn't a daily-practice destination) — kept reachable here since it has
          no other entry point in the app yet. */}
      <Link href="/about" className="text-center text-base font-semibold text-primary">
        {t('about.linkLabel')}
      </Link>
    </SafeScreen>
  );
}
