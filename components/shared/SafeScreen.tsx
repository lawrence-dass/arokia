import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';

interface SafeScreenProps {
  children: ReactNode;
  // Use a scrolling body (ScrollView). Omit for a fixed body — e.g. a screen that owns a FlatList,
  // which must not be nested inside a ScrollView.
  scroll?: boolean;
  // Classes for the body container (the View, or the ScrollView's own className).
  className?: string;
  // Classes for the ScrollView content container (only meaningful when `scroll`).
  contentContainerClassName?: string;
  edges?: readonly Edge[];
  // Render a back chevron top-left. Use on pushed, non-tab screens (root Stack has
  // headerShown:false, so there is no built-in back affordance otherwise).
  back?: boolean;
}

// Every screen wraps its body in SafeScreen so content clears the status bar / notch — the root
// Stack sets headerShown:false, so each screen owns its safe-area insets. The warm-cream background
// lives here too, so screens never re-declare it.
export function SafeScreen({
  children,
  scroll = false,
  className,
  contentContainerClassName,
  edges = ['top'],
  back = false,
}: SafeScreenProps) {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={edges}>
      {back && (
        // Sits above the body (outside the ScrollView) so it stays pinned while content scrolls.
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          hitSlop={8}
          className="ml-2 mt-1 h-11 w-11 items-center justify-center">
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </Pressable>
      )}
      {scroll ? (
        <ScrollView
          className={className ? `flex-1 ${className}` : 'flex-1'}
          contentContainerClassName={contentContainerClassName}>
          {children}
        </ScrollView>
      ) : (
        <View className={className ? `flex-1 ${className}` : 'flex-1'}>{children}</View>
      )}
    </SafeAreaView>
  );
}
