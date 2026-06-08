#!/bin/bash
# Runs a two-phase Codex review pipeline for a completed story.
# Phase 1 — codex review  : identifies issues (read-only)
# Phase 2 — codex exec    : fixes Critical/High findings in-place
# Called by trigger-review.sh in the background.
# Args: $1=story_key  $2=story_file  $3=review_file

set -uo pipefail

STORY_KEY="$1"
STORY_FILE="$2"
REVIEW_FILE="$3"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REVIEW_DATE=$(date)

cd "$PROJECT_ROOT"

# Base commit: branch point from main (fallback to parent commit)
BASE_COMMIT=$(git merge-base HEAD main 2>/dev/null || echo "HEAD~1")

# ── Phase 1: codex review ─────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Phase 1 — Codex Review (read-only)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REVIEW_OUTPUT=$(codex review \
  --base "$BASE_COMMIT" \
  "Review story $STORY_KEY for the Arokia React Native app. \
Classify every finding as Critical / High / Medium / Low. \
Focus on these Arokia-specific invariants — \
CRITICAL: (1) hardcoded Tamil or English strings in JSX must use useTranslation(), \
(2) verse_reference non-optional on scripture components, \
(3) relative ../../ imports must use @/ alias, \
(4) StyleSheet.create() must use NativeWind className, \
(5) raw Supabase calls in components must go via lib/ service layer, \
(6) raw RNTP calls outside lib/audio.ts; \
HIGH: TypeScript errors, lint errors, logic bugs, missing boundary error handling; \
MEDIUM/LOW: style, performance, test gaps. \
End your review with exactly one line, nothing after it, in this format: \
FINDINGS critical=<n> high=<n> medium=<n> low=<n>" \
  2>&1)

echo "$REVIEW_OUTPUT"

# ── Phase 2: codex exec (fix Critical + High) ────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Phase 2 — Codex Fix (applies changes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FIX_OUTPUT=$(echo "$REVIEW_OUTPUT" | codex exec \
  --sandbox workspace-write \
  --ask-for-approval never \
  -C "$PROJECT_ROOT" \
  "Fix every Critical and High severity issue listed in the code review for story $STORY_KEY (Arokia React Native app). \
Apply all fixes directly to the source files. \
After applying fixes run: npx tsc --noEmit to confirm TypeScript compiles clean. \
The code review findings are provided below as context." \
  - \
  2>&1)

echo "$FIX_OUTPUT"

# ── TypeScript gate (post-fix) ────────────────────────────────────────────────
TSC_OUTPUT=$(npx tsc --noEmit 2>&1 || true)
if [ -z "$TSC_OUTPUT" ]; then
  TSC_STATUS="PASS"
else
  TSC_STATUS="FAIL"
fi

# ── Determine verdict ─────────────────────────────────────────────────────────
COUNTS=$(echo "$REVIEW_OUTPUT" | grep -oiE 'FINDINGS[[:space:]]+critical=[0-9]+[[:space:]]+high=[0-9]+' | tail -1)
if [ -z "$COUNTS" ]; then
  # Marker missing means the review format is off; don't silently approve.
  VERDICT="NEEDS_HUMAN_REVIEW"
else
  CRIT=$(echo "$COUNTS" | grep -oE 'critical=[0-9]+' | grep -oE '[0-9]+')
  HIGH=$(echo "$COUNTS" | grep -oE 'high=[0-9]+' | grep -oE '[0-9]+')
  if [ "$(( ${CRIT:-0} + ${HIGH:-0} ))" -gt 0 ]; then
    [ "$TSC_STATUS" = "PASS" ] && VERDICT="CHANGES_MADE" || VERDICT="NEEDS_HUMAN_REVIEW"
  else
    VERDICT="APPROVED"
  fi
fi

# ── Write report ──────────────────────────────────────────────────────────────
cat > "$REVIEW_FILE" << REPORT_EOF
# Code Review: $STORY_KEY
**Date:** $REVIEW_DATE
**Reviewer:** Codex CLI (OpenAI) — two-phase automated pipeline
**Verdict:** $VERDICT

## Summary
Automated review via \`codex review\` (Phase 1) and \`codex exec\` (Phase 2).
Phase 1 identified findings against Arokia architectural invariants.
Phase 2 applied fixes for all Critical and High severity issues.

## Build & Lint (post-fix)
| Check | Result |
|-------|--------|
| TypeScript | $TSC_STATUS |

---

## Phase 1 — Codex Review Output

$REVIEW_OUTPUT

---

## Phase 2 — Codex Fix Output

$FIX_OUTPUT

---

## TypeScript Check (post-fix)

${TSC_OUTPUT:-All checks passed — no errors.}

---

## Remaining Items for Human Review

$([ "$VERDICT" = "NEEDS_HUMAN_REVIEW" ] && echo "TypeScript still has errors after auto-fix — manual intervention required. See errors above." || echo "None.")
REPORT_EOF

# ── macOS notification ────────────────────────────────────────────────────────
osascript -e "display notification \"$STORY_KEY — $VERDICT\" \
  with title \"Arokia ✅ Review Done\" \
  subtitle \"See _bmad-output/reviews/\"" 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅  Review complete : $VERDICT"
echo "  📄  Report          : $REVIEW_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
