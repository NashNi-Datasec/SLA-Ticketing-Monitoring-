# DPSA PR comment — sample output

Official GitHub Action comments. First line is always `## Digital Product Security Assessment (DPSA)`.

**OWASP Category** examples: web XSS → `A03:2021 – Injection`. API IDOR → `API1:2023 – Broken Object Level Authorization`. Mobile plaintext token → `M9:2024 – Insecure Data Storage`.

---

## PR Scenario 1 — Non-security-related

Docs, formatting, CSS-only, tests-only, or similar. Ready to merge.

```markdown
## Digital Product Security Assessment (DPSA)

**AI Security Review Not Required** — No security-related changes were detected. This PR is ready to merge.

**Change summary:** Updates the help-page heading and fixes a typo in README. No application logic, APIs, or auth code changed.

**Note:** This automated AI security review fulfills the security review requirement for this PR.
```

---

## PR Scenario 2 — Security-related, no issue found

Auth/API (or other security-related) diff. Nothing high-confidence found. Ready to merge.

```markdown
## Digital Product Security Assessment (DPSA)

**Findings:** Critical 0 | High 0 | Medium 0 | Low 0

**AI Security Review Result: PASS** — No security issues have been identified. This PR is ready to merge.

**Change summary:** Adds a logout button that calls the existing session-end API and clears the local session cookie. Authorization still runs on the server; no new public endpoints.

**Note:** This automated AI security review fulfills the security review requirement for this PR.
```

---

## PR Scenario 3 — High / Medium / Low only

**Critical = 0.** Check does **not** fail. They can merge.

```markdown
## Digital Product Security Assessment (DPSA)

**Findings:** Critical 0 | High 1 | Medium 0 | Low 0

**Change summary:** Adds a returnUrl query parameter so the login page can send the user back to the page they started from.

**AI Security Review Result: Security Issue/s identified!**

### High
**[HIGH] Unvalidated redirect destination**
File: `src/redirect.ts`
Line: 18
Issue description: A URL parameter controls navigation without validating that the destination belongs to the application.
Steps to reproduce: Observable in changed code at src/redirect.ts:18.
Security impact: A visitor could be sent to an attacker-controlled destination through a trusted application link.
Recommendation: Restrict destinations to relative routes or an explicit allowlist.
Confidence: High
OWASP Category: A03:2021 – Injection
OWASP Risk Rating: https://owasp-risk-rating.com/?vector=(SL:5/M:4/O:7/S:6/ED:5/EE:6/A:5/ID:4/LC:4/LI:3/LAV:5/LAC:4/FD:3/RD:5/NC:4/PV:2)
Severity rationale: A remote user can influence navigation, but the effect is limited to redirection rather than direct data access.

### What to do next
Use the **DPSA Finding Analyst** agent and paste this PR comment to check whether each finding is a true positive or a false positive.

This check does **not** block merge.

- **True positive:** Preferred: fix the identified issues before merging. If merging without a fix: the Security Team will document the finding in Jira for tracking (from this PR comment). You do not need to file a ticket yourself.
- **False positive:** Proceed with the merge. No further action on the PR. Security can mark it as false positive in the monitoring tool.
```

---

## PR Scenario 4 — Critical

PR is **blocked** until they fix the lines or add `dpsa-exception` and comment the Finding Analyst result on the PR.

```markdown
## Digital Product Security Assessment (DPSA)

**Findings:** Critical 1 | High 0 | Medium 0 | Low 0

**Change summary:** Adds an admin export endpoint that returns user records as CSV from a new handler.

**AI Security Review Result: Security Issue/s identified!**

> [!CAUTION]
> **This PR is blocked.** Critical finding(s) at the cited File + Line.

### Critical
**[CRITICAL] Admin export missing authorization check**
File: `src/api/admin/export-users.ts`
Line: 42
Issue description: The new export handler returns user emails and names without checking an admin role on the session.
Steps to reproduce: Observable in changed code at src/api/admin/export-users.ts:42.
Security impact: Any authenticated user who can call the route could download the user list.
Recommendation: Require an admin role (or equivalent) before running the export, matching other admin routes.
Confidence: High
OWASP Category: A01:2021 – Broken Access Control
OWASP Risk Rating: https://owasp-risk-rating.com/?vector=(SL:5/M:6/O:4/S:4/ED:6/EE:7/A:5/ID:5/LC:6/LI:5/LAV:6/LAC:3/FD:7/RD:6/NC:6/PV:7)
Severity rationale: High impact on confidentiality of user data with a straightforward missing authz check on a new endpoint.

### What to do next
1. Paste this comment into the **DPSA Finding Analyst** agent (true positive vs false positive).
2. **True positive:** Fix the cited Critical File + Line and push.
3. **False positive (or cannot fix now):** A developer or Security adds the PR label **`dpsa-exception`**, then **posts the DPSA Finding Analyst result as a comment on this PR** (that comment is the evidence). Adding the label re-runs this check.

Finding Analyst cannot unblock the PR by itself. High / Medium / Low on this same comment do not fail the check.
```

### PR Scenario 4 — evidence comment (human, after Finding Analyst)

Not produced by the Action. Developer or Security pastes this **on the same PR**, then adds `dpsa-exception`.

```markdown
## DPSA Finding Analysis

**Finding:** Admin export missing authorization check
**File / Line:** `src/api/admin/export-users.ts` : 42
**Verdict:** Not a true issue
**Confidence:** High

### What this is
The handler calls `requireAdmin(session)` on line 31. Line 42 only writes the CSV after that check returns.

### Why this verdict
The export is not reachable without an admin session. The finding described the write line and missed the guard above it.

### Suggested fix (do not apply)
None required for this finding.

### What to do next
If the findings are true positives:
- Preferred: Fix the identified security issues before merging.
- If merging without remediation: Confirmed findings will be documented in Jira by the Security Team for tracking and follow-up remediation.

If the findings are false positives:
- Proceed with the merge—no further action is required.

**If this finding is Critical:** the PR stays blocked until those lines are fixed, **or** a developer or Security adds **`dpsa-exception`** and **posts this analysis as a comment on the PR**.
```

---

## REVIEW INCOMPLETE

Does not fail the Critical gate. Not approval.

```markdown
## Digital Product Security Assessment (DPSA)

**Scope:** origin/iacc-staging...HEAD
**Run:** GitHub Actions PR comment
**Related tickets:** none detected
**Context:** defaults (no security-context.md)
**Modules loaded:** none

**Change summary:**
Insufficient change detail to summarize.

**Coverage:**
Changed-lines only — review did not complete

**AI Security Review Result: REVIEW INCOMPLETE**

The AI Security Agent could not complete the security review.

### Possible causes
- Copilot CLI failed, timed out, or was not authenticated
- No analyzable output was returned

### What to do next
1. Check the Actions log for Copilot CLI errors.
2. Confirm this toolkit was copied into the app .github/ folder (skills/ and dpsa-ci/).
3. Re-run the workflow, or run `/dpsa` in VS Code Copilot Chat.

**Note:** This result is **not** security approval. Incomplete reports do not fail the Critical gate.
```
