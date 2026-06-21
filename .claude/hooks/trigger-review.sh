#!/bin/bash
# PostToolUse hook — fires after every Edit/Write tool call.
# Detects when dev-story marks a story "review" in sprint-status.yaml,
# then dispatches an autonomous review agent in the background.

set -uo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
IMPL_DIR="$PROJECT_ROOT/_bmad-output/implementation-artifacts"
REVIEWS_DIR="$PROJECT_ROOT/_bmad-output/reviews"
SENTINEL_DIR="$PROJECT_ROOT/.claude/review-sentinels"
SPRINT_STATUS="$IMPL_DIR/sprint-status.yaml"

# ── 1. Read PostToolUse JSON payload from stdin ──────────────────────────────
INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except:
    print('')
" 2>/dev/null || echo "")

# Only care about sprint-status.yaml edits
[[ "$FILE_PATH" == *"sprint-status.yaml" ]] || exit 0
[ -f "$SPRINT_STATUS" ] || exit 0

# ── 2. Find first story in "review" status ───────────────────────────────────
REVIEW_STORY=$(python3 - << PYEOF
import re
try:
    with open("$SPRINT_STATUS") as f:
        content = f.read()
    # Match lines like: "  1-4-story-name: review"
    matches = re.findall(r'^\s{2}([0-9]+-[0-9]+-[\w-]+):\s*review\b', content, re.MULTILINE)
    print(matches[0] if matches else '')
except:
    print('')
PYEOF
)

[ -n "$REVIEW_STORY" ] || exit 0

# ── 3. Sentinel — prevent re-triggering for the same story ───────────────────
mkdir -p "$SENTINEL_DIR"
SENTINEL="$SENTINEL_DIR/$REVIEW_STORY.triggered"
[ -f "$SENTINEL" ] && exit 0
touch "$SENTINEL"

# ── 4. Prepare output paths ──────────────────────────────────────────────────
mkdir -p "$REVIEWS_DIR"

TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
STORY_FILE="$IMPL_DIR/$REVIEW_STORY.md"
REVIEW_FILE="$REVIEWS_DIR/$REVIEW_STORY-$TIMESTAMP.md"
LOG_FILE="/tmp/arokia-review-$REVIEW_STORY.log"

printf '\n%s\n'   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf '  🔍  Review triggered : %s\n' "$REVIEW_STORY"
printf '  📄  Report           → %s\n' "$REVIEW_FILE"
printf '  📋  Live log         → tail -f %s\n' "$LOG_FILE"
printf '%s\n\n' "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 5. Dispatch review agent in background ───────────────────────────────────
nohup bash "$PROJECT_ROOT/.claude/hooks/run-review-agent.sh" \
  "$REVIEW_STORY" "$STORY_FILE" "$REVIEW_FILE" \
  > "$LOG_FILE" 2>&1 &

printf '  ✅  Review agent dispatched (PID: %s)\n\n' "$!"
