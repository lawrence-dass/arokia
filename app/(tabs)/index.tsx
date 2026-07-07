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

      {/* Optional Sunday worship tracker (Story 5.3) — a quiet, private invitation, not a tab. */}
      <Link href="/worship" className="text-center text-base font-semibold text-primary">
        {t('worship.linkLabel')}
      </Link>

      {/* Not a tab (About isn't a daily-practice destination) — kept reachable here since it has
          no other entry point in the app yet. */}
      <Link href="/about" className="text-center text-base font-semibold text-primary">
        {t('about.linkLabel')}
      </Link>

      {/* Dev-only entry to the RNTP/offline/Tamil validation harness — stripped from prod builds. */}
      {__DEV__ && (
        <Link href="/spikes" className="text-center text-sm text-text-muted">
          {t('spikes.title')}
        </Link>
      )}
    </SafeScreen>
  );
}
