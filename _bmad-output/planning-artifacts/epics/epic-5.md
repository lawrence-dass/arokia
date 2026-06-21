# Epic 5: Sharing — Verse Cards & Worship Tracker

Users can generate a branded Tamil verse card (verbatim text + verse attribution + Arokia mark) and share it to WhatsApp or any app — fully offline-capable. Users can optionally mark Sunday church attendance with no streak or gamification.

**FRs covered:** FR34, FR35, FR42

---

### Story 5.1: Verse Card Generation — VerseCardView Component

As a Tamil Christian user,
I want a shareable verse card generated from any Jesus quote — showing verbatim Tamil text, verse reference, and the Arokia mark — built entirely on-device with no network dependency,
So that I can create and share scripture even in airplane mode or areas with poor connectivity.

**Acceptance Criteria:**

**Given** `components/scripture/VerseCardView.tsx`
**When** rendered
**Then** it displays: (1) verbatim Tamil scripture text; (2) the full verse reference (book, chapter, verse); (3) the Arokia name/mark — the reference is part of the visual composition and cannot be omitted (FR42)

**Given** `react-native-view-shot` capturing `VerseCardView`
**When** the capture runs on a device in airplane mode
**Then** a PNG image is produced with no network request — the entire operation is on-device (NFR-P6)

**Given** the generated card image
**When** inspected
**Then** Tamil text renders correctly with system fonts; no glyph fallback; the Arokia mark is visible and legible

**Given** `tsc --noEmit` is run
**When** `VerseCardView` is used without a `reference` prop
**Then** TypeScript raises a compile error — the attribution invariant extends to the card component (FR42)

---

### Story 5.2: Share to WhatsApp & System Share Sheet

As a Tamil Christian user,
I want to share any Jesus quote or meditation scripture as a verse card to WhatsApp, Messages, or any installed app on my device,
So that I can share Jesus's words with family and friends in the language they grew up with.

**Acceptance Criteria:**

**Given** a user is viewing a quote detail screen or meditation end screen
**When** they tap the Share button
**Then** `react-native-view-shot` captures `VerseCardView` as a PNG; `Share.share()` opens the system share sheet with the image and verse reference text (FR34)

**Given** the system share sheet is open
**When** the user selects WhatsApp (or any installed app)
**Then** the verse card image is shared with the verse reference visible in the share text; `share_triggered` analytics event is logged

**Given** the share is initiated while the device is offline
**When** the card is generated
**Then** the on-device PNG generation completes successfully; the share sheet opens; only the destination app's network behaviour is affected by connectivity (NFR-P6)

**Given** the share content
**When** inspected
**Then** it includes: the PNG image, the verbatim Tamil text, the verse reference, and the Arokia name — no content is shared without attribution (FR42)

**Given** a share action completes or is cancelled
**When** the user returns to Arokia
**Then** the app state is exactly as they left it — no navigation side effects

---

### Story 5.3: Optional Sunday Church Attendance Tracker

As a Tamil Christian user,
I want to optionally mark that I attended worship on a given Sunday, with no streak counter, score, or gamification attached,
So that my Sunday attendance is a private act of devotion — not a metric I am being pushed to optimize.

**Acceptance Criteria:**

**Given** the attendance tracker accessible from the home screen or profile area
**When** the user opens it
**Then** they see a simple calendar view showing Sundays of the current month; previously marked Sundays have a soft visual indicator (FR35)

**Given** the user taps a Sunday
**When** they mark attendance
**Then** the date is stored locally in `AsyncStorage` with no server sync, no account; no streak count, no score, no congratulatory gamification message is shown

**Given** the tracker
**When** inspected for engagement mechanics
**Then** there is no streak counter, no "You attended X weeks in a row!" message, no reminder notification, no badge — the action is recorded quietly (FR35)

**Given** `AsyncStorage` entries for the tracker
**When** inspected
**Then** they store only `{ date: 'YYYY-MM-DD', attended: true }` entries — no user identity, no device ID, no PII (NFR-PR1)

**Given** the user has no history
**When** the tracker loads
**Then** it shows the current month's Sundays with no empty-state pressure — the tracker is an invitation, not an obligation
