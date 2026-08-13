# Skill Snippets

Reusable patterns for authoring skill modules.

## Orchestrator Skill (SKILL.md)

Only folders containing `SKILL.md` become Copilot slash commands.

```yaml
---
name: skill-name
description: Short summary for auto-discovery. State what it does and what it is NOT for.
---
```

Orchestrator skills reference `skill-routing.md` and load modules — they do not embed checklists.

---

## Domain Module Template

```markdown
# {Domain} — {Topic}

Apply to changed {context} code only.

## Checks

1. **Check name** — description with CWE if applicable
2. ...

## Patterns

\`\`\`
regex or code patterns for changed files
\`\`\`

Apply exploitability gate. Report File + Line from diff only.
Out-of-scope items → see shared/low-noise-rules.md.
```

Line budget: ≤80 lines per module.

---

## Shared Module Template

```markdown
# {Rule Name}

Apply to every review / every candidate finding.

## Rules

- Imperative, deterministic rules
- No domain-specific checks here

Cross-reference other shared files instead of duplicating content.
```

---

## Routing Table Row Template

Add to `skill-routing.md` when introducing a new domain or path pattern:

```markdown
### domain-name

- `**/path/pattern/**`
- `**/*.ext`
```

Update tie-break order and examples if adding a new domain (requires architecture review).

---

## Authoring Rules

- Markdown-only — no code execution
- Modules are **not** slash commands (no SKILL.md in domain folders)
- Must not write report files — chat output only
- Checks apply to **git diff / changed lines only**
- Apply `shared/exploitability-gate.md` before reporting
- Follow `shared/severity-calibration.md` for severity
