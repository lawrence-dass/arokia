# PR #6 — Simulator Walkthrough Runbook

Covers Epic 2 (Stories 2.1–2.4) + Epic 3 (Stories 3.1–3.4), including the code-review fixes on
commit `9f969eb`. Behavioral verification the cloud/mobile sessions could not run.

## Scope split

- **Search (Story 3.3)** queries the bundled Tamil OV Bible (Expo SQLite FTS, Story 1.3) — testable
  **now**.
- **Word browser / verse detail / audio (Stories 3.1, 3.2)** read `content_items` quotes — **empty
  until Story 3.4 seeds the real 50 quotes**, so those flows are blocked.

## Prerequisites

- Dev client required — `react-native-track-player`'s native module crashes Expo Go.
  ```bash
  npx expo run:ios          # simulator
  npx expo run:ios --device # physical device
  ```
- For a first-launch vow test: delete the app from the simulator first (or Device → Erase All Content
  and Settings). The vow acknowledgment persists in AsyncStorage — a stale ack hides the gate.
- If `tsc` shows phantom `RelativePathString` route errors locally, delete `.expo/types` (stale
  generated route cache) and re-run. Not a code problem.

---

## Part A — testable now

### Story 2.1 / 2.2 — Opening Vow gate

1. Fresh launch → the Opening Vow screen is the first screen; no home content behind it.
2. Attempt a back-swipe or a deep link (`arokia://`) → the app stays on the vow screen.
3. Tap `ஆமென் — தொடங்கு` → lands on home.
4. Kill and relaunch → home shows directly, no vow.
5. (2.2) Increment `VOW_VERSION` in `constants/vow.ts`, rebuild → the vow reappears with the
   "updated" notice; re-acknowledge to pass.

### Story 2.3 — About / Privacy

6. Open About → renders (placeholder copy is expected for now). The Glass-Wall Budget block either
   renders the markdown or shows the graceful fallback message.
7. Tap the Privacy Policy link → opens in-app (not a browser).

### Story 2.4 — Concern form

8. Open the concern form → type a malformed email (`foo@`) → inline error appears, submit disabled.
9. Enter a valid email + a description → submit. Requires Supabase reachable; a row should land in
   `theological_concerns` with `status = 'open'`.

### Story 3.3 — Search (primary target of the review fixes)

10. Open search. Type a Tamil word slowly → debounced; shows `தேடுகிறது...` then results. The
    "no matches" empty state must NOT flash mid-type.
11. Type two Tamil words that both occur in one verse but are NOT adjacent → the verse still matches
    (per-term AND fix).
12. Type a query containing `%` or `_` → no wildcard blow-up, no crash.
13. A result card shows verse text + reference. Tapping it does nothing — display-only by design
    (search results are raw scripture verses, not curated quotes).

---

## Part B — blocked until Story 3.4 seeds real content

- Word browser list (empty now).
- Verse detail deep-link resolve (fix #1) — needs a seeded quote uuid: deep link
  `arokia://verse/<uuid>` on a cold start should show the verse, not "not found".
- Play → pause → play resumes from position, does NOT restart from 0:00 (fix #4) — needs a quote with
  `audioAssetId` + real audio asset.

---

## Recording

Log pass/fail per story in each story's **Dev Agent Record** section. Merge PR #6 only after Part A
passes and Story 3.4's real content lands (which unblocks Part B).
