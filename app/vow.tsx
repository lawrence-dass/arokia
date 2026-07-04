import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OpeningVow } from '@/components/onboarding';
import { logEvent } from '@/lib/analytics';
import { usePrefsStore } from '@/store/prefsStore';

export default function VowScreen() {
  const acknowledgeVow = usePrefsStore((state) => state.acknowledgeVow);

  const handleAcknowledge = () => {
    acknowledgeVow(Constants.expoConfig?.version ?? '1.0.0');
    logEvent('vow_completed');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <OpeningVow onAcknowledge={handleAcknowledge} />
    </SafeAreaView>
  );
}
