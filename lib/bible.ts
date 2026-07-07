// External Tamil Bible hand-off (FR14). The app never frames this — tapping the link leaves Arokia.
//
// DECISION (2026-07-07): ships with BibleGateway Tamil "ERV-TA" (Easy-to-Read) because it accepts a
// free-text reference (no 66-book id table) and renders the passage directly — good enough for the
// only content that exists today (English-referenced voiced quotes).
//
// ⚠️ PRE-LAUNCH TASK (tied to Story 4-6, when Tamil audio content lands): switch to YouVersion Tamil
// O.V. to (a) match the bundled in-app translation (Tamil O.V.) and (b) handle Tamil-script book
// names, which BibleGateway free-text search does NOT reliably parse. That needs a bilingual
// book-name→USFM map. See deferred-work.md. Swap BIBLE_VERSION / BIBLE_BASE_URL to change the resource.
const BIBLE_BASE_URL = 'https://www.biblegateway.com/passage/';
const BIBLE_VERSION = 'ERV-TA';

/**
 * Builds a URL that opens the given scripture reference (e.g. "John 3:16" / "யோவான் 3:16") in an
 * external Tamil Bible resource. Reference text is taken verbatim from content_items.verse_reference.
 */
export function buildBibleUrl(reference: string): string {
  // Manual encoding — URLSearchParams support is unreliable in the React Native runtime.
  const search = encodeURIComponent(reference);
  const version = encodeURIComponent(BIBLE_VERSION);
  return `${BIBLE_BASE_URL}?search=${search}&version=${version}`;
}
