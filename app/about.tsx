import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { GlassWallBudget } from '@/components/donation';
import { SafeScreen } from '@/components/shared';

export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <SafeScreen scroll contentContainerClassName="gap-8 px-6 pb-10 pt-4">
      <Text className="text-3xl font-bold text-text-primary">{t('about.title')}</Text>

      <View className="gap-2">
        <Text className="text-xl font-semibold text-text-primary">
          {t('about.nameMeaning.heading')}
        </Text>
        <Text className="text-base leading-7 text-text-secondary">
          {t('about.nameMeaning.body')}
        </Text>
      </View>

      <View className="gap-2">
        <Text className="text-xl font-semibold text-text-primary">
          {t('about.pillars.heading')}
        </Text>
        <Text className="text-base leading-7 text-text-secondary">{t('about.pillars.word')}</Text>
        <Text className="text-base leading-7 text-text-secondary">{t('about.pillars.walk')}</Text>
        <Text className="text-base leading-7 text-text-secondary">
          {t('about.pillars.hopeFaithLove')}
        </Text>
        <Text className="text-base leading-7 text-text-secondary">
          {t('about.pillars.integrity')}
        </Text>
      </View>

      <View className="gap-2">
        <Text className="text-xl font-semibold text-text-primary">
          {t('about.ecumenical.heading')}
        </Text>
        <Text className="text-base leading-7 text-text-secondary">
          {t('about.ecumenical.body')}
        </Text>
      </View>

      <View className="gap-2">
        <Text className="text-xl font-semibold text-text-primary">
          {t('about.correctionProcess.heading')}
        </Text>
        <Text className="text-base leading-7 text-text-secondary">
          {t('about.correctionProcess.body')}
        </Text>
        <Link href="/report-concern" className="text-base font-semibold text-primary">
          {t('concern.linkLabel')}
        </Link>
      </View>

      <View className="gap-2">
        <Text className="text-xl font-semibold text-text-primary">{t('donation.glassWall')}</Text>
        <GlassWallBudget />
      </View>

      <Link href="/privacy" className="text-base font-semibold text-primary">
        {t('about.privacyLink')}
      </Link>
    </SafeScreen>
  );
}
