# Story 4.4: Audio Player — Sleep Timer, Speed Control & Bible Hand-off

Status: review

## Story

As a Tamil Christian user,
I want to set a sleep timer, adjust playback speed, and open the full scripture passage in an external Tamil Bible when a meditation ends,
so that the audio experience fits my real context — night-time listening, slower comprehension, and going deeper into Scripture.

## Acceptance Criteria

1. **Sleep timer** — from the full player, the user can pick 15 / 30 / 45 min; audio stops automatically at the chosen time (FR20). Selecting again toggles/replaces; picking the active value clears it.
2. **Speed** — the user can pick 0.75× / 1× / 1.25×; the change applies immediately to the current track via `TrackPlayer.setRate` (FR21) and persists in `prefsStore.playbackSpeed`.
3. **Bible hand-off** — when a track completes, a "Read the full passage" link showing the `verse_reference` appears; tapping it opens the passage in an external Tamil Bible resource via `Linking.openURL` (FR14). The app does not frame/intercept it — the user leaves Arokia.
4. **Analytics** — tapping the hand-off logs `scripture_link_opened` (with the content id).
5. **Zero hardcoded strings** — all new UI strings come from `ta.json` + `en.json` (NFR-I1).

## Tasks / Subtasks

- [x] **`audioStore` sleep timer** (AC1) — `setSleepTimer(minutes)` starts a module-scoped `setTimeout` that pauses playback and resets `sleepTimerMinutes` to 0 at expiry; clears any existing timer first; `0` cancels. Cleared on `playTrack`/`pauseAudio` reset as appropriate.
- [x] **`audioStore` speed** (AC2) — `setSpeed(speed)` calls `TrackPlayer.setRate(speed)`, sets state, and persists via `prefsStore.setPlaybackSpeed`. `playTrack` re-applies the active speed after `play()` (rate resets per track).
- [x] **`components/audio/SleepTimer.tsx`** (AC1) — 15/30/45 chips; active chip highlighted; tap active = clear.
- [x] **`components/audio/SpeedControl.tsx`** (AC2) — 0.75/1/1.25 chips; reads/writes `audioStore.speed`.
- [x] **`lib/bible.ts:buildBibleUrl(reference)`** (AC3) — builds the external Tamil Bible URL. **Default: BibleGateway Tamil ERV (`ERV-TA`)** free-text passage search — robust (no 66-book table). Single constant, flagged for Lawrence to confirm the resource/translation.
- [x] **Bible hand-off in full player** (AC3, AC4) — when `useAudioProgress` reports the track ended (position ≥ duration − 0.5 with duration > 0), show a "Read the full passage — {reference}" link; onPress → `logEvent('scripture_link_opened', id)` then `Linking.openURL(buildBibleUrl(reference))`.
- [x] **i18n** (AC5) — `audio.sleepTimer`/`speed` exist; add `audio.sleepOff`, `audio.readFullPassage`, sleep/speed option labels as needed to `ta.json` + `en.json`.
- [x] **Barrel + wire into `app/meditation/[id].tsx`.**
- [x] **Verify** — `npx tsc --noEmit` + `npm run lint` clean. Device behaviour (timer fires, rate audible, link opens) → pending device pass.

## Dev Notes

- `audioStore` already declares `speed`/`sleepTimerMinutes`/`setSpeed`/`setSleepTimer` — this story implements their real behaviour (they were state-only stubs).
- Sleep-timer id lives in a module-scoped `let`, not store state (not serialisable/renderable).
- Progress/end detection reuses `useAudioProgress` (from `lib/audio.ts`) — no direct RNTP import in components (CLAUDE.md).
- Scripture attribution: the hand-off shows `verse_reference`; the full player already renders `VerseText`.
- **OUT of scope:** offline download UI (4-5), content seeding (4-6). **Bible resource choice is a Lawrence decision** — default ERV-TA is a placeholder-quality choice, confirm before store submission (the bundled app Bible is Tamil OV; hand-off translation may differ intentionally).

### References

- [Source: epics/epic-4.md#Story 4.4] — ACs (FR20, FR21, FR14, NFR-I1).
- [Source: prd.md#FR14] — "external Tamil Bible resource."
- [Source: architecture.md#L868] — `[id].tsx` = "audio + scripture + hand-off link (FR14)".

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Winston session, 2026-07-07)

### Completion Notes List

- Implemented sleep timer (real setTimeout), live speed via `setRate` + persisted, Bible hand-off on track end with `scripture_link_opened`. Bible URL = BibleGateway `ERV-TA` (flagged for confirmation).
- tsc + lint clean. Device behaviour pending desktop/device pass.

### File List

- `store/audioStore.ts`, `lib/bible.ts` (new), `components/audio/SleepTimer.tsx` (new), `components/audio/SpeedControl.tsx` (new), `components/audio/index.ts`, `app/meditation/[id].tsx`, `locales/en.json`, `locales/ta.json`
