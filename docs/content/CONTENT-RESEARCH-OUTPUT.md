## Integration instructions for Claude

Edit exactly these app files during integration:

- `scripts/seed-content.ts`: replace the entire `SAMPLE_QUOTES` array with the `SeedQuote[]` array below.
- `locales/ta.json`: replace only the listed placeholder values under `about.*` and `privacy.body` with Lawrence-approved final copy from Task 2.

After pasting the quotes, run the dry-run validator until all 50 pass:

```bash
npx tsx scripts/seed-content.ts
npm run format
npx tsc --noEmit
npm run lint
```

Do not run `scripts/seed-content.ts --execute` during integration unless Lawrence explicitly provides the required service-role credential and asks for seeding. Do not alter `vow.body`. Do not edit `docs/glass-wall-budget.md`.

Source basis for this handoff:

- Verbatim Tamil scripture text was copied from `data/tamil-ov-nt.json` only.
- The `SeedQuote` contract was read from `scripts/seed-content.ts`.
- Product categories and copy intent were checked against `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, `_bmad-output/planning-artifacts/epics/epic-2.md`, `locales/ta.json`, `CLAUDE.md`, and `docs/content/CODEX-CONTENT-PROMPT.md`.
- Arokia Matha / Vailankanni naming was cross-checked against the official Shrine Basilica of Our Lady of Health Vailankanni site: https://vailankannishrine.net/.

## Task 1 — 50 quotes

```ts
const SAMPLE_QUOTES: SeedQuote[] = [
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
```

| Reference | English gloss | practicePath | productPillar | moodTag | Rationale |
|---|---|---|---|---|---|
| Matthew 4:4 | Human life depends on God's word, not bread alone. | body | word | tempted | Jesus answers bodily temptation by submitting appetite to Scripture. |
| Matthew 4:7 | Do not put the Lord your God to the test. | body | integrity | tempted | Direct answer to presumption disguised as faith. |
| Matthew 4:10 | Worship and serve God alone. | soul | integrity | tempted | Centers exclusive worship when tempted by power. |
| Matthew 5:3 | The poor in spirit are blessed; the kingdom is theirs. | soul | hope_faith_love | none | A foundational kingdom promise for humility before God. |
| Matthew 5:4 | Those who mourn are blessed and will be comforted. | mind | hope_faith_love | grieving | Direct pastoral comfort for sorrow. |
| Matthew 5:9 | Peacemakers are blessed as God's children. | body | walk | angry | Turns conflict energy toward peacemaking. |
| Matthew 5:24 | First be reconciled, then offer your gift. | body | integrity | angry | Makes reconciliation concrete and embodied. |
| Matthew 5:28 | Lustful looking is already heart-level adultery. | body | integrity | tempted | Names inward temptation honestly before it becomes action. |
| Matthew 5:44 | Love enemies and pray for persecutors. | body | walk | angry | Offers Jesus's clearest command for anger and hostility. |
| Matthew 6:14 | Forgive others and your Father will forgive you. | body | integrity | angry | Connects daily forgiveness with spiritual integrity. |
| Matthew 6:25 | Do not worry about life, food, drink, or clothing. | mind | hope_faith_love | anxious | Anchor verse for anxious provision fears. |
| Matthew 6:33 | Seek God's kingdom and righteousness first. | soul | walk | anxious | Reorders anxious striving toward trustful priority. |
| Matthew 6:34 | Do not worry about tomorrow. | mind | hope_faith_love | anxious | Gives a simple daily boundary for worry. |
| Matthew 7:12 | Do for others what you want them to do for you. | body | integrity | angry | Practical relational command that cools retaliation. |
| Matthew 10:31 | Do not fear; you are worth more than many sparrows. | mind | hope_faith_love | anxious | Grounds courage in the Father's care. |
| Matthew 11:28 | Come to me, all who labor, and I will give rest. | mind | hope_faith_love | grieving | Core rest promise for burdened users. |
| Matthew 11:29 | Take my yoke and learn from me; find rest for your souls. | soul | walk | grieving | Comfort is joined to discipleship under Jesus. |
| Matthew 16:24 | Deny yourself, take up your cross, and follow me. | body | walk | tempted | Calls the tempted will into costly discipleship. |
| Matthew 19:26 | With God all things are possible. | mind | hope_faith_love | anxious | Offers hope where human ability has reached its limit. |
| Matthew 26:41 | Watch and pray so you do not enter temptation. | body | integrity | tempted | Required anchor; practical resistance to temptation. |
| Matthew 28:20 | I am with you always, to the end. | soul | walk | lonely | Jesus's abiding presence answers isolation. |
| Mark 4:40 | Why are you afraid? Have you no faith? | mind | hope_faith_love | anxious | Storm context makes it apt for fear and panic. |
| Mark 9:23 | All things are possible to the one who believes. | mind | hope_faith_love | anxious | Encourages faith amid helplessness. |
| Mark 10:14 | Let the little children come to me; do not hinder them. | soul | hope_faith_love | lonely | Shows Jesus welcoming the small and easily excluded. |
| Mark 10:27 | With God all things are possible. | mind | hope_faith_love | anxious | Reinforces trust where salvation and change feel impossible. |
| Mark 11:24 | Pray believing that you receive what you ask. | soul | hope_faith_love | anxious | Directs anxiety into prayerful trust. |
| Mark 11:25 | When praying, forgive anyone you hold anything against. | body | integrity | angry | Pairs prayer with release of resentment. |
| Luke 7:13 | Do not weep. | mind | hope_faith_love | grieving | Jesus speaks compassion into a widow's grief. |
| Luke 12:15 | Beware covetousness; life is not possessions. | body | integrity | tempted | Addresses material temptation without prosperity framing. |
| Luke 12:32 | Fear not, little flock; the Father delights to give the kingdom. | mind | hope_faith_love | lonely | Tender reassurance for small, vulnerable believers. |
| Luke 21:19 | By patience, preserve your souls. | mind | walk | tempted | Encourages endurance under pressure. |
| Luke 22:40 | Pray that you do not enter temptation. | body | integrity | tempted | Gethsemane form of the required temptation anchor. |
| Luke 23:43 | Today you will be with me in Paradise. | soul | hope_faith_love | grieving | Strong comfort at death without speculation beyond Jesus's words. |
| John 4:14 | The water I give becomes a spring of eternal life. | soul | hope_faith_love | none | Spiritual thirst is answered in Christ. |
| John 5:24 | Whoever hears and believes has eternal life. | soul | hope_faith_love | grieving | Assurance of life beyond judgment and death. |
| John 6:35 | I am the bread of life; whoever comes to me will not hunger. | body | hope_faith_love | lonely | Speaks to deep need and welcome in embodied imagery. |
| John 6:37 | Whoever comes to me I will never cast out. | soul | hope_faith_love | lonely | Direct answer to rejection and abandonment. |
| John 8:12 | I am the light of the world; followers will have the light of life. | soul | word | none | Clear identity saying of Jesus for guidance. |
| John 10:11 | I am the good shepherd who gives his life for the sheep. | soul | hope_faith_love | grieving | Christ's sacrificial care comforts the vulnerable. |
| John 10:27 | My sheep hear my voice; I know them and they follow me. | soul | walk | lonely | Answers loneliness through being known by Jesus. |
| John 11:25 | I am the resurrection and the life. | soul | hope_faith_love | grieving | Required anchor for grief and death. |
| John 14:1 | Let not your heart be troubled; believe in God and in me. | mind | hope_faith_love | anxious | Required anchor for troubled hearts. |
| John 14:6 | I am the way, the truth, and the life. | soul | word | none | Central Christological truth, clearly non-syncretic. |
| John 14:15 | If you love me, keep my commandments. | body | integrity | tempted | Love for Jesus becomes obedient action. |
| John 14:18 | I will not leave you orphaned; I will come to you. | soul | hope_faith_love | lonely | Required anchor for abandonment and loneliness. |
| John 14:27 | My peace I give you; do not be troubled or afraid. | mind | hope_faith_love | anxious | Required anchor for Christian peace. |
| John 15:5 | I am the vine; apart from me you can do nothing. | soul | walk | lonely | Communion with Christ is the source of fruitful life. |
| John 15:12 | Love one another as I have loved you. | body | walk | angry | Redirects relational conflict toward Christlike love. |
| John 16:22 | Your sorrow will turn to joy no one can take away. | mind | hope_faith_love | grieving | Pastoral promise for grief with future joy. |
| John 16:33 | Take heart; I have overcome the world. | mind | hope_faith_love | anxious | Courage for trouble without denying trouble. |

## Task 2 — Epic 2 copy

All copy below is DRAFT for Lawrence review. Do not paste into `locales/ta.json` until Lawrence approves or edits it.

| Key | Tamil DRAFT | English back-translation |
|---|---|---|
| `about.nameMeaning.body` | ஆரோக்கியம் என்பது உடல் நலத்தை மட்டும் அல்ல; கிறிஸ்துவில் முழுமை, குணமடைதல், வாழ்வின் நலம் என்பதையும் நினைவுபடுத்தும் தமிழ் சொல். இந்த பெயர் ஆரோக்கிய மாதா / வேளாங்கண்ணி மரபில் பல தமிழ் கிறிஸ்தவர்களுக்கு பரிச்சயமானது; அதே நேரத்தில், இந்த ஆப் கத்தோலிக்கர், பிராட்டஸ்டண்ட், பெந்தெகொஸ்தே, CSI/ஆங்கிலிக்கன் உட்பட எல்லா தமிழ் கிறிஸ்தவர்களுக்கும் இயேசுவின் வார்த்தைகளுக்குத் திரும்ப உதவும் எளிய கருவி. | Arokia is not only bodily health; it is a Tamil word that also recalls wholeness, healing, and well-being of life in Christ. The name is familiar to many Tamil Christians through the Arokia Matha / Vailankanni heritage; at the same time, this app is a simple tool to help all Tamil Christians, including Catholic, Protestant, Pentecostal, and CSI/Anglican believers, return to the words of Jesus. |
| `about.pillars.word` | இயேசுவின் சொந்த வார்த்தைகளை வேதாகமத்தில் இருப்பதுபோல கேட்டு வாசிப்பது. | To hear and read Jesus's own words as they stand in Scripture. |
| `about.pillars.walk` | அவர் சொன்னதை நாள் தோறும் வாழ்வில் நடந்து காட்ட உதவுவது. | To help people walk out what He said in daily life. |
| `about.pillars.hopeFaithLove` | கவலை, துக்கம், தனிமை நேரங்களில் நம்பிக்கை, விசுவாசம், அன்பில் நிலைநிற்க உதவுவது. | To help people stand in hope, faith, and love during anxiety, grief, and loneliness. |
| `about.pillars.integrity` | வசனமும் பணமும் திருத்தங்களும் வெளிப்படையாகவும் உண்மையாயும் நடத்தப்படுவது. | To handle scripture, money, and corrections transparently and truthfully. |
| `about.ecumenical.body` | ஆரோக்கியம் எந்த ஒரு சபை மரபையும் உயர்த்தவோ தாழ்த்தவோ செய்யாது; கத்தோலிக்கர், பிராட்டஸ்டண்ட், பெந்தெகொஸ்தே, CSI/ஆங்கிலிக்கன் மற்றும் எல்லா தமிழ் கிறிஸ்தவர்களும் இயேசுவின் வார்த்தைகளில் ஒன்றுபட உதவுவதே நோக்கம். | Arokia does not raise or lower any one church tradition; its purpose is to help Catholics, Protestants, Pentecostals, CSI/Anglicans, and all Tamil Christians unite around the words of Jesus. |
| `about.correctionProcess.body` | இறையியல் கவலை ஒன்று சமர்ப்பிக்கப்பட்டால், அது பதிவு செய்யப்பட்டு 7 நாட்களுக்குள் மதிப்பாய்வு செய்யப்படும். திருத்தம் தேவை என உறுதிசெய்யப்பட்டால், வசனம் அல்லது ஒலி திருத்தப்பட்டு, மாற்றம் வெளிப்படையாக அறிவிக்கப்படும். | When a theological concern is submitted, it is recorded and reviewed within 7 days. If a correction is confirmed as needed, the verse or audio will be corrected and the change will be disclosed transparently. |
| `privacy.body` | LEGAL DRAFT: ஆரோக்கியம் கணக்கு, உள்நுழைவு, அல்லது அடையாள இணைப்பு இல்லாமல் பயன்படுத்தப்படும் பெயரில்லா ஆப். உங்கள் விருப்ப அமைப்புகள் சாதனத்திலேயே இருக்கும். இறையியல் கவலை படிவத்தில் மின்னஞ்சல் கொடுத்தால், அந்தக் கவலைக்கு பதில் அளிக்க மட்டுமே அது பயன்படுத்தப்படும்; விளம்பரம், சந்தைப்படுத்தல், அல்லது உங்கள் அடையாளத்துடன் உள்ளடக்கத்தை இணைக்க பயன்படுத்தப்படாது. நன்கொடைச் செயல்முறையில் ரசீதுக்குத் தேவைப்படும் தகவல் Razorpay வழியாக தனியாக கையாளப்படும். | LEGAL DRAFT: Arokia is an anonymous app used without an account, login, or identity link. Your preference settings remain on the device. If you provide an email in the theological concern form, it is used only to respond to that concern; it is not used for advertising, marketing, or linking content to your identity. Information needed for donation receipts is handled separately through Razorpay. |

## Open questions & uncertainties for Lawrence

- Please review whether `about.nameMeaning.body` should use `ஆரோக்கிய மாதா`, `ஆரோக்கிய அன்னை`, or both. I used `ஆரோக்கிய மாதா / வேளாங்கண்ணி` because the prompt named Arokia Matha, but Tamil Christian usage varies by denomination and region.
- Please confirm whether Matthew 5:28 should remain in the MVP set. It is a direct word of Jesus and pastorally useful for `tempted`, but its sexual-temptation subject may be more direct than the first-release tone you want.
- Luke 7:13 and Luke 22:40 are direct words of Jesus, but the single Tamil OV verse text includes narrative framing and ends with a comma. They were kept because the schema is single-verse and the words are clear; remove them if you want only verses that read as complete standalone sentences in Tamil.
- Matthew 16:24 in the bundled Tamil OV text has no closing punctuation. This is verbatim from `data/tamil-ov-nt.json`; do not add punctuation during integration.
- John 3:16 was intentionally excluded even though many red-letter editions treat it as Jesus speaking, because the Jesus/narrator speech boundary in John 3 is debated. John 8:11 was also excluded because the single verse includes another speaker's words before Jesus's response.
- Distribution after curation: `practicePath` = mind 16, body 16, soul 18; `moodTag` = anxious 12, grieving 9, angry 7, lonely 8, tempted 10, none 4. This satisfies every mood target, but Lawrence may want more `none` verses for general browsing.
