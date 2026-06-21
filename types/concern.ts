export interface TheologicalConcern {
  id: string;
  contentItemId: string | null;
  description: string;
  submitterEmail: string | null;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  createdAt: string;
}
