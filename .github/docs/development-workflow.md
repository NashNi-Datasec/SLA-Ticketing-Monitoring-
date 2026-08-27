# Development Workflow

How developers use Cloudstaff AI Security across the coding lifecycle.

---

## Two triggers (same report)

| | VS Code `/dpsa` | GitHub Action |
|--|-----------------|---------------|
| **When** | Optional, **before** a PR | Automatic when a same-repo PR targets **staging/UAT** |
| **Job** | Preview — fix early | **Official record** on the PR |
| **Blocks merge?** | No | **Critical only** (if this check is required). Unblock: fix those lines, **or** label `dpsa-exception` after Uberticket DPSA for that finding |
| **If issues** | Usual guide: fix those lines or file Uberticket DPSA | Same, plus Critical fails CI until fix or `dpsa-exception` |
| **Evidence** | Screenshot only if you never open a PR | PR comment + PR URL on Jira — no screenshot |

Developers do **not** need both. `/dpsa` in chat is optional preview. The staging/UAT PR is the official review.

---

## Layers at a glance

| Layer | When | What |
|-------|------|------|
| **Secure coding baseline** | Every file, automatic | Secure coding guardrails while you work |
| **CIA self-check** | Sensitive paths (widened `applyTo`), automatic | Brief security reminder — **CIA = Confidentiality, Integrity, Availability**. Baseline covers Scenario 2 fallback outside those paths. |
| **Security Advisor** | Planning / design / ticket refinement | Threats, abuse cases, security acceptance criteria, Jira notes |
| **`/dpsa` or Security Review** | Optional preview before PR | Same report as CI |
| **DPSA Finding Analyst** | After a DPSA finding | Confirm the File+Line; suggest a small fix — never edits |
| **Dependabot Advisor** | After a Dependabot alert | Guidance and bump implications — never upgrades |
| **PR into staging/UAT** | Automatic GitHub Action | Official comment; **Critical** can fail the check |
| **`/full-assessment-security-review`** | Sprint / release | Wide-scope assessment |
| **`/jira-security-advisory`** | Ticket analysis | Fetch issue via MCP; optional confirmed comment |
| **`/dependabot-assess`** | Dependabot High/Critical (or alert # / range) | Chat assessment — never upgrades |

Instructions are automatic. Skills and agents are on demand.

---

## `/dpsa` vs Security Review agent

Both execute the **same** review workflow (same report template and next steps).

| Prefer… | When |
|---------|------|
| **`/dpsa`** | You want the security report directly |
| **Security Review agent** | You prefer interacting with an AI persona in chat |

Use **Security Advisor** during feature planning, backlog refinement, or design discussions **before** implementation. Use **Security Review** / `/dpsa` **after** code has changed. Use **DPSA Finding Analyst** on one pasted File+Line (suggestions only). Use **Dependabot Advisor** to talk through an alert — never to bump.

---

## Scenario flow

Full matrix: [`skills/shared/dpsa-next-steps.md`](../skills/shared/dpsa-next-steps.md).

```mermaid
flowchart TD
    change["You change code"] --> ask{"Security-related change?<br/>auth, API, payments, uploads,<br/>tenant, admin, LLM/RAG, config…"}

    ask -->|"No — docs, formatting,<br/>CSS-only, renames, tests only"| s1["Scenario 1 — PASS (automatic)<br/>Attach evidence to Jira / Release Ticket"]

    ask -->|"Yes"| s2["Scenario 2 — Further Action Required<br/>Optional: /dpsa in VS Code<br/>Required for record: PR into staging/UAT"]

    s2 --> dpsa["Same DPSA report"]
    dpsa --> s3["Scenario 3 — PASS<br/>PR comment is evidence — link PR on Jira"]
    dpsa --> s4["Scenario 4 — Issue at File:Line only<br/>VS Code: no block<br/>PR CI: Critical blocks until fix or dpsa-exception"]
    dpsa --> s5["Scenario 5 — INCOMPLETE<br/>Fix scope + push — not approval"]
```

1. **As you code** — baseline and CIA self-check (automatic)
2. **Non-security-only?** Scenario 1 PASS in chat. After a staging/UAT PR, the PR DPSA comment is enough — link the PR on Jira
3. **Security-related?** Scenario 2. **Official:** open a same-repo PR into staging/UAT. **Optional:** `/dpsa` in VS Code first — not required.
4. **PASS on the PR** → link the PR on Jira / Release Ticket
5. **Issues on the PR** → **cited lines only**. Critical: fix and push, or Uberticket DPSA for that finding + label `dpsa-exception`. High/Medium/Low do not fail the check.
6. **Incomplete** → fix scope and push — not approval
7. **Product intake (not this scan)** — Uberticket DPSA for new APIs/pages/roles/Access Matrix/PII/SPI

**Tip:** `/dpsa` is the AI skill. A **DPSA ticket in Uberticket** is the manual Security Team assessment (PM-1136). Different things. Screenshot evidence should show Change summary, Coverage, and Related tickets so analysts know what was reviewed.

---

## Evidence on PASS

If a **PR DPSA comment** exists: link the PR on Jira / Release Ticket. Do not screenshot-attach.

Screenshot-attach only when there is no PR.

---

## Related

- [vscode-setup.md](vscode-setup.md) — install and verify
- [architecture.md](architecture.md) — layers and copy model
- [routing-explained.md](routing-explained.md) — how `/dpsa` picks domains
- [owasp-severity.md](owasp-severity.md) — severity scoring
- [dpsa-github-actions.md](dpsa-github-actions.md) — PR comment + Critical gate
