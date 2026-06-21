# Story 1.7: Tamil Rendering, AAC Format, Offline Cache & Razorpay Device Spikes

Status: in-progress

## Story

As a developer,
I want to validate four remaining technical architecture assumptions — Tamil Unicode rendering, 64 kbps mono AAC format, offline cache playback, and Razorpay test payment end-to-end —
So that no unresolved architectural assumption remains before UI development begins.

## Acceptance Criteria

1. **Given** (SPIKE-1: Tamil text) a screen displaying `"வருத்தப்பட்டுப் பாரஞ்சுமக்கிறவர்களே"` using system Tamil fonts
   **When** rendered on Android 11+ and iOS 16+ physical devices
   **Then** correct ligatures appear with no glyph fallback; no layout overflow at 320dp screen width (NFR-I3)

2. **Given** (SPIKE-3: AAC format) a Tamil voice generation via ElevenLabs Multilingual v2 at 64 kbps mono
   **When** the `.m4a` file is inspected
   **Then** a 7-minute file is <=3.5 MB; the file plays correctly via `react-native-track-player` with audible Tamil speech quality

3. **Given** (SPIKE-4: Offline cache) `expo-file-system` downloads a test `.m4a` to `FileSystem.documentDirectory`
   **When** the device is switched to airplane mode and the file is played via `react-native-track-player`
   **Then** playback starts in <=500 ms with no network errors; no network request is made during playback (NFR-P2)

4. **Given** (SPIKE-5: Razorpay) a test-mode payment initiated via external webview
   **When** the payment completes in test mode
   **Then** the Razorpay test dashboard shows it as successful; a manual webhook simulation inserts a `donations` row with `status = 'confirmed'`

5. **Given** all four spikes completed
   **When** `docs/SPIKES_VALIDATION.md` is committed
   **Then** it documents pass/fail for each spike, device model + OS version tested, and any deviations from the architecture spec

## Tasks / Subtasks

- [x] **Create Story 1.7 validation artifacts** (AC: 5)
  - [x] Create this story file from Epic 1 source text
  - [x] Create `docs/SPIKES_VALIDATION.md` with pass/fail sections for all four spikes

- [x] **Create Tamil rendering validation route** (AC: 1)
  - [x] Add a dev-only `/spikes` route that renders the exact Tamil phrase from i18n
  - [x] Constrain the phrase area to 320px/dp-equivalent width for overflow inspection
  - [x] Use NativeWind `className`; no `StyleSheet.create()`
  - [x] Add all visible strings to `locales/ta.json`

- [x] **Create AAC inspection helper** (AC: 2)
  - [x] Add `scripts/validate-aac.ts` to check file existence, extension, size, and estimated average bitrate
  - [x] Default expected duration is 420 seconds (7 minutes)
  - [x] Fail when the file exceeds 3.5 MB

- [ ] **Run Tamil rendering spike on physical devices** (AC: 1)
  - [ ] Build/install a dev client
  - [ ] Open `/spikes` on Android 11+ physical device and document results
  - [ ] Open `/spikes` on iOS 16+ physical device and document results

- [ ] **Run AAC format spike** (AC: 2)
  - [ ] Generate a 64 kbps mono Tamil `.m4a` using ElevenLabs Multilingual v2
  - [ ] Run `npx tsx scripts/validate-aac.ts <path-to-file.m4a> --duration-sec 420`
  - [ ] Play the file via RNTP on device and document audible Tamil quality

- [ ] **Run offline cache spike** (AC: 3)
  - [ ] Download a test `.m4a` through `downloadTrack()` / `prefetchQueue()`
  - [ ] Switch device to airplane mode
  - [ ] Play cached local URI through RNTP and document start time / network behavior

- [ ] **Run Razorpay test-mode spike** (AC: 4)
  - [ ] Initiate a test-mode payment through external webview
  - [ ] Verify success in Razorpay dashboard
  - [ ] Simulate webhook and verify `donations.status = 'confirmed'`

- [ ] **Type-check and lint** (AC: all)
  - [ ] `npx tsc --noEmit`
  - [ ] `npm run lint`

## Dev Notes

### Story 1.6 Status

Story 1.6 RNTP physical-device validation is intentionally paused by Lawrence. Do not mark Story 1.6 `done` until `docs/SPIKE_RNTP.md` contains real iOS and Android results.

### Validation Boundaries

This story contains device, ElevenLabs, and Razorpay checks. Code can provide harnesses and documentation, but final pass/fail requires Lawrence-controlled external systems: physical devices, ElevenLabs output, Razorpay test dashboard, and Supabase webhook simulation.

### Architecture References

- [Source: _bmad-output/planning-artifacts/epics/epic-1.md#Story 1.7]
- [Source: _bmad-output/planning-artifacts/architecture.md#Week 1 Critical Technical Spikes]
- [Source: _bmad-output/planning-artifacts/architecture.md#Audio File Caching]
- [Source: _bmad-output/planning-artifacts/architecture.md#Razorpay Webhook]
