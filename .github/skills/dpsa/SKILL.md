---
name: dpsa
description: Optional VS Code preview of a git-diff Digital Product Security Assessment. Official review is the GitHub Action on a staging/UAT PR (can block on Critical). Read-only. Report only.
---

# Digital Product Security Assessment (DPSA)

Deterministic security router for **git diffs**. Same report in VS Code and on the PR.

**Invoke:** `/dpsa` (VS Code Copilot Chat)

**When to run**

| | VS Code `/dpsa` | GitHub Action |
|--|-----------------|---------------|
| **Required?** | **No** — optional preview | **Yes** for the official record (same-repo PR into staging/UAT) |
| **Blocks merge?** | Never | Critical only (if that check is required) |
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

Load diff, route, and apply modules **silently**. The user sees only the final report (or Scenario 5 if review cannot complete).

---

## Mandatory Execution Sequence

Follow exactly. No AI discretion on routing or module selection.

0. **Obey `shared/read-only-safety.md`** — passive analysis only; allowlisted `git diff` and `git log` only
1. **Get git diff** (silently)
  - Prefer: `git diff main...HEAD`, `git diff --cached`, or staged/unstaged changes
  - User-named files only if no diff exists
  - Do **not** scan the full repository
  - Do **not** read untracked files unless user explicitly names them
2. **If no diff exists** — emit **Scenario 5 (REVIEW INCOMPLETE)** using the report template (do not ask a free-form question outside the template). Include cause: no code changes provided.
3. **Load app context** — if `.github/security-context.md` exists, read it for OWASP scoring; otherwise use Cloudstaff defaults from `shared/owasp-risk-rating.md`
4. **Read `skill-routing.md`** from this folder — apply routing algorithm exactly
5. **Load modules** (paths relative to `.github/skills/`):
  - Always: `shared/exploitability-gate.md`, `shared/low-noise-rules.md`, `shared/severity-calibration.md`, `shared/security-checks.md`, `shared/owasp-risk-rating.md`, `shared/read-only-safety.md`, `shared/dpsa-next-steps.md`
  - Domains: all `.md` files in each selected domain folder (max 3 domains per `skill-routing.md`)
6. Apply checks to **changed lines only**, in this order:
   - **Domain modules** — checks from each selected domain folder
   - **Shared triage** — `shared/security-checks.md` on remaining changed lines
7. **Apply exploitability gate** from `shared/exploitability-gate.md` — discard failures
8. **High-confidence only** — discard any candidate whose **Confidence** is not **High** (see `severity-calibration.md`). Suspicious or unverified patterns are **not** findings.
9. **Score severity** via `shared/owasp-risk-rating.md` for remaining findings — include calculator URL and rationale (OWASP Risk Rating — not CVSS)
10. **Build analyst header fields** (required on every report — keep brief):
   - **Run** — `VS Code /dpsa` unless this is GitHub Actions (then `GitHub Actions PR comment`)
   - **Related tickets** — Jira keys (`PROJ-123`) from: user message, current branch name (`git rev-parse --abbrev-ref HEAD`), and recent `git log ... --oneline` subjects in scope. If none found: `none detected`
   - **Change summary** — **2–3 sentences** max on what the diff does in plain language. Lead with the main purpose; skip secondary detail. No security verdict here
   - **Coverage** — **one line** (or at most **two short bullets**): `Changed-lines only — [modules] ([3–6 theme keywords])`. Example: `Changed-lines only — shared + backend + web (authz, injection/DB, LLM abuse, PII disclosure, frontend prompts).` Do not narrate every check
11. **Select scenario** per `shared/dpsa-next-steps.md`:
   - No findings after gate → **Scenario 3 (PASS)**
   - One or more findings → **Scenario 4 (Security Issue Identified)**
   - Missing modules, unanalyzable artifacts only, or incomplete scope → **Scenario 5 (REVIEW INCOMPLETE)**
12. **Output** — emit the report template below as your **complete reply**. No other text.

---

## Execution Rules

- Reply must **start** with `## Digital Product Security Assessment (DPSA)` — no text above it
- Do **not** narrate steps ("I'm pulling the diff…", "I'm loading modules…", "The routed domain is…")
- Do **not** describe routing, module loading, or gate application in the reply
- Do **not** write files (`.diff`, reports, markdown exports)
- Do **not** invent modules outside `shared/`, `web/`, `mobile/`, `backend/`, `infra/`
- Do **not** load more than 3 domain folders
- Always include **AI Security Review Result**, **What to do next**, **Change summary**, **Coverage**, and **Related tickets**
- Work in memory; the visible reply is the report only

### Read-Only Safety

Obey `shared/read-only-safety.md`. Do not execute code, deploy infrastructure, modify the repo, or read secret stores outside scoped diff evidence.

If a required module folder is missing, emit Scenario 5 (REVIEW INCOMPLETE) naming the missing folder — do not invent modules.

---

## Output Format

### Scenario 3 — PASS (no findings)

```markdown
## Digital Product Security Assessment (DPSA)

**Scope:** [short — e.g. `main...HEAD` — assistant API, tools, UI]
**Run:** VS Code `/dpsa` | GitHub Actions PR comment
**Related tickets:** [PROJ-123, PROJ-456 | none detected]
**Context:** security-context.md loaded | defaults (no security-context.md)
**Modules loaded:** shared, [domain1], [domain2]
**Findings:** Critical 0 | High 0 | Medium 0 | Low 0

**Change summary:**
[2–3 sentences max — plain language for a Security Analyst screenshot]

**Coverage:**
Changed-lines only — shared + [domains] ([theme keywords])

> [!TIP]
> **AI Security Review Result: PASS**
> Uberticket DPSA ticket is **not required** for this diff.

### What to do next
- **GitHub Actions (on the PR):** this comment is the official record. Link the PR on Jira / Release Ticket. Do not screenshot.
- **VS Code `/dpsa` (optional preview):** does not block and does not replace the PR. Open a staging/UAT PR for the official comment, or screenshot-attach if you will not open a PR.
```

### Scenario 4 — Security Issue Identified

```markdown
## Digital Product Security Assessment (DPSA)

**Scope:** [short — files or diff reviewed]
**Run:** VS Code `/dpsa` | GitHub Actions PR comment
**Related tickets:** [PROJ-123, PROJ-456 | none detected]
**Context:** security-context.md loaded | defaults (no security-context.md)
**Modules loaded:** shared, [domain1], [domain2]
**Findings:** Critical N | High N | Medium N | Low N

**Change summary:**
[2–3 sentences max — plain language]

**Coverage:**
Changed-lines only — shared + [domains] ([theme keywords])

**AI Security Review Result: Security Issue Identified**

If **Critical > 0** and **Run** is GitHub Actions:

> [!CAUTION]
> **This PR is blocked.** Fix the cited Critical File + Line and push, **or** file Uberticket DPSA (PM-1136) for that finding and add label **`dpsa-exception`**.

### Critical / High
- **[SEVERITY] Title**
  - File: `path/to/file.ext`
  - Line: N
  - Issue description: [affected component; CIA impact]
  - Steps to reproduce: [from diff evidence — or "Observable in changed code at File:Line"]
  - Security impact: [realistic attack scenario]
  - Recommendation: [minimal secure fix]
  - Confidence: High
  - OWASP Risk Rating: [https://owasp-risk-rating.com/?vector=(...)]
  - Severity rationale: [1–2 sentences — OWASP Risk Rating, not CVSS]

### Medium / Low
- Same format or "None"

### What to do next
1. Findings apply to the **cited File + Line only**, not every ticket in this PR.
2. **VS Code `/dpsa` (optional preview):** does **not** block. Fix those lines now, **or** open the staging/UAT PR — CI is the official review. Or file Uberticket DPSA (PM-1136) for that finding.
3. **GitHub Actions — Critical > 0:** **This PR is blocked.** Fix the cited Critical issue and push, **or** file Uberticket DPSA (PM-1136) for **that finding** and add label **`dpsa-exception`**.
4. **High / Medium / Low** never fail the check. Same process: fix the lines or Uberticket that finding; the rest of the PR can merge.
```

### Scenario 5 — REVIEW INCOMPLETE

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
1. Ensure all code changes intended for deployment are in review scope (staged, branch, named files, or the open PR).
2. Include relevant source, configuration, and security-related components — avoid binary/minified-only submissions.
3. Push to the staging/UAT PR so the DPSA comment refreshes. Optional: re-run `/dpsa` in VS Code as a preview.
4. If the issue persists or impact is uncertain, file a **DPSA** ticket in **Uberticket** (PM-1136) for manual Security Team review.

**Note:** This result is **not** security approval. A successful `/dpsa` PASS or Security Team assessment is required before relying on the outcome for deployment decisions.
```

Include File and Line for every Scenario 4 finding. Score severity via OWASP matrix — never from finding type alone. Omit empty severity sections. Follow `shared/owasp-risk-rating.md`, `shared/severity-calibration.md`, `shared/low-noise-rules.md`, and `shared/dpsa-next-steps.md`.

**Analyst header rules:** Scope = one short line. Change summary = **2–3 sentences max** (not a feature dump). Coverage = **one line** in the form `Changed-lines only — modules (themes)` — do not narrate every check. Related tickets: list keys only; never invent ticket IDs.

### Wrong vs right

**Wrong** (narration before report):

> I'm reviewing the tracked git diff…
>
> ## Digital Product Security Assessment (DPSA)

**Right** (report only — starts with title, includes Result + What to do next).

---

# What This Skill Is NOT

- Not a general code review (UX, copy, refactors, styling, tests, performance unless direct security impact)
- Not a full repository audit
- Not a free-form autonomous agent
- Not a substitute for filing a DPSA in Uberticket when process requires Security Team review
- Not CVSS scoring — use OWASP Risk Rating

Routing: [`skill-routing.md`](skill-routing.md). Next steps: [`shared/dpsa-next-steps.md`](../shared/dpsa-next-steps.md).
