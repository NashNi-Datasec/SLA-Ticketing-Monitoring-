# Agent Snippets

Reusable patterns for authoring Copilot custom agents (`.agent.md`).

Agents are **personas** — not slash commands. Copy to `.github/agents/` in app repos.

---

## Agent File Template

```yaml
---
name: My Agent
description: "One-line summary shown in the agent picker."
tools: ['read_file', 'file_search', 'grep_search', 'list_dir']
argument-hint: "Example prompt hint for users"
handoffs:
  - label: Next step label
    agent: target-agent-id
    prompt: Prompt to send to the target agent.
    send: false
---
```

Optional frontmatter: `model`, `target`.

VS Code detects `.md` files in `.github/agents/`. Filename becomes the agent id if `name:` is omitted (e.g. `security-review.agent.md` → `security-review`).

**Verify tool names** in VS Code Chat → Tools — names vary by platform and Copilot version. Align with your org's working agents (e.g. Mobile QA uses `read_file`, `file_search`, `grep_search`, `list_dir`).

---

## Per-App Rename Convention

Match your QA/BA pattern (e.g. `appname-qa-agent.agent.md`):

- Copy and rename: `myapp-security-review.agent.md`, `myapp-security-advisor.agent.md`, `myapp-dpsa-finding-analyst.agent.md`, `myapp-dependabot-advisor.agent.md`
- Optional `name:` in frontmatter for picker display: `Security Review`, `Security Advisor`, `DPSA Finding Analyst`, `Dependabot Advisor`
- Handoff `agent:` must match the **target filename id** (e.g. `security-review` from `security-review.agent.md`)

---

## Security Review Agent Pattern

- **Tools:** read-only (`read_file`, `file_search`, `grep_search`, `list_dir`) — no edit tools
- **Body:** delegate formal diff reviews to `.github/skills/dpsa/SKILL.md`
- **Output:** same report template as the skill (`## Digital Product Security Assessment (DPSA)`)
- **Do not:** duplicate domain checklists from skill modules

---

## Security Advisor Agent Pattern

- **Tools:** read-only file tools (`read_file`, `file_search`, `grep_search`, `list_dir`) — MCP Jira tools come from VS Code MCP config
- **Body:** threat modeling, acceptance criteria, Jira-ready notes; read `.github/security-context.md` when present
- **Jira:** when issue key provided, fetch via Atlassian MCP if available; else ask for paste — see `shared/jira-integration-safety.md`
- **Post:** confirm-before-post only; delegate deterministic flow to `/jira-security-advisory`
- **Output:** structured sections (Summary, Threats, AC, Questions, Suggested Security Note)
- **Handoffs:** Advisor → Security Review for diff review; optional Jira advisory handoff prompt

Setup: [docs/jira-copilot-setup.md](../docs/jira-copilot-setup.md)

---

## DPSA Finding Analyst Pattern

- **Tools:** read-only (`read_file`, `file_search`, `grep_search`, `list_dir`) — no edit tools
- **Input:** pasted DPSA finding or PR comment with **File + Line**; ask once if missing
- **Body:** confirm / not a true issue / uncertain at that location; load exploitability + severity shared modules — do **not** re-run `/dpsa`
- **Output:** `## DPSA Finding Analysis` — suggested fix only
- **Do not:** edit files, emit a new DPSA report, dismiss alerts, or post to Jira
- **Handoffs:** optional → Security Review for a full diff re-run

---

## Dependabot Advisor Pattern

- **Tools:** read-only file tools; GET-only `gh` if fetching an alert
- **Body:** conversational layer on `/dependabot-assess` — usage, reachability, bump **implications**
- **Output:** `## Dependabot guidance`
- **Do not:** upgrade, edit lockfiles, dismiss alerts, or run package managers
- Prefer a pasted `/dependabot-assess` report; otherwise tell them to run the skill first

---

## Copilot Agents vs Code `agents/` Folder

| Path | What it is |
|------|------------|
| `.github/agents/*.agent.md` | Copilot **personas** (picker in chat) |
| `src/agents/**` (app code) | LLM **implementation** code — routes to backend skill domain |

These are different. Router pattern `**/agents/**` in `skill-routing.md` matches application code, not `.github/agents/`.

---

## Authoring Rules

- Markdown-only — no code execution
- Do not embed skill module checklists (avoids drift)
- Agents complement instructions (automatic) and skills (slash commands)

---

## When to Use What

| Need | Use |
|------|-----|
| Secure code while typing | `.github/instructions/` (automatic) |
| Formal diff review | Staging/UAT PR (official) or optional `/dpsa` |
| One DPSA File+Line: is it real / how to fix | DPSA Finding Analyst (suggestions only) |
| Jira ticket fetch + optional comment | `/jira-security-advisory` |
| Dependabot alerts vs this app | `/dependabot-assess` or Dependabot Advisor (never upgrades) |
| Ticket/feature security AC (paste) | Security Advisor agent |
| Brief CIA check on sensitive paths | `security-review-on-change.instructions.md` (automatic) |

---

## Handoffs

Handoffs appear as suggested next-step buttons after a chat response completes. Security Advisor includes a handoff to Security Review. Security Review includes a handoff to DPSA Finding Analyst for one pasted File+Line.
