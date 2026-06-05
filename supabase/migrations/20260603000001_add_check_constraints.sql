-- =============================================================================
-- Code review fixes — check constraints, description guard, audio FK cascade
-- Migration: 20260603000001_add_check_constraints.sql
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- content_items — enum columns
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.content_items
  add constraint content_items_review_status_check
    check (review_status in ('draft','source_verified','advisor_reviewed','audio_generated','qa_passed','published','superseded')),
  add constraint content_items_practice_path_check
    check (practice_path in ('mind','body','soul')),
  add constraint content_items_product_pillar_check
    check (product_pillar in ('word','walk','hope_faith_love','integrity')),
  add constraint content_items_content_type_check
    check (content_type in ('quote','meditation','lectio','sleep','breathwork')),
  add constraint content_items_time_of_day_check
    check (time_of_day in ('morning','evening','any')),
  add constraint content_items_mood_tag_check
    check (mood_tag in ('anxious','grieving','angry','lonely','tempted','none'));

-- language_code is intentionally not constrained — expected to expand beyond initial 'ta'|'hi'|'te'

-- ─────────────────────────────────────────────────────────────────────────────
-- content_items — audio FK: set null on audio_asset deletion (matches nullable column intent)
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.content_items
  drop constraint if exists content_items_audio_asset_id_fkey,
  add constraint content_items_audio_asset_id_fkey
    foreign key (audio_asset_id)
    references public.audio_assets(id)
    on delete set null;

-- ─────────────────────────────────────────────────────────────────────────────
-- analytics_events — restrict event_type to known values
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.analytics_events
  add constraint analytics_events_event_type_check
    check (event_type in ('vow_completed','meditation_started','meditation_completed','scripture_link_opened','share_triggered','donation_completed'));

-- ─────────────────────────────────────────────────────────────────────────────
-- theological_concerns — enum + description length guard
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.theological_concerns
  add constraint theological_concerns_status_check
    check (status in ('open','under_review','resolved','dismissed')),
  add constraint theological_concerns_description_length_check
    check (char_length(description) between 10 and 2000);

-- ─────────────────────────────────────────────────────────────────────────────
-- donations — status enum
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.donations
  add constraint donations_status_check
    check (status in ('pending','confirmed','failed','refunded'));

-- ─────────────────────────────────────────────────────────────────────────────
-- correction_log — issue_type enum
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.correction_log
  add constraint correction_log_issue_type_check
    check (issue_type in ('translation','misattribution','audio','verse_reference'));

-- ─────────────────────────────────────────────────────────────────────────────
-- allocation_entries — bucket enum
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.allocation_entries
  add constraint allocation_entries_bucket_check
    check (bucket in ('operations','pay_forward'));
