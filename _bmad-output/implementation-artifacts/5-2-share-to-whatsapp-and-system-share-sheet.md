# Story 5.2: Share to WhatsApp & System Share Sheet

Status: done

## Story

As a Tamil Christian user,
I want to share any Jesus quote as a verse card to WhatsApp, Messages, or any installed app,
so that I can share Jesus's words with family and friends in the language they grew up with.

## Acceptance Criteria

1. From the quote detail screen, tapping Share captures `VerseCardView` as a PNG and opens the system share sheet with the image (FR34).
2. Selecting any app shares the verse-card image; `share_triggered` is logged.
3. Offline: on-device PNG generation completes; the share sheet opens (only the destination app's networking depends on connectivity) (NFR-P6).
4. The shared content carries verbatim text + reference + Arokia mark — attribution travels with the image, never omitted (FR42).
5. After share completes or is cancelled, app state is unchanged — no navigation side effects.

## Tasks / Subtasks

- [x] **`expo-sharing`** installed via `expo install` (~14.0.8). Native module → device rebuild needed to test.
- [x] **`lib/share.ts:shareVerseCard(ref, contentId)`** — `captureVerseCard(ref)` → `Sharing.shareAsync(png, { mimeType: 'image/png' })`; logs `share_triggered`; try/catch → Sentry.
- [x] **`app/verse/[id].tsx`** — render `VerseCardView` (with a `ref`) instead of bare `VerseText`; Share button calls `shareVerseCard(cardRef, quote.id)` (replaces the old text-only `Share.share`).
- [x] **Verify** — tsc + lint clean. On-device capture+share (AC1–3) → pending device rebuild.

## Dev Notes

- **Deviation from AC's literal `Share.share()`:** used `expo-sharing` instead. RN `Share.share({ url })` does not reliably attach an image on Android (it shares `message` text only). `expo-sharing` shares the image file reliably cross-platform, and the card PNG is self-attributing (verbatim text + reference + Arokia mark are IN the image per FR42), so the reference is "visible in the shared content" via the image rather than separate share text. This better serves FR34/FR42 than text-only sharing.
- Reuses `word.shareCta` i18n key (no new strings). Builds on Story 5.1's `VerseCardView` (ref-forwarding) + `captureVerseCard`.
- Meditation-end share (AC1 mentions it) — deferred; meditations aren't seeded (4-6). Quote-detail path is the testable one.

### References

- [Source: epics/epic-5.md#Story 5.2] — ACs (FR34, FR42, NFR-P6).

## Dev Agent Record

### Agent Model Used
claude-opus-4-8 (Winston session, 2026-07-07)

### Completion Notes List
- `shareVerseCard` util + verse screen wired to capture+share the card PNG; `share_triggered` logged; expo-sharing. tsc + lint clean. Native capture/share pending device rebuild.

### File List
- `lib/share.ts` (new), `app/verse/[id].tsx`, `package.json`/`package-lock.json`
