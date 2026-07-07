import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { QuoteList } from '@/components/scripture';
import { SafeScreen } from '@/components/shared';
import { useContentLanguage, useQuotesFetch } from '@/store/contentStore';

export default function WordScreen() {
  const { t } = useTranslation();
  const { isPending } = useQuotesFetch(useContentLanguage());

  return (
    <SafeScreen className="px-6 pt-4">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-text-primary">{t('word.title')}</Text>
        <Link href="/search" className="text-base font-semibold text-primary">
          {t('search.linkLabel')}
        </Link>
      </View>

      <QuoteList isPending={isPending} />
    </SafeScreen>
  );
}
