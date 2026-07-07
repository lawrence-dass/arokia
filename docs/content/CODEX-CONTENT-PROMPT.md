# Codex Content-Research Prompt — Arokia (Epic 3 quotes + Epic 2 copy)

> Paste the block below into Codex. Codex produces ONE handoff document
> (`docs/content/CONTENT-RESEARCH-OUTPUT.md`) and touches no app code. Claude later reads that
> document and integrates it into `scripts/seed-content.ts` and `locales/ta.json`, running the
> verbatim validator at integration time.

---

```
# CODEX TASK — Arokia Content Research & Curation (produce ONE handoff document)

## Your role
You are curating SACRED CONTENT for Arokia, a Tamil-first Christian meditation app. This is the
highest-stakes work in the project: the app's whole promise is verbatim, correctly-attributed words
of Jesus. One wrong character, one misattributed verse, or one paraphrase breaks the core trust the
product is built on. Work slowly. Think critically and sequentially. Think harder on the theology
and the verbatim text than on speed. When uncertain, STOP and flag for Lawrence — never guess.

## What you produce (IMPORTANT — read this first)
You create exactly ONE new file: `docs/content/CONTENT-RESEARCH-OUTPUT.md`.
- You do NOT edit `scripts/seed-content.ts`, `locales/ta.json`, or any other app file. A separate
  Claude session will read your document and perform the code integration + validation later.
- Your document must be complete and self-describing enough that Claude can integrate it with zero
  re-research: ready-to-paste data plus human review sheets plus your flagged uncertainties.

## Non-negotiable theological guardrails (the constitution — obey absolutely)
1. STRICTLY CHRISTIAN, New Testament, RED-LETTER ONLY. Every one of the 50 quotes must be words
   actually SPOKEN BY JESUS (the Christ) as the speaker in the text — not narration, not an apostle,
   not the Father or an angel quoted by others. Jesus himself speaking.
2. VERBATIM, NEVER PARAPHRASED. The Tamil text of each quote MUST be copied character-for-character
   from the bundled source file `data/tamil-ov-nt.json`. You may NOT type Tamil scripture from your
   own memory or training — that risks hallucination. For every verse you select, read its exact
   `text` value from that JSON file and use that string unchanged.
3. MANDATORY ATTRIBUTION. Every quote carries its exact book/chapter/verse.
4. NO SYNCRETISM. No blending with Hindu, New Age, or any non-Christian religious concept.
5. NO SABBATH-BINDING, NO PROSPERITY GOSPEL, NO FALSE-TEACHER framing.
6. ECUMENICAL. Content and copy must serve ALL Tamil Christian denominations (Catholic, Protestant,
   Pentecostal, CSI/Anglican) with no sectarian doctrine.
7. TOOL-NOT-JESUS. The app points to Christ; it never replaces or impersonates Him.

## Ground-truth files (READ these; do not assume)
- `data/tamil-ov-nt.json` — the ONLY source of verbatim Tamil text. Array of
  { book, chapter, verse, text }. 7957 verses, full NT. Book names are ENGLISH
  ("Matthew","Mark","Luke","John","Acts", ... "Revelation"). Use book names EXACTLY as they appear
  here — the downstream validator matches on them.
- `scripts/seed-content.ts` — READ ONLY (do not edit). It defines the `SeedQuote` interface and the
  validation your data will later be checked against. Your quote data must fit this interface so
  Claude can paste it straight into the `SAMPLE_QUOTES` array.
- `_bmad-output/planning-artifacts/prd.md` and `.../architecture/*` — product intent: the Triune
  (mind/body/soul) model, the emotional-state library, the four pillars. Read for categorization.
- `locales/ta.json` — READ ONLY. Shows the Epic 2 keys and current placeholders (Task 2).
- `CLAUDE.md` — project rules and conventions.

============================================================
## TASK 1 — 50 red-letter Jesus quotes (PRIMARY)
============================================================

### Data contract (must match the existing SeedQuote interface exactly)
Each quote is: { book, chapter, verse, scriptureText, practicePath, productPillar, moodTag }
- book/chapter/verse: ONE single verse per quote (the schema is single-verse; a saying spanning
  verses must be one self-contained verse — never merge text across verses).
- scriptureText: the exact `text` string for that verse, read from data/tamil-ov-nt.json, NFC form.
- No extra fields (no title, no id).

### Categorization taxonomy (assign each field deliberately, with reasoning)
- practicePath — the Triune axis the verse best serves:
    'mind'  = mental/emotional peace: anxiety, worry, fear, rest of mind
    'body'  = embodied daily living: action, doing, physical rest, provision
    'soul'  = spiritual communion: prayer, abiding, eternal life, love of God
- productPillar:
    'word' = teaching/truth of Jesus     'walk' = discipleship / following daily
    'hope_faith_love' = comfort, the theological virtues     'integrity' = honesty, moral truth
- moodTag — emotional-state library entry it answers (or 'none' for general):
    'anxious' | 'grieving' | 'angry' | 'lonely' | 'tempted' | 'none'

### Distribution targets (curate for breadth, not repetition)
- 50 verses, all red-letter, no near-duplicates.
- Cover EVERY moodTag meaningfully: aim >=5 each for anxious, grieving, angry, lonely, tempted; the
  rest 'none'. The verse must genuinely speak to that emotion in Jesus's own words — justify each.
- Keep the Triune roughly balanced across mind/body/soul.
- Include these anchors (verify red-letter + pull verbatim): Matthew 11:28; the Matthew 6:25-34
  "Do Not Be Anxious" range (pick strongest single verses); John 14:27; John 14:1; John 14:18;
  Matthew 5:4; Matthew 6:14; John 11:25; Matthew 26:41. Extend well beyond these.
- Prefer verses that stand alone as a complete, pastorally usable saying.

### Method (sequential — do in order, do not shortcut)
1. Draft ~65 candidate red-letter references (over-select), each with a one-line rationale and a
   proposed mood/path/pillar. Think about pastoral coverage of the whole emotional library.
2. For EACH candidate, open data/tamil-ov-nt.json, confirm Jesus is the speaker, and copy the exact
   `text`. Drop any verse that is not genuinely Jesus speaking or is not self-contained.
3. Narrow to the best 50 with balanced distribution; remove near-duplicate themes.
4. SELF-VERIFY verbatim before writing the document: you MAY write a throwaway script to a scratch
   directory (e.g. /tmp) that loads data/tamil-ov-nt.json and asserts each selected verse's `text`
   matches your captured string (NFC). Do NOT commit that script and do NOT modify any app file.
   Fix any mismatch by re-copying from the source.

### Task-1 output (goes INTO the single handoff document)
- A fenced ```ts code block containing the full ready-to-paste `SeedQuote[]` array of all 50 —
  verbatim Tamil inside — that Claude can drop directly into `SAMPLE_QUOTES`.
- A human review table (one row per quote): reference | English gloss of the saying | practicePath |
  productPillar | moodTag | one-line rationale. This is Lawrence's theological approval sheet — he
  must be able to approve/reject each verse WITHOUT reading code or Tamil letter-by-letter.

============================================================
## TASK 2 — Epic 2 Tamil copy (SECONDARY — DRAFTS for Lawrence's review)
============================================================
Draft reverent, natural Tamil for each placeholder key below; treat every one as a PROPOSAL Lawrence
must approve or rewrite. These are identity/legal statements — mark them DRAFT.
Keys (currently `[PLACEHOLDER ...]` in locales/ta.json):
- about.nameMeaning.body — meaning of "Arokia / ஆரோக்கியம்" (wholeness/health/salvation) and the
  Arokia Matha (Our Lady of Health / Vailankanni) heritage, framed ECUMENICALLY — acknowledge the
  Catholic-origin name without excluding Protestants/Pentecostals.
- about.pillars.word / .walk / .hopeFaithLove / .integrity — one concise sentence each.
- about.ecumenical.body — serves all Tamil Christian denominations, no sectarian doctrine.
- about.correctionProcess.body — how theological corrections are disclosed (ties to the concern
  form + 7-day review SLA; corrections published transparently).
- privacy.body — plain-Tamil privacy statement for a fully ANONYMOUS app: no account, no login, no
  auth; only optional email on the concern form, used solely to reply about that concern, never
  marketing, never identity-linked; on-device preferences only. Mark clearly: LEGAL — Lawrence to
  verify before ship.

### Task-2 output (goes INTO the same handoff document)
- For each key: the exact ta.json key path, the Tamil DRAFT, and an English back-translation, so
  Lawrence can review meaning without reading Tamil letter-by-letter.

============================================================
## The handoff document structure — docs/content/CONTENT-RESEARCH-OUTPUT.md
============================================================
Write it in this order:
1. `## Integration instructions for Claude` — exactly which files to edit (SAMPLE_QUOTES array in
   scripts/seed-content.ts; the listed keys in locales/ta.json), and to run the dry-run validator
   `npx tsx scripts/seed-content.ts` until all 50 PASS, then `npm run format`, tsc, lint.
2. `## Task 1 — 50 quotes` — the ready-to-paste ```ts array, then the review table.
3. `## Task 2 — Epic 2 copy` — the per-key Tamil drafts + back-translations.
4. `## Open questions & uncertainties for Lawrence` — anything you were less than certain about:
   borderline red-letter calls, categorization judgment calls, wording you want confirmed.

## OUT OF SCOPE — do NOT touch
- `docs/glass-wall-budget.md` — real financial ledger data, generated in Epic 6. Never fabricate.
- Do not edit any app source (seed-content.ts, ta.json, components, etc.). Document only.
- Do not run the seed with --execute. Do not alter vow.body.

## Working rules & final self-check
- Extract every verbatim Tamil string by reading data/tamil-ov-nt.json — never from memory.
- Commit only the one new document (on a branch, e.g. feat/content-research; push it). No app-file
  changes in the diff.
- Before you stop, confirm: all 50 red-letter? all verbatim (self-check passed)? every moodTag
  covered? distribution balanced? every uncertain call flagged, not silently decided? review sheets
  legible to a non-coder? Integration instructions unambiguous for Claude?
```

---

## Open question for Lawrence (not in the Codex prompt)

`verse_reference` currently stores English book names (`Matthew 11:28`), so Tamil users see English
book names in the app. If you want Tamil book names displayed, that is a schema/display change,
separate from content curation — decide it on its own track.
