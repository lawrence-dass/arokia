import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from './Button';

// Mirrors lib/concerns.ts:submitConcern's own email validation exactly, so a malformed
// email is caught here — before a network round-trip — instead of surfacing as a
// misleading generic submission error.
const EMAIL_FORMAT = /^[^@]+@[^@]+\.[^@]+$/;

interface ConcernFormProps {
  onSubmit: (description: string, email: string) => void;
  submitting: boolean;
  errorMessage?: string | null;
}

export function ConcernForm({ onSubmit, submitting, errorMessage }: ConcernFormProps) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const trimmedEmail = email.trim();
  const emailValid = trimmedEmail.length === 0 || EMAIL_FORMAT.test(trimmedEmail);
  const canSubmit = description.trim().length > 0 && emailValid && !submitting;

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
        {!emailValid && <Text className="text-sm text-error">{t('concern.invalidEmail')}</Text>}
      </View>

      {errorMessage && <Text className="text-base text-error">{errorMessage}</Text>}

      <Button
        label={t('concern.submitCta')}
        onPress={() => onSubmit(description.trim(), trimmedEmail)}
        disabled={!canSubmit}
        loading={submitting}
      />
    </View>
  );
}
