# Story 4.3: Audio Player — Core Playback with Background & Lockscreen Controls

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Tamil Christian user,
I want to play any meditation track with standard controls and keep listening while my screen is locked or I use other apps,
so that I can listen during my commute, while walking, or before sleep without the audio cutting out.

## Acceptance Criteria

1. **Given** the user taps Play on a track, **when** it starts from a cached local file, **then** audio begins within 500 ms (NFR-P2) and a `meditation_started` analytics event is logged once per play.
2. **Given** audio is playing, **when** the device is backgrounded or the screen is locked, **then** audio continues uninterrupted and the lockscreen Now Playing card shows the track title with play/pause/seek controls (FR16, FR17). *(RNTP capabilities + `UIBackgroundModes` already validated on device 2026-07-07 — Story 1-6.)*
3. **Given** audio is playing, **when** hardware headphone buttons or Bluetooth controls trigger play/pause, **then** the audio responds correctly (FR17). *(Handled by `Event.RemotePlay`/`RemotePause` in `lib/trackPlayerService.ts`.)*
4. **Given** audio is playing, **when** an incoming phone call connects, **then** audio pauses immediately and resumes automatically when the call ends (NFR-R2). *(Handled by `Event.RemoteDuck` in `lib/trackPlayerService.ts`; device tap-test still pending per Story 1-6.)*
5. **Given** a track is playing, **when** the user navigates between tabs, **then** a persistent `PlayerBar` mini-player remains visible above the tab bar showing title + play/pause; tapping it opens the full player screen.
6. **Given** the full player screen, **when** it is open, **then** it shows the track title, `verse_reference` attribution, a seek scrubber reflecting live position/duration, and play/pause — and seeking updates playback position.
7. **Given** active background audio on a mid-range Android device, **when** measured, **then** in-session memory footprint stays ≤150 MB (NFR-P3). *(Device-measured — deferred to the batched device pass; do not claim in-code.)*

## Tasks / Subtasks

- [ ] **Extend `audioStore` for player control** (AC: 1, 6)
  - [ ] Add `seekTo(seconds: number)` action → `TrackPlayer.seekTo(seconds)`.
  - [ ] Keep position/duration OUT of the store — read them in components via RNTP's `useProgress()` hook (avoids a 1 Hz store-write hot path; see Efficiency note). The store owns `currentTrack`/`isPlaying` only.
  - [ ] In `playTrack`, after `TrackPlayer.play()` succeeds, call `logEvent('meditation_started', content.id)` exactly once per play (not on resume).
- [ ] **Create `components/audio/PlayerControls.tsx`** (AC: 6)
  - [ ] Play/pause button (reuse `audio.play`/`audio.pause` i18n keys) + a seek scrubber.
  - [ ] Use `useProgress()` for `{ position, duration }`; render an accessible slider (`@react-native-community/slider` if already a dep, else a simple Pressable track) that calls `seekTo` on change.
  - [ ] Localized a11y labels; 48dp min touch targets (accessibility signature).
- [ ] **Create `components/audio/PlayerBar.tsx`** (AC: 5)
  - [ ] Subscribes to `audioStore` (`currentTrack`, `isPlaying`). Renders NOTHING when `currentTrack` is null.
  - [ ] Shows track title + play/pause; whole bar is a Pressable that routes to the full player (`/meditation/[id]`) for `currentTrack.id`.
  - [ ] Styled to sit above the tab bar (coral/secondary accent per design tokens).
- [ ] **Mount PlayerBar in `app/(tabs)/_layout.tsx`** (AC: 5)
  - [ ] Render `<PlayerBar />` so it persists above the `Tabs` bar across all tabs (layout-level, not per-screen).
- [ ] **Upgrade `app/meditation/[id].tsx` into the full player** (AC: 6)
  - [ ] Replace the bare play Button with `<PlayerControls />` (title + `verseReference` attribution stay).
  - [ ] Handle the "track not in `meditations`" case: currently it only searches `contentStore.meditations`. The player may be opened for a currently-playing track (e.g. a quote) not in that list — fall back to `audioStore.currentTrack` when the id matches so the player still renders.
- [ ] **i18n keys** (AC: 5, 6) — add any new `audio.*` keys (e.g. `audio.miniPlayerLabel`, `audio.seek`) to BOTH `locales/ta.json` and `locales/en.json` before wiring components. Reuse existing `audio.play`/`audio.pause`.
- [ ] **Barrel** — export `PlayerBar`, `PlayerControls` from `components/audio/index.ts`.
- [ ] **Verify** — `npx tsc --noEmit` (0 errors) + `npm run lint` (0 errors). Device checks (500 ms start, memory, lockscreen transport, call resume) → note as **pending device pass**, do not claim passed.

## Dev Notes

- **RNTP is already wired and device-validated (Story 1-6).** `app/_layout.tsx` calls `setupPlayer` + `updateOptions` with `Capability.Play/Pause/SeekTo` and `AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification`; `lib/trackPlayerService.ts` handles `RemotePlay/Pause/Stop/Seek` + `RemoteDuck` (call interruption). Do **not** re-register or re-setup the player. Components must never call `TrackPlayer` directly except the thin `seekTo` in the store — all RNTP access goes through `audioStore` / `lib/audio.ts` (CLAUDE.md invariant).
- **Playback path already exists.** `audioStore.playTrack(content)` resolves the URL via `lib/audio.ts:resolveAudioUrl` and plays. `Event.PlaybackState` in `app/_layout.tsx` syncs `isPlaying`. Story 4-3 adds the *UI surface* (PlayerBar + full player) and analytics, not new playback plumbing.
- **Efficiency:** `useProgress()` re-renders at ~1 Hz — scope it to the smallest components (`PlayerControls`, and only the scrubber inside PlayerBar if shown), never the tab layout, or every tab re-renders each second.
- **Content reality:** 0 `meditation` rows are seeded (Story 4-6). The full player at `/meditation/[id]` therefore has no meditation to open yet — but PlayerBar + playback are exercisable **now** via the Word tab's quote play-from-list (`QuoteList`), which already calls `playTrack`. Build/verify against that; meditation content lands in 4-6.
- **Attribution invariant:** the full player renders scripture context — keep `verseReference` displayed (it's non-optional on `ContentItem`).
- **Analytics:** `lib/analytics.ts:logEvent(eventType, contentId?)` already exists and writes to `analytics_events` (anon INSERT, `install_id` from SecureStore). `'meditation_started'` is a valid `AnalyticsEventType`. `meditation_completed` is NOT in this story (playback-end tracking) — leave for later.

### Scope — explicitly OUT (deferred to sibling stories)

- **Sleep timer, speed control, Bible hand-off** → Story 4-4 (`SleepTimer`, `SpeedControl`). `audioStore` already has `speed`/`sleepTimerMinutes` fields — do not build their UI here.
- **Offline download UI / manual download / progressive prefetch** → Story 4-5. `lib/audio.ts:downloadTrack`/`prefetchQueue` exist and cache-playback is validated, but the download-management UX is 4-5.
- **Lectio Divina ("Silence Between Words") route** → deferred (see `deferred-work.md`); do not build `app/lectio-divina.tsx`.

### Project Structure Notes

- New: `components/audio/PlayerBar.tsx`, `components/audio/PlayerControls.tsx` (barrel via `components/audio/index.ts`).
- Modified: `app/(tabs)/_layout.tsx` (mount PlayerBar), `app/meditation/[id].tsx` (full player), `store/audioStore.ts` (`seekTo` + `meditation_started` log), `locales/ta.json` + `locales/en.json` (new `audio.*` keys).
- Naming: PascalCase components, `@/` imports through barrels (no `../../`), NativeWind `className` with design tokens (`secondary` coral for the player accent).

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-4.md#Story 4.3] — user story + all 7 ACs (FR16/17, NFR-P2/P3, NFR-R2).
- [Source: _bmad-output/planning-artifacts/architecture.md#L468] — "Persistent Mini-Player subscribes to `audioStore`; renders `PlayerBar`".
- [Source: _bmad-output/planning-artifacts/architecture.md#L830] — audio playback maps to `app/(tabs)/walk.tsx`, `app/meditation/[id].tsx` + `audio/PlayerBar`, `PlayerControls` + `audioStore`, `lib/audio.ts`, `lib/trackPlayerService.ts`.
- [Source: _bmad-output/planning-artifacts/architecture.md#L870] — `app/(tabs)/_layout.tsx` = "persistent PlayerBar above tab bar".
- [Source: docs/SPIKE_RNTP.md] — device validation results (background/lockscreen/offline PASS; call-interruption pending).
- [Source: CLAUDE.md] — audio access only through `lib/audio.ts`/`audioStore`; zero-hardcoded-strings i18n; scripture attribution invariant; barrel imports.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Winston architect session, 2026-07-07)

### Debug Log References

- `npx tsc --noEmit` → 0 errors. `npm run lint` → 0 errors (1 pre-existing `lib/i18n.ts` warning, unrelated).

### Completion Notes List

- **Built:** `PlayerControls` (play/pause + tap-to-seek progress bar via RNTP `useProgress`), `PlayerBar` (persistent mini-player, renders null when no track, taps to full player), mounted PlayerBar above the tab bar in `app/(tabs)/_layout.tsx` via the `tabBar` prop + `BottomTabBar`. Upgraded `app/meditation/[id].tsx` into the full player (title + `verseReference` + PlayerControls; auto-plays on open; falls back to `audioStore.currentTrack` for tracks not in the meditations list). Added `audioStore.seekTo` + `meditation_started` logging (scoped to `contentType==='meditation'` so quote plays don't over-count).
- **Seek UX:** implemented as a pure-JS tap-to-seek progress bar (no `@react-native-community/slider` dependency) to avoid forcing another native rebuild. A draggable slider can be a later polish; tap-to-seek satisfies AC6.
- **AC3/AC4 (headphone/Bluetooth + call interruption):** handled entirely by the pre-existing `lib/trackPlayerService.ts` remote handlers — no new code. Call-interruption device tap-test remains the one pending item from Story 1-6.
- **Pending device pass (do NOT claim passed):** AC1 <500 ms cold start (NFR-P2), AC2 lockscreen transport buttons individually, AC7 ≤150 MB memory (NFR-P3). Testable now via the Word tab's quote play-from-list (0 meditation rows until Story 4-6).
- **Out of scope (per story):** sleep timer / speed / Bible hand-off (4-4), download-management UI (4-5), Lectio route.

### File List

- `store/audioStore.ts` (modified — `seekTo`, `meditation_started` log)
- `components/audio/PlayerControls.tsx` (new)
- `components/audio/PlayerBar.tsx` (new)
- `components/audio/index.ts` (modified — barrel)
- `app/(tabs)/_layout.tsx` (modified — PlayerBar above tab bar)
- `app/meditation/[id].tsx` (modified — full player)
- `locales/en.json`, `locales/ta.json` (modified — `audio.seek`/`miniPlayerLabel`/`noAudio`)
