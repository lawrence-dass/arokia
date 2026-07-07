import * as Sentry from '@sentry/react-native';
import type { SQLiteDatabase } from 'expo-sqlite';

import { supabase } from '@/lib/supabase';
import { searchScripture, searchScriptureByBook } from '@/lib/sqlite';
import type {
  ContentItem,
  LanguageCode,
  PracticePath,
  MoodTag,
  CategoryTag,
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
    moodTag: row.mood_tag as CategoryTag | 'none',
    reviewStatus: row.review_status as ReviewStatus,
    verseReference: row.verse_reference,
    scriptureText: row.scripture_text,
    audioAssetId: row.audio_asset_id,
    version: row.version,
    createdAt: row.created_at,
    publishedAt: row.published_at,
  };
}

// Returns the first published content item that has an audio asset, or null if none is voiced yet.
// Used by the /spikes RNTP validation harness to load a real, playable track on a physical device.
export async function getFirstAudioTrack(): Promise<ContentItem | null> {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('review_status', 'published')
    .not('audio_asset_id', 'is', null)
    .limit(1);
  if (error) {
    console.error('[content] getFirstAudioTrack error:', error);
    Sentry.captureException(error);
    throw error;
  }
  const rows = (data ?? []) as ContentItemRow[];
  return rows.length ? transformContentItem(rows[0]) : null;
}

// All published content items that have an audio asset — the set eligible for the manual
// "Download This Week" bulk download. Capped at 30 (one week of content is ≤21 tracks).
export async function getDownloadableTracks(): Promise<ContentItem[]> {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('review_status', 'published')
    .not('audio_asset_id', 'is', null)
    .limit(30);
  if (error) {
    console.error('[content] getDownloadableTracks error:', error);
    Sentry.captureException(error);
    throw error;
  }
  return ((data ?? []) as ContentItemRow[]).map(transformContentItem);
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
  practicePath?: PracticePath,
  category?: CategoryTag,
  timeOfDay?: TimeOfDay
): Promise<ContentItem[]> {
  let query = supabase
    .from('content_items')
    .select('*')
    .eq('language_code', lang)
    .eq('review_status', 'published')
    .eq('content_type', 'meditation');

  if (practicePath) query = query.eq('practice_path', practicePath);
  // Path-aware category axis (mind = emotional MoodTag; body/soul = own sets). Stored in mood_tag.
  if (category) query = query.eq('mood_tag', category);
  // v1 always passes 'any' (every MVP row's time_of_day is 'any' too, so this is a no-op filter
  // today) — the parameter exists so v1.1's Kaalai/Maalai filtering needs no signature change.
  if (timeOfDay) query = query.eq('time_of_day', timeOfDay);

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

  try {
    const tamilResults = await searchScripture(db, query, lang);
    if (tamilResults.length > 0 || !/[a-zA-Z]/.test(query)) {
      return tamilResults;
    }
    return await searchScriptureByBook(db, query, lang);
  } catch (error) {
    console.error('[content] searchContent error:', error);
    Sentry.captureException(error);
    throw error;
  }
}
