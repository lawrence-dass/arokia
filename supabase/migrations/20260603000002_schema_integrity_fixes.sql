-- =============================================================================
-- Schema integrity fixes (code review findings)
-- Migration: 20260603000002_schema_integrity_fixes.sql
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- content_items — enforce published_at is set when review_status = 'published'
-- Prevents items from entering the published feed with a NULL sort key.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.content_items
  add constraint content_items_published_at_required
    check (review_status != 'published' or published_at is not null);

-- ─────────────────────────────────────────────────────────────────────────────
-- theological_concerns — change content_item FK to ON DELETE SET NULL
-- The column is already nullable; RESTRICT (default) blocks deletion of any
-- content_item that has a linked concern. SET NULL is correct here — concerns
-- should survive content deletion as standalone operator records.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.theological_concerns
  drop constraint if exists theological_concerns_content_item_id_fkey,
  add constraint theological_concerns_content_item_id_fkey
    foreign key (content_item_id)
    references public.content_items(id)
    on delete set null;
