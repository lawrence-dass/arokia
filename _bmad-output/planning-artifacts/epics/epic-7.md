# Epic 7: Operator — Content Pipeline & Operations

The operator (Lawrence) can manage the full 7-stage content review pipeline (draft → published), regenerate audio for a single track during theological corrections, respond to user concerns, and monitor app health and donation summaries through Supabase admin + existing dashboards.

**FRs covered:** FR33, FR36, FR37, FR39, FR40

---

### Story 7.1: Content Management via Supabase Admin — Full Review Pipeline

As an operator,
I want to manage the full content review pipeline (draft → source_verified → advisor_reviewed → audio_generated → qa_passed → published) through Supabase admin, with each stage transition being a deliberate, logged action,
So that no content reaches users without passing every review gate, and the pipeline is auditable from first entry to publication.

**Acceptance Criteria:**

**Given** a new Jesus quote or meditation is created via Supabase admin
**When** the row is inserted
**Then** it is created with `review_status = 'draft'` by default; it is invisible to app users (RLS: only `published` rows returned)

**Given** the operator advances a row through the pipeline
**When** `review_status` is updated through each stage in sequence
**Then** each transition is a single column update in Supabase admin; the row remains invisible to app users until `review_status = 'published'` (FR36)

**Given** a row reaches `review_status = 'published'`
**When** the app's `contentStore` refreshes on next launch
**Then** the new content appears in the appropriate browse list without requiring an app store release

**Given** the content pipeline across all 71 MVP content items (50 quotes + 21 meditations)
**When** the operator completes the pipeline for all items
**Then** every item has `verse_reference NOT NULL`, `review_status = 'published'`, and a valid `audio_asset_id`

**Given** the operator updates a published item's metadata via Supabase admin
**When** the change is made
**Then** it is reflected in the app within 24 hours via Expo OTA content refresh — no app release required

---

### Story 7.2: Theological Correction — Per-Track Audio Regeneration & Public Disclosure

As an operator,
I want to correct a theological error in a published content item — updating the text, regenerating the audio, and publicly disclosing the correction in the Glass-Wall Budget — without affecting any other content items,
So that Arokia's correction loop is trustworthy and transparent: errors are fixed, not buried.

**Acceptance Criteria:**

**Given** a theological concern received via the in-app form or advisor email
**When** the operator reviews it in the `theological_concerns` table
**Then** the row's `status` can be updated to `under_review`, `resolved`, or `dismissed`; the submitter email is available for a personal reply (FR33)

**Given** the correction is confirmed
**When** the operator updates the content
**Then** the old item's `review_status` is set to `superseded`; a new row is inserted with `version = old_version + 1`, corrected `scripture_text` and `verse_reference`, `review_status = 'draft'` — it re-enters the full review pipeline

**Given** the corrected item reaches `review_status = 'audio_generated'`
**When** `scripts/generate-audio.ts --id <content_item_id>` is run
**Then** only the specified track's audio is regenerated and re-uploaded; no other audio files are affected (FR37)

**Given** the correction is published
**When** a `correction_log` row is inserted
**Then** it contains `content_item_id`, `old_version`, `new_version`, `issue_type`, and `public_note`; the `public_note` text is included in the next `generate-glass-wall.ts` output (FR32)

**Given** `scripts/generate-glass-wall.ts` is run after the correction
**When** the About page updates via OTA
**Then** the correction is publicly disclosed in the Glass-Wall Budget under a "Theological Corrections" section — visible to all users (FR32)

---

### Story 7.3: Operator Weekly Operations Workflow Validation

As an operator,
I want to verify that the full weekly operations loop — Sentry error review, Supabase content check, Razorpay donation review, and Glass-Wall Budget update — is completable in under 90 minutes using only existing dashboards and scripts,
So that Arokia's ongoing operations are sustainable for a solo founder with minimal weekly overhead.

**Acceptance Criteria:**

**Given** the Sentry dashboard
**When** the operator reviews it weekly
**Then** crash reports and error events are visible with stack traces; no PII appears in any error payload (FR39, NFR-PR2)

**Given** the Supabase admin dashboard
**When** the operator reviews content
**Then** they can see: total published items, items in each `review_status` stage, and any open `theological_concerns` — all without a custom admin UI (FR36)

**Given** the Razorpay dashboard
**When** the operator reviews donations
**Then** monthly totals, recurring donor count, and pay-it-forward allocation amounts are visible; webhook delivery status confirms all events processed (FR40)

**Given** the operator runs the full weekly loop (Sentry + Supabase + Razorpay + `generate-glass-wall.ts` + git commit + OTA push)
**When** timed end-to-end
**Then** the complete loop is achievable in under 90 minutes with no custom tooling

**Given** `docs/OPERATIONS_RUNBOOK.md`
**When** reviewed
**Then** it documents the weekly operations steps in order: (1) Sentry review, (2) Supabase content review, (3) Razorpay reconciliation, (4) Glass-Wall Budget generation + commit, (5) OTA push — repeatable and handover-ready
