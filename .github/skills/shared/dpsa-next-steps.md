# DPSA Next Steps

Apply when emitting `/dpsa` reports or brief CIA instruction outcomes.

The Security Team **syncs the official PR DPSA comment**. If that comment lists findings, they are recorded automatically. Developers do **not** file a separate ticket for High / Medium / Low.

---

## Instruction scenarios (while Copilot edits)

| Scenario | When | Result | What to do next |
|----------|------|--------|-----------------|
| **1** | Non-security-only edit (docs, formatting, CSS-only, tests-only, …) | `PASS` | Related tickets + change summary. Official record comes from the staging/UAT PR comment. |
| **2** | Security-related edit | `Further Action Required` | **Official:** same-repo PR into staging/UAT. **Optional:** `/dpsa` in VS Code. |

---

## PR comment scenarios (GitHub Action — official)

| Scenario | When | Result | Merge |
|----------|------|--------|--------|
| **PR 1** | Entire diff is non-security-related | **AI Security Review Not Required** — ready to merge | Yes. This comment fulfills the security review requirement. |
| **PR 2** | Security-related, no high-confidence findings | **PASS** — ready to merge | Yes. This comment fulfills the security review requirement. |
| **PR 3** | High / Medium / Low only (**Critical = 0**) | **Security Issue/s identified!** | **Yes.** Check does not fail. Finding Analyst: true positive → prefer fix, or merge (Security tracks from the comment). False positive → merge; Security marks false positive in the monitoring tool. |
| **PR 4** | **Critical > 0** | **Security Issue/s identified!** + CAUTION — **draft** + `dpsa-blocked` | **No.** Fix and push, **or** `dpsa-exception` **and** a PR comment with the Finding Analyst result. **Ready for review** does not unlock — the Action converts it back to draft. |
| **Incomplete** | Could not finish | **REVIEW INCOMPLETE** | Does not fail the Critical gate. Not approval. |

VS Code `/dpsa` uses the same classification but **never** says the PR is ready to merge.

Sample PR comments: [dpsa-pr-scenario-samples.md](../../docs/dpsa-pr-scenario-samples.md)

---

## Evidence

The staging/UAT **PR comment** is the official DPSA record. Link the PR where your team tracks the change.

For **PR Scenario 4** false positive / exception: evidence is a **comment on the same PR** containing the DPSA Finding Analyst result — not a separate ticket.

---

## Severity note

Severity uses **OWASP Risk Rating** (not CVSS). Labels: Critical, High, Medium, Low.
