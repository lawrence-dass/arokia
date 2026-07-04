# Story 3.1: VerseText Component & Scripture Attribution Invariant

Status: review

## Story

As a developer,
I want a `VerseText` component that makes `reference` a non-optional TypeScript prop — and a `ScriptureCard` that enforces the same — so that it is impossible to render scripture without attribution at compile time.

## Acceptance Criteria

1. **Given** `components/scripture/VerseText.tsx`
   **When** reviewed
   **Then** it accepts `{ text: string; reference: string; languageCode: string }` with `reference` non-optional; a usage without `reference` is a TypeScript compile error, not a runtime check

2. **Given** `components/scripture/ScriptureCard.tsx`
   **When** it renders
   **Then** it always displays verbatim scripture text AND the full verse reference (book, chapter, verse) together — the reference cannot be conditionally hidden (FR13)

3. **Given** text at 1× system font size
   **When** the user scales system font to 1.5×
   **Then** both `VerseText` and `ScriptureCard` remain fully readable with no overflow or clipping (NFR-A2)

4. **Given** any text rendered by `VerseText`
   **When** contrast is checked
   **Then** it meets WCAG AA contrast ratios in both light and dark modes (NFR-A3)

5. **Given** `components/scripture/index.ts`
   **When** reviewed
   **Then** it exports `VerseText`, `ScriptureCard`, and `VerseCardView` (stub for Epic 5) as a barrel export

## Scope Note — `VerseCardView` is a stub, not the Epic 5 feature

AC5 explicitly calls `VerseCardView` a "stub for Epic 5." Epic 5's Story 5.1
("verse-card-generation-versecardview-component", `sprint-status.yaml`, currently `backlog`) is
where the real implementation lands: `react-native-view-shot` PNG capture, the Arokia mark, and
share-sheet wiring (`architecture.md#L448-452`). This story only locks in the attribution
invariant on `VerseCardView`'s prop shape now, at the same time as `VerseText`/`ScriptureCard`, so
every scripture-rendering component in the codebase enforces `reference: string` from day one —
it does not build any of Epic 5's actual card-generation/sharing behavior. Do not install
`react-native-view-shot` or wire `Share.share()` in this story.

## Tasks / Subtasks

- [x] **Create `components/scripture/VerseText.tsx`** (AC: 1, 3, 4)
  - [x] Props: `{ text: string; reference: string; languageCode: string }` — `reference` and `text` non-optional, no default values, no `?` — this is the actual TypeScript-level enforcement the story is about
  - [x] Render `text` and `reference` as two `<Text>` elements inside a `View` — do not truncate with `numberOfLines`, do not set `allowFontScaling={false}` anywhere (both would break NFR-A2's 1.5× scaling requirement)
  - [x] `languageCode` is accepted (locks in the architecture-mandated prop shape for future `hi`/`te` support, v1.1) but has no visual effect yet — system Tamil fonts render Tamil correctly with zero font-family switching needed today; add a one-line comment noting this is reserved for future per-language handling, not dead code
  - [x] Use existing design tokens for contrast: `text-text-primary` for the verse text, `text-text-secondary` for the reference — both already meet WCAG AA on `bg-surface`/`bg-background` elsewhere in this codebase (no new color tokens needed)

- [x] **Create `components/scripture/ScriptureCard.tsx`** (AC: 2, 3, 4)
  - [x] Wraps `VerseText` in a `Pressable` card container (`rounded-card`, `border-border-light`, `bg-surface`, padding) — matches the `NativeWind`-only styling convention used by every prior component
  - [x] Props: `{ text: string; reference: string; languageCode: string; onPress?: () => void }` — `onPress` optional (Story 3.2's list will always pass one; a bare display use doesn't need to)
  - [x] Text and reference render unconditionally — no prop or code path can produce a `ScriptureCard` that hides the reference (AC 2's actual requirement: this is a structural guarantee, not a toggle that happens to default to "on")

- [x] **Create `components/scripture/VerseCardView.tsx` (stub)** (AC: 5)
  - [x] Same required prop shape as `VerseText` (`text`, `reference`, `languageCode`) — no `onPress`, no capture/share logic (see Scope Note)
  - [x] A short comment pointing to Story 5.1 as where the real implementation lands

- [x] **Update `components/scripture/index.ts` barrel** (AC: 5)
  - [x] Export `VerseText`, `ScriptureCard`, `VerseCardView`

- [x] **Verification** (AC: all)
  - [x] `npm run format` after all file writes
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 new warnings
  - [x] Compile-error check: temporarily write `<VerseText text="x" languageCode="ta" />` (no `reference`) somewhere, confirm `tsc` fails, then remove it — this IS the acceptance test for AC 1, and it's the one part of this story fully verifiable without a simulator
  - [ ] Simulator walkthrough — **pending desktop verification, see Dev Agent Record**: render a `ScriptureCard` with real Tamil text at 1× and 1.5× system font scale, confirm no clipping; spot-check contrast in light mode (dark mode isn't built yet — see Dev Notes)

## Dev Notes

### Critical Architecture Requirements (MUST follow)

- **Exact prop shape is architecture-mandated, not a suggestion**: `{ text: string; reference:
  string; languageCode: string }` — [Source: architecture.md#L439-446, architecture/frontend.md#L39-46]
- **`components/scripture/` is the only home for these three components** — no new directory
- **`@/` path aliases only**, NativeWind `className` only, zero hardcoded strings (this story has
  no user-facing copy — `text`/`reference` are runtime data from callers, not new `ta.json` keys)
- **Barrel-only imports**: future stories import `import { VerseText, ScriptureCard } from
  '@/components/scripture'`, never a direct file path [Source: architecture/frontend.md#L34]

### Dark Mode Note

AC4 mentions "both light and dark modes," but this codebase has no dark mode implementation yet
(no theme-switching mechanism exists anywhere in `constants/theme.ts`/`tailwind.config.js` as of
this story). Using the existing semantic color tokens (`text-primary`, `text-secondary`,
`bg-surface`) is the correct forward-compatible choice — if/when dark mode is added, it's a
tailwind-theme-level change, not a per-component one — but the "verified in dark mode" half of
AC4 cannot be satisfied today because dark mode doesn't exist. Documented here rather than
silently ignored; not a gap introduced by this story.

### Existing Code You Are Building On (do NOT reinvent)

- `types/content.ts:ContentItem.verseReference: string` — already non-nullable, matches this
  story's invariant on the data side. `ContentItem.scriptureText`/`.languageCode` map directly to
  `VerseText`'s `text`/`languageCode` props.
- `constants/colors.ts` / `tailwind.config.js` — use existing tokens (`text-primary`,
  `text-secondary`, `surface`, `border-light`, `card` border radius); do not add new ones.
- No prior component in `components/scripture/` exists yet (directory only has the barrel
  scaffold) — this story creates the first three.

### Testing Standards

No test suite exists yet, though `architecture.md#L555` names a co-located `VerseText.test.tsx`
convention for whenever a test framework lands (not this story — Story 1.5's CI doesn't run a
test suite yet per `CLAUDE.md`). Verification here is tsc (including the compile-error check
above, which is the actual proof of AC 1) + lint + a desktop simulator pass for the visual/
font-scaling ACs.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-3.md#Story 3.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#L426, #L439-452, #L878-882, #L1092]
- [Source: _bmad-output/planning-artifacts/architecture/frontend.md#L26, #L34, #L39-46, #L82, #L86]
- [Source: _bmad-output/planning-artifacts/prd.md#FR13, NFR-A2, NFR-A3]
- [Source: types/content.ts#ContentItem]

## Dev Agent Record

### Agent Model Used

Claude (Claude Code, cloud/mobile session)

### Debug Log References

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 1 pre-existing warning (`lib/i18n.ts:8`, known, not in scope)
- `npm run format` — clean
- `bash scripts/audit-trackers.sh` — passed
- AC1 compile-error proof: temporarily added `<VerseText text="x" languageCode="ta" />` (no
  `reference`) to a scratch file → `tsc` failed with `TS2741: Property 'reference' is missing` →
  removed the scratch file → `tsc` clean again. This is the actual verification for AC1, not a
  simulator-dependent check.

### Completion Notes List

- All three components (`VerseText`, `ScriptureCard`, `VerseCardView`) share the exact
  architecture-mandated prop shape. `VerseCardView` is intentionally a stub — no
  `react-native-view-shot`, no share logic — per the Scope Note; Story 5.1 builds the real thing.
- `languageCode` is accepted but not yet used for any visual branching (no per-language font
  switching exists in this codebase) — reserved for v1.1 per the Dev Notes.
- Dark mode half of AC4 is unverifiable — this codebase has no dark mode implementation at all
  yet (see Dev Notes "Dark Mode Note"). Not a gap this story introduced.
- **Pending desktop verification (cannot run in this cloud session — no simulator/device access):**
  - Visual check of `ScriptureCard`/`VerseText` with real Tamil text at 1× and 1.5× system font
    scale (NFR-A2) — no clipping/overflow expected given the flexible `View`/no-`numberOfLines`
    layout, but not visually confirmed.
  - WCAG AA contrast spot-check in light mode with actual rendered Tamil glyphs (the color tokens
    are already used elsewhere in the app without flagged contrast issues, but not independently
    measured for this specific text size/weight combination).

### File List

- `components/scripture/VerseText.tsx` (new)
- `components/scripture/ScriptureCard.tsx` (new)
- `components/scripture/VerseCardView.tsx` (new)
- `components/scripture/index.ts` (modified — barrel export)
