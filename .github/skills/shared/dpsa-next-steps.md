# DPSA Next Steps

Apply when emitting `/dpsa` reports or brief CIA instruction outcomes. Maps AI Digital Product Security Assessment process scenarios to developer actions.

Manual Security Team ticket = **Digital Product Security Assessment (DPSA)** filed in **Uberticket** (see PM-1136 Digital Product Security Assessment Procedure). Distinct from the `/dpsa` slash skill (AI review).

---

## Ownership

| Scenario | Owned by |
|----------|----------|
| 1 | Baseline instruction (while coding) |
| 2 | CIA instruction — points to optional `/dpsa` **or** staging/UAT PR |
| 3–5 | Same report: VS Code `/dpsa` (preview) **or** GitHub Action (official on PR) |

## Scenario matrix

| Scenario | When | Result status | What to do next |
|----------|------|---------------|-----------------|
| **1** | Baseline instruction (all paths): non-security-only changes (**automatic**) | `PASS` | Include **Related tickets** + **Change summary**. If a PR will exist, the DPSA comment covers it — link the PR on Jira. No PR → screenshot-attach. |
| **2** | CIA / baseline: security-related change | `Further Action Required` | **Official:** same-repo PR into staging/UAT (Action comments DPSA). **Optional:** `/dpsa` in VS Code to preview first. You do not need both. |
| **3** | VS Code `/dpsa` or PR comment: no High-confidence findings | `PASS` | Official record is the PR comment. Link PR on Jira. Screenshot only if no PR. |
| **4** | High-confidence finding(s) | `Security Issue Identified` | **File + Line only.** VS Code `/dpsa`: no block. **PR CI:** Critical fails the check until you fix those lines **or** file Uberticket DPSA for that finding and add label `dpsa-exception`. High/Medium/Low never fail CI. |
| **5** | Cannot analyze | `REVIEW INCOMPLETE` | Fix scope + push. Not approval. |

---

## Product intake (not this AI review)

A **PASS** means this scan found nothing — do **not** file Uberticket DPSA because of the AI result.

Separately, Security intake (PM-1136) still applies when the **product change** itself introduces:

- New endpoints or APIs
- New application pages or modules
- New user roles or permission groups
- Updates to the Access Matrix or authorization model
- Collection, processing, storage, or exposure of new PII or SPI/SPII

---

## Evidence (PASS)

**Do not duplicate.** If the DPSA report is already a **PR comment**, that is the evidence. Put the **PR URL** on Jira (few tickets) or the Uberticket Release Ticket (major / multi-ticket change). Skip screenshot attach.

Screenshot-attach only when there is **no PR** (local `/dpsa` or Scenario 1 in VS Code).

### Scenario 1 (instruction, no PR yet)

Screenshot must show **Related tickets**, **Change summary**, and **AI Security Review Result: PASS**.

### Scenarios 3–5

Same report in VS Code or on the PR. If using a screenshot (no PR), it must show **Related tickets**, **Change summary**, **Coverage**, Result, and What to do next.

If **Related tickets** is `none detected`, name the ticket(s) on the Jira/Uberticket when you add the PR link.

---

## Severity note

Severity uses **OWASP Risk Rating** (not CVSS). Labels: Critical, High, Medium, Low.
