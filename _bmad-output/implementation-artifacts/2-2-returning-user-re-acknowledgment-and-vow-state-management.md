# Story 2.2: Returning User Re-acknowledgment & Vow State Management

Status: review

## Story

As a returning user,
I want the Opening Vow to reappear after significant app updates,
So that theological changes or corrections to the Vow are explicitly acknowledged, not silently accepted.

## Acceptance Criteria

1. **Given** a user has previously acknowledged the Opening Vow
   **When** they relaunch the app with no version change
   **Then** the Vow screen is NOT shown — they go directly to the home screen (FR3)

2. **Given** a significant app update whose version string is added to `constants/vow.ts`'s `VOW_REQUIRED_VERSIONS` list
   **When** the returning user launches the updated app
   **Then** the Vow screen reappears with a brief note indicating the Vow has been updated; the user must re-acknowledge before accessing content (FR3)

3. **Given** the `VOW_REQUIRED_VERSIONS` list in `constants/vow.ts`
   **When** the operator adds the current app version string to it (e.g. `'1.1.0'`)
   **Then** every user whose persisted `lastVowAppVersion` does not equal the current running app version sees the Vow screen on next launch, even if they'd already acknowledged an earlier version

4. **Given** the vow acknowledgment state
   **When** inspected in `AsyncStorage` (key `arokia-prefs`)
   **Then** it stores only `vowAcknowledged: boolean` and `lastVowAppVersion: string` — no user identity, no PII (NFR-PR1)

## Tasks / Subtasks

- [x] **Create `constants/vow.ts`** (AC: 2, 3)
  - [x] `export const VOW_REQUIRED_VERSIONS: string[] = [];` — empty on creation (the current, already-acknowledged 1.0.0 vow does not require re-ack); a one-line comment explaining the operator workflow: add the exact `app.json` `expo.version` string here whenever the Vow text changes meaningfully, and every user launching that version is prompted to re-acknowledge once
  - [x] Export a pure helper `needsReVow(lastVowAppVersion: string, currentAppVersion: string): boolean` — returns `VOW_REQUIRED_VERSIONS.includes(currentAppVersion) && lastVowAppVersion !== currentAppVersion`. Keep this in `constants/vow.ts` (not inline in a component) so it's independently testable and the array/comparison logic lives in one place
  - [x] Add barrel export from `constants/index.ts` if one exists (check first — `constants/colors.ts` and `constants/theme.ts` patterns) — also added `getCurrentAppVersion()` and `isVowSatisfied()` to the same file (see Completion Notes) to avoid triplicating the version-read/comparison logic across `app/_layout.tsx`, `app/vow.tsx`, and `app/+not-found.tsx`

- [x] **Derive re-vow state in `app/_layout.tsx`** (AC: 1, 2, 3)
  - [x] Do NOT add a new persisted field. Read `vowAcknowledged` and `lastVowAppVersion` from `usePrefsStore` (already exist from Story 2.1) plus `getCurrentAppVersion()`
  - [x] Compute `vowSatisfied = isVowSatisfied(vowAcknowledged, lastVowAppVersion, currentAppVersion)` and use `!vowSatisfied` / `vowSatisfied` (instead of the bare `!vowAcknowledged` / `vowAcknowledged`) as the `Stack.Protected` guard conditions
  - [x] This is the ONLY change to the guard logic — hydration/splash-screen wiring from Story 2.1's code-review fixes is untouched

- [x] **Pass "vow was updated" context into the vow screen** (AC: 2)
  - [x] `app/vow.tsx`: computes `isUpdate = vowAcknowledged && needsReVow(lastVowAppVersion, currentAppVersion)` and passes it to `OpeningVow`
  - [x] `components/onboarding/OpeningVow.tsx`: accepts `isUpdate?: boolean` (default `false`); renders `vow.updatedNotice` conditionally below the body; existing `vow.title`/`vow.body`/`vow.cta` rendering unchanged
  - [x] `handleAcknowledge` unchanged in effect: still calls `acknowledgeVow(currentAppVersion)` then `logEvent('vow_completed')`

- [x] **Add the new i18n key** (AC: 2)
  - [x] Added `vow.updatedNotice` to `locales/ta.json`'s `vow` namespace — see Completion Notes for the flagged sign-off note
  - [x] Zero hardcoded strings — this key is the only new visible string

- [x] **Verification** (AC: all)
  - [x] `npm run format` after all file writes
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 new warnings
  - [x] Pure-function sanity check: ran all 7 representative input combinations for `needsReVow`/`isVowSatisfied` (empty array; version-in-list matching/non-matching `lastVowAppVersion`; never-acknowledged; re-vow-required; already-current) — all passed, see Debug Log
  - [ ] Simulator walkthrough — **pending desktop verification, see Dev Agent Record**

## Dev Notes

### Reconciling a planning-doc discrepancy (read this first)

`_bmad-output/planning-artifacts/epics.md` (Story 2.2's AC source) describes a numeric
`VOW_VERSION` constant and a `vowAcknowledgedVersion: number` field, implying a rename of
Story 2.1's `lastVowAppVersion`. But the master `_bmad-output/planning-artifacts/architecture.md`
(the later, authoritative technical design — see its FR-traceability table, line ~1037, and its
project-structure listing, line ~911) resolves this exact FR3 gap differently: it keeps the
already-implemented `lastVowAppVersion: string` field on `prefsStore` as-is and adds
`constants/vow.ts` holding `VOW_REQUIRED_VERSIONS: string[]` — a list of app version *strings*,
not an incrementing number. This story follows **architecture.md's mechanism** (string array +
existing field name) because (a) it's the more recent, authoritative source, (b) it requires no
rename/migration of a field Story 2.1 already shipped and is already in review, and (c) it avoids
introducing semver-comparison logic that a numeric "less than" check would otherwise need. The
acceptance criteria above are re-worded from epics.md to match this mechanism while preserving the
identical user-facing behavior the epic describes.

### Critical Architecture Requirements (MUST follow)

- **Do NOT rename `lastVowAppVersion` or `vowAcknowledged`** on `prefsStore` — see reconciliation
  note above. `store/prefsStore.ts` needs NO changes in this story.
- **`constants/vow.ts` is new** — architecture-designated location for `VOW_REQUIRED_VERSIONS`
  [Source: _bmad-output/planning-artifacts/architecture.md#L911]
- **`@/` path aliases only** — no relative imports
- **Zero hardcoded strings in JSX** — add `vow.updatedNotice` to `ta.json` before using it
- **Do not touch Story 2.1's splash-screen/hydration wiring** in `app/_layout.tsx`
  (`SplashScreen.preventAutoHideAsync()` at module load, `hideAsync()` on `_hasHydrated`, no
  `if (!hasHydrated) return null`) — those are code-review-verified fixes from Story 2.1, not this
  story's concern. The only line to change in `Layout` is the guard boolean fed to
  `Stack.Protected`.
- **`OpeningVow` stays a dumb component** — it must not read the store or compute `needsReVow`
  itself; `app/vow.tsx` computes `isUpdate` and passes it down, same separation Story 2.1 established.

### Existing Code You Are Building On (do NOT reinvent)

- `store/prefsStore.ts` (Story 2.1, currently in PR #6 review) — already has `vowAcknowledged: boolean`,
  `lastVowAppVersion: string`, `acknowledgeVow(appVersion)`, persisted via zustand `persist` +
  AsyncStorage. This story reads these fields; it does not modify the store.
- `app/_layout.tsx` — currently guards `Stack.Protected` on `!vowAcknowledged` / `vowAcknowledged`.
  Replace only the boolean expression, not the guard structure, the splash-screen handling, or the
  hydration flag.
- `app/vow.tsx` — currently calls `acknowledgeVow(Constants.expoConfig?.version ?? '1.0.0')` then
  `logEvent('vow_completed')`. Reuse the same `Constants.expoConfig?.version ?? '1.0.0'` pattern for
  reading the current app version here too, rather than introducing a second helper.
- `components/onboarding/OpeningVow.tsx` — currently renders `vow.title`, `vow.body`, `vow.cta`.
  Add the new conditional notice without restructuring the existing layout.

### Project Structure Notes

- New file: `constants/vow.ts`
- Modified files: `app/_layout.tsx` (guard boolean only), `app/vow.tsx` (compute + pass `isUpdate`),
  `components/onboarding/OpeningVow.tsx` (new optional prop + conditional text), `locales/ta.json`
  (one new key)
- No conflicts with Story 2.1: that story's file list (`store/prefsStore.ts`, `app/_layout.tsx`,
  `app/index.tsx`, `app/vow.tsx`, `app/+not-found.tsx`, `components/onboarding/*`) overlaps this
  story's touched files in `app/_layout.tsx`, `app/vow.tsx`, and `components/onboarding/OpeningVow.tsx`
  — this story is built on top of Story 2.1's code (same branch/PR in this session; see Sprint
  Tracking), so there is no merge conflict, only sequential edits to the same files.

### Testing Standards

No test suite exists yet. Verification is tsc + lint + the pure-function sanity check + simulator
walkthrough (desktop-only, see task list). Document walkthrough results in the Dev Agent Record.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2.md#Story 2.2]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2 (lines ~538-557)]
- [Source: _bmad-output/planning-artifacts/architecture.md#L911, #L1037]
- [Source: _bmad-output/planning-artifacts/prd.md#FR3]
- [Source: _bmad-output/implementation-artifacts/2-1-opening-vow-first-launch-gate.md — prefsStore/vow.tsx/OpeningVow patterns this story extends]

## Dev Agent Record

### Agent Model Used

Claude (Claude Code, cloud/mobile session)

### Debug Log References

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 1 pre-existing warning (`lib/i18n.ts:8`, known, not in scope)
- `npm run format` — clean
- `bash scripts/audit-trackers.sh` — passed
- Pure-function check (`node` scratch script, 11 assertions post-code-review-fix): empty
  `VOW_REQUIRED_VERSIONS` never triggers; exact-match on flagged version; version-skip case
  (last 1.0.0, current 1.2.0, only 1.1.0 flagged → still triggers); not-yet-reached flagged
  version; already-re-acknowledged past the flagged version; numeric (not lexical) comparison
  for double-digit segments (1.10.0 > 1.9.0); multiple flagged versions picks the latest — all
  11 passed

### Completion Notes List

- `constants/vow.ts`: added `VOW_REQUIRED_VERSIONS: string[]` (empty), `needsReVow()`, plus two
  helpers not in the original task list — `getCurrentAppVersion()` (wraps
  `Constants.expoConfig?.version ?? '1.0.0'`) and `isVowSatisfied(vowAcknowledged,
  lastVowAppVersion, currentAppVersion)`. Added these while implementing because the guard
  condition is needed identically in three places (`app/_layout.tsx`'s `Stack.Protected` guards,
  `app/vow.tsx`'s `isUpdate` calculation, and `app/+not-found.tsx`'s back-home link target) —
  colocating them in `constants/vow.ts` avoids a third copy of the same version-read +
  comparison logic drifting out of sync.
- **Fixed a bug this story would otherwise have reintroduced:** `app/+not-found.tsx` (added by
  Story 2.1's code review) originally routed its back-home link using `vowAcknowledged` alone. If
  a user had acknowledged an old vow but a re-vow was now required, that link would have pointed
  at `/` — which Story 2.2 makes reachable only when `isVowSatisfied` is true, not merely when
  `vowAcknowledged` is true — reproducing the exact dead-link bug Story 2.1's review just fixed.
  Updated it to use `isVowSatisfied` too.
- `app/_layout.tsx`: only the guard boolean changed (`vowAcknowledged` → `vowSatisfied`); Story
  2.1's splash-screen/hydration code review fixes are untouched.
- `components/onboarding/OpeningVow.tsx`: new optional `isUpdate` prop, default `false`, renders
  `vow.updatedNotice` conditionally; existing vow text/rendering unchanged when `false`.
- **Flag for Lawrence's review before merge:** `locales/ta.json`'s new `vow.updatedNotice` string
  ("இந்த வாக்குறுதி புதுப்பிக்கப்பட்டுள்ளது — மீண்டும் படித்து ஏற்றுக்கொள்ளவும்.") is procedural
  UI copy (not a change to the vow's doctrinal text), written to satisfy AC 2's "brief note"
  requirement, but wasn't reviewed by a Tamil speaker or for theological framing — same treatment
  Story 2.1 gave the vow body itself. Please review/adjust the phrasing before this ships.
- **Planning-doc discrepancy:** followed `architecture.md`'s string-array mechanism over
  `epics.md`'s numeric-version wording — see "Reconciling a planning-doc discrepancy" in Dev
  Notes above. No code changes needed to `prefsStore.ts` as a result (avoided the rename
  `epics.md` implied).

### Code Review Fixes Applied (2026-07-04)

A 5-angle multi-agent review (line-by-line, removed-behavior, cross-file, reuse/simplification/
efficiency, altitude/conventions) found 6 findings against the initial implementation:

- **`constants/vow.ts` — version-skip gap (CONFIRMED by 2 independent agents, fixed):** the
  original `needsReVow` used exact string-membership (`VOW_REQUIRED_VERSIONS.includes(currentAppVersion)`),
  so a user who updated straight past a flagged version (e.g. last seen 1.0.0, next launch already
  at 1.2.0, with only 1.1.0 flagged) would never be re-prompted — silently defeating the story's
  core purpose for exactly the users an infrequent-update cadence makes most likely to matter.
  Rewrote `needsReVow` around a small `compareVersions()` numeric comparator: re-vow now triggers
  whenever `currentAppVersion >= latest flagged version > lastVowAppVersion`, so skipping past the
  flagged version still triggers it. Re-verified with 11 pure-function cases including the
  version-skip scenario and numeric (not lexical) comparison of multi-digit segments.
- **`constants/vow.ts` — exact-string-match fragility / OTA blind spot (CONFIRMED, documented not
  fixed):** a typo'd version string, or a vow-text change shipped via EAS OTA without a native
  version bump, would silently disable re-prompting with no error signal. Both are inherent to any
  version-string approach and out of this story's AC scope (which only describes app-version-
  triggered re-vow) — logged to `deferred-work.md` rather than adding semver validation or a
  second OTA-aware signal now.
- **Reuse — triplicated selector + gating computation (PLAUSIBLE, fixed):** the
  `usePrefsStore` reads + `isVowSatisfied`/`needsReVow`/`getCurrentAppVersion` calls were
  copy-pasted across `app/_layout.tsx`, `app/vow.tsx`, and `app/+not-found.tsx` — the reviewer
  noted this is exactly the kind of drift that caused the dead-link bug below. Extracted a
  `useVowGate()` hook in `store/prefsStore.ts` returning `{ vowSatisfied, isUpdate,
  currentAppVersion }`; all three call sites now use it instead of duplicating the computation.
- **`app/vow.tsx` — "redundant" `vowAcknowledged &&` guard on `isUpdate` (PLAUSIBLE, reviewed,
  not changed):** a reviewer flagged this as possibly dead code. Verified it is NOT redundant: without
  it, a brand-new user whose very first app version happened to be listed in
  `VOW_REQUIRED_VERSIONS` would see `needsReVow('', currentVersion)` evaluate against an empty
  `lastVowAppVersion` and could incorrectly show the "vow updated" notice on their first-ever
  vow screen. Kept the guard (now inside `useVowGate()`); added a comment in `constants/vow.ts`
  explaining the empty-`lastVowAppVersion` case explicitly instead.
- **Barrel-export inconsistency (PLAUSIBLE, not fixed):** `constants/index.ts` re-exports
  `constants/vow.ts`'s functions, but all three call sites imported directly from
  `@/constants/vow`. Checked: no other file in the repo imports from the `@/constants` barrel
  either (confirmed via repo-wide grep) — CLAUDE.md's Component Barrel Pattern rule is scoped to
  `components/<feature>/`, not `constants/`, so this isn't a convention violation, just a
  pre-existing repo-wide pattern (direct imports from `constants/*` files). Left as-is; the barrel
  export itself is harmless and may be used later.

- **Pending desktop verification (cannot run in this cloud session — no simulator/device access):**
  - Fresh vow flow unaffected (Story 2.1's walkthrough still applies).
  - Re-vow flow: acknowledge → temporarily add current dev-build version string to
    `VOW_REQUIRED_VERSIONS` → relaunch → vow reappears with the `vow.updatedNotice` line visible →
    re-acknowledge → relaunch again → home shown directly. Revert the temporary array edit after
    testing (leave `VOW_REQUIRED_VERSIONS` empty on merge).
  - Visual check of the new notice text layout under `components/onboarding/OpeningVow.tsx` (not
    device-rendered in this session).

### File List

- `constants/vow.ts` (new; revised in code review — semver-style comparison)
- `constants/index.ts` (modified — barrel export)
- `store/prefsStore.ts` (modified in code review — added `useVowGate()` hook)
- `locales/ta.json` (modified — new `vow.updatedNotice` key)
- `app/_layout.tsx` (modified — guard now uses `useVowGate()`)
- `app/vow.tsx` (modified — `isUpdate`/`currentAppVersion` now from `useVowGate()`)
- `app/+not-found.tsx` (modified — back-home link now uses `useVowGate()`)
- `components/onboarding/OpeningVow.tsx` (modified — new `isUpdate` prop + conditional notice)
- `_bmad-output/implementation-artifacts/deferred-work.md` (modified — logged 2 low-severity
  review findings not fixed in this story)
