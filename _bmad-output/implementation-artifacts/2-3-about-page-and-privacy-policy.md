# Story 2.3: About Page & Privacy Policy

Status: review

## Story

As any user,
I want to read Arokia's About page describing its name, mission, and ecumenical positioning, and access the Privacy Policy,
So that I can understand and trust the product's identity and data practices before or after engaging with content.

## Acceptance Criteria

1. **Given** the About page is accessible from the app navigation
   **When** opened
   **Then** it displays: (1) the meaning of Arokia (ஆரோக்கியம்) and the name story including Arokia Matha heritage; (2) the four pillars; (3) the ecumenical positioning statement serving all Tamil Christians; (4) the correction disclosure process; (5) the current Glass-Wall Budget rendered from `docs/glass-wall-budget.md` via `react-native-markdown-display` (FR4, FR28)

2. **Given** the Privacy Policy link in the About page
   **When** tapped
   **Then** the Privacy Policy is displayed in-app (not requiring a browser); it is accessible at all times including before the Opening Vow is acknowledged (FR5)

3. **Given** the About page
   **When** reviewed
   **Then** all text content is sourced from `ta.json` or the markdown budget file — no hardcoded strings; accessible with no account required (NFR-PR1, NFR-I1)

4. **Given** the `docs/glass-wall-budget.md` file
   **When** the About page loads
   **Then** it is rendered with `react-native-markdown-display`; if unavailable (offline, first launch), a graceful fallback message is shown (NFR-R3)

## Scope Note — Content Placeholders (decided with Lawrence, 2026-07-04)

The About page's identity/theological copy (name meaning + Arokia Matha heritage, ecumenical
positioning statement, correction disclosure process description) and the Privacy Policy's full
text do not exist yet and are not something a cloud/mobile session should author (same treatment
CLAUDE.md's mobile-session policy gives the vow copy). Per explicit instruction, this story
implements the full screen/component/routing/markdown-rendering plumbing with clearly-marked
placeholder copy (`[PLACEHOLDER — Lawrence to draft: ...]`) in every new `ta.json` string that
carries identity/legal content. The four pillar *names* (Word / Walk / Hope·Faith·Love /
Integrity) are NOT placeholders — they're an established fact already codified in
`types/content.ts`'s `ProductPillar` type — but their Tamil descriptive copy is a placeholder.
Nothing here should ship to users until Lawrence replaces the placeholders.

## Scope Note — No home navigation yet

FR4's "accessible from the app navigation" assumes Epic 4's triune home/tab navigation, which
doesn't exist yet (Epic 4 is `backlog`). This story builds `app/about.tsx` and `app/privacy.tsx`
as fully correct, fully guarded/unguarded routes and adds one temporary link from the placeholder
`app/index.tsx` to `/about` for reachability — not a permanent nav entry point. Epic 4 will replace
`app/index.tsx` entirely with the real triune home screen, at which point this temporary link goes
with it.

## Tasks / Subtasks

- [x] **Add dependencies** (AC: 1, 4)
  - [x] `react-native-markdown-display` (pure-JS, no native code) — installed via `npm install` (not `expo install`; this package isn't in Expo's bundled-native-modules list, `npm install`/`npx expo install --no-verify` both work identically for pure-JS packages)
  - [x] `expo-asset` — already present transitively (via `expo`/`expo-router`); add as a direct dependency at the resolved version since it's now imported directly in application code

- [x] **Create `docs/glass-wall-budget.md`** (AC: 1, 4)
  - [x] Git-tracked placeholder markdown file — architecture's designated location (`scripts/generate-glass-wall.ts`, an Epic 6 script, will overwrite this with real ledger-derived numbers later; this story just needs a renderable placeholder so the pipeline described in `architecture/infrastructure.md#Glass-Wall Budget` exists end-to-end now)

- [x] **Bundle `.md` as a Metro asset** (AC: 4)
  - [x] `metro.config.js`: add `'md'` to `config.resolver.assetExts` — same pattern already used for `'db'` (Story 1.3's `scripture.db` bundling)

- [x] **Create `components/donation/GlassWallBudget.tsx` + barrel export** (AC: 4)
  - [x] Architecture-designated location: `components/donation/` (will be reused by Epic 6's `integrity.tsx` donation tab per `architecture/frontend.md`'s route-to-component mapping — this story creates it, Epic 6 reuses it, do not duplicate later)
  - [x] On mount: `Asset.fromModule(require('@/docs/glass-wall-budget.md'))` → `.downloadAsync()` → `FileSystem.readAsStringAsync(asset.localUri)` → render with `<Markdown>{content}</Markdown>` from `react-native-markdown-display`
  - [x] On any failure (asset resolution, file read, missing `localUri`): `console.warn` and render `t('donation.glassWallUnavailable')` instead of throwing — satisfies AC 4's fallback requirement
  - [x] No store/router access — dumb component, same pattern as `OpeningVow`

- [x] **Create `app/about.tsx`** (AC: 1, 2, 3)
  - [x] Sections in AC1's order: name meaning + heritage, four pillars, ecumenical positioning, correction disclosure, Glass-Wall Budget (`<GlassWallBudget />`)
  - [x] A `<Link href="/privacy">` at the end using `t('about.privacyLink')` (AC 2)
  - [x] `className` exclusively, all text via `t()` — zero hardcoded strings (AC 3)

- [x] **Create `app/privacy.tsx`** (AC: 2)
  - [x] Renders `t('privacy.title')` + `t('privacy.body')` — same minimal scrollable-screen shape as `about.tsx`

- [x] **Wire routing in `app/_layout.tsx`** (AC: 1, 2)
  - [x] Add `about` to the existing `vowSatisfied`-guarded `Stack.Protected` block (same block as `index`/`spikes`) — reachable only after the vow is satisfied, same as all other content screens
  - [x] Add `privacy` as a `<Stack.Screen name="privacy" />` OUTSIDE both `Stack.Protected` blocks — i.e. always registered/reachable regardless of `vowSatisfied`, satisfying AC 2's "accessible at all times including before the Opening Vow is acknowledged"
  - [x] Do not touch the hydration/splash-screen wiring or the `vowSatisfied` computation — this story only adds routes, it doesn't change gating logic

- [x] **Temporary reachability link** (see Scope Note above)
  - [x] `app/index.tsx`: add one `<Link href="/about">` using a new `t('about.title')`-adjacent link label — minimal, will be replaced by Epic 4's real home screen

- [x] **Add i18n keys** (AC: 1, 2, 3)
  - [x] New `about` namespace in `ta.json`: `title`, `nameMeaning.heading`/`.body`, `pillars.heading`/`.word`/`.walk`/`.hopeFaithLove`/`.integrity`, `ecumenical.heading`/`.body`, `correctionProcess.heading`/`.body`, `privacyLink`
  - [x] New `privacy` namespace: `title`, `body`
  - [x] Reuse the EXISTING `donation.glassWall` key for the About page's Glass-Wall section heading (do not create a duplicate key) — add ONE new key, `donation.glassWallUnavailable`, alongside it for AC 4's fallback message
  - [x] Every identity/legal-content string body gets `[PLACEHOLDER — Lawrence to draft: ...]` text — see Scope Note

- [x] **Verification** (AC: all)
  - [x] `npm run format` after all file writes
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 new warnings
  - [x] `bash scripts/audit-trackers.sh` — passed
  - [ ] Simulator walkthrough — **pending desktop verification, see Dev Agent Record**: `/about` renders all 5 sections including the Glass-Wall markdown; `/privacy` reachable both from the About page AND via direct navigation before acknowledging the vow; airplane-mode/first-launch check that the Glass-Wall fallback message renders if the markdown asset can't be read

## Dev Notes

### Critical Architecture Requirements (MUST follow)

- **`GlassWallBudget` lives in `components/donation/`, not `components/onboarding/` or a new
  `components/about/`** — this is Epic 6's future donation-tab component, reused early
  [Source: _bmad-output/planning-artifacts/architecture/frontend.md#Route to Component Mapping, architecture.md#L897]
- **`docs/glass-wall-budget.md` is the git-tracked source of truth** — a future Epic 6 script
  (`scripts/generate-glass-wall.ts`) overwrites it from ledger data; this story's placeholder
  content will be replaced by that script's real output, not hand-edited later
  [Source: architecture/infrastructure.md#Glass-Wall Budget]
- **`privacy` must be an unguarded route** — it's the one deliberate exception to "every route
  needs to be in a Protected block" (see the `Stack.Protected` fail-open risk logged from Story
  2.1's review): `privacy` isn't a content screen accidentally exposed, it's REQUIRED to be
  reachable regardless of vow state per FR5
  [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3 AC2, prd.md#FR5]
- **Four pillar names are fixed, already-codified facts, not placeholders**: `word`, `walk`,
  `hope_faith_love`, `integrity` — see `types/content.ts`'s `ProductPillar` type. Use the English
  names "The Word · The Walk · Hope·Faith·Love · Integrity" as a reference for which four
  concepts the placeholder text should eventually cover; do not invent a fifth or rename them
  [Source: types/content.ts, prd.md#L48]
- **`@/` path aliases only**, zero hardcoded strings, NativeWind `className` only — same
  invariants as every prior story

### Existing Code You Are Building On (do NOT reinvent)

- `app/_layout.tsx` — currently has two `Stack.Protected` blocks (`!vowSatisfied` → `vow`;
  `vowSatisfied` → `index`, `spikes`) plus the splash-screen/hydration wiring from Story 2.1's
  review and the `vowSatisfied` derivation from Story 2.2. This story only adds `about` to the
  second block and a new unguarded `<Stack.Screen name="privacy" />` — no other changes.
  `useVowGate()` (from `store/prefsStore.ts`, Story 2.2) is NOT needed here — this story doesn't
  read vow state anywhere except the guard placement itself.
- `components/onboarding/OpeningVow.tsx` — reference for the "dumb component, no store/router
  access" pattern `GlassWallBudget` should follow.
- `metro.config.js` — already pushes `'db'` onto `config.resolver.assetExts` for
  `assets/db/scripture.db` (Story 1.3). Add `'md'` the same way, don't restructure the file.
- `locales/ta.json` — existing `donation.glassWall` key ("கண்ணாடி சுவர் பட்ஜெட்") is the section
  heading; reuse it instead of adding a duplicate.

### Testing Standards

No test suite exists yet. Verification is tsc + lint + tracker-audit + simulator walkthrough
(desktop-only — asset bundling of a new Metro extension type and the offline-fallback path both
need a real Metro bundler run to confirm, which this session cannot do). Document walkthrough
results in the Dev Agent Record.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2.md#Story 2.3]
- [Source: _bmad-output/planning-artifacts/architecture.md#L487-492, #L831, #L897, #L946, #L992]
- [Source: _bmad-output/planning-artifacts/architecture/infrastructure.md#Glass-Wall Budget]
- [Source: _bmad-output/planning-artifacts/prd.md#FR4, FR5, FR28, NFR-R3]
- [Source: types/content.ts#ProductPillar]

## Dev Agent Record

### Agent Model Used

Claude (Claude Code, cloud/mobile session)

### Debug Log References

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 1 pre-existing warning (`lib/i18n.ts:8`, known, not in scope)
- `npm run format` — clean
- `bash scripts/audit-trackers.sh` — passed

### Completion Notes List

- All identity/legal-content strings are `[PLACEHOLDER — Lawrence to draft: ...]` markers per the
  Scope Note — **nothing in this story is real copy**. This includes: About page's name-meaning
  body, ecumenical positioning body, correction-disclosure body, all four pillar descriptions, the
  full Privacy Policy body, and `docs/glass-wall-budget.md`'s content. Do not ship without
  replacing these.
- `docs/glass-wall-budget.md` bundled via Metro (`'md'` added to `metro.config.js`'s
  `assetExts`, mirroring the existing `'db'` entry for `scripture.db`) + `expo-asset` +
  `expo-file-system`, read at runtime in `GlassWallBudget.tsx`. **This exact mechanism (a new
  Metro asset extension + `Asset.fromModule().downloadAsync()` + `FileSystem.readAsStringAsync`)
  could not be verified in this cloud session — there's no way to run the Metro bundler/simulator
  here. It follows the same pattern already proven for `scripture.db`, and is standard
  documented Expo usage, but treat it as unverified until a real `expo start` run confirms the
  asset resolves and the markdown renders.**
- `GlassWallBudget` created in `components/donation/` per architecture (not a new `about/`
  directory) — Epic 6's `integrity.tsx` donation tab will reuse this same component later; don't
  duplicate it when that epic starts.
- `privacy` route added as the first, unguarded `<Stack.Screen>` in `app/_layout.tsx`, before
  either `Stack.Protected` block — deliberately not gated, satisfying FR5. This is intentional,
  not the `Stack.Protected` fail-open risk logged from Story 2.1's review (that risk is about
  routes accidentally missing from the guarded block; this one is correctly, deliberately
  unguarded).
- Added a temporary `<Link href="/about">` to the placeholder `app/index.tsx` for reachability,
  since Epic 4's real home navigation doesn't exist yet — see Scope Note. Will be removed when
  Epic 4 replaces `index.tsx`.
- Reused the existing `donation.glassWall` i18n key for the About page's section heading (no
  duplicate key created); added one new key, `donation.glassWallUnavailable`.
- **Pending desktop verification (cannot run in this cloud session — no simulator/device access):**
  - `/about` renders all 5 required sections, including a real (non-placeholder-crashing) render
    of the Glass-Wall markdown via `react-native-markdown-display`.
  - `/privacy` reachable both from the About page's link AND via direct navigation/deep link
    before acknowledging the vow (confirms the unguarded route actually works, not just that the
    code compiles).
  - Airplane-mode / simulated-failure check that `GlassWallBudget` shows the fallback message
    instead of crashing when the markdown asset can't be resolved.
  - `react-native-markdown-display@7.0.2`'s peer dependency lists React `>=16.2.0`; this repo
    runs React 19.1.0 — `npm install` accepted it without `--force`/`--legacy-peer-deps`, but
    actual rendering compatibility with React 19 hasn't been visually confirmed.

### Code Review Fixes Applied (2026-07-04)

A 4-angle multi-agent review (line-by-line, removed-behavior + cross-file, reuse/simplification/
efficiency, altitude/conventions) found the same critical bug independently from 3 of the 4
angles, plus one lower-confidence maintainability note:

- **`components/donation/GlassWallBudget.tsx` — wrong `expo-file-system` API (CONFIRMED by 3
  independent agents, fixed):** the component imported `* as FileSystem from 'expo-file-system'`
  and called `FileSystem.readAsStringAsync(...)`. In the installed `expo-file-system@19.0.23`
  (Expo SDK 54), that name resolves to a legacy-deprecation shim whose body unconditionally
  throws — verified by reading the package's own `legacyWarnings` source, no simulator needed.
  Every call would hit the `catch` block, so the Glass-Wall Budget section could never actually
  render the markdown — only ever the "unavailable" fallback, on every platform, not just
  offline/first-launch as the AC anticipated. `lib/audio.ts` already established the correct v2
  pattern elsewhere in this repo (`File`, `Paths` classes); switched to `import { File } from
  'expo-file-system'` + `new File(asset.localUri).text()` to match it. Re-verified: `tsc`/lint/
  format/tracker-audit all still pass; the actual runtime render still needs the desktop
  verification pass above (this class of bug is exactly why — it was invisible to every static
  check available in this session).
- **`privacy` as a bare unguarded `Stack.Screen` sets a second precedent (PLAUSIBLE, not
  changed):** alongside `+not-found`/`+html`'s unguarded status, `privacy` is unguarded for a
  different reason (FR5 requirement, not a routing special-case) with no shared abstraction
  between them. Verified via expo-router source that this doesn't create any fail-open/ordering
  risk (Stack's initial-route resolution doesn't depend on JSX child order) — left as-is; a
  shared "unguarded route" concept isn't warranted for two instances.
- **Altitude note on the Metro-asset approach (considered, not changed):** one reviewer suggested
  a plain `.ts` string-export would have been simpler/more robust than the new Metro `md`
  asset-extension + `expo-asset` + `expo-file-system` pipeline, given it can't be verified without
  a real bundler run. Kept the asset-based approach because it's what `architecture/
  infrastructure.md` explicitly specifies (git-tracked markdown → bundled → in-app render) and
  matches the established `scripture.db` precedent — but this is exactly the kind of decision
  worth Lawrence's desktop verification pass confirming before it's trusted.

### File List

- `metro.config.js` (modified — added `'md'` to `assetExts`)
- `docs/glass-wall-budget.md` (new — placeholder)
- `components/donation/GlassWallBudget.tsx` (new; revised in code review — correct `expo-file-system` API)
- `components/donation/index.ts` (modified — barrel export)
- `app/about.tsx` (new)
- `app/privacy.tsx` (new)
- `app/_layout.tsx` (modified — added `privacy` unguarded screen + `about` to guarded block)
- `app/index.tsx` (modified — temporary link to `/about`)
- `locales/ta.json` (modified — new `about`/`privacy` namespaces + `donation.glassWallUnavailable`)
- `package.json`, `package-lock.json` (modified — `react-native-markdown-display`, `expo-asset`)
