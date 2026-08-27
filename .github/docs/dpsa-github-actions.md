# DPSA on pull requests (GitHub Actions)

**Critical** on a staging/UAT PR **fails the job** unless the PR has label **`dpsa-exception`**. High/Medium/Low stay comments. VS Code `/dpsa` never blocks.

```text
PR opened / updated (same repo) into staging/UAT
        ↓
Copilot CLI reviews origin/<base>...HEAD
        ↓
One PR comment (updated on each push)
        ↓
Critical > 0 and no label dpsa-exception → job fails
```

Merge is blocked only if the app repo requires status check **Comment DPSA report**.

---

## Setup

This toolkit has **no** `.github/` folder. Copy its folders **into** the app `.github/`.

```text
ai-security/                 your-app/.github/
  instructions/       →        instructions/
  skills/             →        skills/
  agents/             →        agents/
  workflows/          →        workflows/
  dpsa-ci/            →        dpsa-ci/
```

```bash
mkdir -p /path/to/your-app/.github
cp -R instructions skills agents workflows dpsa-ci /path/to/your-app/.github/
```

### Token and secret (one for the team)

**Not every developer.** Follow the README: [One Actions token](../README.md#4-one-actions-token-not-one-per-developer).

- **Option A:** one user-account fine-grained PAT (**Copilot Requests**; all repos you grant, including private) stored as org or repo secret `COPILOT_GITHUB_TOKEN`
- **Option B:** org Copilot CLI policy + workflow `GITHUB_TOKEN` — no PAT

**Commit** the copied `.github/` files in the app repo. Do **not** commit the PAT.

Edit `workflows/dpsa-pr-comment.yml` and keep only this app’s staging/UAT base branch names (comment out or delete the rest).

Create the label **`dpsa-exception`** once in the app repo (or add it from the PR labels UI). Use it only after a Uberticket DPSA exists for the cited finding.

### Which PRs run (cost)

Copilot CLI **does cost** per run. It does **not** run on every PR — only when the **base** looks like staging/UAT:

- Exact: `staging`, `stage`, `uat`, `preprod`, `pre-prod`
- Suffix: `*-staging`, `*-stage`, `*-uat`, `*-preprod` (covers `iacc-staging`, `iacc-stage`, `app-uat`)

If this repo uses another name, add one line in `.github/workflows/dpsa-pr-comment.yml` under `on.pull_request.branches`. Direct push/deploy to staging or UAT does **not** run this.

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| GitHub Actions | Enabled on the org/repo |
| GitHub Copilot | Org license includes Copilot CLI |
| Toolkit in app `.github/` | Includes `skills/dpsa/` and `dpsa-ci/` |
| `COPILOT_GITHUB_TOKEN` | Repo or org secret |
| Same-repository PRs | Fork PRs are skipped |

---

## What happens on a PR

1. Developer opens or updates a same-repo PR **into a staging/UAT-style base branch**
2. Job **Comment DPSA report** runs (otherwise the workflow is skipped)
3. Copilot CLI reviews `git diff origin/<base>...HEAD` only (`git` tools only)
4. One comment is posted or updated (`<!-- cloudstaff-dpsa-ci -->`)
5. If **Critical > 0** and the PR has **no** `dpsa-exception` label, the job **fails**

REVIEW INCOMPLETE does **not** fail the job.

Findings are File + Line, not the whole PR. To unblock without fixing yet: file Uberticket DPSA **for that finding**, add **`dpsa-exception`**, wait for the workflow to re-run.

---

## Developer workflow

| When | What to do |
|------|------------|
| While coding | VS Code instructions as today |
| Before PR (optional) | `/dpsa` in Copilot Chat |
| After the PR exists | Use the automated comment (official record) |
| One cited finding on the comment | **DPSA Finding Analyst** — paste File+Line; suggestions only, never edits |
| Critical on the comment | Fix those lines and push, **or** file Uberticket DPSA for that finding and add `dpsa-exception` |
| Evidence | PR URL on Jira — screenshot only if there is no PR |

---

## Safety

- Same-repo PRs only
- `pull_request` (not `pull_request_target`)
- Base branch name is passed via `env:` (not interpolated into `run:`)
- No merge, approve, deploy, or repo mutation
- Fork PRs skipped

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Job skipped | Fork PR, base branch is not staging/UAT-style, or same-repo check failed — add the branch name in `workflows/dpsa-pr-comment.yml` |
| Auth / Copilot errors | Set `COPILOT_GITHUB_TOKEN` with Copilot Requests |
| Missing skill | Copy `skills/` into the app `.github/skills/` |
| Nested `.github/.github/` | You copied this toolkit’s old nested folder — copy **root** `workflows/` and `dpsa-ci/` instead |
| REVIEW INCOMPLETE comment | Check the Actions log; re-run the job |
| Job failed on Critical | Fix the cited lines and push, **or** add label `dpsa-exception` after filing Uberticket DPSA for that finding |
| Thinking / “Total ~N lines” above the report | Re-copy `dpsa-ci/post-dpsa-comment.sh` — CI now strips text before `## Digital Product Security Assessment` |
