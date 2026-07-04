import { type SQLiteDatabase } from 'expo-sqlite';

import { type ScriptureVerse } from '@/types';

export async function initSchema(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
}

export async function getVerse(
  db: SQLiteDatabase,
  book: string,
  chapter: number,
  verse: number
): Promise<ScriptureVerse | null> {
  return db.getFirstAsync<ScriptureVerse>(
    `SELECT id, book, chapter, verse, text, language_code AS "languageCode"
     FROM scripture WHERE book = ? AND chapter = ? AND verse = ?`,
    [book, chapter, verse]
  );
}

export async function searchScripture(
  db: SQLiteDatabase,
  query: string,
  languageCode = 'ta'
): Promise<ScriptureVerse[]> {
  const escaped = `"${query.replace(/"/g, '""')}"`;
  return db.getAllAsync<ScriptureVerse>(
    `SELECT s.id, s.book, s.chapter, s.verse, s.text, s.language_code AS "languageCode"
     FROM scripture_fts
     JOIN scripture s ON scripture_fts.rowid = s.id
     WHERE scripture_fts MATCH ? AND s.language_code = ?
     LIMIT 50`,
    [escaped, languageCode]
  );
}

// Fallback for an English-language query (e.g. a book name) that won't match Tamil-only FTS
// content — no English scripture text is bundled, so `book` is the only English-language field.
export async function searchScriptureByBook(
  db: SQLiteDatabase,
  bookQuery: string,
  languageCode = 'ta'
): Promise<ScriptureVerse[]> {
  return db.getAllAsync<ScriptureVerse>(
    `SELECT id, book, chapter, verse, text, language_code AS "languageCode"
     FROM scripture WHERE book LIKE ? AND language_code = ?
     LIMIT 20`,
    [`%${bookQuery}%`, languageCode]
  );
}
