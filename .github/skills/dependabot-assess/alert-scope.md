# Dependabot Alert Scope

Deterministic argument parsing and `gh` fetch for `/dependabot-assess`. Follow exactly — no AI discretion.

**Silent execution.** Do not narrate fetch steps in the chat reply.

Obey [`../shared/read-only-safety.md`](../shared/read-only-safety.md).

---

## Command Allowlist (CRITICAL)

**GET only.** Use **only** these commands:

```bash
gh api repos/{owner}/{repo}/dependabot/alerts
gh api "repos/{owner}/{repo}/dependabot/alerts?state=open&per_page=100&sort=created&direction=desc"
gh api repos/{owner}/{repo}/dependabot/alerts/{n}
gh repo view --json nameWithOwner -q .nameWithOwner
```

`{owner}/{repo}` may be filled by `gh` from the current repo (`repos/:owner/:repo/...`). `{n}` is a positive integer (the GitHub Dependabot **alert number**).

**Forbidden** (even if the user asks):

| Category | Examples |
|----------|----------|
| Dismiss / update alerts | `gh api -X PATCH|PUT|DELETE .../dependabot/alerts...`, any dismiss payload |
| Dependency mutation | `npm` / `yarn` / `pnpm` / `pip` / `composer` / `bundle` / `nuget` install, update, upgrade, audit-fix |
| Manifest / lockfile edits | any write to `package.json`, lockfiles, `requirements.txt`, `Gemfile`, `go.mod`, etc. |
| PRs | `gh pr create`, Dependabot rebase, version-bump commits |
| Git mutation | `commit`, `push`, `checkout`, `merge` |
| Execution | `npm test`, `node`, scanners, `docker` |

If a required command is not on the allowlist, stop — do not substitute an upgrade or dismiss.

---

## Parse arguments

Read slash args and the same-message text. Trim whitespace.

| Input | Scope |
|-------|--------|
| *(none)* | Default — see below |
| Single integer `N` (e.g. `11`) | Alert **#N** only |
| Range `A-B` (e.g. `1-5`) | Inclusive GitHub alert numbers from `min(A,B)` to `max(A,B)` |
| Anything else | **REVIEW INCOMPLETE** — ask once: `Provide an alert number (e.g. 11), a range (e.g. 1-5), or omit args for the 3 newest open High/Critical alerts.` Then stop. |

Do **not** parse comma lists in v1 (`11,14`). Treat as invalid.

**Range cap:** at most **20** alert numbers per run. If the inclusive range is larger, assess the **20 lowest** numbers in that range and state the cap in Coverage.

---

## Default (no argument)

1. GET open alerts, newest created first (`state=open`, `sort=created`, `direction=desc`, `per_page=100`).
2. Keep only severity **high** or **critical** (`security_vulnerability.severity` or `security_advisory.severity`).
3. Take the **3 newest** remaining (already desc). If fewer than 3, take all.
4. If **zero** remain: emit the report with Result COMPLETE, **Alerts assessed: 0**, and What to do next: nothing to file from this run.

Do **not** default to GitHub IDs 1, 2, 3.

---

## Fetch

- **Single / range:** GET each `.../dependabot/alerts/{n}`. Missing or 404 → list that number under Incomplete alerts; continue others.
- **Default:** one list call, then filter as above (do not GET IDs 1–3 unless they survived the filter).

If `gh` is missing, unauthenticated, or the API returns 403 (Dependabot alerts permission): **REVIEW INCOMPLETE** with cause: GitHub CLI auth / Dependabot alerts read access. Do not invent alerts. Do not upgrade to “fix” auth.

Use alert JSON fields: `number`, `state`, `html_url`, `dependency.package.name`, `dependency.package.ecosystem`, `dependency.manifest_path`, `security_advisory` (ghsa_id, cve_id, summary, severity, description), `security_vulnerability` (severity, vulnerable_version_range, first_patched_version).

Installed version is often **not** on the alert — read the lockfile/manifest (assessment-checks). Never run a package manager to resolve the tree.
