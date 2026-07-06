import type { TimeOfDay } from '@/types';

interface TimeOfDayBannerProps {
  timeFilter: TimeOfDay;
}

// v1.1 stub (Kaalai/Maalai time-of-day banner) — intentionally renders null in v1. The
// `timeFilter` prop is accepted now so v1.1 can activate this component without any structural
// change to its callers.
export function TimeOfDayBanner(_props: TimeOfDayBannerProps) {
  return null;
}
