# Story 4.2: Meditation Library — Browse by Practice Path & Emotional State

Status: review

## Story

As a Tamil Christian user,
I want to browse the full meditation library filtered by practice path (Mind/Body/Soul) and by emotional state (anxious, grieving, angry, lonely, tempted),
So that I can find the right meditation for what I am carrying today, not just what is newest.

## Acceptance Criteria

1. **Given** the user taps a practice path tile (e.g., Mind)
   **When** the library screen loads
   **Then** all published meditations with matching `practice_path` are shown as a list with title, duration (see Scope Note), and mood tag (FR8)

2. **Given** the anxiety library accessible from the home screen or Mind path
   **When** the user selects an emotional state (e.g., "கவலை" — anxious)
   **Then** only meditations with the matching `mood_tag` are shown; `mood_tag = 'none'` meditations are excluded (FR9)

3. **Given** the meditation list
   **When** rendered on a mid-range Android simulator
   **Then** it reaches interactive state in ≤1 second (NFR-P4)

4. **Given** any meditation in the list
   **When** tapped
   **Then** a detail screen opens with title, verse reference, duration (see Scope Note), and a prominent Play button — no account prompt (NFR-PR1)

5. **Given** the Lectio Divina track (`content_type = 'lectio'`)
   **When** browsing the Soul path
   **Then** the "Silence Between Words" track is discoverable and accessible (FR12) — **deferred, see Scope Note**

## Scope Note — Duration not shown (no data to show)

`ContentItem` has no `duration` field, and `content_items` doesn't store one either — duration
lives on `audio_assets.duration_sec`, joined via `audio_asset_id`. Since no meditation has an
`audio_asset_id` yet (Story 4.6, content seeding, hasn't run — same content-blocker as every
other data-dependent story this session), there is no duration to display regardless of whether
a join is added. This story does not show duration in either the list or detail screen; adding
the `audio_assets` join is deferred until Story 4.6 seeds real audio and duration becomes
meaningful to display.

## Scope Note — Lectio Divina (AC5) deferred — this is an audio-playback feature, not a browse feature

`architecture.md#L865` designates a dedicated route, `app/lectio-divina.tsx`, for "Silence Between
Words" — a distinct silence-based practice, not a standard meditation playback. Building that
route is fundamentally Story 4.3/4.4 territory (the audio player core), which is explicitly gated
behind RNTP device validation per `sprint-status.yaml`. Adding a link to a route that doesn't
exist yet would be worse than not adding one. AC5 is deferred to whenever the audio-player-core
stories unblock and `lectio-divina.tsx` gets built — logged in `deferred-work.md`.

## Scope Note — Reuses Story 4.1's `useMeditationsFetch`/filter-key infrastructure

This story is why `useMeditationsFetch` (built in Story 4.1, same session) is keyed by the full
`practicePath|moodTag|timeOfDay` combination rather than a one-time flag — changing the mood
filter on this screen must trigger a real re-fetch with different results, which a simple
"already fetched once" guard (Story 3.3's original `useQuotesFetch` pattern) would have
incorrectly suppressed.

## Tasks / Subtasks

- [x] **Add `getMeditations()`'s `moodTag` filter** (AC: 2) — *(done in Story 4.1's session pass,
  since `useMeditationsFetch` needed it to exist first; verify it's correct here)*
  - [x] Mirrors `getQuotes()`'s existing `moodTag` handling exactly (`mood_tag !== 'none'` guard)

- [x] **Create `components/home/MoodFilter.tsx`** (AC: 2)
  - [x] Architecture-designated location: `components/home/` [Source: architecture.md#L828, #L893]
  - [x] Props: `{ selected: MoodTag | null; onSelect: (mood: MoodTag | null) => void }` — five
    chips (`anxious`/`grieving`/`angry`/`lonely`/`tempted`, excluding `'none'` — there's no chip
    for "no mood," clearing the filter is tapping the already-selected chip again)
  - [x] New `mood.*` i18n keys — five ordinary emotional-state words, not theological/brand
    content (same treatment as `concern.*`'s procedural copy: written directly, flagged for
    linguistic review, not placeholder-blocked). `mood.anxious` = "கவலை" is given directly in the
    epic's own AC2 text, not invented here.

- [x] **Create `app/(tabs)/walk.tsx`** (AC: 1, 2, 3, 4)
  - [x] Read `practicePath` via `useLocalSearchParams<{ practicePath?: PracticePath }>()` (set by
    `TriuneGrid`'s Mind/Body tiles and the Soul-tile fallback, Story 4.1)
  - [x] Local `moodTag` state (`useState<MoodTag | null>`), `<MoodFilter>` at the top
  - [x] `useMeditationsFetch('ta', practicePath, moodTag ?? undefined, 'any')`
  - [x] Render precedence matches `QuoteList`'s already-fixed pattern (Story 3.3's review):
    pending → cached list (if non-empty) → error → empty. Do NOT reintroduce the
    error-before-cached-data bug that review already caught once.
  - [x] Each row: title + mood-tag label (skip the badge when `moodTag === 'none'`) — no
    duration (see Scope Note)
  - [x] Tapping a row: `router.push(\`/meditation/${item.id}\`)`

- [x] **Create `app/meditation/[id].tsx`** (AC: 4)
  - [x] Same shape as `app/verse/[id].tsx` (Story 3.2): look up from
    `useContentStore().meditations` (already fetched by `walk.tsx`); not-found state if absent
    (same known cold-deep-link limitation as Story 3.2 — document, don't fix speculatively)
  - [x] Title + verse reference (plain text — no scripture body is shown on this screen per AC4's
    literal wording, so `VerseText`'s attribution invariant doesn't apply here; the full passage
    hand-off is Story 4.4, out of scope)
  - [x] Play button (only when `audioAssetId` is truthy) wired to `useAudioStore`'s
    `playTrack`/`pauseAudio`/`currentTrack`/`isPlaying` — identical pattern to
    `app/verse/[id].tsx`, reusing `components/shared/Button`
  - [x] Zero sign-in/account UI

- [x] **Wire routing**
  - [x] `walk` is already a tab inside `app/(tabs)/_layout.tsx` (added in Story 4.1's session
    pass) — confirm the file exists and matches
  - [x] Add `meditation/[id]` to the `vowSatisfied`-guarded `Stack.Protected` block in
    `app/_layout.tsx` *(also done in the same session pass as 4.1 — verify)*

- [x] **Add i18n keys**
  - [x] `mood.anxious`/`.grieving`/`.angry`/`.lonely`/`.tempted` (new)
  - [x] `walk.loading`/`walk.empty` *(added during Story 4.1's session pass since `walk.title` was
    added there too — verify present)*

- [x] **Verification** (AC: all)
  - [x] `npm run format` after all file writes
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 new warnings
  - [x] `bash scripts/audit-trackers.sh` — passed
  - [ ] Simulator walkthrough — **pending desktop verification, see Dev Agent Record**: navigate from a home tile
    to `/walk` pre-filtered; toggle mood chips; empty state renders correctly (expected — no
    meditations seeded yet); tap-through to `/meditation/[id]` once test data exists

## Dev Notes

### Critical Architecture Requirements (MUST follow)

- **`MoodFilter` lives in `components/home/`**, not a new `components/walk/` — architecture
  explicitly maps it there, and it's conceptually shared with the home screen's own mood-based
  entry point (not built in this story, but the component's home stays consistent for when it is).
- **Do not build `app/lectio-divina.tsx`** — see Scope Note; this is Story 4.3/4.4-adjacent scope.
- **Do not add an `audio_assets` join to `getMeditations()`** — see Scope Note on duration; no
  data exists to justify it yet.
- **`@/` path aliases only**, zero hardcoded strings, NativeWind `className` only

### Existing Code You Are Building On (do NOT reinvent)

- `store/contentStore.ts:useMeditationsFetch` (Story 4.1, same session) — this story is the
  reason it's filter-keyed rather than one-shot; use it as built, don't add a second fetch path.
- `store/audioStore.ts:playTrack`/`pauseAudio` (Story 1.6/1.4) — same pattern
  `app/verse/[id].tsx` (Story 3.2) already established for the play button.
- `components/shared/Button` (Stories 2.4/3.2 reviews) — reuse for the play button.

### Testing Standards

No test suite exists yet. Verification is tsc + lint + tracker-audit + simulator walkthrough
(desktop-only) — same content-blocker as Stories 3.2/3.3: the list will be empty until Story 4.6
seeds real meditation content, so full end-to-end behavior is unverified beyond the empty-state
path.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-4.md#Story 4.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#L828, #L865, #L893]
- [Source: _bmad-output/planning-artifacts/prd.md#FR8, FR9, FR12, NFR-P4, NFR-PR1]
- [Source: store/contentStore.ts, store/audioStore.ts, lib/content.ts, app/verse/[id].tsx — existing implementation this story extends]

## Dev Agent Record

### Agent Model Used

Claude (Claude Code, cloud/mobile session)

### Debug Log References

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 1 pre-existing warning (`lib/i18n.ts:8`, known, not in scope)
- `npm run format` — clean
- `bash scripts/audit-trackers.sh` — passed

### Completion Notes List

- **Implemented together with Story 4.1 in this session** — see 4.1's Dev Agent Record for why
  (they're too tightly coupled to commit separately without an intermediate broken state).
- `mood.*` i18n keys are ordinary emotional-state vocabulary (anxious/grieving/angry/lonely/
  tempted), not theological content — flagged for linguistic review per this session's standard
  treatment of procedural copy, not placeholder-blocked. `mood.tempted` ("சோதனை") is the standard
  Tamil Christian liturgical term for "temptation" (as in the Lord's Prayer), which is a good sign
  for register correctness, though still unreviewed by a native speaker.
- `walk.tsx`'s render precedence (pending → cached list → error → empty) directly applies the
  fix Story 3.3's code review already made once to `QuoteList` — written correctly from the start
  this time rather than reintroducing the bug for review to catch again.
- **Pending desktop verification (cannot run in this cloud session — no simulator/device access,
  and no meditation content seeded yet — Story 4.6 hasn't run):**
  - Mood filter chip toggling and the resulting re-fetch/re-render.
  - Tap-through from `/walk` to `/meditation/[id]` and the play/pause button's visual state.
  - NFR-P4 (≤1s to interactive) — unverifiable without a device.

### File List

- `components/home/MoodFilter.tsx` (new)
- `components/home/index.ts` (modified — barrel export)
- `app/(tabs)/walk.tsx` (new)
- `app/meditation/[id].tsx` (new)
- `app/_layout.tsx` (modified — added `meditation/[id]` to the guarded block; shared edit with
  Story 4.1)
- `locales/ta.json` (modified — new `mood` namespace)
- `_bmad-output/implementation-artifacts/deferred-work.md` (modified — logged the deferred
  Lectio Divina discoverability, AC5)
