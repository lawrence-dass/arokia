---
stepsCompleted: ['step-01-init', 'step-02-context', 'step-03-starter', 'step-04-decisions', 'step-05-patterns', 'step-06-structure', 'step-07-validation', 'step-08-complete']
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-04-25'
lastAmendedAt: '2026-04-25'
amendmentReason: 'Post-validation analysis review: schema redesign, audio format fix, analytics, content ops pipeline'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
workflowType: 'architecture'
project_name: 'arokia'
user_name: 'Lawrence'
date: '2026-04-25'
---

# Architecture Decision Document — Arokia

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (42 MVP + 10 v1.1):**

| Category | FRs | Architectural weight |
|---|---|---|
| Onboarding & Theological Framing | FR1–5 | First-launch state machine; non-skippable vow gating all content |
| Daily Practice Navigation | FR6–9 | Triune home routing; content filter by pillar + mood_tag |
| Scripture & Content Discovery | FR10–14, FR41 | Scripture browser; search; verse attribution enforced at component level |
| Audio Meditation Playback | FR15–22 | Background audio service; offline cache; lockscreen controls; sleep timer; speed control |
| Donation & Financial Transparency | FR23–29 | Razorpay external webview; atomic webhook handler; Glass-Wall Budget as git-tracked markdown |
| Theological Integrity & Correction | FR30–33 | No-auth form; email notification; Supabase-based operator review; 7-day SLA |
| Sharing & Community | FR34–35, FR42 | On-device verse card generation (offline-capable); mandatory attribution; share sheet |
| Operator & Content Administration | FR36–40 | Supabase admin (no custom UI); per-track audio regeneration; Sentry; Razorpay dashboard |
| v1.1 FRs (architect-for, not build) | FR-V1-01–10 | Kaalai/Maalai time-of-day navigation; sleep content category; local personal highlights |

**Non-Functional Requirements (34 total):**

- **Performance (6):** Cold start ≤2s Android mid-range; audio ≤500ms cached; ≤150MB memory; list render ≤1s; offline package ≤50MB; verse card generation fully on-device
- **Security (5):** TLS 1.2+; no payment PII in Arokia DB; Razorpay HMAC webhook verification; email consent-gated; quarterly tracker audit
- **Reliability (4):** Crash ≤0.1%; graceful phone-call audio pause/resume; offline graceful degradation; atomic donation record on confirmed webhook only
- **Scalability (3):** 100→15K MAU, no architecture change; audio CDN-cached (10× users = zero DB query increase); new language = locale JSON + content data only
- **Accessibility (5):** 48dp touch targets; system font scale 1.5×; WCAG AA contrast; 2-tap to today's content; lockscreen controls VoiceOver/TalkBack compatible
- **Privacy (4):** No account for core use; no identity-linked analytics; donor email receipt-only; accurate App Store privacy nutrition labels
- **Audio Design Standards (4):** 1× pace + 20-30% keerthanai for standard; 0.7× + softer keerthanai for sleep; Christian-only keerthanai sourcing; verbal breath cues for breathwork
- **Internationalisation (3):** Zero hardcoded UI strings; language_code on every content record; system Tamil fonts only

**Scale & Complexity:**

- Primary domain: React Native mobile (iOS + Android) with Supabase backend and static audio CDN
- Complexity level: Medium — low auth surface, low DB write volume, medium audio pipeline, medium i18n architecture
- MAU trajectory: 100 → 15,000 without architecture change; Supabase free → Pro is the sole operational scaling step
- Estimated architectural components: Mobile app shell · Audio service layer · Content data layer (Supabase) · Scripture text bundle (local SQLite/JSON) · Donation webhook handler (Supabase Edge Function) · Glass-Wall Budget (git markdown → static render) · i18n locale system · On-device verse card renderer · Operator tooling (Supabase admin + Sentry + Razorpay dashboard)

### Technical Constraints & Dependencies

| Constraint | Impact |
|---|---|
| React Native + Expo (managed → possible bare eject) | Background audio with react-native-track-player must be validated in Week 1; eject before any app code if required |
| ElevenLabs Multilingual v2 | Generate-once-cache-forever; batch scriptable; per-track regeneration must be a simple CLI/script operation |
| Supabase (Postgres + Storage + Auth) | Free tier: 500MB DB, 1GB storage, 50K MAU; upgrade path to Pro is clear and non-breaking |
| Razorpay via external webview | Avoids App Store 30% cut; no in-app purchase surface; webhook HMAC must be verified server-side (Supabase Edge Function) |
| Tamil OV Bible (public domain) | Locally bundled; no network dependency for scripture text; Expo SQLite or static JSON |
| TypeScript strict mode | Architectural contract from Day 1; verse attribution and content schema types must be defined and enforced |
| NativeWind (Tailwind for RN) | Utility-class styling; Tamil is LTR; no RTL complexity |
| Zustand | Lightweight state for audio player, user preferences, content filters; no Redux boilerplate |
| react-navigation v6+ | Deep-link ready for WhatsApp share URLs |

### Cross-Cutting Concerns Identified

1. **i18n** — Affects every UI component; react-i18next locale files are the single source of all UI text; zero hardcoded strings from commit one
2. **Verse attribution enforcement** — Scripture rendering is a typed component with mandatory `verse_reference` prop; invalid state = missing attribution = build-time error
3. **Offline capability** — Scripture text and audio work fully offline; donation flow degrades with clear network indicator; verse card generation is always offline-capable
4. **Audio service state** — react-native-track-player state is global; affects home screen, player screen, navigation transitions, background service lifecycle
5. **Theological integrity at data layer** — Content schema enforces `verse_reference` as NOT NULL; `content_type`, `language_code`, `time_of_day` required on insert; these constraints live in Supabase schema, not just application code
6. **Privacy in build pipeline** — No Firebase/GA/Mixpanel in Podfile or build.gradle; quarterly CI audit catches accidental tracker introduction
7. **Donation webhook integrity** — HMAC verification + donation record creation + pay-it-forward allocation in one atomic Supabase Edge Function transaction; no batch reconciliation path exists

## Starter Template Evaluation

### Primary Technology Domain

React Native mobile app (cross-platform iOS + Android) with Expo SDK 54/55 — confirmed by PRD project classification and agreed tech stack.

### Starter Options Considered

| Starter | TypeScript | NativeWind | Supabase | Routing | State | Verdict |
|---|---|---|---|---|---|---|
| `create-expo-app --template blank-typescript` | ✅ | ❌ manual | ❌ manual | ❌ manual | ❌ manual | Too bare — adds significant setup hours |
| `create-expo-app --template default` | ✅ | ❌ | ❌ | Expo Router | ❌ | Routing only; everything else manual |
| Ignite CLI v11.5 ("Bison") | ✅ | ❌ | ❌ | RN Nav v7 | MobX-ST | Wrong state library; incompatible with NativeWind choice |
| **`create-expo-stack@latest`** | ✅ | ✅ | ✅ | Expo Router | Zustand option | **Selected — best fit for agreed stack** |
| Sonnysam's starter-template-expo | ✅ | ✅ | ✅ | varies | Zustand | Community; lower maintenance confidence |

### Selected Starter: `create-expo-stack@latest`

**Rationale for Selection:**
`create-expo-stack` (by RoninOSS) interactively scaffolds an Expo project with exactly the combination locked in the PRD — TypeScript + NativeWind v4 + Expo Router + Supabase client. It is well-maintained, aligned with Expo SDK 54/55, and eliminates hours of boilerplate wiring. Expo Router (file-based routing, built on react-navigation v6 under the hood) satisfies the PRD's "react-navigation v6+" requirement and delivers WhatsApp deep-link routing with zero manual configuration.

**Initialization Command:**

```bash
npx create-expo-stack@latest arokia --expo-router --nativewind --supabase
# Zustand selected interactively during CLI prompts
# TypeScript strict mode enabled manually in tsconfig.json post-scaffold
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript; strict mode configured manually post-init in `tsconfig.json` (`"strict": true`).

**Routing:**
Expo Router v4 — file-based routing with `app/` directory convention. Deep links for WhatsApp share URLs work out of the box. Stack, tab, and modal navigation via file structure.

**Styling Solution:**
NativeWind v4 — Tailwind CSS utility classes via `className` prop on all React Native components. Tamil is LTR; no RTL complexity. Consistent with potential future web presence.

**Build Tooling:**
Expo EAS Build — cloud builds for iOS + Android; no local Xcode or Android Studio required for CI. Expo Updates handles OTA JS-layer changes (theological corrections, content updates) without App Store review cycle.

**Code Organization:**
```
app/           # Expo Router file-based routes
components/    # Shared UI components (ScriptureCard, AudioPlayer, etc.)
lib/           # Utilities (supabase client, i18n setup, audio service)
constants/     # Theme tokens, config, Tamil OV verse references
locales/       # react-i18next locale files (ta.json, hi.json, ...)
assets/        # Static assets (icons, splash)
store/         # Zustand stores (audio, preferences, content filters)
```

**Development Experience:**
Expo Go for rapid iteration on JS layer; EAS Build for native module validation; Metro bundler with fast refresh.

**What We Add Manually Post-Scaffold:**

- `react-native-track-player` — audio service (requires bare workflow validation in Week 1)
- `react-i18next` + `/locales/ta.json` locale file (all UI strings externalized from Day 1)
- Zustand store structure (`audioStore`, `prefsStore`, `contentStore`)
- Sentry DSN configuration
- Tamil OV Bible content bundle (Expo SQLite or static JSON — decision in step 4)
- Razorpay utility (external webview/SFSafariViewController wrapper)
- ElevenLabs audio generation scripts (CLI, not in-app)
- Quarterly CI tracker audit workflow

**Critical Week-1 Technical Spike (validate before writing app screens):**

The architecture is not considered locked until all five of these pass on a physical device:

| Spike | What to prove | Pass criteria |
|---|---|---|
| Tamil text rendering | System fonts render Tamil Unicode correctly on Android + iOS | No glyph fallback, correct ligatures, no layout overflow |
| RNTP background audio | react-native-track-player plays audio with screen locked on both platforms | Lockscreen controls visible; audio resumes after call |
| Audio format + size | 64 kbps mono AAC generated by ElevenLabs | File plays clearly; 7-min file ≤ 3.5 MB |
| Offline cache | expo-file-system downloads + plays from documentDirectory without network | Airplane mode test passes; no network calls during playback |
| Razorpay flow on device | Razorpay external webview completes a test payment, webhook fires, DB record created | Both iOS and Android; test mode payment confirmed end-to-end |

If RNTP requires bare workflow (ejection from Expo managed), eject before any app screens are written. This remains the single highest-risk technical decision of Week 1.

**Content Operations Pipeline (core architecture, not a feature):**

Arokia is first a content-review, audio-generation, correction, and publishing system. The mobile client is what users see, but the content pipeline is what makes the product trustworthy. The pipeline is:

```
1. Curate     — Lawrence selects Tamil OV verses + writes meditation text
               → scripts/seed-content.ts → content_items (review_status: 'draft')

2. Verify     — Verse reference confirmed against Tamil OV source
               → review_status: 'source_verified'

3. Advise     — Tamil pastor/theologian reviews text
               → review_status: 'advisor_reviewed'

4. Generate   — scripts/generate-audio.ts → ElevenLabs 64 kbps mono AAC
               → audio_assets INSERT → storage upload → audio_asset_id populated
               → review_status: 'audio_generated'

5. QA         — Lawrence listens, checks Tamil pronunciation + pacing
               → review_status: 'qa_passed'

6. Publish    — review_status: 'published', published_at set
               → item appears in app (RLS policy enforces this gate)

7. Correct    — theological concern received → correction_log INSERT
               → old item: review_status: 'superseded', version unchanged
               → new item: same content_item_id, version + 1, restart from step 2
               → public_note in correction_log feeds next Glass-Wall Budget update
```

**Practical implication:** a closed beta at 20-30 quotes + 9 meditations (3 per practice path) is architecturally sound and preferable to rushing 50 quotes through the pipeline. The review workflow is the bottleneck, not the code. Content volume is a PRD-level scope call, not an architecture constraint — the schema handles any volume identically.

**Note:** Project initialization using the above command is the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Scripture text storage: Expo SQLite v2 (offline, searchable, structured)
- No Supabase Auth through v1.1: fully anonymous app
- Verse attribution as TypeScript invariant: `reference` prop non-optional on all scripture components
- Razorpay webhook: Supabase Edge Function with atomic transaction
- Verse card generation: react-native-view-shot (on-device, offline-capable)

**Important Decisions (Shape Architecture):**
- Thin service layer over Supabase client (no raw queries in components)
- Zustand contentStore (no react-query in MVP)
- Feature-based component folder structure
- Glass-Wall Budget as git-tracked markdown rendered in-app
- ElevenLabs generation as server-side script only (never in app binary)
- Three EAS build profiles (development / preview / production)

**Deferred Decisions (Post-MVP):**
- Supabase Auth (deferred to Pastor Portal, v2+)
- react-query / TanStack Query (reconsider at v2 if content fetching complexity grows)
- Custom admin UI (Supabase dashboard sufficient through v1.1)
- WhatsApp Business API integration (v1.1)

### Data Architecture

**Scripture Text Storage: Expo SQLite v2**
- Rationale: Offline-first; full-text search required (FR11); structured queries for pillar + mood_tag + language_code filtering; pre-populated at build time from Tamil OV data; updated via Expo Updates OTA on new content additions
- Alternatives rejected: Static JSON (no full-text search); Supabase online (network dependency violates offline-first)

**Audio File Caching: expo-file-system + Zustand (progressive download strategy)**
- Audio files stored in `FileSystem.documentDirectory` (persistent across OS restarts, survives low-memory events)
- Zustand `audioStore` tracks `{ [contentId]: localFilePath }` — cache manifest without filesystem round-trips
- **Audio format: 64 kbps mono AAC (M4A).** At 128 kbps stereo MP3, 7-min meditation = ~6.7 MB; 15 tracks = ~100 MB — exceeds the 50 MB NFR-P5 target. 64 kbps mono AAC for Tamil spoken-word voice has no perceptible quality loss vs 128 kbps stereo MP3, reduces file size by ~50%. 7 min × 64 kbps mono = ~3.4 MB; 15 tracks = ~51 MB. This satisfies NFR-P5 with margin. ElevenLabs supports AAC output natively. All audio assets use `.m4a` extension.
- **Progressive download (not bulk pre-download):** even at the reduced size, a bulk first-launch download is poor UX on cellular. Instead:
  1. On first play of any track: download immediately, then play from local cache
  2. After play starts: silently pre-fetch next 2 tracks in queue (`lib/audio.ts:prefetchQueue()`)
  3. Manual option: "Download This Week's Content" button shows size estimate and lets user choose (~30 MB for 9 tracks)
- `lib/audio.ts:prefetchQueue()` — called after track playback starts; downloads up to 2 subsequent tracks
- Audio URLs in Supabase stored as relative paths to `audio_assets` table record; `lib/audio.ts:resolveAudioUrl()` resolves to full CDN URL via `supabase.storage.from('audio').getPublicUrl(path)`

**Supabase Schema (nine tables)**

*The schema separates the three concerns that the original design conflated: UX navigation (practice_path), brand/editorial layer (product_pillar), and content lifecycle (review_status).*

**Content tables:**

```sql
content_items (
  id               uuid primary key default gen_random_uuid(),
  title            text,
  practice_path    text not null,  -- 'mind' | 'body' | 'soul'  (UX navigation layer)
  product_pillar   text not null,  -- 'word' | 'walk' | 'hope_faith_love' | 'integrity'  (editorial layer)
  content_type     text not null,  -- 'quote' | 'meditation' | 'lectio' | 'sleep' | 'breathwork'
  language_code    text not null,  -- 'ta' | 'hi' | 'te'
  time_of_day      text not null default 'any',  -- 'morning' | 'evening' | 'any'
  mood_tag         text not null default 'none',  -- 'anxious' | 'grieving' | 'angry' | 'lonely' | 'tempted' | 'none'
  review_status    text not null default 'draft',  -- see workflow below
  verse_reference  text not null,  -- e.g. 'Matthew 6:25' — NOT NULL; DB-enforced
  scripture_text   text not null,  -- verbatim Tamil OV (or chosen translation)
  audio_asset_id   uuid references audio_assets(id),  -- null until audio_generated status
  version          int not null default 1,  -- incremented on each theological correction
  created_at       timestamptz default now(),
  published_at     timestamptz
)

audio_assets (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null,   -- relative Supabase Storage path; e.g. 'ta/quote/abc123.m4a'
  format       text not null default 'm4a',
  bitrate_kbps int not null default 64,
  channels     int not null default 1,   -- mono
  duration_sec int,
  created_at   timestamptz default now()
)

correction_log (
  id              uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id),
  old_version     int not null,
  new_version     int not null,
  issue_type      text not null,  -- 'translation' | 'misattribution' | 'audio' | 'verse_reference'
  public_note     text not null,  -- shown in Glass-Wall Budget public disclosure
  corrected_by    text,           -- advisor name or 'community' (no auth; free text)
  corrected_at    timestamptz default now()
)

theological_concerns (
  id               uuid primary key default gen_random_uuid(),
  content_item_id  uuid references content_items(id),
  description      text not null,
  submitter_email  text,   -- optional; used for acknowledgment email only
  status           text not null default 'open',  -- 'open' | 'under_review' | 'resolved' | 'dismissed'
  created_at       timestamptz default now()
)
```

**Donation ledger tables:**

```sql
donations (
  id                  uuid primary key default gen_random_uuid(),
  amount_paise        int not null,
  status              text not null,  -- 'pending' | 'confirmed' | 'failed' | 'refunded'
  donor_email         text,           -- consent-gated; receipt delivery only
  razorpay_payment_id text unique,
  received_at         timestamptz default now()
)

beneficiaries (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,   -- e.g. 'Madurai Mercy Home'
  quarter   text not null,   -- e.g. '2026-Q2'
  active    boolean not null default true
)

allocation_entries (
  id          uuid primary key default gen_random_uuid(),
  donation_id uuid not null references donations(id),
  bucket      text not null,       -- 'operations' | 'pay_forward'
  amount_paise int not null,
  created_at  timestamptz default now()
)

disbursements (
  id              uuid primary key default gen_random_uuid(),
  beneficiary_id  uuid not null references beneficiaries(id),
  amount_paise    int not null,
  paid_at         timestamptz,
  reference       text,   -- bank transfer ref or UPI transaction ID
  created_at      timestamptz default now()
)
```

**Anonymous analytics table:**

```sql
analytics_events (
  id          uuid primary key default gen_random_uuid(),
  install_id  text not null,   -- UUID generated on first launch; never linked to identity
  event_type  text not null,   -- see permitted events below
  content_id  uuid,            -- nullable; populated for content-related events
  created_at  timestamptz default now()
)
-- Permitted event_type values (no others stored):
-- 'vow_completed' | 'meditation_started' | 'meditation_completed'
-- 'scripture_link_opened' | 'share_triggered' | 'donation_completed'
```

**Storage bucket:** `audio` (public CDN read; no auth required). All files are `.m4a` format.

**RLS policy summary:**
- `content_items`: public SELECT where `review_status = 'published'`; all writes service-role only
- `theological_concerns`: INSERT open (no auth); all reads/updates service-role only
- `analytics_events`: INSERT open (anon key); reads service-role only
- `donations`, `beneficiaries`, `allocation_entries`, `disbursements`: service-role only
- `audio_assets`: public SELECT; writes service-role only

**Migrations:** Supabase CLI (`supabase/migrations/`) — version-controlled SQL; no raw dashboard edits in production.

**Content review workflow:**
```
draft → source_verified → advisor_reviewed → audio_generated → qa_passed → published
published → [correction triggers] → corrected → republished (version + 1)
superseded  ← old version after republish
```
Every status transition is a logged DB update. A content item is never visible in the app unless `review_status = 'published'`.

### Authentication & Security

**No Supabase Auth through v1.1**
- Decision: The app makes zero `supabase.auth` calls in v1 and v1.1. All content is public-read via RLS. No user accounts, no sessions, no tokens.
- Rationale: Core features require no identity (NFR-PR1); personal highlights (v1.1) are local-device-only; donor email is collected by Razorpay, not Arokia. First auth surface is Pastor Portal (v2+).

**Razorpay Webhook: Supabase Edge Function**
- Endpoint: `POST /functions/v1/razorpay-webhook` (public URL; security via HMAC)
- Logic: (1) Verify Razorpay HMAC signature — reject and log if invalid; (2) Begin Postgres transaction:
  - Insert `donations` row (status: 'confirmed')
  - Insert `allocation_entries` row for 'operations' bucket (90% of amount_paise)
  - Insert `allocation_entries` row for 'pay_forward' bucket (10% of amount_paise)
  - (3) Commit; (4) Send acknowledgment email
- Atomicity: all three inserts in one transaction — partial state is impossible
- Glass-Wall Budget numbers are derived from `allocation_entries` + `disbursements` queries, not from manual markdown edits

**Secrets Management**

| Secret | Location | Notes |
|---|---|---|
| Supabase URL + anon key | Expo EAS env vars (build-time) | Public anon key; safe in binary |
| Razorpay key ID | Expo EAS env vars (build-time) | Public key; safe in binary |
| Razorpay webhook secret | Supabase Edge Function env var | Never in app binary |
| ElevenLabs API key | Local `.env` for scripts only | Never in app binary or CI artifacts |
| Supabase service role key | Supabase Edge Function env var | Never in app binary |

**Tracker Audit**
- GitHub Actions CI step: grep for forbidden packages (firebase, @react-native-firebase, mixpanel, amplitude, @amplitude, react-native-google-analytics, facebook-sdk) in package.json + Podfile + build.gradle on every PR

### API & Communication Patterns

**Supabase Client: Thin Service Layer**
```
lib/
  supabase.ts       # singleton Supabase JS client (anon key)
  content.ts        # getQuotes(lang, practicePath?, moodTag?), getMeditations(lang, practicePath?), searchContent(lang, query)
                    # — queries only review_status = 'published' rows
  donations.ts      # getDonationSummary(), getPayForwardSummary(), getDisbursements()
                    # — generates Glass-Wall numbers from allocation_entries + disbursements; no manual math
  concerns.ts       # submitConcern(contentItemId?, description, email?)
  audio.ts          # resolveAudioUrl(audioAssetId), downloadTrack(contentItemId), prefetchQueue(queue)
  analytics.ts      # logEvent(eventType, contentId?) — uses local install_id from SecureStore
```
No raw Supabase calls in components or Zustand stores — all database access goes through these typed functions.

**Content Fetching: Zustand contentStore (no react-query)**
- Scripture quotes: queried from Expo SQLite (offline, instant)
- Meditation metadata: fetched from Supabase on app launch, held in `contentStore` for the session
- No react-query in MVP — insufficient complexity to justify the dependency; reconsider at v2

**Error Handling**
- All `lib/` functions: `try/catch`, errors forwarded to Sentry via `Sentry.captureException()`
- UI: offline content continues working silently; network-dependent features (donation, concern submission) show a clear offline indicator (NFR-R3)
- Donation flow: unambiguous success/failure state required; no record created without confirmed Razorpay webhook (NFR-R4)

### Frontend Architecture

**Component Folder Structure (feature-based)**
```
components/
  scripture/         # ScriptureCard, VerseText (attribution-enforcing), VerseReference
  audio/             # PlayerBar, PlayerControls, SleepTimer, SpeedControl
  home/              # TriuneGrid, TimeOfDayBanner (v1.1 stub — renders null in v1)
  donation/          # DonationCTA, GlassWallBudget
  shared/            # Button, Typography, SafeScreen, OfflineBanner
store/
  audioStore.ts      # current track, playback state, queue, sleep timer, speed, cache manifest
  contentStore.ts    # meditation metadata, filters (practicePath, moodTag, timeFilter)
  prefsStore.ts      # user preferences (speed, theme) — persisted via AsyncStorage
```

**Verse Attribution as TypeScript Invariant**
```typescript
// components/scripture/VerseText.tsx
interface VerseTextProps {
  text: string;
  reference: string;      // non-optional — no default, no undefined
  languageCode: string;
}
// A ScriptureCard without reference is a compile error, not a runtime decision
```
The `verse_reference` column in Supabase is also `NOT NULL` — enforcement at both DB and UI layer.

**Verse Card Generation: react-native-view-shot**
- A `VerseCardView` component is a styled React Native view (verbatim Tamil text + verse reference + Arokia mark)
- `react-native-view-shot` captures it as a PNG (offline-capable; NFR-P6)
- `Share.share()` opens the system share sheet — WhatsApp, Messages, or any installed app
- The verse reference is part of the visual composition; the card cannot be rendered or shared without it (FR42)
- Alternatives rejected: @shopify/react-native-skia (too heavy for a static card); react-native-canvas (lower maintenance)

**Home Screen Extensibility (Kaalai/Maalai forward-compatibility)**
```typescript
// app/(tabs)/index.tsx
// v1: timeFilter always 'any'
// v1.1: timeFilter derived from device clock (5am-11am → 'morning', 5pm-9pm → 'evening')
const timeFilter: 'morning' | 'evening' | 'any' = 'any'; // v1 constant; v1.1 replaces with hook

// <TimeOfDayBanner timeFilter={timeFilter} />  ← renders null in v1; active in v1.1
// <TriuneGrid timeFilter={timeFilter} />         ← passes filter to content queries from Day 1
```
Content queries accept `time_of_day` filter from Day 1 even though v1 always passes `'any'`.

**Persistent Mini-Player**
- Implemented in `app/(tabs)/_layout.tsx` — layout-level, always rendered above tab bar when `audioStore.isPlaying`
- Subscribes to `audioStore`; renders `PlayerBar` component

### Infrastructure & Deployment

**CI/CD: GitHub Actions + Expo EAS**
- Every PR: TypeScript strict type-check + ESLint + tracker audit (grep for forbidden SDKs)
- EAS Build: manually triggered for preview (TestFlight / Firebase App Distribution) and production (App Store / Play Store) releases
- Expo Updates (OTA): theological corrections, content data changes, JS-layer fixes without App Store review cycle

**Three EAS Build Profiles**

| Profile | Target | Distribution |
|---|---|---|
| `development` | Expo Go / dev client | Local device |
| `preview` | Internal testing | TestFlight + Firebase App Distribution |
| `production` | Public release | App Store + Google Play |

**Glass-Wall Budget: DB-Generated Markdown → Git-Committed → In-App Render**
- `scripts/generate-glass-wall.ts` queries `allocation_entries` + `disbursements` + `beneficiaries` → writes `docs/glass-wall-budget.md`
- Lawrence runs the script monthly (or on any disbursement), reviews the output, commits it to git
- In-app: About screen renders it with `react-native-markdown-display`
- OTA update pushes new budget to all users within 24 hours of commit
- The markdown file is a *generated artifact from ledger data* — no manual math, no risk of arithmetic errors
- The git commit history remains the public, auditable record; each commit message names the disbursement event

**ElevenLabs Audio Generation: Server-Side Script Only**
- `scripts/generate-audio.ts` (Node.js) — reads content from Supabase, calls ElevenLabs Multilingual v2, uploads MP3 to `audio` storage bucket, updates `audio_url` in `content` table
- Per-track regeneration: `npx ts-node scripts/generate-audio.ts --id <content_id>`
- ElevenLabs API key lives only in local `.env` for this script — never in the app binary or CI artifacts

**Monitoring**
- Sentry (free tier): crash reports + error tracking; no PII in error payloads (error messages only, no user context)
- Supabase dashboard: DB query performance, storage usage, Edge Function logs
- Razorpay dashboard: donation totals, recurring donors, webhook delivery status

### Decision Impact Analysis

**Implementation Sequence (order matters):**
1. Expo SQLite schema + Tamil OV data seed (blocks all scripture features)
2. Supabase schema + migrations (blocks content fetching + donation flow)
3. react-native-track-player background audio validation (blocks all audio features; Week 1 critical path)
4. `lib/` service layer (blocks all component development)
5. Zustand stores (`audioStore`, `contentStore`, `prefsStore`) (blocks stateful UI)
6. Scripture component with attribution invariant (blocks all content screens)
7. Razorpay webhook Edge Function (blocks donation flow)
8. ElevenLabs generation script (blocks audio content production)

**Cross-Component Dependencies:**
- `audioStore` ↔ react-native-track-player ↔ `PlayerBar` (persistent mini-player) — tightly coupled; build together
- `contentStore` ↔ `lib/content.ts` ↔ Expo SQLite + Supabase — content layer; build as a unit
- `VerseText` component ↔ `verse_reference NOT NULL` DB constraint — both must be in place before any scripture screen ships
- Razorpay webhook Edge Function ↔ `donations` + `pay_forward_allocations` tables ↔ Glass-Wall Budget — donation integrity chain; test end-to-end before launch

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database (Supabase/Postgres): `snake_case` everywhere**

| Pattern | Correct | Wrong |
|---|---|---|
| Table names | `content`, `donations`, `pay_forward_allocations` | `Content`, `Donations` |
| Column names | `verse_reference`, `language_code`, `audio_url` | `verseReference`, `languageCode` |
| Foreign keys | `donation_id`, `content_id` | `donationId`, `fk_donation` |
| Indexes | `idx_content_language_pillar` | `content_language_index` |

**TypeScript: `camelCase` values, `PascalCase` types and components**

The `lib/` service layer transforms Supabase snake_case → TypeScript camelCase. Components never see raw DB field names.

```typescript
// DB row:    { verse_reference: "Matthew 6:25", language_code: "ta" }
// TS type:   { verseReference: "Matthew 6:25", languageCode: "ta" }
```

**File naming conventions**

| File type | Convention | Example |
|---|---|---|
| Expo Router routes | kebab-case | `app/verse-detail.tsx`, `app/meditation/[id].tsx` |
| React components | PascalCase | `VerseText.tsx`, `PlayerBar.tsx` |
| Zustand stores | camelCase + `Store` suffix | `audioStore.ts`, `contentStore.ts` |
| Service utilities | camelCase | `supabase.ts`, `audio.ts`, `content.ts` |
| Type definitions | camelCase per feature | `types/content.ts`, `types/donation.ts` |
| i18n locale files | `<language_code>.json` | `ta.json`, `hi.json` |
| Test files | Co-located `.test.tsx` | `VerseText.test.tsx` |

### Structure Patterns

**Path aliases over relative imports**

```json
// tsconfig.json
"paths": { "@/*": ["./*"] }
```

No `../../../` chains anywhere. All imports use `@/` prefix:
```typescript
import { VerseText } from '@/components/scripture/VerseText';
import { audioStore } from '@/store/audioStore';
import { getQuotes } from '@/lib/content';
```

**Barrel exports for component directories**

```typescript
// components/scripture/index.ts
export { VerseText } from './VerseText';
export { ScriptureCard } from './ScriptureCard';
export { VerseCardView } from './VerseCardView';
// Usage: import { VerseText, ScriptureCard } from '@/components/scripture';
```

**Test co-location**

```
components/scripture/
  VerseText.tsx
  ScriptureCard.tsx
  __tests__/
    VerseText.test.tsx   ← co-located, not in a top-level __tests__ folder
```

### Format Patterns

**Canonical domain types — all agents use these exact definitions**

```typescript
// types/content.ts — source of truth

// UX navigation axis — drives home screen routing
type PracticePath = 'mind' | 'body' | 'soul';

// Editorial/brand axis — drives content strategy and pillar reporting
type ProductPillar = 'word' | 'walk' | 'hope_faith_love' | 'integrity';

// These are SEPARATE types. A content item has BOTH.
// Do not merge them into one field. Do not use ProductPillar for home-screen routing.

type ContentType   = 'quote' | 'meditation' | 'lectio' | 'sleep' | 'breathwork';
type TimeOfDay     = 'morning' | 'evening' | 'any';
type MoodTag       = 'anxious' | 'grieving' | 'angry' | 'lonely' | 'tempted' | 'none';
type LanguageCode  = 'ta' | 'hi' | 'te'; // extend as languages are added
type ReviewStatus  = 'draft' | 'source_verified' | 'advisor_reviewed' | 'audio_generated' | 'qa_passed' | 'published' | 'superseded';

interface ContentItem {
  id: string;
  title: string;
  practicePath: PracticePath;    // home UX navigation — REQUIRED
  productPillar: ProductPillar;  // editorial layer — REQUIRED
  contentType: ContentType;
  languageCode: LanguageCode;
  timeOfDay: TimeOfDay;
  moodTag: MoodTag;
  reviewStatus: ReviewStatus;
  verseReference: string;        // NON-NULLABLE — never string | undefined
  scriptureText: string;         // verbatim Tamil OV — never paraphrased
  audioAssetId: string | null;   // null until audio_generated status
  version: number;               // incremented on theological correction
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
  | 'vow_completed'
  | 'meditation_started'
  | 'meditation_completed'
  | 'scripture_link_opened'
  | 'share_triggered'
  | 'donation_completed';

interface AnalyticsEvent {
  installId: string;       // UUID, generated on first launch, stored in SecureStore
  eventType: AnalyticsEventType;
  contentId: string | null;
  createdAt: string;
}
```

**Supabase response handling — always destructure, never ignore error**

```typescript
// CORRECT
const { data, error } = await supabase.from('content').select('*');
if (error) throw error;
return transformContent(data);

// WRONG — missing error check
const { data } = await supabase.from('content').select('*');
return data;
```

**Audio URL storage rule**

`content.audioUrl` stores the Supabase Storage **relative path** only. `lib/audio.ts:resolveAudioUrl()` always resolves to full CDN URL at runtime. Never store full CDN URLs in the database.

```typescript
// DB value:      "ta/scripture_quote/abc123.mp3"
// Resolved URL:  supabase.storage.from('audio').getPublicUrl(path).data.publicUrl
```

**i18n key conventions — dot notation by feature, `ta.json` is source of truth**

```json
{
  "vow":      { "title": "...", "body": "...", "cta": "ஆமென் — தொடங்கு" },
  "home":     { "mind": "மனம்", "body": "உடல்", "soul": "ஆத்மா" },
  "audio":    { "play": "...", "pause": "...", "sleepTimer": "..." },
  "donation": { "cta": "...", "glassWall": "..." },
  "errors":   { "offline": "...", "generic": "..." }
}
```

### Communication Patterns

**Zustand store conventions**

- State updated via named actions only — no direct `setState` object spreads outside the store
- Action naming: imperative verbs (`playTrack`, `pauseAudio`, `setTimeFilter`, `addDownload`)
- Use `zustand/middleware/immer` for nested state — prevents accidental mutation
- Selectors are inline: `useAudioStore(state => state.currentTrack)` — no separate selector files in MVP

```typescript
// store/audioStore.ts — structure pattern
interface AudioState {
  currentTrack: Content | null;
  isPlaying: boolean;
  isBuffering: boolean;
  speed: 0.75 | 1 | 1.25;
  sleepTimerMinutes: 0 | 15 | 30 | 45;
  downloadedTracks: Record<string, string>; // contentId → localFilePath
  // Actions
  playTrack: (content: Content) => void;
  pauseAudio: () => void;
  setSpeed: (speed: AudioState['speed']) => void;
  setSleepTimer: (minutes: AudioState['sleepTimerMinutes']) => void;
}
```

**react-native-track-player event handling**

All RNTP events handled exclusively in `lib/trackPlayerService.ts` (headless task). Events update `audioStore` via store actions. No RNTP event listeners inside components.

**Offline state pattern**

`@react-native-community/netinfo` → shared `useNetworkStatus()` hook → `isOnline: boolean`. Network-dependent features render `<OfflineBanner>` or inline message. Cached content and audio never blocked by offline state.

### Process Patterns

**Error handling — three-tier model**

```typescript
// Tier 1: lib/ — throws, logs to Sentry
export async function getQuotes(lang: LanguageCode): Promise<Content[]> {
  const { data, error } = await supabase.from('content').select('*').eq('language_code', lang);
  if (error) { Sentry.captureException(error); throw error; }
  return data.map(transformContent);
}

// Tier 2: Zustand store — catches, sets error state
fetchQuotes: async (lang) => {
  set({ isLoading: true, error: null });
  try { set({ quotes: await getQuotes(lang), isLoading: false }); }
  catch { set({ error: 'errors.generic', isLoading: false }); }
},

// Tier 3: Component — reads store.error, shows localized message via t()
// Never shows raw error strings to users
```

**Loading states**

- Zustand stores expose `isLoading: boolean` per async operation
- Audio buffering: RNTP state → `audioStore.isBuffering`
- Content lists: skeleton screens (not raw spinners) for perceived performance

**Donation flow — webhook-authoritative**

App initiates Razorpay external webview → shows "processing" screen → waits. App does NOT poll for payment status. App does NOT create donation records. Only the webhook Edge Function creates `donations` + `pay_forward_allocations` records. "Thank you" screen shown only after webhook confirmation.

**Content update sequencing**

| Change type | Delivery |
|---|---|
| UI text fix | Expo Updates OTA |
| Theological text correction | OTA + SQLite migration |
| New/corrected audio | ElevenLabs script → Supabase Storage → DB `audio_url` update (no app update) |
| New native module or screen | EAS full build → App Store review |

### Enforcement Guidelines

**All implementation agents MUST:**

1. Use `@/` path aliases — no relative `../../` imports
2. Never access `content.verseReference` with optional chaining (`?.`) — it is non-nullable by contract
3. Never call Supabase directly from components — always through `lib/` service functions
4. Store only relative Supabase Storage paths in `audio_url` — never full CDN URLs
5. Never create donation records outside the Razorpay webhook Edge Function
6. Use `useTranslation()` for all user-facing strings — no hardcoded strings in JSX
7. Never call any Supabase Auth method (`supabase.auth.*`) in v1 or v1.1
8. Never add these packages: `firebase`, `@react-native-firebase/*`, `mixpanel-react-native`, `@amplitude/*`, `@facebook/react-native-fbsdk-next`
9. Always handle the `error` field from every Supabase destructure — never ignore it
10. Pass `verseReference` as a required non-optional prop to all scripture components

**Anti-patterns to reject in code review:**

```typescript
// ❌ Raw Supabase in component
const { data } = await supabase.from('content').select('*');

// ❌ Optional chaining on non-nullable field
<VerseText reference={content.verseReference ?? ''} />

// ❌ Hardcoded UI string
<Text>Start your practice</Text>

// ❌ Full CDN URL stored in DB
await supabase.from('content').update({ audio_url: 'https://cdn.supabase.co/...' });

// ❌ Auth call
await supabase.auth.signInWithPassword({ email, password });

// ❌ using `any` type
const content: any = await getQuotes('ta');

## Project Structure & Boundaries

### Requirements to Structure Mapping

| FR Category | Route / File | Components | Data layer |
|---|---|---|---|
| Onboarding & Vow (FR1–5) | `app/vow.tsx`, `app/about.tsx` | `onboarding/OpeningVow` | `prefsStore` (vow acknowledged flag) |
| Triune Home Nav (FR6–9) | `app/(tabs)/index.tsx` | `home/TriuneGrid`, `home/MoodFilter`, `home/TimeOfDayBanner` (v1.1 stub) | `contentStore` (filters) |
| Scripture & Discovery (FR10–14, FR41) | `app/(tabs)/word.tsx`, `app/verse/[id].tsx`, `app/search.tsx` | `scripture/ScriptureCard`, `VerseText`, `VerseReference`, `VerseCardView` | `lib/sqlite.ts` + `lib/content.ts` |
| Audio Playback (FR15–22) | `app/(tabs)/walk.tsx`, `app/meditation/[id].tsx`, `app/lectio-divina.tsx` | `audio/PlayerBar`, `PlayerControls`, `SleepTimer`, `SpeedControl` | `audioStore`, `lib/audio.ts`, `lib/trackPlayerService.ts` |
| Donation & Transparency (FR23–29) | `app/(tabs)/integrity.tsx`, `app/donate.tsx` | `donation/DonationCTA`, `donation/GlassWallBudget` | `lib/donations.ts`, Edge Function, `docs/glass-wall-budget.md` |
| Theological Correction (FR30–33) | `app/report-concern.tsx` | `shared/ConcernForm` | `lib/concerns.ts` |
| Sharing & Attendance (FR34–35, FR42) | `app/verse/[id].tsx`, `app/attendance.tsx` | `scripture/VerseCardView`, `shared/ShareButton` | react-native-view-shot |
| Operator Admin (FR36–40) | No custom UI in v1 | — | Supabase dashboard, Sentry, `scripts/` |

### Complete Project Directory Structure

```
arokia/
├── .env.example                        # Template — Supabase URL, anon key, Razorpay key ID
├── .eslintrc.js
├── .gitignore
├── app.json                            # Expo config: bundle IDs, icons, splash, permissions
├── babel.config.js                     # Expo + NativeWind Babel preset
├── eas.json                            # EAS Build profiles: development / preview / production
├── metro.config.js                     # Metro: NativeWind + expo-sqlite support
├── package.json
├── tailwind.config.js                  # NativeWind: content paths, Tamil-friendly font scale
├── tsconfig.json                       # strict: true; paths: { "@/*": ["./*"] }
│
├── .github/
│   └── workflows/
│       └── ci.yml                      # tsc + eslint + audit-trackers.sh on every PR
│
├── app/                                # Expo Router file-based routes
│   ├── _layout.tsx                     # Root: Sentry init, i18n provider, theme provider
│   ├── index.tsx                       # Entry: first-launch gate → /vow or /(tabs)
│   ├── vow.tsx                         # Opening Vow (non-skippable, FR1–2)
│   ├── privacy.tsx                     # Privacy policy (FR5)
│   ├── donate.tsx                      # Razorpay external webview (FR23–24)
│   ├── report-concern.tsx              # Theological concern form (FR30–31)
│   ├── attendance.tsx                  # Optional Sunday worship tracker (FR35)
│   ├── search.tsx                      # Content keyword search (FR11)
│   ├── lectio-divina.tsx               # Silence Between Words player (FR12)
│   ├── verse/
│   │   └── [id].tsx                    # Verse detail: text + audio + share card (FR10, FR34, FR42)
│   ├── meditation/
│   │   └── [id].tsx                    # Meditation player: audio + scripture + hand-off link (FR15–21, FR14)
│   └── (tabs)/
│       ├── _layout.tsx                 # Tab layout: persistent PlayerBar above tab bar
│       ├── index.tsx                   # Triune home: Mind / Body / Soul (FR6–9)
│       ├── word.tsx                    # Scripture quotes browser (FR10, FR13)
│       ├── walk.tsx                    # Meditation library by pillar + mood (FR8–9)
│       ├── integrity.tsx               # Glass-Wall Budget + donation CTA (FR28–29)
│       └── about.tsx                   # About Arokia: name, mission, advisors, correction process (FR4)
│
├── components/
│   ├── scripture/
│   │   ├── ScriptureCard.tsx           # Full verse: text + reference + play button
│   │   ├── VerseText.tsx               # Attribution-enforcing ({text, reference: string} non-optional)
│   │   ├── VerseReference.tsx          # Styled "Matthew 6:25" reference badge
│   │   ├── VerseCardView.tsx           # Shareable PNG view (react-native-view-shot target)
│   │   └── index.ts
│   ├── audio/
│   │   ├── PlayerBar.tsx               # Persistent mini-player (layout-level, FR16–17)
│   │   ├── PlayerControls.tsx          # Play / pause / seek / skip (FR15)
│   │   ├── SleepTimer.tsx              # 15 / 30 / 45 min timer (FR20)
│   │   ├── SpeedControl.tsx            # 0.75× / 1× / 1.25× (FR21)
│   │   └── index.ts
│   ├── home/
│   │   ├── TriuneGrid.tsx              # Mind/Body/Soul nav grid (FR6)
│   │   ├── TimeOfDayBanner.tsx         # v1.1 Kaalai/Maalai stub — renders null in v1 (FR-V1-03)
│   │   ├── MoodFilter.tsx              # Anxiety-type filter chips (FR9)
│   │   └── index.ts
│   ├── donation/
│   │   ├── DonationCTA.tsx             # Donation invite with pay-forward explanation (FR23)
│   │   ├── GlassWallBudget.tsx         # react-native-markdown-display renderer (FR28–29)
│   │   └── index.ts
│   ├── onboarding/
│   │   ├── OpeningVow.tsx              # Vow text + acknowledgment button (FR1–2)
│   │   └── index.ts
│   └── shared/
│       ├── Button.tsx
│       ├── Typography.tsx
│       ├── SafeScreen.tsx              # Safe area + keyboard-aware wrapper
│       ├── OfflineBanner.tsx           # Network offline indicator (NFR-R3)
│       ├── LoadingSkeleton.tsx         # Skeleton screens for content lists
│       └── index.ts
│
├── constants/
│   └── vow.ts                          # VOW_REQUIRED_VERSIONS: string[] — app versions that trigger re-vow (FR3)
│
├── store/
│   ├── audioStore.ts                   # RNTP state + download manifest + sleep timer + speed
│   ├── contentStore.ts                 # Meditation metadata + active filters (pillar, mood, timeFilter)
│   ├── highlightsStore.ts              # v1.1 stub — local verse highlights (AsyncStorage, no server sync, FR-V1-08–10)
│   └── prefsStore.ts                   # Persisted: playback speed default, vowAcknowledged, lastVowAppVersion (FR3)
│
├── lib/
│   ├── supabase.ts                     # Singleton Supabase JS client (anon key)
│   ├── content.ts                      # getQuotes(), getMeditations(), searchContent()
│   ├── donations.ts                    # getDonationSummary(), getPayForwardSummary()
│   ├── concerns.ts                     # submitConcern()
│   ├── audio.ts                        # resolveAudioUrl(), downloadTrack(), getCachedPath(), prefetchQueue()
│   ├── sqlite.ts                       # Expo SQLite v2: schema init, verse queries, full-text search
│   ├── trackPlayerService.ts           # RNTP headless task: events → audioStore actions
│   ├── i18n.ts                         # react-i18next init: language detection, ta.json default
│   ├── analytics.ts                    # logEvent(type, contentId?); reads install_id from SecureStore; writes to analytics_events
│   └── network.ts                      # useNetworkStatus() hook (NetInfo → isOnline: boolean)
│
├── types/
│   ├── content.ts                      # ContentItem, PracticePath, ProductPillar, ContentType, ReviewStatus, MoodTag, LanguageCode
│   ├── donation.ts                     # Donation, AllocationEntry, Disbursement, Beneficiary
│   ├── analytics.ts                    # AnalyticsEvent, AnalyticsEventType
│   └── concern.ts                      # TheologicalConcern
│
├── locales/
│   ├── ta.json                         # Tamil — source of truth for all i18n keys
│   └── en.json                         # English — mirrors ta.json key structure
│
├── assets/
│   ├── icons/                          # App icon: 1024px + adaptive Android
│   └── splash/                         # Splash screen assets
│
├── docs/
│   └── glass-wall-budget.md            # Version-controlled Glass-Wall Budget (rendered in-app)
│
├── supabase/
│   ├── config.toml                     # Supabase CLI local dev config
│   ├── migrations/
│   │   └── 20260425_initial_schema.sql # content_items + audio_assets + correction_log + theological_concerns
│   │                                   # + donations + beneficiaries + allocation_entries + disbursements
│   │                                   # + analytics_events
│   └── functions/
│       ├── razorpay-webhook/
│       │   ├── index.ts                # HMAC verify → atomic transaction (donations + 2× allocation_entries)
│       │   └── deno.json
│       └── concern-notification/
│           ├── index.ts                # DB webhook on theological_concerns INSERT → acknowledgment email (FR31)
│           └── deno.json
│
└── scripts/
    ├── generate-audio.ts               # ElevenLabs batch/per-track generation (64 kbps mono AAC) + audio_assets insert + storage upload
    ├── seed-content.ts                 # Tamil OV verse seeding into SQLite + content_items table (status: draft)
    ├── generate-glass-wall.ts          # Queries allocation_entries + disbursements → writes docs/glass-wall-budget.md
    └── audit-trackers.sh               # Grep for forbidden SDK packages (CI + manual)
```

### Architectural Boundaries

| Boundary | Crossed by | Never crossed by |
|---|---|---|
| App ↔ Supabase | `lib/*.ts` only | Components, stores, screens |
| App ↔ RNTP | `lib/trackPlayerService.ts`, `store/audioStore.ts` | Components, screens |
| App ↔ expo-sqlite | `lib/sqlite.ts` only | Any other module |
| App ↔ Razorpay | `app/donate.tsx` (webview) + Edge Function | App binary never calls Razorpay API |
| App ↔ ElevenLabs | `scripts/generate-audio.ts` only | App binary: zero ElevenLabs dependency |
| Edge Function ↔ DB | Service role (full access) | App client: anon role, public-read RLS only |

**OTA boundary:** `app/`, `components/`, `lib/`, `store/`, `locales/`, `docs/` are OTA-updatable via Expo Updates. `supabase/functions/` requires `supabase functions deploy`. `scripts/` are never deployed.

### Key Data Flows

**Scripture display:** `lib/sqlite.ts` → `contentStore` → `VerseText` (required `reference` prop) → screen render

**Audio playback:** Supabase CDN → `lib/audio.ts:downloadTrack()` → `documentDirectory` cache → RNTP → audio output → `lib/trackPlayerService.ts` events → `audioStore`

**Verse card share:** `verse/[id].tsx` → `VerseCardView` render → `captureRef()` (react-native-view-shot) → PNG → `Share.share()` → system share sheet

**Donation:** `integrity.tsx` → `donate.tsx` webview → Razorpay payment → Razorpay webhook POST → `razorpay-webhook` Edge Function → HMAC verify → atomic transaction (`donations` + `pay_forward_allocations`) → email receipt

**Glass-Wall Budget:** `docs/glass-wall-budget.md` (git-tracked) → `GlassWallBudget.tsx` (react-native-markdown-display) → `integrity.tsx` tab render

## Architecture Validation Results

### Coherence Validation ✅

**Decision compatibility:** All technology choices are compatible. React Native + Expo SDK 54/55 + NativeWind v4 + Expo Router v4 + Zustand + Supabase JS + react-i18next — no version conflicts. react-native-view-shot works with Expo SDK 50+. react-native-track-player background audio in Expo managed workflow is the single pending compatibility item — a Week 1 validation task, not a design conflict.

**Pattern consistency:** Service layer (`lib/`), store patterns, naming conventions, and error-handling tiers are all internally consistent. No contradictions between decisions.

**Structure alignment:** `app/` Expo Router routes map cleanly to all FR categories. `lib/` boundary rules support all architectural decisions. OTA boundary is correctly scoped.

### Requirements Coverage Validation ✅

All 42 MVP FRs, 10 v1.1 FRs, and 34 NFRs are architecturally supported.

| FR Range | Coverage | File(s) |
|---|---|---|
| FR1–5 (Onboarding) | ✅ | `vow.tsx`, `about.tsx`, `prefsStore` (lastVowAppVersion), `constants/vow.ts` |
| FR6–9 (Triune home) | ✅ | `(tabs)/index.tsx`, `TriuneGrid`, `MoodFilter`, `contentStore` |
| FR10–14, FR41 (Scripture) | ✅ | `word.tsx`, `lib/sqlite.ts`, `VerseText` (attribution-enforcing) |
| FR15–22 (Audio) | ✅ | RNTP, `audioStore`, `lib/audio.ts` (progressive download), `documentDirectory` |
| FR23–29 (Donation) | ✅ | `donate.tsx`, `razorpay-webhook` Edge Function, `glass-wall-budget.md` |
| FR30–33 (Correction) | ✅ | `report-concern.tsx`, `lib/concerns.ts`, `concern-notification` Edge Function |
| FR34–35, FR42 (Sharing) | ✅ | `VerseCardView`, react-native-view-shot, `attendance.tsx` |
| FR36–40 (Operator) | ✅ | Supabase dashboard, Sentry, `scripts/` |
| FR-V1-01–07 (v1.1 time-of-day + sleep) | ✅ | Schema fields present Day 1; `TimeOfDayBanner` stub; content queries accept `time_of_day` filter |
| FR-V1-08–10 (v1.1 highlights) | ✅ | `store/highlightsStore.ts` stub (exists in v1, no v1 UI; ready for v1.1) |

**NFR coverage summary:**

- Performance (P1–P6): Progressive audio download resolves P5 (50MB cap); all others addressed by stack choices ✅
- Security (S1–S5): TLS, no payment PII, HMAC webhook, consent-gated email, CI tracker audit ✅
- Reliability (R1–R4): Sentry, RNTP call interruption, offline graceful degradation, atomic webhook ✅
- Scalability (SC1–SC3): Supabase free→Pro; static audio CDN; locale JSON + content data for new languages ✅
- Accessibility (A1–A5): 48dp targets, system font scale, NativeWind WCAG AA, 2-tap depth, RNTP accessibility ✅
- Privacy (PR1–PR4): No auth for content, no identity-linked analytics, receipt-only email, App Store labels ✅
- Audio Standards (AU1–AU4): Enforced at content production time via `scripts/generate-audio.ts` ✅
- Internationalisation (I1–I3): react-i18next, `language_code` on all content, system Tamil fonts ✅

### Gaps Found & Resolved

| Gap | Severity | Resolution Applied |
|---|---|---|
| NFR-P5: 15 meditations × 6.5 MB = 97 MB — exceeds 50 MB bulk pre-download target | Important | Progressive download strategy: play-on-demand + 2-track prefetch queue; manual "Download Week" option |
| FR3: No version tracking for re-vow on significant updates | Important | `lastVowAppVersion: string` added to `prefsStore`; `constants/vow.ts` holds `VOW_REQUIRED_VERSIONS[]` |
| FR31: No automated acknowledgment email path for concern submissions | Minor | `supabase/functions/concern-notification/` Edge Function added; triggered by DB webhook on `theological_concerns` INSERT |
| FR-V1-08–10: `highlightsStore.ts` absent from structure | Minor | `store/highlightsStore.ts` stub added; v1 = empty, no UI reads it; v1.1 implements fully |

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] 52 functional requirements analyzed (42 MVP + 10 v1.1)
- [x] 34 non-functional requirements mapped to architectural decisions
- [x] Scale and complexity assessed (100 → 15K MAU, no architecture change)
- [x] 7 cross-cutting concerns identified and addressed

**✅ Architectural Decisions**
- [x] Data architecture: Expo SQLite v2 + Supabase + progressive audio download
- [x] Auth: no Supabase Auth through v1.1; fully anonymous
- [x] API: thin service layer; no raw Supabase in components
- [x] Frontend: feature-based components; verse attribution TypeScript invariant; Zustand stores
- [x] Infrastructure: EAS Build profiles; GitHub Actions CI; Expo Updates OTA; Supabase Edge Functions

**✅ Implementation Patterns**
- [x] Naming: snake_case DB, camelCase TS, PascalCase components, kebab-case routes
- [x] Structure: path aliases, barrel exports, co-located tests
- [x] Format: canonical domain types, Supabase error handling, audio URL relative-path rule
- [x] Communication: Zustand action patterns, RNTP event routing, offline state hook
- [x] Process: 3-tier error handling, progressive loading, webhook-authoritative donation, OTA sequencing
- [x] Enforcement: 10 mandatory rules + anti-pattern list

**✅ Project Structure**
- [x] 50+ files and directories defined with FR mapping
- [x] 6 architectural boundaries documented
- [x] 5 key data flows mapped end-to-end
- [x] 4 validation gaps identified and resolved in-document

### Architecture Readiness Assessment

**Overall Status: READY FOR IMPLEMENTATION**

**Confidence level: High**

**Key strengths:**
- Verse attribution is a compile-time invariant, not a runtime convention — theological integrity is enforced by the type system
- Progressive audio download eliminates the 97 MB first-launch problem without sacrificing the offline-first goal
- No Supabase Auth through v1.1 removes an entire complexity class for solo development
- All v1.1 schema fields and component stubs are in place — adding Kaalai/Maalai, sleep content, and highlights requires zero migration work
- The donation integrity chain (HMAC → atomic transaction → email) is fully specified end-to-end

**Areas for future enhancement (post-v1):**
- react-query or TanStack Query when content fetching complexity grows beyond single-fetch-per-session
- Custom Supabase admin UI when content volume or contributor count makes the dashboard insufficient
- Supabase Auth when Pastor Portal (v2) requires identity management

### Implementation Handoff

**AI agent guidelines:**
- Follow all architectural decisions exactly as documented — no re-invention of patterns already decided
- Every new component that displays scripture must use `VerseText` with a required `reference: string` prop
- Every Supabase call goes through `lib/` service functions — never raw in components or stores
- Every user-facing string goes through `useTranslation()` — never hardcoded in JSX
- Check the enforcement rules in "Implementation Patterns" before writing any new file

**First implementation story:**
```bash
npx create-expo-stack@latest arokia --expo-router --nativewind --supabase
# Then: run the Week-1 technical spike (all 5 items) before writing any app screens
```

---

## Post-Validation Architecture Amendments

*Applied 2026-04-25 following independent analysis review. Six substantive changes made; two items pushed back.*

### Changes Applied

| # | Change | Rationale |
|---|---|---|
| 1 | Split `pillar` field into `practice_path` (UX nav) + `product_pillar` (editorial) | These are different axes. Conflating them forces awkward content tagging and confuses routing logic. |
| 2 | Added `review_status` to `content_items` with 7-stage workflow | Theological accuracy is the product's core promise. Without DB-enforced status, review is on trust, not system. |
| 3 | Added `correction_log` table | FR32 (public correction disclosure) needs an audit trail, not just a text note in a markdown file. |
| 4 | Redesigned donation schema: `beneficiaries`, `allocation_entries`, `disbursements` | Manual Glass-Wall math is error-prone. Numbers generated from ledger data are reliable and auditable. |
| 5 | Added `analytics_events` table + `lib/analytics.ts` | PRD success metrics (meditation completion rate, bible-link tap-through) cannot be measured with zero analytics. Privacy-safe via local `install_id` only. |
| 6 | Audio format changed from 128 kbps stereo MP3 → 64 kbps mono AAC (M4A) | 128 kbps × 15 tracks ≈ 100 MB — exceeds NFR-P5. 64 kbps mono AAC: no perceptible quality loss for speech; ~50 MB for 15 tracks. |
| 7 | Week-1 spike scope expanded to 5 items | Tamil rendering + Razorpay on-device were missing from original spike list; these are non-negotiable day-1 validations. |
| 8 | Glass-Wall Budget changed to DB-generated markdown | `scripts/generate-glass-wall.ts` queries ledger tables → writes `docs/glass-wall-budget.md`. Git commit remains the audit trail. |

### Items Pushed Back

| Item | Rationale |
|---|---|
| Remove recurring donation from MVP | Incremental Razorpay cost is trivial; recurring donors are the mission's financial foundation. Kept in MVP. |
| "Pick one wedge audience — drop elders" | The PRD already has working adults as the primary launch archetype. Selvi was always a UX quality bar ("if she can use it, anyone can"), not a primary launch segment. The elder accessibility constraint (48dp targets, simple navigation) costs nothing extra to maintain. Not changed. |

### What Did NOT Change

- The four product pillars (word / walk / hope_faith_love / integrity) — brand layer, unchanged
- The Triune home (mind / body / soul) — UX layer, unchanged; now correctly separated from pillars in the schema
- All 42 MVP FRs — scope unchanged; content volume (50 vs 20-30 quotes) is a PRD-level call deferred to Lawrence
- No Supabase Auth through v1.1 — unchanged
- Recurring donation in MVP — unchanged (defended above)
- The user journeys in the PRD include Check-In Circles, walking/kitchen modes, and 21-day tracks — these are aspirational v1.1+ features, already explicitly deferred in the MVP scope. The architecture does not implement them; the journeys describe the full product vision.
```
