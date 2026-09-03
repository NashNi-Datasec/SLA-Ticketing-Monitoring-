# Scope Resolution

Deterministic git/gh scope for `/full-assessment-security-review`. Follow exactly — no AI discretion.

**Silent execution:** Resolve scope internally. Do not describe resolution steps in the chat reply.

Scope resolution must obey [`../shared/read-only-safety.md`](../shared/read-only-safety.md).

---

## Command Allowlist (CRITICAL)

Use **only** these git/gh commands for scope resolution. No other subcommands — even if the user asks.

**Allowed:**

```bash
git diff ...
git log ... --oneline
git rev-list ...
gh pr diff <n>
gh pr view <n> --json baseRefOid,headRefOid -q '...'
```

`gh pr view --json` is read-only metadata only — use as fallback when `gh pr diff` is empty or fails.

**Forbidden** (even if user requests):

| Category | Examples |
|----------|----------|
| Git mutation | `commit`, `push`, `merge`, `rebase`, `reset`, `checkout`, `clean`, `stash`, `fetch`, `pull` |
| GitHub mutation | `gh pr merge`, `gh pr checkout`, `gh release create`, `gh workflow run` |
| Execution | any interpreter, package manager run, or repo script |
| Deploy / infra | `terraform apply`, `kubectl apply`, cloud deploy CLIs |
| Secret retrieval | reading `.env`, credential paths, or secret-manager CLIs not in diff |

If a required command is not on the allowlist, stop — do not substitute a destructive alternative.

---

## Accepted Scope Types

| Type | Example user input | Resolution |
|------|-------------------|------------|
| **branch** | `branch release/1.2 vs main` | `git diff main...release/1.2` |
| **date_range** | `from 2026-05-01 to 2026-05-15 on main` | See date range logic below |
| **pr** | `PR #52` or `pull request 52` | `gh pr diff 52` |
| **pr_range** | `PRs #10-#15` or `#10, #11, #12` | Union of `gh pr diff` per PR; dedupe file paths |
| **commit_range** | `abc123..def456` | `git diff abc123..def456` |

Default branch when unspecified: `main` (or `master` if `main` does not exist).

---

## Priority Order

1. Explicit user-provided scope in the message
2. Parameters passed with the slash command (if any)
3. If still ambiguous — ask **once** with accepted formats; then stop

Never expand beyond the requested scope. Never scan the full repository.

---

## Branch Scope

```
git diff <base>...<head>
git log <base>..<head> --oneline
```

Record: `assessment_type: branch`, `scope_resolved: <base>...<head>`, commit count from log.

---

## Date Range Scope

On the specified branch (default `main`):

```bash
git rev-list -n 1 --before="YYYY-MM-DD" <branch>    # base (exclusive start)
git rev-list -n 1 --before="YYYY-MM-DD+1day" <branch>  # end (inclusive last day)
git diff <base>..<end>
git log <base>..<end> --oneline
```

If end date is today, use `HEAD` as end ref.

Record: `assessment_type: date_range`, `scope_resolved: <start>..<end> on <branch>`, commit count.

---

## Single PR Scope

Primary:

```bash
gh pr diff <number>
```

Fallback if diff empty or fails:

```bash
gh pr view <number> --json baseRefOid,headRefOid -q '.baseRefOid,.headRefOid'
git diff <baseOid>..<headOid>
```

If `gh` is not authenticated or fails, stop and report:

> GitHub CLI required for PR scope. Run `gh auth login` or provide a branch/commit range instead.

Record: `assessment_type: pr`, `scope_resolved: PR #<number>`.

---

## PR Range Scope

Parse range `#10-#15` or list `#10, #11, #12`.

For each PR number:

```bash
gh pr diff <n>
```

Union all changed file paths. Dedupe paths across PRs. Combine diffs for line-level review.

Record: `assessment_type: pr_range`, `scope_resolved: PR #10–#15` (or listed numbers).

If any PR in range fails, note which PR failed in scope metadata; continue with successful PRs if at least one resolves.

---

## Commit Range Scope

```bash
git diff <from>..<to>
git log <from>..<to> --oneline
```

Record: `assessment_type: commit_range`, `scope_resolved: <from>..<to>`.

---

## Output to Orchestrator

Provide silently:

- Unified list of changed file paths (for routing)
- `assessment_type`
- `scope_resolved` (human-readable string for report header)
- `commit_count`
- `commit_subjects` — all one-line subjects if ≤10 commits; else first SHA, last SHA, and count only
- `files_changed_count`

Do not include resolution narration in the user-visible report.
