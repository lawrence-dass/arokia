---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
workflow_completed: true
workflow_completion_date: '2026-04-26'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

# Arokia - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Arokia. Individual epic files live alongside this index: `epic-1.md` through `epic-7.md`.

## Requirements Inventory

### Functional Requirements

FR1: A first-time user can read and acknowledge the Opening Vow before accessing any app content.
FR2: A user who does not acknowledge the Opening Vow cannot proceed to the app's content.
FR3: A returning user is prompted to re-acknowledge the Opening Vow after significant app updates.
FR4: Any user can read the About page describing Arokia's name, origin, mission, and ecumenical positioning.
FR5: Any user can access the current Privacy Policy from within the app.
FR6: A user can navigate to three distinct practice paths (Mind, Body, Soul) from the home screen.
FR7: A user can reach today's featured content within the Soul path with minimal navigation steps.
FR8: A user can browse the full meditation library organized by practice path (Mind / Body / Soul).
FR9: A user can access a library of meditations filtered by emotional/spiritual state (anxious, grieving, angry, lonely, tempted).
FR10: A user can browse Jesus's direct quotes from the Gospels, with each quote showing verbatim Tamil text and its verse reference.
FR11: A user can search the content library by topic or keyword.
FR12: A user can access the Silence Between Words Lectio Divina track.
FR13: Every scripture display renders the verbatim Tamil text alongside the full verse reference (book, chapter, verse) — the verse reference cannot be hidden or omitted.
FR14: Every meditation ends with a link that opens the complete scripture passage in an external Tamil Bible resource.
FR15: A user can play any meditation or Jesus-quote audio track with standard playback controls (play, pause, seek).
FR16: A user can continue audio playback while the app is backgrounded or the device screen is locked.
FR17: A user can control playback (play, pause, seek) from the device lock screen and hardware audio controls.
FR18: A user can download content to the device for offline playback before losing network connectivity.
FR19: The app automatically pre-downloads a baseline content set on first launch so the user has offline access immediately.
FR20: A user can set a sleep timer so audio stops automatically after a chosen duration.
FR21: A user can adjust playback speed to slow down or speed up Tamil audio.
FR22: A user can access all audio content without creating an account or signing in.
FR23: A user can make a one-time donation via Razorpay (UPI, cards, and netbanking).
FR24: A user can set up a monthly recurring donation via Razorpay.
FR25: A user making a donation is shown an explicit consent statement before providing their email, disclosing its single purpose (receipt delivery).
FR26: Each confirmed donation is automatically allocated — 10% to pay-it-forward, 90% to operations — atomically at transaction time.
FR27: A donor receives an email acknowledgment after a confirmed donation.
FR28: Any user can view the Glass-Wall Budget showing cumulative income, expenses, and pay-it-forward disbursements.
FR29: Any user can see the current quarter's named pay-it-forward beneficiary and amount committed.
FR30: Any user can submit a theological concern (translation issue, misattribution, wrong verse reference) without creating an account.
FR31: A user who submits a concern receives an automated acknowledgment confirming the review SLA (7 days).
FR32: Confirmed theological corrections are publicly disclosed in the next Glass-Wall Budget update, visible to all users.
FR33: The operator can view and respond to submitted concerns through an admin or email workflow.
FR34: A user can share any Jesus quote or meditation scripture as a formatted Tamil verse card (verbatim text + verse reference + Arokia name) to WhatsApp or any share target.
FR35: A user can optionally record attendance at a worship service on a given Sunday, with no streak, score, or gamification.
FR36: The operator can add, update, and publish new scripture quotes and meditations through the content management system.
FR37: The operator can regenerate audio for a single content item without affecting the rest of the library.
FR38: The operator can update the Glass-Wall Budget, with the About page reflecting the changes automatically.
FR39: The operator can view application error and crash reports.
FR40: The operator can view donation totals, recurring-donor count, and pay-it-forward allocation summaries.
FR41: A user can access meditation content accompanied by Tamil Christian keerthanai instrumental audio — distinctly Christian in character, never bhajan/mantra style.
FR42: The verse attribution (book, chapter, verse) is mandatory on every shared verse card; a card cannot be generated or shared without it.

**v1.1 FRs (architect-for, not build in MVP):**
FR-V1-01: A user can enter a morning devotion flow (Kaalai Jabam) from the home screen.
FR-V1-02: A user can enter an evening devotion flow (Maalai Jabam) from the home screen.
FR-V1-03: The home screen displays a time-of-day aware entry point (Kaalai / Maalai) based on device clock.
FR-V1-04: The operator can tag any content as 'morning', 'evening', or 'any'.
FR-V1-05: A user can access a dedicated Sleep content category for pre-sleep listening.
FR-V1-06: Sleep content sessions use the existing sleep timer as their primary interaction.
FR-V1-07: The operator can mark content with a 'sleep' type tag.
FR-V1-08: A user can highlight any Jesus quote; highlights are stored locally, no account required.
FR-V1-09: A user can view all their highlighted Jesus quotes as a personal collection.
FR-V1-10: Highlights persist across app updates and are stored only on the user's device.

### NonFunctional Requirements

NFR-P1: App reaches interactive state within 2 seconds of launch on mid-range Android (Snapdragon 680-class, 4 GB RAM, Android 11).
NFR-P2: Audio playback begins within 500 ms of user tap when cached; within 2 seconds when streaming.
NFR-P3: App maintains ≤150 MB in-session memory footprint during active background audio.
NFR-P4: Any scrollable content list renders within 1 second.
NFR-P5: First-week offline content package is ≤50 MB total.
NFR-P6: Tamil verse card image generation is performed locally on-device with no network dependency.
NFR-S1: All network communication uses TLS 1.2 or higher.
NFR-S2: Arokia stores no payment PII; Razorpay handles all card/UPI/banking data.
NFR-S3: Razorpay webhook events are verified using Razorpay's HMAC signature before any donation record is created.
NFR-S4: The only PII Arokia stores is a donor's email address — consent-gated, used solely for receipt delivery.
NFR-S5: No third-party advertising or analytics SDK is present in the production app build; verified by quarterly dependency audit.
NFR-R1: Production crash rate is ≤0.1% per session after first 90 days.
NFR-R2: Audio playback pauses gracefully on incoming phone call and resumes automatically when call ends.
NFR-R3: App loses no user state and does not crash when network connectivity is lost (except donation flow, which communicates the requirement clearly).
NFR-R4: Donation flow surfaces unambiguous success/failure state; no donation record created without confirmed Razorpay webhook.
NFR-SC1: System supports growth from 100 to 15,000 MAU without architectural changes.
NFR-SC2: Audio content is CDN-cached; 10× users produces no increase in database query load.
NFR-SC3: Adding a new language requires only a new locale JSON file and content data — zero application code changes.
NFR-A1: All interactive UI elements have a minimum touch target of 48×48 dp.
NFR-A2: App respects and scales to device's system font size; fully usable at 1.5× system font scale.
NFR-A3: All text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large ≥18 pt) in both light and dark modes.
NFR-A4: Most common action (play today's content) is reachable within 2 taps from home screen.
NFR-A5: Lock screen audio controls are compatible with VoiceOver (iOS) and TalkBack (Android).
NFR-PR1: No user account or sign-in required to access any core content.
NFR-PR2: No analytics data linked to individual user identity; only aggregate counts tracked.
NFR-PR3: Donor email addresses used solely for donation receipts; never for marketing without separate explicit consent.
NFR-PR4: App Store and Play Store privacy nutrition labels accurately reflect data collection practices.
NFR-AU1: Standard meditations and Jesus-quote audio produced at natural Tamil speech pace (1×) with keerthanai at 20-30% volume.
NFR-AU2: Sleep content audio (v1.1) produced at 0.7× pace with softer keerthanai, no sharp transitions.
NFR-AU3: All keerthanai instrumental audio is distinctly Christian — no shared melodic phrases with bhajan, qawwali, or non-Christian devotional styles.
NFR-AU4: Breathwork audio (v1.1) includes Tamil verbal breath cues (inhale/hold/exhale) synchronized with keerthanai rhythm.
NFR-I1: All user-facing UI strings externalized in react-i18next locale files; zero UI strings hardcoded in components.
NFR-I2: All Supabase content records include a language_code field from initial schema creation.
NFR-I3: Tamil text rendering uses system-installed Tamil fonts; no custom Tamil font bundled in app binary.

### FR Coverage Map

| FR | Epic | Summary |
|---|---|---|
| FR1 | Epic 2 | Opening Vow — first-launch read & acknowledge |
| FR2 | Epic 2 | Opening Vow — blocks content until acknowledged |
| FR3 | Epic 2 | Opening Vow — re-acknowledgment on significant updates |
| FR4 | Epic 2 | About page — name, mission, ecumenical positioning |
| FR5 | Epic 2 | Privacy Policy accessible in-app |
| FR6 | Epic 4 | Triune home screen — Mind/Body/Soul navigation |
| FR7 | Epic 4 | 2-tap path to today's featured Soul content |
| FR8 | Epic 4 | Browse meditation library by practice path |
| FR9 | Epic 4 | Filter meditations by emotional state (anxiety library) |
| FR10 | Epic 3 | Browse 50 Jesus quotes with verbatim Tamil text + verse ref |
| FR11 | Epic 3 | Search content library by topic/keyword |
| FR12 | Epic 4 | Silence Between Words — Lectio Divina track |
| FR13 | Epic 3 | Mandatory verse attribution — UI-enforced invariant |
| FR14 | Epic 4 | Bible-first hand-off link at meditation end |
| FR15 | Epic 4 | Audio playback controls (play/pause/seek) |
| FR16 | Epic 4 | Background audio + screen-locked playback |
| FR17 | Epic 4 | Lockscreen + hardware audio controls |
| FR18 | Epic 4 | Manual content download for offline playback |
| FR19 | Epic 4 | Progressive auto-download on first launch |
| FR20 | Epic 4 | Sleep timer (15/30/45 min) |
| FR21 | Epic 4 | Playback speed control (0.75×/1×/1.25×) |
| FR22 | Epic 3 | All content accessible without account or sign-in |
| FR23 | Epic 6 | One-time donation via Razorpay |
| FR24 | Epic 6 | Recurring monthly donation via Razorpay |
| FR25 | Epic 6 | Email consent at donation — single stated purpose |
| FR26 | Epic 6 | Atomic 10% pay-it-forward allocation at transaction |
| FR27 | Epic 6 | Donor email acknowledgment after confirmed donation |
| FR28 | Epic 6 | Glass-Wall Budget — income/expenses/pay-forward visible |
| FR29 | Epic 6 | Named pay-it-forward beneficiary visible in-app |
| FR30 | Epic 2 | Theological concern submission — no account required |
| FR31 | Epic 2 | Automated acknowledgment with 7-day SLA |
| FR32 | Epic 2 | Public correction disclosure in Glass-Wall Budget |
| FR33 | Epic 7 | Operator views and responds to submitted concerns |
| FR34 | Epic 5 | Verse card generation and share to WhatsApp |
| FR35 | Epic 5 | Optional Sunday church attendance tracker (no streaks) |
| FR36 | Epic 7 | Operator adds/updates/publishes content via Supabase admin |
| FR37 | Epic 7 | Per-track audio regeneration without affecting library |
| FR38 | Epic 6 | Glass-Wall Budget update → About page auto-reflects |
| FR39 | Epic 7 | Operator views error/crash reports via Sentry |
| FR40 | Epic 7 | Operator views donation totals and pay-forward summaries |
| FR41 | Epic 4 | Keerthanai instrumental audio — distinctly Christian |
| FR42 | Epic 5 | Verse attribution mandatory on shared verse card |

## Epic List

### Epic 1: Project Foundation & Validated Architecture
A fully working development environment with all five technical risks resolved before any user screen is written — the stable bedrock everything else is built on.
**Covers:** Project scaffold, TypeScript strict + path aliases, i18n setup, 9-table Supabase schema + migrations, Expo SQLite + Tamil OV Bible import, service layer (lib/), 3 Zustand stores skeleton, GitHub Actions CI, 3 EAS build profiles, Sentry wiring, 5 Week-1 critical spikes, ElevenLabs generation script skeleton.
**NFRs directly addressed:** NFR-I1, NFR-I2, NFR-SC3, NFR-S5, NFR-P5
**Story file:** `epic-1.md`

### Epic 2: Theological Onboarding & Identity
First-time user encounters Arokia's theological foundation through the Opening Vow before any content is seen.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR30, FR31, FR32
**Story file:** `epic-2.md`

### Epic 3: The Word — Scripture Browser & Search
Users browse 50 Jesus quotes in Tamil with verbatim text and mandatory verse attribution, and search by topic/keyword.
**FRs covered:** FR10, FR11, FR13, FR22
**Story file:** `epic-3.md`

### Epic 4: The Walk — Triune Home & Full Audio Meditation Practice
Mind/Body/Soul practice paths, 21 meditation tracks with background audio, lockscreen controls, offline cache, sleep timer, speed control.
**FRs covered:** FR6, FR7, FR8, FR9, FR12, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR41
**Story file:** `epic-4.md`

### Epic 5: Sharing — Verse Cards & Worship Tracker
Branded Tamil verse card (verbatim text + verse attribution + Arokia mark), share to WhatsApp, optional Sunday attendance tracker.
**FRs covered:** FR34, FR35, FR42
**Story file:** `epic-5.md`

### Epic 6: Integrity — Donation & Glass-Wall Transparency
Razorpay donation flow (one-time + recurring), full Glass-Wall Budget, atomic 10% pay-it-forward allocation.
**FRs covered:** FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR38
**Story file:** `epic-6.md`

### Epic 7: Operator — Content Pipeline & Operations
Full 7-stage content review pipeline, per-track audio regeneration, concern management, health monitoring.
**FRs covered:** FR33, FR36, FR37, FR39, FR40
**Story file:** `epic-7.md`
