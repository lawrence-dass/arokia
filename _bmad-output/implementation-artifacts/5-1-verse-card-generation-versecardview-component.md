# Story 5.1: Verse Card Generation — VerseCardView Component

Status: done

## Story

As a Tamil Christian user,
I want a shareable verse card generated from any Jesus quote — verbatim text, verse reference, and the Arokia mark — built entirely on-device,
so that I can create and share scripture even in airplane mode or poor connectivity.

## Acceptance Criteria

1. `VerseCardView` displays (1) verbatim scripture text, (2) the full verse reference, (3) the Arokia name/mark — the reference is part of the composition and cannot be omitted (FR42).
2. `react-native-view-shot` can capture `VerseCardView` to a PNG entirely on-device, no network (NFR-P6).
3. Tamil text renders with system fonts, no glyph fallback; the Arokia mark is legible.
4. `tsc --noEmit` errors if `VerseCardView` is used without a `reference` prop — the attribution invariant extends to the card (FR42).

## Tasks / Subtasks

- [x] **`react-native-view-shot`** installed via `expo install` (4.0.3). Native module → needs a device rebuild to exercise capture.
- [x] **Enhance `VerseCardView`** — `forwardRef<View>` + `collapsable={false}` (so view-shot can capture it, incl. Android), branded card surface, `VerseText` for verse+reference (single source, attribution invariant), Arokia mark. `reference` stays a required prop (AC4 holds — tsc errors without it).
- [x] **`lib/verseCard.ts:captureVerseCard(ref)`** — wraps `captureRef(ref, { format: 'png', ... })`, returns the PNG file uri. On-device, no network.
- [x] **i18n** — `common.appName` ("Arokia") for the mark (ta + en).
- [x] **Verify** — tsc + lint clean. On-device PNG capture (AC2/AC3) → pending device rebuild + pass. Share sheet wiring is Story 5.2.

## Dev Notes

- `VerseCardView` was a stub composing `VerseText` inside a card surface. This story makes it capturable and branded; `VerseText` remains the single source of verse+reference rendering so card and inline never drift.
- `captureVerseCard` returns a uri that **Story 5.2** feeds to the share sheet (WhatsApp/system). No share UI here.
- Brand mark uses `common.appName` (proper-noun wordmark) to keep the zero-hardcoded-strings invariant clean.
- **OUT of scope:** the share action/sheet (5.2), Sunday tracker (5.3).

### References

- [Source: epics/epic-5.md#Story 5.1] — ACs (FR42, NFR-P6).
- [Source: CLAUDE.md] — scripture attribution invariant; VerseText is the codified pattern.

## Dev Agent Record

### Agent Model Used
claude-opus-4-8 (Winston session, 2026-07-07)

### Completion Notes List
- Branded, ref-forwarding `VerseCardView` + `captureVerseCard` util + `react-native-view-shot`. tsc + lint clean. PNG capture pending device rebuild (native module).

### File List
- `components/scripture/VerseCardView.tsx`, `lib/verseCard.ts` (new), `locales/en.json`, `locales/ta.json`, `package.json`/`package-lock.json`
