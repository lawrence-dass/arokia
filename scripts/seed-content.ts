/**
 * Story 3.4 seed script.
 * Run: node --env-file=.env.local --loader tsx scripts/seed-content.ts [--execute]
 *
 * Without --execute, this is a dry run: validates every quote in SAMPLE_QUOTES against the
 * bundled Tamil OV data (verbatim text + valid verse reference) and prints a report — it writes
 * nothing to Supabase and does not require any credentials.
 *
 * With --execute, it additionally inserts the validated rows into content_items. This requires
 * SUPABASE_SERVICE_ROLE_KEY in .env.local (content_items has no anon INSERT policy) — a
 * Lawrence-handled credential, never used in the app binary.
 *
 * SAMPLE DATA WARNING: SAMPLE_QUOTES below holds 3 structural test rows, NOT the curated 50 MVP
 * quotes. Replace it entirely with Lawrence's selected verses + real practice_path/
 * product_pillar/mood_tag values before ever running --execute against production. See Story
 * 3.4's Scope Note for why this story doesn't attempt the curation itself.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

interface BundledVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface SeedQuote {
  book: string;
  chapter: number;
  verse: number;
  scriptureText: string;
  practicePath: 'mind' | 'body' | 'soul';
  productPillar: 'word' | 'walk' | 'hope_faith_love' | 'integrity';
  moodTag: 'anxious' | 'grieving' | 'angry' | 'lonely' | 'tempted' | 'none';
}

// SAMPLE DATA — NOT the curated 50. Replace entirely with Lawrence's selected verses + real
// practice_path/product_pillar/mood_tag values before running --execute against production.
// The uniform categorization below (same practicePath/productPillar/moodTag on every row) is
// deliberate — it signals "not real editorial curation," rather than guessing at one.
const SAMPLE_QUOTES: SeedQuote[] = [
  {
    book: 'Matthew',
    chapter: 11,
    verse: 28,
    scriptureText:
      'வருத்தப்பட்டுப் பாரஞ்சுமக்கிறவர்களே நீங்கள் எல்லாரும் என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாருதல் தருவேன்.',
    practicePath: 'mind',
    productPillar: 'word',
    moodTag: 'none',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 34,
    scriptureText:
      'ஆகையால் நாளைக்காகக் கவலைப்படாதிருங்கள்; நாளையத்தினம் தன்னுடையவைகளுக்காகக் கவலைப்படும். அந்தந்த நாளுக்கு அதினதின் பாடு போதும்.',
    practicePath: 'mind',
    productPillar: 'word',
    moodTag: 'none',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 27,
    scriptureText:
      'சமாதானத்தை உங்களுக்கு வைத்துப்போகிறேன், என்னுடைய சமாதானத்தையே உங்களுக்குக் கொடுக்கிறேன்; உலகம் கொடுக்கிறபிரகாரம் நான் உங்களுக்குக் கொடுக்கிறதில்லை. உங்கள் இருதயம் கலங்காமலும் பயப்படாமலுமிருப்பதாக.',
    practicePath: 'mind',
    productPillar: 'word',
    moodTag: 'none',
  },
];

interface ValidationResult {
  quote: SeedQuote;
  ok: boolean;
  problems: string[];
}

function loadBundledVerses(): Map<string, BundledVerse> {
  const dataPath = join(__dirname, '../data/tamil-ov-nt.json');
  if (!existsSync(dataPath)) {
    console.error(`ERROR: Source data not found at ${dataPath}`);
    process.exit(1);
  }
  let verses: BundledVerse[];
  try {
    verses = JSON.parse(readFileSync(dataPath, 'utf-8'));
  } catch (e) {
    console.error(`ERROR: Failed to parse ${dataPath} as JSON:`, (e as Error).message);
    process.exit(1);
  }
  const byReference = new Map<string, BundledVerse>();
  for (const v of verses) {
    byReference.set(`${v.book}|${v.chapter}|${v.verse}`, v);
  }
  return byReference;
}

// Tamil vowel signs can be represented as a single precomposed codepoint (NFC) or a base +
// combining-mark sequence (NFD) — visually identical, but `!==` would treat them as different
// text. Normalize both sides before comparing so "verbatim" actually means "same text," not
// "same byte sequence."
function normalize(text: string): string {
  return text.normalize('NFC');
}

function validateQuote(quote: SeedQuote, bundled: Map<string, BundledVerse>): ValidationResult {
  const problems: string[] = [];
  const key = `${quote.book}|${quote.chapter}|${quote.verse}`;
  const source = bundled.get(key);

  if (!source) {
    problems.push(
      `verse_reference does not resolve: "${quote.book} ${quote.chapter}:${quote.verse}" not found in bundled Tamil OV data`
    );
  } else if (normalize(source.text) !== normalize(quote.scriptureText)) {
    problems.push(
      `scriptureText is not verbatim — does not match the bundled Tamil OV source character-for-character`
    );
  }

  return { quote, ok: problems.length === 0, problems };
}

async function main() {
  const shouldExecute = process.argv.includes('--execute');
  const bundled = loadBundledVerses();

  console.log(`\nValidating ${SAMPLE_QUOTES.length} quote(s) against data/tamil-ov-nt.json...\n`);

  const results = SAMPLE_QUOTES.map((quote) => validateQuote(quote, bundled));
  let allValid = true;

  for (const result of results) {
    const label = `${result.quote.book} ${result.quote.chapter}:${result.quote.verse}`;
    if (result.ok) {
      console.log(`  PASS  ${label}`);
    } else {
      allValid = false;
      console.error(`  FAIL  ${label}`);
      for (const problem of result.problems) {
        console.error(`          ${problem}`);
      }
    }
  }

  if (!allValid) {
    console.error('\nValidation failed — fix the problems above before seeding.');
    process.exit(1);
  }

  console.log('\nAll quotes passed validation.');

  if (!shouldExecute) {
    console.log('Dry run only (no --execute flag) — nothing was written to Supabase.\n');
    return;
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      '\nERROR: --execute requires EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.'
    );
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const rows = SAMPLE_QUOTES.map((quote) => ({
    practice_path: quote.practicePath,
    product_pillar: quote.productPillar,
    content_type: 'quote',
    language_code: 'ta',
    time_of_day: 'any',
    mood_tag: quote.moodTag,
    review_status: 'published',
    verse_reference: `${quote.book} ${quote.chapter}:${quote.verse}`,
    scripture_text: normalize(quote.scriptureText),
  }));

  const { error } = await admin.from('content_items').insert(rows);
  if (error) {
    console.error('\nERROR: insert failed:', error.message);
    process.exit(1);
  }

  console.log(`\nInserted ${rows.length} row(s) into content_items.\n`);
}

main();
