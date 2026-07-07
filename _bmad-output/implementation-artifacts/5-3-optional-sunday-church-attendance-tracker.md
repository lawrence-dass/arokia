# Story 5.3: Optional Sunday Church Attendance Tracker

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Tamil Christian user,
I want to optionally mark that I attended worship on a given Sunday, with no streak counter, score, or gamification attached,
so that my Sunday attendance is a private act of devotion — not a metric I am being pushed to optimize.

## Acceptance Criteria

1. **Calendar of Sundays (FR35).** A tracker screen is reachable from the home screen. When opened it shows the Sundays of the current month; Sundays already marked as attended carry a soft visual indicator.
2. **Quiet local marking.** Tapping a Sunday toggles attendance for that date. The date is stored locally (AsyncStorage via `prefsStore`) with no server sync and no account. No streak count, no score, and no congratulatory/gamification message is shown at any point.
3. **No engagement mechanics (FR35).** The tracker contains no streak counter, no "You attended X weeks in a row!" message, no reminder notification, no badge. Marking is recorded silently.
4. **No PII persisted (NFR-PR1).** Persisted attendance data contains only Sunday dates in `YYYY-MM-DD` form — no user identity, no device ID, no other PII. A marked date is itself the "attended" record; unmarking removes it.
5. **Gentle empty state.** With no history, the tracker still shows the current month's Sundays with no empty-state pressure, guilt copy, or call-to-action nudging — it reads as an invitation, not an obligation.
6. **Zero-hardcoded-strings + type safety.** All visible copy comes from a new `worship` namespace in `locales/ta.json` (no literal Tamil/English in JSX). `npx tsc --noEmit` and `npm run lint` pass with zero errors.

## Tasks / Subtasks

- [x] **Task 1 — Extend `prefsStore` with Sunday-attendance state (AC: 2, 4)**
  - [x] Add `sundayAttendance: string[]` to `PrefsState` — an array of attended Sunday dates in `YYYY-MM-DD` local form. Initialize to `[]`.
  - [x] Add action `toggleSundayAttendance(date: string): void` — if `date` is present, remove it; else append it. Keep the array sorted-insert or sort on write is optional (order does not matter for lookup).
  - [x] Add `date` to `partialize` so `sundayAttendance` persists across launches. Do NOT expose or compute any streak/count/aggregate anywhere in the store.
  - [x] Follow the existing `(set) => ({...})` factory style already in `prefsStore.ts`; no `get()` needed (toggle can read prior array inside `set((state) => ...)`).

- [x] **Task 2 — Date helpers for "Sundays of a month" and local ISO formatting (AC: 1, 4)**
  - [x] Create a small pure helper (co-locate in the component file or `lib/worship.ts` — see Dev Notes) exposing: `getSundaysOfMonth(year: number, monthIndex0: number): Date[]` and `toLocalISODate(d: Date): string` returning `YYYY-MM-DD` built from **local** date parts (not `toISOString()` — see Dev Notes pitfall).
  - [x] `getSundaysOfMonth` returns every date in that month whose `getDay() === 0`.

- [x] **Task 3 — `SundayTracker` component (AC: 1, 3, 5)**
  - [x] Create `components/worship/SundayTracker.tsx` and a barrel `components/worship/index.ts` (`export { SundayTracker } from './SundayTracker';`).
  - [x] Render the current month's label and a column/grid of that month's Sundays. Each Sunday is a `Pressable` showing the day-of-month; a marked Sunday shows a soft teal (`tertiary`/`tertiaryLight`) indicator (filled circle / check), an unmarked one is plain.
  - [x] On press call `toggleSundayAttendance(toLocalISODate(sunday))`. Selector-subscribe to `sundayAttendance` so the indicator updates immediately.
  - [x] No streak/count text. Empty state = the plain month of Sundays with a gentle one-line invitation from i18n (Task 5), never guilt/CTA copy.
  - [x] Add `accessibilityRole="button"` and a localized `accessibilityLabel`/`accessibilityState={{ selected }}` per Sunday.

- [x] **Task 4 — Tracker screen + home entry point (AC: 1)**
  - [x] Create pushed route `app/worship.tsx` mirroring `app/about.tsx`: `<SafeScreen scroll back contentContainerClassName="gap-6 px-6 pb-10 pt-4">` with a title `Text` (from `worship.title`) and `<SundayTracker />`.
  - [x] Add a `Link href="/worship"` entry on `app/(tabs)/index.tsx`, following the existing `/about` `Link` pattern (label from `worship.linkLabel`).

- [x] **Task 5 — i18n `worship` namespace (AC: 6)**
  - [x] Add a `worship` namespace to `locales/ta.json` with keys: `title`, `invitation` (gentle one-liner), `linkLabel` (home entry), `markedA11y` / `unmarkedA11y` (accessibility labels), and month/day labels as needed (see Dev Notes for month-name strategy). Provide Tamil values; flag for Lawrence's copy review (do not alter existing Tamil phrasing).

- [x] **Task 6 — Verify (AC: 6)**
  - [x] `npx tsc --noEmit` → 0 errors. `npm run lint` → clean (only 2 pre-existing warnings, documented in project-context.md). Prettier passes.
  - [x] Date logic unit-verified via node (Jul/Feb/Mar 2026, incl. "1st-is-Sunday" edge). Device/simulator behavioural check (toggle persists across relaunch, no streak UI) is **pending desktop verification** — JS-only change, so a Metro reload (`r`) suffices, NO device rebuild.

## Dev Notes

### Architecture & conventions (must follow)
- **State:** `prefsStore` (`store/prefsStore.ts`) is the correct home — it already persists to AsyncStorage via `zustand/middleware` `persist` + `partialize`. Do **not** create a new store or call AsyncStorage directly; extend the existing one. [Source: CLAUDE.md#State-Management; store/prefsStore.ts]
- **Styling:** NativeWind `className` with design tokens only. Soft "marked" indicator → teal path (`tertiary` `#A8C8C4` / `tertiaryLight` `#C8E0DC`) — teal is the Soul/stillness/rest path, the natural fit for Sabbath worship. [Source: constants/colors.ts; CLAUDE.md#Styling]
- **Screen shell:** Every screen wraps `SafeScreen`. For a pushed (non-tab) screen use `<SafeScreen back .../>` — it renders the back chevron and owns safe-area insets (root Stack has `headerShown:false`). Copy the `app/about.tsx` structure verbatim as the pattern. [Source: components/shared/SafeScreen.tsx; app/about.tsx]
- **Barrel pattern:** New feature dir `components/worship/` exports through `index.ts`; import as `@/components/worship`. Use `@/` alias, never relative `../..`. [Source: CLAUDE.md#Component-Barrel-Pattern, #Path-Alias]
- **i18n invariant:** Zero hardcoded strings. Add the `worship` namespace to `ta.json` **before** wiring the component. Existing namespaces: `common, vow, home, audio, offline, donation, about, privacy, concern, errors, word, walk, category, search, spikes`. [Source: CLAUDE.md#i18n; locales/ta.json]

### Critical decisions (do not deviate)
- **No analytics event.** Unlike share (`share_triggered`) and playback (`meditation_started`), attendance is a *private act of devotion*. Do **not** call `logEvent` and do **not** add an `AnalyticsEventType`. Recording it — even anonymously server-side — cuts against FR35's "recorded quietly" intent. This omission is deliberate, not a miss. [Source: epic-5.md#Story-5.3; lib/analytics.ts]
- **No streak, no notification, no badge, no congratulatory copy — anywhere.** This is the whole point of the story. The store must not expose a count/streak selector, and the UI must not derive one. [Source: epic-5.md#Story-5.3 AC 3]
- **Persisted shape = array of `YYYY-MM-DD` strings.** The epic AC describes entries as `{ date, attended: true }`; a stored ISO-date string *is* an attended-true record (its presence means attended; unmark removes it), which satisfies AC 4's intent — "only dates, no identity, no PII" — with the minimal shape. Keeping a redundant `attended: true` boolean adds nothing since only attended dates are ever stored. If you prefer object entries to mirror the AC literally, `{ date: string }[]` is acceptable, but `string[]` is the recommended, simplest, PII-free shape. Do **not** add any identity/device field. [Source: epic-5.md#Story-5.3 AC 4; NFR-PR1]

### ⚠️ Date pitfall (get this right)
Build `YYYY-MM-DD` from **local** parts, never `date.toISOString().slice(0,10)`. Target users are in IST (UTC+5:30); `toISOString()` converts to UTC and can shift the calendar day (e.g. a Sunday selected in the early morning IST serializes to the previous Saturday in UTC), corrupting which day is marked. Use:
```ts
const toLocalISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
```
Compare marked state with `sundayAttendance.includes(toLocalISODate(sunday))`.

### Month-name strategy
`ta.json` is Tamil-only in MVP. Simplest robust approach: store an array of 12 Tamil month names under `worship.months` and index by `getMonth()`, plus a `worship.title`/`invitation`. Avoid `Intl.DateTimeFormat` locale month names — RN Hermes `Intl` month-name coverage for `ta` is unreliable across devices. Day-of-month numbers (1–31) can render as plain digits.

### Scope guardrails
- Current-month only per AC. Prev/next-month navigation is **out of scope** (nice-to-have) — do not add it unless trivial and still copy-free of any streak framing.
- No new npm dependency and **no native module** — this keeps the story a Metro-reload change (contrast 5-1/5-2 which needed a device rebuild). Build the calendar with plain `View`/`Pressable`; do not pull in `react-native-calendars`.

### Testing standards
No automated test suite exists yet (Story 1.5 set up CI type/lint gates; unit tests are a later Epic-1 story). Verification = `tsc --noEmit` + `npm run lint` clean, plus manual toggle/persist check on simulator (JS-only → `r` reload, no rebuild). Record any un-run device checks as "pending desktop verification" — do not claim they passed. [Source: CLAUDE.md#Commands; Unattended session policy]

### Project Structure Notes
- New files: `app/worship.tsx`, `components/worship/SundayTracker.tsx`, `components/worship/index.ts`; optional `lib/worship.ts` for date helpers (or co-locate in the component if small).
- Edited files: `store/prefsStore.ts` (add state+action+partialize), `app/(tabs)/index.tsx` (add `Link`), `locales/ta.json` (add `worship` namespace).
- Naming aligns with existing feature dirs (`components/audio|home|scripture|shared|donation|onboarding`). No conflicts detected.

### References
- [Source: _bmad-output/planning-artifacts/epics/epic-5.md#Story-5.3] — full BDD acceptance criteria (FR35, NFR-PR1)
- [Source: store/prefsStore.ts] — persist/partialize pattern to extend
- [Source: app/about.tsx] — pushed-screen (`SafeScreen back`) + home `Link` pattern to mirror
- [Source: app/(tabs)/index.tsx] — home entry-point pattern
- [Source: components/shared/SafeScreen.tsx] — screen shell props
- [Source: constants/colors.ts] — `tertiary` teal token for the marked indicator
- [Source: lib/analytics.ts] — the event API we deliberately do NOT call here
- [Source: _bmad-output/project-context.md] — Write/Edit tools work; run `npm run format` after writes; import RNTP/progress only via service layer (not relevant here but part of house rules)

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Claude Code, bmad-dev-story)

### Debug Log References

- `npx tsc --noEmit` → 0 errors.
- `npm run lint` → 0 errors, 2 pre-existing warnings (`lib/i18n.ts` import/no-named-as-default-member — documented pre-existing in project-context.md; `.expo/types/router.d.ts` generated file). Prettier: all files pass.
- Node verification of `getSundaysOfMonth`: Jul 2026 → 05/12/19/26; Feb 2026 & Mar 2026 (1st is a Sunday) handled; every returned date has `getDay() === 0`.

### Completion Notes List

- **Store:** Added `sundayAttendance: string[]` + `toggleSundayAttendance` to `prefsStore`, included in `partialize` so it persists via existing AsyncStorage `persist`. Presence of a date = attended; toggle removes on re-tap. No streak/count/aggregate is derived or exposed anywhere (FR35). Only local ISO date strings stored — no identity/PII (NFR-PR1).
- **Date safety:** `lib/worship.ts` formats ISO from **local** parts (not `toISOString()`) to avoid the IST/UTC off-by-one that would mark the wrong Sunday.
- **UI:** `SundayTracker` renders the current month's Sundays as tappable circular chips; marked = soft teal (`tertiary`, the Soul/rest path), unmarked = plain surface. Gentle one-line invitation, no guilt/CTA/empty-state pressure. Localized a11y label + `accessibilityState.selected` per Sunday.
- **Entry:** New pushed route `app/worship.tsx` (SafeScreen `back`), reached via a `Link` on the home tab mirroring the `/about` pattern.
- **Deliberate decision (kept as specified):** No analytics `logEvent` for attendance — private act of devotion; recording it (even anonymously) cuts against FR35's "recorded quietly" intent.
- **Scope:** Current-month only per AC; prev/next-month navigation intentionally omitted. No new dependency, no native module → Metro-reload change, unlike 5-1/5-2.
- **Pending desktop verification:** on-device toggle-persists-across-relaunch check (cannot run in this session). No native rebuild needed.
- **For Lawrence:** the new `worship` Tamil copy (title/invitation/link/a11y/month names) is best-effort — please review phrasing before store submission.

### File List

- `store/prefsStore.ts` (modified) — Sunday-attendance state, action, partialize
- `lib/worship.ts` (new) — `getSundaysOfMonth`, `toLocalISODate` helpers
- `components/worship/SundayTracker.tsx` (new) — tracker component
- `components/worship/index.ts` (new) — barrel
- `app/worship.tsx` (new) — pushed tracker screen
- `app/(tabs)/index.tsx` (modified) — home entry `Link`
- `locales/ta.json` (modified) — `worship` namespace (Tamil)
- `locales/en.json` (modified) — `worship` namespace (English) — added in code review

### Change Log

- 2026-07-07 — Implemented Story 5.3 (optional Sunday church attendance tracker). All 6 tasks complete; tsc + lint clean. Status → review.
- 2026-07-07 — Code review (1 confirmed finding, fixed): `worship` namespace was missing from `en.json`, so the tracker rendered in Tamil on English-locale devices via `fallbackLng:'ta'`. Added English `worship` translations. tsc + prettier clean.
