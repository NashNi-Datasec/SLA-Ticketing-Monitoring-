---
description: Always-on secure coding constraints while generating or editing code
applyTo: "**/*"
---

Provide secure coding guidelines that AI should follow when generating code, answering questions, or editing files.

These instructions guide how to write secure code. They do not perform security reviews or generate formal findings.

Use `/dpsa` only as an **optional** preview of the git diff. The **official** DPSA is the GitHub Action comment on a same-repo PR into staging/UAT.

## Visibility — CIA notice only

Do **not** add a baseline footer on every reply. The baseline applies silently while coding.

When your reply includes **new or modified code**, check whether any touched file path matches sensitive areas such as:

`auth/`, `login/`, `oauth/`, `sso/`, `identity/`, `session/`, `routes/`, `controllers/`, `middleware/`, `api/`, `handlers/`, `graphql/`, `resolvers/`, `models/`, `repositories/`, `queries/`, `dao/`, `services/`, `payments/`, `billing/`, `checkout/`, `uploads/`, `storage/`, `files/`, `tenant/`, `admin/`, `policies/`, `permissions/`, `rbac/`, `webhooks/`, `jobs/`, `workers/`, `rate-limit`, `config/`, `secrets/`, `security/`, `.env`*, `llm/`, `agents/`, `prompts/`, `rag/`, `embeddings/`, `vector/`

If yes — and the changes are not comments, docs, formatting, or styling only — end the response with this one-line note:

> **CIA self-check** — sensitive-path review rules apply to this change.

If no sensitive paths are involved, do not add any visibility footer.

## Security review results (Scenarios 1–2)

These instructions load on **all paths**. Scenario 1 is **automatic** for non-security-only edits — the user does **not** need to ask for a security review.

**Analyst mini-header (Scenarios 1–2):** Before the Result line, always include:

- **Related tickets:** Jira keys (`PROJ-123`) from the user message, branch name, or recent commits when available — else `none detected`. Never invent keys.
- **Change summary:** **1–2 sentences** on what this turn changed (plain language). Not a feature dump.

Do **not** emit `/dpsa` Coverage, Modules loaded, Findings counts, or the full DPSA report template here.

### Scenario 1 — non-security-only (automatic)

When this turn **creates or edits code/content** and the **entire** change is limited to:

- Grammar, spelling, comments, docs, or Markdown changes
- Formatting, whitespace, import ordering, or non-functional cleanup
- Renames with no behavioral impact
- Pure styling or CSS-only changes with no data-flow impact
- Static UI copy / display text with no data-flow or security impact (e.g. adding “Test only” on a page)
- Test-only updates with no production behavior changes

**automatically** end the reply with this block (after the normal coding response). Do **not** wait for the user to ask:

```markdown
**Related tickets:** [PROJ-123 | none detected]
**Change summary:** [1–2 sentences — what changed in this turn]

**AI Security Review Result: PASS** — No security-related code changes detected. A DPSA ticket in Uberticket is not required. Attach this result as evidence to the related Jira ticket(s) or Uberticket Release Ticket. Teams may still file a DPSA for new endpoints/APIs, roles, Access Matrix changes, or new PII/SPI.
```

Do **not** emit Scenario 1 when:

- The reply is Q&A only with **no** code/content change in this turn
- Any part of the change touches security-relevant logic (auth, APIs, payments, uploads, tenant, secrets, LLM/RAG, etc.) — use Scenario 2 / CIA instead

### Scenario 2 — security-related (fallback)

When you are editing logic involving authentication, authorization, APIs, payments, tenant isolation, file uploads, secrets/config, rate limiting, or LLM/agent/RAG — and the change is **not** in the Scenario 1 list — end with:

```markdown
**Related tickets:** [PROJ-123 | none detected]
**Change summary:** [1–2 sentences — what changed in this turn]

**AI Security Review Result: Further Action Required** — Security-related changes involving [auth | API | payments | tenant | LLM | admin | infra | …]. **Official:** open a same-repo PR into staging/UAT (DPSA comment is automatic). **Optional:** `/dpsa` in VS Code to preview — not required before the PR.
```

Prefer the CIA instruction’s Scenario 2 block when that file is already loaded for the path; do not duplicate long coaching.

Rules:

- **Scenario 1 is automatic** on non-security-only edits — no user prompt required
- Scenario 2: emit when making security-topic edits (or when the user asks for a security result on such a change)
- Do **not** emit both Scenario 1 and Scenario 2 in the same reply
- Do **not** emit the full `/dpsa` report template
- Do **not** add a baseline footer on every unrelated reply

Scenario definitions: `.github/skills/shared/dpsa-next-steps.md`

## Requirements

- Never hardcode secrets, API keys, tokens, credentials, or private keys
- Prefer environment variables or approved secret-management solutions
- New or changed API routes must require authentication unless explicitly marked public
- Enforce authorization checks for sensitive actions, admin functions, tenant-scoped data, and privileged operations
- Use parameterized queries, ORM bindings, or prepared statements — never concatenate untrusted input into queries
- Validate and sanitize untrusted input on the server side
- Never rely on client-side validation for security decisions
- Avoid mass assignment risks — use DTOs, allowlists, or explicit field mapping
- Avoid exposing internal implementation details, stack traces, raw exceptions, or debug output in production paths
- Do not log passwords, tokens, session identifiers, secrets, or full sensitive personal data
- Prefer secure defaults and least-privilege access patterns
- Consider business-logic abuse cases such as approval bypass, privilege escalation, workflow skipping, or cross-tenant access
- Prefer minimal, targeted fixes instead of large unrelated refactors
- Never concatenate untrusted input directly into LLM system prompts — use role separation and structured message arrays
- Validate or sandbox LLM output before side-effecting actions (database writes, shell, HTTP requests, file operations)
- Tool and function calls require explicit allowlists and authorization checks — no dynamic tool lists from user input
- Do not log full prompts or model responses containing secrets, tokens, or PII

When suggesting fixes:

- explain the issue briefly
- provide the minimal secure change
- avoid rewriting unrelated logic

## Escalation

For substantial changes involving:

- authentication
- authorization
- APIs
- payments
- tenant isolation
- file uploads
- LLM agents, RAG pipelines, or prompt construction
- administrative actions
- infrastructure or security configuration

suggest opening a same-repo PR into staging/UAT (official DPSA comment). `/dpsa` in VS Code is **optional** preview — not required before the PR. Use the **Scenario 2** block above (Related tickets + Change summary + Result line), even when the file path is outside the CIA `applyTo` globs.

## Scope

- Follow only rules relevant to the current context
- Do not apply unrelated checks
- Keep guidance concise and implementation-focused
- Do not generate speculative security concerns
- Do not produce OWASP ratings or formal DPSA reports while coding
- Formal diff review = staging/UAT PR Action (official) or `/dpsa` (optional preview)
