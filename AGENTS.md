# AGENTS.md

Guidance for **Codex** (and any AI agent) working in this repository. These instructions are
**binding**. They override default behavior. Follow them exactly. When something here conflicts
with a request, surface the conflict instead of silently breaking a rule.

> Companion file: `CLAUDE.md` holds the same architecture facts for Claude Code. Keep the two in
> sync — if you change an architectural invariant in one, mirror it in the other.

---

## 0. How You Work (operating principles)

These are non-negotiable working habits. They exist so that whoever picks up the work next —
Lawrence, Claude, or another Codex session — inherits a clean, predictable state.

1. **Foundation-first, accuracy over speed.** Lawrence values correctness and theological
   precision above shipping fast. Do the disciplined thing. Never guess at an API, a token name,
   or a file path — read the file and confirm before acting.
2. **One story at a time.** Work the story that is `in-progress` (or the next `ready-for-dev`).
   Do not start unrelated work. If you notice out-of-scope issues, note them in the story's
   "Deferred / Follow-ups" section rather than fixing them inline.
3. **Follow the spec literally.** Story files contain Acceptance Criteria (AC), Tasks, and a Dev
   Notes section. Implement every task, satisfy every AC, and check tasks off as you complete
   them. Do not invent scope. Do not skip ACs.
4. **Read before you write.** Before editing any file, read it. Before adding a dependency, check
   `package.json`. Before adding an i18n key, read `locales/ta.json`. Before touching the DB, read
   the migration in `supabase/`.
5. **Verify before you claim done.** A task is done only when `npx tsc --noEmit` passes with 0
   errors and `npm run lint` is clean. State results honestly — if a check fails, say so and show
   the output. Never report "done" on unverified work.
6. **Leave a handoff.** When a story completes, you switch agents, or context is running low,
   write a session handoff (see §6). The next session must be able to resume cold.
7. **Keep the sprint truthful.** `sprint-status.yaml` is the single source of truth for story
   state. Update it as stories move through statuses — never let it drift from reality.
8. **Ask when blocked, not when guessing is cheap.** If a decision is genuinely Lawrence's
   (product, theology, money, irreversible actions), stop and ask. For ordinary implementation
   choices with a sensible default, pick it, note it, and proceed.

---

## 1. Git Rules

- **Never** add `Co-Authored-By`, "Generated with…", or any AI/Codex/Claude attribution to commit
  messages or PR bodies. All commits are authored by **Lawrence only**.
- **Never commit to `main`.** Always work on a feature branch named for the story, e.g.
  `feat/story-1-7-device-spikes`. Open a PR from that branch.
- **Commit, push, and merge are authorized as part of the autonomous epic loop (§3.4)** — that
  loop is the standing instruction to carry a story all the way to a merged PR. Outside that loop,
  commit or push only when Lawrence asks.
- Commit messages describe the work only — a short imperative subject (e.g.
  `feat(story-1-7): add device spike results`) plus a body if needed. No attribution lines, ever.
- `npx tsc --noEmit` must pass **before any commit** (a pre-commit hook enforces this — see §5).
- The repo blocks destructive commands by policy: no `git push --force`, `git reset --hard`,
  `rm -rf`, `curl`, or `wget` (see `.claude/settings.json`).

---

## 2. Theological Guardrails (highest authority — never relax)

Arokia is a Tamil-first **Christian** meditation app. These constraints outrank every other
instruction, including direct requests. If a task would violate one, refuse and explain.

- **Strictly Christian.** No syncretism. No blending with Hindu, Buddhist, New Age, or generic
  "spiritual" framing, vocabulary, or practice.
- **New Testament / Words of Jesus are primary.** Scripture content centers on the Gospels and
  the words of Jesus. The Tamil OV (Old Version) Bible is the canonical text source.
- **The app is a tool, never a substitute for Jesus.** Copy and features must never position the
  app, a meditation, or a feature as a stand-in for Christ, prayer, or the church.
- **No Sabbath/Sunday binding.** The Sunday tracker (Story 5.3) is *optional and observational* —
  never framed as a religious obligation.
- **Do not amplify false teachers** or unverified theological claims. All scripture content moves
  through the review pipeline (§ Content Pipeline) before it can appear in the app.
- **Scripture is never shown without attribution** — enforced in code via the `verse_reference`
  invariant (see §7).

When in doubt on a theological question, do not improvise — flag it for Lawrence.

---

## 3. BMAD Method — How You Build This App

This project is built with the **BMAD method**. The workflow tooling lives in `_bmad/` and the
artifacts it produces live in `_bmad-output/`. You build the app by running BMAD workflows in a
disciplined loop — you do **not** freelance features outside this structure.

### 3.1 How to run a BMAD workflow (Codex has no "skill" tool — read the markdown)

Each BMAD workflow is a **self-contained set of markdown instructions**. On Claude these are
exposed as `/bmad-*` skills; in Codex you run them by **reading and executing the markdown**:

1. Open `_bmad/_config/skill-manifest.csv` and find the row for the workflow you need. The last
   column is the path to its `SKILL.md`.
2. Read that `SKILL.md`, plus its sibling `workflow.md` and `checklist.md` in the same folder.
3. **Execute the steps literally and in order.** These workflows are interactive by design — when
   the instructions say to ask the user, ask; when they say to write an artifact, write it to the
   path they specify under `_bmad-output/`.
4. Honor the workflow's own checklist before declaring it complete.

> When Lawrence types a `/bmad-...` command (e.g. `/bmad-dev-story`), treat it as a request to run
> that workflow — resolve its path via the manifest and follow the markdown.

### 3.2 The build loop (Epic → Story → Dev → Review → Done)

The implementation-phase workflows (all under `_bmad/bmm/4-implementation/`) form the core loop:

| Step | Workflow | Path | What it does |
|---|---|---|---|
| Plan sprint | `bmad-sprint-planning` | `_bmad/bmm/4-implementation/bmad-sprint-planning/` | Generates/refreshes `sprint-status.yaml` from epics |
| Check status | `bmad-sprint-status` | `_bmad/bmm/4-implementation/bmad-sprint-status/` | Summarizes sprint state & surfaces risks |
| Create story | `bmad-create-story` | `_bmad/bmm/4-implementation/bmad-create-story/` | Writes the next story file with full context (AC, tasks, dev notes) |
| Implement | `bmad-dev-story` | `_bmad/bmm/4-implementation/bmad-dev-story/` | Executes a story task-by-task; checks off tasks; moves story to `review` |
| Review | `bmad-code-review` | `_bmad/bmm/4-implementation/bmad-code-review/` | Adversarial review of the change (also automated via hook — §5) |
| Course-correct | `bmad-correct-course` | `_bmad/bmm/4-implementation/bmad-correct-course/` | Handles mid-sprint scope changes |
| Retrospective | `bmad-retrospective` | `_bmad/bmm/4-implementation/bmad-retrospective/` | Post-epic lessons (optional per epic) |

Upstream planning workflows (used less often, when defining new scope):
`bmad-create-prd` (`_bmad/bmm/2-plan-workflows/`), `bmad-create-architecture` and
`bmad-create-epics-and-stories` (`_bmad/bmm/3-solutioning/`).

Testing/QA workflows live under `_bmad/tea/` (the "TEA" / Test Architect module): e.g.
`bmad-testarch-ci`, `bmad-testarch-atdd`, `bmad-testarch-test-design`, `bmad-testarch-trace`.
Use these when a story calls for test scaffolding or a quality gate.

### 3.3 The standard story cycle

1. **Pick the work.** Read `_bmad-output/implementation-artifacts/sprint-status.yaml`. Take the
   story that is `in-progress`; if none, run `bmad-create-story` for the next `backlog` story.
2. **Read the full story file** in `_bmad-output/implementation-artifacts/<story>.md` — every AC,
   task, and Dev Note. Read `_bmad-output/project-context.md` for cross-cutting rules.
3. **Branch** (`feat/story-X-Y-...`) if not already on one.
4. **Implement** via `bmad-dev-story`: work tasks in order, respect all architecture invariants
   in §7, add i18n keys before writing components, keep `tsc` and `lint` green throughout.
5. **Check off** each task in the story file as you finish it.
6. **Move to review:** set the story to `review` in `sprint-status.yaml`. (This edit triggers the
   automated review hook — §5.)
7. **Address review findings**, then set the story to `done`.
8. **Write a handoff** (§6).

### 3.4 The autonomous epic loop (run this until all epics are `done`)

This is the standing instruction for building Arokia end-to-end. Work the sprint **one story at a
time, in order**, and carry each story all the way to a merged PR before starting the next.
Continue until **every epic in `sprint-status.yaml` is `done`**. Do not stop after a single story
unless blocked (see "Stop and ask" below).

**For each story, in this exact order:**

1. **Select** the next story from `sprint-status.yaml` — the lowest-numbered story not yet `done`,
   respecting epic order (finish Epic N's stories before starting Epic N+1). Set the epic to
   `in-progress` if it isn't already.
2. **Branch.** Create and switch to `feat/story-<epic>-<story>-<slug>` off the latest `main`
   (`git checkout main && git pull` first). Never work on `main`.
3. **Create the story** with `bmad-create-story` (if the story file doesn't exist or isn't fully
   populated). Set its status to `in-progress`.
4. **Implement the story** with `bmad-dev-story` — every task, every AC. Keep `npx tsc --noEmit`
   and `npm run lint` green throughout. Honor every invariant in §7 and the guardrails in §2.
5. **Code review.** Set the story to `review` (this fires the automated review hook, §5) **and**
   run the `bmad-code-review` workflow. Read the report in `_bmad-output/reviews/`.
6. **Fix all review findings** — every Critical and High at minimum; resolve Medium/Low or record
   them in the story's "Deferred / Follow-ups". Re-run `tsc` + `lint` until clean.
7. **Commit.** Stage the change and commit with a descriptive message — **no `Co-Authored-By`, no
   Codex/Claude/AI attribution** (see §1). The pre-commit hook will block the commit if `tsc`
   fails — fix and retry, never bypass it.
8. **Push** the branch: `git push -u origin feat/story-<epic>-<story>-<slug>`.
9. **Open a PR** into `main`: `gh pr create --base main --head feat/story-<epic>-<story>-<slug>`
   with a clear title and a body summarizing the story and the ACs satisfied. No AI attribution
   in the PR body. (`main` is the integration branch and the GitHub default.)
10. **Merge** the PR once CI is green: `gh pr merge --merge --delete-branch` (merge-commit style,
    matching this repo's history), then `git checkout main && git pull`.
11. **Mark `done`.** Set the story to `done` in `sprint-status.yaml`. If it was the last story in
    the epic, set the epic to `done` (and run `bmad-retrospective` if Lawrence wants it).
12. **Handoff + next.** Write/update the handoff (§6), then return to step 1 for the next story.

**Stop and ask Lawrence (do not push past these):**

- A story needs **physical-device testing**, real credentials/secrets, money movement (Razorpay),
  or any other action only Lawrence can perform — implement everything else, then pause at that
  task and report what he must do.
- A **theological judgment** is required (§2), or content needs human review-pipeline approval.
- CI is **red on `main`** after a merge, or a review surfaces a Critical issue the auto-fix can't
  resolve.
- A required decision is genuinely product-level / irreversible.

In all other cases, keep the loop running autonomously until the sprint is complete.

---

## 4. Sprint & Story Tracking

- **Source of truth:** `_bmad-output/implementation-artifacts/sprint-status.yaml`.
- **Story files:** `_bmad-output/implementation-artifacts/<epic>-<story>-<slug>.md`.
- **Story status values:** `backlog → ready-for-dev → in-progress → review → done`.
- **Epic status values:** `backlog → in-progress → done`.

**Current state (verify against the YAML — it is authoritative, this table can age):**

- **Epic 1 — Foundation & Spikes:** `in-progress`
  - 1.1 scaffold — **done** · 1.2 Supabase schema — **done** · 1.3 SQLite + Tamil OV bundle —
    **done** · 1.4 service layer / types / Zustand — **done** · 1.5 CI / EAS / Sentry — **done**
  - 1.6 RNTP background-audio spike — **in-progress** (awaiting physical-device testing; see
    `_bmad-output/CURRENT.md` and `docs/SPIKE_RNTP.md`)
  - 1.7 device spikes (Tamil rendering, AAC, offline cache, Razorpay) — `backlog`
  - 1.8 ElevenLabs audio-generation script — `backlog`
- **Epics 2–7** — all `backlog`. (2: Vow & Integrity · 3: Scripture/The Word · 4: Triune Daily
  Practice · 5: Share & Community · 6: Glass-Wall Donations · 7: Operator Tools.)

Always re-read the YAML at the start of a session rather than trusting this summary.

---

## 5. Codex Hooks (`.codex/hooks.json`)

Codex hooks are configured in `.codex/hooks.json` and mirror the Claude hooks in `.claude/hooks/`.
They run automatically — you don't invoke them, but you must know they exist:

- **PreToolUse(Bash) → `tsc-precommit-guard.sh`** — when a Bash command is a `git commit`, it runs
  `npx tsc --noEmit` and **blocks the commit (exit 2)** if TypeScript fails. Every other Bash
  command passes through. ⇒ Keep types clean or you cannot commit.
- **PostToolUse(Edit|Write) → `trigger-review.sh`** — after any edit, if it detects a story newly
  set to `review` in `sprint-status.yaml`, it dispatches a background **two-phase review agent**
  (`run-review-agent.sh`): Phase 1 `codex review` classifies findings against Arokia invariants
  (the six CRITICAL invariants in §7), Phase 2 `codex exec` auto-fixes Critical/High issues, then
  re-runs `tsc`. The verdict and report land in `_bmad-output/reviews/<story>-<timestamp>.md`; a
  per-story sentinel in `.claude/review-sentinels/` prevents re-triggering.

⇒ The practical contract: **moving a story to `review` kicks off an automated review.** After it
finishes, read the report in `_bmad-output/reviews/`, confirm the auto-fixes are sound, and only
then move the story to `done`.

---

## 6. Session Handoff (resume-anywhere discipline)

Because work alternates between agents and devices (Codex mobile, Claude, etc.), every session
must be resumable cold.

- **At session start:** read `_bmad-output/CURRENT.md` (the latest handover), the active story
  file, and `sprint-status.yaml`. That tells you exactly where to resume.
- **At session end** (story complete, agent switch, or ~60% context used): write a handover to
  `_bmad-output/handoff/<YYYY-MM-DD-HHMM>.md` and update `_bmad-output/CURRENT.md`. Follow the
  shape of the existing handoffs: Mode · Active Story · Resume Point · Uncommitted Files · What
  Happened · Decisions Made · Next Action · References.

On Claude these are the `/session-start` and `/session-end` skills; in Codex, do the same steps
manually against the same files.

---

## 7. Architecture & Invariants

### Project Layout

Repo root = Expo app root. All `npm` commands run from the repo root.

```
arokia/                  ← repo root = app root
  app/                   ← Expo Router file-based routes
  components/            ← Feature-scoped UI (scripture/, audio/, home/, donation/, shared/)
  lib/                   ← Singleton services: supabase.ts, i18n.ts, audio.ts, trackPlayerService.ts
  store/                 ← Zustand stores (audioStore, prefsStore, contentStore)
  constants/             ← Design tokens: colors.ts, theme.ts
  locales/               ← i18n strings: ta.json (Tamil only in MVP)
  types/                 ← Shared domain types
  supabase/              ← Migrations, RLS policies, Edge Functions
  scripts/               ← CLI / content-pipeline scripts
  docs/                  ← Spike write-ups (e.g. SPIKE_RNTP.md)
  _bmad/                 ← BMAD workflow tooling (run via _bmad/_config/skill-manifest.csv)
  _bmad-output/          ← PRD, architecture, epics, sprint-status.yaml, stories, handoffs, reviews
```

### Commands (run from repo root)

```bash
npx expo start --ios        # Metro + iOS simulator
npx expo start --android    # Metro + Android emulator
npx tsc --noEmit            # Type-check — must pass 0 errors before any commit
npm run lint                # ESLint + Prettier check
npm run format              # ESLint --fix + Prettier --write
```

No Jest/unit-test suite yet — CI (Story 1.5) runs typecheck + lint. RNTP (Story 1.6) is a native
module: **Expo Go cannot run it** — a dev client (`eas build --profile development` or
`npx expo run:ios`) is required for audio testing.

### Routing

Expo Router v6, file-based. Every file under `app/` is a route. `app/_layout.tsx` is the root
shell and imports `@/lib/i18n` as its **very first line** (before any component import) so
i18next is initialized before render. It also registers the RNTP playback service at module scope.

### Styling — NativeWind v4

Use the `className` prop with Tailwind utilities on all RN components. **Do not use
`StyleSheet.create()`** — NativeWind classes only. Tokens live in `tailwind.config.js` and are
mirrored in `constants/colors.ts`:

| Token | Value | Use |
|---|---|---|
| `bg-background` | `#F5EFE6` | Warm cream — all screen backgrounds |
| `primary` | `#F0C040` | Golden — CTAs, The Word path |
| `secondary` | `#E07058` | Coral — active states, Body path |
| `tertiary` | `#A8C8C4` | Teal — Soul path, Lectio Divina |
| `path-mind/body/soul` | above | Triune navigation path tinting |

### i18n — Zero Hardcoded Strings (CRITICAL invariant)

All UI strings live in `locales/ta.json`. **No Tamil or English string literal may appear in
JSX.** Use `const { t } = useTranslation()` and reference an i18n key. Established namespaces:
`vow`, `home`, `audio`, `donation`, `errors`. **Add keys to `ta.json` before writing the
component that uses them.**

### Scripture Attribution (CRITICAL invariant)

Every component that renders scripture must accept and display `verse_reference` as a
**non-optional** prop — enforced at the TypeScript type level. A scripture card without
attribution cannot be rendered. `VerseText` (Story 3.1) codifies this. `verse_reference` is also
`NOT NULL` on `content_items` at the DB level — never relax either constraint.

### State Management — Zustand

Three stores: `audioStore` (RNTP playback state, queue, cache manifest, sleep timer),
`prefsStore` (playback speed, vow acknowledgement flag, Sunday tracker), `contentStore` (filter
state: practice_path, mood_tag, offline availability). No React Query in MVP.

### Service Layer (CRITICAL invariant)

**Components never call the Supabase client directly.** All backend access goes through a thin
service layer in `lib/`. Likewise, **components never call react-native-track-player directly** —
all RNTP interaction, URL resolution, and `prefetchQueue()` progressive download live in
`lib/audio.ts` (+ `lib/trackPlayerService.ts` for the headless service).

### Backend — Supabase

Postgres + Storage + Edge Functions. App is **fully anonymous** — no Supabase Auth in MVP or
v1.1. Key tables: `content_items`, `audio_assets`, `correction_log`, `theological_concerns`,
`donations`, `allocation_entries`, `beneficiaries`, `disbursements`, `analytics_events`.
Credentials come from `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` via
`.env.local` (not committed).

### Audio

react-native-track-player — background audio + lockscreen controls. Files are 64 kbps mono AAC
(`.m4a`). Note: `expo-file-system` v2 API (`File`, `Paths`, `File.downloadFileAsync()`) — the
legacy `documentDirectory`/`downloadAsync` API is deprecated and throws at runtime.

### Path Alias (CRITICAL invariant)

`@/*` resolves to the repo root (`tsconfig.json` + `app.json` `tsconfigPaths: true`). **Always
import via `@/`** — no relative `../../` imports.

### Component Barrel Pattern

Each `components/<feature>/` exports through its `index.ts` barrel. Import from
`@/components/scripture`, not `@/components/scripture/VerseText`.

> **The six CRITICAL invariants the review hook enforces:** (1) no hardcoded JSX strings — use
> `useTranslation()`; (2) `verse_reference` non-optional on scripture components; (3) no `../../`
> imports — use `@/`; (4) no `StyleSheet.create()` — use NativeWind `className`; (5) no raw
> Supabase calls in components — use `lib/`; (6) no raw RNTP calls outside `lib/audio.ts`.

---

## 8. Content Pipeline (core architecture, not a feature)

Content moves through a mandatory review workflow before it appears in the app. The `review_status`
column on `content_items` gates RLS visibility — only `published` items reach app clients. Stages:
`draft → source_verified → advisor_reviewed → audio_generated → qa_passed → published`. A
theological correction creates a **new version** of the item and restarts it from
`source_verified`; the old item is marked `superseded`. Operated via Supabase admin and CLI
scripts in `scripts/` (Story 1.8 onward).
