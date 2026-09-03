---
name: dependabot-assess
description: Assess GitHub Dependabot alerts against this app (reachability, usage, upgrade blast radius). Chat-only. Never upgrades, never edits files, never dismisses alerts. Not a git-diff DPSA.
---

# Dependabot Assessment

Deterministic orchestrator for **Dependabot alert vs this application**. Fetches alerts with `gh` (GET only), checks whether the package is used and whether the vulnerability is reachable, and reports in chat.

**Invoke:** `/dependabot-assess`

**Examples:**
- `/dependabot-assess` — 3 newest **open High/Critical** alerts
- `/dependabot-assess 11` — GitHub Dependabot alert **#11**
- `/dependabot-assess 1-5` — alert numbers **1 through 5** (inclusive)

Requires [GitHub CLI](https://cli.github.com/) (`gh`) authenticated with permission to **read Dependabot alerts**.

For git-diff review use `/dpsa`. For Jira tickets use `/jira-security-advisory`. For conversational guidance (what the alert means, bump **options** only), use the **Dependabot Advisor** agent — it never upgrades.

---

## Hard rule — assess only

This skill **never** changes the repository or GitHub.

**Forbidden even if the user asks:**

- Upgrade, install, audit-fix, or bump any package
- Edit manifests, lockfiles, Dockerfiles, or CI
- Open, rebase, or merge a Dependabot PR
- Dismiss, resolve, or PATCH a Dependabot alert
- Run `npm` / `yarn` / `pnpm` / `pip` / `composer` / `bundle` / package-manager commands
- Write report files

If asked to fix or upgrade: refuse in one sentence and still emit the assessment (or Incomplete if alerts could not be fetched).

| Excuse | Reality |
|--------|---------|
| "I'll just bump to verify" | Verification is static. Install/upgrade is forbidden. |
| "A PR would help them" | Chat report only. Humans decide later. |
| "Dismiss if not affected" | Do not call the GitHub dismiss API. |
| "npm ls is read-only" | Package managers are forbidden. Read the lockfile text. |

---

## Output Only Rule (CRITICAL)

Your **entire reply** must be the formatted report below. Nothing before it. Nothing after it.

The **first line** of your reply must be:

```
## Dependabot Assessment
```

**Forbidden** — do not include process narration, tool announcements, or upgrade commands in the reply.

---

## Mandatory Execution Sequence

Follow exactly.

0. **Obey `shared/read-only-safety.md`**
1. **Resolve scope** via [`alert-scope.md`](alert-scope.md) (silent)
2. **Load** (paths relative to `.github/skills/`):
   - `shared/read-only-safety.md`
   - `dependabot-assess/assessment-checks.md`
   - `.github/security-context.md` if present (threat/app size only — do not OWASP-score the CVE as a DPSA finding)
3. **For each alert** — apply `assessment-checks.md` (facts, usage, reachability, confidence, blast-radius **advice**)
4. **Output** the report template as the **complete reply**

---

## Execution Rules

- Reply must **start** with `## Dependabot Assessment`
- Do **not** treat Dependabot severity as “the app is exploitable”
- Do **not** invent installed versions
- Cite File + Line for usage; cite lockfile path for direct vs transitive
- **Affected** / **Not affected** only at **High** confidence; otherwise **Uncertain**

---

## Output Format

### COMPLETE (including zero matching alerts)

```markdown
## Dependabot Assessment

**Scope:** default (3 newest open High/Critical) | alert #N | alerts A–B
**Repo:** [owner/name]
**Context:** security-context.md loaded | defaults
**Alerts assessed:** N

**AI Dependabot Assessment Result: COMPLETE**

### Rollup
- Affected: N
- Not affected: N
- Uncertain: N
- Incomplete fetches: N

### Alert #N — [package] ([ecosystem])
- **GitHub:** [alert URL]
- **GHSA / CVE:** [ids or none]
- **Dependabot severity:** High | Critical | other
- **Manifest:** `path`
- **Installed version:** [from lockfile] | unknown
- **Vulnerable range / patched:** [from advisory]
- **Direct / transitive:** Direct | Transitive
- **Used in app:** Used (File: `...` Line: N) | Unused (lockfile) | Declared, no call sites | Unknown
- **Verdict:** Affected | Not affected | Uncertain
- **Confidence:** High | Uncertain
- **Why:** [reachability vs this app — 2–4 sentences, evidence]
- **If you later fix (do not apply now):** smallest version [x]; likely lockfile movers [a, b]; conflict risk [low/med/high]
- **What to do next:** [from assessment-checks.md table]

### What to do next (rollup)
1. Paste **Affected** (High) assessments into the Jira you file for High/Critical Dependabot process.
2. Skip filing for **Not affected** (High). Do not upgrade “just in case.”
3. **Uncertain:** file Jira with this text and the listed gaps.
4. This skill does **not** upgrade, dismiss, or open PRs.
```

Omit empty alert sections. Repeat `### Alert #N` once per assessed alert.

### REVIEW INCOMPLETE

```markdown
## Dependabot Assessment

**Scope:** [attempted]
**Repo:** [owner/name or unknown]

**AI Dependabot Assessment Result: REVIEW INCOMPLETE**

The assessment could not complete.

### Possible causes
- Invalid argument (need `11`, `1-5`, or no args)
- GitHub CLI missing, not authenticated, or no Dependabot alerts read permission
- Alert number not found
- Lockfile/manifest unreadable and usage could not be determined for all alerts

### What to do next
1. Authenticate `gh` with Dependabot alerts read access, or pass a valid alert number/range.
2. Re-run `/dependabot-assess`.
3. Do not upgrade packages to “complete” this review.

**Note:** This result is **not** approval to ignore alerts and **not** a DPSA.
```

Use Incomplete when scope/auth fails or **no** alert could be fetched. If some alerts in a range 404, still COMPLETE and list those numbers under Incomplete fetches.

---

## What This Skill Is NOT

- Not `/dpsa` (git diff) and not a merge gate
- Not an auto-upgrade, Dependabot PR, or `npm audit fix`
- Not filing or commenting on Jira (paste the chat report yourself)
- Not dismissing GitHub alerts
- Not CVE encyclopedia output without app reachability

Scope: [`alert-scope.md`](alert-scope.md). Checks: [`assessment-checks.md`](assessment-checks.md).
