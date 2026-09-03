#!/usr/bin/env bash
# Fail the job when Critical > 0 unless the PR has label dpsa-exception.
# Converts the PR to draft so Merge is disabled.
set -euo pipefail

REPORT_FILE="${1:?usage: enforce-dpsa-critical.sh <report.md>}"
PR_NUMBER="${DPSA_PR_NUMBER:?DPSA_PR_NUMBER is required}"
REPO="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
BLOCKED_LABEL="dpsa-blocked"

BLOCK_ON="$(printf '%s' "${DPSA_BLOCK_ON:-critical}" | tr '[:upper:]' '[:lower:]')"
case "$BLOCK_ON" in
  critical|high) ;;
  *)
    echo "Invalid DPSA_BLOCK_ON='${DPSA_BLOCK_ON:-}' (use critical or high)."
    exit 1
    ;;
esac

CRITICAL=0
HIGH=0
if [[ -s "$REPORT_FILE" ]]; then
  line="$(grep -E '^\*\*Findings:\*\*' "$REPORT_FILE" | head -n 1 || true)"
  if [[ "$line" =~ Critical[[:space:]]*:?[[:space:]]*([0-9]+) ]]; then
    CRITICAL="${BASH_REMATCH[1]}"
  fi
  if [[ "$line" =~ High[[:space:]]*:?[[:space:]]*([0-9]+) ]]; then
    HIGH="${BASH_REMATCH[1]}"
  fi
fi

BLOCKING="$CRITICAL"
LABEL="Critical"
if [[ "$BLOCK_ON" == "high" ]]; then
  BLOCKING=$((CRITICAL + HIGH))
  LABEL="Critical or High"
fi

LABELS="$(gh api "repos/${REPO}/issues/${PR_NUMBER}" --jq '[.labels[].name] | join(",")' 2>/dev/null || true)"
HAS_EXCEPTION=0
HAS_BLOCKED=0
if [[ ",${LABELS}," == *",dpsa-exception,"* ]]; then
  HAS_EXCEPTION=1
fi
if [[ ",${LABELS}," == *",${BLOCKED_LABEL},"* ]]; then
  HAS_BLOCKED=1
fi

pr_node_id="$(gh api "repos/${REPO}/pulls/${PR_NUMBER}" --jq .node_id)"
pr_state="$(gh api "repos/${REPO}/pulls/${PR_NUMBER}" --jq .state)"

ensure_blocked_label() {
  gh api --method POST "repos/${REPO}/labels" \
    -f name="${BLOCKED_LABEL}" -f color="B60205" \
    -f description="DPSA converted this PR to draft" >/dev/null 2>&1 || true
  printf '%s\n' "{\"labels\":[\"${BLOCKED_LABEL}\"]}" \
    | gh api --method POST "repos/${REPO}/issues/${PR_NUMBER}/labels" --input - >/dev/null
}

remove_blocked_label() {
  gh api --method DELETE "repos/${REPO}/issues/${PR_NUMBER}/labels/${BLOCKED_LABEL}" >/dev/null 2>&1 || true
}

is_draft() {
  gh api "repos/${REPO}/pulls/${PR_NUMBER}" --jq .draft
}

convert_to_draft() {
  if [[ "$pr_state" != "open" ]]; then
    echo "PR is ${pr_state} — cannot convert to draft."
    return 0
  fi
  if [[ "$(is_draft)" == "true" ]]; then
    echo "PR is already a draft — Merge is disabled."
    return 0
  fi

  set +e
  gh pr ready "$PR_NUMBER" --undo >/tmp/dpsa-draft.out 2>/tmp/dpsa-draft.err
  ready_status=$?
  set -e
  if [[ "$ready_status" -ne 0 ]]; then
    echo "gh pr ready --undo failed (exit ${ready_status}):"
    cat /tmp/dpsa-draft.err /tmp/dpsa-draft.out 2>/dev/null || true
    echo "Trying GraphQL convertPullRequestToDraft..."
    set +e
    gql="$(gh api graphql -f query='mutation($id:ID!){convertPullRequestToDraft(input:{pullRequestId:$id}){pullRequest{isDraft}}}' -f id="$pr_node_id" 2>/tmp/dpsa-draft.err)"
    set -e
    printf '%s\n' "$gql"
    cat /tmp/dpsa-draft.err 2>/dev/null || true
  fi

  if [[ "$(is_draft)" == "true" ]]; then
    echo "PR is now a draft — Merge is disabled."
    return 0
  fi

  cat <<'HINT'
::error::Could not convert this PR to draft. The dpsa-blocked label does not lock Merge.
github-actions often cannot change draft status (Resource not accessible by integration).
Ask the GitHub admin (one org setting, not a ruleset):
  Settings → Actions → General → Workflow permissions
  → Allow GitHub Actions to create and approve pull requests
Then re-run this job.
HINT
}

mark_ready_if_we_drafted() {
  if [[ "$HAS_BLOCKED" -ne 1 ]]; then
    echo "No ${BLOCKED_LABEL} label — leaving draft/ready state as the author set it."
    return 0
  fi
  remove_blocked_label
  if [[ "$pr_state" != "open" ]]; then
    return 0
  fi
  if [[ "$(is_draft)" != "true" ]]; then
    echo "PR is already ready for review."
    return 0
  fi
  set +e
  gh pr ready "$PR_NUMBER" >/tmp/dpsa-ready.out 2>/tmp/dpsa-ready.err
  ready_status=$?
  set -e
  if [[ "$ready_status" -ne 0 ]]; then
    echo "gh pr ready failed:"
    cat /tmp/dpsa-ready.err /tmp/dpsa-ready.out 2>/dev/null || true
  fi
  if [[ "$(is_draft)" == "true" ]]; then
    echo "::warning::Could not mark the PR ready. Click Ready for review after the gate passed."
    return 0
  fi
  echo "Marked PR ready for review — DPSA gate passed."
}

RELOCK=0
if [[ "${DPSA_RELOCK:-}" == "true" ]]; then
  RELOCK=1
fi

COMMENT_SAYS_BLOCKED=0
if [[ -s "$REPORT_FILE" ]] && grep -q 'This PR is blocked' "$REPORT_FILE"; then
  COMMENT_SAYS_BLOCKED=1
fi

if [[ "$HAS_EXCEPTION" -eq 1 ]]; then
  echo "${LABEL} finding(s) present, but label dpsa-exception is set — check passes (Finding Analyst evidence should be a comment on this PR)."
  mark_ready_if_we_drafted
  exit 0
fi

# Ready for review is not a new review. Only a push (or dpsa-exception) can clear the gate.
if [[ "$RELOCK" -eq 1 && ( "$HAS_BLOCKED" -eq 1 || "$BLOCKING" -gt 0 || "$COMMENT_SAYS_BLOCKED" -eq 1 ) ]]; then
  echo "Ready for review does not clear the DPSA gate (no code change). Converting back to draft."
  ensure_blocked_label
  convert_to_draft
  cat <<EOF
DPSA gate still in effect (Critical: ${CRITICAL}, High: ${HIGH}). Clicking Ready for review does not unlock merge.

Fix the cited File + Line(s) and push, or add **dpsa-exception** plus the Finding Analyst comment.
EOF
  exit 1
fi

if [[ "$BLOCKING" -eq 0 ]]; then
  echo "No ${LABEL} findings — check passes (DPSA_BLOCK_ON=${BLOCK_ON})."
  mark_ready_if_we_drafted
  exit 0
fi

ensure_blocked_label
convert_to_draft

cat <<EOF
DPSA ${LABEL} finding(s) on this PR (Critical: ${CRITICAL}, High: ${HIGH}). Gate: DPSA_BLOCK_ON=${BLOCK_ON}.

This PR was converted to a draft so Merge is disabled. It stays blocked until one of:

1. Fix the cited File + Line(s) and push — this workflow re-runs and marks the PR ready again.
2. Add the PR label **dpsa-exception** (developer or Security) and comment the DPSA Finding Analyst result on this PR as evidence. Adding the label re-runs this check and marks the PR ready.

Do not click Ready for review until then — this workflow will convert it back to draft.

Other tickets in the same PR are not the issue — only the cited lines.
High / Medium / Low do not block.
EOF
exit 1
