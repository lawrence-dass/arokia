# Story 1.4: Service Layer, Domain Types & Zustand Store Skeletons

Status: done

## Story

As a developer,
I want typed service functions in `lib/` and initialized Zustand store shells with the full state shape defined,
So that no component ever contains a raw Supabase query and all state patterns are established before any UI story begins.

## Acceptance Criteria

1. **Given** the `lib/` directory  
   **When** inspected  
   **Then** these files exist with typed function signatures: `supabase.ts` (existing), `content.ts` (`getQuotes`, `getMeditations`, `searchContent`), `donations.ts` (`getDonationSummary`, `getPayForwardSummary`, `getDisbursements`), `concerns.ts` (`submitConcern`), `audio.ts` (`resolveAudioUrl`, `downloadTrack`, `prefetchQueue`), `analytics.ts` (`logEvent`)

2. **Given** `types/content.ts`  
   **When** reviewed  
   **Then** it defines exactly: `ContentItem`, `PracticePath` (`'mind'|'body'|'soul'`), `ProductPillar`, `ContentType`, `TimeOfDay`, `MoodTag`, `LanguageCode`, `ReviewStatus` — and `verseReference: string` (never `string | undefined`) on `ContentItem`

3. **Given** `types/donation.ts` and `types/analytics.ts`  
   **When** reviewed  
   **Then** `Donation`, `AllocationEntry`, `Disbursement`, `Beneficiary`, `AnalyticsEvent`, `AnalyticsEventType` are defined as per the architecture

4. **Given** `store/audioStore.ts`, `store/contentStore.ts`, `store/prefsStore.ts`  
   **When** reviewed  
   **Then** each is a Zustand store with the typed state shape defined; state is updated via named actions only — no direct `setState` spreads outside the store

5. **Given** the entire `lib/` and `store/` codebase  
   **When** `tsc --noEmit` is run  
   **Then** zero type errors

6. **Given** a component that uses `import { getQuotes } from '@/lib/content'` or `useAudioStore(state => state.currentTrack)`  
   **When** TypeScript compiles it  
   **Then** zero errors — types flow correctly from store to component

## Tasks / Subtasks

- [x] **Extend `types/content.ts` with full domain types** (AC: 2, 5, 6)
  - [x] Add `PracticePath`, `ProductPillar`, `ContentType`, `TimeOfDay`, `MoodTag`, `LanguageCode`, `ReviewStatus` union types
  - [x] Add `ContentItem` interface (keep existing `ScriptureVerse` — do not remove it)
  - [x] Update `types/index.ts` barrel to re-export all new types

- [x] **Create `types/donation.ts`** (AC: 3, 5)
  - [x] Define `Donation`, `AllocationEntry`, `Disbursement`, `Beneficiary` interfaces
  - [x] Define `DonationSummary` and `PayForwardSummary` return-type interfaces (used by `lib/donations.ts`)
  - [x] Export from `types/index.ts`

- [x] **Create `types/analytics.ts`** (AC: 3, 5)
  - [x] Define `AnalyticsEventType` union type
  - [x] Define `AnalyticsEvent` interface
  - [x] Export from `types/index.ts`

- [x] **Create `types/concern.ts`** (AC: 5)
  - [x] Define `TheologicalConcern` interface matching `theological_concerns` DB schema
  - [x] Export from `types/index.ts`

- [x] **Create `lib/content.ts`** (AC: 1, 5, 6)
  - [x] `getQuotes(lang: LanguageCode, practicePath?: PracticePath, moodTag?: MoodTag): Promise<ContentItem[]>`
  - [x] `getMeditations(lang: LanguageCode, practicePath?: PracticePath): Promise<ContentItem[]>`
  - [x] `searchContent(lang: LanguageCode, query: string): Promise<ContentItem[]>`
  - [x] Each function: filters `review_status = 'published'`; destructures `{ data, error }`; throws on error; maps DB rows through `transformContentItem()` for snake_case → camelCase

- [x] **Create `lib/donations.ts`** (AC: 1, 5)
  - [x] `getDonationSummary(): Promise<DonationSummary>`
  - [x] `getPayForwardSummary(): Promise<PayForwardSummary>`
  - [x] `getDisbursements(): Promise<Disbursement[]>`

- [x] **Create `lib/concerns.ts`** (AC: 1, 5)
  - [x] `submitConcern(description: string, contentItemId?: string, email?: string): Promise<void>`
  - [x] INSERT into `theological_concerns`; throw on error

- [x] **Create `lib/audio.ts`** (AC: 1, 5)
  - [x] `resolveAudioUrl(audioAssetId: string): Promise<string>` — fetches `audio_assets.storage_path` then calls `supabase.storage.from('audio').getPublicUrl(path)`
  - [x] `downloadTrack(contentItemId: string): Promise<string>` — stub: throws `Error('downloadTrack: requires expo-file-system — implement in Story 1.6')`
  - [x] `prefetchQueue(queue: string[]): Promise<void>` — stub: no-op with console.warn

- [x] **Create `lib/analytics.ts`** (AC: 1, 5)
  - [x] `logEvent(eventType: AnalyticsEventType, contentId?: string): Promise<void>` — stub: `console.log('[analytics]', eventType, contentId)` with TODO for SecureStore install_id

- [x] **Create `store/audioStore.ts`** (AC: 4, 5, 6)
  - [x] Full typed `AudioState` interface with all fields and named action signatures
  - [x] Zustand `create<AudioState>()` with curried form
  - [x] Implement all state actions — no RNTP calls yet (RNTP installed in Story 1.6); action bodies update store state only

- [x] **Create `store/contentStore.ts`** (AC: 4, 5, 6)
  - [x] Full typed `ContentState` interface
  - [x] `fetchQuotes` and `fetchMeditations` call `lib/content.ts` functions; set `isLoading`, catch errors to `error` field
  - [x] `setFilter` and `clearFilters` actions update `activeFilters`

- [x] **Create `store/prefsStore.ts`** (AC: 4, 5, 6)
  - [x] Full typed `PrefsState` interface
  - [x] Simple create (no persistence middleware yet — add in Story 2.1 when vow gate is built)
  - [x] `setPlaybackSpeed`, `acknowledgeVow` actions

- [x] **Type-check** (AC: 5, 6)
  - [x] `npx tsc --noEmit` passes with 0 errors
  - [x] `npm run lint` passes with 0 errors

## Dev Notes

### Critical: What Already Exists (Do Not Overwrite)

| File | Current State | Action |
|---|---|---|
| `types/content.ts` | Has only `ScriptureVerse` interface | Extend — add all new types, keep `ScriptureVerse` |
| `types/index.ts` | Re-exports `ScriptureVerse` only | Extend barrel with all new types |
| `lib/supabase.ts` | Singleton client, already correct | Do not touch |
| `lib/sqlite.ts` | Scripture queries (Story 1.3) | Do not touch |
| `lib/i18n.ts` | i18n init | Do not touch |
| `store/` | Directory exists, empty | Create 3 new files inside |

### Zustand 5.x API (^5.0.12 installed — NOT v4)

Zustand 5 changed the `create` API for TypeScript. Use the **curried form only**:

```typescript
import { create } from 'zustand';

export const useAudioStore = create<AudioState>()((set, get) => ({
  currentTrack: null,
  // ...actions
  playTrack: (content) => set({ currentTrack: content, isPlaying: true }),
}));
```

- `create<T>()(fn)` — the double-call is required for TypeScript inference in Zustand 5
- `immer` middleware import: `import { immer } from 'zustand/middleware/immer'`
- `persist` middleware: **do NOT add in this story** — `@react-native-async-storage/async-storage` is not installed; add in Story 2.1
- No `devtools` middleware in this story (no dev client build profile yet; Story 1.5)

### Full Canonical Type Definitions

Paste these verbatim — they are the architecture source of truth:

```typescript
// types/content.ts — add BELOW the existing ScriptureVerse interface

export type PracticePath   = 'mind' | 'body' | 'soul';
export type ProductPillar  = 'word' | 'walk' | 'hope_faith_love' | 'integrity';
export type ContentType    = 'quote' | 'meditation' | 'lectio' | 'sleep' | 'breathwork';
export type TimeOfDay      = 'morning' | 'evening' | 'any';
export type MoodTag        = 'anxious' | 'grieving' | 'angry' | 'lonely' | 'tempted' | 'none';
export type LanguageCode   = 'ta' | 'hi' | 'te';
export type ReviewStatus   = 'draft' | 'source_verified' | 'advisor_reviewed' | 'audio_generated' | 'qa_passed' | 'published' | 'superseded';

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
  verseReference: string;       // NON-NULLABLE — never string | undefined
  scriptureText: string;
  audioAssetId: string | null;  // null until audio_generated status
  version: number;
  createdAt: string;
  publishedAt: string | null;
}
```

```typescript
// types/donation.ts
export interface Donation {
  id: string;
  amountPaise: number;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  donorEmail: string | null;
  razorpayPaymentId: string;
  receivedAt: string;
}

export interface AllocationEntry {
  id: string;
  donationId: string;
  bucket: 'operations' | 'pay_forward';
  amountPaise: number;
  createdAt: string;
}

export interface Disbursement {
  id: string;
  beneficiaryId: string;
  amountPaise: number;
  paidAt: string | null;
  reference: string | null;
  createdAt: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  quarter: string;
  active: boolean;
}

export interface DonationSummary {
  totalDonatedPaise: number;
  confirmedCount: number;
}

export interface PayForwardSummary {
  totalPayForwardPaise: number;
  totalDisbursedPaise: number;
  netAvailablePaise: number;
}
```

```typescript
// types/analytics.ts
export type AnalyticsEventType =
  | 'vow_completed'
  | 'meditation_started'
  | 'meditation_completed'
  | 'scripture_link_opened'
  | 'share_triggered'
  | 'donation_completed';

export interface AnalyticsEvent {
  installId: string;
  eventType: AnalyticsEventType;
  contentId: string | null;
  createdAt: string;
}
```

```typescript
// types/concern.ts
export interface TheologicalConcern {
  id: string;
  contentItemId: string | null;
  description: string;
  submitterEmail: string | null;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  createdAt: string;
}
```

### DB → TypeScript Transformation Pattern

All `lib/content.ts`, `lib/donations.ts`, etc. receive snake_case DB rows and must return camelCase TS types. Create a private `transformContentItem` helper (not exported — internal to `lib/content.ts`):

```typescript
// Internal DB row shape (snake_case from Supabase)
interface ContentItemRow {
  id: string;
  title: string;
  practice_path: string;
  product_pillar: string;
  content_type: string;
  language_code: string;
  time_of_day: string;
  mood_tag: string;
  review_status: string;
  verse_reference: string;
  scripture_text: string;
  audio_asset_id: string | null;
  version: number;
  created_at: string;
  published_at: string | null;
}

function transformContentItem(row: ContentItemRow): ContentItem {
  return {
    id: row.id,
    title: row.title,
    practicePath: row.practice_path as PracticePath,
    productPillar: row.product_pillar as ProductPillar,
    contentType: row.content_type as ContentType,
    languageCode: row.language_code as LanguageCode,
    timeOfDay: row.time_of_day as TimeOfDay,
    moodTag: row.mood_tag as MoodTag,
    reviewStatus: row.review_status as ReviewStatus,
    verseReference: row.verse_reference,   // NOT NULL in DB — safe to assign directly
    scriptureText: row.scripture_text,
    audioAssetId: row.audio_asset_id,
    version: row.version,
    createdAt: row.created_at,
    publishedAt: row.published_at,
  };
}
```

Define similar transforms in `lib/donations.ts` for donation, allocation, disbursement rows.

### Service Layer Error Pattern (Three-Tier)

```typescript
// lib/content.ts — Tier 1: throws, placeholder for Sentry (Story 1.5)
export async function getQuotes(
  lang: LanguageCode,
  practicePath?: PracticePath,
  moodTag?: MoodTag
): Promise<ContentItem[]> {
  let query = supabase
    .from('content_items')
    .select('*')
    .eq('language_code', lang)
    .eq('review_status', 'published')
    .eq('content_type', 'quote');

  if (practicePath) query = query.eq('practice_path', practicePath);
  if (moodTag && moodTag !== 'none') query = query.eq('mood_tag', moodTag);

  const { data, error } = await query;
  if (error) {
    console.error('[content] getQuotes error:', error); // TODO: Sentry.captureException(error) in Story 1.5
    throw error;
  }
  return (data as ContentItemRow[]).map(transformContentItem);
}
```

```typescript
// store/contentStore.ts — Tier 2: catches, sets error state
fetchQuotes: async (lang) => {
  set({ isLoading: true, error: null });
  try {
    const quotes = await getQuotes(lang);
    set({ quotes, isLoading: false });
  } catch {
    set({ error: 'errors.offline', isLoading: false });
  }
},
```

### Store State Shapes

```typescript
// store/audioStore.ts
interface AudioState {
  currentTrack: ContentItem | null;
  isPlaying: boolean;
  isBuffering: boolean;
  speed: 0.75 | 1 | 1.25;
  sleepTimerMinutes: 0 | 15 | 30 | 45;
  downloadedTracks: Record<string, string>; // contentId → localFilePath
  // Actions
  playTrack: (content: ContentItem) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  setSpeed: (speed: AudioState['speed']) => void;
  setSleepTimer: (minutes: AudioState['sleepTimerMinutes']) => void;
  addDownload: (contentId: string, localPath: string) => void;
  clearDownloads: () => void;
}
```

Action bodies in `audioStore` update store state only — do NOT call RNTP yet (RNTP is installed in Story 1.6). `playTrack` sets `currentTrack` and `isPlaying: true`; RNTP wiring is Story 1.6's job.

```typescript
// store/contentStore.ts
interface ContentState {
  quotes: ContentItem[];
  meditations: ContentItem[];
  activeFilters: {
    practicePath: PracticePath | null;
    moodTag: MoodTag | null;
  };
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchQuotes: (lang: LanguageCode) => Promise<void>;
  fetchMeditations: (lang: LanguageCode) => Promise<void>;
  setFilter: (filter: Partial<ContentState['activeFilters']>) => void;
  clearFilters: () => void;
}
```

```typescript
// store/prefsStore.ts
interface PrefsState {
  playbackSpeed: 0.75 | 1 | 1.25;
  vowAcknowledged: boolean;
  lastVowAppVersion: string;
  // Actions
  setPlaybackSpeed: (speed: PrefsState['playbackSpeed']) => void;
  acknowledgeVow: (appVersion: string) => void;
  resetVow: () => void; // used when vow version changes (Story 2.2)
}
```

No `persist` middleware in this story — add in Story 2.1 with `@react-native-async-storage/async-storage`.

### `lib/audio.ts` — resolveAudioUrl Full Implementation

`resolveAudioUrl` can be fully implemented (Supabase client already available). The other two are stubs:

```typescript
import { supabase } from '@/lib/supabase';

export async function resolveAudioUrl(audioAssetId: string): Promise<string> {
  const { data, error } = await supabase
    .from('audio_assets')
    .select('storage_path')
    .eq('id', audioAssetId)
    .single();
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from('audio')
    .getPublicUrl(data.storage_path);
  return urlData.publicUrl;
}

export async function downloadTrack(_contentItemId: string): Promise<string> {
  // TODO Story 1.6: implement with expo-file-system after RNTP spike validates managed workflow
  throw new Error('downloadTrack: expo-file-system not yet installed');
}

export async function prefetchQueue(_queue: string[]): Promise<void> {
  // TODO Story 1.6: implement progressive prefetch after expo-file-system is installed
  console.warn('[audio] prefetchQueue: stub — implement in Story 1.6');
}
```

### `lib/analytics.ts` — Stub (SecureStore not installed)

`expo-secure-store` is not in `package.json` yet. Stub `install_id` with a hardcoded placeholder:

```typescript
import { supabase } from '@/lib/supabase';
import type { AnalyticsEventType } from '@/types';

export async function logEvent(
  eventType: AnalyticsEventType,
  contentId?: string
): Promise<void> {
  // TODO: replace 'UNKNOWN' with UUID from expo-secure-store (Story 1.7 spikes)
  const installId = 'UNKNOWN';
  const { error } = await supabase.from('analytics_events').insert({
    install_id: installId,
    event_type: eventType,
    content_id: contentId ?? null,
  });
  if (error) {
    console.error('[analytics] logEvent error:', error);
  }
}
```

### `types/index.ts` — Final Barrel

```typescript
export type { ScriptureVerse } from './content';
export type {
  ContentItem, PracticePath, ProductPillar, ContentType,
  TimeOfDay, MoodTag, LanguageCode, ReviewStatus,
} from './content';
export type {
  Donation, AllocationEntry, Disbursement, Beneficiary,
  DonationSummary, PayForwardSummary,
} from './donation';
export type { AnalyticsEvent, AnalyticsEventType } from './analytics';
export type { TheologicalConcern } from './concern';
```

### 10 Mandatory Enforcement Rules (Must Follow)

1. Use `@/` path aliases — no relative `../../` imports
2. Never access `content.verseReference` with optional chaining (`?.`) — it is non-nullable by contract
3. Never call Supabase directly from components — always through `lib/` service functions
4. Store only relative Supabase Storage paths in DB — never full CDN URLs
5. Never create donation records — only the webhook Edge Function does
6. Use `useTranslation()` for all user-facing strings — no hardcoded strings in JSX
7. Never call any `supabase.auth.*` method
8. Never add forbidden packages: `firebase`, `mixpanel-react-native`, `@amplitude/*`, etc.
9. Always destructure and handle the `error` field from every Supabase call
10. `verseReference` is required and non-nullable — never `content.verseReference ?? ''`

### No New npm Install Required

Zustand `^5.0.12` is already in `package.json`. All service layer files use only:
- `@supabase/supabase-js` (already installed — via `lib/supabase.ts`)
- `zustand` (already installed)
- `@/types` imports (created in this story)

No `npm install` commands needed for this story.

### Previous Story Patterns to Follow

From Story 1.3 (lib/sqlite.ts):
- Single-responsibility: each `lib/` file owns exactly one domain
- No default exports in `lib/` — named exports only
- Import the `supabase` singleton via `import { supabase } from '@/lib/supabase'`
- Use TypeScript generics on Supabase queries: `.getAllAsync<RowType>()` pattern (for sqlite); same idea with Supabase's `select<Type>()` via type assertions

From Story 1.2 (supabase.ts):
- `lib/supabase.ts` throws at import time if env vars missing — existing behavior, don't change it

### File List (this story creates/modifies)

**Extends (do not recreate from scratch):**
- `types/content.ts` — add domain types below `ScriptureVerse`
- `types/index.ts` — extend barrel

**Creates:**
- `types/donation.ts`
- `types/analytics.ts`
- `types/concern.ts`
- `lib/content.ts`
- `lib/donations.ts`
- `lib/concerns.ts`
- `lib/audio.ts`
- `lib/analytics.ts`
- `store/audioStore.ts`
- `store/contentStore.ts`
- `store/prefsStore.ts`

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-1.md#Story 1.4]
- [Source: _bmad-output/planning-artifacts/architecture/api-patterns.md#Service Layer]
- [Source: _bmad-output/planning-artifacts/architecture/api-patterns.md#Zustand Store Conventions]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns.md#Canonical Domain Types]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns.md#10 Mandatory Enforcement Rules]
- [Source: _bmad-output/planning-artifacts/architecture/data.md#Supabase Schema]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure.md#Complete Directory Structure]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.6 (claude-sonnet-4-6)

### Debug Log References
None

### Completion Notes List

All 13 tasks complete. Implemented:
- types/content.ts: extended with PracticePath, ProductPillar, ContentType, TimeOfDay, MoodTag, LanguageCode, ReviewStatus, ContentItem (ScriptureVerse preserved)
- types/donation.ts, types/analytics.ts, types/concern.ts: all domain types per canonical definitions
- types/index.ts: barrel updated to export all new types
- lib/content.ts: getQuotes, getMeditations, searchContent with transformContentItem helper (snake_case → camelCase)
- lib/donations.ts: getDonationSummary, getPayForwardSummary, getDisbursements with transformDisbursement
- lib/concerns.ts: submitConcern INSERT into theological_concerns
- lib/audio.ts: resolveAudioUrl (full impl), downloadTrack (stub for Story 1.6), prefetchQueue (stub)
- lib/analytics.ts: logEvent stub with UNKNOWN install_id (TODO Story 1.7)
- store/audioStore.ts: Zustand 5 curried form, full AudioState with 7 named actions
- store/contentStore.ts: fetchQuotes/fetchMeditations call lib/content, error maps to errors.offline i18n key
- store/prefsStore.ts: simple store, no persist middleware (Story 2.1)
- npx tsc --noEmit: 0 errors; npm run lint: 0 errors, 1 pre-existing warning in lib/i18n.ts

Code review (2026-06-08): 10 patches applied — null guards on Supabase data returns, searchContent wildcard escaping, resolveAudioUrl null/empty guards, logEvent reverted to console.log stub, submitConcern validation, contentStore activeFilters plumbing, playTrack null audioAssetId guard, acknowledgeVow empty string guard, downloadTrack message fix. tsc: 0 errors, lint: 0 errors.
Agent: Claude Sonnet 4.6 (claude-sonnet-4-6)

### File List

**Extended:**
- types/content.ts
- types/index.ts

**Created:**
- types/donation.ts
- types/analytics.ts
- types/concern.ts
- lib/content.ts
- lib/donations.ts
- lib/concerns.ts
- lib/audio.ts
- lib/analytics.ts
- store/audioStore.ts
- store/contentStore.ts
- store/prefsStore.ts

### Change Log

- 2026-06-08: Implemented full service layer, domain types, and Zustand store skeletons (Story 1.4 complete)

### Review Findings

- [x] [Review][Defer] audioStore missing `queue` and `cacheManifest` state fields — CLAUDE.md specifies audioStore covers "RNTP playback state, queue, cache manifest, sleep timer" but the story-spec state shape has neither. Decide: add as empty placeholders now, or formally defer to Story 1.6?
- [x] [Review][Patch] `logEvent` stub form ambiguity — task checklist says "stub: `console.log('[analytics]', eventType, contentId)`" but Dev Notes code block shows a live Supabase `insert` with hardcoded `'UNKNOWN'` install_id, polluting production data. — FIXED: reverted to pure console.log stub; no DB writes until Story 1.7
- [x] [Review][Dismiss] Duplicate `speed` / `playbackSpeed` fields with no sync — `audioStore.speed` and `prefsStore.playbackSpeed` are both `0.75 | 1 | 1.25` with no synchronisation mechanism. — DISMISSED: intentional split (runtime state vs persisted preference); sync contract documented in store comments

- [ ] [Review][Patch] Supabase `data` null guards missing — `getQuotes`, `getMeditations`, `searchContent` call `.map()` on `data` without null guard; use `(data ?? [])` [lib/content.ts:34,41,47]
- [x] [Review][Patch] Supabase `data` null guards missing in donations — `getDonationSummary`, `getPayForwardSummary`, `getDisbursements` call filter/reduce/map on potentially null data [lib/donations.ts:20,28,31,36]
- [x] [Review][Patch] `searchContent` missing empty-query guard and wildcard escaping — empty string produces `ilike '%%'` returning all content; `%` / `_` characters in user input produce unintended broad matches [lib/content.ts:47]
- [x] [Review][Patch] `resolveAudioUrl` missing null/empty guards — no null check on `data` before `data.storage_path`; no guard for empty `storage_path`; no guard for empty `publicUrl` return [lib/audio.ts:3-11]
- [x] [Review][Patch] `contentStore` fetch methods ignore `activeFilters` — `fetchQuotes` and `fetchMeditations` call service functions without passing `practicePath` / `moodTag` from `activeFilters`; filter state is dead [store/contentStore.ts:28,38]
- [x] [Review][Patch] `submitConcern` missing input validation — empty `description` accepted; `email` not format-validated before DB insert [lib/concerns.ts:3-16]
- [x] [Review][Patch] `playTrack` called with null `audioAssetId` — no guard; sets `isPlaying: true` with no resolvable audio URL [store/audioStore.ts:29]
- [x] [Review][Patch] `acknowledgeVow` accepts empty string `appVersion` — stores `''` as `lastVowAppVersion`, breaking version-bump re-prompt logic [store/prefsStore.ts:18]
- [x] [Review][Patch] `downloadTrack` error message deviates from spec — spec requires exact wording: `'downloadTrack: requires expo-file-system — implement in Story 1.6'` [lib/audio.ts:14]

- [x] [Review][Defer] `prefsStore` no persistence — intentionally deferred to Story 2.1 per spec [store/prefsStore.ts] — deferred, pre-existing
- [x] [Review][Defer] Donation/disbursement queries hit Supabase 1000-row default limit — full-table fetch silently truncates; financial summary incorrect at scale [lib/donations.ts] — deferred, pre-existing
- [x] [Review][Defer] RNTP teardown missing from `playTrack` — state-only update is correct until Story 1.6 wires RNTP [store/audioStore.ts:29] — deferred, pre-existing
- [x] [Review][Defer] `resumeAudio` / `clearDownloads` RNTP guards — both need RNTP state awareness; Story 1.6 concern [store/audioStore.ts:31,37] — deferred, pre-existing
- [x] [Review][Defer] `AnalyticsEvent` interface missing `id` field — not required by story spec; add when events are read back [types/analytics.ts] — deferred, pre-existing
- [x] [Review][Defer] No runtime schema validation at Supabase boundary — type assertions with no Zod layer; schema drift is undetected — deferred, pre-existing
- [x] [Review][Defer] `logEvent` silently swallows insert errors — intentional; analytics is non-critical path [lib/analytics.ts:10] — deferred, pre-existing
- [x] [Review][Defer] Concurrent `fetchQuotes` / `fetchMeditations` share single `isLoading` flag — race requires interface change; spec mandates shared flag [store/contentStore.ts] — deferred, pre-existing
