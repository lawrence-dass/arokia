# Architecture: Project Structure, Boundaries & Data Flows

## Complete Directory Structure

```
arokia/                                     ← repo root = app root (no nested subdirectory)
├── .env.example                            # Template — Supabase URL, anon key, Razorpay key ID
├── .eslintrc.js / eslint.config.js
├── .gitignore
├── app.json                                # Expo config: bundle IDs, icons, splash, permissions, scheme: "arokia"
├── babel.config.js                         # Expo + NativeWind Babel preset
├── eas.json                                # EAS Build profiles: development / preview / production
├── metro.config.js
├── package.json
├── prettier.config.js
├── tailwind.config.js                      # NativeWind: content paths, Arokia design tokens
├── tsconfig.json                           # strict: true; paths: { "@/*": ["./*"] }
│
├── .github/
│   └── workflows/
│       └── ci.yml                          # tsc + eslint + audit-trackers.sh on every PR
│
├── app/                                    # Expo Router file-based routes
│   ├── _layout.tsx                         # Root: Sentry init, i18n provider (import '@/lib/i18n' FIRST)
│   ├── index.tsx                           # Entry: first-launch gate → /vow or /(tabs)
│   ├── vow.tsx                             # Opening Vow (non-skippable, FR1–2)
│   ├── privacy.tsx                         # Privacy policy (FR5)
│   ├── donate.tsx                          # Razorpay external webview (FR23–24)
│   ├── report-concern.tsx                  # Theological concern form (FR30–31)
│   ├── attendance.tsx                      # Optional Sunday worship tracker (FR35)
│   ├── search.tsx                          # Content keyword search (FR11)
│   ├── lectio-divina.tsx                   # Silence Between Words player (FR12)
│   ├── verse/
│   │   └── [id].tsx                        # Verse detail: text + audio + share card
│   ├── meditation/
│   │   └── [id].tsx                        # Meditation player: audio + scripture + hand-off link
│   └── (tabs)/
│       ├── _layout.tsx                     # Tab layout: persistent PlayerBar above tab bar
│       ├── index.tsx                       # Triune home: Mind / Body / Soul (FR6–9)
│       ├── word.tsx                        # Scripture quotes browser (FR10, FR13)
│       ├── walk.tsx                        # Meditation library by pillar + mood (FR8–9)
│       ├── integrity.tsx                   # Glass-Wall Budget + donation CTA (FR28–29)
│       └── about.tsx                       # About Arokia: name, mission, correction process (FR4)
│
├── components/
│   ├── scripture/
│   │   ├── ScriptureCard.tsx               # Full verse: text + reference + play button
│   │   ├── VerseText.tsx                   # Attribution-enforcing ({text, reference: string} non-optional)
│   │   ├── VerseReference.tsx              # Styled "Matthew 6:25" reference badge
│   │   ├── VerseCardView.tsx               # Shareable PNG view (react-native-view-shot target)
│   │   └── index.ts                        # Barrel export
│   ├── audio/
│   │   ├── PlayerBar.tsx                   # Persistent mini-player (layout-level)
│   │   ├── PlayerControls.tsx              # Play / pause / seek / skip
│   │   ├── SleepTimer.tsx                  # 15 / 30 / 45 min timer
│   │   ├── SpeedControl.tsx                # 0.75× / 1× / 1.25×
│   │   └── index.ts
│   ├── home/
│   │   ├── TriuneGrid.tsx                  # Mind/Body/Soul nav grid
│   │   ├── TimeOfDayBanner.tsx             # v1.1 stub — renders null in v1
│   │   ├── MoodFilter.tsx                  # Anxiety-type filter chips
│   │   └── index.ts
│   ├── donation/
│   │   ├── DonationCTA.tsx
│   │   ├── GlassWallBudget.tsx             # react-native-markdown-display renderer
│   │   └── index.ts
│   ├── onboarding/
│   │   ├── OpeningVow.tsx
│   │   └── index.ts
│   └── shared/
│       ├── Button.tsx
│       ├── Typography.tsx
│       ├── SafeScreen.tsx
│       ├── OfflineBanner.tsx
│       ├── LoadingSkeleton.tsx
│       └── index.ts
│
├── constants/
│   ├── colors.ts                           # Design tokens (mirrored in tailwind.config.js)
│   ├── theme.ts                            # NativeWind theme extension
│   ├── vow.ts                              # VOW_REQUIRED_VERSIONS: string[]
│   └── index.ts
│
├── store/
│   ├── audioStore.ts                       # RNTP state + download manifest + sleep timer + speed
│   ├── contentStore.ts                     # Meditation metadata + active filters
│   ├── prefsStore.ts                       # Persisted: playback speed, vowAcknowledged, lastVowAppVersion
│   └── highlightsStore.ts                  # v1.1 stub — local verse highlights
│
├── lib/
│   ├── supabase.ts                         # Singleton Supabase JS client (anon key)
│   ├── content.ts                          # getQuotes(), getMeditations(), searchContent()
│   ├── donations.ts                        # getDonationSummary(), getPayForwardSummary()
│   ├── concerns.ts                         # submitConcern()
│   ├── audio.ts                            # resolveAudioUrl(), downloadTrack(), prefetchQueue()
│   ├── sqlite.ts                           # Expo SQLite v2: schema init, verse queries, full-text search
│   ├── trackPlayerService.ts               # RNTP headless task: events → audioStore actions
│   ├── i18n.ts                             # react-i18next init: language detection, ta.json default
│   ├── analytics.ts                        # logEvent(type, contentId?); reads install_id from SecureStore
│   └── network.ts                          # useNetworkStatus() hook
│
├── types/
│   ├── content.ts                          # ContentItem, PracticePath, ProductPillar, ContentType, ReviewStatus, MoodTag, LanguageCode
│   ├── donation.ts                         # Donation, AllocationEntry, Disbursement, Beneficiary
│   ├── analytics.ts                        # AnalyticsEvent, AnalyticsEventType
│   └── concern.ts                          # TheologicalConcern
│
├── locales/
│   └── ta.json                             # Tamil — source of truth for all i18n keys
│
├── assets/
│   ├── icons/
│   └── splash/
│
├── docs/
│   └── glass-wall-budget.md                # Generated by scripts/generate-glass-wall.ts; committed to git
│
├── supabase/
│   ├── config.toml                         # Supabase CLI project config
│   ├── migrations/
│   │   └── 20260603000000_initial_schema.sql
│   └── functions/
│       ├── razorpay-webhook/
│       │   ├── index.ts
│       │   └── deno.json
│       └── concern-notification/
│           ├── index.ts
│           └── deno.json
│
└── scripts/
    ├── generate-audio.ts                   # ElevenLabs batch/per-track generation + storage upload
    ├── seed-content.ts                     # Tamil OV verse seeding into SQLite + content_items
    ├── generate-glass-wall.ts              # Queries ledger tables → writes docs/glass-wall-budget.md
    └── audit-trackers.sh                   # Grep for forbidden SDK packages (CI + manual)
```

## Architectural Boundaries

| Boundary | Crossed by | Never crossed by |
|---|---|---|
| App ↔ Supabase | `lib/*.ts` only | Components, stores, screens |
| App ↔ RNTP | `lib/trackPlayerService.ts`, `store/audioStore.ts` | Components, screens |
| App ↔ expo-sqlite | `lib/sqlite.ts` only | Any other module |
| App ↔ Razorpay | `app/donate.tsx` (webview) + Edge Function | App binary never calls Razorpay API |
| App ↔ ElevenLabs | `scripts/generate-audio.ts` only | App binary: zero ElevenLabs dependency |
| Edge Function ↔ DB | Service role (full access) | App client: anon role, public-read RLS only |

## Key Data Flows

**Scripture display:**
`lib/sqlite.ts` → `contentStore` → `VerseText` (required `reference` prop) → screen render

**Audio playback:**
Supabase CDN → `lib/audio.ts:downloadTrack()` → `documentDirectory` cache → RNTP → audio output → `lib/trackPlayerService.ts` events → `audioStore`

**Verse card share:**
`verse/[id].tsx` → `VerseCardView` render → `captureRef()` (react-native-view-shot) → PNG → `Share.share()` → system share sheet

**Donation:**
`integrity.tsx` → `donate.tsx` webview → Razorpay payment → Razorpay webhook POST → `razorpay-webhook` Edge Function → HMAC verify → atomic transaction (`donations` + 2× `allocation_entries`) → email receipt

**Glass-Wall Budget:**
`docs/glass-wall-budget.md` (git-tracked) → `GlassWallBudget.tsx` (react-native-markdown-display) → `integrity.tsx` tab render

**Theological concern:**
`report-concern.tsx` form → `lib/concerns.ts:submitConcern()` → `theological_concerns` INSERT (anon RLS allows) → `concern-notification` Edge Function → acknowledgment email
