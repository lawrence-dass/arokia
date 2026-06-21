import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function SpikesScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="items-center px-5 py-10">
      <View className="w-full max-w-[360px] gap-6">
        <View>
          <Text className="text-sm font-semibold uppercase text-text-muted">
            {t('spikes.routeLabel')}
          </Text>
          <Text className="mt-2 text-3xl font-bold text-text-primary">{t('spikes.title')}</Text>
          <Text className="mt-3 text-base leading-7 text-text-secondary">
            {t('spikes.subtitle')}
          </Text>
        </View>

        <View className="rounded-lg border border-border bg-surface p-4">
          <Text className="text-sm font-semibold text-text-secondary">
            {t('spikes.tamilRendering.title')}
          </Text>
          <View className="bg-surfaceWarm mt-4 w-[320px] max-w-full rounded-lg p-4">
            <Text className="text-2xl leading-10 text-text-primary" testID="spike-tamil-phrase">
              {t('spikes.tamilRendering.phrase')}
            </Text>
          </View>
          <Text className="mt-4 text-sm leading-6 text-text-secondary">
            {t('spikes.tamilRendering.instruction')}
          </Text>
        </View>

        <View className="rounded-lg border border-border bg-surface p-4">
          <Text className="text-sm font-semibold text-text-secondary">
            {t('spikes.deviceChecklist.title')}
          </Text>
          <View className="mt-3 gap-2">
            <Text className="text-sm leading-6 text-text-secondary">
              {t('spikes.deviceChecklist.ios')}
            </Text>
            <Text className="text-sm leading-6 text-text-secondary">
              {t('spikes.deviceChecklist.android')}
            </Text>
            <Text className="text-sm leading-6 text-text-secondary">
              {t('spikes.deviceChecklist.record')}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
