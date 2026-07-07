import { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { VerseText } from './VerseText';

interface VerseCardViewProps {
  text: string;
  // Required — the attribution invariant (FR42): a verse card can never render without its reference.
  reference: string;
  languageCode: string;
}

// Shareable verse card (Story 5.1). Composes VerseText — the single source of verse+reference
// rendering, so card and inline never drift — inside a branded surface, and forwards a ref +
// `collapsable={false}` so react-native-view-shot can capture it to a PNG on-device (see
// lib/verseCard.ts). Entirely offline: no network dependency.
export const VerseCardView = forwardRef<View, VerseCardViewProps>(function VerseCardView(
  { text, reference, languageCode },
  ref
) {
  const { t } = useTranslation();
  return (
    <View
      ref={ref}
      collapsable={false}
      className="gap-8 rounded-card border border-border-light bg-background p-8">
      <VerseText text={text} reference={reference} languageCode={languageCode} />
      <View className="flex-row items-center justify-end gap-2">
        <View className="h-2.5 w-2.5 rounded-full bg-primary" />
        <Text className="text-base font-bold text-primary">{t('common.appName')}</Text>
      </View>
    </View>
  );
});
