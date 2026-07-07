// External Tamil Bible hand-off (FR14). The app never frames this — tapping the link leaves Arokia.
//
// ⚠️ RESOURCE/TRANSLATION IS A LAWRENCE DECISION (theology-adjacent): the bundled in-app Bible is
// Tamil O.V. (Old Version); this hand-off currently points at BibleGateway's Tamil "ERV-TA"
// (Easy-to-Read) because it accepts a free-text reference (no 66-book id table needed) and renders
// the passage directly. Swap BIBLE_VERSION / BIBLE_BASE_URL here to change the resource.
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
