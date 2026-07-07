import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { usePrefsStore } from '@/store/prefsStore';
import { getSundaysOfMonth, toLocalISODate } from '@/lib/worship';

// Optional Sunday church attendance tracker (Story 5.3, FR35). Shows the current month's Sundays;
// tapping one quietly toggles attendance. Deliberately no streak, count, badge, or congratulatory
// copy — attendance is a private act of devotion, an invitation and not an obligation.
export function SundayTracker() {
  const { t } = useTranslation();
  const sundayAttendance = usePrefsStore((state) => state.sundayAttendance);
  const toggleSundayAttendance = usePrefsStore((state) => state.toggleSundayAttendance);

  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth();

  const sundays = useMemo(() => getSundaysOfMonth(year, monthIndex), [year, monthIndex]);
  const months = t('worship.months', { returnObjects: true }) as string[];
  const monthLabel = `${months[monthIndex]} ${year}`;

  return (
    <View className="gap-6">
      <Text className="text-base leading-7 text-text-secondary">{t('worship.invitation')}</Text>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-text-primary">{monthLabel}</Text>

        <View className="flex-row flex-wrap gap-3">
          {sundays.map((sunday) => {
            const iso = toLocalISODate(sunday);
            const marked = sundayAttendance.includes(iso);
            return (
              <Pressable
                key={iso}
                onPress={() => toggleSundayAttendance(iso)}
                accessibilityRole="button"
                accessibilityState={{ selected: marked }}
                accessibilityLabel={t(marked ? 'worship.markedA11y' : 'worship.unmarkedA11y', {
                  date: iso,
                })}
                className={`h-14 w-14 items-center justify-center rounded-full border ${
                  marked ? 'border-tertiary bg-tertiary' : 'border-border bg-surface'
                }`}>
                <Text
                  className={`text-lg ${marked ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                  {sunday.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
