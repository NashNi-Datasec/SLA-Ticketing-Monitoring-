#!/usr/bin/env bash
# Write the existing official DPSA PR comment to a file (ready_for_review — no Copilot).
set -euo pipefail

OUT="${1:?usage: load-dpsa-comment.sh <report.md>}"
PR_NUMBER="${DPSA_PR_NUMBER:?DPSA_PR_NUMBER is required}"
REPO="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
MARKER="<!-- cloudstaff-dpsa-ci -->"

mkdir -p "$(dirname "$OUT")"

COMMENT_ID="$(
  gh api "repos/${REPO}/issues/${PR_NUMBER}/comments" --paginate \
    --jq ".[] | select(.body | contains(\"${MARKER}\")) | .id" \
    | tail -n 1 || true
)"

if [[ -z "$COMMENT_ID" ]]; then
  echo "No existing DPSA comment — nothing to relock."
  : > "$OUT"
  exit 0
fi

gh api "repos/${REPO}/issues/comments/${COMMENT_ID}" --jq .body \
  | awk '/^## Digital Product Security Assessment/{found=1} found' > "$OUT"

if [[ ! -s "$OUT" ]]; then
  echo "DPSA comment ${COMMENT_ID} had no report title — wrote empty file."
fi
