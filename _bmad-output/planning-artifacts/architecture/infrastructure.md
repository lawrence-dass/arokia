# Architecture: Infrastructure & Deployment

## CI/CD: GitHub Actions + Expo EAS

- Every PR: TypeScript strict type-check + ESLint + tracker audit (grep for forbidden SDKs)
- EAS Build: manually triggered for preview (TestFlight / Firebase App Distribution) and production (App Store / Play Store) releases
- Expo Updates (OTA): theological corrections, content data changes, JS-layer fixes without App Store review cycle

## Three EAS Build Profiles

| Profile | Target | Distribution |
|---|---|---|
| `development` | Expo Go / dev client | Local device |
| `preview` | Internal testing | TestFlight + Firebase App Distribution |
| `production` | Public release | App Store + Google Play |

## OTA Boundary

What can be updated via Expo Updates OTA (no App Store review):
- `app/`, `components/`, `lib/`, `store/`, `locales/`, `docs/`

What requires a full EAS build:
- New native modules, native config changes, `supabase/functions/` (deploy separately)

`scripts/` are never deployed — they run locally or in CI as operator tools.

## Glass-Wall Budget

**Flow:** `scripts/generate-glass-wall.ts` → queries `allocation_entries` + `disbursements` + `beneficiaries` → writes `docs/glass-wall-budget.md` → Lawrence commits → git is the auditable record → Expo Updates OTA → About screen renders via `react-native-markdown-display` within 24 hours.

- No manual math risk — numbers derived from DB ledger queries
- Each git commit message names the disbursement event
- Offline: `glass-wall-budget.md` is bundled and renders without network

## ElevenLabs Audio Generation (Server-Side Only)

`scripts/generate-audio.ts` (Node.js):
1. Reads `scripture_text` and `verse_reference` from `content_items`
2. Calls ElevenLabs Multilingual v2 Tamil voice at 64 kbps mono AAC
3. Uploads `.m4a` to `audio` Supabase Storage at `ta/<content_type>/<content_item_id>.m4a`
4. Inserts `audio_assets` row, updates `content_items.audio_asset_id`

Per-track regeneration: `npx ts-node scripts/generate-audio.ts --id <content_id>`

ElevenLabs API key lives only in local `.env` for scripts — **never in the app binary or CI artifacts.**

## Monitoring

- **Sentry** (free tier): crash reports + error tracking. `beforeSend` hook strips all PII — error messages and stack traces only, no user context.
- **Supabase dashboard**: DB query performance, storage usage, Edge Function logs, theological_concerns queue.
- **Razorpay dashboard**: donation totals, recurring donors, webhook delivery status.

## Supabase Edge Functions

```
supabase/functions/
  razorpay-webhook/
    index.ts        — HMAC verify → atomic transaction (donations + 2× allocation_entries) → email
    deno.json
  concern-notification/
    index.ts        — DB webhook on theological_concerns INSERT → acknowledgment email (FR31)
    deno.json
```

Deploy: `supabase functions deploy razorpay-webhook --no-verify-jwt`

## Platform Requirements

| Requirement | Decision |
|---|---|
| iOS minimum | iOS 16+ |
| Android minimum | Android 11 (API 30)+ |
| Build system | Expo EAS Build |
| OTA updates | Expo Updates (non-breaking JS changes) |

## Device Permissions

| Permission | Platform | Required? |
|---|---|---|
| `FOREGROUND_SERVICE` (Audio) | Android | Required |
| `WAKE_LOCK` | Android | Required |
| Internet access | Both | Required |
| Microphone | Both | NOT in MVP (v2 voice journaling) |
| Notifications | Both | NOT requested (ever) |
| Camera | Both | Never |
| Location | Both | Never |

Zero push notifications — permanent product decision, not MVP scope reduction. No FCM/APNs tokens registered.
