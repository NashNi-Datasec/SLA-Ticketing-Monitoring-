---
name: full-assessment-security-review
description: Full assessment security review for date ranges, branches, PRs, or PR ranges. Read-only passive analysis — no code execution, deploy, or repo mutation. Richer report, all matching domains. Uses allowlisted git + gh only. Not for small pre-PR diffs — use /dpsa instead.
---

# Full Assessment Security Review

Deterministic security router for **wide-scope assessments**. Resolves explicit scope (dates, branch, PR, PR range), routes to **all** matching domain modules, outputs a detailed consolidated report.

**Invoke:** `/full-assessment-security-review`

**Example scopes:**
- `PR #52`
- `PRs #10-#15`
- `from 2026-05-01 to 2026-05-15 on main`
- `branch release/1.2 vs main`
- `abc123..def456`

This skill is an **orchestrator only**. Checklists live in `shared/` and domain folders — same modules as `/dpsa`.

For small pre-PR diffs, use `/dpsa` instead.

---

## Output Only Rule (CRITICAL)

Your **entire reply** must be the formatted report below. Nothing before it. Nothing after it.

The **first line** of your reply must be:

```
## Full Assessment Security Review
```

**Forbidden** — do not include:

- Process narration ("I'm resolving scope…", "Loading modules…")
- Scope resolution or routing commentary
- Tool/file read announcements
- Preamble or epilogue outside the report template

Resolve scope, route, and apply modules **silently**.

---

## Read-Only Safety Contract (CRITICAL)

Passive static analysis on **resolved scope only**. Obey [`shared/read-only-safety.md`](../shared/read-only-safety.md) in full.

**MUST:**
- Use only allowlisted git/gh commands from [`scope-resolution.md`](scope-resolution.md)
- Read source files in diff scope, `.github/skills/**`, and `.github/security-context.md` only
- Emit the report in chat — repo unchanged when complete

**MUST NOT:**
- Execute application, test, or repo scripts; run linters or scanners as subprocesses
- Deploy or apply infrastructure (`terraform apply`, `kubectl apply`, `gh workflow run`, etc.)
- Push, commit, or modify the repository or any file on disk
- Read secret stores (`.env`, credentials files, vault/keychain) outside scoped diff evidence
- Substitute destructive commands when an allowlisted command fails — **stop** instead

If the user requests a forbidden action, refuse and continue with read-only analysis if scope can still be resolved.

---

## Mandatory Execution Sequence

Follow exactly. No AI discretion on scope resolution, routing, or module selection.

0. **Obey `shared/read-only-safety.md`** — passive analysis only; allowlisted git/gh from `scope-resolution.md` only
1. **Resolve scope** via `scope-resolution.md` in this folder (silent)
2. **If scope is ambiguous** — ask once:

   > Specify assessment scope: PR #N, PRs #10-#15, date range (from YYYY-MM-DD to YYYY-MM-DD on branch), branch (base...head), or commit range (abc..def).

   Then stop.

3. **Load app context** — if `.github/security-context.md` exists, read it; else Cloudstaff defaults from `shared/owasp-risk-rating.md`
4. **Read `skill-routing.md`** from this folder — load **all** matching domains (no max-3 cap)
5. **Load modules** (paths relative to `.github/skills/`):
   - Always: all 6 files in `shared/` (includes `read-only-safety.md`)
   - All matched domain folders — every `.md` in each
6. Apply checks to **changed lines in resolved scope only**:
   - Domain modules first
   - Then `shared/security-checks.md` triage on remaining changed lines
7. **Apply exploitability gate** from `shared/exploitability-gate.md`
8. **Score severity** via `shared/owasp-risk-rating.md` — calculator URL + rationale per finding
9. **Output** — emit the report template below as your **complete reply**

---

## Execution Rules

- Reply must **start** with `## Full Assessment Security Review`
- Do **not** scan unchanged files or the full repository
- Do **not** write report files to disk
- Do **not** execute application or test code, deploy infrastructure, or push/commit/modify the repository
- Do **not** read secret stores outside scoped diff evidence (see `shared/read-only-safety.md`)
- Do **not** invent modules outside `shared/`, `web/`, `mobile/`, `backend/`, `infra/`
- Load **all** matching domains — do not cap at 3
- Report File + Line from diff only — same evidence rules as quick review

If a required module folder is missing, stop and report:

> Missing module folder: `.github/skills/{folder}/`. Copy the full skills tree from https://github.com/cloudstaff-apps/ai-security

---

## Output Format

```markdown
## Full Assessment Security Review

**Assessment type:** date_range | pr | pr_range | branch | commit_range
**Scope resolved:** [refs used — e.g. PR #10–#15, main...release/1.2, 2026-05-01..2026-05-15]
**Related tickets:** [PROJ-123 | none detected — from scope commits/PR titles/user message]
**Commits reviewed:** [count — list subjects if ≤10, else first/last SHA]
**Files changed:** [count] ([optional: by domain — backend N, web N, infra N])
**Context:** security-context.md loaded | defaults (no security-context.md)
**Domains loaded:** shared, [all matched domains]
**Domains with no changes:** [list or none]
**Findings:** Critical N | High N | Medium N | Low N

**Change summary:**
[2–3 sentences max — what this assessment scope changed]

**Coverage:**
Assessment scope only — shared + [domains] ([theme keywords])

### Critical / High
- **[SEVERITY] Title**
  - File: `path/to/file.ext`
  - Line: N
  - Security impact: [realistic attack scenario]
  - Fix: [minimal secure fix]
  - Confidence: High | Medium | Low
  - OWASP Risk Rating: [https://owasp-risk-rating.com/?vector=(...)]
  - Severity rationale: [1–2 sentences]

### Medium / Low
- Same format or "None"

### Executive Summary
3–5 sentences: overall risk posture, highest-risk areas, scope coverage. Priority order.

### Recommended Actions
1. **P1 (immediate):** [highest priority fix]
2. **P2 (before release):** [...]
3. **P3 (follow-up):** [...]

### Summary
If findings exist: brief closing assessment.
If clean: No exploitable security issues found in the assessed changes.
```

Include File and Line for every finding. Score via OWASP matrix — never from finding type alone. Follow `shared/owasp-risk-rating.md`, `shared/severity-calibration.md`, and `shared/low-noise-rules.md`.

---

## What This Skill Is NOT

- Not a full repository audit — only resolved scope (commits/PRs/dates/branch)
- Not a replacement for `/dpsa` on small daily diffs
- Not a general code review (UX, style, tests, performance out of scope)
- Not a free-form autonomous agent
- Not an executor — no running tests, linters, or app code to "verify" findings
- Not a deploy or infra operator — no apply/push/workflow triggers
- Not a secret harvester — no direct `.env`/credential file reads for discovery

Routing: [`skill-routing.md`](skill-routing.md). Scope: [`scope-resolution.md`](scope-resolution.md). Safety: [`shared/read-only-safety.md`](../shared/read-only-safety.md).
