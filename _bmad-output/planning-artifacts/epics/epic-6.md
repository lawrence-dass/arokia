# Epic 6: Integrity — Donation & Glass-Wall Transparency

Users can donate (one-time or recurring) via Razorpay with full consent, receive a receipt acknowledgment, and see the complete Glass-Wall Budget showing every rupee received, spent, and paid forward to the named quarterly beneficiary — with 10% allocated atomically at each transaction.

**FRs covered:** FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR38

---

### Story 6.1: Razorpay Donation Flow — One-Time & Recurring

As a Tamil Christian donor,
I want to make a one-time or monthly recurring donation via Razorpay, with an explicit email consent statement before I provide my details,
So that I can support Arokia's mission in the way that suits me, knowing my data is used only for receipt delivery.

**Acceptance Criteria:**

**Given** the user opens the donation screen
**When** they choose one-time or recurring
**Then** before any email field appears, an explicit consent statement is displayed in Tamil: email will be used only for receipt delivery, not for marketing — the user must proceed past it before the email field is shown (FR25)

**Given** the user completes the donation flow
**When** they tap "Donate"
**Then** Razorpay opens in an external webview (`SFSafariViewController` on iOS, Custom Tab on Android) — no payment data enters Arokia's codebase (FR23, NFR-S2)

**Given** the Razorpay external webview
**When** the payment is completed successfully
**Then** Razorpay redirects back to the app; the user sees a confirmation screen with the donation amount and pay-it-forward note

**Given** recurring donation is selected
**When** the user completes the Razorpay mandate flow
**Then** the recurring donation is established via Razorpay's UPI AutoPay or e-NACH; the app shows a success state (FR24)

**Given** the donation screen
**When** there is no network connection
**Then** a clear offline indicator is shown; the donation flow does not attempt to launch — no partial state is created (NFR-R3, NFR-R4)

**Given** all donation screen strings
**When** reviewed
**Then** zero are hardcoded — all come from `ta.json` donation namespace (NFR-I1)

---

### Story 6.2: Razorpay Webhook — Atomic Donation Record & Pay-It-Forward Allocation

As an operator,
I want each confirmed Razorpay payment to atomically create a donation record and allocate 10% to the current pay-it-forward beneficiary in a single transaction,
So that no donation is ever recorded without its allocation and no allocation is ever created without a confirmed payment.

**Acceptance Criteria:**

**Given** a Supabase Edge Function at `POST /functions/v1/razorpay-webhook`
**When** a Razorpay webhook event arrives
**Then** the HMAC signature is verified using `RAZORPAY_WEBHOOK_SECRET` before any DB write — an invalid signature results in a 400 response and no DB write (NFR-S3)

**Given** a valid confirmed payment webhook
**When** the Edge Function processes it
**Then** in a single Postgres transaction: (1) one `donations` row inserted with `status = 'confirmed'`; (2) one `allocation_entries` row for `bucket = 'operations'` (90%); (3) one `allocation_entries` row for `bucket = 'pay_forward'` (10%) — all three succeed or all three roll back (FR26, NFR-R4)

**Given** a duplicate webhook for the same `razorpay_payment_id`
**When** the Edge Function processes it
**Then** the unique constraint on `razorpay_payment_id` causes a conflict error; no duplicate record is created

**Given** the transaction commits and donor email is present
**When** the acknowledgment email is sent
**Then** it confirms the amount and names the current pay-it-forward beneficiary (FR27)

**Given** the `donations` table
**When** inspected for PII
**Then** only `donor_email`, `amount_paise`, `razorpay_payment_id`, and `received_at` are stored — no card numbers, no UPI handles, no bank details (NFR-S2, NFR-S4)

---

### Story 6.3: Glass-Wall Budget — Generation Script & In-App Display

As any user or donor,
I want to see the complete Glass-Wall Budget showing every rupee received, spent, and paid forward — including the current quarter's named beneficiary — rendered from version-controlled data,
So that I can trust Arokia's financial integrity before, during, and after donating.

**Acceptance Criteria:**

**Given** `scripts/generate-glass-wall.ts` is run
**When** it executes
**Then** it queries `allocation_entries`, `disbursements`, and `beneficiaries` and writes `docs/glass-wall-budget.md` with: cumulative income, operations spend, pay-it-forward allocated, total disbursed, and the current quarter's named beneficiary (FR28, FR29)

**Given** the generated markdown file
**When** committed to git and the app is updated via Expo OTA
**Then** the About page renders the new budget within 24 hours of the commit using `react-native-markdown-display` (FR38)

**Given** the About page rendering the budget
**When** a donor views it
**Then** they see: total donations received, operational costs breakdown, pay-it-forward amount this quarter, and the named beneficiary with amount committed (FR29)

**Given** the script output
**When** compared against manual arithmetic from the DB
**Then** all figures match exactly — no manual math risk; the git commit history is the auditable record

**Given** the `docs/glass-wall-budget.md` file
**When** the app loads offline
**Then** the budget renders correctly without any network request (NFR-R3)

---

### Story 6.4: Donation Summary & Pay-It-Forward Beneficiary Management

As an operator,
I want to view donation totals from the Razorpay dashboard, manage the current pay-it-forward beneficiary in Supabase, and update the Glass-Wall Budget so users see the latest numbers,
So that the full transparency loop from donation → allocation → disclosure → beneficiary operates without any custom admin UI.

**Acceptance Criteria:**

**Given** the Razorpay dashboard
**When** the operator logs in
**Then** donation totals, recurring donor count, and webhook delivery status are visible (FR40) — no custom dashboard needed in v1

**Given** the `beneficiaries` table in Supabase admin
**When** a new quarter begins
**Then** the operator can insert a new `beneficiaries` row with `name`, `quarter`, `active = true` and set the previous beneficiary's `active = false`; this immediately affects the next `generate-glass-wall.ts` run

**Given** a new `disbursements` row inserted via Supabase admin
**When** `scripts/generate-glass-wall.ts` is run
**Then** the script output reflects the new disbursement; the committed markdown is the public, auditable record (FR38)

**Given** `lib/donations.ts:getDonationSummary()` and `getPayForwardSummary()`
**When** called
**Then** they return correct aggregated figures from `allocation_entries` and `disbursements` — these functions power the About page budget display
