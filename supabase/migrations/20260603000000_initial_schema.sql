-- =============================================================================
-- Arokia initial schema — 9 tables
-- Migration: 20260603000000_initial_schema.sql
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. audio_assets (no FK dependencies — create before content_items)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.audio_assets (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null,          -- relative Supabase Storage path: 'ta/quote/abc123.m4a'
  format       text not null default 'm4a',
  bitrate_kbps int  not null default 64,
  channels     int  not null default 1,  -- mono
  duration_sec int,
  created_at   timestamptz not null default now()
);

alter table public.audio_assets enable row level security;
create policy "audio_assets_public_read"
  on public.audio_assets for select using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. content_items (references audio_assets)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.content_items (
  id             uuid primary key default gen_random_uuid(),
  title          text,
  practice_path  text not null,                 -- 'mind' | 'body' | 'soul'
  product_pillar text not null,                 -- 'word' | 'walk' | 'hope_faith_love' | 'integrity'
  content_type   text not null,                 -- 'quote' | 'meditation' | 'lectio' | 'sleep' | 'breathwork'
  language_code  text not null,                 -- 'ta' | 'hi' | 'te'
  time_of_day    text not null default 'any',   -- 'morning' | 'evening' | 'any'
  mood_tag       text not null default 'none',  -- 'anxious' | 'grieving' | 'angry' | 'lonely' | 'tempted' | 'none'
  review_status  text not null default 'draft', -- see 7-stage workflow below
  verse_reference text not null,                -- e.g. 'Matthew 6:25' — NOT NULL at DB level
  scripture_text  text not null,                -- verbatim Tamil OV; never paraphrased
  audio_asset_id  uuid references public.audio_assets(id),  -- null until audio_generated stage
  version         int  not null default 1,      -- incremented on each theological correction
  created_at      timestamptz not null default now(),
  published_at    timestamptz
);

-- review_status 7-stage: draft → source_verified → advisor_reviewed → audio_generated → qa_passed → published → superseded

alter table public.content_items enable row level security;
create policy "content_items_published_only"
  on public.content_items for select
  using (review_status = 'published');

create index idx_content_items_pub_lang_path
  on public.content_items (review_status, language_code, practice_path);
create index idx_content_items_pub_lang_mood
  on public.content_items (review_status, language_code, mood_tag);
create index idx_content_items_pub_lang_type
  on public.content_items (review_status, language_code, content_type);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. correction_log (references content_items)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.correction_log (
  id              uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id),
  old_version     int  not null,
  new_version     int  not null,
  issue_type      text not null,  -- 'translation' | 'misattribution' | 'audio' | 'verse_reference'
  public_note     text not null,  -- rendered in Glass-Wall Budget disclosure
  corrected_by    text,           -- advisor name or 'community' (no auth; free text)
  corrected_at    timestamptz not null default now()
);

alter table public.correction_log enable row level security;
-- service-role only — no anon policies

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. theological_concerns (optional ref to content_items)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.theological_concerns (
  id              uuid primary key default gen_random_uuid(),
  content_item_id uuid references public.content_items(id),  -- optional
  description     text not null,
  submitter_email text,   -- optional; receipt-only; never marketing
  status          text not null default 'open',  -- 'open' | 'under_review' | 'resolved' | 'dismissed'
  created_at      timestamptz not null default now()
);

alter table public.theological_concerns enable row level security;
create policy "theological_concerns_anon_insert"
  on public.theological_concerns for insert
  with check (true);
-- No SELECT policy for anon: submitter cannot read back their own row (privacy + spam prevention)

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. donations (no FK dependencies)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.donations (
  id                  uuid primary key default gen_random_uuid(),
  amount_paise        int  not null,
  status              text not null,  -- 'pending' | 'confirmed' | 'failed' | 'refunded'
  donor_email         text,           -- consent-gated; receipt delivery only (NFR-S4)
  razorpay_payment_id text unique,    -- unique: prevents duplicate webhook records (NFR-R4)
  received_at         timestamptz not null default now()
);

alter table public.donations enable row level security;
-- service-role only — no anon access to donations

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. beneficiaries (no FK dependencies)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.beneficiaries (
  id      uuid    primary key default gen_random_uuid(),
  name    text    not null,  -- e.g. 'Madurai Mercy Home'
  quarter text    not null,  -- e.g. '2026-Q2'
  active  boolean not null default true
);

alter table public.beneficiaries enable row level security;
-- service-role only

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. allocation_entries (references donations)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.allocation_entries (
  id           uuid primary key default gen_random_uuid(),
  donation_id  uuid not null references public.donations(id),
  bucket       text not null,        -- 'operations' | 'pay_forward'
  amount_paise int  not null,
  created_at   timestamptz not null default now()
);

alter table public.allocation_entries enable row level security;
-- service-role only

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. disbursements (references beneficiaries)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.disbursements (
  id             uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.beneficiaries(id),
  amount_paise   int  not null,
  paid_at        timestamptz,
  reference      text,  -- bank transfer ref or UPI transaction ID
  created_at     timestamptz not null default now()
);

alter table public.disbursements enable row level security;
-- service-role only

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. analytics_events (no FK dependencies)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.analytics_events (
  id          uuid primary key default gen_random_uuid(),
  install_id  text not null,  -- UUID generated on first app launch; never linked to identity
  event_type  text not null,  -- permitted: see list below
  content_id  uuid,           -- nullable; populated for content events
  created_at  timestamptz not null default now()
);

-- Permitted event_type values (no others stored):
-- 'vow_completed' | 'meditation_started' | 'meditation_completed'
-- 'scripture_link_opened' | 'share_triggered' | 'donation_completed'

alter table public.analytics_events enable row level security;
create policy "analytics_events_anon_insert"
  on public.analytics_events for insert
  with check (true);
-- Reads: service-role only (no anon SELECT policy)
