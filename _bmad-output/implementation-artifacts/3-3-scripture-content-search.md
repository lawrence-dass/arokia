# Story 3.3: Scripture Content Search

Status: review

## Story

As a Tamil Christian user,
I want to search the content library by topic or keyword,
So that I can find the words of Jesus relevant to what I am facing right now — anxiety, grief, identity, forgiveness — without scrolling through the entire library.

## Acceptance Criteria

1. **Given** the search interface accessible from the content browser
   **When** the user enters a Tamil keyword (e.g., "கவலை")
   **Then** `lib/content.ts:searchContent()` queries the Expo SQLite full-text index and returns matching quotes within ≤500 ms (FR11)

2. **Given** the search results
   **When** displayed
   **Then** each result shows a `ScriptureCard` with verbatim text and verse reference — no result is rendered without attribution (FR13)

3. **Given** an English keyword is entered (e.g., "peace")
   **When** the search executes
   **Then** matching results are returned from verse references or English-language fields; Tamil results are prioritized

4. **Given** a search with no results
   **When** displayed
   **Then** a helpful empty state is shown in Tamil from `ta.json` — no raw English fallback

5. **Given** the user clears the search input
   **When** the field is empty
   **Then** the full quotes list is restored without a full reload

## Scope Note — Search runs over the full bundled scripture text, not just the 50 curated quotes

`lib/sqlite.ts:searchScripture()` (already built in Story 1.3) runs a `scripture_fts` MATCH query
over the entire bundled Tamil OV New Testament (`data/tamil-ov-nt.json`, thousands of verses) —
not the 50-quote `content_items` catalog Story 3.2's browser reads from. This is the correct,
architecture-intended design: `architecture.md#L225` designates Expo SQLite specifically for
"full-text search (FR11)" over the offline scripture bundle, and `searchScripture` already exists
for exactly this purpose. Search results are therefore individual Bible verses (any verse, not
only ones the operator has curated into the 50 MVP quotes), each satisfying AC2's attribution
requirement on its own — `ScriptureVerse` already carries `text`/`book`/`chapter`/`verse`, enough
to build a `ScriptureCard` without needing full `ContentItem` metadata (`practicePath`,
`moodTag`, etc., which a raw verse doesn't have and doesn't need for search display).

## Scope Note — `searchContent()`'s signature changes (zero existing callers, safe to change)

`lib/content.ts:searchContent(lang, query)` currently queries Supabase `content_items` via
`ilike` on `title` — this doesn't match AC1's "queries the Expo SQLite full-text index"
requirement at all, and has zero callers anywhere in the app yet (verified via repo-wide grep),
so changing its signature is safe. New signature:
`searchContent(db: SQLiteDatabase, lang: LanguageCode, query: string): Promise<ScriptureVerse[]>`
— a thin delegate to `lib/sqlite.ts:searchScripture()`, kept in `content.ts` (rather than having
`app/search.tsx` call `searchScripture` directly) so there remains ONE documented search entry
point matching `architecture.md`'s stated API surface (`lib/content.ts # ... searchContent()`),
consistent with the "components/screens go through lib/, not raw DB access" convention already
used for Supabase calls. The `db` parameter is new and necessary: unlike `getQuotes`/
`getMeditations` (which use the module-level `supabase` singleton), SQLite access in this
codebase is React-context-based (`useSQLiteContext()`, obtained inside a component under the root
`SQLiteProvider`) — there is no module-level SQLite handle to import.

## Scope Note — English-keyword fallback searches book names, not scripture body text

No English scripture text is bundled anywhere in this app (`LanguageCode` is `'ta' | 'hi' | 'te'`
— there is no `'en'`), so AC3's "results... from English-language fields" cannot mean searching
English verse body text — none exists. The one real English-language field in the local
`scripture` table is `book` (e.g. `"Matthew"` — confirmed in `data/tamil-ov-nt.json`). This story
implements AC3 as: if the Tamil FTS search returns zero results AND the query contains Latin
characters (a simple regex heuristic — "looks like an English query"), fall back to a `LIKE`
match against the `book` column, capped at a small result count. This is a real, working
fallback within the actual bounds of the data that exists — not a full bilingual search engine.

## Tasks / Subtasks

- [x] **Add `searchScriptureByBook()` to `lib/sqlite.ts`** (AC: 3)
  - [x] `searchScriptureByBook(db: SQLiteDatabase, bookQuery: string, languageCode = 'ta'): Promise<ScriptureVerse[]>` — `WHERE book LIKE ? AND language_code = ? LIMIT 20`, case-insensitive (SQLite's default `LIKE` is case-insensitive for ASCII, sufficient for English book names)
  - [x] Keep it beside the existing `searchScripture()` — same file, same patterns (parameterized query, no string concatenation)

- [x] **Rewrite `lib/content.ts:searchContent()`** (AC: 1, 2, 3)
  - [x] New signature: `searchContent(db: SQLiteDatabase, lang: LanguageCode, query: string): Promise<ScriptureVerse[]>` — remove the old Supabase `ilike`-on-`title` implementation entirely (see Scope Note: zero existing callers, safe)
  - [x] Empty/whitespace-only query → return `[]` immediately (matches the old implementation's guard, keep it)
  - [x] Run `searchScripture(db, query, lang)` first; if it returns zero results AND `/[a-zA-Z]/.test(query)` (looks like English), also run `searchScriptureByBook(db, query, lang)` and return those instead — "Tamil results are prioritized" (AC3) means Tamil FTS is always tried first and wins if it returns anything at all
  - [x] Import `SQLiteDatabase` type from `expo-sqlite`, not the Supabase client — this function no longer touches `@/lib/supabase`

- [x] **Create `app/search.tsx`** (AC: 1, 2, 4, 5)
  - [x] Obtain the SQLite handle via `useSQLiteContext()` (from `expo-sqlite`) — this is the first
    component in the app to call it directly; `app/_layout.tsx`'s root `SQLiteProvider` already
    makes it available
  - [x] On mount (empty query), show `useContentStore().quotes` — call `fetchQuotes('ta')` if not
    already populated, same empty/loading/error handling pattern as `app/word.tsx` (Story 3.2) —
    this is AC5's "full quotes list" baseline state
  - [x] `TextInput` for the search query (reuse the `border`/`surface`/`rounded-card` styling
    established in `components/shared/ConcernForm.tsx`, Story 2.4 — do not invent new input
    styling)
  - [x] On non-empty query (debounce not required — SQLite FTS is local and fast; call on every
    change), call `searchContent(db, 'ta', query)` and render its results instead of the quotes
    list, each as a `ScriptureCard` built from `{ text: verse.text, reference: \`${verse.book} ${verse.chapter}:${verse.verse}\`, languageCode: verse.languageCode }`
  - [x] Clearing the input (back to empty) shows the quotes list again — this should be a plain
    conditional render on "is query empty," not a re-fetch (AC5: "without a full reload" — the
    quotes list is likely already in `useContentStore().quotes` from before)
  - [x] Empty-results state: `t('search.empty')`, distinct from the quotes-list empty state
    (`word.empty`) — these are semantically different (no quotes seeded yet, vs. no verses matched
    this specific search)
  - [x] Zero sign-in/account UI (matches every other content screen's requirement)

- [x] **Wire routing** (AC: 1)
  - [x] Add `search` to the `vowSatisfied`-guarded `Stack.Protected` block in `app/_layout.tsx`
  - [x] Add a temporary `<Link href="/search">` from `app/word.tsx` (this IS "accessible from the
    content browser" per AC1 — `word.tsx` is the content browser) — not from `app/index.tsx`,
    since search's natural entry point is from the browse screen, not the placeholder home

- [x] **Add i18n keys** (AC: 4)
  - [x] New `search` namespace in `ta.json`: `title`, `linkLabel`, `placeholder`, `empty`
  - [x] Reuse existing `word.loading`/`errors.offline` for the baseline quotes-list states — do
    not duplicate

- [x] **Verification** (AC: all)
  - [x] `npm run format` after all file writes
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 new warnings
  - [x] `bash scripts/audit-trackers.sh` — passed
  - [ ] Simulator walkthrough — **pending desktop verification, see Dev Agent Record**: type a
    real Tamil word known to exist in `data/tamil-ov-nt.json`, confirm matching verses render
    within a perceptibly-instant time (FTS is local, ≤500ms should be trivial — but not measured here);
    type an English book name (e.g. "Matthew"), confirm the book-name fallback returns results;
    type nonsense, confirm the empty state renders; clear the field, confirm the quotes list
    reappears without a visible reload/flash

## Dev Notes

### Critical Architecture Requirements (MUST follow)

- **Search queries local SQLite, not Supabase** — see Scope Note. This is a deliberate
  architecture choice (`architecture.md#L202,225`), not an oversight to "fix" toward Supabase.
- **`searchContent()`'s new `db` parameter must come from `useSQLiteContext()`**, called inside
  `app/search.tsx` — do not try to construct or import a SQLite handle any other way
  [Source: existing `expo-sqlite` `SQLiteProvider` pattern in `app/_layout.tsx`]
- **`ScriptureCard`/`VerseText` from Story 3.1 — do not reimplement scripture rendering.**
- **`@/` path aliases only**, zero hardcoded strings, NativeWind `className` only

### Existing Code You Are Building On (do NOT reinvent)

- `lib/sqlite.ts:searchScripture(db, query, languageCode)` — already implemented (Story 1.3),
  already parameterized/escaped against FTS injection, already `LIMIT 50`. This story adds one
  sibling function (`searchScriptureByBook`) beside it, and wires both into `searchContent`.
- `store/contentStore.ts:useContentStore` — `quotes`/`isLoading`/`error`/`fetchQuotes` (same
  infrastructure `app/word.tsx` (Story 3.2) already uses) — reuse for the empty-query baseline
  state, don't build a second fetch path.
- `components/scripture/{VerseText,ScriptureCard}` (Story 3.1).
- `components/shared/ConcernForm.tsx` (Story 2.4) — reference for `TextInput` styling
  (`border-border`, `bg-surface`, `rounded-card`) — reuse the same classes.

### Testing Standards

No test suite exists yet. Verification is tsc + lint + tracker-audit + a desktop simulator pass —
this is the first story to exercise `useSQLiteContext()` and a real FTS query end-to-end, so the
simulator walkthrough matters more than usual; this cloud session cannot run Metro/a simulator at
all, so ALL of AC1/2/3/4/5's actual runtime behavior is unverified beyond static analysis.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-3.md#Story 3.3]
- [Source: _bmad-output/planning-artifacts/architecture.md#L202, #L225-226, #L401, #L829, #L921, #L925]
- [Source: _bmad-output/planning-artifacts/architecture/api-patterns.md#L10, #L17]
- [Source: _bmad-output/planning-artifacts/prd.md#FR11, FR13]
- [Source: lib/sqlite.ts, store/contentStore.ts, types/content.ts — existing implementation this story extends]

## Dev Agent Record

### Agent Model Used

Claude (Claude Code, cloud/mobile session)

### Debug Log References

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 1 pre-existing warning (`lib/i18n.ts:8`, known, not in scope)
- `npm run format` — clean
- `bash scripts/audit-trackers.sh` — passed

### Completion Notes List

- While implementing, noticed `app/word.tsx` and the planned `app/search.tsx` would both need the
  identical loading/error/empty/list rendering for the curated quotes baseline, plus the identical
  fetch-on-mount + one-frame-flash-guard logic Story 3.2's review already fixed once. Extracted
  both before they could duplicate a second time: `useQuotesFetch(lang)` (in
  `store/contentStore.ts`, same pattern as `prefsStore.ts`'s `useVowGate()`) and
  `components/scripture/QuoteList.tsx` (render logic). `app/word.tsx` was rewritten to use both —
  not in the story's original task list, but net simplification, not scope creep (word.tsx got
  shorter, not longer).
- `searchContent()`'s signature changed as planned (`db` param added, Supabase removed, return
  type is now `ScriptureVerse[]` not `ContentItem[]`) — confirmed zero pre-existing callers before
  changing it, so no other code needed updating.
- Added a small `<Link href="/search">` to `word.tsx`'s header row (not in the original task's
  exact wording, which described it more generally) — this is the "accessible from the content
  browser" entry point AC1 requires.
- **Pending desktop verification (cannot run in this cloud session — no simulator/device access):**
  - This is the first story to exercise `useSQLiteContext()` and a real FTS query against the
    bundled `scripture.db` end-to-end — entirely unverified beyond `tsc`/lint passing. The query
    logic mirrors Story 1.3's already-established `searchScripture()`, but the new
    `searchScriptureByBook()` fallback and the `search.tsx` wiring around both have not run.
  - Tamil FTS search returning real matches within a perceptible/≤500ms window (NFR — expected to
    be trivial for local SQLite, not measured).
  - English book-name fallback (e.g. typing "Matthew") actually triggering and returning results.
  - Clearing the search field restoring the quotes list without a visible flash/reload.

### Code Review Fixes Applied (2026-07-04)

A 2-angle multi-agent review confirmed SQL parameterization, the Tamil-first fallback logic, and
`app/word.tsx`'s rewrite were all correct — but found 3 real bugs, all fixed:

- **`useQuotesFetch` refetched on every mount (CONFIRMED by 2 independent agents, fixed):** the
  hook tracked "has fetched" as component-LOCAL state, so `word.tsx` and `search.tsx` each ran
  their own independent fetch, contradicting this story's own task spec ("call fetchQuotes if not
  already populated"). Navigating between the two screens re-fetched every time and flashed the
  loading state over an already-loaded list. Moved the flag into the store itself
  (`hasFetchedQuotes: boolean`, set `true` in `fetchQuotes` on both success and failure) so it's
  shared across every screen using the hook, not per-component.
- **`QuoteList` showed a transient error over valid cached data (CONFIRMED, fixed):** the render
  checked `error` before `quotes.length`, so the redundant refetch above (now eliminated, but this
  is also correct on its own) could blank out an already-successfully-loaded list if that specific
  background refetch failed. Reordered: cached quotes render unconditionally once present; `error`
  only shows when there's genuinely nothing to display instead.
- **`app/search.tsx` flashed stale results while a new query resolved (CONFIRMED, fixed):**
  `results` wasn't cleared when the query text changed, so a fast retype could briefly show
  matches for the previous query. Now clears `results` synchronously at the start of the effect,
  before the new `searchContent()` call resolves.

Re-verified: `tsc`/lint/format/tracker-audit all still pass.

### File List

- `lib/sqlite.ts` (modified — added `searchScriptureByBook()`)
- `lib/content.ts` (modified — `searchContent()` rewritten to query SQLite instead of Supabase)
- `store/contentStore.ts` (modified — added `useQuotesFetch()` hook + `hasFetchedQuotes` state;
  revised in code review — moved the fetch-guard flag from component-local to store-level)
- `components/scripture/QuoteList.tsx` (new; revised in code review — cached-data-before-error
  precedence)
- `components/scripture/index.ts` (modified — barrel export)
- `app/word.tsx` (modified — rewritten to use `useQuotesFetch`/`QuoteList`, added search link)
- `app/search.tsx` (new; revised in code review — clears stale results on query change)
- `app/_layout.tsx` (modified — added `search` to the guarded block)
- `locales/ta.json` (modified — new `search` namespace)
