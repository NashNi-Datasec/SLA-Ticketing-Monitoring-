---
description: Always-on secure coding constraints while generating or editing code
applyTo: "**/*"
---

Provide secure coding guidelines that AI should follow when generating code, answering questions, or editing files.

These instructions guide how to write secure code. They do not perform security reviews or generate formal findings.

Use `/quick-security-review` for focused security review of code changes.

## Visibility — baseline active

When your reply includes new or modified code, end the response with this one-line note:

> **Secure coding baseline** — active on all files.

Keep it to that single line. Do not repeat or summarize the full rule list.

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

When suggesting fixes:

- explain the issue briefly
- provide the minimal secure change
- avoid rewriting unrelated logic

## After generating code — CIA instruction notice

When your reply includes new or modified code, check whether any touched file path matches:

`auth/`, `login/`, `routes/`, `controllers/`, `middleware/`, `api/`, `handlers/`, `models/`, `payments/`, `admin/`, `config/`, `.env`*

If yes — and the changes are not comments, docs, formatting, or styling only — add this note after the baseline note:

> **CIA self-check** — sensitive-path review rules apply to this change.

If no sensitive paths are involved, do not mention the CIA self-check.

## Escalation

For substantial changes involving:

- authentication
- authorization
- APIs
- payments
- tenant isolation
- file uploads
- administrative actions
- infrastructure or security configuration

suggest:

`/quick-security-review`

## Scope

- Follow only rules relevant to the current context
- Do not apply unrelated checks
- Keep guidance concise and implementation-focused
- Do not generate speculative security concerns

