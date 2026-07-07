# Handover — 2026-07-07 | Claude (Winston session)

## Next task (start here)
**Run the RNTP device gate on physical hardware**, then unblock Epic 4-3. Everything is staged on
`main` and turnkey — this is a Lawrence-hardware step (cloud/simulator can't build iOS/Android).

### How to run the gate
```bash
git pull
SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device
# Android: SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:android --device
```
- `SENTRY_DISABLE_AUTO_UPLOAD=true` sidesteps the old `sentry-cli org slug` build error (skips
  sourcemap upload — fine for a dev build).
- If app.json native config doesn't take: `npx expo prebuild --clean` then rebuild.
- Home screen → tap dev-only **"Technical Spikes"** link → `/spikes` harness.

### Four checks (record in `docs/SPIKE_RNTP.md` + `docs/SPIKES_VALIDATION.md`)
1. **Tamil rendering** — phrase box: correct ligatures, no tofu, no overflow at 320dp.
2. **Background/lockscreen** — Play → lock phone → Now Playing card shows; play/pause/seek from
   lockscreen; audio continues backgrounded.
3. **Interruption** — call the phone while playing → pauses on call, resumes after.
4. **Offline** — Download for offline → Airplane Mode → Play offline → starts <0.5s, no network.

On results: fill the two docs, flip Stories **1-6 + 1-7 → `done`** in sprint-status, which **unblocks
Story 4-3** (audio player core). SPIKE-5 (Razorpay) stays deferred to pre-Epic-6 — NOT part of this gate.

## What's staged for the gate (all merged to `main`)
- **PR #17** — `/spikes` turned into a real RNTP harness: `getFirstAudioTrack()` loads a seeded voiced
  track; Play/Pause (background + lockscreen + call-duck), Download → Play-offline (Airplane Mode).
  Dev-only home link (`__DEV__`). New `spikes.audio.*` i18n keys (ta + en).
- **PR #18** — native config: iOS `UIBackgroundModes:["audio"]` + Android FOREGROUND_SERVICE(_MEDIA_PLAYBACK).
  Without these the gate fails regardless of code. Applies on next native rebuild.
- RNTP already fully wired pre-session: `registerPlaybackService`, `setupPlayer`, Play/Pause/SeekTo
  capabilities, call-duck handler (`lib/trackPlayerService.ts`), `lib/audio.ts` download/cache.

## Project state (all on `main`)
- **Done:** Epic 1 (1.1–1.5, 1.8), Epic 2, Epic 3, **Epic 4-1 + 4-2** (PR #15/#16). Bilingual (Ta + En).
- **Epic 4-1/4-2 close (PR #15):** path-specific meditation categories. `CategoryFilter` +
  `CATEGORIES_BY_PATH` (mind=emotional, body=rest/movement/breathwork/sleep,
  soul=prayer/lectio/silence/communion). New `CategoryTag` type; `category` i18n namespace (dropped `mood`).
- **1-6/1-7:** code-complete; blocked ONLY on the device gate above. **4-3/4-4/4-5 blocked until gate passes.**
- **Supabase:** ref `jwghoqpoidcvcuveheae`; `.env.local` has URL/anon/service-role/ElevenLabs. 50 Ta + 50 En
  quotes seeded; ~10 En quotes voiced (Brian); `audio` bucket public. DO NOT generate more audio unless asked.

## Guardrails / working style
- Never commit to `main` — branch → PR → merge. CI = tsc + lint + tracker audit.
- Recurring stale `.git/index.lock` (VS Code) — `rm -f .git/index.lock` if a commit fails.
- Stale `.expo/types` → phantom typed-route errors locally (`rm -rf .expo/types` before tsc; CI unaffected).
- Context hygiene: targeted reads, subagents for fan-out, pipe outputs. Recommend options with a
  production-best-practice steer.

## Open follow-ups (tracked, not this task — see `deferred-work.md`)
- DB `mood_tag` CHECK must widen for Body/Soul categories **before Story 4-6 seeding** (Lawrence-run migration).
- Tamil Body/Soul category labels = draft, pending linguistic review.
- Concern-ack email (Resend), privacy legal review, English full-text search bundle, Tamil audio voice,
  full English audio batch, Hindi content pack, walk.tsx hardcoded `'ta'` → `useContentLanguage()` at 4-6.

## References
- Sprint: `_bmad-output/implementation-artifacts/sprint-status.yaml` (authoritative)
- Deferred: `_bmad-output/implementation-artifacts/deferred-work.md`
- `main` tip: PR #18 merged (RNTP native config).

---
*Generated 2026-07-07 — next task = run the RNTP device gate, then unblock Epic 4-3.*
