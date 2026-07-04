import { supabase } from '@/lib/supabase';

// Deliberately-permissive email shape check. Exported so the client form (ConcernForm) validates
// with the exact same rule the service enforces — the two can never drift.
export const EMAIL_FORMAT = /^[^@]+@[^@]+\.[^@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_FORMAT.test(email);
}

export async function submitConcern(
  description: string,
  contentItemId?: string,
  email?: string
): Promise<void> {
  if (!description.trim()) throw new Error('description is required');
  if (email !== undefined && !isValidEmail(email)) {
    throw new Error('invalid email format');
  }
  const { error } = await supabase.from('theological_concerns').insert({
    description,
    content_item_id: contentItemId ?? null,
    submitter_email: email ?? null,
  });
  if (error) {
    console.error('[concerns] submitConcern error:', error);
    throw error;
  }
}
