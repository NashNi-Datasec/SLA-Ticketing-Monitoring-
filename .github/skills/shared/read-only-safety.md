# Read-Only Safety Contract

Apply to every security review orchestrator (`/dpsa`, `/full-assessment-security-review`, `/dependabot-assess`, Security Review, DPSA Finding Analyst, and Dependabot Advisor).

---

## Mode

Passive static analysis only. Read-only. Non-destructive. No code execution.

The repository, working tree, and deployed infrastructure must be unchanged when the review completes.

---

## Allowed Reads

- `.github/skills/**` — skill modules and routing
- `.github/security-context.md` — app context for OWASP scoring
- Source files **in resolved diff scope only** — paths returned by git diff or `gh pr diff`

**`/dependabot-assess` only** — also read lockfiles, dependency manifests, and application source needed to test **usage/reachability** of the alerted package. Do not use that exception to run a full-repo security audit unrelated to the fetched alerts.

Do not expand reads to unchanged files or the full repository for discovery (`/dpsa` and full assessment).

---

## Allowed git / gh Commands

**DPSA (`/dpsa`)** — only:

```bash
git diff ...
git log ... --oneline
git rev-parse --abbrev-ref HEAD
```

(`git rev-parse --abbrev-ref HEAD` is read-only — used only to detect Jira keys in the branch name for the report header.)
**Full assessment** — only commands listed in `full-assessment-security-review/scope-resolution.md` Command Allowlist:

```bash
git diff ...
git log ... --oneline
git rev-list ...
gh pr diff <n>
gh pr view <n> --json baseRefOid,headRefOid -q '...'
```

**Dependabot assess (`/dependabot-assess`)** — only commands listed in `dependabot-assess/alert-scope.md` Command Allowlist (GET Dependabot alerts + `gh repo view` metadata). Never PATCH/dismiss alerts. Never package-manager install/upgrade.

No other git or gh subcommands. If a required command is not on the allowlist, stop — do not substitute a destructive alternative.

---

## Forbidden — Repo Mutation

- `git commit`, `git push`, `git merge`, `git rebase`, `git reset`, `git checkout`, `git clean`, `git stash`, `git fetch`, `git pull`
- Create, edit, or delete any file (including reports, `.diff` exports, or skill copies)
- Push changes or open/modify pull requests
- Dismiss or update GitHub Dependabot alerts (`gh api -X PATCH` on `dependabot/alerts`)

---

## Forbidden — Code Execution

- Run application or test code: `npm` / `yarn` / `pnpm run|test|start`, `node`, `python`, `go run`, `make`, `cargo run`
- Package-manager **install / update / upgrade / audit-fix** (including `npm ls` as a substitute for reading the lockfile)
- `docker run`, `docker build`, or execute scripts from the repo to "validate" findings
- Invoke linters, formatters, or security scanners as subprocesses

Analysis is static — pattern, diff, lockfile, and source **read** only.

---

## Forbidden — Deploy / Infrastructure

- `terraform apply`, `terraform destroy`, `kubectl apply`, `helm install`, cloud deploy CLIs
- `gh workflow run`, `gh pr merge`, `gh release create`
- Any command that creates, updates, or destroys deployed resources

---

## Forbidden — Direct Secrets Access

Do not open or read secret stores to retrieve credentials:

- `.env`, `.env.local`, `credentials.json`, `*.pem`, `secrets.yaml`
- `~/.aws/credentials`, vault/keychain CLI, or cloud secret-manager fetch

If a secret pattern appears **in scoped diff lines**, report it as a finding with a **redacted** value — never reproduce the secret in output.

Do not hunt for secrets outside the resolved diff scope.

---

## Forbidden — Dangerous Shell

- `rm`, `chmod`, `sudo`, `curl | bash`, `wget | sh`, `eval`, piping untrusted content to a shell

---

## Output Rule

Emit the report in chat only. The repo must remain unmodified. All human merge/deploy decisions stay with the user.

---

## On Violation

Stop immediately. Do not run substitute commands. If the user requested a forbidden action, refuse and continue with read-only scope resolution if possible.
