# Handover — 2026-07-07 | Claude (Winston session)

## ⚠️ Pending device rebuild (batch when convenient)
**Stories 5-1 + 5-2 added two native modules** (`react-native-view-shot`, `expo-sharing`) — the verse-card
PNG capture + share sheet need `SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device` (a Metro reload
won't pick them up). Test together: open a verse (Word tab → tap a quote) → the branded card shows → tap
Share → system share sheet with the card image.

## Next task (start here)
**Story 5-3 — Optional Sunday Church Attendance Tracker.** Pure UI, unblocked. `prefsStore` already has
Sunday-tracker fields. Read `_bmad-output/planning-artifacts/epics/epic-5.md` (Story 5.3). After 5-3,
Epic 5 is done → Epic 6 (donations/Razorpay = Lawrence-gated) + Epic 7 (operator tools) remain.

**Epic 4 dev-work is DONE (4-1…4-5).** The two remaining Epic-4 stories are NOT autonomous:
- **4-6 (content seeding, 21 tracks)** — needs Tamil content pack + ElevenLabs Tamil audio generation
  (credits; Lawrence said "don't generate more"). Also the DB `mood_tag` CHECK widening + YouVersion
  Bible hand-off are tied here. **Lawrence-gated.**
- **4-7 (cold-start perf)** — device-measured (NFR). Batched into the device pass.

**So the next AUTONOMOUS story is Epic 5-1 — Verse Card Generation (`VerseCardView`).** Pure UI, a
signature feature (shareable Jesus-quote cards). Then 5-2 (WhatsApp/system share), 5-3 (Sunday tracker).
Read `_bmad-output/planning-artifacts/epics/epic-5.md`. A `VerseCardView` component may already be
stubbed (`components/scripture/index.ts` exports it) — check before building.

## Project state (all on `main`)
- **Done:** Epic 1 (1.1–1.6, 1.8; 1-7 partial), Epic 2, Epic 3, **Epic 4: 4-1…4-5** (4-6 content-gated,
  4-7 device-gated), **Epic 5: 5-1, 5-2** (5-3 next). Bilingual (Tamil + English).
- **Share (5-1/5-2, PR #29/#30):** `VerseCardView` = branded, ref-forwarding, capturable card;
  `lib/verseCard.ts:captureVerseCard` (PNG, on-device); `lib/share.ts:shareVerseCard` (→ expo-sharing,
  logs `share_triggered`); wired on `app/verse/[id].tsx` Share button. Needs device rebuild (above).
- **Offline (4-5, PR #27):** `audioStore` cache manifest now PERSISTED (zustand persist + AsyncStorage,
  partialized to `downloadedTracks`). Auto-download on play + prefetch next 2 (`playTrack(content, queueIds)`,
  `prefetchQueue` returns uris) + manual `downloadWeek` (`OfflineDownloadCard` on walk screen).
  Caveat: persisted `file://` uris can stale after an iOS app update (deferred-work).
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
