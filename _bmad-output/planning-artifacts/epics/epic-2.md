# Epic 2: Theological Onboarding & Identity

A first-time user encounters Arokia's theological foundation through the Opening Vow — before any content is seen — and can access the About page, Privacy Policy, and concern submission form. The product's trust and honesty are fully expressed from first launch.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR30, FR31, FR32

---

### Story 2.1: Opening Vow — First-Launch Gate

As a first-time user,
I want to read and acknowledge the Opening Vow before any content is accessible,
So that I understand from the first moment that Arokia is a tool pointing to Jesus, not a replacement for Him.

**Acceptance Criteria:**

**Given** a user opens Arokia for the first time
**When** the app loads
**Then** the Opening Vow screen is the first screen shown — no content, home screen, or navigation is accessible until the Vow is acknowledged

**Given** the Opening Vow screen is displayed
**When** the user reads it
**Then** the screen displays the verbatim Tamil vow text (from `ta.json`), the acknowledgment button (ஆமென் — தொடங்கு), and no other navigation options

**Given** the user taps the acknowledgment button
**When** the tap registers
**Then** `vow_completed` analytics event is logged; the user is navigated to the home screen; the vow state is persisted in `AsyncStorage` so it does not reappear on subsequent launches

**Given** the user has NOT tapped the acknowledgment button
**When** they attempt to navigate away (back gesture, deep link)
**Then** navigation is blocked — the Vow screen remains; the app does not reveal content (FR2)

**Given** the Opening Vow screen
**When** measured against accessibility standards
**Then** the acknowledgment button has a minimum 48×48 dp touch target (NFR-A1); text meets WCAG AA contrast (NFR-A3); all strings are from `ta.json` with no hardcoded text (NFR-I1)

---

### Story 2.2: Returning User Re-acknowledgment & Vow State Management

As a returning user,
I want the Opening Vow to reappear after significant app updates,
So that theological changes or corrections to the Vow are explicitly acknowledged, not silently accepted.

**Acceptance Criteria:**

**Given** a user has previously acknowledged the Opening Vow
**When** they relaunch the app with no version change
**Then** the Vow screen is NOT shown — they go directly to the home screen

**Given** a significant app update that increments the Vow version (operator-controlled via a version constant)
**When** the returning user launches the updated app
**Then** the Vow screen reappears with a brief note indicating the Vow has been updated (FR3); the user must re-acknowledge before accessing content

**Given** the vow version constant in `constants/vow.ts`
**When** the operator increments it (e.g., `VOW_VERSION = 2`)
**Then** all users whose persisted `vowAcknowledgedVersion` is less than the current version see the Vow screen on next launch

**Given** the vow acknowledgment state
**When** inspected in `AsyncStorage`
**Then** it stores only `vowAcknowledgedVersion: number` — no user identity, no PII (NFR-PR1)

---

### Story 2.3: About Page & Privacy Policy

As any user,
I want to read Arokia's About page describing its name, mission, and ecumenical positioning, and access the Privacy Policy,
So that I can understand and trust the product's identity and data practices before or after engaging with content.

**Acceptance Criteria:**

**Given** the About page is accessible from the app navigation
**When** opened
**Then** it displays: (1) the meaning of Arokia (ஆரோக்கியம்) and the name story including Arokia Matha heritage; (2) the four pillars; (3) the ecumenical positioning statement serving all Tamil Christians; (4) the correction disclosure process; (5) the current Glass-Wall Budget rendered from `docs/glass-wall-budget.md` via `react-native-markdown-display` (FR4, FR28)

**Given** the Privacy Policy link in the About page
**When** tapped
**Then** the Privacy Policy is displayed in-app (not requiring a browser); it is accessible at all times including before the Opening Vow is acknowledged (FR5)

**Given** the About page
**When** reviewed
**Then** all text content is sourced from `ta.json` or the markdown budget file — no hardcoded strings; accessible with no account required (NFR-PR1, NFR-I1)

**Given** the `docs/glass-wall-budget.md` file
**When** the About page loads
**Then** it is rendered with `react-native-markdown-display`; if unavailable (offline, first launch), a graceful fallback message is shown (NFR-R3)

---

### Story 2.4: Theological Concern Submission Form

As any user,
I want to submit a theological concern without creating an account,
So that the community can be a check on content accuracy, and I receive confirmation that my concern will be reviewed within 7 days.

**Acceptance Criteria:**

**Given** the concern submission form accessible from the About page
**When** opened
**Then** it displays: (1) which content the concern is about (optional); (2) description of the concern (required); (3) name and email (both optional) — and a Submit button (FR30)

**Given** the user submits a concern
**When** sent via `lib/concerns.ts:submitConcern()`
**Then** a row is inserted into `theological_concerns` with `status = 'open'`; an automated acknowledgment email is triggered stating the 7-day review SLA (FR31)

**Given** a successful submission
**When** the user sees the result
**Then** a confirmation screen displays the 7-day SLA message in Tamil; no account creation or login is prompted (NFR-PR1)

**Given** the user submits with no network connection
**When** the submission fails
**Then** a clear offline error message is shown from `ta.json`; the form data is preserved so the user can retry (NFR-R3)

**Given** the email field
**When** the user provides an email
**Then** it is stored in `theological_concerns.submitter_email` and used only for the acknowledgment reply — no marketing emails, no identity linking (NFR-PR3, NFR-S4)
