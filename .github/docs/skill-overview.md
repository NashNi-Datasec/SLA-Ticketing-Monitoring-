# Skill Overview

Catalog of all modules in the CloudStaff Security AI Skills system.

**Entry point:** `/quick-security-review` — the only Copilot slash command.

---

## Entry Skill

| File | Purpose |
|------|---------|
| `skills/quick-security-review/SKILL.md` | Orchestrator — reads diff, loads router + modules, outputs report |
| `skills/quick-security-review/skill-routing.md` | Deterministic path → domain selection (max 3 domains) |

---

## Shared Modules (always loaded)

| File | Purpose |
|------|---------|
| `skills/shared/exploitability-gate.md` | Attacker + Path + Impact gate before reporting |
| `skills/shared/low-noise-rules.md` | Out-of-scope items, clean pass rule |
| `skills/shared/severity-calibration.md` | Severity table and confidence levels |
| `skills/shared/security-checks.md` | Universal CWE-ordered checks and search patterns |

---

## Web Domain

Loaded when diff paths match frontend patterns (`.tsx`, `components/`, `pages/`, etc.).

| File | Focus |
|------|-------|
| `skills/web/auth-review.md` | Token storage, OAuth, session handling, protected routes |
| `skills/web/api-security.md` | CSRF, API keys in frontend, sensitive data in URLs |
| `skills/web/frontend-security.md` | XSS sinks, postMessage, DOM-based XSS |
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

Loaded when diff paths match server-side patterns. Also used as **fallback** when no domain matches.

| File | Focus |
|------|-------|
| `skills/backend/injection-prevention.md` | SQL, NoSQL, command, template, path traversal |
| `skills/backend/database-security.md` | IDOR queries, raw ORM, over-fetching, pagination abuse |
| `skills/backend/tenant-isolation.md` | Missing tenant filters, cross-tenant IDOR, cache keys |

---

## Infra Domain

Loaded when diff paths match Terraform, Docker, K8s, env files, etc.

| File | Focus |
|------|-------|
| `skills/infra/cloud-security.md` | Public buckets, IAM `*`, security groups, encryption |
| `skills/infra/iac-security.md` | Secrets in IaC, privileged containers, wildcard RBAC |
| `skills/infra/secrets-management.md` | Hardcoded secrets, client-exposed env vars, weak defaults |

---

## Instructions (automatic, not skills)

| File | When active |
|------|-------------|
| `instructions/secure-coding-baseline.instructions.md` | Always (`applyTo: "**/*"`) |
| `instructions/security-review-on-change.instructions.md` | Sensitive paths (auth, routes, API, etc.) |

Instructions are copied to `.github/instructions/` — they are not slash commands.

---

## Module Count Summary

| Category | Files |
|----------|-------|
| Entry + router | 2 |
| Shared | 4 |
| Web | 4 |
| Mobile | 2 |
| Backend | 3 |
| Infra | 3 |
| **Total skill modules** | **15** (+ 2 instruction files) |

---

## Adding New Modules

1. Add the module file to the correct domain folder (or `shared/` if universal)
2. If new path patterns are needed, update `skill-routing.md`
3. Document in this file
4. See [contributing.md](contributing.md) and [templates/skill-snippets.md](../templates/skill-snippets.md)

Do **not** add `SKILL.md` to domain folders — that would create unwanted slash commands.
