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
  // Quote each term individually and join with a space so FTS5 does an implicit AND across
  // terms (all must appear, in any order) rather than requiring the whole query as one adjacent
  // phrase. Per-term quoting also neutralises FTS5 operator characters within a term.
  const escaped = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => `"${term.replace(/"/g, '""')}"`)
    .join(' ');
  if (!escaped) return [];
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
  // Escape LIKE metacharacters (\ % _) so a query such as "a_c" matches the literal text
  // rather than acting as a wildcard; the ESCAPE clause below defines `\` as the escape char.
  const escapedBook = bookQuery.replace(/[\\%_]/g, '\\$&');
  return db.getAllAsync<ScriptureVerse>(
    `SELECT id, book, chapter, verse, text, language_code AS "languageCode"
     FROM scripture WHERE book LIKE ? ESCAPE '\\' AND language_code = ?
     LIMIT 20`,
    [`%${escapedBook}%`, languageCode]
  );
}
