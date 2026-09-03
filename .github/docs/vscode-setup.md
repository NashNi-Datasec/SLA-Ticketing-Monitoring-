# VS Code Setup Guide

Clone this repository, copy `instructions/`, `skills/`, `agents/`, `workflows/`, and `dpsa-ci/` into your app repo’s `.github/`, reload VS Code. Organization repos use `${{ github.token }}` for PR comments (no secret). User-owned repos need a PAT in Actions secret `COPILOT_GITHUB_TOKEN`. See [README Quick Setup](../README.md#quick-setup).

**Model:** 2 instructions (automatic while coding) + 4 skills + 4 agents.

**Skills:** `/dpsa` (optional preview; official DPSA is the staging/UAT PR Action), `/full-assessment-security-review` (date range, PR, branch), `/jira-security-advisory` (Jira tickets via MCP), and `/dependabot-assess` (Dependabot alerts vs this app; never upgrades). PR and Dependabot scope require [GitHub CLI](https://cli.github.com/) (`gh`) authenticated (`gh` needs Dependabot alerts **read** for `/dependabot-assess`). Jira scope requires [Atlassian MCP](jira-copilot-setup.md).

Workflow and scenarios: [development-workflow.md](development-workflow.md).

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
git clone https://github.com/cloudstaff-apps/ai-security.git
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
.github/agents/
.github/workflows/
.github/dpsa-ci/
```

### 4. Copy files

From the skills repo into your app repo:

| Copy from | Paste to |
|-----------|----------|
| `instructions/secure-coding-baseline.instructions.md` | `.github/instructions/secure-coding-baseline.instructions.md` |
| `instructions/security-review-on-change.instructions.md` | `.github/instructions/security-review-on-change.instructions.md` |
| `skills/` (entire folder tree) | `.github/skills/` |
| `agents/security-review.agent.md` | `.github/agents/security-review.agent.md` |
| `agents/security-advisor.agent.md` | `.github/agents/security-advisor.agent.md` |
| `agents/dpsa-finding-analyst.agent.md` | `.github/agents/dpsa-finding-analyst.agent.md` |
| `agents/dependabot-advisor.agent.md` | `.github/agents/dependabot-advisor.agent.md` |
| `workflows/` | `.github/workflows/` |
| `dpsa-ci/` | `.github/dpsa-ci/` |

The `skills/` tree must include:

```
.github/skills/
  dpsa/
    SKILL.md
    skill-routing.md
  full-assessment-security-review/
    SKILL.md
    skill-routing.md
    scope-resolution.md
  jira-security-advisory/
    SKILL.md
    jira-workflow.md
  dependabot-assess/
    SKILL.md
    alert-scope.md
    assessment-checks.md
  shared/
    exploitability-gate.md
    low-noise-rules.md
    severity-calibration.md
    owasp-risk-rating.md
    security-checks.md
    read-only-safety.md
    dpsa-next-steps.md
    jira-integration-safety.md
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
      dpsa/
        SKILL.md
        skill-routing.md
      full-assessment-security-review/
        SKILL.md
        skill-routing.md
        scope-resolution.md
      jira-security-advisory/
        SKILL.md
        jira-workflow.md
      dependabot-assess/
        SKILL.md
        alert-scope.md
        assessment-checks.md
      shared/
      web/
      mobile/
      backend/
      infra/
    agents/
      security-review.agent.md
      security-advisor.agent.md
      dpsa-finding-analyst.agent.md
      dependabot-advisor.agent.md
    workflows/
      dpsa-pr-comment.yml
    dpsa-ci/
      dpsa-ci-prompt.md
      post-dpsa-comment.sh
      enforce-dpsa-critical.sh
      load-dpsa-comment.sh
    security-context.md   # optional
  src/
    ...your code...
```

### 5. Reload VS Code

`Ctrl+Shift+P` → **Developer: Reload Window**

**Commit** the copied `.github/` files in the app repo (required for GitHub Actions and for teammates). Do not commit secrets.

### Optional: Per-app security context

Copy `templates/security-context.md` from the skills repo to `.github/security-context.md` in your app repo. Set `app_size`, `platform`, `repo_access`, and `estimated_users` for accurate OWASP severity scoring.

See [OWASP Severity Guide](owasp-severity.md).

---

## What Happens Next

**Instructions (automatic):**
- Copilot loads baseline instructions on every request (`applyTo: "**/*"`)
- CIA instructions load when you edit sensitive paths (auth, routes, services, payments, uploads, tenant, LLM, etc. — see `applyTo` in `security-review-on-change.instructions.md`)
- Outside CIA `applyTo`, baseline can still emit Scenario 2 → `/dpsa` for security-topic changes
- No chat prompt needed — keep coding normally

**Skill (on prompt):**
- Open Copilot Chat: `Ctrl+Alt+I`
- Run `/dpsa` or select **Security Review** agent
- Router selects domain modules from your diff; shared rules always load
- Severity scored via OWASP Risk Rating (calculator URL + rationale per finding)
- One consolidated security review appears in chat

**Agents (on selection):**
- **Security Review** — formal diff review persona (read-only); delegates to the skill workflow
- **Security Advisor** — threat modeling and security acceptance criteria for tickets/features
- **DPSA Finding Analyst** — one pasted DPSA finding; suggestions only
- **Dependabot Advisor** — Dependabot guidance; never upgrades
- Select from the agent picker in Copilot Chat

---

## Which skill will run?

Only folders with `SKILL.md` become slash commands:

- `/dpsa` — optional preview; official DPSA is the staging/UAT PR Action
- `/full-assessment-security-review` — assessment scope, all matching domains
- `/jira-security-advisory` — Jira issue key; requires Atlassian MCP ([setup](jira-copilot-setup.md))
- `/dependabot-assess` — Dependabot alerts vs this app; `gh` with alerts read; **never upgrades**

Domain folders (`web/`, `backend/`, etc.) are modules loaded by the router — not separate slash commands.

| How you invoke | Reliability | When to use |
|----------------|-------------|-------------|
| `/dpsa` | **Highest** | Optional preview of the current diff |
| `/full-assessment-security-review PR #52` | **Highest** | Single PR assessment |
| `/full-assessment-security-review from 2026-05-01 to 2026-05-15 on main` | **Highest** | Date-range assessment |
| `/jira-security-advisory PROJ-123` | **Highest** | Jira ticket security advisory |
| `/dependabot-assess` or `/dependabot-assess 11` | **Highest** | Dependabot vs app (no upgrades) |
| "Run quick security review on my git diff" | Good | When slash commands unavailable |
| "Review my code changes" | **Unreliable** | Avoid when multiple skills exist |

See [routing-explained.md](routing-explained.md) for how domain modules are selected.

---

## Verify Instructions Are Working

### Setup checklist

- [ ] Both `.instructions.md` files in `.github/instructions/`
- [ ] Full `skills/` tree in `.github/skills/` (including `owasp-risk-rating.md`)
- [ ] All four `agents/*.agent.md` in `.github/agents/`
- [ ] Optional: `.github/security-context.md` customized for the app
- [ ] `skill-routing.md` exists in `.github/skills/dpsa/`
- [ ] `full-assessment-security-review/` folder with all 3 files in `.github/skills/`
- [ ] `jira-security-advisory/` folder with both files in `.github/skills/` (if using Jira)
- [ ] `dependabot-assess/` folder with SKILL.md, alert-scope.md, assessment-checks.md
- [ ] Atlassian MCP configured — see [jira-copilot-setup.md](jira-copilot-setup.md) (if using Jira)
- [ ] Optional: `gh` CLI installed and authenticated (for PR scope and `/dependabot-assess`)
- [ ] Files at **app repo root**, not inside `src/`
- [ ] Org repo: workflow keeps `${{ github.token }}`. User-owned repo: PAT + secret `COPILOT_GITHUB_TOKEN` — [Quick Setup](../README.md#quick-setup)
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

Edit `src/routes/example.ts` **or** `src/services/billing.ts` with a small logic change, then in Copilot Chat:

```
Does this change look secure for auth and injection?
```

**Pass:** Brief inline feedback (2–4 lines), or `No CIA-relevant concerns in this change.`

**Fail if:** Full **Digital Product Security Assessment (DPSA)** format, OWASP vector URLs, or severity counts — those belong to Test 4 (`/dpsa`).

**Skip check:** Comment or `.md` only — CIA should not run.

**Outside CIA paths:** Edit a file that does not match CIA `applyTo` (for example a one-off util with payment logic). Baseline should still give **Further Action Required** / suggest `/dpsa` (Scenario 2 fallback).

### Test 3b: Scenario 1 auto-PASS on non-security edit

Ask Copilot to add harmless display text or a docs-only tweak (e.g. insert “Test only” on a page).

**Pass:** After the edit, the reply ends with **Related tickets**, **Change summary** (1–2 sentences), and **AI Security Review Result: PASS** — DPSA ticket not required (no need to ask for a security review).

**Fail if:** No PASS block, missing Related tickets / Change summary, or a full `/dpsa` report.

### Test 4: Modular skill runs on slash command

With code changes staged, in Copilot Chat:

```
/dpsa
```

**Pass:**
- Reply **starts** with `## Digital Product Security Assessment (DPSA)` — no narration above it
- **Change summary** present
- Result is one of: Not Required, PASS, Security Issue/s identified, REVIEW INCOMPLETE
- If PASS / issues (VS Code): `**Context:**`, modules/coverage as in the VS Code template
- **What to do next** when the template includes it
- Findings include **OWASP Category**, **OWASP Risk Rating** URL, and **Severity rationale** (if any findings)

**Fail:** Narration before report; missing Change summary; missing OWASP fields on findings; hardcoded Critical without rationale; says the PR is ready to merge in VS Code (that line is **PR comment only**)

### Test 5: Agents appear in picker

After copying agents to `.github/agents/` and reloading VS Code:

1. Open Copilot Chat (`Ctrl+Alt+I`)
2. Open the agent picker dropdown

**Pass:** **Security Review**, **Security Advisor**, **DPSA Finding Analyst**, and **Dependabot Advisor** appear in the list.

**Fail:** Agents folder missing, wrong path, or VS Code not reloaded.

### Test 6: Security Review agent parity

With code changes staged, in Copilot Chat:

1. Select **Security Review** from the agent picker
2. Prompt: `Review my staged changes for security issues`

**Pass:** Same as Test 4 — reply **starts** with `## Digital Product Security Assessment (DPSA)` and follows the **VS Code** templates in the skill (not the short PR “ready to merge” lines).

**Fail:** Narration before report; informal advice without report template; says the PR is ready to merge.

### Test 7: Full assessment skill

With `gh` authenticated (for PR test) or a branch with history:

```
/full-assessment-security-review from 2026-05-01 to 2026-05-15 on main
```

Or: `/full-assessment-security-review PR #52`

**Pass:**
- Reply **starts** with `## Full Assessment Security Review`
- `**Assessment type:**` and `**Scope resolved:**` present
- `**Domains loaded:**` lists all matching domains (not capped at 3)
- `### Executive Summary` and `### Recommended Actions` present
- OWASP fields on findings (if any)
- Repo unchanged — no commits, file writes, app execution, or deploy commands run during review

**Fail:** Uses DPSA report title; max-3 domain cap behavior; narration before report; runs tests/scripts or modifies repo

### Test 8: Jira security advisory skill

Requires [Atlassian MCP configured](jira-copilot-setup.md) and a test issue you can comment on:

```
/jira-security-advisory YOUR-TEST-123
```

**Pass:**
- Reply **starts** with `## Jira Security Advisory`
- `**Issue:**` and advisory sections present (Summary, Threats, AC, Suggested Security Note)
- Ends with post confirmation prompt — does **not** auto-post
- On reply `yes`: one-line success; comment visible in Jira
- On reply `no`: no comment posted

**Fail:** Auto-post without confirmation; narration before report; MCP auth errors without paste fallback offer

### Test 9: Dependabot assessment skill

Requires `gh` authenticated with Dependabot alerts **read** on the app repo:

```
/dependabot-assess
```

Or: `/dependabot-assess 11`

**Pass:**
- Reply **starts** with `## Dependabot Assessment`
- Result COMPLETE or REVIEW INCOMPLETE
- No upgrade/install commands; repo unchanged
- If COMPLETE with alerts: Verdict Affected | Not affected | Uncertain per alert

**Fail:** Narration before report; `npm install` / version bump; dismisses alerts; DPSA report title

### Test 10: DPSA Finding Analyst

Select **DPSA Finding Analyst**. Paste one DPSA finding that includes File + Line.

**Pass:** Reply **starts** with `## DPSA Finding Analysis`; Verdict Confirmed | Not a true issue | Uncertain; **What to do next** includes true-positive / false-positive merge guidance; suggested fix is text only; repo unchanged.

**Fail:** Re-runs a full DPSA report; edits files; addresses every finding in one reply without being asked.

### Test 11: Dependabot Advisor

Select **Dependabot Advisor**. Paste a `/dependabot-assess` result or an alert number.

**Pass:** Reply **starts** with `## Dependabot guidance`; options only; no install/upgrade; repo unchanged.

**Fail:** Runs `npm install` / bump; dismisses the GitHub alert; emits a DPSA report.

### Quick pass/fail summary

| Test | Pass | Fail — check |
|------|------|--------------|
| Constraints question | Baseline rules mentioned | Instructions path, reload |
| Insecure code request | Pushback | Baseline file missing |
| CIA path edit | Brief inline feedback or one-liner | OWASP report format = wrong layer; use Test 4 |
| `/dpsa` | Starts with DPSA title; Result + What to do next | Narration before report; full skills tree not copied |
| Agent picker | Four security agents visible | `.github/agents/` missing; reload VS Code |
| Security Review agent | Same report format as `/dpsa` | Re-copy agent file; confirm skill tree present |
| Full assessment | Starts with `## Full Assessment Security Review` | Copy full-assessment folder; auth `gh` for PRs |
| Jira advisory | Starts with `## Jira Security Advisory`; confirm before post | Copy jira-security-advisory folder; configure Atlassian MCP |
| Dependabot assess | Starts with `## Dependabot Assessment`; no upgrades | Copy `dependabot-assess/`; auth `gh` with alerts read |
| DPSA Finding Analyst | Starts with `## DPSA Finding Analysis`; no edits | Re-copy `dpsa-finding-analyst.agent.md` |
| Dependabot Advisor | Starts with `## Dependabot guidance`; no upgrades | Re-copy `dependabot-advisor.agent.md` |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Wrong folder | Files under `.github/` at app repo root |
| Instructions not working | Both `.instructions.md` in `.github/instructions/` |
| Skill not found | `SKILL.md` in `.github/skills/dpsa/` |
| Missing module folder error | Copy entire `skills/` tree — shared + domains |
| No `Modules loaded:` line | Re-copy `skill-routing.md` and refactor SKILL.md |
| Wrong skill runs | Use `/dpsa`, `/full-assessment-security-review`, `/jira-security-advisory`, or `/dependabot-assess` |
| Jira MCP auth fails | See [jira-copilot-setup.md](jira-copilot-setup.md); paste ticket text as fallback |
| UX findings in review | Re-copy updated modules (out-of-scope rules in `shared/`) |
| Narration before report | Re-copy updated `SKILL.md`; reply must start with `## Digital Product Security Assessment (DPSA)` |
| Agents not in picker | Copy `agents/*.agent.md` to `.github/agents/`; reload VS Code |
| Stale behavior | Reload VS Code window |
| PR DPSA: `No authentication information found` | Org: keep `${{ github.token }}`. User-owned: PAT + secret. See [README Quick Setup](../README.md#quick-setup) |

---

## Updating

1. Pull or re-download the skills repo
2. Copy updated `instructions/`, `skills/`, and `agents/` over your app repo's `.github/` files
3. Reload VS Code
