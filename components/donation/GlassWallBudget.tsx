import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import Markdown from 'react-native-markdown-display';

export function GlassWallBudget() {
  const { t } = useTranslation();
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadBudget() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const asset = Asset.fromModule(require('@/docs/glass-wall-budget.md'));
        await asset.downloadAsync();
        if (!asset.localUri) throw new Error('No local URI for glass-wall-budget.md');
        const content = await FileSystem.readAsStringAsync(asset.localUri);
        if (!cancelled) setMarkdown(content);
      } catch (e) {
        console.warn('[GlassWallBudget] Failed to load glass-wall-budget.md:', e);
        if (!cancelled) setFailed(true);
      }
    }

    loadBudget();
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <View>
        <Text className="text-text-secondary">{t('donation.glassWallUnavailable')}</Text>
      </View>
    );
  }

  if (!markdown) return null;

  return <Markdown>{markdown}</Markdown>;
}
