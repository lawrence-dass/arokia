# RNTP Spike Validation

**RNTP Version:** react-native-track-player@4.1.2
**Workflow Decision:** [ ] MANAGED_WORKFLOW: VALIDATED  [ ] BARE_WORKFLOW_REQUIRED: [reason]

> **Action required:** Lawrence must build the dev client, install on physical devices, and fill in the results below before Story 1.6 can be marked `done`.
>
> Build command: `eas build --profile development --platform ios` (and/or `--platform android`)
> Or local Xcode build: `npx expo run:ios`

---

## iOS Validation

- Device: _____________________ (e.g. iPhone 15 Pro)
- OS: _____________________ (e.g. iOS 17.4)
- Lockscreen Now Playing card visible: PASS / FAIL
- Play/pause from lockscreen: PASS / FAIL
- Seek from lockscreen: PASS / FAIL
- Phone call interruption — audio pauses on call start: PASS / FAIL
- Phone call interruption — audio resumes after call ends: PASS / FAIL

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
