# Story 1.6: react-native-track-player Background Audio Spike

Status: ready-for-dev

## Story

As a developer,
I want to validate that `react-native-track-player` plays audio with the screen locked and handles phone-call interruptions on physical iOS and Android devices,
So that the managed-vs-bare Expo workflow decision is resolved before any app screen is written — this is the single highest-risk architectural gate.

## Acceptance Criteria

1. **Given** `react-native-track-player` v4+ installed and a test `.m4a` track
   **When** the track plays and the iOS 16+ physical device screen is locked
   **Then** the lockscreen Now Playing card is visible with functional play/pause/seek controls; audio continues uninterrupted

2. **Given** the same test
   **When** run on a physical Android 11+ device
   **Then** lockscreen media controls are functional; audio continues while backgrounded

3. **Given** audio is playing on either platform
   **When** an incoming phone call is received
   **Then** audio pauses immediately on call start and resumes automatically when the call ends (NFR-R2)

4. **Given** Expo managed workflow is confirmed working
   **When** this story is completed
   **Then** `docs/SPIKE_RNTP.md` is committed documenting: platform tested, OS version, RNTP version, and "MANAGED_WORKFLOW: VALIDATED"

5. **Given** bare workflow is required instead
   **When** this is determined
   **Then** `expo prebuild` is run and the project is ejected BEFORE this story is marked complete; `docs/SPIKE_RNTP.md` documents the reason; CI is updated for bare workflow

6. **Given** this story
   **When** marked complete
   **Then** physical-device validation on BOTH platforms has passed — simulator validation alone is insufficient

## Tasks / Subtasks

- [x] **Install packages** (AC: 1, 2)
  - [x] `npm install react-native-track-player` — installed v4.1.2
  - [x] `npx expo install expo-file-system` — installed v19.0.23 (SDK-matched)
  - [x] Confirm no peer-dep conflicts: `npm ls react-native-track-player expo-file-system`

- [x] **Wire RNTP plugin into `app.json`** (AC: 1, 2)
  - [x] Add `"react-native-track-player"` to the `plugins` array (after `"@sentry/react-native"`)
  - [x] This plugin auto-injects: iOS `UIBackgroundModes: ["audio"]` and Android `FOREGROUND_SERVICE` + `WAKE_LOCK` permissions — no manual `Info.plist` or `AndroidManifest.xml` edits needed

- [x] **Create `lib/trackPlayerService.ts`** (AC: 1, 2, 3)
  - [x] Export default `async function PlaybackService()` handling: `Event.RemotePlay`, `Event.RemotePause`, `Event.RemoteStop`, `Event.RemoteSeek`, `Event.RemoteDuck` (phone calls — NFR-R2)
  - [x] `RemoteDuck` logic: `permanent` → stop, `paused` → pause, neither → resume/play
  - [x] CRITICAL: do NOT import or call `useAudioStore` here — headless task runs outside React, hooks are unavailable; call RNTP methods directly only
  - [x] CRITICAL: export as `module.exports = ...` not ES6 `export default` — RNTP `registerPlaybackService` requires CommonJS module reference via `require()`

- [x] **Update `app/_layout.tsx`** (AC: 1, 2, 3)
  - [x] Add `import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player'`
  - [x] Call `TrackPlayer.registerPlaybackService(() => require('@/lib/trackPlayerService'))` at module scope (before the Layout function) — registration must happen at module load time, not inside a hook
  - [x] Add `useEffect(() => { setupRNTP(); }, [])` inside the Layout component calling an async `setupRNTP()` function
  - [x] `setupRNTP()`: `await TrackPlayer.setupPlayer()` then `await TrackPlayer.updateOptions(...)` with `progressUpdateEventInterval: 2` (NOT `progressUpdateEventThrottle` — TS type confirmed correct key)
  - [x] Wrap in try/catch; log warning on failure — `setupPlayer()` throws if called twice; guarded with module-level `rnptSetupDone` flag
  - [x] Import order: `'@/lib/i18n'` is line 1 (architectural invariant maintained); RNTP import after Sentry

- [x] **Implement `downloadTrack()` in `lib/audio.ts`** (AC: Story 1.7 offline spike depends on this)
  - [x] Import `{ File, Paths }` from `'expo-file-system'` (v2 API — not legacy `documentDirectory`/`downloadAsync`)
  - [x] Look up `audio_assets` by `content_item_id` to get `storage_path`
  - [x] Build local cache file: `new File(Paths.document, storage_path.replace(/\//g, '_'))`
  - [x] Check cache first with `cachedFile.exists` — return `cachedFile.uri` immediately if cached
  - [x] Download with `File.downloadFileAsync(url, cachedFile)` — returns the downloaded `File`
  - [x] Return `downloaded.uri` (used by RNTP as the `url` field when cached)

- [x] **Implement `prefetchQueue()` in `lib/audio.ts`** (AC: Story 1.7 offline spike depends on this)
  - [x] Iterate over `contentItemIds`, call `downloadTrack()` for each
  - [x] `try/catch` each download individually — one failure must not abort the rest
  - [x] `Sentry.captureException(e)` + `console.warn(...)` on failure

- [x] **Update `store/audioStore.ts`** — wire actions to RNTP (AC: 1, 2)
  - [x] Import `TrackPlayer` from `'react-native-track-player'`
  - [x] Import `{ resolveAudioUrl }` from `'@/lib/audio'`
  - [x] `playTrack`: checks `downloadedTracks` for cached URI first, falls back to `resolveAudioUrl`; calls `TrackPlayer.reset()`, `TrackPlayer.add(...)`, `TrackPlayer.play()`, then `set(...)`
  - [x] `pauseAudio`: calls `TrackPlayer.pause()` then `set({ isPlaying: false })`
  - [x] `resumeAudio`: calls `TrackPlayer.play()` then `set({ isPlaying: true })` (guards on `currentTrack != null`)
  - [x] All three actions are `async` — `AudioState` interface signatures updated accordingly
  - [x] All RNTP calls wrapped in try/catch with `Sentry.captureException` + `console.error`

- [x] **Create `docs/SPIKE_RNTP.md`** (AC: 4 or 5)
  - [x] Created with template; Lawrence fills in device results after physical testing
  - [x] Template includes: RNTP version, workflow decision, iOS test (device/OS/lockscreen/call interruption), Android test (same), final verdict

- [ ] **Build dev client and test on physical devices** (AC: 1, 2, 3, 6)
  - [ ] RNTP is a native module — Expo Go will NOT work after installation; must use dev client
  - [ ] Build dev client: `eas build --profile development --platform ios` (or Android)
  - [ ] Alternatively for local Xcode build: `npx expo run:ios` (requires Xcode)
  - [ ] Test checklist: lock screen → Now Playing card visible; play/pause from lockscreen; call interruption → pause → resume
  - [ ] Both iOS 16+ AND Android 11+ physical devices required (AC: 6 is explicit — no simulator-only completion)
  - [ ] Fill in `docs/SPIKE_RNTP.md` with real device results

- [x] **Type-check and lint** (AC: all)
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 errors (1 pre-existing warning in `lib/i18n.ts`, unchanged)

## Dev Notes

### Critical: Import Order in `app/_layout.tsx`

The architectural invariant: `import '@/lib/i18n'` must be line 1. After Story 1.5, the import order is:
```
1: import '@/lib/i18n';
2: import * as Sentry from '@sentry/react-native';
3: import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';
4: import '../global.css';
...rest
```

Do NOT hoist RNTP above i18n or Sentry.

### Critical: `lib/trackPlayerService.ts` Must Use CommonJS Export

RNTP's `registerPlaybackService` receives a factory function that returns the module via `require()`. The service file MUST use `module.exports = async function() { ... }`, NOT `export default`. If you use ES6 export, the headless task will fail silently on Android.

```typescript
// lib/trackPlayerService.ts
import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position));
  TrackPlayer.addEventListener(Event.RemoteDuck, async ({ paused, permanent }) => {
    if (permanent) {
      await TrackPlayer.stop();
    } else if (paused) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  });
};
```

### Critical: No React Hooks in `trackPlayerService.ts`

The headless task runs in a background thread outside the React tree. `useAudioStore`, `useState`, `useEffect` — all forbidden here. Only plain RNTP method calls.

### `setupPlayer()` Double-Call Guard

`TrackPlayer.setupPlayer()` throws if called twice in the same process. Guard it:
```typescript
// app/_layout.tsx (module level, before Layout function)
let rnptSetupDone = false;

// Inside useEffect:
async function setupRNTP() {
  if (rnptSetupDone) return;
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({ ... });
    rnptSetupDone = true;
  } catch (e) {
    console.warn('[RNTP] setup failed:', e);
  }
}
```

### `audioStore.ts` — Async Actions Pattern

The current store uses synchronous actions. RNTP calls are async. Pattern:
```typescript
// AudioState interface — update signatures:
playTrack: (content: ContentItem) => Promise<void>;
pauseAudio: () => Promise<void>;
resumeAudio: () => Promise<void>;

// Implementation:
playTrack: async (content) => {
  if (!content.audioAssetId) return;
  try {
    const url = await resolveAudioUrl(content.audioAssetId);
    await TrackPlayer.reset();
    await TrackPlayer.add({ id: content.id, url, title: content.title, artist: 'Arokia' });
    await TrackPlayer.play();
    set({ currentTrack: content, isPlaying: true });
  } catch (e) {
    Sentry.captureException(e);
    console.error('[audioStore] playTrack failed:', e);
  }
},
```

### `downloadTrack()` — Exact Implementation

```typescript
import * as FileSystem from 'expo-file-system';

export async function downloadTrack(contentItemId: string): Promise<string> {
  const { data, error } = await supabase
    .from('audio_assets')
    .select('storage_path')
    .eq('content_item_id', contentItemId)
    .single();
  if (error) throw error;
  if (!data?.storage_path) throw new Error(`no audio asset for: ${contentItemId}`);

  const { data: urlData } = supabase.storage.from('audio').getPublicUrl(data.storage_path);
  const localPath = (FileSystem.documentDirectory ?? '') + data.storage_path.replace(/\//g, '_');

  const info = await FileSystem.getInfoAsync(localPath);
  if (info.exists) return localPath;

  const result = await FileSystem.downloadAsync(urlData.publicUrl, localPath);
  if (result.status !== 200) throw new Error(`download failed with status ${result.status}`);
  return result.uri;
}
```

### `app.json` Plugin Addition

```json
"plugins": [
  "expo-router",
  "expo-localization",
  "expo-sqlite",
  "@sentry/react-native",
  "react-native-track-player"
]
```

The RNTP plugin automatically handles:
- iOS: `UIBackgroundModes: ["audio"]` in `Info.plist`
- Android: `FOREGROUND_SERVICE` (type `mediaPlayback`) + `WAKE_LOCK` in `AndroidManifest.xml`

No manual permission entries needed.

### Why Expo Go Won't Work After This Story

RNTP is a native module with Objective-C / Java code. Expo Go only supports managed Expo SDK modules. After `npm install react-native-track-player`, you MUST use either:
- **EAS dev client**: `eas build --profile development` (preferred — same binary as preview/production)
- **Local Xcode build**: `npx expo run:ios` (requires Xcode on Mac)
- **Local Android build**: `npx expo run:android` (requires Android Studio)

This is expected. The `eas.json` `development` profile already has `developmentClient: true` from Story 1.5 precisely because Story 1.6 was anticipated to require this.

### Physical Device Requirement (Non-Negotiable)

**iOS Simulator limitation**: The iOS Simulator does not simulate lockscreen audio controls. The Now Playing card will NOT appear in the Simulator. Do not mark AC:1 complete from Simulator testing.

**Android Emulator limitation**: Android Emulator cannot reliably test phone call interruption. Do not mark AC:3 complete from Emulator testing.

Physical devices for both platforms are required before the story can be marked `done`.

### `docs/SPIKE_RNTP.md` Template

```markdown
# RNTP Spike Validation

**RNTP Version:** react-native-track-player@X.X.X
**Workflow Decision:** MANAGED_WORKFLOW: VALIDATED | BARE_WORKFLOW_REQUIRED: [reason]

## iOS Validation
- Device: [model, e.g. iPhone 15 Pro]
- OS: [e.g. iOS 17.4]
- Lockscreen Now Playing card: PASS / FAIL
- Play/pause from lockscreen: PASS / FAIL
- Phone call interruption (pause on call, resume after): PASS / FAIL

## Android Validation
- Device: [model, e.g. Pixel 7]
- OS: [e.g. Android 14]
- Lockscreen media controls: PASS / FAIL
- Play/pause from lockscreen: PASS / FAIL
- Phone call interruption (pause on call, resume after): PASS / FAIL

## Overall Result

[PASS — Story 1.6 complete | FAIL — see notes below]

## Notes
[Any deviations, workarounds, or findings for Story 1.7]
```

### Architecture Boundary: Where RNTP Lives

Per architecture spec (`project-structure.md`):
```
App ↔ RNTP boundary: lib/trackPlayerService.ts, store/audioStore.ts
```

RNTP must NEVER be imported in:
- `app/` route files
- `components/` files
- Any file other than `lib/trackPlayerService.ts`, `store/audioStore.ts`, and `app/_layout.tsx` (setup only)

### What This Story Does NOT Do

- No UI components for audio player (that's Epic 4 — Story 4.3)
- No sleep timer integration into RNTP (Story 4.4)
- No speed control (Story 4.4)
- No offline cache validation (Story 1.7 SPIKE-4)
- No `prefsStore.playbackSpeed` sync (Story 4.4)
- `downloadTrack()` and `prefetchQueue()` are implemented here but their full offline flow is validated in Story 1.7

### Previous Story Learnings (Stories 1.4 & 1.5)

- **Write/Edit tools now work** — no node-heredoc workaround needed
- **`bash <script>` execution is blocked in don't-ask mode** — use `npm`, `npx`, `chmod`, `grep`, `ls` instead; never `bash scripts/...`
- **Always null-guard Supabase data returns** — `data` is `T | null` from `.single()`; check `data?.storage_path` before use
- **Zustand async actions need `get` in factory** — already done in existing store; maintain that pattern for new async actions
- **`npm run format` after any file writes** — keeps Prettier/ESLint clean
- **Pre-existing ESLint warning in `lib/i18n.ts`** — do not flag in code reviews

### TypeScript Notes

- `TrackPlayer.add()` `url` field accepts both remote URLs and local `file://` URIs (from `FileSystem.documentDirectory`)
- `FileSystem.documentDirectory` is `string | null` — null-guard it: `(FileSystem.documentDirectory ?? '')`
- `Event.RemoteDuck` payload: `{ paused: boolean, permanent: boolean, duck: boolean }` — `duck` is for temporary volume reduction (e.g., notifications); handle `paused` and `permanent` only for call interruption
- `TrackPlayer.updateOptions()` has changed shape across v3→v4 — use `Capability` enum not string literals; `compactCapabilities` is separate from `capabilities`

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-1.md#Story 1.6]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure.md#Architectural Boundaries]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure.md#Key Data Flows]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns.md#10 Mandatory Enforcement Rules]
- [Source: _bmad-output/planning-artifacts/architecture/infrastructure.md#Device Permissions]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (claude-sonnet-4-6)

### Debug Log References

None

### Completion Notes List

Resume: Task 9 — physical device testing. Lawrence must build the dev client (`eas build --profile development --platform ios` or `npx expo run:ios`), install on a physical iOS 16+ device, test lockscreen Now Playing card + play/pause/seek + phone call interruption, repeat on Android 11+, fill in `docs/SPIKE_RNTP.md`, then run `/bmad-dev-story` to check off task 9 and advance the story to `review`.
Uncommitted: app.json, app/_layout.tsx, lib/audio.ts, lib/trackPlayerService.ts (new), store/audioStore.ts, docs/SPIKE_RNTP.md (new), package.json, package-lock.json, sprint-status.yaml, 1-6-*.md
Session: All code complete and clean (0 TS errors, 0 lint errors); story HALTED at task 9 pending physical device validation on both iOS and Android.

All code tasks complete. Implemented:
- `npm install react-native-track-player@4.1.2` + `npx expo install expo-file-system@19.0.23`
- `app.json`: added `"react-native-track-player"` to plugins array (handles iOS UIBackgroundModes + Android permissions automatically)
- `lib/trackPlayerService.ts`: headless RNTP service using `module.exports` (CommonJS required); handles RemotePlay, RemotePause, RemoteStop, RemoteSeek, RemoteDuck (NFR-R2 phone call interruption)
- `app/_layout.tsx`: `registerPlaybackService` at module scope; `setupPlayer` + `updateOptions` in `useEffect` with double-call guard (`rnptSetupDone` flag); `eslint-disable` comment for mandatory `require()` call
- `lib/audio.ts`: rewrote `downloadTrack()` using expo-file-system v2 API (`File`, `Paths` — not deprecated `documentDirectory`/`downloadAsync`); `prefetchQueue()` with per-item error isolation
- `store/audioStore.ts`: `playTrack`, `pauseAudio`, `resumeAudio` are now `async`; all call RNTP; `playTrack` checks local `downloadedTracks` cache before resolving remote URL; all wrapped in try/catch with Sentry
- `docs/SPIKE_RNTP.md`: template created for Lawrence to fill in after physical device testing
- `npx tsc --noEmit`: 0 errors; `npm run lint`: 0 errors, 1 pre-existing warning in lib/i18n.ts

**HALT: Task 9 (physical device testing) requires Lawrence to build the dev client and test on real iOS 16+ and Android 11+ devices. Code is complete; the story cannot be marked `done` until `docs/SPIKE_RNTP.md` is filled in and both platforms pass.**

Key discoveries:
- `expo-file-system@19` ships a new v2 API — `documentDirectory` and `downloadAsync` are deprecated and throw at runtime; must use `File`, `Paths`, `File.downloadFileAsync()`
- RNTP `updateOptions` correct key is `progressUpdateEventInterval` (not `progressUpdateEventThrottle`)
- `registerPlaybackService` requires `require()` (CommonJS) — suppressed with targeted eslint-disable

### File List

**Created:**
- lib/trackPlayerService.ts
- docs/SPIKE_RNTP.md

**Modified:**
- lib/audio.ts — implemented downloadTrack() and prefetchQueue() with expo-file-system v2 API
- store/audioStore.ts — wired playTrack/pauseAudio/resumeAudio to RNTP; actions now async
- app/_layout.tsx — added RNTP import, registerPlaybackService, setupPlayer useEffect
- app.json — added react-native-track-player plugin
- package.json — react-native-track-player@4.1.2 + expo-file-system@19.0.23 added
- package-lock.json — updated by npm install

### Change Log

- 2026-06-14: Story 1.6 created — react-native-track-player background audio spike
- 2026-06-14: All code tasks implemented (tasks 1–8, 10); story HALTED at task 9 pending physical device testing by Lawrence
