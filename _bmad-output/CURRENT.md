# Handover — 2026-07-07 | Claude (Winston session)

## Next task (start here)
**Story 4-5 — Offline Content Download: Progressive Cache & Manual Download.** Next in sprint order,
unblocked. `lib/audio.ts` already has `downloadTrack` (device-validated) + `prefetchQueue`; `audioStore`
has `downloadedTracks`/`addDownload`/`clearDownloads`. Build: auto-download on first play, silent
prefetch of the next tracks, a manual "download this week" action, and download/offline-availability UI.
Read the epic AC fresh: `_bmad-output/planning-artifacts/epics/epic-4.md` (Story 4.5, ~line 133).
Note: 0 meditation rows seeded (4-6) — exercisable via the voiced English quotes.

## Project state (all on `main`)
- **Done:** Epic 1 (1.1–1.6, 1.8; 1-7 partial — SPIKE-1/4 pass, SPIKE-3/5 deferred), Epic 2, Epic 3,
  **Epic 4: 4-1, 4-2, 4-3, 4-4**. Bilingual (Tamil + English UI + content).
- **Epic 4 player extras (4-4, PR #25):** `SleepTimer` (15/30/45, JS setTimeout → pauses), `SpeedControl`
  (0.75/1/1.25 → `TrackPlayer.setRate` + persisted to prefsStore), `BibleHandoff` (link on track end →
  `scripture_link_opened` → `Linking.openURL`). `lib/bible.ts` = external URL, currently BibleGateway
  ERV-TA placeholder. **DECISION PENDING:** switch to YouVersion Tamil O.V. before Story 4-6 (needs
  bilingual book→USFM map; BibleGateway free-text doesn't parse Tamil book names) — see deferred-work.md.
- **Epic 4 audio player (4-3, PR #22):** `components/audio/PlayerBar` (persistent mini-player above tab
  bar, thin progress line) + `PlayerControls` (play/pause + tap-to-seek scrubber) + full player
  (`app/meditation/[id].tsx`, shows VerseText + back chevron, auto-plays on open) + `audioStore.seekTo`
  + `meditation_started` analytics. RNTP progress read via `useAudioProgress` re-exported from
  `lib/audio.ts` (components never import RNTP directly). `resumeAudio` restarts from 0 if track ended.
  **Device-tested on iPhone/iOS 26.5.**
- **RNTP device gate CLEARED (2026-07-07):** background + lockscreen + offline all PASS on device.
  Two build fixes came out of it: iOS `UIBackgroundModes` (PR #18) + `downloadTrack` lookup (PR #20).
  See `docs/SPIKE_RNTP.md` + `docs/SPIKES_VALIDATION.md`. Call-interruption tap-test still pending (handler coded).
- **Supabase:** ref `jwghoqpoidcvcuveheae`; `.env.local` has URL/anon/service-role/ElevenLabs. 50 Ta +
  50 En quotes seeded; ~10 En quotes voiced (Brian); `audio` bucket public. DO NOT generate more audio unless asked.

## Device build (Lawrence, working) — reproduce anytime
`git pull` → `SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device`. One-time device setup done:
signing (Personal Team), Developer Mode ON, `ENABLE_USER_SCRIPT_SANDBOXING=NO` (Xcode build setting),
iOS 26.5 platform installed. JS-only changes need just a Metro reload (`r`), no rebuild.

## Guardrails / working style
- Never commit to `main` — branch → PR → merge. CI = tsc + lint + tracker audit.
- **Don't over-ask** (Lawrence 2026-07-07): routine/non-sensitive ops are pre-approved — clear stale
  `.git/index.lock`, tsc/lint, commit/push/PR/merge. Only confirm genuinely risky actions.
- Context hygiene: targeted reads, subagents for fan-out, pipe outputs. Recommend with a production steer.
- All audio access through `lib/audio.ts`/`audioStore` — components never touch RNTP directly.

## Open follow-ups (tracked, not blocking — see `deferred-work.md`)
- Device NFR measurements: 4-3 cold-start <500 ms (NFR-P2) + ≤150 MB memory (NFR-P3); call-interruption tap-test.
- Player UI polish (Lawrence has unspecified tweaks in mind — ask for the list).
- DB `mood_tag` CHECK widening for Body/Soul categories before Story 4-6 seeding (Lawrence-run migration).
- Tamil Body/Soul category labels draft review; concern-ack email (Resend); SPIKE-3 AAC/.m4a transcode
  (needs ffmpeg); SPIKE-5 Razorpay (Epic 6); Hindi content pack; `walk.tsx` hardcoded `'ta'` → `useContentLanguage()` at 4-6.

## References
- Sprint: `_bmad-output/implementation-artifacts/sprint-status.yaml` (authoritative)
- Deferred: `_bmad-output/implementation-artifacts/deferred-work.md`
- `main` tip: PR #23 merged (4-3 done).

---
*Generated 2026-07-07 — next task = Story 4-4 (sleep timer, speed, Bible hand-off).*
