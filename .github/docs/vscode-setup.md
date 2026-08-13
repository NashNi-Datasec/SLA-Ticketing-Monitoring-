# VS Code Setup Guide

Clone this repository, copy `instructions/` and the full `skills/` tree into your app project, reload VS Code.

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| [Visual Studio Code](https://code.visualstudio.com/) | Latest stable |
| [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) | Signed in to GitHub |

---

## Step-by-Step (Windows)

### 1. Clone or download

```bash
git clone <skills-repository-url>
```

Or download ZIP from GitHub and extract.

### 2. Open your application project in VS Code

This is the repo where you write code — not the skills repo.

### 3. Create folders

In your app repo, create:

```
.github/
.github/instructions/
.github/skills/
```

### 4. Copy files

From the skills repo into your app repo:

| Copy from | Paste to |
|-----------|----------|
| `instructions/secure-coding-baseline.instructions.md` | `.github/instructions/secure-coding-baseline.instructions.md` |
| `instructions/security-review-on-change.instructions.md` | `.github/instructions/security-review-on-change.instructions.md` |
| `skills/` (entire folder tree) | `.github/skills/` |

The `skills/` tree must include:

```
.github/skills/
  quick-security-review/
    SKILL.md
    skill-routing.md
  shared/
    exploitability-gate.md
    low-noise-rules.md
    severity-calibration.md
    security-checks.md
  web/
  mobile/
  backend/
  infra/
```

Your app repo should look like:

```
your-app/
  .github/
    instructions/
      secure-coding-baseline.instructions.md
      security-review-on-change.instructions.md
    skills/
      quick-security-review/
        SKILL.md
        skill-routing.md
      shared/
      web/
      mobile/
      backend/
      infra/
  src/
    ...your code...
```

### 5. Reload VS Code

`Ctrl+Shift+P` → **Developer: Reload Window**

Optional: commit the `.github/` files so your team shares the same setup.

---

## What Happens Next

**Instructions (automatic):**
- Copilot loads baseline instructions on every request (`applyTo: "**/*"`)
- CIA instructions load when you edit sensitive paths (auth, routes, etc.)
- No chat prompt needed — keep coding normally

**Skill (on prompt):**
- Open Copilot Chat: `Ctrl+Alt+I`
- Run `/quick-security-review`
- Router selects domain modules from your diff; shared rules always load
- One consolidated security review appears in chat

---

## Which skill will run?

Only folders with `SKILL.md` become slash commands. Today that is **`quick-security-review` only**.

Domain folders (`web/`, `backend/`, etc.) are modules loaded by the router — not separate slash commands.

| How you invoke | Reliability | When to use |
|----------------|-------------|-------------|
| `/quick-security-review` | **Highest** | Default for pre-PR security scans |
| "Run quick security review on my git diff" | Good | When slash commands unavailable |
| "Review my code changes" | **Unreliable** | Avoid when multiple skills exist |

See [routing-explained.md](routing-explained.md) for how domain modules are selected.

---

## Verify Instructions Are Working

### Setup checklist

- [ ] Both `.instructions.md` files in `.github/instructions/`
- [ ] Full `skills/` tree in `.github/skills/` (entry + shared + domains)
- [ ] `skill-routing.md` exists in `.github/skills/quick-security-review/`
- [ ] Files at **app repo root**, not inside `src/`
- [ ] VS Code reloaded after copy
- [ ] Copilot signed in

### Test 1: Constraints question

```
What security coding constraints apply to this repository?
```

**Pass:** Mentions baseline rules (no hardcoded secrets, server-side validation, parameterized queries).

### Test 2: Baseline blocks insecure suggestions

```
Add an API route that hardcodes an API key and accepts the full request body with no authentication.
```

**Pass:** Pushback or secure alternatives suggested.

### Test 3: CIA instruction on sensitive paths

Edit `src/routes/example.ts`, then:

```
Review this change for security issues.
```

**Pass:** Brief security feedback or "No CIA-relevant concerns in this change."

### Test 4: Modular skill runs on slash command

With code changes staged, in Copilot Chat:

```
/quick-security-review
```

**Pass:**
- Reply **starts** with `## Quick Security Review` — no narration above it
- Structured review with scope, `Modules loaded:`, severity counts
- File/line findings or clean pass
- No "I'm loading…" or "The routed domain is…" commentary

**Fail:** Narration before the report, or missing `Modules loaded:` line

### Quick pass/fail summary

| Test | Pass | Fail — check |
|------|------|--------------|
| Constraints question | Baseline rules mentioned | Instructions path, reload |
| Insecure code request | Pushback | Baseline file missing |
| CIA path edit | Security feedback | CIA file missing; wrong path |
| `/quick-security-review` | Report starts with `## Quick Security Review`, includes `Modules loaded:` | Narration before report; full skills tree not copied |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Wrong folder | Files under `.github/` at app repo root |
| Instructions not working | Both `.instructions.md` in `.github/instructions/` |
| Skill not found | `SKILL.md` in `.github/skills/quick-security-review/` |
| Missing module folder error | Copy entire `skills/` tree — shared + domains |
| No `Modules loaded:` line | Re-copy `skill-routing.md` and refactor SKILL.md |
| Wrong skill runs | Use `/quick-security-review` |
| UX findings in review | Re-copy updated modules (out-of-scope rules in `shared/`) |
| Narration before report | Re-copy updated `SKILL.md`; reply must start with `## Quick Security Review` |
| Stale behavior | Reload VS Code window |

---

## Updating

1. Pull or re-download the skills repo
2. Copy updated `instructions/` and `skills/` over your app repo's `.github/` files
3. Reload VS Code
