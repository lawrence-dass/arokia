import { ActivityIndicator, Pressable, Text } from 'react-native';

import { colors } from '@/constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ label, onPress, disabled = false, loading = false }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      className={`min-h-12 items-center justify-center rounded-pill px-8 py-3 ${
        isDisabled ? 'bg-border' : 'bg-primary'
      }`}>
      {loading ? (
        <ActivityIndicator color={colors.textOnPrimary} />
      ) : (
        <Text className="text-lg font-semibold text-text-on-primary">{label}</Text>
      )}
    </Pressable>
  );
}
