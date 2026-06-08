# Architecture: Implementation Patterns & Enforcement Rules

## Naming Conventions

### Database (Supabase/Postgres): snake_case everywhere

| Pattern | Correct | Wrong |
|---|---|---|
| Table names | `content_items`, `donations` | `ContentItems`, `Donations` |
| Column names | `verse_reference`, `language_code` | `verseReference`, `languageCode` |
| Foreign keys | `donation_id`, `content_item_id` | `donationId`, `fk_donation` |
| Indexes | `idx_content_items_pub_lang_path` | `content_language_index` |

### TypeScript: camelCase values, PascalCase types and components

```typescript
// DB row:    { verse_reference: "Matthew 6:25", language_code: "ta" }
// TS type:   { verseReference: "Matthew 6:25", languageCode: "ta" }
```

### File Naming

| File type | Convention | Example |
|---|---|---|
| Expo Router routes | kebab-case | `app/verse-detail.tsx`, `app/meditation/[id].tsx` |
| React components | PascalCase | `VerseText.tsx`, `PlayerBar.tsx` |
| Zustand stores | camelCase + `Store` suffix | `audioStore.ts`, `contentStore.ts` |
| Service utilities | camelCase | `supabase.ts`, `audio.ts`, `content.ts` |
| Type definitions | camelCase per feature | `types/content.ts`, `types/donation.ts` |
| i18n locale files | `<language_code>.json` | `ta.json`, `hi.json` |
| Test files | Co-located `.test.tsx` | `VerseText.test.tsx` |

## Canonical Domain Types

```typescript
// types/content.ts — source of truth

type PracticePath  = 'mind' | 'body' | 'soul';       // UX navigation axis
type ProductPillar = 'word' | 'walk' | 'hope_faith_love' | 'integrity';  // Editorial axis
// These are SEPARATE types. A content item has BOTH. Do not merge them.

type ContentType   = 'quote' | 'meditation' | 'lectio' | 'sleep' | 'breathwork';
type TimeOfDay     = 'morning' | 'evening' | 'any';
type MoodTag       = 'anxious' | 'grieving' | 'angry' | 'lonely' | 'tempted' | 'none';
type LanguageCode  = 'ta' | 'hi' | 'te';
type ReviewStatus  = 'draft' | 'source_verified' | 'advisor_reviewed' | 'audio_generated' | 'qa_passed' | 'published' | 'superseded';

interface ContentItem {
  id: string;
  title: string;
  practicePath: PracticePath;
  productPillar: ProductPillar;
  contentType: ContentType;
  languageCode: LanguageCode;
  timeOfDay: TimeOfDay;
  moodTag: MoodTag;
  reviewStatus: ReviewStatus;
  verseReference: string;        // NON-NULLABLE — never string | undefined
  scriptureText: string;         // verbatim Tamil OV — never paraphrased
  audioAssetId: string | null;   // null until audio_generated status
  version: number;
  createdAt: string;
  publishedAt: string | null;
}

// types/donation.ts
interface Donation {
  id: string;
  amountPaise: number;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  donorEmail: string | null;
  razorpayPaymentId: string;
  receivedAt: string;
}

interface AllocationEntry {
  id: string;
  donationId: string;
  bucket: 'operations' | 'pay_forward';
  amountPaise: number;
}

interface Disbursement {
  id: string;
  beneficiaryId: string;
  amountPaise: number;
  paidAt: string | null;
  reference: string | null;
}

// types/analytics.ts
type AnalyticsEventType =
  | 'vow_completed' | 'meditation_started' | 'meditation_completed'
  | 'scripture_link_opened' | 'share_triggered' | 'donation_completed';

interface AnalyticsEvent {
  installId: string;
  eventType: AnalyticsEventType;
  contentId: string | null;
  createdAt: string;
}
```

## Structure Patterns

### Path Aliases (no relative imports)

```json
// tsconfig.json
"paths": { "@/*": ["./*"] }
```

All imports use `@/` prefix — no `../../` chains:
```typescript
import { VerseText } from '@/components/scripture';  // via barrel
import { audioStore } from '@/store/audioStore';
import { getQuotes } from '@/lib/content';
```

### Barrel Exports

```typescript
// components/scripture/index.ts
export { VerseText } from './VerseText';
export { ScriptureCard } from './ScriptureCard';
export { VerseCardView } from './VerseCardView';
// Usage: import { VerseText, ScriptureCard } from '@/components/scripture';
```

Never import directly from `@/components/scripture/VerseText` — always through the barrel.

### Test Co-location

```
components/scripture/
  VerseText.tsx
  __tests__/
    VerseText.test.tsx   ← co-located, not in a top-level __tests__ folder
```

## 10 Mandatory Enforcement Rules

All implementation agents MUST:

1. Use `@/` path aliases — no relative `../../` imports
2. Never access `content.verseReference` with optional chaining (`?.`) — it is non-nullable by contract
3. Never call Supabase directly from components — always through `lib/` service functions
4. Store only relative Supabase Storage paths in `audio_assets.storage_path` — never full CDN URLs
5. Never create donation records outside the Razorpay webhook Edge Function
6. Use `useTranslation()` for all user-facing strings — no hardcoded strings in JSX
7. Never call any Supabase Auth method (`supabase.auth.*`) in v1 or v1.1
8. Never add these packages: `firebase`, `@react-native-firebase/*`, `mixpanel-react-native`, `@amplitude/*`, `@facebook/react-native-fbsdk-next`
9. Always handle the `error` field from every Supabase destructure — never ignore it
10. Pass `verseReference` as a required non-optional prop to all scripture components

## Anti-patterns to Reject in Code Review

```typescript
// ❌ Raw Supabase in component
const { data } = await supabase.from('content_items').select('*');

// ❌ Optional chaining on non-nullable field
<VerseText reference={content.verseReference ?? ''} />

// ❌ Hardcoded UI string
<Text>Start your practice</Text>

// ❌ Full CDN URL stored in DB
await supabase.from('audio_assets').update({ storage_path: 'https://cdn.supabase.co/...' });

// ❌ Auth call
await supabase.auth.signInWithPassword({ email, password });

// ❌ using `any` type
const content: any = await getQuotes('ta');

// ❌ Ignored Supabase error
const { data } = await supabase.from('content_items').select('*');
return data;
```

## Audio URL Storage Rule

```typescript
// DB value:      "ta/quote/abc123.m4a"                  ← store this
// Resolved URL:  supabase.storage.from('audio').getPublicUrl(path).data.publicUrl  ← compute this at runtime
```

`lib/audio.ts:resolveAudioUrl()` is the only place that performs this resolution.
