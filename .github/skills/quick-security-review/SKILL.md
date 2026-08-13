---
name: quick-security-review
description: Modular security router for git diff review. Reply with the formatted report ONLY — no process narration, no loading/routing commentary. Security-only — not general code review.
---

# Quick Security Review

Deterministic security router. Reads git diff, routes to domain modules, outputs one consolidated review.

**Invoke:** `/quick-security-review`

This skill is an **orchestrator only**. It does not contain checklists — those live in `shared/` and domain folders.

---

## Output Only Rule (CRITICAL)

Your **entire reply** must be the formatted report below. Nothing before it. Nothing after it.

The **first line** of your reply must be:

```
## Quick Security Review
```

**Forbidden** — do not include any of these in your reply:

- Process narration ("I'm reviewing…", "I'm loading…", "The routed domain is…")
- Routing commentary ("before I apply the exploitability gate…")
- Tool/file read announcements ("Read landing-page.diff", "Loading shared rules…")
- Preamble or epilogue outside the report template

Load diff, route, and apply modules **silently**. The user sees only the final report (or one scope question if no diff exists).

---

## Mandatory Execution Sequence

Follow exactly. No AI discretion on routing or module selection.

1. **Get git diff** (silently)
  - Prefer: `git diff main...HEAD`, `git diff --cached`, or staged/unstaged changes
  - User-named files only if no diff exists
  - Do **not** scan the full repository
  - Do **not** read untracked files unless user explicitly names them
2. **If no diff exists** — ask once: "Which branch or files should I compare against?" Then stop.
3. **Read `skill-routing.md`** from this folder — apply routing algorithm exactly
4. **Load modules** (paths relative to `.github/skills/`):
  - Always: `shared/exploitability-gate.md`, `shared/low-noise-rules.md`, `shared/severity-calibration.md`, `shared/security-checks.md`
  - Domains: all `.md` files in each selected domain folder (max 3 domains per `skill-routing.md`)
5. Apply checks to changed lines and directly related nearby logic only.
6. **Apply exploitability gate** from `shared/exploitability-gate.md` — discard failures
7. **Output** — emit the report template below as your **complete reply**. No other text.

---

## Execution Rules

- Reply must **start** with `## Quick Security Review` — no text above it
- Do **not** narrate steps ("I'm pulling the diff…", "I'm loading modules…", "The routed domain is…")
- Do **not** describe routing, module loading, or gate application in the reply
- Do **not** write files (`.diff`, reports, markdown exports)
- Do **not** invent modules outside `shared/`, `web/`, `mobile/`, `backend/`, `infra/`
- Do **not** load more than 3 domain folders
- Work in memory; the visible reply is the report only

If a required module folder is missing, stop and report:

> Missing module folder: `.github/skills/{folder}/`. Copy the full skills tree from the CloudStaff skills repository.

---

## Output Format

```markdown
## Quick Security Review

**Scope:** [files or diff reviewed]
**Modules loaded:** shared, [domain1], [domain2]
**Findings:** Critical N | High N | Medium N | Low N

### Critical / High
- **[SEVERITY] Title**
  - File: `path/to/file.ext`
  - Line: N
  - Security impact: [realistic attack scenario]
  - Fix: [minimal secure fix]
  - Confidence: High | Medium | Low

### Medium / Low
- Same format or "None"

### Summary
If findings exist: brief assessment + highest priority fix.
If clean: No exploitable security issues found in the changed code.
```

Include File and Line for every finding. Omit empty severity sections. Follow `shared/severity-calibration.md` and `shared/low-noise-rules.md`.

### Wrong vs right

**Wrong** (narration before report):

> I'm reviewing the tracked git diff only and loading the security-review routing modules…
>
> ## Quick Security Review
>
> ...

**Right** (report only):

```markdown
## Quick Security Review

**Scope:** LandingPage.tsx, AppContent.tsx
**Modules loaded:** shared, web
**Findings:** Critical 0 | High 0 | Medium 0 | Low 0

### Summary
No exploitable security issues found in the changed code.
```

---

# What This Skill Is NOT

- Not a general code review
  - UX
  - copy
  - refactors
  - maintainability
  - styling
  - tests
  - performance  
  are out of scope unless they introduce a direct security impact
- Not a full repository audit
- Not a free-form autonomous agent

Routing behavior is defined by: quick-security-review/[skill-routing.md](http://skill-routing.md) 

For substantial auth, API, payment, or infra changes, suggest `/quick-security-review` before merge.