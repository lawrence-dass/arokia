# Handover — 2026-07-07 | Claude (Winston session)

## Next task (start here)
**Finish Epic 4-1 (Triune home nav) + 4-2 (meditation library browse)** — both at `review` in
sprint-status. Close the known defect, review, mark done.

**Known defect (the main work): moods are not path-specific.** The emotional-state library
(anxious/grieving/angry/lonely/tempted) currently shows identically under all three practice paths.
Per PRD it belongs under **Mind**; **Body** needs its own categories (rest/movement/breathwork/sleep)
and **Soul** its own (prayer/Lectio Divina/silence/communion). `practice_path` and `mood_tag` are
SEPARATE axes — the UI must reflect that. See `deferred-work.md` (PR #6 walkthrough entry).

Likely files: `app/(tabs)/index.tsx` (triune home), `app/(tabs)/walk.tsx`, `app/meditation/[id].tsx`,
the mood-filter UI, `store/contentStore.ts` filters, `lib/content.ts:getMeditations`. Read them fresh
(targeted) — don't trust this list blindly.

Note: no meditations are seeded (`content_type='meditation'` rows = 0), so the library renders empty
until Epic 4-6 content. The nav + category DESIGN can be built/reviewed without content.

## Project state (all on `main`)
- **Done:** Epic 1 (1.1–1.5, 1.8), Epic 2, Epic 3. Bilingual (Tamil + English UI + content).
- **Audio (Story 1.8):** ElevenLabs pipeline (`scripts/generate-audio.ts`, `scripts/generate-and-upload-audio.ts`),
  credit-frugal. ~10 English quotes voiced (Brian), in-app play-from-list works, playback-state synced.
  Testing only — DO NOT generate more audio unless asked. Follow-ups: Tamil voice (Brian's Tamil
  pronunciation poor), `.m4a` transcode (needs `brew install ffmpeg`), device gate.
- **Supabase:** project ref `jwghoqpoidcvcuveheae`; `.env.local` has URL, anon, `SUPABASE_SERVICE_ROLE_KEY`,
  `ELEVENLABS_API_KEY`. 50 Tamil + 50 English quote rows seeded; `audio` storage bucket (public).

## Guardrails / working style
- Never commit to `main` — branch → PR → merge (merge-commit style). CI = tsc + lint + tracker audit.
- Local git shows recurring stale `.git/index.lock` (VS Code) — `rm -f .git/index.lock` if commit fails.
- Stale `.expo/types` causes phantom typed-route errors locally — `rm -rf .expo/types` before tsc.
- Context hygiene: targeted reads, subagents for fan-out, pipe outputs (see CLAUDE.md). Recommend
  options with a production-best-practice steer.

## Open follow-ups (tracked, not this task)
- Concern-ack email (Resend), privacy legal review, device gate (RNTP background/lockscreen/offline),
  English full-text search bundle, Tamil audio voice, full English audio batch, Hindi content pack.

## References
- Sprint: `_bmad-output/implementation-artifacts/sprint-status.yaml` (authoritative)
- Deferred: `_bmad-output/implementation-artifacts/deferred-work.md`
- `main` tip: PR #13 merged (working-style docs).

---
*Generated 2026-07-07 — ready to compact; next task = finish Epic 4-1/4-2 (path-specific moods).*
