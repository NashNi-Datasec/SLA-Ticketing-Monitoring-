# Jira Integration Safety

Apply to `/jira-security-advisory` and Security Advisor when fetching or posting to Jira via MCP.

Separate from `read-only-safety.md` — Jira comment posting is allowed **only with explicit user confirmation**.

---

## Credentials

- Never store API tokens, PATs, or passwords in the repo, skill files, or chat output.
- Use VS Code MCP authentication: OAuth (Jira Cloud), org-enabled API token, or user-level PAT in VS Code settings.
- Document only credential **variable names** in setup docs — never values.
- If credentials appear in a fetched ticket description, **redact** them in the chat report.

---

## Fetch (read-only)

Allowed Jira MCP operations for this workflow:

- Get issue by key (summary, description, type, labels, acceptance criteria if present)
- JQL search **only** when resolving a single issue key fails and user provides search criteria

Do not fetch unrelated issues or bulk-export project data.

---

## Post (write — confirm first)

Post a comment **only when**:

1. The user explicitly confirms (e.g. `yes`, `yes post to PROJ-123`) in a follow-up message
2. One issue per confirmation — do not batch-post to multiple issues
3. Comment body is the **Suggested Security Note (Jira-ready)** section only — not the full advisory report

Do **not** auto-post. Do not post on skill completion without asking.

---

## Forbidden Jira operations (unless user explicitly requests outside this skill)

- Transition workflow status
- Edit issue fields (summary, description, assignee, priority)
- Create or link issues
- Add worklogs
- Delete comments

---

## Fallback

If Atlassian MCP is unavailable, not authenticated, or fetch fails:

1. Stop further MCP/API attempts for this session turn
2. Ask the user to paste ticket summary and description
3. Still produce the full advisory report and Jira-ready note for manual paste

Point users to [Jira Copilot Setup](../../docs/jira-copilot-setup.md) for MCP configuration.

---

## Content handling

- Redact tokens, passwords, and API keys from ticket text in the **chat report**
- Jira comment uses sanitized **Suggested Security Note** content only
- Human must review comment text before confirming post
