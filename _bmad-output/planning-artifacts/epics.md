---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
workflow_completed: true
workflow_completion_date: '2026-04-26'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

# Arokia - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Arokia, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: A first-time user can read and acknowledge the Opening Vow before accessing any app content.
FR2: A user who does not acknowledge the Opening Vow cannot proceed to the app's content.
FR3: A returning user is prompted to re-acknowledge the Opening Vow after significant app updates.
FR4: Any user can read the About page describing Arokia's name, origin, mission, and ecumenical positioning.
FR5: Any user can access the current Privacy Policy from within the app.
FR6: A user can navigate to three distinct practice paths (Mind, Body, Soul) from the home screen.
FR7: A user can reach today's featured content within the Soul path with minimal navigation steps.
FR8: A user can browse the full meditation library organized by practice path (Mind / Body / Soul).
FR9: A user can access a library of meditations filtered by emotional/spiritual state (anxious, grieving, angry, lonely, tempted).
FR10: A user can browse Jesus's direct quotes from the Gospels, with each quote showing verbatim Tamil text and its verse reference.
FR11: A user can search the content library by topic or keyword.
FR12: A user can access the Silence Between Words Lectio Divina track.
FR13: Every scripture display renders the verbatim Tamil text alongside the full verse reference (book, chapter, verse) — the verse reference cannot be hidden or omitted.
FR14: Every meditation ends with a link that opens the complete scripture passage in an external Tamil Bible resource.
FR15: A user can play any meditation or Jesus-quote audio track with standard playback controls (play, pause, seek).
FR16: A user can continue audio playback while the app is backgrounded or the device screen is locked.
FR17: A user can control playback (play, pause, seek) from the device lock screen and hardware audio controls.
FR18: A user can download content to the device for offline playback before losing network connectivity.
FR19: The app automatically pre-downloads a baseline content set on first launch so the user has offline access immediately.
FR20: A user can set a sleep timer so audio stops automatically after a chosen duration.
FR21: A user can adjust playback speed to slow down or speed up Tamil audio.
FR22: A user can access all audio content without creating an account or signing in.
FR23: A user can make a one-time donation via Razorpay (UPI, cards, and netbanking).
FR24: A user can set up a monthly recurring donation via Razorpay.
FR25: A user making a donation is shown an explicit consent statement before providing their email, disclosing its single purpose (receipt delivery).
FR26: Each confirmed donation is automatically allocated — 10% to pay-it-forward, 90% to operations — atomically at transaction time.
FR27: A donor receives an email acknowledgment after a confirmed donation.
FR28: Any user can view the Glass-Wall Budget showing cumulative income, expenses, and pay-it-forward disbursements.
FR29: Any user can see the current quarter's named pay-it-forward beneficiary and amount committed.
FR30: Any user can submit a theological concern (translation issue, misattribution, wrong verse reference) without creating an account.
FR31: A user who submits a concern receives an automated acknowledgment confirming the review SLA (7 days).
FR32: Confirmed theological corrections are publicly disclosed in the next Glass-Wall Budget update, visible to all users.
FR33: The operator can view and respond to submitted concerns through an admin or email workflow.
FR34: A user can share any Jesus quote or meditation scripture as a formatted Tamil verse card (verbatim text + verse reference + Arokia name) to WhatsApp or any share target.
FR35: A user can optionally record attendance at a worship service on a given Sunday, with no streak, score, or gamification.
FR36: The operator can add, update, and publish new scripture quotes and meditations through the content management system.
FR37: The operator can regenerate audio for a single content item without affecting the rest of the library.
FR38: The operator can update the Glass-Wall Budget, with the About page reflecting the changes automatically.
FR39: The operator can view application error and crash reports.
FR40: The operator can view donation totals, recurring-donor count, and pay-it-forward allocation summaries.
FR41: A user can access meditation content accompanied by Tamil Christian keerthanai instrumental audio — distinctly Christian in character, never bhajan/mantra style.
FR42: The verse attribution (book, chapter, verse) is mandatory on every shared verse card; a card cannot be generated or shared without it.

**v1.1 FRs (architect-for, not build in MVP):**
FR-V1-01: A user can enter a morning devotion flow (Kaalai Jabam) from the home screen.
FR-V1-02: A user can enter an evening devotion flow (Maalai Jabam) from the home screen.
FR-V1-03: The home screen displays a time-of-day aware entry point (Kaalai / Maalai) based on device clock.
FR-V1-04: The operator can tag any content as 'morning', 'evening', or 'any'.
FR-V1-05: A user can access a dedicated Sleep content category for pre-sleep listening.
FR-V1-06: Sleep content sessions use the existing sleep timer as their primary interaction.
FR-V1-07: The operator can mark content with a 'sleep' type tag.
FR-V1-08: A user can highlight any Jesus quote; highlights are stored locally, no account required.
FR-V1-09: A user can view all their highlighted Jesus quotes as a personal collection.
FR-V1-10: Highlights persist across app updates and are stored only on the user's device.

### NonFunctional Requirements

NFR-P1: App reaches interactive state within 2 seconds of launch on mid-range Android (Snapdragon 680-class, 4 GB RAM, Android 11).
NFR-P2: Audio playback begins within 500 ms of user tap when cached; within 2 seconds when streaming.
NFR-P3: App maintains ≤150 MB in-session memory footprint during active background audio.
NFR-P4: Any scrollable content list renders within 1 second.
NFR-P5: First-week offline content package is ≤50 MB total.
NFR-P6: Tamil verse card image generation is performed locally on-device with no network dependency.
NFR-S1: All network communication uses TLS 1.2 or higher.
NFR-S2: Arokia stores no payment PII; Razorpay handles all card/UPI/banking data.
NFR-S3: Razorpay webhook events are verified using Razorpay's HMAC signature before any donation record is created.
NFR-S4: The only PII Arokia stores is a donor's email address — consent-gated, used solely for receipt delivery.
NFR-S5: No third-party advertising or analytics SDK is present in the production app build; verified by quarterly dependency audit.
NFR-R1: Production crash rate is ≤0.1% per session after first 90 days.
NFR-R2: Audio playback pauses gracefully on incoming phone call and resumes automatically when call ends.
NFR-R3: App loses no user state and does not crash when network connectivity is lost (except donation flow, which communicates the requirement clearly).
NFR-R4: Donation flow surfaces unambiguous success/failure state; no donation record created without confirmed Razorpay webhook.
NFR-SC1: System supports growth from 100 to 15,000 MAU without architectural changes.
NFR-SC2: Audio content is CDN-cached; 10× users produces no increase in database query load.
NFR-SC3: Adding a new language requires only a new locale JSON file and content data — zero application code changes.
NFR-A1: All interactive UI elements have a minimum touch target of 48×48 dp.
NFR-A2: App respects and scales to device's system font size; fully usable at 1.5× system font scale.
NFR-A3: All text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large ≥18 pt) in both light and dark modes.
NFR-A4: Most common action (play today's content) is reachable within 2 taps from home screen.
NFR-A5: Lock screen audio controls are compatible with VoiceOver (iOS) and TalkBack (Android).
NFR-PR1: No user account or sign-in required to access any core content.
NFR-PR2: No analytics data linked to individual user identity; only aggregate counts tracked.
NFR-PR3: Donor email addresses used solely for donation receipts; never for marketing without separate explicit consent.
NFR-PR4: App Store and Play Store privacy nutrition labels accurately reflect data collection practices.
NFR-AU1: Standard meditations and Jesus-quote audio produced at natural Tamil speech pace (1×) with keerthanai at 20-30% volume.
NFR-AU2: Sleep content audio (v1.1) produced at 0.7× pace with softer keerthanai, no sharp transitions.
NFR-AU3: All keerthanai instrumental audio is distinctly Christian — no shared melodic phrases with bhajan, qawwali, or non-Christian devotional styles.
NFR-AU4: Breathwork audio (v1.1) includes Tamil verbal breath cues (inhale/hold/exhale) synchronized with keerthanai rhythm.
NFR-I1: All user-facing UI strings externalized in react-i18next locale files; zero UI strings hardcoded in components.
NFR-I2: All Supabase content records include a language_code field from initial schema creation.
NFR-I3: Tamil text rendering uses system-installed Tamil fonts; no custom Tamil font bundled in app binary.

### Additional Requirements

**From Architecture — Starter Template (Epic 1 Story 1):**
- Project initialized via `npx create-expo-stack@latest arokia --expo-router --nativewind --supabase` with Zustand selected interactively; TypeScript strict mode enabled manually post-scaffold.

**Week 1 Critical Technical Spikes (must pass before any app screens are written):**
- SPIKE-1: Tamil text rendering — system fonts render Tamil Unicode correctly on Android + iOS (no glyph fallback, correct ligatures, no layout overflow)
- SPIKE-2: react-native-track-player background audio — plays audio with screen locked on both platforms; lockscreen controls visible; audio resumes after call
- SPIKE-3: Audio format + size — 64 kbps mono AAC (M4A) generated by ElevenLabs; 7-min file ≤ 3.5 MB
- SPIKE-4: Offline cache — expo-file-system downloads + plays from documentDirectory without network; airplane mode test passes
- SPIKE-5: Razorpay flow on device — external webview completes a test payment, webhook fires, DB record created on both iOS and Android

**Database & Schema:**
- Nine-table Supabase schema: content_items, audio_assets, correction_log, theological_concerns, donations, beneficiaries, allocation_entries, disbursements, analytics_events
- Supabase CLI migrations (supabase/migrations/) — version-controlled SQL; no raw dashboard edits
- Expo SQLite v2 for scripture text (offline, full-text search, structured queries)
- verse_reference NOT NULL enforced at both DB layer and TypeScript type layer

**Architecture Patterns:**
- Service layer in lib/ (supabase.ts, content.ts, donations.ts, concerns.ts, audio.ts, analytics.ts) — no raw Supabase calls in components
- Three Zustand stores: audioStore, contentStore, prefsStore
- Feature-based component structure: components/scripture/, components/audio/, components/home/, components/donation/, components/shared/
- Path aliases (@/*) over relative imports; barrel exports for component directories
- snake_case DB, camelCase TS values, PascalCase types and components
- VerseText TypeScript invariant: reference prop is non-optional (compile error if missing)
- react-native-view-shot for verse card generation (offline-capable)

**CI/CD:**
- GitHub Actions: TypeScript strict type-check + ESLint + tracker audit (grep for forbidden SDKs: firebase, mixpanel, amplitude, facebook-sdk) on every PR
- Three EAS build profiles: development / preview / production

**Content Operations Pipeline (not a feature — core architecture):**
- 7-stage: Curate → Verify (source) → Advise (advisor review) → Generate (ElevenLabs) → QA → Publish → Correct
- ElevenLabs generation via scripts/generate-audio.ts (server-side only; never in app binary)
- Per-track regeneration: npx ts-node scripts/generate-audio.ts --id <content_id>

**Glass-Wall Budget:**
- scripts/generate-glass-wall.ts queries DB → writes docs/glass-wall-budget.md → committed to git → rendered in-app via react-native-markdown-display

**Monitoring:**
- Sentry (free tier) for crash reports and error tracking; no PII in error payloads
- Supabase dashboard for DB/storage/Edge Function monitoring
- Razorpay dashboard for donation monitoring

### UX Design Requirements

No UX Design specification was produced for this project. UX decisions are embedded in the Architecture document's frontend architecture section and the PRD user journeys.

### FR Coverage Map

| FR | Epic | Summary |
|---|---|---|
| FR1 | Epic 2 | Opening Vow — first-launch read & acknowledge |
| FR2 | Epic 2 | Opening Vow — blocks content until acknowledged |
| FR3 | Epic 2 | Opening Vow — re-acknowledgment on significant updates |
| FR4 | Epic 2 | About page — name, mission, ecumenical positioning |
| FR5 | Epic 2 | Privacy Policy accessible in-app |
| FR6 | Epic 4 | Triune home screen — Mind/Body/Soul navigation |
| FR7 | Epic 4 | 2-tap path to today's featured Soul content |
| FR8 | Epic 4 | Browse meditation library by practice path |
| FR9 | Epic 4 | Filter meditations by emotional state (anxiety library) |
| FR10 | Epic 3 | Browse 50 Jesus quotes with verbatim Tamil text + verse ref |
| FR11 | Epic 3 | Search content library by topic/keyword |
| FR12 | Epic 4 | Silence Between Words — Lectio Divina track |
| FR13 | Epic 3 | Mandatory verse attribution — UI-enforced invariant |
| FR14 | Epic 4 | Bible-first hand-off link at meditation end |
| FR15 | Epic 4 | Audio playback controls (play/pause/seek) |
| FR16 | Epic 4 | Background audio + screen-locked playback |
| FR17 | Epic 4 | Lockscreen + hardware audio controls |
| FR18 | Epic 4 | Manual content download for offline playback |
| FR19 | Epic 4 | Progressive auto-download on first launch |
| FR20 | Epic 4 | Sleep timer (15/30/45 min) |
| FR21 | Epic 4 | Playback speed control (0.75×/1×/1.25×) |
| FR22 | Epic 3 | All content accessible without account or sign-in |
| FR23 | Epic 6 | One-time donation via Razorpay |
| FR24 | Epic 6 | Recurring monthly donation via Razorpay |
| FR25 | Epic 6 | Email consent at donation — single stated purpose |
| FR26 | Epic 6 | Atomic 10% pay-it-forward allocation at transaction |
| FR27 | Epic 6 | Donor email acknowledgment after confirmed donation |
| FR28 | Epic 6 | Glass-Wall Budget — income/expenses/pay-forward visible |
| FR29 | Epic 6 | Named pay-it-forward beneficiary visible in-app |
| FR30 | Epic 2 | Theological concern submission — no account required |
| FR31 | Epic 2 | Automated acknowledgment with 7-day SLA |
| FR32 | Epic 2 | Public correction disclosure in Glass-Wall Budget |
| FR33 | Epic 7 | Operator views and responds to submitted concerns |
| FR34 | Epic 5 | Verse card generation and share to WhatsApp |
| FR35 | Epic 5 | Optional Sunday church attendance tracker (no streaks) |
| FR36 | Epic 7 | Operator adds/updates/publishes content via Supabase admin |
| FR37 | Epic 7 | Per-track audio regeneration without affecting library |
| FR38 | Epic 6 | Glass-Wall Budget update → About page auto-reflects |
| FR39 | Epic 7 | Operator views error/crash reports via Sentry |
| FR40 | Epic 7 | Operator views donation totals and pay-forward summaries |
| FR41 | Epic 4 | Keerthanai instrumental audio — distinctly Christian |
| FR42 | Epic 5 | Verse attribution mandatory on shared verse card |

## Epic List

### Epic 1: Project Foundation & Validated Architecture
A fully working development environment with all five technical risks resolved before any user screen is written — the stable bedrock everything else is built on. No code written after this epic will be blocked by an architectural unknown.
**Covers:** Project scaffold (create-expo-stack), TypeScript strict + path aliases, i18n setup (react-i18next + ta.json), 9-table Supabase schema + migrations, Expo SQLite + Tamil OV Bible import, service layer (lib/), 3 Zustand stores skeleton, GitHub Actions CI, 3 EAS build profiles, Sentry wiring, 5 Week-1 critical spikes, ElevenLabs generation script skeleton.
**NFRs directly addressed:** NFR-I1, NFR-I2, NFR-SC3, NFR-S5, NFR-P5

### Epic 2: Theological Onboarding & Identity
A first-time user encounters Arokia's theological foundation through the Opening Vow — before any content is seen — and can access the About page, Privacy Policy, and concern submission form. The product's trust and honesty are fully expressed from first launch.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR30, FR31, FR32

### Epic 3: The Word — Scripture Browser & Search
Users can browse all 50 Jesus quotes in Tamil with verbatim text and mandatory verse attribution, and search the content library by topic or keyword. The VerseText TypeScript invariant is the cornerstone — a scripture display without attribution is a compile error.
**FRs covered:** FR10, FR11, FR13, FR22

### Epic 4: The Walk — Triune Home & Full Audio Meditation Practice
Users can navigate the Mind/Body/Soul practice paths, play all 21 meditation tracks (15 + 5 anxiety + 1 Lectio Divina) with background audio, lockscreen controls, offline cache, sleep timer, and speed control. The complete daily spiritual practice rhythm is live.
**FRs covered:** FR6, FR7, FR8, FR9, FR12, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR41

### Epic 5: Sharing — Verse Cards & Worship Tracker
Users can generate a branded Tamil verse card (verbatim text + verse attribution + Arokia mark) and share it to WhatsApp or any app — fully offline-capable. Users can optionally mark Sunday church attendance with no streak or gamification.
**FRs covered:** FR34, FR35, FR42

### Epic 6: Integrity — Donation & Glass-Wall Transparency
Users can donate (one-time or recurring) via Razorpay with full consent, receive a receipt acknowledgment, and see the complete Glass-Wall Budget showing every rupee received, spent, and paid forward to the named quarterly beneficiary — with 10% allocated atomically at each transaction.
**FRs covered:** FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR38

### Epic 7: Operator — Content Pipeline & Operations
The operator (Lawrence) can manage the full 7-stage content review pipeline (draft → published), regenerate audio for a single track during theological corrections, respond to user concerns, and monitor app health and donation summaries through Supabase admin + existing dashboards.
**FRs covered:** FR33, FR36, FR37, FR39, FR40

---

## Epic 1: Project Foundation & Validated Architecture

A fully working development environment with all five technical risks resolved before any user screen is written — the stable bedrock everything else is built on. No code written after this epic will be blocked by an architectural unknown.

### Story 1.1: Project Scaffold & Developer Experience Setup

As a developer,
I want a fully scaffolded React Native + Expo project with TypeScript strict mode, NativeWind, Expo Router, Supabase client, i18n initialized with Tamil locale, and all folder/naming conventions in place,
So that every subsequent story builds on a consistent, type-safe foundation with zero hardcoded strings from the first commit.

**Acceptance Criteria:**

**Given** the developer runs `npx create-expo-stack@latest arokia --expo-router --nativewind --supabase` with Zustand selected
**When** `npx expo start` is executed
**Then** the app launches without errors on both iOS and Android simulators

**Given** the scaffolded project
**When** `tsc --noEmit` is run
**Then** it passes with zero errors with `"strict": true` in `tsconfig.json`

**Given** the project structure
**When** a component uses `import { X } from '@/components/scripture/VerseText'`
**Then** it resolves correctly — path alias `@/*` → project root is configured in `tsconfig.json`

**Given** the i18n setup
**When** a component calls `useTranslation()` and accesses keys in the `vow`, `home`, `audio`, `donation`, and `errors` namespaces
**Then** all keys resolve to Tamil strings from `locales/ta.json` with no missing-key warnings

**Given** any component in the codebase
**When** reviewed for hardcoded strings
**Then** zero Tamil or English UI strings are hardcoded — all reference i18n keys (NFR-I1)

**Given** the folder structure
**When** inspected
**Then** `app/`, `components/`, `lib/`, `constants/`, `locales/`, `assets/`, `store/`, `types/` all exist as per the architecture spec

---

### Story 1.2: Supabase Schema & Database Migrations

As a developer,
I want all 9 Supabase tables created via version-controlled CLI migrations with correct columns, constraints, and RLS policies,
So that all subsequent stories write application code against a stable, correct schema with no ad-hoc dashboard edits ever.

**Acceptance Criteria:**

**Given** `supabase/migrations/` contains the schema migration files
**When** `supabase db push` is run
**Then** all 9 tables are created without errors: `content_items`, `audio_assets`, `correction_log`, `theological_concerns`, `donations`, `beneficiaries`, `allocation_entries`, `disbursements`, `analytics_events`

**Given** the `content_items` table
**When** an INSERT is attempted without a `verse_reference` value
**Then** the DB rejects it with a NOT NULL constraint error

**Given** the RLS policies
**When** an anonymous client queries `content_items`
**Then** only rows with `review_status = 'published'` are returned; all other rows are invisible

**Given** the `theological_concerns` table RLS
**When** an anonymous client calls INSERT on `theological_concerns`
**Then** the insert succeeds; a SELECT by the same anonymous client returns no rows

**Given** the Supabase client in `lib/supabase.ts`
**When** initialized with `SUPABASE_URL` and `SUPABASE_ANON_KEY` from EAS environment variables
**Then** `supabase.from('content_items').select('id').limit(1)` returns without error

**Given** the source code
**When** searched for hardcoded Supabase URL or key strings
**Then** none are found — all credentials come from environment variables

---

### Story 1.3: Expo SQLite + Tamil OV Bible Data Bundle

As a developer,
I want the Tamil OV scripture data imported into a bundled Expo SQLite v2 database,
So that scripture text and verse references are available offline from first launch with no network request.

**Acceptance Criteria:**

**Given** `scripts/seed-sqlite.ts` is run
**When** it completes
**Then** the SQLite DB contains all New Testament books with columns: `book`, `chapter`, `verse`, `text` (verbatim Tamil OV), `language_code = 'ta'`

**Given** the bundled SQLite DB at runtime
**When** `db.getFirstAsync('SELECT text FROM scripture WHERE book=? AND chapter=? AND verse=?', ['Matthew', 6, 25])` is called
**Then** it returns the correct verbatim Tamil OV text in ≤50 ms

**Given** a Tamil keyword search query
**When** full-text search is executed against the bundled DB
**Then** results are returned in ≤500 ms on a mid-range Android simulator

**Given** the bundled DB file
**When** its size is measured
**Then** it is documented and does not push the offline package above the 50 MB NFR-P5 budget

**Given** the app running offline (airplane mode)
**When** any scripture lookup is performed
**Then** it completes correctly with no network request — the DB is read-only and fully local

---

### Story 1.4: Service Layer, Domain Types & Zustand Store Skeletons

As a developer,
I want typed service functions in `lib/` and initialized Zustand store shells with the full state shape defined,
So that no component ever contains a raw Supabase query and all state patterns are established before any UI story begins.

**Acceptance Criteria:**

**Given** the `lib/` directory
**When** inspected
**Then** these files exist with typed function signatures: `supabase.ts`, `content.ts` (`getQuotes`, `getMeditations`, `searchContent`), `donations.ts` (`getDonationSummary`, `getPayForwardSummary`, `getDisbursements`), `concerns.ts` (`submitConcern`), `audio.ts` (`resolveAudioUrl`, `downloadTrack`, `prefetchQueue`), `analytics.ts` (`logEvent`)

**Given** `types/content.ts`
**When** reviewed
**Then** it defines exactly: `ContentItem`, `PracticePath` (`'mind'|'body'|'soul'`), `ProductPillar`, `ContentType`, `TimeOfDay`, `MoodTag`, `LanguageCode`, `ReviewStatus` — and `verseReference: string` (never `string | undefined`) on `ContentItem`

**Given** `types/donation.ts` and `types/analytics.ts`
**When** reviewed
**Then** `Donation`, `AllocationEntry`, `Disbursement`, `AnalyticsEvent`, `AnalyticsEventType` are defined as per the architecture

**Given** `store/audioStore.ts`, `store/contentStore.ts`, `store/prefsStore.ts`
**When** reviewed
**Then** each is a Zustand store with the typed state shape defined; state is updated via named actions only — no direct `setState` spreads outside the store

**Given** the entire `lib/` and `store/` codebase
**When** `tsc --noEmit` is run
**Then** zero type errors

**Given** a component that uses `import { getQuotes } from '@/lib/content'` or `useAudioStore(state => state.currentTrack)`
**When** TypeScript compiles it
**Then** zero errors — types flow correctly from store to component

---

### Story 1.5: GitHub Actions CI, EAS Build Profiles & Sentry

As a developer,
I want automated CI that enforces type safety, linting, and a no-tracker audit on every PR, three EAS build profiles configured, and Sentry wired for crash reporting,
So that theological integrity (zero trackers) is machine-enforced and crash visibility is live from the first real device build.

**Acceptance Criteria:**

**Given** `.github/workflows/ci.yml`
**When** a PR is opened or updated
**Then** the CI run executes: `tsc --noEmit`, `eslint`, and a grep-based tracker audit checking `package.json`, `ios/Podfile`, `android/build.gradle` for `firebase`, `@react-native-firebase`, `mixpanel`, `amplitude`, `@amplitude`, `react-native-google-analytics`, `facebook-sdk` — and fails the build if any are found (NFR-S5)

**Given** `eas.json`
**When** reviewed
**Then** three profiles are defined: `development` (Expo dev client, local), `preview` (TestFlight + Firebase App Distribution), `production` (App Store + Play Store)

**Given** `Sentry.init({ dsn: process.env.SENTRY_DSN })` in `app/_layout.tsx`
**When** a test `Sentry.captureMessage('sentry-init-test')` is called
**Then** the event appears in the Sentry dashboard

**Given** Sentry's `beforeSend` hook
**When** any error is captured
**Then** the payload contains no PII — user context is stripped; only error message and stack trace are sent (NFR-PR2)

**Given** the current `main` branch
**When** the CI workflow runs
**Then** it passes with a green check on GitHub

---

### Story 1.6: react-native-track-player Background Audio Spike

As a developer,
I want to validate that `react-native-track-player` plays audio with the screen locked and handles phone-call interruptions on physical iOS and Android devices,
So that the managed-vs-bare Expo workflow decision is resolved before any app screen is written — this is the single highest-risk architectural gate.

**Acceptance Criteria:**

**Given** `react-native-track-player` v4+ installed and a test `.m4a` track
**When** the track plays and the iOS 16+ physical device screen is locked
**Then** the lockscreen Now Playing card is visible with functional play/pause/seek controls; audio continues uninterrupted

**Given** the same test
**When** run on a physical Android 11+ device
**Then** lockscreen media controls are functional; audio continues while backgrounded

**Given** audio is playing on either platform
**When** an incoming phone call is received
**Then** audio pauses immediately on call start and resumes automatically when the call ends (NFR-R2)

**Given** Expo managed workflow is confirmed working
**When** this story is completed
**Then** `docs/SPIKE_RNTP.md` is committed documenting: platform tested, OS version, RNTP version, and "MANAGED_WORKFLOW: VALIDATED"

**Given** bare workflow is required instead
**When** this is determined
**Then** `expo prebuild` is run and the project is ejected BEFORE this story is marked complete; `docs/SPIKE_RNTP.md` documents the reason; CI is updated for bare workflow

**Given** this story
**When** marked complete
**Then** physical-device validation on BOTH platforms has passed — simulator validation alone is insufficient

---

### Story 1.7: Tamil Rendering, AAC Format, Offline Cache & Razorpay Device Spikes

As a developer,
I want to validate four remaining technical architecture assumptions — Tamil Unicode rendering, 64 kbps mono AAC format, offline cache playback, and Razorpay test payment end-to-end —
So that no unresolved architectural assumption remains before UI development begins.

**Acceptance Criteria:**

**Given** (SPIKE-1: Tamil text) a screen displaying `"வருத்தப்பட்டுப் பாரஞ்சுமக்கிறவர்களே"` using system Tamil fonts
**When** rendered on Android 11+ and iOS 16+ physical devices
**Then** correct ligatures appear with no glyph fallback; no layout overflow at 320dp screen width (NFR-I3)

**Given** (SPIKE-3: AAC format) a Tamil voice generation via ElevenLabs Multilingual v2 at 64 kbps mono
**When** the `.m4a` file is inspected
**Then** a 7-minute file is ≤3.5 MB; the file plays correctly via `react-native-track-player` with audible Tamil speech quality

**Given** (SPIKE-4: Offline cache) `expo-file-system` downloads a test `.m4a` to `FileSystem.documentDirectory`
**When** the device is switched to airplane mode and the file is played via `react-native-track-player`
**Then** playback starts in ≤500 ms with no network errors; no network request is made during playback (NFR-P2)

**Given** (SPIKE-5: Razorpay) a test-mode payment initiated via external webview
**When** the payment completes in test mode
**Then** the Razorpay test dashboard shows it as successful; a manual webhook simulation inserts a `donations` row with `status = 'confirmed'`

**Given** all four spikes completed
**When** `docs/SPIKES_VALIDATION.md` is committed
**Then** it documents pass/fail for each spike, device model + OS version tested, and any deviations from the architecture spec

---

### Story 1.8: ElevenLabs Audio Generation Script

As an operator,
I want a CLI script that generates Tamil audio for a content item from ElevenLabs and uploads it to Supabase Storage,
So that I can produce, replace, and per-track-regenerate audio files during content production and theological corrections without touching any app code.

**Acceptance Criteria:**

**Given** `scripts/generate-audio.ts` is run with `--id <content_item_id>`
**When** it executes
**Then** it reads `scripture_text` and `verse_reference` from `content_items`, calls ElevenLabs Multilingual v2 Tamil voice, and receives a 64 kbps mono M4A file

**Given** a successful generation
**When** the script completes
**Then** the file is uploaded to `audio` Supabase Storage at `ta/<content_type>/<content_item_id>.m4a`; an `audio_assets` row is inserted; `content_items.audio_asset_id` is updated

**Given** an existing content item that already has audio
**When** the script is run again with the same `--id`
**Then** the old file is replaced, the `audio_assets` record is updated, and no other content items are affected (FR37 pre-validation)

**Given** the ElevenLabs API key
**When** source code and CI artifacts are inspected
**Then** the key appears only in a local `.env` file listed in `.gitignore` — never in the app binary, never in git history

**Given** the script is run with `--dry-run`
**When** it executes
**Then** it logs the planned action without calling the ElevenLabs API or writing to the DB

---

## Epic 2: Theological Onboarding & Identity

A first-time user encounters Arokia's theological foundation through the Opening Vow — before any content is seen — and can access the About page, Privacy Policy, and concern submission form. The product's trust and honesty are fully expressed from first launch.

### Story 2.1: Opening Vow — First-Launch Gate

As a first-time user,
I want to read and acknowledge the Opening Vow before any content is accessible,
So that I understand from the first moment that Arokia is a tool pointing to Jesus, not a replacement for Him.

**Acceptance Criteria:**

**Given** a user opens Arokia for the first time
**When** the app loads
**Then** the Opening Vow screen is the first screen shown — no content, home screen, or navigation is accessible until the Vow is acknowledged

**Given** the Opening Vow screen is displayed
**When** the user reads it
**Then** the screen displays the verbatim Tamil vow text (from `ta.json`), the acknowledgment button (ஆமென் — தொடங்கு), and no other navigation options

**Given** the user taps the acknowledgment button
**When** the tap registers
**Then** `vow_completed` analytics event is logged; the user is navigated to the home screen; the vow state is persisted in `AsyncStorage` so it does not reappear on subsequent launches

**Given** the user has NOT tapped the acknowledgment button
**When** they attempt to navigate away (back gesture, deep link)
**Then** navigation is blocked — the Vow screen remains; the app does not reveal content (FR2)

**Given** the Opening Vow screen
**When** measured against accessibility standards
**Then** the acknowledgment button has a minimum 48×48 dp touch target (NFR-A1); text meets WCAG AA contrast (NFR-A3); all strings are from `ta.json` with no hardcoded text (NFR-I1)

---

### Story 2.2: Returning User Re-acknowledgment & Vow State Management

As a returning user,
I want the Opening Vow to reappear after significant app updates,
So that theological changes or corrections to the Vow are explicitly acknowledged, not silently accepted.

**Acceptance Criteria:**

**Given** a user has previously acknowledged the Opening Vow
**When** they relaunch the app with no version change
**Then** the Vow screen is NOT shown — they go directly to the home screen

**Given** a significant app update that increments the Vow version (operator-controlled via a version constant)
**When** the returning user launches the updated app
**Then** the Vow screen reappears with a brief note indicating the Vow has been updated (FR3); the user must re-acknowledge before accessing content

**Given** the vow version constant in `constants/vow.ts`
**When** the operator increments it (e.g., `VOW_VERSION = 2`)
**Then** all users whose persisted `vowAcknowledgedVersion` is less than the current version see the Vow screen on next launch

**Given** the vow acknowledgment state
**When** inspected in `AsyncStorage`
**Then** it stores only `vowAcknowledgedVersion: number` — no user identity, no PII (NFR-PR1)

---

### Story 2.3: About Page & Privacy Policy

As any user,
I want to read Arokia's About page describing its name, mission, and ecumenical positioning, and access the Privacy Policy,
So that I can understand and trust the product's identity and data practices before or after engaging with content.

**Acceptance Criteria:**

**Given** the About page is accessible from the app navigation
**When** opened
**Then** it displays: (1) the meaning of Arokia (ஆரோக்கியம்) and the name story including Arokia Matha heritage; (2) the four pillars; (3) the ecumenical positioning statement serving all Tamil Christians; (4) the correction disclosure process; (5) the current Glass-Wall Budget rendered from `docs/glass-wall-budget.md` via `react-native-markdown-display` (FR4, FR28)

**Given** the Privacy Policy link in the About page
**When** tapped
**Then** the Privacy Policy is displayed in-app (not requiring a browser); it is accessible at all times including before the Opening Vow is acknowledged (FR5)

**Given** the About page
**When** reviewed
**Then** all text content is sourced from `ta.json` or the markdown budget file — no hardcoded strings; accessible with no account required (NFR-PR1, NFR-I1)

**Given** the `docs/glass-wall-budget.md` file
**When** the About page loads
**Then** it is rendered with `react-native-markdown-display`; if unavailable (offline, first launch), a graceful fallback message is shown (NFR-R3)

---

### Story 2.4: Theological Concern Submission Form

As any user,
I want to submit a theological concern without creating an account,
So that the community can be a check on content accuracy, and I receive confirmation that my concern will be reviewed within 7 days.

**Acceptance Criteria:**

**Given** the concern submission form accessible from the About page
**When** opened
**Then** it displays: (1) which content the concern is about (optional); (2) description of the concern (required); (3) name and email (both optional) — and a Submit button (FR30)

**Given** the user submits a concern
**When** sent via `lib/concerns.ts:submitConcern()`
**Then** a row is inserted into `theological_concerns` with `status = 'open'`; an automated acknowledgment email is triggered stating the 7-day review SLA (FR31)

**Given** a successful submission
**When** the user sees the result
**Then** a confirmation screen displays the 7-day SLA message in Tamil; no account creation or login is prompted (NFR-PR1)

**Given** the user submits with no network connection
**When** the submission fails
**Then** a clear offline error message is shown from `ta.json`; the form data is preserved so the user can retry (NFR-R3)

**Given** the email field
**When** the user provides an email
**Then** it is stored in `theological_concerns.submitter_email` and used only for the acknowledgment reply — no marketing emails, no identity linking (NFR-PR3, NFR-S4)

---

## Epic 3: The Word — Scripture Browser & Search

Users can browse all 50 Jesus quotes in Tamil with verbatim text and mandatory verse attribution, and search the content library by topic or keyword. The VerseText TypeScript invariant is the cornerstone — a scripture display without attribution is a compile error.

### Story 3.1: VerseText Component & Scripture Attribution Invariant

As a developer,
I want a `VerseText` component that makes `reference` a non-optional TypeScript prop — and a `ScriptureCard` that enforces the same — so that it is impossible to render scripture without attribution at compile time.

**Acceptance Criteria:**

**Given** `components/scripture/VerseText.tsx`
**When** reviewed
**Then** it accepts `{ text: string; reference: string; languageCode: string }` with `reference` non-optional; a usage without `reference` is a TypeScript compile error, not a runtime check

**Given** `components/scripture/ScriptureCard.tsx`
**When** it renders
**Then** it always displays verbatim scripture text AND the full verse reference (book, chapter, verse) together — the reference cannot be conditionally hidden (FR13)

**Given** text at 1× system font size
**When** the user scales system font to 1.5×
**Then** both `VerseText` and `ScriptureCard` remain fully readable with no overflow or clipping (NFR-A2)

**Given** any text rendered by `VerseText`
**When** contrast is checked
**Then** it meets WCAG AA contrast ratios in both light and dark modes (NFR-A3)

**Given** `components/scripture/index.ts`
**When** reviewed
**Then** it exports `VerseText`, `ScriptureCard`, and `VerseCardView` (stub for Epic 5) as a barrel export

---

### Story 3.2: Jesus Quotes Browser

As a Tamil Christian user,
I want to browse all 50 Jesus quotes from the Gospels, each showing verbatim Tamil text with its verse reference,
So that I can encounter and dwell on Jesus's direct words at any time without needing an account.

**Acceptance Criteria:**

**Given** the user navigates to the Quotes section
**When** the screen loads
**Then** all published `content_items` with `content_type = 'quote'` and `language_code = 'ta'` are displayed as a scrollable list of `ScriptureCard` components, each showing verbatim Tamil text and verse reference (FR10)

**Given** the quotes list
**When** rendered on a mid-range Android simulator
**Then** it reaches a scrollable interactive state in ≤1 second (NFR-P4)

**Given** a quote in the list
**When** the user taps it
**Then** a detail screen opens showing the full verbatim Tamil text, verse reference, audio play button (if audio available), and share button

**Given** the detail screen
**When** reviewed for account requirements
**Then** zero sign-in prompts appear; the full quote and audio are accessible anonymously (FR22, NFR-PR1)

**Given** 50 quotes seeded in `content_items` with `review_status = 'published'`
**When** the quotes browser loads
**Then** all 50 are visible; the RLS policy correctly hides any draft items

---

### Story 3.3: Scripture Content Search

As a Tamil Christian user,
I want to search the content library by topic or keyword,
So that I can find the words of Jesus relevant to what I am facing right now — anxiety, grief, identity, forgiveness — without scrolling through the entire library.

**Acceptance Criteria:**

**Given** the search interface accessible from the content browser
**When** the user enters a Tamil keyword (e.g., "கவலை")
**Then** `lib/content.ts:searchContent()` queries the Expo SQLite full-text index and returns matching quotes within ≤500 ms (FR11)

**Given** the search results
**When** displayed
**Then** each result shows a `ScriptureCard` with verbatim text and verse reference — no result is rendered without attribution (FR13)

**Given** an English keyword is entered (e.g., "peace")
**When** the search executes
**Then** matching results are returned from verse references or English-language fields; Tamil results are prioritized

**Given** a search with no results
**When** displayed
**Then** a helpful empty state is shown in Tamil from `ta.json` — no raw English fallback

**Given** the user clears the search input
**When** the field is empty
**Then** the full quotes list is restored without a full reload

---

### Story 3.4: Content Seeding — 50 Jesus Quotes

As an operator,
I want all 50 MVP Jesus quotes entered into `content_items` with correct Tamil OV text, verse references, `practice_path`, `product_pillar`, and `mood_tag` values,
So that the Scripture Browser displays the full intended content set from the first user-facing release.

**Acceptance Criteria:**

**Given** `scripts/seed-content.ts` is run (or Supabase admin entry is complete)
**When** the `content_items` table is queried
**Then** exactly 50 rows exist with `content_type = 'quote'`, `language_code = 'ta'`, `review_status = 'published'`, and a non-null `verse_reference` on every row

**Given** each of the 50 rows
**When** the `scripture_text` is compared against the Tamil OV source
**Then** the text is verbatim — no paraphrasing, no summarizing, no "based on" language

**Given** each row's `verse_reference`
**When** verified against the Tamil OV Bible data in Expo SQLite
**Then** the reference resolves to a valid book/chapter/verse — no orphaned or malformed references

**Given** the `practice_path`, `product_pillar`, `mood_tag`, and `time_of_day` fields
**When** reviewed across all 50 rows
**Then** each row has valid non-null values; `time_of_day` is `'any'` for all MVP content

**Given** the quotes browser (Story 3.2) running against this seeded data
**When** a user opens it
**Then** all 50 quotes are visible and correctly attributed

---

## Epic 4: The Walk — Triune Home & Full Audio Meditation Practice

Users can navigate the Mind/Body/Soul practice paths, play all 21 meditation tracks (15 + 5 anxiety + 1 Lectio Divina) with background audio, lockscreen controls, offline cache, sleep timer, and speed control. The complete daily spiritual practice rhythm is live.

### Story 4.1: Triune Home Screen (Mind / Body / Soul Navigation)

As a Tamil Christian user,
I want to navigate to three distinct practice paths (Mind, Body, Soul) from the home screen and reach today's featured Soul content within two taps,
So that daily spiritual practice has a clear, calm entry point that reflects the wholeness Arokia is built on.

**Acceptance Criteria:**

**Given** a user who has completed the Opening Vow
**When** they arrive at the home screen
**Then** three clearly labelled practice path tiles are shown: 🧠 மனம் (Mind), 💪 உடல் (Body), 🕊️ ஆத்மா (Soul) — each as a distinct tappable area with ≥48×48 dp touch target (FR6, NFR-A1)

**Given** the home screen
**When** the user taps the Soul tile
**Then** they reach today's featured Soul meditation within one more tap — total 2 taps from home to playing content (FR7, NFR-A4)

**Given** the `<TimeOfDayBanner>` component slot in `app/(tabs)/index.tsx`
**When** rendered in v1
**Then** it renders `null`; the `timeFilter` constant is `'any'`; the component accepts a `timeFilter` prop so v1.1 can activate it without structural change

**Given** the `<TriuneGrid>` component
**When** it receives `timeFilter = 'any'`
**Then** it passes the filter to `lib/content.ts:getMeditations()` — the time-of-day filtering infrastructure is wired even though v1 always passes `'any'`

**Given** all home screen strings
**When** reviewed
**Then** zero are hardcoded — all come from `ta.json` home namespace (NFR-I1)

---

### Story 4.2: Meditation Library — Browse by Practice Path & Emotional State

As a Tamil Christian user,
I want to browse the full meditation library filtered by practice path (Mind/Body/Soul) and by emotional state (anxious, grieving, angry, lonely, tempted),
So that I can find the right meditation for what I am carrying today, not just what is newest.

**Acceptance Criteria:**

**Given** the user taps a practice path tile (e.g., Mind)
**When** the library screen loads
**Then** all published meditations with matching `practice_path` are shown as a list with title, duration, and mood tag (FR8)

**Given** the anxiety library accessible from the home screen or Mind path
**When** the user selects an emotional state (e.g., "கவலை" — anxious)
**Then** only meditations with the matching `mood_tag` are shown; `mood_tag = 'none'` meditations are excluded (FR9)

**Given** the meditation list
**When** rendered on a mid-range Android simulator
**Then** it reaches interactive state in ≤1 second (NFR-P4)

**Given** any meditation in the list
**When** tapped
**Then** a detail screen opens with title, verse reference, duration, and a prominent Play button — no account prompt (NFR-PR1)

**Given** the Lectio Divina track (`content_type = 'lectio'`)
**When** browsing the Soul path
**Then** the "Silence Between Words" track is discoverable and accessible (FR12)

---

### Story 4.3: Audio Player — Core Playback with Background & Lockscreen Controls

As a Tamil Christian user,
I want to play any meditation track with standard controls and continue listening while my screen is locked or I use other apps,
So that I can listen during my commute, while walking, or before sleep without the audio cutting out.

**Acceptance Criteria:**

**Given** the user taps Play on a meditation
**When** the track starts from a cached local file
**Then** audio begins within 500 ms (NFR-P2); `meditation_started` analytics event is logged

**Given** audio is playing and the user presses the home button or locks the screen
**When** the device is backgrounded or screen-locked
**Then** audio continues uninterrupted; the lockscreen Now Playing card shows the meditation title and play/pause/seek controls (FR16, FR17)

**Given** audio is playing and hardware headphone buttons or Bluetooth controls are used
**When** play/pause or skip is triggered
**Then** the audio responds correctly (FR17)

**Given** audio is playing and an incoming phone call arrives
**When** the call connects
**Then** audio pauses immediately; when the call ends, audio resumes automatically (NFR-R2)

**Given** the persistent mini-player in `app/(tabs)/_layout.tsx`
**When** a track is playing and the user navigates between tabs
**Then** the `PlayerBar` component remains visible above the tab bar; tapping it opens the full player screen

**Given** the app memory during active background audio
**When** measured on a mid-range Android device
**Then** in-session memory footprint stays ≤150 MB (NFR-P3)

---

### Story 4.4: Audio Player — Sleep Timer, Speed Control & Bible Hand-off

As a Tamil Christian user,
I want to set a sleep timer so audio stops automatically, adjust playback speed for better Tamil comprehension, and open the full scripture passage in an external Bible app when a meditation ends,
So that the audio experience serves my actual context — night-time listening, slower comprehension needs, and a desire to go deeper into Scripture.

**Acceptance Criteria:**

**Given** the full player screen
**When** the user opens the sleep timer control
**Then** they can select 15, 30, or 45 minutes; audio stops automatically at the selected time (FR20)

**Given** the playback speed control
**When** the user selects a speed
**Then** they can choose 0.75×, 1×, or 1.25×; the speed change is applied immediately to the current track (FR21)

**Given** a meditation reaches its end
**When** the track completes
**Then** a "Read the full passage" link appears showing the verse reference; tapping it opens the complete scripture chapter in an external Tamil Bible resource via deep link or browser (FR14)

**Given** the Bible hand-off link
**When** tapped
**Then** `scripture_link_opened` analytics event is logged; the user leaves Arokia — the app does not intercept or frame the external Bible resource

**Given** all player UI strings
**When** reviewed
**Then** all come from `ta.json`; no hardcoded strings (NFR-I1)

---

### Story 4.5: Offline Content Download — Progressive Cache & Manual Download

As a Tamil Christian user,
I want meditation audio to download automatically when I first play a track, with subsequent tracks pre-fetched silently, and the option to manually download a week's content,
So that I can listen fully offline during my commute, in rural areas, or wherever connectivity is poor.

**Acceptance Criteria:**

**Given** a user plays a track for the first time
**When** playback starts
**Then** `lib/audio.ts:downloadTrack()` downloads the `.m4a` to `FileSystem.documentDirectory` before or during playback; `audioStore` records the local file path in its cache manifest (FR18)

**Given** a track has begun playing
**When** `lib/audio.ts:prefetchQueue()` runs in the background
**Then** it silently pre-fetches the next 2 tracks in the current path queue with no visible UI

**Given** the user taps "Download This Week's Content" (manual option)
**When** the download begins
**Then** the estimated size (~30 MB) is shown before confirmation; progress is displayed; on completion the user is informed content is available offline (FR19)

**Given** the device is in airplane mode and a track has been previously downloaded
**When** the user taps Play
**Then** audio plays from local cache in ≤500 ms with no network request and no error (NFR-P2)

**Given** the total first-week offline content package
**When** size is measured
**Then** 9 tracks at 64 kbps mono AAC is ≤50 MB (NFR-P5)

**Given** a cached file in `FileSystem.documentDirectory`
**When** the OS is restarted or a low-memory event occurs
**Then** the file survives — `documentDirectory` is persistent across OS restarts

---

### Story 4.6: Meditation Content Seeding — 21 Tracks

As an operator,
I want all 21 MVP meditation tracks entered into `content_items` with Tamil audio generated and uploaded, keerthanai instrumentation in place, and all metadata fields correctly set,
So that the Triune Home and Audio Player have the full intended content set from first release.

**Acceptance Criteria:**

**Given** `content_items` after seeding
**When** queried for meditations
**Then** exactly 21 rows exist: 5 Mind, 5 Body, 5 Soul, 5 anxiety-tagged (`mood_tag` in `('anxious','grieving','angry','lonely','tempted')`), 1 Lectio Divina — all `language_code = 'ta'`, `review_status = 'published'`

**Given** each meditation row
**When** `audio_asset_id` is inspected
**Then** it references a valid `audio_assets` row; the storage path resolves to a playable `.m4a` file in Supabase Storage

**Given** each meditation's audio
**When** listened to
**Then** Tamil voice is at natural speech pace (1×) with keerthanai instrumental at 20-30% relative volume (NFR-AU1); keerthanai is distinctly Christian — no bhajan/mantra-adjacent melodic phrases (NFR-AU3, FR41)

**Given** each meditation row's `verse_reference`
**When** verified
**Then** it is non-null and resolves to a valid Tamil OV passage

**Given** all 21 audio files downloaded
**When** total size is measured
**Then** it is ≤50 MB (NFR-P5)

---

### Story 4.7: App Launch Performance & Cold Start Validation

As a Tamil Christian user,
I want the app to reach an interactive home screen within 2 seconds of launch on a mid-range Android device,
So that the app feels immediate and trustworthy — not sluggish.

**Acceptance Criteria:**

**Given** the app is cold-launched on a Snapdragon 680-class Android device (4 GB RAM, Android 11)
**When** timing is measured from tap to interactive home screen
**Then** the app reaches interactive state in ≤2 seconds (NFR-P1)

**Given** `contentStore` initializing on launch
**When** meditation metadata is fetched from Supabase
**Then** the fetch runs in the background; the home screen renders immediately from any locally cached data without blocking

**Given** the app cold-launched on iOS 16+ (returning user)
**When** timing is measured
**Then** the home screen is interactive in ≤2 seconds (NFR-P1)

**Given** the app launched with no network connection
**When** the home screen loads
**Then** it renders correctly from local SQLite data and cached content; no crash or blank screen (NFR-R3)

---

## Epic 5: Sharing — Verse Cards & Worship Tracker

Users can generate a branded Tamil verse card (verbatim text + verse attribution + Arokia mark) and share it to WhatsApp or any app — fully offline-capable. Users can optionally mark Sunday church attendance with no streak or gamification.

### Story 5.1: Verse Card Generation — VerseCardView Component

As a Tamil Christian user,
I want a shareable verse card generated from any Jesus quote — showing verbatim Tamil text, verse reference, and the Arokia mark — built entirely on-device with no network dependency,
So that I can create and share scripture even in airplane mode or areas with poor connectivity.

**Acceptance Criteria:**

**Given** `components/scripture/VerseCardView.tsx`
**When** rendered
**Then** it displays: (1) verbatim Tamil scripture text; (2) the full verse reference (book, chapter, verse); (3) the Arokia name/mark — the reference is part of the visual composition and cannot be omitted (FR42)

**Given** `react-native-view-shot` capturing `VerseCardView`
**When** the capture runs on a device in airplane mode
**Then** a PNG image is produced with no network request — the entire operation is on-device (NFR-P6)

**Given** the generated card image
**When** inspected
**Then** Tamil text renders correctly with system fonts; no glyph fallback; the Arokia mark is visible and legible

**Given** `tsc --noEmit` is run
**When** `VerseCardView` is used without a `reference` prop
**Then** TypeScript raises a compile error — the attribution invariant extends to the card component (FR42)

---

### Story 5.2: Share to WhatsApp & System Share Sheet

As a Tamil Christian user,
I want to share any Jesus quote or meditation scripture as a verse card to WhatsApp, Messages, or any installed app on my device,
So that I can share Jesus's words with family and friends in the language they grew up with.

**Acceptance Criteria:**

**Given** a user is viewing a quote detail screen or meditation end screen
**When** they tap the Share button
**Then** `react-native-view-shot` captures `VerseCardView` as a PNG; `Share.share()` opens the system share sheet with the image and verse reference text (FR34)

**Given** the system share sheet is open
**When** the user selects WhatsApp (or any installed app)
**Then** the verse card image is shared with the verse reference visible in the share text; `share_triggered` analytics event is logged

**Given** the share is initiated while the device is offline
**When** the card is generated
**Then** the on-device PNG generation completes successfully; the share sheet opens; only the destination app's network behaviour is affected by connectivity (NFR-P6)

**Given** the share content
**When** inspected
**Then** it includes: the PNG image, the verbatim Tamil text, the verse reference, and the Arokia name — no content is shared without attribution (FR42)

**Given** a share action completes or is cancelled
**When** the user returns to Arokia
**Then** the app state is exactly as they left it — no navigation side effects

---

### Story 5.3: Optional Sunday Church Attendance Tracker

As a Tamil Christian user,
I want to optionally mark that I attended worship on a given Sunday, with no streak counter, score, or gamification attached,
So that my Sunday attendance is a private act of devotion — not a metric I am being pushed to optimize.

**Acceptance Criteria:**

**Given** the attendance tracker accessible from the home screen or profile area
**When** the user opens it
**Then** they see a simple calendar view showing Sundays of the current month; previously marked Sundays have a soft visual indicator (FR35)

**Given** the user taps a Sunday
**When** they mark attendance
**Then** the date is stored locally in `AsyncStorage` with no server sync, no account; no streak count, no score, no congratulatory gamification message is shown

**Given** the tracker
**When** inspected for engagement mechanics
**Then** there is no streak counter, no "You attended X weeks in a row!" message, no reminder notification, no badge — the action is recorded quietly (FR35)

**Given** `AsyncStorage` entries for the tracker
**When** inspected
**Then** they store only `{ date: 'YYYY-MM-DD', attended: true }` entries — no user identity, no device ID, no PII (NFR-PR1)

**Given** the user has no history
**When** the tracker loads
**Then** it shows the current month's Sundays with no empty-state pressure — the tracker is an invitation, not an obligation

---

## Epic 6: Integrity — Donation & Glass-Wall Transparency

Users can donate (one-time or recurring) via Razorpay with full consent, receive a receipt acknowledgment, and see the complete Glass-Wall Budget showing every rupee received, spent, and paid forward to the named quarterly beneficiary — with 10% allocated atomically at each transaction.

### Story 6.1: Razorpay Donation Flow — One-Time & Recurring

As a Tamil Christian donor,
I want to make a one-time or monthly recurring donation via Razorpay, with an explicit email consent statement before I provide my details,
So that I can support Arokia's mission in the way that suits me, knowing my data is used only for receipt delivery.

**Acceptance Criteria:**

**Given** the user opens the donation screen
**When** they choose one-time or recurring
**Then** before any email field appears, an explicit consent statement is displayed in Tamil: email will be used only for receipt delivery, not for marketing — the user must proceed past it before the email field is shown (FR25)

**Given** the user completes the donation flow
**When** they tap "Donate"
**Then** Razorpay opens in an external webview (`SFSafariViewController` on iOS, Custom Tab on Android) — no payment data enters Arokia's codebase (FR23, NFR-S2)

**Given** the Razorpay external webview
**When** the payment is completed successfully
**Then** Razorpay redirects back to the app; the user sees a confirmation screen with the donation amount and pay-it-forward note

**Given** recurring donation is selected
**When** the user completes the Razorpay mandate flow
**Then** the recurring donation is established via Razorpay's UPI AutoPay or e-NACH; the app shows a success state (FR24)

**Given** the donation screen
**When** there is no network connection
**Then** a clear offline indicator is shown; the donation flow does not attempt to launch — no partial state is created (NFR-R3, NFR-R4)

**Given** all donation screen strings
**When** reviewed
**Then** zero are hardcoded — all come from `ta.json` donation namespace (NFR-I1)

---

### Story 6.2: Razorpay Webhook — Atomic Donation Record & Pay-It-Forward Allocation

As an operator,
I want each confirmed Razorpay payment to atomically create a donation record and allocate 10% to the current pay-it-forward beneficiary in a single transaction,
So that no donation is ever recorded without its allocation and no allocation is ever created without a confirmed payment.

**Acceptance Criteria:**

**Given** a Supabase Edge Function at `POST /functions/v1/razorpay-webhook`
**When** a Razorpay webhook event arrives
**Then** the HMAC signature is verified using `RAZORPAY_WEBHOOK_SECRET` before any DB write — an invalid signature results in a 400 response and no DB write (NFR-S3)

**Given** a valid confirmed payment webhook
**When** the Edge Function processes it
**Then** in a single Postgres transaction: (1) one `donations` row inserted with `status = 'confirmed'`; (2) one `allocation_entries` row for `bucket = 'operations'` (90%); (3) one `allocation_entries` row for `bucket = 'pay_forward'` (10%) — all three succeed or all three roll back (FR26, NFR-R4)

**Given** a duplicate webhook for the same `razorpay_payment_id`
**When** the Edge Function processes it
**Then** the unique constraint on `razorpay_payment_id` causes a conflict error; no duplicate record is created

**Given** the transaction commits and donor email is present
**When** the acknowledgment email is sent
**Then** it confirms the amount and names the current pay-it-forward beneficiary (FR27)

**Given** the `donations` table
**When** inspected for PII
**Then** only `donor_email`, `amount_paise`, `razorpay_payment_id`, and `received_at` are stored — no card numbers, no UPI handles, no bank details (NFR-S2, NFR-S4)

---

### Story 6.3: Glass-Wall Budget — Generation Script & In-App Display

As any user or donor,
I want to see the complete Glass-Wall Budget showing every rupee received, spent, and paid forward — including the current quarter's named beneficiary — rendered from version-controlled data,
So that I can trust Arokia's financial integrity before, during, and after donating.

**Acceptance Criteria:**

**Given** `scripts/generate-glass-wall.ts` is run
**When** it executes
**Then** it queries `allocation_entries`, `disbursements`, and `beneficiaries` and writes `docs/glass-wall-budget.md` with: cumulative income, operations spend, pay-it-forward allocated, total disbursed, and the current quarter's named beneficiary (FR28, FR29)

**Given** the generated markdown file
**When** committed to git and the app is updated via Expo OTA
**Then** the About page renders the new budget within 24 hours of the commit using `react-native-markdown-display` (FR38)

**Given** the About page rendering the budget
**When** a donor views it
**Then** they see: total donations received, operational costs breakdown, pay-it-forward amount this quarter, and the named beneficiary with amount committed (FR29)

**Given** the script output
**When** compared against manual arithmetic from the DB
**Then** all figures match exactly — no manual math risk; the git commit history is the auditable record

**Given** the `docs/glass-wall-budget.md` file
**When** the app loads offline
**Then** the budget renders correctly without any network request (NFR-R3)

---

### Story 6.4: Donation Summary & Pay-It-Forward Beneficiary Management

As an operator,
I want to view donation totals from the Razorpay dashboard, manage the current pay-it-forward beneficiary in Supabase, and update the Glass-Wall Budget so users see the latest numbers,
So that the full transparency loop from donation → allocation → disclosure → beneficiary operates without any custom admin UI.

**Acceptance Criteria:**

**Given** the Razorpay dashboard
**When** the operator logs in
**Then** donation totals, recurring donor count, and webhook delivery status are visible (FR40) — no custom dashboard needed in v1

**Given** the `beneficiaries` table in Supabase admin
**When** a new quarter begins
**Then** the operator can insert a new `beneficiaries` row with `name`, `quarter`, `active = true` and set the previous beneficiary's `active = false`; this immediately affects the next `generate-glass-wall.ts` run

**Given** a new `disbursements` row inserted via Supabase admin
**When** `scripts/generate-glass-wall.ts` is run
**Then** the script output reflects the new disbursement; the committed markdown is the public, auditable record (FR38)

**Given** `lib/donations.ts:getDonationSummary()` and `getPayForwardSummary()`
**When** called
**Then** they return correct aggregated figures from `allocation_entries` and `disbursements` — these functions power the About page budget display

---

## Epic 7: Operator — Content Pipeline & Operations

The operator (Lawrence) can manage the full 7-stage content review pipeline (draft → published), regenerate audio for a single track during theological corrections, respond to user concerns, and monitor app health and donation summaries through Supabase admin + existing dashboards.

### Story 7.1: Content Management via Supabase Admin — Full Review Pipeline

As an operator,
I want to manage the full content review pipeline (draft → source_verified → advisor_reviewed → audio_generated → qa_passed → published) through Supabase admin, with each stage transition being a deliberate, logged action,
So that no content reaches users without passing every review gate, and the pipeline is auditable from first entry to publication.

**Acceptance Criteria:**

**Given** a new Jesus quote or meditation is created via Supabase admin
**When** the row is inserted
**Then** it is created with `review_status = 'draft'` by default; it is invisible to app users (RLS: only `published` rows returned)

**Given** the operator advances a row through the pipeline
**When** `review_status` is updated through each stage in sequence
**Then** each transition is a single column update in Supabase admin; the row remains invisible to app users until `review_status = 'published'` (FR36)

**Given** a row reaches `review_status = 'published'`
**When** the app's `contentStore` refreshes on next launch
**Then** the new content appears in the appropriate browse list without requiring an app store release

**Given** the content pipeline across all 71 MVP content items (50 quotes + 21 meditations)
**When** the operator completes the pipeline for all items
**Then** every item has `verse_reference NOT NULL`, `review_status = 'published'`, and a valid `audio_asset_id`

**Given** the operator updates a published item's metadata via Supabase admin
**When** the change is made
**Then** it is reflected in the app within 24 hours via Expo OTA content refresh — no app release required

---

### Story 7.2: Theological Correction — Per-Track Audio Regeneration & Public Disclosure

As an operator,
I want to correct a theological error in a published content item — updating the text, regenerating the audio, and publicly disclosing the correction in the Glass-Wall Budget — without affecting any other content items,
So that Arokia's correction loop is trustworthy and transparent: errors are fixed, not buried.

**Acceptance Criteria:**

**Given** a theological concern received via the in-app form or advisor email
**When** the operator reviews it in the `theological_concerns` table
**Then** the row's `status` can be updated to `under_review`, `resolved`, or `dismissed`; the submitter email is available for a personal reply (FR33)

**Given** the correction is confirmed
**When** the operator updates the content
**Then** the old item's `review_status` is set to `superseded`; a new row is inserted with `version = old_version + 1`, corrected `scripture_text` and `verse_reference`, `review_status = 'draft'` — it re-enters the full review pipeline

**Given** the corrected item reaches `review_status = 'audio_generated'`
**When** `scripts/generate-audio.ts --id <content_item_id>` is run
**Then** only the specified track's audio is regenerated and re-uploaded; no other audio files are affected (FR37)

**Given** the correction is published
**When** a `correction_log` row is inserted
**Then** it contains `content_item_id`, `old_version`, `new_version`, `issue_type`, and `public_note`; the `public_note` text is included in the next `generate-glass-wall.ts` output (FR32)

**Given** `scripts/generate-glass-wall.ts` is run after the correction
**When** the About page updates via OTA
**Then** the correction is publicly disclosed in the Glass-Wall Budget under a "Theological Corrections" section — visible to all users (FR32)

---

### Story 7.3: Operator Weekly Operations Workflow Validation

As an operator,
I want to verify that the full weekly operations loop — Sentry error review, Supabase content check, Razorpay donation review, and Glass-Wall Budget update — is completable in under 90 minutes using only existing dashboards and scripts,
So that Arokia's ongoing operations are sustainable for a solo founder with minimal weekly overhead.

**Acceptance Criteria:**

**Given** the Sentry dashboard
**When** the operator reviews it weekly
**Then** crash reports and error events are visible with stack traces; no PII appears in any error payload (FR39, NFR-PR2)

**Given** the Supabase admin dashboard
**When** the operator reviews content
**Then** they can see: total published items, items in each `review_status` stage, and any open `theological_concerns` — all without a custom admin UI (FR36)

**Given** the Razorpay dashboard
**When** the operator reviews donations
**Then** monthly totals, recurring donor count, and pay-it-forward allocation amounts are visible; webhook delivery status confirms all events processed (FR40)

**Given** the operator runs the full weekly loop (Sentry + Supabase + Razorpay + `generate-glass-wall.ts` + git commit + OTA push)
**When** timed end-to-end
**Then** the complete loop is achievable in under 90 minutes with no custom tooling

**Given** `docs/OPERATIONS_RUNBOOK.md`
**When** reviewed
**Then** it documents the weekly operations steps in order: (1) Sentry review, (2) Supabase content review, (3) Razorpay reconciliation, (4) Glass-Wall Budget generation + commit, (5) OTA push — repeatable and handover-ready
