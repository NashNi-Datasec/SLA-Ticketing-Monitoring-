#!/usr/bin/env bash
# Fail the job when Findings Critical > 0 unless the PR has label dpsa-exception.
set -euo pipefail

REPORT_FILE="${1:?usage: enforce-dpsa-critical.sh <report.md>}"
PR_NUMBER="${DPSA_PR_NUMBER:?DPSA_PR_NUMBER is required}"
REPO="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"

CRITICAL=0
if [[ -s "$REPORT_FILE" ]]; then
  line="$(grep -E '^\*\*Findings:\*\*' "$REPORT_FILE" | head -n 1 || true)"
  if [[ "$line" =~ Critical[[:space:]]*:?[[:space:]]*([0-9]+) ]]; then
    CRITICAL="${BASH_REMATCH[1]}"
  fi
fi

if [[ "$CRITICAL" -eq 0 ]]; then
  echo "No Critical findings — check passes (High/Medium/Low do not block)."
  exit 0
fi

LABELS="$(gh api "repos/${REPO}/issues/${PR_NUMBER}" --jq '[.labels[].name] | join(",")' 2>/dev/null || true)"
if [[ ",${LABELS}," == *",dpsa-exception,"* ]]; then
  echo "Critical findings present, but label dpsa-exception is set — check passes (Uberticket DPSA for the cited File+Line)."
  exit 0
fi

cat <<EOF
DPSA Critical finding(s) on this PR (count: ${CRITICAL}).

This check blocks merge until one of:

1. Fix the cited File + Line(s) and push — this workflow re-runs.
2. File a Uberticket DPSA (PM-1136) for that finding (not the whole PR), then add the PR label **dpsa-exception** and re-run this check (or push).

Other tickets in the same PR are not the issue — only the cited lines. High/Medium/Low never block.
EOF
exit 1
