# Story 4.5: Offline Content Download — Progressive Cache & Manual Download

Status: done

## Story

As a Tamil Christian user,
I want meditation audio to download automatically on first play, next tracks pre-fetched silently, and the option to manually download a week's content,
so that I can listen fully offline during my commute, in rural areas, or wherever connectivity is poor.

## Acceptance Criteria

1. **Auto-download on first play** (FR18) — when a track is played and not already cached, `downloadTrack()` saves it to `documentDirectory` and `audioStore` records the local path in its cache manifest.
2. **Silent prefetch** — after playback starts, the next 2 tracks in the current queue are pre-fetched in the background with no visible UI, and recorded in the manifest.
3. **Manual "Download This Week"** (FR19) — a control shows the estimated size before confirming, shows progress during download, and confirms offline availability on completion.
4. **Offline play** (NFR-P2) — a previously-downloaded track plays from local cache in airplane mode with no network request and no error — including after an app restart (manifest persists).
5. **Persistence** — cached files live in `documentDirectory` (survive OS restart); the manifest is persisted (AsyncStorage) so the app still knows what's cached after a restart.

## Tasks / Subtasks

- [x] **Persist the cache manifest** (AC4, AC5) — wrap `audioStore` in `persist` middleware, `partialize` to `downloadedTracks` only (AsyncStorage). Without this, offline breaks after restart (the files survive but the app forgets their paths, and re-resolving needs a network DB lookup).
- [x] **Auto-download on play** (AC1) — in `playTrack`, after playback starts, if the track isn't cached, `downloadTrack()` it in the background and `addDownload` the result. Streams immediately; caches in parallel.
- [x] **Prefetch next 2** (AC2) — `playTrack` takes an optional `queueIds` (ordered ids of the current browsing context); prefetch the next 2 after the current, recording each in the manifest. `prefetchQueue` returns the downloaded uris so the manifest stays correct.
- [x] **Manual download** (AC3) — `audioStore.downloadWeek(ids)` with a `bulkDownload {total, completed, active}` progress state; `lib/content.getDownloadableTracks()` lists all published audio tracks; `OfflineDownloadCard` shows size estimate → progress → done, placed on the walk (library) screen.
- [x] **i18n** — new `audio.*`/`offline.*` keys (ta + en).
- [x] **Verify** — tsc + lint clean. Size (NFR-P5 ≤50 MB) + true-airplane timing = pending device pass.

## Dev Notes

- `lib/audio.ts` already has `downloadTrack` (device-validated in Story 1-6) + `prefetchQueue`; `audioStore` has `downloadedTracks`/`addDownload`/`clearDownloads`. This story wires auto/prefetch/manual + **persistence**.
- Size estimate: no `size` column on `audio_assets` — estimate `count × ~3.3 MB` (64 kbps mono ~7 min). Refine when 4-6 sets real durations.
- All download/manifest logic centralised in `audioStore` (components never touch RNTP/FS directly).
- Content note: 0 meditation rows seeded (4-6) — exercisable via the voiced English quotes.

### References

- [Source: epics/epic-4.md#Story 4.5] — ACs (FR18, FR19, NFR-P2, NFR-P5).

## Dev Agent Record

### Agent Model Used
claude-opus-4-8 (Winston session, 2026-07-07)

### Completion Notes List
- Persisted cache manifest; auto-download on play; prefetch next 2 (manifest-aware); manual downloadWeek with progress + size estimate. tsc + lint clean; device size/timing pending.

### File List
- `store/audioStore.ts`, `lib/audio.ts`, `lib/content.ts`, `components/audio/OfflineDownloadCard.tsx` (new), `components/audio/index.ts`, `app/(tabs)/walk.tsx`, `components/scripture/QuoteList.tsx`, `locales/en.json`, `locales/ta.json`
