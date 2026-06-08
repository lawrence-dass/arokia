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
export type LanguageCode = 'ta' | 'hi' | 'te';
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
  moodTag: MoodTag;
  reviewStatus: ReviewStatus;
  verseReference: string; // NON-NULLABLE — never string | undefined
  scriptureText: string;
  audioAssetId: string | null; // null until audio_generated status
  version: number;
  createdAt: string;
  publishedAt: string | null;
}
