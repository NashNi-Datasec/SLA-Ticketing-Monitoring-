# Skill Routing (Full Assessment)

Deterministic module selection for `/full-assessment-security-review`. Follow exactly — no AI discretion.

**Silent execution:** Routing happens internally. Output the report from `SKILL.md` only.

---

## Difference from DPSA (`/dpsa`)

| | `/dpsa` | `/full-assessment-security-review` |
|---|--------------------------|----------------------------------|
| Domain cap | Max **3** domains | **All** domains with matches |
| Scope | Staged / small diff | Date range, PR, PR range, branch |
| Safety | Read-only contract | Read-only + command allowlist |

All other routing behavior is identical.

Scope and file reads are diff-bound. Obey [`shared/read-only-safety.md`](../shared/read-only-safety.md) — do not expand reads to full-repo secret hunting.

---

## Allowed Modules

| Type    | Path              | Load rule                          |
| ------- | ----------------- | ---------------------------------- |
| Shared  | `../shared/*.md`  | **Always** — all 6 files           |
| Web     | `../web/*.md`     | When `web` domain has matches      |
| Mobile  | `../mobile/*.md`  | When `mobile` domain has matches   |
| Backend | `../backend/*.md` | When `backend` domain has matches |
| Infra   | `../infra/*.md`   | When `infra` domain has matches    |

Never load modules outside this structure. Never invent new domains or files.

---

## Domain Path Patterns

Use the **identical** path patterns from [`../dpsa/skill-routing.md`](../dpsa/skill-routing.md) — section **Domain Path Patterns** (web, mobile, backend, infra).

Do not duplicate or alter patterns here. If quick routing patterns change, this skill inherits them automatically.

---

## Routing Algorithm

1. Collect changed file paths from resolved assessment scope (via `scope-resolution.md`)
2. Do **not** include untracked files unless explicitly named by the user
3. For each domain, count how many changed paths match its patterns
4. Load **every** domain folder with match count > 0 — **no max cap**, no dropping
5. Record domains with zero matches as `domains_with_no_changes`
6. Always load all 6 files from `../shared/` (including `read-only-safety.md` and `owasp-risk-rating.md`)
7. For each selected domain, load **every** `.md` file in that domain folder

---

## Ignore Rules

Same as quick review — do not route on:

- `*.md`, `*.txt`, images, lockfiles-only diffs, generated artifacts, snapshots

Unless the user explicitly scopes those files.

---

## Routing Output

Include in the review header:

```
**Domains loaded:** shared, [all matched domains in alphabetical order]
**Domains with no changes:** [domains with zero matches, or "none"]
```

---

## Examples

| Changed files (assessment scope) | Match counts | Modules loaded |
|--------------------------------|--------------|----------------|
| `src/routes/api.ts`, `src/components/Form.tsx`, `terraform/main.tf` | backend: 1, web: 1, infra: 1 | shared, backend, infra, web (all three — not capped) |
| `src/agents/chat.ts`, `src/pages/Login.tsx` | backend: 1, web: 1 | shared, backend, web |
| PR range touching backend + mobile + web + infra | all four > 0 | shared, backend, infra, mobile, web (all four) |
| `README.md` only | none | shared only; domains_with_no_changes: web, mobile, backend, infra |

---

## Nearby Logic Boundary

Same as quick review: inspect nearby logic only if directly referenced by changed code. Do not recursively expand across unrelated modules.
