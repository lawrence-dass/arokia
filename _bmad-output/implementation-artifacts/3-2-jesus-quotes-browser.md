# Story 3.2: Jesus Quotes Browser

Status: review

## Story

As a Tamil Christian user,
I want to browse all 50 Jesus quotes from the Gospels, each showing verbatim Tamil text with its verse reference,
So that I can encounter and dwell on Jesus's direct words at any time without needing an account.

## Acceptance Criteria

1. **Given** the user navigates to the Quotes section
   **When** the screen loads
   **Then** all published `content_items` with `content_type = 'quote'` and `language_code = 'ta'` are displayed as a scrollable list of `ScriptureCard` components, each showing verbatim Tamil text and verse reference (FR10)

2. **Given** the quotes list
   **When** rendered on a mid-range Android simulator
   **Then** it reaches a scrollable interactive state in ≤1 second (NFR-P4)

3. **Given** a quote in the list
   **When** the user taps it
   **Then** a detail screen opens showing the full verbatim Tamil text, verse reference, audio play button (if audio available), and share button

4. **Given** the detail screen
   **When** reviewed for account requirements
   **Then** zero sign-in prompts appear; the full quote and audio are accessible anonymously (FR22, NFR-PR1)

5. **Given** 50 quotes seeded in `content_items` with `review_status = 'published'`
   **When** the quotes browser loads
   **Then** all 50 are visible; the RLS policy correctly hides any draft items

## Scope Note — No seeded data yet (Story 3.4 comes later in this epic)

AC5 requires 50 seeded quotes, but Story 3.4 (content seeding) is the LAST story in Epic 3 and
has not run — this is deliberate epic sequencing (build the pipes, then fill them). This story
builds the browser against `content_items` exactly as it is: today that means an empty result set
from `getQuotes('ta')`, so the empty-state UI (a real requirement, not a nice-to-have — the app
ships to real users before 50 quotes may be fully live) gets equal engineering attention here.
AC5 itself will only be fully verifiable once Story 3.4 lands.

## Scope Note — Route naming pre-positions for Epic 4's tab group

`architecture.md` designates the real routes as `app/(tabs)/word.tsx` (browse) and
`app/verse/[id].tsx` (detail), inside a `(tabs)` route group Epic 4 (Story 4.1, Triune Home
Navigation) hasn't built yet. This story creates `app/word.tsx` (not yet inside a `(tabs)` group)
and `app/verse/[id].tsx` — matching the architecture's intended filenames now, so Epic 4 only
needs to *move* `word.tsx` into `app/(tabs)/` later, not rename or rewrite it. A temporary link
from the placeholder `app/index.tsx` provides reachability until Epic 4's real tab bar exists —
same pattern Story 2.3 used for `/about`.

## Scope Note — Share button is a plain-text placeholder, not Epic 5's branded verse card

The detail screen's "share button" (AC3) uses React Native's built-in `Share.share()` API with
the verbatim text + reference as a plain string — no new dependency, no image generation. FR34's
full requirement (a branded PNG verse card with the Arokia mark, via `VerseCardView` +
`react-native-view-shot`) is explicitly Epic 5 scope (Story 5.1, `sprint-status.yaml`: `backlog`),
and Story 3.1 already stubbed `VerseCardView` for exactly that future story. This story's share
button is real, working, and satisfies "share button" as literally stated in AC3 — it is not the
final branded experience.

## Tasks / Subtasks

- [x] **Create `app/word.tsx`** (AC: 1, 2, 4)
  - [x] On mount, call `useContentStore().fetchQuotes('ta')` (already implemented, Story 1.4 —
    do not reimplement fetch/loading/error state, the store already has `isLoading`/`error`)
  - [x] Render `useContentStore().quotes` as a `FlatList` of `ScriptureCard` (from
    `@/components/scripture`, Story 3.1), each `onPress` navigating to `/verse/[id]`
  - [x] Loading state: simple loading text/spinner while `isLoading` is true
  - [x] Error state: render `t(error)` when `error` is set (the store already stores the i18n
    key string `'errors.offline'`, not a raw message — follow that existing convention)
  - [x] Empty state (real requirement, see Scope Note): when not loading, no error, and
    `quotes.length === 0`, show a dedicated `t('word.empty')` message — NOT the offline error
    message, this is a distinct, expected-for-now state
  - [x] Zero auth/sign-in UI anywhere on this screen (AC 4)

- [x] **Create `app/verse/[id].tsx`** (AC: 3, 4)
  - [x] Read `id` via `useLocalSearchParams<{ id: string }>()`; look up the quote from
    `useContentStore().quotes` (already fetched by `word.tsx` — this story does not add a
    `getContentItemById()` service function; see Dev Notes for the known limitation)
  - [x] If not found (e.g. direct deep link with no prior list fetch), show a simple not-found
    state — reuse `errors.notFound` / `errors.backHome` keys, no new keys needed
  - [x] Render the full `VerseText` (verbatim text + reference) — not a truncated `ScriptureCard`
  - [x] Audio play button: only rendered when `quote.audioAssetId` is truthy. Wire to
    `useAudioStore()`'s already-implemented `playTrack`/`pauseAudio`/`currentTrack`/`isPlaying` —
    toggle label between `t('audio.play')`/`t('audio.pause')` (existing keys) based on whether
    this specific quote (`currentTrack?.id === quote.id && isPlaying`) is the one playing
  - [x] Share button: `Share.share({ message: ... })` (React Native core API) — see Scope Note
  - [x] Zero auth/sign-in UI (AC 4)

- [x] **Wire routing** (AC: 1, 3)
  - [x] Add `word` and `verse/[id]` to the `vowSatisfied`-guarded `Stack.Protected` block in
    `app/_layout.tsx`, alongside `index`/`spikes`/`about`/`report-concern`
  - [x] Add a temporary `<Link href="/word">` from `app/index.tsx` (see Scope Note) — same
    pattern as the existing `/about` link added in Story 2.3

- [x] **Add i18n keys** (AC: 1, 3)
  - [x] New `word` namespace in `ta.json`: `title`, `linkLabel`, `loading`, `empty`, `shareCta`
  - [x] Reuse EXISTING keys — do not duplicate: `errors.offline` (fetch error), `errors.notFound`
    / `errors.backHome` (verse-not-found state), `audio.play` / `audio.pause` (play button label)

- [x] **Verification** (AC: all)
  - [x] `npm run format` after all file writes
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 new warnings
  - [x] `bash scripts/audit-trackers.sh` — passed
  - [ ] Simulator walkthrough — **pending desktop verification, see Dev Agent Record**: empty-state
    renders correctly with zero seeded quotes (expected today); once ANY test content_items row
    exists, confirm the list renders it as a `ScriptureCard`, tapping opens the detail screen,
    share opens the system share sheet with the correct text, and — if that test row has an
    `audio_asset_id` — the play button actually plays audio (RNTP device validation is still
    gated pre-Epic-4 per `sprint-status.yaml`; this checks the button wiring, not RNTP itself)

## Dev Notes

### Critical Architecture Requirements (MUST follow)

- **Route filenames match architecture's eventual `(tabs)` structure** — see Scope Note. Do not
  invent different names (e.g. `quotes.tsx`) that Epic 4 would then need to rename.
  [Source: architecture.md#L829, architecture/frontend.md#L112]
- **`ScriptureCard`/`VerseText` from Story 3.1 — do not reimplement scripture rendering.** Every
  place this screen or the detail screen shows scripture text MUST go through those components,
  per the attribution invariant they exist to enforce.
- **No `getContentItemById()` added to `lib/content.ts` in this story** — see the known
  limitation below. Do not add new Supabase query functions beyond what's needed; `useContentStore`
  already holds the fetched list the detail screen needs.
- **`@/` path aliases only**, zero hardcoded strings, NativeWind `className` only

### Known Limitation — detail screen requires visiting the list first

`app/verse/[id].tsx` looks up its quote from `useContentStore().quotes` (already in memory from
`word.tsx`'s fetch) rather than fetching by ID independently. This means a cold deep link straight
to `/verse/<id>` (skipping `/word`) shows the not-found state even for a real, published quote.
No current entry point does this (nothing links to `/verse/[id]` except `word.tsx`'s own list), so
it's not a regression today. If Epic 5's share feature or a future push-notification deep link
needs to open a specific verse cold, add a `getContentItem(id)` fallback fetch at that time — don't
build it speculatively now.

### Existing Code You Are Building On (do NOT reinvent)

- `store/contentStore.ts:useContentStore` — `quotes`, `isLoading`, `error`, `fetchQuotes(lang)`
  already fully implemented (Story 1.4). This story is UI wiring on top of it, not new fetch logic.
- `store/audioStore.ts:useAudioStore` — `playTrack(content)`, `pauseAudio()`, `currentTrack`,
  `isPlaying` already fully implemented (Story 1.6/1.4). Reuse directly; do not add new audio
  actions for this story's minimal play/pause button.
- `components/scripture/{VerseText,ScriptureCard}` (Story 3.1) — use both; do not build new
  scripture-rendering markup.
- `locales/ta.json` — `audio.play`/`audio.pause`/`errors.offline`/`errors.notFound`/
  `errors.backHome` already exist; reuse them.

### Testing Standards

No test suite exists yet. Verification is tsc + lint + tracker-audit + simulator walkthrough
(desktop-only — this session has no `.env.local` Supabase credentials, so `getQuotes('ta')`
cannot be exercised against a real project; the empty-state path is the only one verifiable
end-to-end without live data, and even that only via a real Metro/simulator run this session
cannot do).

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-3.md#Story 3.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#L829, #L833, #L988]
- [Source: _bmad-output/planning-artifacts/architecture/frontend.md#L112, #L116]
- [Source: _bmad-output/planning-artifacts/prd.md#FR10, FR22, NFR-P4, NFR-PR1]
- [Source: store/contentStore.ts, store/audioStore.ts, lib/content.ts, lib/audio.ts — existing implementation this story wires up]

## Dev Agent Record

### Agent Model Used

Claude (Claude Code, cloud/mobile session)

### Debug Log References

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 1 pre-existing warning (`lib/i18n.ts:8`, known, not in scope)
- `npm run format` — clean
- `bash scripts/audit-trackers.sh` — passed

### Completion Notes List

- Extended `components/shared/Button` (added in Story 2.4's code review) with an optional
  `variant?: 'primary' | 'secondary'` prop, defaulting to `'primary'` (fully backward compatible
  with its existing `OpeningVow`/`ConcernForm` usages). The detail screen needs two visually
  distinct buttons in one row (a filled primary "play" and an outline "share"), which is the
  second genuine need for a button variant — extending now rather than writing a third one-off
  `Pressable` matches the reuse discipline the codebase has been building toward all session.
  Added a `secondary` variant (`border-border` outline, `bg-transparent`, `text-text-primary`).
  Not in the story's original task list — added while implementing.
- `useContentStore`/`useAudioStore` required zero changes — this story is purely UI/routing
  wiring on top of already-implemented Story 1.4/1.6 infrastructure.
- No new i18n theological/identity content — `word.*` keys are ordinary UI labels/states.
- **Known limitation** (documented in Dev Notes, not a bug): `/verse/[id]` looks up its quote from
  the in-memory `contentStore.quotes` list, so a cold deep link straight to a verse (skipping
  `/word`) shows not-found. No current entry point does this.
- **Pending desktop verification (cannot run in this cloud session — no simulator/device access,
  and no `.env.local` credentials to exercise a real Supabase query):**
  - Empty-state rendering (the only state currently reachable with real data, since no quotes are
    seeded yet — Story 3.4 hasn't run).
  - Once test data exists: list rendering, tap-to-detail navigation, the share sheet actually
    opening with correct text, and the play/pause button's visual state toggling correctly.
  - NFR-P4 (≤1s to scrollable interactive state) — unverifiable without a device.

### File List

- `app/word.tsx` (new)
- `app/verse/[id].tsx` (new)
- `app/_layout.tsx` (modified — added `word`/`verse/[id]` to the guarded block)
- `app/index.tsx` (modified — temporary link to `/word`)
- `components/shared/Button.tsx` (modified — added `variant` prop)
- `locales/ta.json` (modified — new `word` namespace)
