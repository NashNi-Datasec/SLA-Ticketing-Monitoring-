---
description: Brief security self-check when code changes may impact confidentiality, integrity, or availability
applyTo: "**/auth/**,**/login/**,**/oauth/**,**/sso/**,**/identity/**,**/sessions/**,**/session/**,**/routes/**,**/controllers/**,**/middleware/**,**/api/**,**/handlers/**,**/graphql/**,**/resolvers/**,**/models/**,**/repositories/**,**/repository/**,**/queries/**,**/query/**,**/dao/**,**/services/**,**/service/**,**/payments/**,**/payment/**,**/billing/**,**/checkout/**,**/uploads/**,**/upload/**,**/storage/**,**/files/**,**/tenant/**,**/tenants/**,**/admin/**,**/policies/**,**/policy/**,**/permissions/**,**/rbac/**,**/acl/**,**/webhooks/**,**/webhook/**,**/jobs/**,**/workers/**,**/rate-limit*/**,**/ratelimit*/**,**/throttle*/**,**/config/**,**/secrets/**,**/security/**,**/.env*,**/llm/**,**/agents/**,**/prompts/**,**/rag/**,**/embeddings/**,**/vector/**"
---

Provide a brief CIA-gated security self-check when editing sensitive code paths.

This is **coaching while coding** — not a formal `/dpsa` review. Keep outputs short.

**How loading works:** Copilot attaches this file only when the edited path matches `applyTo` above. The **Apply when** / **Skip** sections are a second filter after it loads. Paths outside `applyTo` still get `secure-coding-baseline.instructions.md` (always on). Formal DPSA is the staging/UAT PR Action; `/dpsa` is optional preview.

This file owns **Scenario 2** (security-related change) when loaded. **Scenario 1** (non-security-only PASS) lives in `secure-coding-baseline.instructions.md`. Scenario definitions: `.github/skills/shared/dpsa-next-steps.md`

## Do NOT

- Output OWASP vectors, severity ratings, or **Digital Product Security Assessment (DPSA)** report format
- Perform a full repository scan or generate long reports
- Invent issues not visible in the current change
- Duplicate the `/dpsa` report — the official review is the staging/UAT PR Action; `/dpsa` is optional preview

## Skip when changes are only

- Grammar, spelling, comments, docs, or Markdown changes
- Formatting, whitespace, import ordering, or non-functional cleanup
- Renames with no behavioral impact
- Pure styling or CSS-only changes with no data-flow impact
- Static UI copy / display text with no data-flow or security impact
- Test-only updates with no production behavior changes

If changes are limited to those cases, do not run this CIA check. **Scenario 1** from `secure-coding-baseline.instructions.md` is automatic (Related tickets + Change summary + PASS) — do not block or replace that block.

## Apply when changes involve

Authentication, authorization, API routes, SQL/queries, file uploads, payments, tenant isolation, secrets/config, rate limiting, or LLM/agent/RAG logic — when there is **real logic change** in the diff.

## Self-check (changed code only)

Glance at the current change for:

- Missing authentication or authorization on new/changed endpoints
- Injection or unsafe query construction with user input
- Mass assignment or accepting full request body on sensitive updates
- Hardcoded secrets or credentials
- Broken tenant isolation (ID without ownership/tenant filter)
- Client-trusted price, role, or status used server-side
- Prompt injection or untrusted content in LLM/RAG context construction
- Tool or function execution without authorization checks
- Secrets or PII embedded in prompts sent to external model APIs

Only flag what you can see in the **current change**. If uncertain, skip — do not speculate.

## Response rules (Scenario 2)

**Scenario 2 — security-related change** (paths/topics above), no formal findings yet. End with this block (keep coaching short above it if needed):

```markdown
**Related tickets:** [PROJ-123 | none detected]
**Change summary:** [1–2 sentences — what changed in this turn]

**AI Security Review Result: Further Action Required** — Security-related changes involving [auth | API | payments | tenant | LLM | admin | infra | …]. **Official:** open a same-repo PR into staging/UAT (DPSA comment is automatic). **Optional:** `/dpsa` in VS Code to preview — not required before the PR.
```

Ticket keys: from user message, branch name, or recent commits when available — else `none detected`. Never invent keys.

**Clear issue in current change:** 2–4 lines — concern, minimal fix, then the Scenario 2 block. Do not require `/dpsa` before they open a PR.

- Keep feedback inline with coding help — not a standalone audit
- Do not create report files
- Do not emit the full `/dpsa` report template (no Coverage / Modules loaded / Findings counts here)
## Escalation

For substantial auth, API, payment, tenant-isolation, LLM/agent, or infrastructure changes:

**Official:** open a same-repo PR into staging/UAT.

**Optional:** `/dpsa`
