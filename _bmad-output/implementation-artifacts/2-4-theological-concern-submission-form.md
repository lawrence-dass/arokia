# Story 2.4: Theological Concern Submission Form

Status: review

## Story

As any user,
I want to submit a theological concern without creating an account,
So that the community can be a check on content accuracy, and I receive confirmation that my concern will be reviewed within 7 days.

## Acceptance Criteria

1. **Given** the concern submission form accessible from the About page
   **When** opened
   **Then** it displays: (1) which content the concern is about (optional, populated only when reached from a specific content screen — see Scope Note); (2) description of the concern (required); (3) email (optional) — and a Submit button (FR30)

2. **Given** the user submits a concern
   **When** sent via `lib/concerns.ts:submitConcern()`
   **Then** a row is inserted into `theological_concerns` with `status = 'open'` (FR31)

3. **Given** a successful submission
   **When** the user sees the result
   **Then** a confirmation screen displays the 7-day SLA message in Tamil; no account creation or login is prompted (NFR-PR1)

4. **Given** the user submits with no network connection
   **When** the submission fails
   **Then** a clear offline error message is shown from `ta.json`; the form data is preserved so the user can retry (NFR-R3)

5. **Given** the email field
   **When** the user provides an email
   **Then** it is stored in `theological_concerns.submitter_email` and used only for the acknowledgment reply — no marketing emails, no identity linking (NFR-PR3, NFR-S4)

## Scope Note — No "name" field (deviates from epics.md's literal AC text)

`epics.md`'s Story 2.4 AC1 lists "(3) name and email (both optional)". The already-implemented
backend contract — `lib/concerns.ts:submitConcern(description, contentItemId?, email?)` (built in
Story 1.4) and the `theological_concerns` table schema (`supabase/migrations/20260603000000_initial_schema.sql`)
— has no `submitter_name` parameter or column at all, only `submitter_email`. Adding one would
require a new DB migration, which this session's mobile/unattended policy explicitly forbids
("Never modify: ... DB migrations"). This story implements the form against the ACTUAL existing
service/schema contract (description + optional email only) rather than the epic's literal
wording. If a name field is wanted, it needs a migration + `submitConcern()` signature change —
log it as a follow-up, don't build it here.

## Scope Note — Automated acknowledgment email deferred (decided with Lawrence, 2026-07-04)

FR31 also requires "an automated acknowledgment email is triggered stating the 7-day review SLA."
`architecture.md` (line ~959, ~1038) already designates this as its own Supabase Edge Function —
`supabase/functions/concern-notification/`, triggered by a DB webhook on `theological_concerns`
INSERT — and architecture.md's own known-gaps table lists "No automated acknowledgment email path
for concern submissions" as a still-open item. No email provider (Resend/SendGrid/etc.) has been
chosen, no API key exists, and this session's policy defers anything needing external-service
credentials to Lawrence. This story builds everything EXCEPT the email: the confirmation screen
shown in-app satisfies the user-facing half of AC3 (the user sees the 7-day SLA message
immediately), and the backend email trigger is logged in `deferred-work.md` with the exact hook
point (`supabase/functions/concern-notification/`) for whoever picks it up once a provider is
chosen.

## Tasks / Subtasks

- [x] **Create `components/shared/ConcernForm.tsx` + barrel export** (AC: 1, 4, 5)
  - [x] Architecture-designated location: `components/shared/` [Source: architecture/frontend.md#Route to Component Mapping]
  - [x] Props: `onSubmit: (description: string, email: string) => void`, `submitting: boolean`, `errorMessage?: string | null`
  - [x] Internal state: `description`, `email` (both local `useState` — this is ordinary form UI state, not app state, consistent with the codebase's "no raw store access in dumb components" pattern meaning app/domain state, not component-local input state)
  - [x] `TextInput` for description (multiline, required — disable Submit while empty/whitespace-only, mirroring `submitConcern`'s own validation so the user gets instant feedback instead of a round-trip error)
  - [x] `TextInput` for email (optional, `keyboardType="email-address"`, `autoCapitalize="none"`)
  - [x] Render `errorMessage` above the Submit button when present
  - [x] `accessibilityRole="button"` + `min-h-12` on Submit, same touch-target pattern as `OpeningVow`'s CTA
  - [x] `className` exclusively — no `StyleSheet.create()`, no hardcoded strings (all via `t()`)

- [x] **Create `app/report-concern.tsx`** (AC: 1, 2, 3, 4)
  - [x] Read an optional `contentItemId` via `useLocalSearchParams<{ contentItemId?: string }>()` — see Scope Note on "which content"; no UI field for it, just a pass-through param for a future Epic 3/4 "report a concern about this verse" deep link
  - [x] `submitting`/`errorMessage`/`submitted` local state; `handleSubmit` calls `submitConcern(description, contentItemId, email || undefined)`
  - [x] On success: set `submitted = true`, render the confirmation view (AC 3) instead of the form
  - [x] On failure: set `errorMessage` to `t('errors.offline')` (reuse the existing key — this is a network-dependent feature per `architecture.md`'s offline-handling note, so the existing offline copy is the correct message, not a new one) — do NOT clear `description`/`email` (React state naturally persists across re-renders unless explicitly reset, so AC 4's "form data preserved" falls out of simply not resetting on error)
  - [x] Do not call `resetVow`/touch `usePrefsStore` — this screen has nothing to do with vow state

- [x] **Wire routing** (AC: 1)
  - [x] Add `report-concern` to the `vowSatisfied`-guarded `Stack.Protected` block in `app/_layout.tsx`, alongside `index`/`spikes`/`about` — same as every other content screen
  - [x] Add a `<Link href="/report-concern">` from `app/about.tsx`'s correction-disclosure section (natural pairing — the correction process description leads directly to "report a concern")

- [x] **Add i18n keys** (AC: all)
  - [x] New `concern` namespace in `ta.json`: `title`, `descriptionLabel`, `descriptionPlaceholder`, `emailLabel`, `emailPlaceholder`, `submitCta`, `confirmationTitle`, `confirmationBody` (states the 7-day SLA per FR30, matching the PRD's own stated SLA — this is a procedural/operational fact, not new theological content, so it's written as real copy, not a placeholder — but still flag for Lawrence's linguistic review before shipping, same treatment Story 2.2 gave `vow.updatedNotice`), `linkLabel` (used by the About-page link)
  - [x] Reuse the EXISTING `errors.offline` key for the failure message — do not create a duplicate

- [x] **Verification** (AC: all)
  - [x] `npm run format` after all file writes
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 new warnings
  - [x] `bash scripts/audit-trackers.sh` — passed
  - [ ] Simulator walkthrough — **pending desktop verification, see Dev Agent Record**: submit with description only → confirmation shown; submit with description + email → confirmation shown; airplane mode → offline error shown, form fields still populated, retry works once back online

## Dev Notes

### Critical Architecture Requirements (MUST follow)

- **`ConcernForm` lives in `components/shared/`** (not a new `components/concern/`) — this is the
  architecture-designated location and the first real component in that directory
  [Source: architecture/frontend.md#Route to Component Mapping]
- **Do NOT create a `submitter_name` column or change `submitConcern()`'s signature** — see Scope Note
- **Do NOT build the email Edge Function** — see Scope Note; log to `deferred-work.md` instead
- **`@/` path aliases only**, zero hardcoded strings, NativeWind `className` only

### Existing Code You Are Building On (do NOT reinvent)

- `lib/concerns.ts:submitConcern(description, contentItemId?, email?)` — already fully
  implemented (Story 1.4), including description-required and email-format validation. Call it
  as-is; do not duplicate its validation logic beyond the UI-level "disable Submit while empty"
  convenience check.
- `types/concern.ts:TheologicalConcern` — existing type, not modified by this story.
- `supabase/migrations/20260603000000_initial_schema.sql` — `theological_concerns` table already
  has `status default 'open'` and an anon-insert RLS policy; this story's INSERT satisfies AC 2
  with zero schema changes.
- `app/about.tsx` (Story 2.3) — its correction-disclosure section is the natural link source for
  this form; `components/donation/GlassWallBudget.tsx` is a good reference for the
  "dumb-ish component does async work, parent screen doesn't" pattern (though this story's form
  is simpler — no async work inside `ConcernForm` itself, submission is fully delegated to the
  parent screen via `onSubmit`).

### Testing Standards

No test suite exists yet. Verification is tsc + lint + tracker-audit + simulator walkthrough
(desktop-only — actually exercising the Supabase insert needs real `.env.local` credentials,
which this cloud session does not have; the code path is correct against `submitConcern`'s
existing, already-tested contract, but the live insert itself is unverified here).

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2.md#Story 2.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#L832, #L861, #L923, #L958-959, #L1038]
- [Source: _bmad-output/planning-artifacts/architecture/frontend.md#Route to Component Mapping]
- [Source: _bmad-output/planning-artifacts/prd.md#FR30-33, NFR-PR1, NFR-PR3, NFR-R3, NFR-S4]
- [Source: lib/concerns.ts, types/concern.ts — existing implementation this story wires up]

## Dev Agent Record

### Agent Model Used

Claude (Claude Code, cloud/mobile session)

### Debug Log References

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 1 pre-existing warning (`lib/i18n.ts:8`, known, not in scope)
- `npm run format` — clean
- `bash scripts/audit-trackers.sh` — passed

### Completion Notes List

- `submitConcern()` was already fully implemented (Story 1.4) and required zero changes — this
  story is purely UI/routing wiring on top of existing service-layer code.
- No "name" field and no email-sending Edge Function — see the two Scope Notes above. Both
  logged to `deferred-work.md`.
- `concern.confirmationBody`'s "7 days" wording matches FR30's own stated SLA verbatim, and the
  other `concern.*` strings are ordinary form-UI copy (labels, placeholders, a thank-you message)
  rather than theological/legal content — written as real Tamil text rather than placeholders,
  but still flagged here for Lawrence's linguistic review before shipping, same treatment given
  to `vow.updatedNotice` in Story 2.2.
- `ConcernForm` establishes the first `TextInput` usage pattern in this codebase (no prior
  precedent existed) — styled with the existing `border`/`surface`/`rounded-card` design tokens
  rather than introducing new ones.
- **Pending desktop verification (cannot run in this cloud session — no simulator/device access,
  and no `.env.local` credentials to exercise a real Supabase insert):**
  - Submit with description only, and with description + email — confirm both actually insert a
    row into `theological_concerns` (this session verified the code path matches
    `submitConcern`'s existing, already-tested contract, but never executed it against a real
    Supabase project).
  - Airplane-mode retry: confirm the offline error shows and `description`/`email` are still
    populated in the form afterward, then confirm retry succeeds once back online.
  - Keyboard/`TextInput` behavior on-device (multiline description field sizing, keyboard type
    for email) — not visually confirmed.

### File List

- `components/shared/ConcernForm.tsx` (new)
- `components/shared/index.ts` (modified — barrel export)
- `app/report-concern.tsx` (new)
- `app/_layout.tsx` (modified — added `report-concern` to the guarded block)
- `app/about.tsx` (modified — added link to `/report-concern`)
- `locales/ta.json` (modified — new `concern` namespace)
- `_bmad-output/implementation-artifacts/deferred-work.md` (modified — logged the deferred email
  trigger and the missing `name` field)
