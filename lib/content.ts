import * as Sentry from '@sentry/react-native';
import type { SQLiteDatabase } from 'expo-sqlite';

import { supabase } from '@/lib/supabase';
import { searchScripture, searchScriptureByBook } from '@/lib/sqlite';
import type {
  ContentItem,
  LanguageCode,
  PracticePath,
  MoodTag,
  ProductPillar,
  ContentType,
  TimeOfDay,
  ReviewStatus,
  ScriptureVerse,
} from '@/types';

interface ContentItemRow {
  id: string;
  title: string;
  practice_path: string;
  product_pillar: string;
  content_type: string;
  language_code: string;
  time_of_day: string;
  mood_tag: string;
  review_status: string;
  verse_reference: string;
  scripture_text: string;
  audio_asset_id: string | null;
  version: number;
  created_at: string;
  published_at: string | null;
}

function transformContentItem(row: ContentItemRow): ContentItem {
  return {
    id: row.id,
    title: row.title,
    practicePath: row.practice_path as PracticePath,
    productPillar: row.product_pillar as ProductPillar,
    contentType: row.content_type as ContentType,
    languageCode: row.language_code as LanguageCode,
    timeOfDay: row.time_of_day as TimeOfDay,
    moodTag: row.mood_tag as MoodTag,
    reviewStatus: row.review_status as ReviewStatus,
    verseReference: row.verse_reference,
    scriptureText: row.scripture_text,
    audioAssetId: row.audio_asset_id,
    version: row.version,
    createdAt: row.created_at,
    publishedAt: row.published_at,
  };
}

export async function getQuotes(
  lang: LanguageCode,
  practicePath?: PracticePath,
  moodTag?: MoodTag
): Promise<ContentItem[]> {
  let query = supabase
    .from('content_items')
    .select('*')
    .eq('language_code', lang)
    .eq('review_status', 'published')
    .eq('content_type', 'quote');

  if (practicePath) query = query.eq('practice_path', practicePath);
  if (moodTag && moodTag !== 'none') query = query.eq('mood_tag', moodTag);

  const { data, error } = await query;
  if (error) {
    console.error('[content] getQuotes error:', error);
    Sentry.captureException(error);
    throw error;
  }
  return ((data ?? []) as ContentItemRow[]).map(transformContentItem);
}

export async function getMeditations(
  lang: LanguageCode,
  practicePath?: PracticePath
): Promise<ContentItem[]> {
  let query = supabase
    .from('content_items')
    .select('*')
    .eq('language_code', lang)
    .eq('review_status', 'published')
    .eq('content_type', 'meditation');

  if (practicePath) query = query.eq('practice_path', practicePath);

  const { data, error } = await query;
  if (error) {
    console.error('[content] getMeditations error:', error);
    Sentry.captureException(error);
    throw error;
  }
  return ((data ?? []) as ContentItemRow[]).map(transformContentItem);
}

// Searches the full bundled scripture text (Expo SQLite FTS), not the curated content_items
// catalog — see Story 3.3's Scope Note. Tamil FTS is tried first and wins if it returns
// anything; an English-looking query (Latin characters) that gets zero Tamil matches falls back
// to a book-name match, since no English scripture text is bundled to search directly.
export async function searchContent(
  db: SQLiteDatabase,
  lang: LanguageCode,
  query: string
): Promise<ScriptureVerse[]> {
  if (!query.trim()) return [];

  const tamilResults = await searchScripture(db, query, lang);
  if (tamilResults.length > 0 || !/[a-zA-Z]/.test(query)) {
    return tamilResults;
  }
  return searchScriptureByBook(db, query, lang);
}
