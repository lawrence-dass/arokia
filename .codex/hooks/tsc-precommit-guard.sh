#!/bin/bash
# PreToolUse(Bash) guard — runs `tsc --noEmit` only when the Bash command
# is a git commit, and blocks the commit (exit 2) if TypeScript fails.
# Every other Bash command passes straight through (exit 0).

set -uo pipefail

INPUT=$(cat)

# Extract the command being run from the PreToolUse JSON payload on stdin.
CMD=$(echo "$INPUT" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")

# Only gate real commits. Anything else is none of this hook's business.
[[ "$CMD" == *"git commit"* ]] || exit 0

# $CLAUDE_PROJECT_DIR is injected by Claude Code; fall back to the repo root
# relative to this script so a direct invocation still works.
ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$ROOT" || exit 0

if ! OUT=$(npx tsc --noEmit 2>&1); then
  echo "TypeScript errors — commit blocked:" >&2
  echo "$OUT" >&2
  exit 2
fi

exit 0
