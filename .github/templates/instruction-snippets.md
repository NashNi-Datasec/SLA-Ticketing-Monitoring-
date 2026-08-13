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

# Path-specific
applyTo: "**/auth/**,**/routes/**,**/api/**"
```

---

## Baseline Visibility Note

Add to always-on instructions:

```markdown
## Visibility — baseline active

When your reply includes new or modified code, end the response with:

> **Secure coding baseline** — active on all files.
```

---

## CIA Trigger Notice

Add when a second instruction layer applies to sensitive paths:

```markdown
## After generating code — CIA instruction notice

When your reply includes new or modified code, check whether any touched file path matches:
`auth/`, `login/`, `routes/`, `controllers/`, `middleware/`, `api/`, ...

If yes — and changes are not comments/docs/formatting only — add after the baseline note:

> **CIA self-check** — sensitive-path review rules apply to this change.
```

---

## Escalation to Skill

```markdown
## Escalation

For substantial authentication, authorization, API, payment, tenant-isolation, or infrastructure-related changes, suggest:

`/quick-security-review`
```

---

## Authoring Rules

- Instructions **prevent** bad patterns while coding
- Instructions do **not** perform security reviews or report findings
- Keep requirements imperative and concise
- Do not duplicate skill checklists in instructions
- Self-contained — no submodule or external repo references
