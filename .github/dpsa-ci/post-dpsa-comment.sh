#!/usr/bin/env bash
# Upsert the single DPSA PR comment. Pass/fail is enforce-dpsa-critical.sh.
set -euo pipefail

MARKER="<!-- cloudstaff-dpsa-ci -->"
REPORT_FILE="${1:?usage: post-dpsa-comment.sh <report.md>}"
PR_NUMBER="${DPSA_PR_NUMBER:?DPSA_PR_NUMBER is required}"
REPO="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"

# Drop Copilot CLI narration before the report title (must not appear on the PR).
if [[ -s "$REPORT_FILE" ]] && grep -q '^## Digital Product Security Assessment' "$REPORT_FILE"; then
  tmp="$(mktemp)"
  awk '/^## Digital Product Security Assessment/{found=1} found' "$REPORT_FILE" > "$tmp"
  mv "$tmp" "$REPORT_FILE"
elif [[ -s "$REPORT_FILE" ]]; then
  : > "$REPORT_FILE"
fi

if [[ ! -s "$REPORT_FILE" ]]; then
  cat > "$REPORT_FILE" <<'EOF'
## Digital Product Security Assessment (DPSA)

**Scope:** GitHub Actions PR automation
**Related tickets:** none detected
**Context:** defaults
**Modules loaded:** none

**Change summary:**
The CI runner could not produce a DPSA report.

**Coverage:**
Changed-lines only — review did not complete

**AI Security Review Result: REVIEW INCOMPLETE**

The AI Security Agent could not complete the security review.

### Possible causes
- Copilot CLI failed, timed out, or was not authenticated
- No analyzable output was returned

### What to do next
1. Check the Actions log for Copilot CLI errors.
2. Confirm this toolkit was copied into the app .github/ folder (skills/ and dpsa-ci/).
3. Re-run the workflow, or run `/dpsa` in VS Code Copilot Chat.

**Note:** This result is **not** security approval. Incomplete reports do not fail the Critical gate.
EOF
fi

BODY="$(printf '%s\n\n%s\n' "$MARKER" "$(cat "$REPORT_FILE")")"

EXISTING_ID="$(
  gh api "repos/${REPO}/issues/${PR_NUMBER}/comments" --paginate \
    --jq ".[] | select(.body | contains(\"${MARKER}\")) | .id" \
    | head -n 1 || true
)"

if [[ -n "${EXISTING_ID}" ]]; then
  gh api --method PATCH "repos/${REPO}/issues/comments/${EXISTING_ID}" \
    -f body="${BODY}"
else
  gh api --method POST "repos/${REPO}/issues/${PR_NUMBER}/comments" \
    -f body="${BODY}"
fi
