import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { colors } from '@/constants/colors';
import { PlayerBar } from '@/components/audio';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      // Persistent mini-player sits directly above the default tab bar (FR16–17).
      tabBar={(props) => (
        <View>
          <PlayerBar />
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.iconActive,
        tabBarInactiveTintColor: colors.iconInactive,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.tabLabel'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="word"
        options={{
          title: t('word.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="walk"
        options={{
          title: t('walk.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="walk" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
