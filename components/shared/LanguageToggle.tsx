import { Pressable, Text, View } from 'react-native';

import { usePrefsStore } from '@/store/prefsStore';
import type { LanguageCode } from '@/types';

// Language autonyms are proper names shown in their own script and are intentionally NOT localized
// (தமிழ் reads "தமிழ்" in every UI language), so they live here as constants rather than i18n keys.
// Only the shipped content languages are offered.
const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'ta', label: 'தமிழ்' },
  { code: 'en', label: 'English' },
];

// In-app language switcher: lets the user choose the app language (UI + content) without changing
// their device locale — essential for a Tamil-first app so someone on an English phone can still
// choose Tamil. Writes to prefsStore (persisted) which applies the choice to i18next.
export function LanguageToggle() {
  const language = usePrefsStore((state) => state.language);
  const setLanguage = usePrefsStore((state) => state.setLanguage);

  return (
    <View className="flex-row self-center rounded-full border border-border bg-surface p-1">
      {LANGUAGES.map(({ code, label }) => {
        const active = language === code;
        return (
          <Pressable
            key={code}
            onPress={() => setLanguage(code)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={label}
            className={`rounded-full px-4 py-1.5 ${active ? 'bg-primary' : 'bg-transparent'}`}>
            <Text
              className={`text-sm ${active ? 'font-semibold text-text-on-primary' : 'text-text-secondary'}`}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
