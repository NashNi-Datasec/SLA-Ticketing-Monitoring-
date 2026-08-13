# Contributing

Guidelines for updating CloudStaff Security AI Skills.

## Repository Layout

```
instructions/          # Copilot instructions (automatic while coding)
skills/
  quick-security-review/   # Entry skill + router (slash command)
  shared/                  # Always-loaded rules
  web/ mobile/ backend/ infra/   # Domain modules
templates/             # Author snippets (not copied to app repos)
docs/                  # Architecture and setup docs
```

Developers copy `instructions/` and the full `skills/` tree to `.github/` in their app repo. See [README](../README.md).

---

## Instruction Authoring

Files in `instructions/` — `.instructions.md` suffix with YAML frontmatter:

| File | Purpose | Line budget |
|------|---------|-------------|
| `secure-coding-baseline.instructions.md` | Always-on secure coding | ≤50 lines requirements |
| `security-review-on-change.instructions.md` | CIA-gated self-check | ≤80 lines |

```yaml
---
description: When these instructions should load
applyTo: "glob pattern(s)"
---
```

Rules:
- Instructions **prevent** bad patterns while coding
- Instructions do **not** perform security reviews — that's the skill system's job
- Self-contained — no submodule references
- See [templates/instruction-snippets.md](../templates/instruction-snippets.md)

---

## Skill Authoring

### Entry skill (orchestrator)

| File | Purpose | Line budget |
|------|---------|-------------|
| `skills/quick-security-review/SKILL.md` | Orchestrator only — no inline checklists | ≤100 lines |
| `skills/quick-security-review/skill-routing.md` | Deterministic domain selection | As needed |

Only `SKILL.md` files create slash commands. **Never add `SKILL.md` to domain folders.**

### Shared modules

| File | Purpose |
|------|---------|
| `shared/exploitability-gate.md` | Universal reporting gate |
| `shared/low-noise-rules.md` | Out-of-scope + clean pass |
| `shared/severity-calibration.md` | Severity and confidence |
| `shared/security-checks.md` | Universal CWE checks |

Always loaded. Keep DRY — don't duplicate shared rules in domain modules.

### Domain modules

| Folder | Files | Line budget each |
|--------|-------|------------------|
| `web/` | 4 modules | ≤80 lines |
| `mobile/` | 2 modules | ≤80 lines |
| `backend/` | 3 modules | ≤80 lines |
| `infra/` | 3 modules | ≤80 lines |

Domain modules add checks on top of shared rules. Apply to changed lines only.

See [templates/skill-snippets.md](../templates/skill-snippets.md).

---

## Routing Changes

When adding path patterns or domains:

1. Update `skills/quick-security-review/skill-routing.md`
2. Update [docs/routing-explained.md](routing-explained.md) with examples
3. Update [docs/skill-overview.md](skill-overview.md) catalog
4. Do not create new slash commands without architecture review

Max 3 domain folders per review. Tie-break: `backend` > `web` > `infra` > `mobile`.

---

## Pull Request Checklist

- [ ] Instructions remain self-contained
- [ ] Orchestrator has no inline checklists (delegates to modules)
- [ ] Shared rules not duplicated in domain modules
- [ ] Skill has valid `name` and `description` frontmatter
- [ ] No `SKILL.md` added to domain/shared folders
- [ ] `skill-routing.md` updated if path patterns changed
- [ ] README copy table matches actual paths
- [ ] Line budgets respected
- [ ] Chat-only output — no report files

---

## Who Can Contribute

Security engineers and developers who identify gaps in instructions or skill modules.
