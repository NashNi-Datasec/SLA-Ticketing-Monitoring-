---
name: dpsa
description: Optional VS Code preview of a git-diff Digital Product Security Assessment. Official review is the GitHub Action on a staging/UAT PR (can block on Critical). Read-only. Report only.
---

# Digital Product Security Assessment (DPSA)

Deterministic security router for **git diffs**.

**Invoke:** `/dpsa` (VS Code Copilot Chat)

**When to run**

| | VS Code `/dpsa` | GitHub Action |
|--|-----------------|---------------|
| **Required?** | **No** — optional preview | **Yes** for the official record (same-repo PR into staging/UAT) |
| **Blocks merge?** | Never | **Critical** — job fails, PR becomes **draft**, label `dpsa-blocked`. Ready for review does **not** unlock. High / Medium / Low comment only. |
| **What to do next** | Fix early, or just open the PR | Follow the PR comment |

You do **not** need `/dpsa` before opening a PR. Opening the staging/UAT PR is enough.

For wide-scope assessments (dates, PR ranges), use `/full-assessment-security-review` instead.

For **one pasted finding** (is it real, what it means, minimal-fix suggestions), use the **DPSA Finding Analyst** agent. Do not re-run this full report for a single File + Line.

---

## Output Only Rule (CRITICAL)

Your **entire reply** must be the formatted report below. Nothing before it. Nothing after it.

The **first line** of your reply must be:

```
## Digital Product Security Assessment (DPSA)
```

**Forbidden** — do not include any of these in your reply:

- Process narration ("I'm reviewing…", "I'm loading…", "The routed domain is…")
- Routing commentary ("before I apply the exploitability gate…")
- Tool/file read announcements ("Read landing-page.diff", "Loading shared rules…")
- Line-count or read-strategy notes ("Total ~N lines", "fits", "forceReadLargeFiles", "head/tail")
- Preamble or epilogue outside the report template

Load diff, route, and apply modules **silently**. The user sees only the final report (or REVIEW INCOMPLETE if review cannot complete).

---

## Mandatory Execution Sequence

Follow exactly. No AI discretion on routing or module selection.

0. **Obey `shared/read-only-safety.md`** — passive analysis only; allowlisted `git diff` and `git log` only
1. **Get git diff** (silently)
  - GitHub Actions: `git diff origin/<base>...HEAD` only
  - VS Code: resolve the **same base the workflow uses** (see **VS Code diff base** below). Do **not** default to `main` if the app merges into staging/UAT.
  - User-named files only if no diff exists
  - Do **not** scan the full repository
  - Do **not** read untracked files unless the user explicitly names them
2. **If no diff exists** — emit **REVIEW INCOMPLETE**. Include cause: no code changes provided.
3. **Classify the entire diff** (same bar as the baseline instruction):
  - **Non-security-only** if **every** changed path is limited to: docs/Markdown/comments/grammar; formatting/whitespace/imports; renames with no behavior change; CSS/styling-only; static UI copy with no data-flow; tests-only with no production behavior
  - **Security-related** otherwise (auth, APIs, payments, uploads, tenant, secrets, LLM/RAG, application logic, config, and similar)
4. **If GitHub Actions and non-security-only** — emit **PR Scenario 1**. Stop. Do not load domain modules.
5. **Load app context** — if `.github/security-context.md` exists, read it for OWASP scoring; otherwise use Cloudstaff defaults from `shared/owasp-risk-rating.md`
6. **Read `skill-routing.md`** from this folder — apply routing algorithm exactly
7. **Load modules** (paths relative to `.github/skills/`):
  - Always: `shared/exploitability-gate.md`, `shared/low-noise-rules.md`, `shared/severity-calibration.md`, `shared/security-checks.md`, `shared/owasp-risk-rating.md`, `shared/read-only-safety.md`, `shared/dpsa-next-steps.md`
  - Domains: all `.md` files in each selected domain folder (max 3 domains per `skill-routing.md`)
8. Apply checks to **changed lines only**, in this order:
   - **Domain modules** — checks from each selected domain folder
   - **Shared triage** — `shared/security-checks.md` on remaining changed lines
9. **Apply exploitability gate** from `shared/exploitability-gate.md` — discard failures
10. **High-confidence only** — discard any candidate whose **Confidence** is not **High** (see `severity-calibration.md`). Suspicious or unverified patterns are **not** findings. **One finding per sink** — same File + Line + same sink = one finding. Cite the **changed** line from the hunk; do not group a file or invent nearby lines.
11. **Score severity** via `shared/owasp-risk-rating.md` for remaining findings — include **OWASP Category** (Web `A0n:2021`, API `APIn:2023`, or Mobile `Mn:2024` — match the changed code), calculator URL, and rationale (OWASP Risk Rating — not CVSS)
12. **Change summary** — **2–3 sentences** max, plain language, no security verdict
13. **Select the template:**
   - **GitHub Actions** (`Run` = GitHub Actions PR comment):
     - Non-security-only → **PR Scenario 1**
     - Security-related, no findings → **PR Scenario 2**
     - Findings and **Critical = 0** (High / Medium / Low only) → **PR Scenario 3**
     - **Critical > 0** → **PR Scenario 4** (even if High / Medium / Low are also present)
     - Cannot complete → **REVIEW INCOMPLETE**
   - **VS Code `/dpsa`:** use the **VS Code** templates (preview — never say the PR is ready to merge)
14. **Output** — emit that template as your **complete reply**. No other text.

---

## Execution Rules

- Reply must **start** with `## Digital Product Security Assessment (DPSA)` — no text above it
- Do **not** narrate steps, routing, or module loading
- Do **not** write files
- Do **not** invent modules outside `shared/`, `web/`, `mobile/`, `backend/`, `infra/`
- Do **not** load more than 3 domain folders
- Work in memory; the visible reply is the report only
- GitHub Actions **PR Scenario 1 and 2** may say this PR is ready to merge. That is the report text only — do **not** approve or merge the PR
- Do **not** say the PR is approved as a GitHub review

### Read-Only Safety

Obey `shared/read-only-safety.md`. If a required module folder is missing, emit REVIEW INCOMPLETE naming the missing folder.

### VS Code diff base

Resolve silently. Do **not** default to `main` when this app’s official DPSA runs on staging/UAT.

1. User-named base, branch, PR, or files — use that.
2. Read `.github/workflows/dpsa-pr-comment.yml`. Collect **uncommented** names under `on.pull_request.branches` (skip `#` lines).
3. Prefer the first **exact** name that exists as `origin/<name>` or `<name>` (`git rev-parse --verify`). Then try uncommented glob names (`*-staging`, …) against `git branch -r`.
4. Else try, first that exists: `staging`, `stage`, `uat`, `preprod`, `pre-prod`, `main`, `master`.
5. Else `git diff --cached`, then unstaged.

Use `git diff origin/<base>...HEAD` or `git diff <base>...HEAD` for that base.

---

## Output Format — GitHub Actions (official PR comment)

Use these templates **only** when **Run** is GitHub Actions PR comment.

### PR Scenario 1 — Non-security-related

```markdown
## Digital Product Security Assessment (DPSA)

**AI Security Review Not Required** — No security-related changes were detected. This PR is ready to merge.

**Change summary:** [2–3 sentences — what this PR changes]

**Note:** This automated AI security review fulfills the security review requirement for this PR.
```

### PR Scenario 2 — Security-related, no issue found

```markdown
## Digital Product Security Assessment (DPSA)

**Findings:** Critical 0 | High 0 | Medium 0 | Low 0

**AI Security Review Result: PASS** — No security issues have been identified. This PR is ready to merge.

**Change summary:** [2–3 sentences — what this PR changes]

**Note:** This automated AI security review fulfills the security review requirement for this PR.
```

### PR Scenario 3 — High / Medium / Low only (no Critical)

Use when **Critical is 0** and at least one High, Medium, or Low finding exists. This check **does not** fail. The PR can merge.

```markdown
## Digital Product Security Assessment (DPSA)

**Findings:** Critical 0 | High N | Medium N | Low N

**Change summary:** [2–3 sentences — what this PR changes]

**AI Security Review Result: Security Issue/s identified!**

### High
**[HIGH] Title**
File: `path/to/file.ext`
Line: N
Issue description: [affected component; CIA impact]
Steps to reproduce: [from diff evidence — or Observable in changed code at File:Line]
Security impact: [realistic attack scenario]
Recommendation: [minimal secure fix]
Confidence: High
OWASP Category: [A0n:2021 | APIn:2023 | Mn:2024 – Name — see owasp-risk-rating.md]
OWASP Risk Rating: [https://owasp-risk-rating.com/?vector=(...)]
Severity rationale: [1–2 sentences — OWASP Risk Rating, not CVSS]

### Medium / Low
[Same fields, or omit the heading if none]

### What to do next
Use the **DPSA Finding Analyst** agent and paste this PR comment to check whether each finding is a true positive or a false positive.

This check does **not** block merge.

- **True positive:** Preferred: fix the identified issues before merging. If merging without a fix: the Security Team will document the finding in Jira for tracking (from this PR comment). You do not need to file a ticket yourself.
- **False positive:** Proceed with the merge. No further action on the PR. Security can mark it as false positive in the monitoring tool.
```

### PR Scenario 4 — Critical found

Use when **Critical > 0**. This PR is **blocked**. Do not use Scenario 3.

```markdown
## Digital Product Security Assessment (DPSA)

**Findings:** Critical N | High N | Medium N | Low N

**Change summary:** [2–3 sentences — what this PR changes]

**AI Security Review Result: Security Issue/s identified!**

> [!CAUTION]
> **This PR is blocked.** Critical finding(s) at the cited File + Line.

### Critical
**[CRITICAL] Title**
File: `path/to/file.ext`
Line: N
Issue description: [affected component; CIA impact]
Steps to reproduce: [from diff evidence — or Observable in changed code at File:Line]
Security impact: [realistic attack scenario]
Recommendation: [minimal secure fix]
Confidence: High
OWASP Category: [A0n:2021 | APIn:2023 | Mn:2024 – Name — see owasp-risk-rating.md]
OWASP Risk Rating: [https://owasp-risk-rating.com/?vector=(...)]
Severity rationale: [1–2 sentences — OWASP Risk Rating, not CVSS]

### High / Medium / Low
[Same fields if any, or omit]

### What to do next
1. Paste this comment into the **DPSA Finding Analyst** agent (true positive vs false positive).
2. **True positive:** Fix the cited Critical File + Line and push.
3. **False positive (or cannot fix now):** A developer or Security adds the PR label **`dpsa-exception`**, then **posts the DPSA Finding Analyst result as a comment on this PR** (that comment is the evidence). Adding the label re-runs this check and marks the PR ready.

The Action converts this PR to **draft** and adds **`dpsa-blocked`**. Merge stays off until a **push** that clears Critical, or **`dpsa-exception`**. **Ready for review** does not unlock — the Action converts it back to draft. Finding Analyst cannot unblock it by itself. High / Medium / Low on this same comment do not fail the check.
```

Omit empty severity sections. Every finding needs File, Line, **OWASP Category**, OWASP Risk Rating URL, and Severity rationale.

---

## Output Format — VS Code `/dpsa` (optional preview)

Do **not** say the PR is ready to merge. Do **not** say this fulfills the PR security-review requirement.

### VS Code — non-security-only

```markdown
## Digital Product Security Assessment (DPSA)

**Run:** VS Code `/dpsa`
**AI Security Review Not Required** — No security-related changes were detected.

**Change summary:** [2–3 sentences]

This is an optional preview. The official record is the DPSA comment on a staging/UAT PR.
```

### VS Code — PASS (security-related, no findings)

```markdown
## Digital Product Security Assessment (DPSA)

**Scope:** [short]
**Run:** VS Code `/dpsa`
**Related tickets:** [PROJ-123 | none detected]
**Context:** security-context.md loaded | defaults (no security-context.md)
**Modules loaded:** shared, [domain1], [domain2]
**Findings:** Critical 0 | High 0 | Medium 0 | Low 0

**Change summary:**
[2–3 sentences]

**Coverage:**
Changed-lines only — shared + [domains] ([theme keywords])

> [!TIP]
> **AI Security Review Result: PASS**
> No security issues identified in this diff.

### What to do next
This preview does not replace the PR. Open a staging/UAT PR for the official comment, or screenshot-attach if you will not open a PR.
```

### VS Code — Security Issue Identified

Same finding fields as PR Scenario 3 (High / Medium / Low) or PR Scenario 4 (Critical). Result line: `**AI Security Review Result: Security Issue/s identified!**`

### What to do next (VS Code)
- Findings apply to the **cited File + Line only**.
- This preview **does not** block merge.
- Paste the finding into **DPSA Finding Analyst** to check true vs false positive.
- Official record is the staging/UAT PR: **PR Scenario 3** (High / Medium / Low — can merge) or **PR Scenario 4** (Critical — draft until fix + push, or `dpsa-exception` plus a PR comment with the Finding Analyst result).

### REVIEW INCOMPLETE (VS Code and GitHub Actions)

```markdown
## Digital Product Security Assessment (DPSA)

**Scope:** [attempted scope or none — one line]
**Run:** VS Code `/dpsa` | GitHub Actions PR comment
**Related tickets:** [PROJ-123 | none detected]
**Context:** security-context.md loaded | defaults (no security-context.md)
**Modules loaded:** [loaded or none]

**Change summary:**
[2–3 sentences if any files were visible — otherwise: Insufficient change detail to summarize.]

**Coverage:**
[One line — what could / could not be checked]

**AI Security Review Result: REVIEW INCOMPLETE**

The AI Security Agent could not complete the security review.

### Possible causes
- No code changes were provided for analysis
- Incomplete or missing required files in scope
- Generated, compiled, encrypted, minified, binary, or unsupported formats only
- Relevant config, dependencies, or related components not included
- External modules or services unavailable during review
- Missing skill modules (e.g. `.github/skills/{folder}/`)
- Unexpected condition — security impact could not be determined confidently

### What to do next
1. Ensure all code changes intended for deployment are in review scope.
2. Push to the staging/UAT PR so the DPSA comment refreshes. Optional: re-run `/dpsa` in VS Code as a preview.
3. If the issue persists, fix the scope and push so this comment can refresh.

**Note:** This result is **not** security approval. Incomplete reports do not fail the Critical gate.
```

Follow `shared/owasp-risk-rating.md`, `shared/severity-calibration.md`, `shared/low-noise-rules.md`, and `shared/dpsa-next-steps.md`.

**Change summary** = **2–3 sentences max**. Never invent ticket IDs.

### Wrong vs right

**Wrong** (narration before report):

> I'm reviewing the tracked git diff…
>
> ## Digital Product Security Assessment (DPSA)

**Right** (report only — starts with title).

---

# What This Skill Is NOT

- Not a general code review (UX, copy, refactors, styling, tests, performance unless direct security impact)
- Not a full repository audit
- Not a free-form autonomous agent
- Not a GitHub approve/merge action
- Not CVSS scoring — use OWASP Risk Rating
- **PR Scenario 4** stays a **draft** until a fix + push or `dpsa-exception` plus Finding Analyst evidence as a PR comment. Ready for review does not unlock.

Routing: [`skill-routing.md`](skill-routing.md). Next steps: [`shared/dpsa-next-steps.md`](../shared/dpsa-next-steps.md).
