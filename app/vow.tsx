import { SafeAreaView } from 'react-native-safe-area-context';

import { OpeningVow } from '@/components/onboarding';
import { logEvent } from '@/lib/analytics';
import { usePrefsStore, useVowGate } from '@/store/prefsStore';

export default function VowScreen() {
  const acknowledgeVow = usePrefsStore((state) => state.acknowledgeVow);
  const { isUpdate, currentAppVersion } = useVowGate();

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
