# Spikes Validation

Story: 1.7 — Tamil Rendering, AAC Format, Offline Cache & Razorpay Device Spikes

> Fill this document with real device and service results before Story 1.7 can move to `done`.

## Summary

| Spike | Result | Notes |
|---|---|---|
| SPIKE-1 Tamil rendering | [ ] PASS [ ] FAIL | |
| SPIKE-3 AAC format + size | [ ] PASS [ ] FAIL | |
| SPIKE-4 Offline cache playback | [ ] PASS [ ] FAIL | |
| SPIKE-5 Razorpay test payment + webhook | [ ] PASS [ ] FAIL | |

## SPIKE-1: Tamil Rendering

Validation route: `/spikes`

Test phrase: `வருத்தப்பட்டுப் பாரஞ்சுமக்கிறவர்களே`

### iOS

- Device: _____________________
- OS version: _____________________
- Correct Tamil ligatures: PASS / FAIL
- No glyph fallback: PASS / FAIL
- No layout overflow at 320dp width: PASS / FAIL
- Notes:

### Android

- Device: _____________________
- OS version: _____________________
- Correct Tamil ligatures: PASS / FAIL
- No glyph fallback: PASS / FAIL
- No layout overflow at 320dp width: PASS / FAIL
- Notes:

## SPIKE-3: AAC Format + Size

Command:

```bash
npx tsx scripts/validate-aac.ts <path-to-file.m4a> --duration-sec 420
```

- Source: ElevenLabs Multilingual v2
- File path/name: _____________________
- Duration seconds: _____________________
- File size MB: _____________________
- Estimated average kbps: _____________________
- 7-minute file <=3.5 MB: PASS / FAIL
- 64 kbps mono AAC confirmed: PASS / FAIL
- RNTP playback succeeds: PASS / FAIL
- Audible Tamil speech quality acceptable: PASS / FAIL
- Notes:

## SPIKE-4: Offline Cache Playback

- Device: _____________________
- OS version: _____________________
- Test content item id: _____________________
- Cached local URI: _____________________
- Airplane mode enabled before playback: PASS / FAIL
- Playback starts in <=500 ms: PASS / FAIL
- No network request during playback: PASS / FAIL
- Notes:

## SPIKE-5: Razorpay Test Payment + Webhook

- Platform tested: iOS / Android / Both
- Razorpay mode: Test
- Payment method: _____________________
- Razorpay dashboard shows success: PASS / FAIL
- Manual webhook simulation performed: PASS / FAIL
- `donations` row inserted with `status = 'confirmed'`: PASS / FAIL
- No payment PII stored in Arokia DB: PASS / FAIL
- Notes:

## Architecture Decision

[ ] All four spikes passed. Architecture can proceed to app screen development.

[ ] One or more spikes failed. Required decision/deviation:

