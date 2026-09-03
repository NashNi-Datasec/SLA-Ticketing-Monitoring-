# Instruction Snippets

Reusable patterns for authoring `.instructions.md` files.

## Frontmatter Template

```yaml
---
description: One-line summary of when these instructions load
applyTo: "glob pattern(s)"
---
```

Examples:

```yaml
# Always-on baseline
applyTo: "**/*"

# Path-specific (keep in sync with "Apply when" topics — services, uploads, tenant, etc.)
applyTo: "**/auth/**,**/routes/**,**/api/**,**/services/**,**/payments/**,**/uploads/**,..."
```

Keep CIA `applyTo` aligned with the topics in **Apply when**. For paths still outside the globs, baseline owns Scenario 2 fallback → `/dpsa`.
---

## CIA Visibility Note

Add to always-on baseline instructions — **CIA only**, not baseline on every reply:

```markdown
## Visibility — CIA notice only

Do not add a baseline footer on every reply. The baseline applies silently.

When your reply includes new or modified code, check whether any touched file path matches:
`auth/`, `login/`, `routes/`, `controllers/`, `middleware/`, `api/`, ...

If yes — and changes are not comments/docs/formatting only — end with:

> **CIA self-check** — sensitive-path review rules apply to this change.

If no sensitive paths are involved, do not add any visibility footer.
```

---

## CIA Instruction Template (sensitive paths)

Separate file: `security-review-on-change.instructions.md` — brief coaching only, not formal review:

```markdown
## Do NOT
- OWASP vectors, severity ratings, or Digital Product Security Assessment (DPSA) format
- Full repository scan or long reports

## Self-check (changed code only)
- [5-6 bullets: auth, injection, mass assignment, secrets, tenant]

## Response rules
- Scenario 1 (non-security): PASS one-liner optional — DPSA ticket not required
- Scenario 2 (security-related): Further Action Required — official: staging/UAT PR; optional: `/dpsa` preview
- Clear issue: 2-4 lines + do not require `/dpsa` before they open a PR
```

Line budget: ≤70 lines.

---

## Escalation to Skill

```markdown
## Escalation

For substantial authentication, authorization, API, payment, tenant-isolation, or infrastructure-related changes, suggest:

`/dpsa`
```

---

## Authoring Rules

- Instructions **prevent** bad patterns while coding — no OWASP vectors or formal review format
- Instructions do **not** perform security reviews — use `/dpsa` for that
- Keep requirements imperative and concise
- Do not duplicate skill checklists in instructions
- Self-contained — no submodule or external repo references
- Point next-step language at `shared/dpsa-next-steps.md` for Scenarios 1–2