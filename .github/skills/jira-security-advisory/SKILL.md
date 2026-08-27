---
name: jira-security-advisory
description: Fetch Jira issue via Atlassian MCP, produce Security Advisor report, optional comment post after user confirmation. Requires user-configured MCP. Not for git diff review.
---

# Jira Security Advisory

Deterministic orchestrator for **Jira ticket security analysis**. Fetches issue content via Atlassian MCP (when configured), produces Security Advisor output, optionally posts a security note as a Jira comment after explicit user confirmation.

**Invoke:** `/jira-security-advisory PROJ-123`

**Example:**
- `/jira-security-advisory SEC-42`
- `/jira-security-advisory` with issue key in the same message

For git diff review, use `/dpsa` or Security Review agent instead.

Requires Atlassian MCP in VS Code — see [Jira Copilot Setup](../../docs/jira-copilot-setup.md).

---

## Output Only Rule (CRITICAL)

Your **entire reply** must be the formatted report below (plus the post-confirmation prompt on step 7). Nothing before it. Nothing after it except the confirmation question.

The **first line** of your reply must be:

```
## Jira Security Advisory
```

**Forbidden** — do not include:

- Process narration ("Fetching from Jira…", "Loading MCP…")
- MCP tool call announcements
- Raw ticket credentials or secrets from the description
- Preamble or epilogue outside the report template

Fetch, analyze, and apply modules **silently**.

After the report, end with exactly one confirmation line (replace key):

```
Post this note as a comment on PROJ-123? Reply yes to confirm or no to skip.
```

On a **follow-up** turn where the user replies `yes` (or equivalent explicit confirmation): post via MCP and reply with one line only — success or auth error. No full report repeat.

---

## Read-Only Safety (repo)

Obey [`shared/read-only-safety.md`](../shared/read-only-safety.md) for the local repository — no file writes, no code execution, no deploy.

Jira MCP operations follow [`shared/jira-integration-safety.md`](../shared/jira-integration-safety.md).

---

## Mandatory Execution Sequence

Follow exactly. No AI discretion on issue key parsing, MCP fetch, or confirm-before-post.

0. **Obey `shared/jira-integration-safety.md`**
1. **Parse issue key** — pattern `[A-Z][A-Z0-9]+-\d+` from slash args or user message; if missing, ask once:

   > Provide a Jira issue key (e.g. PROJ-123) or paste the ticket summary and description.

   Then stop.

2. **Fetch issue** via [`jira-workflow.md`](jira-workflow.md) (silent):
   - If Atlassian MCP tools available → get issue (summary, description, type, labels, AC if present)
   - If MCP unavailable or auth fails → ask user to paste ticket body; stop fetch attempts
3. **Load app context** — if `.github/security-context.md` exists, read it; else note assumptions under Questions / Missing Info
4. **Load modules** (paths relative to `.github/skills/`):
   - `shared/jira-integration-safety.md`
   - `shared/owasp-risk-rating.md` (for context scaling when relevant)
5. **Produce advisory sections** — same structure as Security Advisor Output Format in [`.github/agents/security-advisor.agent.md`](../../agents/security-advisor.agent.md):
   - Summary, Security Goal, Threats / Abuse Cases, Recommended Controls, Acceptance Criteria (security), LLM / Agent Considerations, Questions / Missing Info, Suggested Security Note (Jira-ready)
6. **Output** — emit the report template below as your **complete reply**
7. **Ask for post confirmation** — one line at end (see Output Only Rule)
8. **On user yes only** (follow-up turn) → MCP add comment with Suggested Security Note body per `jira-workflow.md`; reply one line: success or error

---

## Execution Rules

- Reply must **start** with `## Jira Security Advisory`
- Do **not** post to Jira without explicit user confirmation
- Do **not** store or echo API tokens from ticket text
- Do **not** transition issues, edit fields, or create issues
- Do **not** produce OWASP diff reports — that is `/dpsa`
- Format **Suggested Security Note** for Jira wiki markup (see `jira-workflow.md`)

If MCP is not configured, still produce the report from pasted ticket text.

---

## Output Format

```markdown
## Jira Security Advisory

**Issue:** PROJ-123 — [summary from Jira or user paste]
**Source:** Jira MCP | pasted ticket text
**Context:** security-context.md loaded | defaults (no security-context.md)

### Summary
[Feature / fix / issue under review]

### Security Goal
[CIA outcome to protect]

### Threats / Abuse Cases
- [realistic threats]

### Recommended Controls
- [practical controls]

### Acceptance Criteria (security)
- [observable, testable criteria]

### LLM / Agent Considerations (if applicable)
[Controls or N/A — no LLM/agent scope identified.]

### Questions / Missing Info
- [ambiguities]

### Suggested Security Note (Jira-ready)
[Jira wiki-friendly checklist for comment post — see jira-workflow.md]

Post this note as a comment on PROJ-123? Reply yes to confirm or no to skip.
```

---

## What This Skill Is NOT

- Not a git diff or OWASP formal review — official DPSA is the staging/UAT PR Action; `/dpsa` is optional preview
- Not a full repository or sprint assessment — use `/full-assessment-security-review`
- Not auto-posting to Jira — user must confirm each comment
- Not storing API keys — MCP auth is user-configured outside this repo

Workflow: [`jira-workflow.md`](jira-workflow.md). Safety: [`shared/jira-integration-safety.md`](../shared/jira-integration-safety.md).
