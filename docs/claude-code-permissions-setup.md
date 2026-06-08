# Claude Code Permissions Setup

A portable setup guide for configuring Claude Code permissions on any project. Eliminates repetitive prompts while keeping a safety floor that travels with the repo.

---

## Architecture: Three Layers

| File | Committed | Purpose |
|------|-----------|---------|
| `.claude/settings.json` | Yes | Deny floor — blocks destructive commands. Cannot be overridden. |
| `.claude/settings.local.json` | No (gitignored) | Personal convenience — broad allows, `defaultMode`, hooks. |
| `~/.claude/settings.json` | N/A | Global defaults across all projects. |

**Key rule:** `deny` beats `allow` at every scope. Denies in the committed file are absolute — no local setting or CLI flag can bypass them.

---

## Step 1 — Deny Floor (committed)

Create `.claude/settings.json` in the repo root. This file is checked in and defines what Claude can never do, regardless of local overrides.

```json
{
  "permissions": {
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f *)",
      "Bash(git reset --hard*)",
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Bash(wget *)"
    ]
  }
}
```

**Why these specifically:**
- `git push --force*` / `git push -f *` — prevents overwriting remote history
- `git reset --hard*` — prevents silently discarding uncommitted work
- `rm -rf *` — prevents recursive deletions; use targeted `rm` instead
- `curl` / `wget` — prevents arbitrary network exfiltration from bash; use the `WebFetch` tool with an explicit domain allowlist instead

---

## Step 2 — Personal Convenience (gitignored)

Create `.claude/settings.local.json`. This is your personal friction-reducer and stays off the repo.

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Bash(git *)",
      "Bash(gh *)",
      "Bash(npm *)",
      "Bash(npx *)",
      "Bash(/opt/homebrew/bin/supabase *)",
      "Bash(supabase *)",
      "Bash(sqlite3 *)",
      "Bash(grep *)",
      "Bash(find *)",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(mkdir *)",
      "Bash(cp *)",
      "Bash(mv *)",
      "Bash(ln *)",
      "Bash(chmod *)",
      "Bash(node *)",
      "Bash(python3 *)",
      "Bash(xcrun simctl *)",
      "Bash(screen *)",
      "Bash(xargs *)",
      "Bash(security find-generic-password *)",
      "Read(/tmp/**)",
      "Read(/Users/<you>/**)",
      "Skill(*)",
      "WebSearch",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:raw.githubusercontent.com)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/tsc-precommit-guard.sh\""
          }
        ]
      }
    ]
  }
}
```

**What `defaultMode: "acceptEdits"` does:** File reads, edits, and writes auto-apply silently. Bash commands not on the allow list still prompt. This eliminates ~80% of routine interruptions while keeping a guard on shell operations.

**Adapting the allow list for your stack:**
- Remove `supabase`, `sqlite3`, `xcrun simctl` if not relevant
- Add your stack's CLI tools (e.g. `Bash(docker *)`, `Bash(terraform *)`)
- Update the `WebFetch` domain list to include APIs your workflow fetches from
- Replace `Read(/Users/<you>/*)` with your actual home directory path

---

## Step 3 — Gitignore the Local File

Add this to `.gitignore`:

```
# Claude Code — personal convenience settings (deny floor in settings.json is committed)
.claude/settings.local.json
```

---

## Step 4 — Pre-commit Hook (optional but recommended)

A Claude Code hook `matcher` matches the **tool name** (`Bash`, `Edit`, `Write`), not a permission-style `Bash(git commit*)` pattern. A matcher like `Bash(git commit*)` matches nothing, so the gate never fires. Match `Bash` and filter the command inside the hook instead.

Create `.claude/hooks/tsc-precommit-guard.sh`:

```bash
#!/bin/bash
# PreToolUse(Bash) guard — runs `tsc --noEmit` only when the Bash command
# is a git commit, and blocks the commit (exit 2) if TypeScript fails.
set -uo pipefail
INPUT=$(cat)
CMD=$(echo "$INPUT" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")
[[ "$CMD" == *"git commit"* ]] || exit 0
ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$ROOT" || exit 0
if ! OUT=$(npx tsc --noEmit 2>&1); then
  echo "TypeScript errors — commit blocked:" >&2
  echo "$OUT" >&2
  exit 2
fi
exit 0
```

Exit code 2 is what blocks the tool and feeds the error back to Claude. Because the hook reads `$CLAUDE_PROJECT_DIR` (injected by Claude Code at runtime), the same file works in any project with no path edits. For projects without TypeScript, swap the `npx tsc --noEmit` line for your gate, e.g. `npm run lint`.

---

## Step 5 — Starting a Session with Zero Prompts

Your `defaultMode: "acceptEdits"` in `settings.local.json` handles file operations silently. For the remaining Bash commands not in your allow list, use the `--permission-mode` flag.

### Permission modes available

| Mode | Behaviour |
|------|-----------|
| `acceptEdits` | Default you set — file ops silent, unlisted Bash still prompts |
| `dontAsk` | No prompts at all; deny rules in `settings.json` still apply |
| `bypassPermissions` | Full bypass — skips even deny rules; use only in containers/VMs |
| `auto` | AI classifier decides per-action (research preview) |

### Recommended: shell alias

Add to `~/.zshrc`:

```bash
# Claude with zero prompts — deny floor in settings.json still active
alias cca='claude --permission-mode dontAsk'
```

Start a focused dev session with `cca` instead of `claude`. Your default `claude` command stays conservative at `acceptEdits`.

**Why `dontAsk` over `bypassPermissions`:** `dontAsk` silences prompts but still honours your committed deny floor (`settings.json`). `bypassPermissions` skips the deny rules too — it defeats the safety floor you built. Only use `bypassPermissions` inside a dev container or VM.

---

## Applying to a New Project

1. Copy `.claude/settings.json` as-is — the deny floor is universal.
2. Copy `.claude/settings.local.json` and `.claude/hooks/`, then:
   - Update `Read(/Users/<you>/**)` to your home path
   - Add or remove stack-specific `Bash(*)` allows
   - No hook path edits needed — hooks read `$CLAUDE_PROJECT_DIR` at runtime
3. Add `.claude/settings.local.json` to `.gitignore`.
4. Commit `.claude/settings.json` only.

---

## Honest Limits

Permission rules are enforced by Claude Code, not at the OS level:

- A subprocess that Claude launches (e.g. a Node script) can open `.env` directly — the deny rule on `cat .env` won't catch that.
- Bash argument patterns can be sidestepped by unusual quoting or indirection.

For a genuine OS-level boundary, enable Claude Code sandboxing (`/sandboxing` in the docs). Permissions + sandbox is the defense-in-depth posture Anthropic recommends. For a solo developer on a local machine, the rules above are a strong practical guard.
