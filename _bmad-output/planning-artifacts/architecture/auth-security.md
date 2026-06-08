# Architecture: Auth & Security

## No Supabase Auth Through v1.1

**Decision:** The app makes zero `supabase.auth.*` calls in v1 and v1.1. All content is public-read via RLS. No user accounts, no sessions, no tokens.

**Rationale:** Core features require no identity (NFR-PR1); personal highlights (v1.1) are local-device-only; donor email is collected by Razorpay, not Arokia. First auth surface is Pastor Portal (v2+).

**Enforcement:** Never call any Supabase Auth method (`supabase.auth.*`) — this is a mandatory rule for all implementation agents.

## Razorpay Webhook: Supabase Edge Function

**Endpoint:** `POST /functions/v1/razorpay-webhook` (public URL; security via HMAC)

**Logic:**
1. Verify Razorpay HMAC signature using `RAZORPAY_WEBHOOK_SECRET` — reject and log if invalid (400 response, no DB write)
2. Begin Postgres transaction:
   - Insert `donations` row (`status: 'confirmed'`)
   - Insert `allocation_entries` row for `'operations'` bucket (90% of `amount_paise`)
   - Insert `allocation_entries` row for `'pay_forward'` bucket (10% of `amount_paise`)
3. Commit — all three inserts succeed or all rollback (atomicity guarantee)
4. Send acknowledgment email

**Idempotency:** `razorpay_payment_id TEXT UNIQUE` on `donations` table. Duplicate webhooks cause a conflict error — no duplicate record created.

**Glass-Wall Budget numbers** are derived from `allocation_entries` + `disbursements` queries, not from manual markdown edits.

## Secrets Management

| Secret | Location | Committed to git? |
|---|---|---|
| Supabase URL + anon key | Expo EAS env vars (build-time) / `.env.local` (local dev) | ❌ Never |
| Razorpay key ID (public) | Expo EAS env vars (build-time) | ❌ Never in source |
| Razorpay webhook secret | Supabase Edge Function env var | ❌ Never in app binary |
| ElevenLabs API key | Local `.env` for scripts only | ❌ Never in app or CI |
| Supabase service role key | Supabase Edge Function env var | ❌ Never in app binary |
| Supabase personal access token | CLI session (`supabase login`) | ❌ Never |

**Critical rule:** The anon key is safe in the app binary (it is a public key restricted by RLS). All other secrets must never appear in the app binary, git history, or CI artifacts.

**Grep check for hardcoded credentials:**
```bash
grep -r "supabase\.co\|eyJ" --include="*.ts" --include="*.tsx" lib/ app/ components/ store/ types/
# Must return 0 results
```

## Tracker Audit (NFR-S5)

GitHub Actions CI step on every PR: grep for forbidden packages in `package.json` + `ios/Podfile` + `android/build.gradle`:

Forbidden packages: `firebase`, `@react-native-firebase`, `mixpanel`, `mixpanel-react-native`, `amplitude`, `@amplitude`, `react-native-google-analytics`, `facebook-sdk`, `@facebook/react-native-fbsdk-next`

CI fails if any are found. This enforces NFR-S5 (zero trackers in production build).

## Privacy Constraints

- **NFR-PR1:** No account required for any core feature
- **NFR-PR2:** No analytics data linked to individual identity — `analytics_events.install_id` is a random UUID generated on first launch, never tied to a person
- **NFR-S4:** Only PII stored is donor email — consent-gated, receipt-only, never marketing
- **NFR-S2:** No payment PII in Arokia DB — Razorpay handles all card/UPI/banking data

## install_id Generation

`analytics_events.install_id` is a UUID generated on first app launch and stored in `expo-secure-store` (device keychain). Never synced to a server. Never linked to a person. Survives app updates but is reset on app reinstall.

```typescript
// lib/analytics.ts pattern
import * as SecureStore from 'expo-secure-store';

async function getInstallId(): Promise<string> {
  let id = await SecureStore.getItemAsync('install_id');
  if (!id) {
    id = crypto.randomUUID();
    await SecureStore.setItemAsync('install_id', id);
  }
  return id;
}
```
