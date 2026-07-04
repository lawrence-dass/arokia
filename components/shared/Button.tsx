import { ActivityIndicator, Pressable, Text } from 'react-native';

import { colors } from '@/constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

const STYLES = {
  primary: {
    container: 'bg-primary',
    containerDisabled: 'bg-border',
    text: 'text-text-on-primary',
    textDisabled: 'text-text-on-primary',
    indicatorColor: colors.textOnPrimary,
  },
  secondary: {
    container: 'border border-border bg-transparent',
    containerDisabled: 'border border-border-light bg-transparent',
    text: 'text-text-primary',
    textDisabled: 'text-text-muted',
    indicatorColor: colors.textPrimary,
  },
} as const;

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const style = STYLES[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      className={`min-h-12 items-center justify-center rounded-pill px-8 py-3 ${
        isDisabled ? style.containerDisabled : style.container
      }`}>
      {loading ? (
        <ActivityIndicator color={style.indicatorColor} />
      ) : (
        <Text className={`text-lg font-semibold ${isDisabled ? style.textDisabled : style.text}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
