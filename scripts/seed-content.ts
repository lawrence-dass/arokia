/**
 * Story 3.4 seed script.
 * Run: node --env-file=.env.local --loader tsx scripts/seed-content.ts [--execute]
 *
 * Without --execute, this is a dry run: validates every quote in CURATED_QUOTES against the
 * bundled Tamil OV data (verbatim text + valid verse reference) and prints a report — it writes
 * nothing to Supabase and does not require any credentials.
 *
 * With --execute, it additionally inserts the validated rows into content_items. This requires
 * SUPABASE_SERVICE_ROLE_KEY in .env.local (content_items has no anon INSERT policy) — a
 * Lawrence-handled credential, never used in the app binary.
 *
 * CURATED DATA: CURATED_QUOTES holds the 50 MVP red-letter Jesus quotes, verbatim from the
 * bundled Tamil OV NT (data/tamil-ov-nt.json) and validated by the dry run below. Run --execute
 * (with SUPABASE_SERVICE_ROLE_KEY) only after Lawrence approves the review sheet in
 * docs/content/CONTENT-RESEARCH-OUTPUT.md.
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

// The 50 curated MVP red-letter Jesus quotes — verbatim from the bundled Tamil OV NT
// (data/tamil-ov-nt.json), validated by the dry run in main(). Sourced via the Codex research
// handoff docs/content/CONTENT-RESEARCH-OUTPUT.md (which holds Lawrence's theological review sheet).
const CURATED_QUOTES: SeedQuote[] = [
  {
    book: 'Matthew',
    chapter: 4,
    verse: 4,
    scriptureText:
      'அவர் பிரதியுத்தரமாக: மனுஷன் அப்பத்தினாலேமாத்திரமல்ல, தேவனுடைய வாயிலிருந்து புறப்படுகிற ஒவ்வொரு வார்த்தையினாலும் பிழைப்பான் என்று எழுதியிருக்கிறதே என்றார்.',
    practicePath: 'body',
    productPillar: 'word',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 4,
    verse: 7,
    scriptureText:
      'அதற்கு இயேசு: உன் தேவனாகிய கர்த்தரைப் பரீட்சை பாராதிருப்பாயாக என்றும் எழுதியிருக்கிறதே என்றார்.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 4,
    verse: 10,
    scriptureText:
      'அப்பொழுது இயேசு: அப்பாலே போ சாத்தானே; உன் தேவனாகிய கர்த்தரைப் பணிந்துகொண்டு அவர் ஒருவருக்கே ஆராதனை செய்வாயாக என்று எழுதியிருக்கிறதே என்றார்.',
    practicePath: 'soul',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 3,
    scriptureText: 'ஆவியில் எளிமையுள்ளவர்கள் பாக்கியவான்கள்; பரலோக ராஜ்யம் அவர்களுடையது.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'none',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 4,
    scriptureText: 'துயரப்படுகிறவர்கள் பாக்கியவான்கள்; அவர்கள் ஆறுதலடைவார்கள்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 9,
    scriptureText:
      'சமாதானம் பண்ணுகிறவர்கள் பாக்கியவான்கள்; அவர்கள் தேவனுடைய புத்திரர் என்னப்படுவார்கள்.',
    practicePath: 'body',
    productPillar: 'walk',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 24,
    scriptureText:
      'அங்கேதானே பலிபீடத்தின் முன் உன் காணிக்கையை வைத்துவிட்டுப் போய், முன்பு உன் சகோதரனோடே ஒப்புரவாகி, பின்பு வந்து உன் காணிக்கையைச் செலுத்து.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 28,
    scriptureText:
      'நான் உங்களுக்குச் சொல்லுகிறேன் ஒரு ஸ்திரீயை இச்சையோடு பார்க்கிற எவனும் தன் இருதயத்தில் அவளோடே விபசாரஞ்செய்தாயிற்று.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 44,
    scriptureText:
      'நான் உங்களுக்குச் சொல்லுகிறேன், உங்கள் சத்துருக்களைச் சிநேகியுங்கள்; உங்களைச் சபிக்கிறவர்களை ஆசீர்வதியுங்கள்; உங்களைப் பகைக்கிறவர்களுக்கு நன்மை செய்யுங்கள்; உங்களை நிந்திக்கிறவர்களுக்காகவும் உங்களைத் துன்பப்படுத்துகிறவர்களுக்காகவும் ஜெபம் பண்ணுங்கள்.',
    practicePath: 'body',
    productPillar: 'walk',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 14,
    scriptureText:
      'மனுஷருடைய தப்பிதங்களை நீங்கள் அவர்களுக்கு மன்னித்தால், உங்கள் பரமபிதா உங்களுக்கும் மன்னிப்பார்.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 25,
    scriptureText:
      'ஆகையால் என்னத்தை உண்போம், என்னத்தைக் குடிப்போம் என்று உங்கள் ஜீவனுக்காகவும்; என்னத்தை உடுப்போம் என்று உங்கள் சரீரத்துக்காகவும் கவலைப்படாதிருங்கள் என்று, உங்களுக்குச் சொல்லுகிறேன்; ஆகாரத்தைப் பார்க்கிலும் ஜீவனும், உடையைப்பார்க்கிலும் சரீரமும் விசேஷித்தவைகள் அல்லவா?',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 33,
    scriptureText:
      'முதலாவது தேவனுடைய ராஜ்யத்தையும் அவருடைய நீதியையும் தேடுங்கள்; அப்பொழுது இவைகளெல்லாம் உங்களுக்குக் கூடக் கொடுக்கப்படும்.',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 34,
    scriptureText:
      'ஆகையால் நாளைக்காகக் கவலைப்படாதிருங்கள்; நாளையத்தினம் தன்னுடையவைகளுக்காகக் கவலைப்படும். அந்தந்த நாளுக்கு அதினதின் பாடு போதும்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 7,
    verse: 12,
    scriptureText:
      'ஆதலால், மனுஷர் உங்களுக்கு எவைகளைச்செய்ய விரும்புகிறீர்களோ, அவைகளை நீங்களும் அவர்களுக்குச் செய்யுங்கள்; இதுவே நியாயப்பிரமாணமும் தீர்க்கதரிசனங்களுமாம்.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 10,
    verse: 31,
    scriptureText:
      'ஆதலால், பயப்படாதிருங்கள்; அநேகம் அடைக்கலான் குருவிகளைப் பார்க்கிலும் நீங்கள் விசேஷித்தவர்களாயிருக்கிறீர்கள்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 11,
    verse: 28,
    scriptureText:
      'வருத்தப்பட்டுப் பாரஞ்சுமக்கிறவர்களே நீங்கள் எல்லாரும் என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாருதல் தருவேன்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'Matthew',
    chapter: 11,
    verse: 29,
    scriptureText:
      'நான் சாந்தமும் மனத்தாழ்மையுமாயிருக்கிறேன்; என் நுகத்தை உங்கள்மேல் ஏற்றுக்கொண்டு, என்னிடத்தில் கற்றுக்கொள்ளுங்கள். அப்பொழுது, உங்கள் ஆத்துமாக்களுக்கு இளைப்பாறுதல் கிடைக்கும்.',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'grieving',
  },
  {
    book: 'Matthew',
    chapter: 16,
    verse: 24,
    scriptureText:
      'அப்பொழுது, இயேசு தம்முடைய சீஷர்களை நோக்கி: ஒருவன் என்னைப் பின்பற்றி வர விரும்பினால், அவன் தன்னைத்தான் வெறுத்து, தன் சிலுவையை எடுத்துக்கொண்டு என்னைப் பின்பற்றக்கடவன்',
    practicePath: 'body',
    productPillar: 'walk',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 19,
    verse: 26,
    scriptureText:
      'இயேசு, அவர்களைப் பார்த்து: மனுஷரால் இது கூடாததுதான்; தேவனாலே எல்லாம் கூடும் என்றார்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 26,
    verse: 41,
    scriptureText:
      'நீங்கள் சோதனைக்குட்படாதபடிக்கு விழித்திருந்து ஜெபம்பண்ணுங்கள்; ஆவி உற்சாகமுள்ளதுதான், மாம்சமோ பலவீனமுள்ளது என்றார்.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 28,
    verse: 20,
    scriptureText:
      'நான் உங்களுக்குக் கட்டளையிட்ட யாவையும் அவர்கள் கைக்கொள்ளும்படி அவர்களுக்கு உபதேசம் பண்ணுங்கள்; இதோ, உலகத்தின் முடிவுபரியந்தம் சகல நாட்களிலும் நான் உங்களுடனேகூட இருக்கிறேன் என்றார். ஆமென்.',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'lonely',
  },
  {
    book: 'Mark',
    chapter: 4,
    verse: 40,
    scriptureText:
      'அவர் அவர்களை நோக்கி: ஏன் இப்படிப் பயப்படுகிறீர்கள்? ஏன் உங்களுக்கு விசுவாசம் இல்லாமற்போயிற்று என்றார்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Mark',
    chapter: 9,
    verse: 23,
    scriptureText:
      'இயேசு அவனை நோக்கி: நீ விசுவாசிக்கக்கூடுமானால் ஆகும், விசுவாசிக்கிறவனுக்கு எல்லாம் கூடும் என்றார்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Mark',
    chapter: 10,
    verse: 14,
    scriptureText:
      'இயேசு அதைக்கண்டு விசனமடைந்து: சிறு பிள்ளைகள் என்னிடத்தில் வருகிறதற்கு இடங்கொடுங்கள்; அவர்களைத் தடைபண்ணாதிருங்கள்; தேவனுடைய ராஜ்யம் அப்படிப்பட்டவர்களுடையது.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'Mark',
    chapter: 10,
    verse: 27,
    scriptureText:
      'இயேசு அவர்களைப் பார்த்து: மனுஷரால் இது கூடாததுதான்; தேவனால் இது கூடாததல்ல; தேவனாலே எல்லாம் கூடும் என்றார்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Mark',
    chapter: 11,
    verse: 24,
    scriptureText:
      'ஆதலால், நீங்கள் நின்று ஜெபம்பண்ணும்போது எவைகளை கேட்டுக்கொள்வீர்களோ, அவைகளைப் பெற்றுகொள்வோம் என்று விசுவாசியுங்கள், அப்பொழுது அவைகள் உங்களுக்கு உண்டாகும் என்று சொல்லுகிறேன்.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Mark',
    chapter: 11,
    verse: 25,
    scriptureText:
      'நீங்கள் ஜெபம்பண்ணும்போது, ஒருவன்பேரில் உங்களுக்கு யாதொரு குறை உண்டாயிருக்குமானால், பரலோகத்திலிருக்கிற உங்கள் பிதா உங்கள் தப்பிதங்களை உங்களுக்கு மன்னிக்கும்படி, அந்தக் குறையை அவனுக்கு மன்னியுங்கள்.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'angry',
  },
  {
    book: 'Luke',
    chapter: 7,
    verse: 13,
    scriptureText: 'கர்த்தர் அவளைப் பார்த்து, அவள்மேல் மனதுருகி: அழாதே என்று சொல்லி,',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'Luke',
    chapter: 12,
    verse: 15,
    scriptureText:
      'பின்பு அவர் அவர்களை நோக்கி: பொருளாசையைக்குறித்து எச்சரிக்கையாயிருங்கள்; ஏனெனில் ஒருவனுக்கு எவ்வளவு திரளான ஆஸ்தி இருந்தாலும் அது அவனுக்கு ஜீவன் அல்ல என்றார்.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Luke',
    chapter: 12,
    verse: 32,
    scriptureText:
      'பயப்படாதே சிறுமந்தையே, உங்களுக்கு ராஜ்யத்தைக் கொடுக்க உங்கள்பிதா பிரியமாயிருக்கிறார்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'Luke',
    chapter: 21,
    verse: 19,
    scriptureText: 'உங்கள் பொறுமையினால் உங்கள் ஆத்துமாக்களைக் காத்துக்கொள்ளுங்கள்.',
    practicePath: 'mind',
    productPillar: 'walk',
    moodTag: 'tempted',
  },
  {
    book: 'Luke',
    chapter: 22,
    verse: 40,
    scriptureText:
      'அவ்விடத்தில் சேர்ந்தபொழுது அவர் அவர்களை நோக்கி: நீங்கள் சோதனைக்குட்படாதபடிக்கு ஜெபம்பண்ணுங்கள் என்று சொல்லி,',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Luke',
    chapter: 23,
    verse: 43,
    scriptureText:
      'இயேசு அவனை நோக்கி: இன்றைக்கு நீ என்னுடனேகூடப் பரதீசிலிருப்பாய் என்று மெய்யாகவே உனக்குச் சொல்லுகிறேன் என்றார்.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 4,
    verse: 14,
    scriptureText:
      'நான் கொடுக்கும் தண்ணீரைக் குடிக்கிறவனுக்கோ ஒருக்காலும் தாகமுண்டாகாது; நான் அவனுக்குக் கொடுக்கும் தண்ணீர் அவனுக்குள்ளே நித்தியஜீவகாலமாய் ஊறுகிற நீரூற்றாயிருக்கும் என்றார்.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'none',
  },
  {
    book: 'John',
    chapter: 5,
    verse: 24,
    scriptureText:
      'என் வசனத்தைக் கேட்டு, என்னை அனுப்பினவரை விசுவாசிக்கிறவனுக்கு நித்தியஜீவன் உண்டு; அவன் ஆக்கினைத்தீர்ப்புக்குட்படாமல், மரணத்தைவிட்டு நீங்கி, ஜீவனுக்குட்பட்டிருக்கிறான் என்று மெய்யாகவே மெய்யாகவே உங்களுக்குச் சொல்லுகிறேன்.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 6,
    verse: 35,
    scriptureText:
      'இயேசு அவர்களை நோக்கி: ஜீவ அப்பம் நானே, என்னிடத்தில் வருகிறவன் ஒருக்காலும் பசியடையான், என்னிடத்தில் விசுவாசமாயிருக்கிறவன் ஒருக்காலும் தாகமடையான்.',
    practicePath: 'body',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 6,
    verse: 37,
    scriptureText:
      'பிதாவானவர் எனக்குக் கொடுக்கிற யாவும் என்னிடத்தில் வரும், என்னிடத்தில் வருகிறவனை நான் புறம்பே தள்ளுவதில்லை.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 8,
    verse: 12,
    scriptureText:
      'மறுபடியும் இயேசு ஜனங்களை நோக்கி: நான் உலகத்திற்கு ஒளியாயிருக்கிறேன், என்னைப் பின்பற்றுகிறவன் இருளிலே நடவாமல் ஜீவஒளியை அடைந்திருப்பான் என்றார்.',
    practicePath: 'soul',
    productPillar: 'word',
    moodTag: 'none',
  },
  {
    book: 'John',
    chapter: 10,
    verse: 11,
    scriptureText: 'நானே நல்ல மேய்ப்பன்: நல்லமேய்ப்பன் ஆடுகளுக்குக்காகத் தன் ஜீவனைக் கொடுக்கிறான்.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 10,
    verse: 27,
    scriptureText:
      'என் ஆடுகள் என் சத்தத்திற்குச் செவிகொடுக்கிறது; நான் அவைகளை அறிந்திருக்கிறேன், அவைகள் எனக்குப் பின்செல்லுகிறது.',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 11,
    verse: 25,
    scriptureText:
      'இயேசு அவளை நோக்கி: நானே உயிர்த்தெழுதலும் ஜீவனுமாயிருக்கிறேன், என்னை விசுவாசிக்கிறவன் மரித்தாலும் பிழைப்பான்;',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 1,
    scriptureText:
      'உங்கள் இருதயம் கலங்காதிருப்பதாக; தேவனிடத்தில் விசுவாசமாயிருங்கள், என்னிடத்திலும் விசுவாசமாயிருங்கள்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 6,
    scriptureText:
      'அதற்கு இயேசு: நானே வழியும் சத்தியமும் ஜீவனுமாயிருக்கிறேன்; என்னாலேயல்லாமல் ஒருவனும் பிதாவினிடத்தில் வரான்.',
    practicePath: 'soul',
    productPillar: 'word',
    moodTag: 'none',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 15,
    scriptureText: 'நீங்கள் என்னிடத்தில் அன்பாயிருந்தால் என் கற்பனைகளைக் கைக்கொள்ளுங்கள்.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 18,
    scriptureText: 'நான் உங்களைத் திக்கற்றவர்களாக விடேன், உங்களிடத்தில் வருவேன்.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 27,
    scriptureText:
      'சமாதானத்தை உங்களுக்கு வைத்துப்போகிறேன், என்னுடைய சமாதானத்தையே உங்களுக்குக் கொடுக்கிறேன்; உலகம் கொடுக்கிறபிரகாரம் நான் உங்களுக்குக் கொடுக்கிறதில்லை. உங்கள் இருதயம் கலங்காமலும் பயப்படாமலுமிருப்பதாக.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'John',
    chapter: 15,
    verse: 5,
    scriptureText:
      'நானே திராட்சச்செடி, நீங்கள் கொடிகள். ஒருவன் என்னிலும் நான் அவனிலும் நிலைத்திருந்தால், அவன் மிகுந்த கனிகளைக் கொடுப்பான்; என்னையல்லாமல் உங்களால் ஒன்றும் செய்யக்கூடாது.',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 15,
    verse: 12,
    scriptureText:
      'நான் உங்களில் அன்பாயிருக்கிறதுபோல நீங்களும் ஒருவரிலொருவர் அன்பாயிருக்கவேண்டுமென்பதே என்னுடைய கற்பனையாயிருக்கிறது.',
    practicePath: 'body',
    productPillar: 'walk',
    moodTag: 'angry',
  },
  {
    book: 'John',
    chapter: 16,
    verse: 22,
    scriptureText:
      'அதுபோல நீங்களும் இப்பொழுது துக்கமடைந்திருக்கிறீர்கள். நான் மறுபடியும் உங்களைக் காண்பேன், அப்பொழுது உங்கள் இருதயம் சந்தோஷப்படும், உங்கள் சந்தோஷத்தை ஒருவனும் உங்களிடத்திலிருந்து எடுத்துப்போடமாட்டான்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 16,
    verse: 33,
    scriptureText:
      'என்னிடத்தில் உங்களுக்குச் சமாதானம் உண்டாயிருக்கும் பொருட்டு இவைகளை உங்களுக்குச் சொன்னேன். உலகத்தில் உங்களுக்கு உபத்திரவம் உண்டு, ஆனாலும் திடன்கொள்ளுங்கள்; நான் உலகத்தை ஜெயித்தேன் என்றார்.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
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

  console.log(`\nValidating ${CURATED_QUOTES.length} quote(s) against data/tamil-ov-nt.json...\n`);

  const results = CURATED_QUOTES.map((quote) => validateQuote(quote, bundled));
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

  const rows = CURATED_QUOTES.map((quote) => ({
    practice_path: quote.practicePath,
    product_pillar: quote.productPillar,
    content_type: 'quote',
    language_code: 'ta',
    time_of_day: 'any',
    mood_tag: quote.moodTag,
    review_status: 'published',
    // content_items_published_at_required (migration ...000002) enforces published_at is set
    // whenever review_status = 'published'.
    published_at: new Date().toISOString(),
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
