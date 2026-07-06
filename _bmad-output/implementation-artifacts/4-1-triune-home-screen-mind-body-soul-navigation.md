# Story 4.1: Triune Home Screen (Mind / Body / Soul Navigation)

Status: review

## Story

As a Tamil Christian user,
I want to navigate to three distinct practice paths (Mind, Body, Soul) from the home screen and reach today's featured Soul content within two taps,
So that daily spiritual practice has a clear, calm entry point that reflects the wholeness Arokia is built on.

## Acceptance Criteria

1. **Given** a user who has completed the Opening Vow
   **When** they arrive at the home screen
   **Then** three clearly labelled practice path tiles are shown: 🧠 மனம் (Mind), 💪 உடல் (Body), 🕊️ ஆத்மா (Soul) — each as a distinct tappable area with ≥48×48 dp touch target (FR6, NFR-A1)

2. **Given** the home screen
   **When** the user taps the Soul tile
   **Then** they reach today's featured Soul meditation within one more tap — total 2 taps from home to playing content (FR7, NFR-A4)

3. **Given** the `<TimeOfDayBanner>` component slot in `app/(tabs)/index.tsx`
   **When** rendered in v1
   **Then** it renders `null`; the `timeFilter` constant is `'any'`; the component accepts a `timeFilter` prop so v1.1 can activate it without structural change

4. **Given** the `<TriuneGrid>` component
   **When** it receives `timeFilter = 'any'`
   **Then** it passes the filter to `lib/content.ts:getMeditations()` — the time-of-day filtering infrastructure is wired even though v1 always passes `'any'`

5. **Given** all home screen strings
   **When** reviewed
   **Then** zero are hardcoded — all come from `ta.json` home namespace (NFR-I1)

## Scope Note — This story builds the real `(tabs)` route group (architecture's intended structure)

`architecture.md#L871-880` designates the real home as `app/(tabs)/index.tsx` inside a `(tabs)`
route group with a persistent-mini-player layout (`app/(tabs)/_layout.tsx`) — this hasn't existed
until now because Epic 4 is where it's built. This story:
- Creates `app/(tabs)/_layout.tsx` (a `<Tabs>` navigator) and `app/(tabs)/index.tsx` (replacing
  the placeholder `app/index.tsx`, which is deleted)
- **Moves** `app/word.tsx` → `app/(tabs)/word.tsx` (Story 3.2's own Scope Note already committed
  to this exact move "at that point" — this is that point). The route path (`/word`) is
  unchanged — `(tabs)` is a route group, it adds no URL segment — so no existing `<Link
  href="/word">` call site needs updating.
- Does NOT move `app/about.tsx` into `(tabs)` yet, even though architecture eventually puts it
  there — About isn't a primary daily-practice nav destination and moving it isn't required by
  this story's ACs; deferring it avoids unrelated file churn. Easy to do later.
- Does NOT add an `integrity` tab — `app/(tabs)/integrity.tsx` (Glass-Wall + donation CTA) is
  Epic 6 scope and doesn't exist yet; adding a tab pointing nowhere would be worse than adding it
  when Epic 6 actually builds the screen.
- `app/(tabs)/walk.tsx` (Story 4.2, this session, next) becomes the third tab.

## Scope Note — "2 taps to Soul content" only works once meditation content exists

AC2's "today's featured Soul meditation" has no curation/rotation mechanism defined anywhere in
the PRD/architecture — "featured" isn't a data field on `content_items`. This story implements
the only honest, uncontroversial interpretation available: the Soul tile checks
`useContentStore().meditations` (already filtered to `practicePath: 'soul'` once fetched) and, if
at least one exists, navigates directly to that first item's `/meditation/[id]` — satisfying the
literal 2-tap mechanism the moment real content exists, with zero further code changes. Today,
with no meditations seeded (Story 4.6 not run), the array is empty, so the Soul tile falls back to
the same filtered-list behavior as Mind/Body. This is a technical/rotation decision, not an
editorial one — no theological judgment about which content to "feature" is made here.

## Tasks / Subtasks

- [x] **Create `app/(tabs)/_layout.tsx`** (AC: none directly — structural prerequisite)
  - [x] `<Tabs>` from `expo-router` with `screenOptions={{ headerShown: false }}`, three
    `<Tabs.Screen>` entries: `index`, `word`, `walk` — icons via `@expo/vector-icons`'s `Ionicons`
    (already a dependency, first usage in this codebase)
  - [x] Tab labels from `ta.json` (new `home.tabLabel` for Home; reuse existing `word.title` for
    Word — no new translation needed since it's the same already-flagged-for-review string; new
    `walk.title` for Walk)

- [x] **Create `components/home/TimeOfDayBanner.tsx`** (AC: 3)
  - [x] Accepts `{ timeFilter: TimeOfDay }`, renders `null` unconditionally in v1 — this is
    intentionally a no-op component, not a placeholder-to-fill-in; v1.1 activates it later
    without any structural change to callers

- [x] **Create `components/home/TriuneGrid.tsx`** (AC: 1, 2, 4)
  - [x] Three tiles: Mind/Body/Soul, each `min-h-12`+ touch target (well over 48dp given tile
    sizing), emoji (🧠💪🕊️ — decorative, not translatable text, kept in code not `ta.json`) +
    `t('home.mind')`/`t('home.body')`/`t('home.soul')` (existing keys)
  - [x] Accepts `{ timeFilter: TimeOfDay }`, passes it through to `useContentStore().fetchMeditations`
    (via the practicePath-scoped calls below) — satisfies AC4's "infrastructure is wired" even
    though the value is always `'any'` in v1
  - [x] Mind/Body tiles: `router.push('/walk?practicePath=mind')` / `'/walk?practicePath=body'`
  - [x] Soul tile: check `useContentStore().meditations` filtered to `practicePath === 'soul'`;
    if non-empty, `router.push(\`/meditation/${firstSoulItem.id}\`)`; else
    `router.push('/walk?practicePath=soul')` (see Scope Note)

- [x] **Create `app/(tabs)/index.tsx`** (AC: 1, 3, 4, 5)
  - [x] Delete `app/index.tsx` (placeholder) — replaced by this file
  - [x] `timeFilter` constant `'any'` (AC3), call `useContentStore().fetchMeditations('ta')` on
    mount (needed for the Soul tile's lookup above) via the same `useQuotesFetch`-style pattern —
    actually add a `useMeditationsFetch` sibling hook (mirrors `useQuotesFetch`, same
    store-level `hasFetchedMeditations` guard — see Dev Notes on avoiding the Story 3.3 bug class)
  - [x] Render `<TimeOfDayBanner timeFilter="any" />` + `<TriuneGrid timeFlter="any" />`

- [x] **Move `app/word.tsx` → `app/(tabs)/word.tsx`** (structural, see Scope Note)
  - [x] File content unchanged — this is a location move, not a rewrite

- [x] **Update `app/_layout.tsx`'s guarded `Stack.Protected` block**
  - [x] Replace the standalone `<Stack.Screen name="index" />` and `<Stack.Screen name="word" />`
    entries with a single `<Stack.Screen name="(tabs)" />` — the group now owns both routes
    internally
  - [x] Everything else (`spikes`, `about`, `report-concern`, `verse/[id]`, `search`) stays as
    top-level `Stack.Screen`s, pushed on top of the tabs UI when navigated to — standard
    tabs+stack hybrid pattern, not a new concept

- [x] **Add i18n keys**
  - [x] `home.tabLabel` (new), `walk.title` (new, used by both the Walk tab label and Story 4.2's
    screen heading — added here since the tab needs it now, Story 4.2 doesn't need to re-add it)
  - [x] Zero new hardcoded strings anywhere in the new files

- [x] **Verification** (AC: all)
  - [x] `npm run format` after all file writes
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 new warnings
  - [x] `bash scripts/audit-trackers.sh` — passed
  - [ ] Simulator walkthrough — **pending desktop verification, see Dev Agent Record**: tab bar renders with 3
    tabs, correct icons/labels; tapping Mind/Body navigates to `/walk` pre-filtered; tapping Soul
    falls back to the filtered list (expected — no meditations seeded yet); confirm `/word`
    still works identically now that it's inside the tab group; touch-target sizing on-device

## Dev Notes

### Critical Architecture Requirements (MUST follow)

- **`(tabs)` route group matches `architecture.md#L871-880` exactly** for the 3 screens this story
  builds (`index`, `word`, `walk`) — do not invent different tab names or add `about`/`integrity`
  tabs (see Scope Note).
- **Avoid Story 3.3's `useQuotesFetch` bug class**: track "has fetched" at the STORE level
  (`hasFetchedMeditations: boolean` on `contentStore`, mirroring the already-fixed
  `hasFetchedQuotes`), not per-component local state — the review in Story 3.3 found and fixed
  exactly this mistake once; don't reintroduce it for meditations.
- **`@/` path aliases only**, zero hardcoded strings, NativeWind `className` only

### Existing Code You Are Building On (do NOT reinvent)

- `store/contentStore.ts` — `fetchMeditations`, `meditations`, `activeFilters`,
  `hasFetchedQuotes`/`useQuotesFetch` pattern (Story 3.3) to mirror for meditations.
- `components/scripture/QuoteList.tsx` — reference for the loading/error/empty/list rendering
  shape, though `TriuneGrid` itself doesn't need a list (that's Story 4.2's `walk.tsx`).
- `app/_layout.tsx` — existing `Stack.Protected` guard structure (Stories 2.1–2.2), splash-screen
  wiring (Story 2.1's review) — do not touch the `vowSatisfied`/hydration logic, only the screen
  list inside the already-guarded block.

### Testing Standards

No test suite exists yet. Verification is tsc + lint + tracker-audit + simulator walkthrough
(desktop-only) — this story restructures the root navigation, so the walkthrough matters more
than usual (confirming the tab bar itself renders, and that moving `word.tsx` didn't break its
existing behavior from Story 3.2/3.3).

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-4.md#Story 4.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#L871-880, #L888-892]
- [Source: _bmad-output/planning-artifacts/prd.md#FR6, FR7, NFR-A1, NFR-A4, NFR-I1]
- [Source: store/contentStore.ts, app/_layout.tsx, app/word.tsx — existing implementation this story extends/moves]

## Dev Agent Record

### Agent Model Used

Claude (Claude Code, cloud/mobile session)

### Debug Log References

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 1 pre-existing warning (`lib/i18n.ts:8`, known, not in scope)
- `npm run format` — clean
- `bash scripts/audit-trackers.sh` — passed

### Completion Notes List

- **Implemented together with Story 4.2 in this session** — deliberate deviation from
  one-story-per-commit: `TriuneGrid` (this story) navigates directly into `/walk` and
  `/meditation/[id]` (Story 4.2's own deliverables), so a commit containing only 4.1's files
  would leave a genuinely broken tab (pointing at routes that don't exist) rather than an
  incomplete-but-working state. Both stories are committed together with clear attribution in
  each Dev Agent Record of which files/logic belong to which story.
- `useMeditationsFetch` (in `store/contentStore.ts`) ended up filter-keyed
  (`practicePath|moodTag|timeOfDay`) rather than a simple one-shot flag like `useQuotesFetch` —
  necessary because Story 4.2's mood filter needs a real re-fetch on change; a one-shot guard
  would have shown stale results. `getMeditations()` gained `moodTag`/`timeOfDay` params to
  support this (mirroring `getQuotes()`'s existing `moodTag` pattern for the former; `timeOfDay`
  is new, satisfying AC4 literally — `TriuneGrid` passes `timeFilter` through
  `useMeditationsFetch` → `fetchMeditations` → `getMeditations`, which now filters
  `.eq('time_of_day', timeOfDay)` — a no-op today since every MVP row will be `'any'`, but the
  parameter exists so v1.1 needs no signature change).
- Moved `app/word.tsx` → `app/(tabs)/word.tsx` via `git mv` (history preserved) with zero content
  changes — confirmed the route path is unaffected (`(tabs)` adds no URL segment) by leaving
  every existing `<Link href="/word">` call site untouched.
- Kept a link to `/about` on the new real home screen (previously a "temporary" link on the
  placeholder) since `about.tsx` isn't a tab and has no other entry point yet — no longer
  "temporary" since this is now the permanent home screen, but still worth revisiting once a
  proper settings/menu surface exists.
- **Pending desktop verification (cannot run in this cloud session — no simulator/device access):**
  - Tab bar renders with correct icons (`home`/`book`/`walk` from `Ionicons`, first usage of
    `@expo/vector-icons` in this codebase) and labels.
  - Touch-target sizing of the three tiles on-device (NFR-A1's 48×48dp).
  - Confirming `/word`'s existing behavior (Stories 3.2/3.3) is unaffected by the move into the
    tab group — code is unchanged, but the surrounding navigation context (tabs vs. bare stack)
    is new and unverified at runtime.

### File List

- `app/(tabs)/_layout.tsx` (new)
- `app/(tabs)/index.tsx` (new)
- `app/(tabs)/word.tsx` (moved from `app/word.tsx`, `git mv`, unchanged content)
- `app/index.tsx` (deleted — replaced by `app/(tabs)/index.tsx`)
- `app/_layout.tsx` (modified — `(tabs)` group replaces standalone `index`/`word` screens)
- `components/home/TriuneGrid.tsx` (new)
- `components/home/TimeOfDayBanner.tsx` (new)
- `components/home/index.ts` (modified — barrel exports)
- `lib/content.ts` (modified — `getMeditations()` gained `moodTag`/`timeOfDay` params; shared
  with Story 4.2, which is why `moodTag` exists)
- `store/contentStore.ts` (modified — `useMeditationsFetch()` + `meditationsFetchedFilterKey`;
  shared with Story 4.2)
- `locales/ta.json` (modified — `home.tabLabel`, `walk.title`)
