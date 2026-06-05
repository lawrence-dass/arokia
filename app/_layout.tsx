import '@/lib/i18n'; // must be first — initialises i18next before any component renders
import '../global.css';

import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { initSchema } from '@/lib/sqlite';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName="scripture.db"
        assetSource={{ assetId: require('@/assets/db/scripture.db') }}
        onInit={initSchema}
        onError={(e) => console.error('[SQLite] DB failed to open:', e)}>
        <Stack screenOptions={{ headerShown: false }} />
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
