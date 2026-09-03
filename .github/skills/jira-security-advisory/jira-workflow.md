# Jira Workflow

Deterministic MCP steps for `/jira-security-advisory`. Follow exactly — no AI discretion.

**Silent execution:** Fetch and post internally. Do not describe MCP steps in the chat reply.

Obey [`../shared/jira-integration-safety.md`](../shared/jira-integration-safety.md).

Setup: [Jira Copilot Setup](../../docs/jira-copilot-setup.md)

---

## Issue Key Parsing

Pattern: `[A-Z][A-Z0-9]+-\d+`

Examples: `PROJ-123`, `SEC-1`, `CLOUDSTAFF-456`

Extract from slash command args or user message. Case-insensitive input — normalize to uppercase in report header.

If multiple keys appear, use the first unless user specifies otherwise.

---

## MCP Tool Names

Tool names vary by Atlassian MCP server version. Prefer the closest match visible in Copilot **Tools**:

| Intent | Common tool names |
|--------|-------------------|
| Fetch issue | `getJiraIssue`, `jira_get_issue`, `get_issue` |
| Add comment | `addCommentToJiraIssue`, `jira_add_comment`, `add_comment` |

If exact names differ, use the MCP tool that fetches an issue by key and the tool that adds a comment to an issue.

Do not use create, transition, edit, or worklog tools in this skill.

---

## Fetch Issue

When Atlassian MCP tools are available:

1. Call get-issue tool with parsed key
2. Extract: summary, description, issue type, labels, acceptance criteria / custom fields if returned
3. Redact secrets (tokens, passwords, API keys) from description before including in analysis

**Auth failure** — stop MCP attempts; reply inside report under Questions / Missing Info:

> Jira MCP authentication failed. See docs/jira-copilot-setup.md — paste ticket text to continue.

**MCP not available** — ask user to paste summary and description; proceed with pasted content.

---

## Advisory Analysis

Apply the same sections as Security Advisor ([`agents/security-advisor.agent.md`](../../agents/security-advisor.agent.md) Output Format).

Tailor using `.github/security-context.md` when present:

- `platform`, `app_size`, `data_classification`, `external_users`
- `uses_llm: true` → LLM / Agent Considerations with concrete controls
- `uses_llm: false` → `N/A — no LLM/agent scope identified.`

---

## Suggested Security Note (Jira-ready)

Format for Jira wiki markup (Cloud / Server compatible plain structure):

```
h3. Security advisory (Cloudstaff AI Security)

*Security goal:* [one line]

*Key acceptance criteria:*
* [criterion 1]
* [criterion 2]

*Validation areas:*
* [test area 1]
* [test area 2]

*Before merge:* run formal diff review (/dpsa or Security Review agent).
```

Keep concise — suitable as a Jira comment. No raw secrets from the ticket.

---

## Post Comment (confirm first)

**Only on follow-up turn** when user explicitly confirms (`yes`, `yes post`, `confirm`, etc.).

1. Use **Suggested Security Note (Jira-ready)** body only — not the full report
2. Call add-comment MCP tool with issue key and comment body
3. Reply **one line only**:
   - Success: `Posted security note to PROJ-123.`
   - Failure: `Failed to post comment: [brief reason]. Check Jira MCP auth in docs/jira-copilot-setup.md.`

If user replies `no` or skips: do not post. No further action required.

One issue per confirmation. Do not post to multiple issues without separate confirmations.

---

## Error Messages

| Situation | User-visible handling |
|-----------|----------------------|
| Invalid issue key | Ask once for valid key or paste |
| Issue not found | Note in Questions / Missing Info; offer paste fallback |
| MCP auth failed | Link to setup doc; paste fallback |
| Post permission denied | One-line error; do not retry without user action |
