# Skill Snippets

Reusable patterns for authoring skill modules.

## Orchestrator Skill (SKILL.md)

Only folders containing `SKILL.md` become Copilot slash commands.

```yaml
---
name: skill-name
description: Short summary for auto-discovery. State what it does and what it is NOT for.
---
```

Orchestrator skills reference `skill-routing.md` (and `scope-resolution.md` for full assessment) — they do not embed checklists.

---

## DPSA Orchestrator (`/dpsa`)

Primary optional VS Code preview (official DPSA is the staging/UAT PR Action):

```yaml
---
name: dpsa
description: AI Digital Product Security Assessment for pre-PR diffs. Next-steps guidance. Read-only.
---
```

Companion files:

- `skill-routing.md` — max 3 domains
- `shared/dpsa-next-steps.md` — scenario → next-action matrix

Report title: `## Digital Product Security Assessment (DPSA)`

Must include **AI Security Review Result** (PASS | Security Issue Identified | REVIEW INCOMPLETE), **What to do next**, plus analyst header: **Related tickets**, **Change summary** (2–3 sentences max), **Coverage** (one line).

---

## Full Assessment Orchestrator

Second entry skill for wide-scope reviews:

```yaml
---
name: full-assessment-security-review
description: Assessment for date ranges, PRs, branches. All matching domains. git + gh.
---
```

Companion files in the same folder:

- `scope-resolution.md` — allowlisted git + `gh pr diff` scope algorithm
- `skill-routing.md` — all domains (references `/dpsa` path patterns)

Report title: `## Full Assessment Security Review` — includes executive summary and P1/P2/P3 actions.

Load `shared/read-only-safety.md` — passive analysis only; no exec, deploy, or repo mutation.

---

## Read-Only Safety Contract

Shared module: `skills/shared/read-only-safety.md`. Loaded by review orchestrators.

```markdown
## Mode
Passive static analysis. Read-only. Non-destructive. No code execution.

## Allowed git/gh
- DPSA (/dpsa): git diff, git log only
- Full assessment: see scope-resolution.md Command Allowlist

## Forbidden
- Repo mutation (commit, push, checkout, file writes)
- Code execution (npm test, node, docker run, repo scripts)
- Deploy/infra (terraform apply, kubectl apply, gh workflow run)
- Direct secret retrieval (.env, credentials.json, vault CLI)
- Dangerous shell (rm, sudo, curl|bash)
```

Orchestrator skills reference this module in step 0 of the execution sequence — do not duplicate full forbidden lists in SKILL.md.

---

## Jira Advisory Orchestrator

Third entry skill for Jira ticket analysis:

```yaml
---
name: jira-security-advisory
description: Fetch Jira issue via MCP, Security Advisor report, optional comment after confirmation.
---
```

Companion files:

- `jira-workflow.md` — MCP tool mapping, issue key regex, comment template
- `shared/jira-integration-safety.md` — credentials, confirm-before-post

Report title: `## Jira Security Advisory`

Requires user-configured Atlassian MCP — see [docs/jira-copilot-setup.md](../docs/jira-copilot-setup.md). No API keys in repo.

---

## Dependabot Assessment Orchestrator

Fourth entry skill. Chat-only. **Never** upgrades or edits the repo.

```yaml
---
name: dependabot-assess
description: Assess GitHub Dependabot alerts against this app. Chat-only. Never upgrades.
---
```

Companion files:

- `alert-scope.md` — args and GET-only `gh` allowlist
- `assessment-checks.md` — usage, reachability, confidence, blast-radius advice

Report title: `## Dependabot Assessment`

Requires `gh` with Dependabot alerts read access.

---

## Domain Module Template

```markdown
# {Domain} — {Topic}

Apply to changed {context} code only.

## Checks

1. **Check name** — description with CWE if applicable
2. ...

## Patterns

\`\`\`
regex or code patterns for changed files
\`\`\`

Apply exploitability gate. Score severity via shared/owasp-risk-rating.md — never hardcode Critical.
Out-of-scope items → see shared/low-noise-rules.md.
```

Line budget: ≤80 lines per module.

---

## Shared Module Template

```markdown
# {Rule Name}

Apply to every review / every candidate finding.

## Rules

- Imperative, deterministic rules
- No domain-specific checks here

Cross-reference other shared files instead of duplicating content.
```

---

## Routing Table Row Template

Add to `skill-routing.md` when introducing a new domain or path pattern:

```markdown
### domain-name

- `**/path/pattern/**`
- `**/*.ext`
```

Update tie-break order and examples if adding a new domain (requires architecture review).

---

## Authoring Rules

- Markdown-only — no code execution
- Modules are **not** slash commands (no SKILL.md in domain folders)
- Must not write report files — chat output only
- Checks apply to **git diff / changed lines only**
- Apply `shared/exploitability-gate.md` before reporting
- Score severity via `shared/owasp-risk-rating.md` — never by finding type alone

---

## Finding Output Template (OWASP)

```markdown
- **[SEVERITY] Title**
  - File: `path/to/file.ext`
  - Line: N
  - Security impact: [attack scenario]
  - Fix: [minimal fix]
  - Confidence: High | Medium | Low
  - OWASP Risk Rating: https://owasp-risk-rating.com/?vector=(SL:n/M:n/...)
  - Severity rationale: [app size, repo access, who can exploit]
```
