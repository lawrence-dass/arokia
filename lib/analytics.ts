import type { AnalyticsEventType } from '@/types';

export async function logEvent(eventType: AnalyticsEventType, contentId?: string): Promise<void> {
  // TODO Story 1.7: replace with Supabase insert using UUID from expo-secure-store
  console.log('[analytics]', eventType, contentId);
}
