import { ActivityIndicator, Pressable, Text } from 'react-native';

import { colors } from '@/constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      className={`min-h-12 items-center justify-center rounded-pill px-8 py-3 ${
        isSecondary
          ? 'border border-border bg-transparent'
          : isDisabled
            ? 'bg-border'
            : 'bg-primary'
      }`}>
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.textPrimary : colors.textOnPrimary} />
      ) : (
        <Text
          className={`text-lg font-semibold ${
            isSecondary ? 'text-text-primary' : 'text-text-on-primary'
          }`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
