import { supabase } from '@/lib/supabase';

export async function submitConcern(
  description: string,
  contentItemId?: string,
  email?: string
): Promise<void> {
  if (!description.trim()) throw new Error('description is required');
  if (email !== undefined && !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
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
