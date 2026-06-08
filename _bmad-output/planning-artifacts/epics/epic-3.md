# Epic 3: The Word — Scripture Browser & Search

Users can browse all 50 Jesus quotes in Tamil with verbatim text and mandatory verse attribution, and search the content library by topic or keyword. The VerseText TypeScript invariant is the cornerstone — a scripture display without attribution is a compile error.

**FRs covered:** FR10, FR11, FR13, FR22

---

### Story 3.1: VerseText Component & Scripture Attribution Invariant

As a developer,
I want a `VerseText` component that makes `reference` a non-optional TypeScript prop — and a `ScriptureCard` that enforces the same — so that it is impossible to render scripture without attribution at compile time.

**Acceptance Criteria:**

**Given** `components/scripture/VerseText.tsx`
**When** reviewed
**Then** it accepts `{ text: string; reference: string; languageCode: string }` with `reference` non-optional; a usage without `reference` is a TypeScript compile error, not a runtime check

**Given** `components/scripture/ScriptureCard.tsx`
**When** it renders
**Then** it always displays verbatim scripture text AND the full verse reference (book, chapter, verse) together — the reference cannot be conditionally hidden (FR13)

**Given** text at 1× system font size
**When** the user scales system font to 1.5×
**Then** both `VerseText` and `ScriptureCard` remain fully readable with no overflow or clipping (NFR-A2)

**Given** any text rendered by `VerseText`
**When** contrast is checked
**Then** it meets WCAG AA contrast ratios in both light and dark modes (NFR-A3)

**Given** `components/scripture/index.ts`
**When** reviewed
**Then** it exports `VerseText`, `ScriptureCard`, and `VerseCardView` (stub for Epic 5) as a barrel export

---

### Story 3.2: Jesus Quotes Browser

As a Tamil Christian user,
I want to browse all 50 Jesus quotes from the Gospels, each showing verbatim Tamil text with its verse reference,
So that I can encounter and dwell on Jesus's direct words at any time without needing an account.

**Acceptance Criteria:**

**Given** the user navigates to the Quotes section
**When** the screen loads
**Then** all published `content_items` with `content_type = 'quote'` and `language_code = 'ta'` are displayed as a scrollable list of `ScriptureCard` components, each showing verbatim Tamil text and verse reference (FR10)

**Given** the quotes list
**When** rendered on a mid-range Android simulator
**Then** it reaches a scrollable interactive state in ≤1 second (NFR-P4)

**Given** a quote in the list
**When** the user taps it
**Then** a detail screen opens showing the full verbatim Tamil text, verse reference, audio play button (if audio available), and share button

**Given** the detail screen
**When** reviewed for account requirements
**Then** zero sign-in prompts appear; the full quote and audio are accessible anonymously (FR22, NFR-PR1)

**Given** 50 quotes seeded in `content_items` with `review_status = 'published'`
**When** the quotes browser loads
**Then** all 50 are visible; the RLS policy correctly hides any draft items

---

### Story 3.3: Scripture Content Search

As a Tamil Christian user,
I want to search the content library by topic or keyword,
So that I can find the words of Jesus relevant to what I am facing right now — anxiety, grief, identity, forgiveness — without scrolling through the entire library.

**Acceptance Criteria:**

**Given** the search interface accessible from the content browser
**When** the user enters a Tamil keyword (e.g., "கவலை")
**Then** `lib/content.ts:searchContent()` queries the Expo SQLite full-text index and returns matching quotes within ≤500 ms (FR11)

**Given** the search results
**When** displayed
**Then** each result shows a `ScriptureCard` with verbatim text and verse reference — no result is rendered without attribution (FR13)

**Given** an English keyword is entered (e.g., "peace")
**When** the search executes
**Then** matching results are returned from verse references or English-language fields; Tamil results are prioritized

**Given** a search with no results
**When** displayed
**Then** a helpful empty state is shown in Tamil from `ta.json` — no raw English fallback

**Given** the user clears the search input
**When** the field is empty
**Then** the full quotes list is restored without a full reload

---

### Story 3.4: Content Seeding — 50 Jesus Quotes

As an operator,
I want all 50 MVP Jesus quotes entered into `content_items` with correct Tamil OV text, verse references, `practice_path`, `product_pillar`, and `mood_tag` values,
So that the Scripture Browser displays the full intended content set from the first user-facing release.

**Acceptance Criteria:**

**Given** `scripts/seed-content.ts` is run (or Supabase admin entry is complete)
**When** the `content_items` table is queried
**Then** exactly 50 rows exist with `content_type = 'quote'`, `language_code = 'ta'`, `review_status = 'published'`, and a non-null `verse_reference` on every row

**Given** each of the 50 rows
**When** the `scripture_text` is compared against the Tamil OV source
**Then** the text is verbatim — no paraphrasing, no summarizing, no "based on" language

**Given** each row's `verse_reference`
**When** verified against the Tamil OV Bible data in Expo SQLite
**Then** the reference resolves to a valid book/chapter/verse — no orphaned or malformed references

**Given** the `practice_path`, `product_pillar`, `mood_tag`, and `time_of_day` fields
**When** reviewed across all 50 rows
**Then** each row has valid non-null values; `time_of_day` is `'any'` for all MVP content

**Given** the quotes browser (Story 3.2) running against this seeded data
**When** a user opens it
**Then** all 50 quotes are visible and correctly attributed
