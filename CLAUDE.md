# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Rules

- Never add `Co-Authored-By` or any Claude/AI attribution lines to commit messages. Commits are authored by Lawrence only.
- Never commit directly to `main`. Always create a feature branch (e.g. `feat/story-1-2-supabase-schema`) before committing, and open a PR from that branch.

## Working Style & Context Hygiene

Keep the working context lean — it fills fast and forces lossy summarization.

- **Targeted reads.** Read only the section you need (offset/limit, or `grep` for it). Never dump whole large files (the 1000-line seed script, 600-line content docs). Don't re-read files already in context.
- **Subagents for fan-out.** Use Explore/general-purpose subagents for multi-file investigation so their token-heavy reads stay out of the main thread — only the conclusion returns.
- **Pipe command output** through `tail`/`grep`/`head`; never print full logs or large query dumps.
- **Persist, don't re-derive.** Keep `_bmad-output/CURRENT.md` + memory current so a fresh session resumes cheaply.
- **Compact at milestones.** When an epic/PR merges and context is heavy, hand off via `CURRENT.md` and start a fresh/compacted session rather than pushing one session huge.

When proposing options, always end with a recommendation grounded in **production best practice** (how real teams ship: maintainability, security, standard patterns) — a slight honest steer, not a survey.

## Project Layout

The repo root and the Expo app root are the same directory. All `npm` commands run from the repo root.

```
arokia/                  ← repo root = app root
  app/                   ← Expo Router file-based routes
  components/            ← Feature-scoped UI (scripture/, audio/, home/, donation/, shared/)
  lib/                   ← Singleton services: supabase.ts, i18n.ts, audio.ts (Story 1.6)
  store/                 ← Zustand stores (audioStore, prefsStore, contentStore — Story 1.4)
  constants/             ← Design tokens: colors.ts, theme.ts
  locales/               ← i18n strings: ta.json (Tamil only in MVP)
  types/                 ← Shared domain types (Story 1.4)
  _bmad/                 ← BMAD workflow tooling
  _bmad-output/          ← Planning artifacts: PRD, architecture, epics, sprint-status.yaml
```

## Commands

Run all commands from the repo root:

```bash
npx expo start --ios        # Start Metro + open iOS simulator
npx expo start --android    # Start Metro + open Android emulator
npx tsc --noEmit            # Type-check (must pass 0 errors before any commit)
npm run lint                # ESLint + Prettier check
npm run format              # ESLint --fix + Prettier --write
```

There is no test suite yet (Story 1.5 adds CI; testing stories follow in Epic 1).

## Architecture

### Routing

Expo Router v6 — file-based. Every file under `app/` becomes a route. `app/_layout.tsx` is the root shell; it imports `@/lib/i18n` as its very first line (before any component import) to guarantee i18next is initialized before rendering.

### Styling

NativeWind v4 — use `className` prop with Tailwind utility classes on all React Native components. Custom design tokens are defined in `tailwind.config.js` and mirrored in `constants/colors.ts`. Key tokens:

| Token | Value | Use |
|---|---|---|
| `bg-background` | `#F5EFE6` | Warm cream — all screen backgrounds |
| `primary` | `#F0C040` | Golden — CTAs, The Word path |
| `secondary` | `#E07058` | Coral — active states, Body path |
| `tertiary` | `#A8C8C4` | Teal — Soul path, Lectio Divina |
| `path-mind/body/soul` | above | Triune navigation path tinting |

### i18n — Zero Hardcoded Strings (enforced invariant)

All UI strings live in `locales/ta.json`. No Tamil or English string may appear in JSX — use `const { t } = useTranslation()` and reference an i18n key. This is a non-negotiable architectural constraint, not a preference. The five established namespaces are `vow`, `home`, `audio`, `donation`, `errors`. New stories must add keys to `ta.json` before writing components.

### Scripture Attribution Invariant

Every component that renders scripture must accept and display `verse_reference` as a non-optional prop. A scripture card without attribution cannot be rendered — this is enforced at the TypeScript type level. The `VerseText` component (Story 3.1) codifies this pattern.

### State Management

Zustand (Story 1.4) — three stores:
- `audioStore` — RNTP playback state, queue, cache manifest, sleep timer
- `prefsStore` — playback speed, vow acknowledgement flag, Sunday tracker entries
- `contentStore` — content filter state (practice_path, mood_tag), offline availability flags

No React Query in MVP. Supabase calls go through a thin service layer in `lib/` — never raw Supabase client calls from components.

### Backend

Supabase (Postgres + Storage + Edge Functions). The app is fully anonymous — no Supabase Auth in MVP or v1.1. Key tables: `content_items`, `audio_assets`, `correction_log`, `theological_concerns`, `donations`, `allocation_entries`, `beneficiaries`, `disbursements`, `analytics_events`.

`verse_reference` is `NOT NULL` at the DB level on `content_items`. This constraint exists in the schema and must never be relaxed.

Credentials are read from `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` via `.env.local` (not committed).

### Audio

react-native-track-player (Story 1.6) — background audio with lockscreen controls. Audio files are 64 kbps mono AAC (`.m4a`). `lib/audio.ts` owns all RNTP interaction, URL resolution from Supabase Storage, and the `prefetchQueue()` progressive download logic. Components never call RNTP directly.

### Path Alias

`@/*` resolves to the repo root. Configured in `tsconfig.json` + `app.json` (`tsconfigPaths: true`). Always import via `@/` — no relative `../../` imports.

### Component Barrel Pattern

Each `components/<feature>/` directory exports through its `index.ts` barrel. App code imports from `@/components/scripture` not from `@/components/scripture/VerseText` directly.

## Content Pipeline (not a feature — core architecture)

Content moves through a mandatory review workflow before it appears in the app. The `review_status` column on `content_items` gates RLS visibility: only `published` items are returned to app clients. The stages are: `draft → source_verified → advisor_reviewed → audio_generated → qa_passed → published`. Theological corrections create a new version of the item and restart from `source_verified`; the old item is marked `superseded`. This pipeline is operated via Supabase admin and CLI scripts in `scripts/` (Story 1.8).

## Remote / Mobile Development Workflow

Lawrence drives development from Claude Code mobile/web (cloud sessions) as well as desktop. Every session — local or cloud — MUST end with all work committed and pushed to its feature branch. Never leave work stranded on a local or ephemeral machine; the pushed branch is the single source of truth for session handoff.

**The story loop (runnable from any session, including mobile):**

1. Branch off `main`: `feat/story-<epic>-<num>-<slug>`
2. `/bmad-create-story` — creates the story file, marks it `ready-for-dev`
3. `/bmad-dev-story` — implements the story
4. `/code-review` (or `/bmad-code-review`) — review, then apply fixes for accepted findings
5. Commit (conventional commits, no AI attribution) → push → `gh pr create --base main`
6. Merge after CI green (`--merge` style) → mark story `done` in `sprint-status.yaml`

**Session pickup:** read `_bmad-output/CURRENT.md` (handoff) and `sprint-status.yaml` first. **Session close:** update `CURRENT.md` and push.

**Cloud verification limits:** `npx tsc --noEmit` and `npm run lint` run anywhere; CI re-verifies on every PR. Simulator/device checks cannot run in cloud sessions — device-dependent validation is batched at Lawrence's pre-Epic-4 gate (see Sprint Tracking). No story work requires `.env.local` secrets; anything that does (Supabase service role, Razorpay, ElevenLabs) is a Lawrence-handled step, not an agent step.

**Unattended session policy (Lawrence away, mobile-only):**

- One story per branch per PR. Work stories strictly in sprint order — never parallel (stories share files, e.g. 2.1/2.2 both touch `prefsStore`).
- Merge a PR only when: CI is green, code review ran and accepted findings are fixed, and nothing in the story deviated from spec. Otherwise **leave the PR open** and record why in `_bmad-output/CURRENT.md` — Lawrence reconciles on return.
- Simulator-verification tasks in a story cannot run in cloud: note them as "pending desktop verification" in the story's Dev Agent Record; do not block the PR on them, do not claim they passed.
- Never modify: theological content/vow copy, `locales/ta.json` Tamil phrasing beyond adding keys for new UI, DB migrations, money-related code, or anything in the deferred-work ledger — park it and document instead.
- If genuinely blocked mid-story: commit + push whatever is consistent (tsc/lint clean), update `CURRENT.md` with exact state, stop. A clean stop beats a broken merge.

## Sprint Tracking

`_bmad-output/implementation-artifacts/sprint-status.yaml` is the authoritative source of story status — always re-read it rather than trusting this summary. Story files live in `_bmad-output/implementation-artifacts/`. Current sprint state: Epic 1 (`in-progress`) — Stories 1.1–1.5 (`done`); Stories 1.6–1.7 code-complete with device/service validation **deferred** (hard gate: must pass before Story 4.3 audio player; Razorpay spike before Epic 6); Story 1.8 deferred until before content seeding (Story 4.6). Active development jumps to Epic 2 (Opening Vow). Epics 2–7 (`backlog`).
