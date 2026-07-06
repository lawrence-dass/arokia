import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

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
}: SafeScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={edges}>
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
