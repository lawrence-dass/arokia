import { SafeAreaView } from 'react-native-safe-area-context';

import { OpeningVow } from '@/components/onboarding';
import { getCurrentAppVersion, needsReVow } from '@/constants/vow';
import { logEvent } from '@/lib/analytics';
import { usePrefsStore } from '@/store/prefsStore';

export default function VowScreen() {
  const acknowledgeVow = usePrefsStore((state) => state.acknowledgeVow);
  const vowAcknowledged = usePrefsStore((state) => state.vowAcknowledged);
  const lastVowAppVersion = usePrefsStore((state) => state.lastVowAppVersion);
  const currentAppVersion = getCurrentAppVersion();
  const isUpdate = vowAcknowledged && needsReVow(lastVowAppVersion, currentAppVersion);

  const handleAcknowledge = () => {
    acknowledgeVow(currentAppVersion);
    logEvent('vow_completed');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <OpeningVow onAcknowledge={handleAcknowledge} isUpdate={isUpdate} />
    </SafeAreaView>
  );
}
