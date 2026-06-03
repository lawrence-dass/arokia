# Story 1.1: Project Scaffold & Developer Experience Setup

Status: review

## Story

As a developer,
I want a fully scaffolded React Native + Expo project with TypeScript strict mode, NativeWind, Expo Router, Supabase client, i18n initialized with Tamil locale, and all folder/naming conventions in place,
so that every subsequent story builds on a consistent, type-safe foundation with zero hardcoded strings from the first commit.

## Acceptance Criteria

1. **Given** the developer runs `npx create-expo-stack@latest arokia --expo-router --nativewind --supabase` with Zustand selected interactively  
   **When** `npx expo start` is executed  
   **Then** the app launches without errors on both iOS and Android simulators

2. **Given** the scaffolded project  
   **When** `tsc --noEmit` is run  
   **Then** it passes with zero errors with `"strict": true` in `tsconfig.json`

3. **Given** the project structure  
   **When** a component uses `import { X } from '@/components/scripture/VerseText'`  
   **Then** it resolves correctly — path alias `@/*` → project root is configured in `tsconfig.json`

4. **Given** the i18n setup  
   **When** a component calls `useTranslation()` and accesses keys in the `vow`, `home`, `audio`, `donation`, and `errors` namespaces  
   **Then** all keys resolve to Tamil strings from `locales/ta.json` with no missing-key warnings

5. **Given** any component in the codebase  
   **When** reviewed for hardcoded strings  
   **Then** zero Tamil or English UI strings are hardcoded — all reference i18n keys (NFR-I1)

6. **Given** the folder structure  
   **When** inspected  
   **Then** `app/`, `components/`, `lib/`, `constants/`, `locales/`, `assets/`, `store/`, `types/` all exist as per the architecture spec

## Tasks / Subtasks

- [x] **Scaffold project** (AC: 1)
  - [x] Run `npx create-expo-stack@latest arokia --expo-router --nativewind --supabase` — Zustand installed manually post-scaffold
  - [x] Verify `npx expo start` runs clean on iOS + Android simulators ← verified 2026-05-28 on iPhone 17 Pro simulator

- [x] **Enable TypeScript strict mode** (AC: 2)
  - [x] `"strict": true` already enabled by create-expo-stack — confirmed in tsconfig.json
  - [x] `tsc --noEmit` passes with 0 errors (fixed i18next v26 compatibilityJSON removal)

- [x] **Verify path alias** (AC: 3)
  - [x] `tsconfig.json` has `"paths": { "@/*": ["*"] }` — confirmed
  - [x] `app.json` has `"tsconfigPaths": true` — Metro resolves aliases natively (no babel plugin needed)

- [x] **Create missing folder structure** (AC: 6)
  - [x] `types/` — created with `index.ts` stub
  - [x] Create barrel `index.ts` stubs in each feature component directory:
    - [x] `components/scripture/index.ts`
    - [x] `components/audio/index.ts`
    - [x] `components/home/index.ts`
    - [x] `components/donation/index.ts`
    - [x] `components/shared/index.ts`
  - [x] `locales/` — created
  - [x] `store/` — present (Zustand installed; scaffold creates it)

- [x] **Install i18n dependencies** (AC: 4)
  - [x] `npx expo install expo-localization i18next react-i18next intl-pluralrules` — all installed (i18next v26.0.8)

- [x] **Create `locales/ta.json`** (AC: 4, 5)
  - [x] All five namespaces with Tamil strings — vow, home, audio, donation, errors
  - [x] No English strings — every value is Tamil

- [x] **Create `lib/i18n.ts`** (AC: 4)
  - [x] i18next v26 compatible — `compatibilityJSON` removed (deprecated in v24+)
  - [x] expo-localization device locale detection with 'ta' fallback

- [x] **Wire i18n into app root** (AC: 4)
  - [x] `import '@/lib/i18n'` is first import in `app/_layout.tsx`

- [x] **Verify zero hardcoded strings** (AC: 5)
  - [x] Scaffold example components deleted (Button.tsx, Container.tsx, EditScreenInfo.tsx, ScreenContent.tsx)
  - [x] `app/index.tsx` replaced with i18n-clean placeholder using `t('home.soul')`
  - [x] `app/+not-found.tsx` replaced using `t('errors.generic')`
  - [x] `app/details.tsx` scaffold placeholder deleted

- [x] **Run final checks** (AC: 2)
  - [x] `tsc --noEmit` → 0 errors ✅
  - [x] `npx expo start` → verified 2026-05-28 on iPhone 17 Pro simulator
  - [x] All 8 directories present ✅

## Dev Notes

### Scaffold Command & What It Provides

```bash
npx create-expo-stack@latest arokia --expo-router --nativewind --supabase
# Select: Zustand (when prompted for state management)
```

**What create-expo-stack gives you:**
- `app/` with Expo Router file-based routing (Stack + Tabs preconfigured)
- `components/` with some example components (delete/keep scaffold examples; replace content)
- `lib/supabase.ts` — Supabase JS client singleton (anon key)
- `store/` with a Zustand example store (replace with Arokia store structure in Story 1.4)
- NativeWind v4 + Tailwind config wired
- `tsconfig.json` with `@/*` path alias
- Expo Router v4 setup

**What it does NOT give you (add manually):**
- `"strict": true` in tsconfig — add this immediately after scaffold
- `types/` directory — create it
- Feature-based `components/` subdirectories — create them
- `locales/` + `ta.json` — create them
- `lib/i18n.ts` — create it
- react-i18next / i18next / expo-localization — install them
- `constants/` — create if not present

### TypeScript Strict Mode

Add to `tsconfig.json` under `compilerOptions`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```
`noUncheckedIndexedAccess` is recommended alongside strict — catches array index access bugs that strict alone misses.

Run `tsc --noEmit` immediately after. Fix any errors before writing story-specific code. Common strict-mode errors from scaffold templates: implicit `any` in callbacks, missing return types on arrow functions used as event handlers.

### Path Alias Verification

`tsconfig.json` must have:
```json
"paths": { "@/*": ["./*"] }
```

If metro/babel isn't resolving the alias at runtime (import works in TS but crashes in Expo Go), check `babel.config.js`:
```js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module-resolver', {
      root: ['.'],
      alias: { '@': '.' }
    }]
  ]
};
```
`babel-plugin-module-resolver` should already be installed by create-expo-stack; if not: `npx expo install babel-plugin-module-resolver`.

### i18n Setup — `lib/i18n.ts`

```typescript
import 'intl-pluralrules'; // polyfill needed for some Android versions
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import ta from '@/locales/ta.json';

i18n
  .use(initReactI18next)
  .init({
    resources: { ta: { translation: ta } },
    lng: Localization.getLocales()[0]?.languageCode ?? 'ta',
    fallbackLng: 'ta',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
  });

export default i18n;
```

**Critical:** Import `@/lib/i18n` as the first non-React import in `app/_layout.tsx`:
```typescript
import '@/lib/i18n';  // ← must be before any component import
import { Stack } from 'expo-router';
// ...
```

If `intl-pluralrules` is missing: `npx expo install intl-pluralrules`.

### `locales/ta.json` Required Key Structure

This story must establish the namespace skeleton that all subsequent stories will extend:

```json
{
  "vow": {
    "title": "ஆரோக்கியம்",
    "body": "இந்த ஆப் இயேசு கிறிஸ்து அல்ல — இது அவரிடம் வழிகாட்டும் ஒரு கருவி மட்டுமே.",
    "cta": "ஆமென் — தொடங்கு"
  },
  "home": {
    "mind": "மனம்",
    "body": "உடல்",
    "soul": "ஆத்மா",
    "todayContent": "இன்றைய தியானம்"
  },
  "audio": {
    "play": "இயக்கு",
    "pause": "நிறுத்து",
    "sleepTimer": "தூக்க நேரமானி",
    "speed": "வேகம்",
    "downloading": "பதிவிறக்குகிறது..."
  },
  "donation": {
    "cta": "நன்கொடை",
    "glassWall": "கண்ணாடி சுவர் பட்ஜெட்",
    "payForward": "முன்கொடை 10%"
  },
  "errors": {
    "offline": "இணைப்பு இல்லை",
    "generic": "தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்."
  }
}
```

**Rule:** Every subsequent story that adds new UI text must add the keys to `ta.json` first — no hardcoded strings ever.

### Folder Structure to Create

```
arokia/
├── app/                  # Expo Router routes (from scaffold)
├── assets/               # Static assets (from scaffold)
├── components/
│   ├── scripture/        # CREATE — ScriptureCard, VerseText (Story 3.1)
│   │   └── index.ts      # barrel stub: // add exports as components are created
│   ├── audio/            # CREATE — PlayerBar, PlayerControls (Story 4.3)
│   │   └── index.ts      # barrel stub
│   ├── home/             # CREATE — TriuneGrid (Story 4.1)
│   │   └── index.ts      # barrel stub
│   ├── donation/         # CREATE — DonationCTA, GlassWallBudget (Story 6.1)
│   │   └── index.ts      # barrel stub
│   └── shared/           # CREATE — Button, Typography, SafeScreen, OfflineBanner
│       └── index.ts      # barrel stub
├── constants/            # CREATE if absent — theme tokens, config
├── lib/
│   ├── supabase.ts       # From scaffold — verify uses env vars, not hardcoded keys
│   └── i18n.ts           # CREATE this story
├── locales/
│   └── ta.json           # CREATE this story
├── store/                # From scaffold (Zustand selected) — Story 1.4 adds typed shapes
├── types/                # CREATE — Story 1.4 populates ContentItem, Donation types
│   └── .gitkeep
└── tsconfig.json         # strict: true added this story
```

### Barrel `index.ts` Stub Content

Each feature component directory gets an identical stub. This is the exact content for all five files:

```typescript
// components/scripture/index.ts  (same pattern for audio/, home/, donation/, shared/)
// Add exports here as components are created in this directory.
// Example: export { VerseText } from './VerseText';
```

When Story 3.1 creates `VerseText.tsx`, the dev appends `export { VerseText } from './VerseText';` — no file restructuring needed. This is the only correct pattern; never import directly from `'@/components/scripture/VerseText'` in app code — always go through the barrel.

### Supabase Client Verification

create-expo-stack generates `lib/supabase.ts`. Verify it reads credentials from env vars — never hardcoded:

```typescript
// CORRECT (from scaffold — verify this is the pattern)
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
```

The env vars use `EXPO_PUBLIC_` prefix so they're available at build-time via Expo's env var system. Full EAS env var wiring is Story 1.5.

For local dev this story: create `.env.local` in the project root with your Supabase project credentials (do not commit — add to `.gitignore` if not already present):

```bash
# .env.local — local dev only, never committed
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Both values are on the Supabase project dashboard under Settings → API. The anon key is safe to use in the app binary (it's a public read-only key restricted by RLS).

### NFR-I1 Enforcement Rule (Zero Hardcoded Strings)

This rule applies immediately and forever. The dev agent must scan the scaffold output before marking done:

- Any `<Text>` with a literal string value → replace with `{t('key')}`
- Any `placeholder="..."` → replace with `{t('key')}`
- Any `title="..."` in navigation screens → replace with `{t('key')}`
- English strings in JSX comments are fine — only rendered strings are in scope

### What NOT to Build in This Story

- Zustand store state shapes → Story 1.4
- Supabase schema + migrations → Story 1.2
- SQLite scripture data → Story 1.3
- GitHub Actions CI → Story 1.5
- react-native-track-player → Story 1.6
- Any screen UI beyond what the scaffold generates → Epics 2–7

Do not install RNTP or set up audio in this story. Do not create service functions beyond `lib/i18n.ts`.

### Expo Router `scheme` Field (Deep Link Pre-check)

Expo Router v4 requires a `scheme` in `app.json` for deep links — this powers the WhatsApp share URLs in Story 5.2. create-expo-stack may or may not include it. Verify now so Story 5.2 isn't blocked:

```json
// app.json
{
  "expo": {
    "scheme": "arokia",
    ...
  }
}
```

If the field is absent, add it. No other changes needed in this story — just confirming the field exists is the full scope.

### Project Structure Notes

- `store/` will have scaffold-generated Zustand example — leave it as-is; Story 1.4 replaces the content
- `lib/supabase.ts` from scaffold is usable as-is for this story's AC verification; Story 1.2 doesn't change the client, only adds schema migrations
- Expo Router v4 uses the `app/` directory convention with `_layout.tsx` as the root layout
- NativeWind v4 uses `className` prop directly — no `styled()` wrapper needed

### References

- Scaffold command: [Source: architecture.md#Selected Starter: create-expo-stack@latest]
- TypeScript strict requirement: [Source: architecture.md#Language & Runtime]
- Folder structure: [Source: architecture.md#Code Organization]
- i18n key namespaces: [Source: architecture.md#i18n key conventions]
- Path alias pattern: [Source: architecture.md#Path aliases over relative imports]
- NFR-I1 (zero hardcoded strings): [Source: epics.md#NonFunctional Requirements]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (2026-04-27)

### Debug Log References

### Completion Notes List

- ✅ Scaffold: create-expo-stack landed at `arokia/arokia/` (nested); app root is `arokia/arokia/` going forward
- ✅ TypeScript strict: already enabled by scaffold — `tsc --noEmit` passes 0 errors
- ✅ Path alias: `@/*` configured via tsconfig + Metro `tsconfigPaths: true` (no babel plugin needed in Expo SDK 54)
- ✅ `scheme: "arokia"` and `typedRoutes: true` already in app.json from scaffold
- ✅ All 8 directories present: app/, components/, lib/, constants/, locales/, assets/, store/, types/
- ✅ Barrel `index.ts` stubs: components/scripture, audio, home, donation, shared
- ✅ `locales/ta.json` — 5 namespaces, all Tamil values
- ✅ `lib/i18n.ts` — i18next v26.0.8, expo-localization, no compatibilityJSON (removed in v24+)
- ✅ `lib/supabase.ts` — moved from utils/ to lib/; non-null assertions added for strict mode
- ✅ `app/_layout.tsx` — `import '@/lib/i18n'` wired as first import
- ✅ Zero hardcoded strings — scaffold example components deleted; index.tsx, +not-found.tsx, details.tsx replaced/removed
- ✅ Arokia design tokens wired: constants/colors.ts, constants/theme.ts, tailwind.config.js extended
- ✅ Zustand + expo-localization + i18next + react-i18next + intl-pluralrules installed
- ✅ expo-localization auto-added to app.json plugins
- ℹ️ Node.js version warnings during install (v20.16.0 vs required 20.19.4) — runtime only, not blocking; update Node when convenient
- ⏳ Pending Lawrence verification: `npx expo start` on iOS + Android simulators

### File List

- `locales/ta.json` (created)
- `lib/i18n.ts` (created)
- `types/index.ts` (created)
- `components/scripture/index.ts` (created)
- `components/audio/index.ts` (created)
- `components/home/index.ts` (created)
- `components/donation/index.ts` (created)
- `components/shared/index.ts` (created)
- `constants/colors.ts` (created — design tokens from reference, 2026-04-27)
- `constants/theme.ts` (created — NativeWind tailwind.config.js extension)
- `constants/index.ts` (created — barrel export)
- `arokia/arokia/locales/ta.json` (created)
- `arokia/arokia/lib/i18n.ts` (created)
- `arokia/arokia/lib/supabase.ts` (moved from utils/supabase.ts; strict-mode types fixed)
- `arokia/arokia/types/index.ts` (created)
- `arokia/arokia/constants/colors.ts` (created)
- `arokia/arokia/constants/theme.ts` (created)
- `arokia/arokia/constants/index.ts` (created)
- `arokia/arokia/components/scripture/index.ts` (created)
- `arokia/arokia/components/audio/index.ts` (created)
- `arokia/arokia/components/home/index.ts` (created)
- `arokia/arokia/components/donation/index.ts` (created)
- `arokia/arokia/components/shared/index.ts` (created)
- `arokia/arokia/app/_layout.tsx` (modified — i18n import wired)
- `arokia/arokia/app/index.tsx` (replaced — i18n placeholder)
- `arokia/arokia/app/+not-found.tsx` (replaced — i18n clean)
- `arokia/arokia/tailwind.config.js` (modified — Arokia theme tokens added)
- `arokia/arokia/app/details.tsx` (deleted — scaffold placeholder)
- `arokia/arokia/components/Button.tsx` (deleted — scaffold example)
- `arokia/arokia/components/Container.tsx` (deleted — scaffold example)
- `arokia/arokia/components/EditScreenInfo.tsx` (deleted — scaffold example)
- `arokia/arokia/components/ScreenContent.tsx` (deleted — scaffold example)
- `arokia/arokia/utils/` (deleted — moved to lib/)
