# Architecture: Frontend Architecture

## Routing

Expo Router v4 — file-based routing with `app/` directory convention. Deep links for WhatsApp share URLs work out of the box. Stack, tab, and modal navigation via file structure.

`app/_layout.tsx` is the root shell — imports `@/lib/i18n` as its very first line (before any component import) to guarantee i18next is initialized before rendering.

## Styling

NativeWind v4 — use `className` prop with Tailwind utility classes on all React Native components. Tamil is LTR; no RTL complexity.

**Key design tokens:**

| Token | Value | Use |
|---|---|---|
| `bg-background` | `#F5EFE6` | Warm cream — all screen backgrounds |
| `primary` | `#F0C040` | Golden — CTAs, The Word path |
| `secondary` | `#E07058` | Coral — active states, Body path |
| `tertiary` | `#A8C8C4` | Teal — Soul path, Lectio Divina |

## Component Folder Structure (Feature-Based)

```
components/
  scripture/         — ScriptureCard, VerseText (attribution-enforcing), VerseReference, VerseCardView
  audio/             — PlayerBar, PlayerControls, SleepTimer, SpeedControl
  home/              — TriuneGrid, TimeOfDayBanner (v1.1 stub — renders null in v1), MoodFilter
  donation/          — DonationCTA, GlassWallBudget
  onboarding/        — OpeningVow
  shared/            — Button, Typography, SafeScreen, OfflineBanner, LoadingSkeleton
```

Each directory exports through its `index.ts` barrel. App code imports from `@/components/scripture` not `@/components/scripture/VerseText` directly.

## Verse Attribution as TypeScript Invariant

```typescript
// components/scripture/VerseText.tsx
interface VerseTextProps {
  text: string;
  reference: string;      // non-optional — no default, no undefined
  languageCode: string;
}
// A ScriptureCard without reference is a compile error, not a runtime decision
```

`verse_reference` is also `NOT NULL` in the Supabase schema — enforcement at both DB and UI layer.

Never use optional chaining on this field: `content.verseReference?.` is an anti-pattern. It is non-nullable by contract — using `?.` implies it could be absent, which it cannot.

## Zustand Stores

```
store/
  audioStore.ts       — RNTP state + download manifest + sleep timer + speed
  contentStore.ts     — Meditation metadata + active filters (practicePath, moodTag, timeFilter)
  prefsStore.ts       — Persisted: playback speed default, vowAcknowledged, lastVowAppVersion (FR3)
  highlightsStore.ts  — v1.1 stub — local verse highlights (AsyncStorage, no server sync, FR-V1-08–10)
```

## Home Screen Forward-Compatibility (v1.1 Kaalai/Maalai)

```typescript
// app/(tabs)/index.tsx
// v1: timeFilter always 'any'
// v1.1: timeFilter derived from device clock (5am-11am → 'morning', 5pm-9pm → 'evening')
const timeFilter: 'morning' | 'evening' | 'any' = 'any'; // v1 constant

// <TimeOfDayBanner timeFilter={timeFilter} />  ← renders null in v1; active in v1.1
// <TriuneGrid timeFilter={timeFilter} />        ← passes filter to content queries from Day 1
```

Content queries accept `time_of_day` filter from Day 1 even though v1 always passes `'any'`.

## Persistent Mini-Player

Implemented in `app/(tabs)/_layout.tsx` — layout-level, always rendered above tab bar when `audioStore.isPlaying`. Subscribes to `audioStore`; renders `PlayerBar` component. Tapping opens the full player screen.

## Verse Card Generation

- `VerseCardView` — styled React Native view (verbatim Tamil text + verse reference + Arokia mark)
- `react-native-view-shot` captures it as a PNG (offline-capable; NFR-P6)
- `Share.share()` opens the system share sheet — WhatsApp, Messages, or any installed app
- The verse reference is part of the visual composition; the card cannot be rendered or shared without it (FR42)
- `tsc --noEmit` with `VerseCardView` used without `reference` prop → compile error (invariant extends to card)

Alternatives rejected: `@shopify/react-native-skia` (too heavy for a static card); `react-native-canvas` (lower maintenance).

## i18n Key Conventions

All UI strings externalized in `locales/ta.json`. Zero hardcoded strings in JSX. Five established namespaces:

```json
{
  "vow":      { "title": "...", "body": "...", "cta": "ஆமென் — தொடங்கு" },
  "home":     { "mind": "மனம்", "body": "உடல்", "soul": "ஆத்மா" },
  "audio":    { "play": "...", "pause": "...", "sleepTimer": "..." },
  "donation": { "cta": "...", "glassWall": "..." },
  "errors":   { "offline": "..." }
}
```

New stories must add keys to `ta.json` before writing components.

## Route to Component Mapping

| FR Category | Route / File | Components | Data layer |
|---|---|---|---|
| Onboarding & Vow (FR1–5) | `app/vow.tsx`, `app/about.tsx` | `onboarding/OpeningVow` | `prefsStore` |
| Triune Home Nav (FR6–9) | `app/(tabs)/index.tsx` | `home/TriuneGrid`, `home/MoodFilter`, `home/TimeOfDayBanner` | `contentStore` |
| Scripture & Discovery (FR10–14, FR41) | `app/(tabs)/word.tsx`, `app/verse/[id].tsx`, `app/search.tsx` | `scripture/ScriptureCard`, `VerseText`, `VerseCardView` | `lib/sqlite.ts` + `lib/content.ts` |
| Audio Playback (FR15–22) | `app/(tabs)/walk.tsx`, `app/meditation/[id].tsx`, `app/lectio-divina.tsx` | `audio/PlayerBar`, `PlayerControls`, `SleepTimer`, `SpeedControl` | `audioStore`, `lib/audio.ts`, `lib/trackPlayerService.ts` |
| Donation & Transparency (FR23–29) | `app/(tabs)/integrity.tsx`, `app/donate.tsx` | `donation/DonationCTA`, `donation/GlassWallBudget` | `lib/donations.ts`, Edge Function |
| Theological Correction (FR30–33) | `app/report-concern.tsx` | `shared/ConcernForm` | `lib/concerns.ts` |
| Sharing & Attendance (FR34–35, FR42) | `app/verse/[id].tsx`, `app/attendance.tsx` | `scripture/VerseCardView`, `shared/ShareButton` | react-native-view-shot |
| Operator Admin (FR36–40) | No custom UI in v1 | — | Supabase dashboard, Sentry, `scripts/` |
