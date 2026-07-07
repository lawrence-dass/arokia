export interface ScriptureVerse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  languageCode: string;
}

export type PracticePath = 'mind' | 'body' | 'soul';
export type ProductPillar = 'word' | 'walk' | 'hope_faith_love' | 'integrity';
export type ContentType = 'quote' | 'meditation' | 'lectio' | 'sleep' | 'breathwork';
export type TimeOfDay = 'morning' | 'evening' | 'any';
export type MoodTag = 'anxious' | 'grieving' | 'angry' | 'lonely' | 'tempted' | 'none';
export type BodyCategory = 'rest' | 'movement' | 'breathwork' | 'sleep';
export type SoulCategory = 'prayer' | 'lectio' | 'silence' | 'communion';
// Path-aware second filter axis for the meditation library. Mind uses the emotional MoodTag values;
// Body and Soul each have their own category set (see CATEGORIES_BY_PATH in CategoryFilter). The DB
// `mood_tag` CHECK still only allows the emotional set today — Body/Soul values land in the schema
// when Story 4-6 seeds meditation content and widens the constraint. No meditations are seeded yet.
export type CategoryTag = Exclude<MoodTag, 'none'> | BodyCategory | SoulCategory;
export type LanguageCode = 'ta' | 'en' | 'hi' | 'te';
export type ReviewStatus =
  | 'draft'
  | 'source_verified'
  | 'advisor_reviewed'
  | 'audio_generated'
  | 'qa_passed'
  | 'published'
  | 'superseded';

export interface ContentItem {
  id: string;
  title: string;
  practicePath: PracticePath;
  productPillar: ProductPillar;
  contentType: ContentType;
  languageCode: LanguageCode;
  timeOfDay: TimeOfDay;
  moodTag: CategoryTag | 'none';
  reviewStatus: ReviewStatus;
  verseReference: string; // NON-NULLABLE — never string | undefined
  scriptureText: string;
  audioAssetId: string | null; // null until audio_generated status
  version: number;
  createdAt: string;
  publishedAt: string | null;
}
