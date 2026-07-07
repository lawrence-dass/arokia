# RNTP Spike Validation

**RNTP Version:** react-native-track-player@4.1.2
**Workflow Decision:** [ ] MANAGED_WORKFLOW: VALIDATED  [ ] BARE_WORKFLOW_REQUIRED: [reason]

> **Action required:** Lawrence must build the dev client, install on physical devices, and fill in the results below before Story 1.6 can be marked `done`.
>
> Build command: `eas build --profile development --platform ios` (and/or `--platform android`)
> Or local Xcode build: `npx expo run:ios`

---

## iOS Validation — 2026-07-07

- Device: Lawrence's iPhone
- OS: iOS 26.5
- Background playback continues while backgrounded/locked: **PASS**
- Lockscreen Now Playing card visible: **PASS**
- Play/pause from lockscreen: PASS / FAIL — *not individually re-confirmed; card + transport present*
- Seek from lockscreen: PASS / FAIL — *not individually re-confirmed*
- Phone call interruption — audio pauses on call start: **PENDING** (Lawrence to test)
- Phone call interruption — audio resumes after call ends: **PENDING** (Lawrence to test)

> Required build fix found during validation: `ios.infoPlist.UIBackgroundModes=["audio"]` was missing
> from the built Info.plist (stale native project) — audio stopped on lock. Fixed via PR #18 (app.json)
> + local Info.plist add; a clean prebuild now reproduces it. Background/lockscreen PASS after the fix.

## Android Validation

- Device: _____________________ (e.g. Pixel 7)
- OS: _____________________ (e.g. Android 14 / API 34)
- Lockscreen media controls visible: PASS / FAIL
- Play/pause from lockscreen: PASS / FAIL
- Audio continues while backgrounded: PASS / FAIL
- Phone call interruption — audio pauses on call start: PASS / FAIL
- Phone call interruption — audio resumes after call ends: PASS / FAIL

---

## Overall Result

[ ] PASS — Story 1.6 complete. Both platforms validated on physical devices.
[ ] FAIL — See notes below.

## Notes

<!-- Any deviations, workarounds, or findings relevant to Story 1.7 -->
