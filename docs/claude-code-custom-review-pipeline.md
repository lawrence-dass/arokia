# Claude Code — Custom Review Pipeline

Automated code review that fires when BMAD `dev-story` completes, runs an
autonomous review agent in the background, and sends a macOS notification
when done. No manual trigger required.

---

## How It Works

```
/bmad-dev-story runs
       │
       ▼
Step 9: sprint-status.yaml updated → story status = "review"
       │
       ▼  (PostToolUse hook on Edit/Write)
trigger-review.sh
  • Reads hook JSON payload from stdin
  • Confirms the edited file is sprint-status.yaml
  • Scans sprint-status.yaml for a story in "review" status
  • Checks sentinel to prevent re-triggering
  • Dispatches run-review-agent.sh in the background (nohup)
       │
       ▼  (background process — two-phase Codex pipeline)
run-review-agent.sh
  ├─ Phase 1: codex review --base <branch-point>
  │    • Read-only diff review against Arokia invariants
  │    • Classifies findings: Critical / High / Medium / Low
  │
  ├─ Phase 2: codex exec --sandbox workspace-write --ask-for-approval never
  │    • Receives Phase 1 output via stdin as context
  │    • Fixes all Critical and High findings in-place
  │    • Runs npx tsc --noEmit to confirm fixes compile
  │
  └─ Writes triage report to _bmad-output/reviews/
     Sends macOS notification with verdict
       │
       ▼
Main Claude session resumes
  • You see the notification
  • Claude reads the report, confirms remaining items, commits
```

---

## Files

| File | Purpose |
|------|---------|
| `.claude/hooks/trigger-review.sh` | Hook entry point — detects trigger, dispatches agent |
| `.claude/hooks/run-review-agent.sh` | Two-phase Codex pipeline (review → fix), writes report, sends notification |
| `.claude/settings.local.json` | PostToolUse hooks wired to trigger-review.sh |
| `.claude/review-sentinels/` | Ephemeral flags preventing double-triggering (gitignored) |
| `_bmad-output/reviews/` | Review report output — committed to repo |

---

## What the Review Agent Checks

The autonomous agent reviews against all Arokia-specific invariants from `CLAUDE.md`:

**Critical — auto-fixed:**
- Hardcoded strings in JSX (must use `useTranslation()`)
- `verse_reference` missing or optional on scripture components
- Relative `../../` imports (must use `@/`)
- `StyleSheet.create()` usage (must use NativeWind `className`)
- Raw Supabase calls in components (must go via `lib/` service layer)
- Raw RNTP calls in components (must go via `lib/audio.ts`)

**High — auto-fixed:**
- TypeScript errors (`npx tsc --noEmit`)
- Lint errors (`npm run lint`)
- Logic bugs and missing boundary error handling

**Medium / Low — logged, not auto-fixed:**
- Style and readability suggestions
- Performance observations
- Test coverage gaps

---

## Report Verdicts

| Verdict | Meaning |
|---------|---------|
| `APPROVED` | No issues found, or only Medium/Low |
| `CHANGES_MADE` | Critical/High found and all fixed; ready to commit |
| `NEEDS_HUMAN_REVIEW` | Issues found that agent could not safely auto-fix |

The verdict is derived from a structured `FINDINGS critical=<n> high=<n> medium=<n> low=<n>`
line that Phase 1 emits as its final line. If that line is missing, the verdict
defaults to `NEEDS_HUMAN_REVIEW`, so a malformed review never silently passes.

Reports are written to `_bmad-output/reviews/[story-key]-[timestamp].md`.

---

## Sentinel System

The file `.claude/review-sentinels/[story-key].triggered` prevents the
agent from firing twice for the same story. Sentinels are gitignored and
persist across sessions.

**To re-run review on the same story** (e.g. after manual fixes):
```bash
rm .claude/review-sentinels/[story-key].triggered
```
Then make any edit to sprint-status.yaml to re-trigger, or run the agent
directly:
```bash
bash .claude/hooks/run-review-agent.sh \
  1-4-story-name \
  _bmad-output/implementation-artifacts/1-4-story-name.md \
  _bmad-output/reviews/1-4-story-name-manual.md
```

---

## Prerequisites

- **Codex CLI** installed: `npm install -g @openai/codex` (or via Homebrew)
- Codex authenticated: `codex login`
- `claude` CLI in PATH (for the main session and tsc pre-commit hook)

## Applying to a New Project

1. Copy `.claude/hooks/` to the new project.
2. In `run-review-agent.sh`, update only the **Arokia-specific invariants**
   block inside the `codex review` prompt with your project's architectural
   rules. `PROJECT_ROOT` auto-derives from the script's own location, so no
   path edit is needed when copying to a new repo.
3. Add the `PostToolUse` hooks block to `.claude/settings.local.json`.
4. Add `"Bash(codex *)"` to the `allow` list in `.claude/settings.local.json`.
5. Add `.claude/review-sentinels/` to `.gitignore`.
6. Create `_bmad-output/reviews/.gitkeep` (or your preferred report dir).

The trigger detection (sprint-status.yaml + `": review"` pattern) is
BMAD-specific. If your project uses a different workflow, update the
detection logic in `trigger-review.sh` steps 1–2 to match your
completion signal.

---

## Monitoring a Running Review

```bash
# Watch live output
tail -f /tmp/arokia-review-[story-key].log

# See all past review reports
ls -lt _bmad-output/reviews/

# Read the latest report
cat $(ls -t _bmad-output/reviews/*.md | head -1)
```
