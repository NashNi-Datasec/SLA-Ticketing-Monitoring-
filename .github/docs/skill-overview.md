# Skill Overview

Catalog of all modules in the Cloudstaff AI Security system.

**Entry points:** `/dpsa` (optional VS Code preview), GitHub Action on staging/UAT PRs (official), `/full-assessment-security-review` (wide-scope), `/jira-security-advisory` (Jira via MCP), `/dependabot-assess` (Dependabot vs this app).

---

## Entry Skills

| File | Purpose |
|------|---------|
| `skills/dpsa/SKILL.md` | DPSA orchestrator — optional VS Code preview; same report as the PR Action |
| `skills/dpsa/skill-routing.md` | Path → domain selection (max 3 domains) |
| `skills/full-assessment-security-review/SKILL.md` | Assessment orchestrator — date/PR/branch scope, all domains |
| `skills/full-assessment-security-review/skill-routing.md` | Path → domain selection (all matches, no cap) |
| `skills/full-assessment-security-review/scope-resolution.md` | git + `gh` scope resolution |
| `skills/jira-security-advisory/SKILL.md` | Jira orchestrator — MCP fetch, Security Advisor report, confirm-before-post |
| `skills/jira-security-advisory/jira-workflow.md` | MCP tool mapping, issue key parsing, comment template |
| `skills/dependabot-assess/SKILL.md` | Dependabot orchestrator — alert vs app; chat only; never upgrades |
| `skills/dependabot-assess/alert-scope.md` | Args (`11`, `1-5`, default 3 newest open High/Critical) + `gh` GET allowlist |
| `skills/dependabot-assess/assessment-checks.md` | Usage, reachability, confidence, blast-radius advice |

### DPSA vs Full Assessment vs Jira

| | DPSA (`/dpsa`) | Full Assessment |
|---|-------|-----------------|
| **Invoke** | `/dpsa` | `/full-assessment-security-review` |
| **Scope** | Staged, branch vs HEAD | Date range, PR, PR range, branch |
| **Domains** | Max 3 | All matching |
| **Report** | Result + What to do next (evidence / fix / Uberticket DPSA) | Metadata + executive summary + P1/P2/P3 actions |
| **PR support** | Manual branch | `gh pr diff` (allowlisted read-only) |
| **Safety** | Read-only contract | Read-only + git/gh command allowlist |

| | Jira Advisory |
|---|---------------|
| **Invoke** | `/jira-security-advisory PROJ-123` |
| **Scope** | Single Jira issue (MCP fetch or paste) |
| **Output** | Security Advisor sections + Jira-ready note |
| **External** | Atlassian MCP (user-configured) |
| **Post** | Optional comment after explicit `yes` |

| | Dependabot assess |
|---|---------------|
| **Invoke** | `/dependabot-assess` · `/dependabot-assess 11` · `/dependabot-assess 1-5` |
| **Scope** | Default: 3 newest open High/Critical; or alert # / number range |
| **Output** | Affected / Not affected / Uncertain + confidence + blast-radius **advice** |
| **External** | `gh` (read Dependabot alerts) |
| **Changes** | **Never** — no upgrade, dismiss, or file writes |

---

## Shared Modules (always loaded)

| File | Purpose |
|------|---------|
| `skills/shared/exploitability-gate.md` | Inclusion gate (report or skip) + Cloudstaff threat agents; OWASP handles severity |
| `skills/shared/low-noise-rules.md` | Out-of-scope items, clean pass rule |
| `skills/shared/severity-calibration.md` | OWASP report labels and confidence levels |
| `skills/shared/owasp-risk-rating.md` | OWASP factor scoring, matrix, Cloudstaff defaults, calculator URLs |
| `skills/shared/security-checks.md` | Diff-only universal triage + evidence rules (anti-hallucination); runs after domain modules |
| `skills/shared/read-only-safety.md` | Read-only contract — no exec, deploy, repo mutation, or direct secret access |
| `skills/shared/dpsa-next-steps.md` | Scenario → next-action matrix (PASS, Further Action, Issue Identified, Incomplete) — loaded by `/dpsa` |
| `skills/shared/jira-integration-safety.md` | Jira MCP safety — credentials, confirm-before-post, redact secrets (loaded by Jira skill) |

---

## Web Domain

Loaded when diff paths match frontend patterns (`.tsx`, `components/`, `pages/`, etc.).

| File | Focus |
|------|-------|
| `skills/web/auth-review.md` | Token storage, OAuth, PKCE, session handling, cookie flags |
| `skills/web/api-security.md` | CSRF, API keys in frontend, WebSocket auth, GraphQL variables |
| `skills/web/frontend-security.md` | XSS sinks, CSP bypass, postMessage, DOM clobbering |
| `skills/web/business-logic.md` | Client-trusted workflow state, price manipulation, feature bypass |

---

## Mobile Domain

Loaded when diff paths match Android/iOS patterns.

| File | Focus |
|------|-------|
| `skills/mobile/android-security.md` | Exported components, WebView bridges, insecure storage, deep links |
| `skills/mobile/ios-security.md` | Keychain/UserDefaults, WKWebView, ATS, pasteboard exposure |

---

## Backend Domain

Loaded when diff paths match server-side patterns (including plain `.ts` and AI paths like `agents/`, `llm/`, `rag/`). When zero domains match, only **shared** modules load — backend is not a fallback.

| File | Focus |
|------|-------|
| `skills/backend/injection-prevention.md` | SQL, NoSQL, command, template, path traversal, header/log injection, ReDoS |
| `skills/backend/database-security.md` | IDOR queries, raw ORM, over-fetching, pagination abuse, RLS bypass |
| `skills/backend/tenant-isolation.md` | Missing tenant filters, cross-tenant IDOR, cache keys, job context |
| `skills/backend/llm-security.md` | Prompt injection, RAG context, tool calling, output handling, model API abuse |

---

## Infra Domain

Loaded when diff paths match Terraform, Docker, K8s, env files, etc.

| File | Focus |
|------|-------|
| `skills/infra/cloud-security.md` | Public buckets, IAM `*`, security groups, vector DB exposure |
| `skills/infra/iac-security.md` | Secrets in IaC, privileged containers, wildcard RBAC |
| `skills/infra/secrets-management.md` | Hardcoded secrets, LLM provider keys, client-exposed env vars |
| `skills/infra/dependency-changes.md` | Manifest downgrades, LLM SDK pinning, lifecycle script secrets |

---

## Instructions (automatic, not skills)

| File | When active |
|------|-------------|
| `instructions/secure-coding-baseline.instructions.md` | Always (`applyTo: "**/*"`) |
| `instructions/security-review-on-change.instructions.md` | Sensitive paths (auth, routes, API, etc.) |

Instructions are copied to `.github/instructions/` — they are not slash commands.

---

## Agents (selectable personas)

Copied to `.github/agents/` — appear in the Copilot agent picker. Not slash commands.

| File | When to use |
|------|-------------|
| `agents/security-review.agent.md` | Same workflow as `/dpsa` (optional preview; official is the PR Action) |
| `agents/security-advisor.agent.md` | Threat modeling, security AC, Jira MCP fetch/post when configured |
| `agents/dpsa-finding-analyst.agent.md` | One pasted DPSA File+Line — confirm / explain / suggest fix only |
| `agents/dependabot-advisor.agent.md` | Dependabot guidance and bump implications — never upgrades |

Agents complement skills — they do **not** replace the skill router or duplicate domain checklists.

**Naming note:** Copilot personas live in `.github/agents/` (chat picker). Router pattern `**/agents/**` matches **app source code** for LLM implementations — not Copilot agent files.

See [templates/agent-snippets.md](../templates/agent-snippets.md) for authoring patterns.

---

## When to Use What

| Need | Use |
|------|-----|
| Secure code while typing | Instructions (automatic) |
| Formal diff review | Staging/UAT PR (official) or optional `/dpsa` / Security Review agent |
| Sprint / release / multi-PR assessment | `/full-assessment-security-review` |
| Jira ticket fetch + optional comment | `/jira-security-advisory` — see [jira-copilot-setup.md](jira-copilot-setup.md) |
| Dependabot High/Critical vs this app | `/dependabot-assess` or **Dependabot Advisor** — never upgrades |
| One DPSA finding: is it real / how to fix | **DPSA Finding Analyst** — suggestions only |
| Ticket/feature security AC (paste) | Security Advisor agent |
| Brief security reminder on sensitive paths | CIA self-check instruction (automatic) |

---

## Module Count Summary

| Category | Files |
|----------|-------|
| Entry + router + scope + jira + dependabot | 10 |
| Shared | 8 |
| Web | 4 |
| Mobile | 2 |
| Backend | 4 |
| Infra | 4 |
| **Total skill module files** | **32** (8 shared + 14 domain + 10 entry) |

---

## Adding New Modules

1. Add the module file to the correct domain folder (or `shared/` if universal)
2. If new path patterns are needed, update `dpsa/skill-routing.md` (full assessment inherits patterns automatically)
3. Document in this file
4. See [templates/skill-snippets.md](../templates/skill-snippets.md)

Do **not** add `SKILL.md` to domain folders — that would create unwanted slash commands.
