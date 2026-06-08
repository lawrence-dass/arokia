export type AnalyticsEventType =
  | 'vow_completed'
  | 'meditation_started'
  | 'meditation_completed'
  | 'scripture_link_opened'
  | 'share_triggered'
  | 'donation_completed';

export interface AnalyticsEvent {
  installId: string;
  eventType: AnalyticsEventType;
  contentId: string | null;
  createdAt: string;
}
