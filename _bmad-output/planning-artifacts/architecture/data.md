# Architecture: Data Layer

## Supabase Schema — 9 Tables

### Table Creation Order (dependency order)

1. `audio_assets` (no FK deps)
2. `content_items` (refs audio_assets)
3. `correction_log` (refs content_items)
4. `theological_concerns` (refs content_items, optional)
5. `donations` (no FK deps)
6. `beneficiaries` (no FK deps)
7. `allocation_entries` (refs donations)
8. `disbursements` (refs beneficiaries)
9. `analytics_events` (no FK deps)

### Content Tables

```sql
audio_assets (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null,    -- relative path: 'ta/quote/abc123.m4a' — NEVER full CDN URL
  format       text not null default 'm4a',
  bitrate_kbps int  not null default 64,
  channels     int  not null default 1,  -- mono
  duration_sec int,
  created_at   timestamptz not null default now()
)

content_items (
  id             uuid primary key default gen_random_uuid(),
  title          text,
  practice_path  text not null,                  -- 'mind' | 'body' | 'soul'  (UX navigation layer)
  product_pillar text not null,                  -- 'word' | 'walk' | 'hope_faith_love' | 'integrity'  (editorial layer)
  content_type   text not null,                  -- 'quote' | 'meditation' | 'lectio' | 'sleep' | 'breathwork'
  language_code  text not null,                  -- 'ta' | 'hi' | 'te'
  time_of_day    text not null default 'any',    -- 'morning' | 'evening' | 'any'
  mood_tag       text not null default 'none',   -- 'anxious' | 'grieving' | 'angry' | 'lonely' | 'tempted' | 'none'
  review_status  text not null default 'draft',  -- 7-stage pipeline (see below)
  verse_reference text not null,                 -- e.g. 'Matthew 6:25' — NOT NULL; DB-enforced
  scripture_text  text not null,                 -- verbatim Tamil OV (or chosen translation)
  audio_asset_id  uuid references audio_assets(id),  -- null until audio_generated status
  version         int not null default 1,        -- incremented on each theological correction
  created_at      timestamptz not null default now(),
  published_at    timestamptz
)
-- review_status stages: draft → source_verified → advisor_reviewed → audio_generated → qa_passed → published → superseded

correction_log (
  id              uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id),
  old_version     int  not null,
  new_version     int  not null,
  issue_type      text not null,  -- 'translation' | 'misattribution' | 'audio' | 'verse_reference'
  public_note     text not null,  -- shown in Glass-Wall Budget public disclosure
  corrected_by    text,           -- advisor name or 'community' (no auth; free text)
  corrected_at    timestamptz not null default now()
)

theological_concerns (
  id              uuid primary key default gen_random_uuid(),
  content_item_id uuid references content_items(id),  -- optional
  description     text not null,
  submitter_email text,   -- optional; used for acknowledgment reply only
  status          text not null default 'open',  -- 'open' | 'under_review' | 'resolved' | 'dismissed'
  created_at      timestamptz not null default now()
)
```

### Donation Ledger Tables

```sql
donations (
  id                  uuid primary key default gen_random_uuid(),
  amount_paise        int  not null,
  status              text not null,  -- 'pending' | 'confirmed' | 'failed' | 'refunded'
  donor_email         text,           -- consent-gated; receipt delivery only
  razorpay_payment_id text unique,    -- unique: prevents duplicate webhook inserts (idempotency guard)
  received_at         timestamptz not null default now()
)

beneficiaries (
  id      uuid    primary key default gen_random_uuid(),
  name    text    not null,   -- e.g. 'Madurai Mercy Home'
  quarter text    not null,   -- e.g. '2026-Q2'
  active  boolean not null default true
)

allocation_entries (
  id           uuid primary key default gen_random_uuid(),
  donation_id  uuid not null references donations(id),
  bucket       text not null,       -- 'operations' | 'pay_forward'
  amount_paise int  not null,
  created_at   timestamptz not null default now()
)

disbursements (
  id             uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references beneficiaries(id),
  amount_paise   int  not null,
  paid_at        timestamptz,
  reference      text,   -- bank transfer ref or UPI transaction ID
  created_at     timestamptz not null default now()
)
```

### Analytics Table

```sql
analytics_events (
  id          uuid primary key default gen_random_uuid(),
  install_id  text not null,   -- UUID generated on first launch; never linked to identity
  event_type  text not null,   -- permitted values only (see below)
  content_id  uuid,            -- nullable; populated for content-related events
  created_at  timestamptz not null default now()
)
-- Permitted event_type values:
-- 'vow_completed' | 'meditation_started' | 'meditation_completed'
-- 'scripture_link_opened' | 'share_triggered' | 'donation_completed'
```

## RLS Policy Summary

| Table | Anonymous SELECT | Anonymous INSERT | Writes |
|---|---|---|---|
| `content_items` | `review_status = 'published'` only | ❌ | service-role only |
| `audio_assets` | ✅ public | ❌ | service-role only |
| `correction_log` | ❌ | ❌ | service-role only |
| `theological_concerns` | ❌ | ✅ (no SELECT back) | service-role only |
| `donations` | ❌ | ❌ | service-role only (webhook Edge Fn) |
| `beneficiaries` | ❌ | ❌ | service-role only |
| `allocation_entries` | ❌ | ❌ | service-role only (webhook Edge Fn) |
| `disbursements` | ❌ | ❌ | service-role only |
| `analytics_events` | ❌ | ✅ (anon key) | service-role reads |

**Key design decisions encoded in RLS:**
- Anonymous clients cannot read back their own `theological_concerns` row (privacy + spam prevention)
- `donations` and `allocation_entries` are service-role only — the app never creates donation records; only the webhook Edge Function does
- `analytics_events` anon INSERT allows anonymous usage tracking without an account

## Storage Bucket

Bucket name: `audio` (public CDN read; no auth required for GET)
All files: `.m4a` format, 64 kbps mono AAC
Path pattern: `ta/<content_type>/<content_item_id>.m4a`
Example: `ta/quote/abc123.m4a`, `ta/meditation/def456.m4a`

**Audio URL rule:** `audio_assets.storage_path` stores the **relative path only**. Never store full CDN URLs in the DB. Full URL resolved at runtime by `lib/audio.ts:resolveAudioUrl()` via `supabase.storage.from('audio').getPublicUrl(path)`.

## Audio Caching Strategy

- Format: 64 kbps mono AAC (.m4a). 7-min meditation ≈ 3.4 MB. 15 tracks ≈ 51 MB (satisfies NFR-P5).
- Storage location: `FileSystem.documentDirectory` (persistent across OS restarts and low-memory events).
- Cache manifest: `audioStore.downloadedTracks: Record<string, string>` — `contentId → localFilePath`. Avoids filesystem round-trips.

**Progressive download (not bulk pre-download):**
1. On first play: `lib/audio.ts:downloadTrack()` downloads immediately, plays from local cache.
2. After play starts: `lib/audio.ts:prefetchQueue()` silently pre-fetches next 2 tracks in queue.
3. Manual option: "Download This Week's Content" button (~30 MB for 9 tracks) with size estimate + progress.

## Migrations

- Tool: Supabase CLI (`supabase/migrations/` directory)
- Command: `supabase db push` (pushes to remote; no local Docker required)
- Naming: `YYYYMMDDHHmmss_<name>.sql`
- Rule: Never edit applied migration files. Add new migrations for schema changes.
- No raw dashboard edits ever — all schema changes via migration files.

## Indexes for Common Query Patterns

```sql
-- content_items: three main query patterns
create index idx_content_items_pub_lang_path on content_items (review_status, language_code, practice_path);
create index idx_content_items_pub_lang_mood on content_items (review_status, language_code, mood_tag);
create index idx_content_items_pub_lang_type on content_items (review_status, language_code, content_type);
```
