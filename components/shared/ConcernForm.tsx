import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ConcernFormProps {
  onSubmit: (description: string, email: string) => void;
  submitting: boolean;
  errorMessage?: string | null;
}

export function ConcernForm({ onSubmit, submitting, errorMessage }: ConcernFormProps) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const canSubmit = description.trim().length > 0 && !submitting;

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-base font-semibold text-text-primary">
          {t('concern.descriptionLabel')}
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder={t('concern.descriptionPlaceholder')}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className="min-h-32 rounded-card border border-border bg-surface px-4 py-3 text-base text-text-primary"
        />
      </View>

      <View className="gap-2">
        <Text className="text-base font-semibold text-text-primary">{t('concern.emailLabel')}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={t('concern.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          className="min-h-12 rounded-card border border-border bg-surface px-4 py-3 text-base text-text-primary"
        />
      </View>

      {errorMessage && <Text className="text-base text-error">{errorMessage}</Text>}

      <Pressable
        onPress={() => onSubmit(description, email)}
        disabled={!canSubmit}
        accessibilityRole="button"
        className={`min-h-12 items-center justify-center rounded-pill px-8 py-3 ${
          canSubmit ? 'bg-primary' : 'bg-border'
        }`}>
        <Text className="text-lg font-semibold text-text-on-primary">{t('concern.submitCta')}</Text>
      </Pressable>
    </View>
  );
}
