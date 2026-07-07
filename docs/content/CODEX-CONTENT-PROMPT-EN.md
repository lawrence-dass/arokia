# Codex Content Prompt — English (KJV) content pack

> Paste the block below into Codex. It produces ONE handoff document
> (`docs/content/CONTENT-RESEARCH-OUTPUT-EN.md`) and touches no app code. Claude later integrates it:
> parameterizes the seed for language, validates KJV verbatim, and seeds `language_code='en'` rows.

---

```
# CODEX TASK — Arokia English (KJV) content pack (produce ONE handoff document)

## Your role
You are producing the ENGLISH scripture pack for Arokia, a multilingual Christian meditation app that
already ships Tamil. This is sacred content: verbatim, correctly-attributed words of Jesus. One wrong
character or a paraphrase breaks the product's core promise. Work carefully; flag any uncertainty for
Lawrence rather than guessing.

## What you produce
Exactly ONE new file: `docs/content/CONTENT-RESEARCH-OUTPUT-EN.md`. Do NOT edit any app source
(scripts, locales, components). A separate Claude session integrates + seeds it.

## Reuse the already-decided curation (do NOT re-curate)
The Tamil pack already fixed the set of 50 verses and their categorization. Your job is to supply the
ENGLISH (KJV) verbatim text for those SAME 50 references, keeping the SAME tags — so the languages stay
in parity.

1. READ `docs/content/CONTENT-RESEARCH-OUTPUT.md` (the Tamil handoff). It contains the 50 references
   and, for each, its `practicePath`, `productPillar`, and `moodTag`.
2. Use the SAME 50 references and the SAME three tags per reference. Do not add, drop, or re-tag verses.
   (If a reference looks wrong to you, flag it in Open Questions — do not silently change it.)

## Non-negotiable guardrails
1. RED-LETTER ONLY — every verse is words spoken by Jesus. (Already true for these 50; you are not
   changing the set.)
2. VERBATIM KJV — the English text MUST be the King James Version (public domain), copied
   character-for-character from a reputable public-domain KJV source. Do NOT paraphrase, modernize, or
   mix translations. Cite the exact source you used (URL/edition) in the document.
3. KJV ONLY for this pack — do not use NIV/ESV/NLT etc. (copyrighted, and mixing versions is forbidden).
4. Attribution: keep the exact book/chapter/verse (same as the Tamil pack; KJV uses the same versification).

## Data contract (matches the existing SeedQuote interface, English variant)
Each quote: { book, chapter, verse, scriptureText, practicePath, productPillar, moodTag }
- book/chapter/verse: identical to the Tamil pack's 50.
- scriptureText: the KJV verbatim text of that single verse.
- tags: identical to the Tamil pack.
- No extra fields.

## Deliverable — docs/content/CONTENT-RESEARCH-OUTPUT-EN.md, in this order
1. `## Integration instructions for Claude` — state: seed as `language_code='en'`, content_type='quote',
   review_status='published'; the seed's verbatim validation must run against a KJV source (Claude will
   parameterize the seed script + add a KJV source file); do not run --execute (Lawrence's step).
2. `## KJV source` — the exact public-domain KJV source used (URL/edition), so verbatim is traceable.
3. `## Task 1 — 50 quotes` — a fenced ```ts code block with the full ready-to-paste `SeedQuote[]`
   array of all 50 (KJV text inside), followed by a review table:
   Reference | KJV text (short) | practicePath | productPillar | moodTag.
4. `## Open questions` — anything uncertain: KJV wording you want Lawrence to confirm, any reference
   that seemed mis-tagged, etc.

## Out of scope
- Do not edit app source, do not seed (--execute), do not alter Tamil content or vow copy.
- Do not source a full KJV New Testament file — only the 50 verses are needed now. (Full-NT English
  search is a later task.)

## Final self-check
All 50 references match the Tamil pack exactly? All text verbatim KJV from one cited public-domain
source? Tags identical to Tamil? Every uncertainty flagged, not silently decided?
```

---

## Note for Claude (integration side, not Codex)

When integrating this pack, the seed script (`scripts/seed-content.ts`) currently hardcodes
`data/tamil-ov-nt.json` and `language_code:'ta'`. To seed English:
1. Parameterize the seed by language: pick source file + `language_code` from a `--lang` flag
   (`ta` → `data/tamil-ov-nt.json`, `en` → a KJV source file).
2. Add the KJV source (`data/kjv-nt.json`, or a 50-verse subset) so verbatim validation runs for `en`.
3. Validate all 50 EN quotes PASS, then Lawrence runs `--execute --lang en`.
App content queries already filter by `language_code`, so English devices get English scripture once seeded.
