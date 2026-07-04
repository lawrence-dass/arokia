import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ConcernForm } from '@/components/shared';
import { submitConcern } from '@/lib/concerns';

export default function ReportConcernScreen() {
  const { t } = useTranslation();
  const { contentItemId } = useLocalSearchParams<{ contentItemId?: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (description: string, email: string) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await submitConcern(description, contentItemId, email.trim() || undefined);
      setSubmitted(true);
    } catch (e) {
      console.error('[report-concern] Submission failed:', e);
      setErrorMessage(t('errors.offline'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
        <Text className="text-center text-2xl font-bold text-text-primary">
          {t('concern.confirmationTitle')}
        </Text>
        <Text className="text-center text-base leading-7 text-text-secondary">
          {t('concern.confirmationBody')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 px-6 py-10">
      <Text className="text-3xl font-bold text-text-primary">{t('concern.title')}</Text>
      <ConcernForm onSubmit={handleSubmit} submitting={submitting} errorMessage={errorMessage} />
    </ScrollView>
  );
}
