# DPSA on pull requests (GitHub Actions)

**Critical** on a staging/UAT PR **fails the job** unless the PR has label **`dpsa-exception`**. The Action then **converts the PR to a draft**, which is what disables Merge. High/Medium/Low stay comments. VS Code `/dpsa` never blocks.

```text
PR opened / updated (same repo) into staging/UAT
        ↓
Copilot CLI reviews origin/<base>...HEAD
        ↓
One PR comment (updated on each push)
        ↓
Critical > 0 and no label dpsa-exception
        → job fails + PR converted to draft (Merge disabled)
```

A failed check alone does **not** lock Merge. A **draft** PR cannot be merged. When they fix and push, or add `dpsa-exception`, the Action marks the PR ready again.

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

### Token (org vs user-owned repo)

Follow the README: [Quick Setup](../README.md#quick-setup).

| App repo | Workflow `env:` (Copilot CLI step) | Extra setup |
|----------|-------------------------------------|-------------|
| **Organization** | `COPILOT_GITHUB_TOKEN: ${{ github.token }}` (default) | None. Keep `permissions: copilot-requests: write`. Org must allow Copilot CLI billed to the organization. |
| **User-owned** (public or private) | `COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_GITHUB_TOKEN }}` | Fine-grained PAT (**Copilot Requests**, personal account) stored as repo Actions secret `COPILOT_GITHUB_TOKEN` |

Do **not** use a GitHub App client secret or private key as this value.

**Commit** the copied `.github/` files in the app repo. Do **not** commit a PAT.

Edit `workflows/dpsa-pr-comment.yml` and keep only this app’s base branch names (staging, UAT, `main` / `master`, or your app’s name). Comment out or delete the rest.

Create the label **`dpsa-exception`** once in the app repo (or add it from the PR labels UI). For Critical false positives, add the label **and** comment the DPSA Finding Analyst result on the PR.

### How merge is disabled

GitHub does not hide **Merge pull request** just because a check is red. A **draft** PR cannot be merged. The Action does that when the gate fails:

1. Adds label **`dpsa-blocked`**
2. Converts the PR to **draft**
3. If they click **Ready for review** while still blocked, the workflow runs again (no Copilot) and converts it back to draft. That click does **not** pass the check or unlock Merge.
4. After a fix + push, or **`dpsa-exception`**, it removes `dpsa-blocked` and marks the PR ready

Repos that never copy this toolkit are untouched.

The **`dpsa-blocked` label does not lock Merge.** Look for **Draft** on the PR. If the label appears and the PR is still Ready, draft conversion failed — see Troubleshooting.

If draft conversion fails (`Resource not accessible by integration`), ask the GitHub admin:

**Settings → Actions → General → Workflow permissions → Allow GitHub Actions to create and approve pull requests**

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
| Copilot CLI auth | Org: `${{ github.token }}` (default). User-owned: repo secret `COPILOT_GITHUB_TOKEN` |
| Same-repository PRs | Fork PRs are skipped |

---

## What happens on a PR

1. Developer opens or updates a same-repo PR **into a staging/UAT-style base branch**
2. Job **Comment DPSA report** runs (otherwise the workflow is skipped)
3. Copilot CLI reviews `git diff origin/<base>...HEAD` only (`git` tools only)
4. One comment is posted or updated (`<!-- cloudstaff-dpsa-ci -->`)
5. If **Critical > 0** and the PR has **no** `dpsa-exception` label, the job **fails** and the PR is **converted to draft** (Merge disabled)

REVIEW INCOMPLETE does **not** fail the job.

The PR comment uses **PR Scenario 1** (not required), **2** (PASS), **3** (High / Medium / Low), or **4** (Critical). Findings are File + Line. **Critical** fails the job unless `dpsa-exception`. High / Medium / Low never fail.

For Critical false positive / deferral: developer or Security adds **`dpsa-exception`** and **comments the DPSA Finding Analyst result on the PR**. Adding the label re-runs the workflow.

---

## Developer workflow

| When | What to do |
|------|------------|
| While coding | VS Code instructions as today |
| Before PR (optional) | `/dpsa` in Copilot Chat |
| After the PR exists | Use the automated comment (official record) |
| PR 1 / PR 2 (no findings) | Ready to merge — this comment fulfills the security review requirement |
| One cited finding | **DPSA Finding Analyst** — paste the PR comment |
| PR 3 — High / Medium / Low | Check does not fail. True positive: prefer fix, or merge (Security tracks). False positive: merge; mark false positive in monitoring |
| PR 4 — Critical | Converted to **draft**. Fix and push, **or** `dpsa-exception` + Finding Analyst as a PR comment — then the Action marks it ready |
| Evidence | PR URL on Jira — screenshot only if there is no PR |

---

## Safety

- Same-repo PRs only
- `pull_request` (not `pull_request_target`)
- Base branch name is passed via `env:` (not interpolated into `run:`)
- No approve, deploy, or code mutation. May convert the PR to draft / ready (merge lock)
- Fork PRs skipped

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Job skipped | Fork PR, base branch is not staging/UAT-style, or same-repo check failed — add the branch name in `workflows/dpsa-pr-comment.yml` |
| Auth / Copilot errors | Org: keep `${{ github.token }}` + `copilot-requests: write`. User-owned: fine-grained PAT + secret `COPILOT_GITHUB_TOKEN`. Not a GitHub App client secret or private key. |
| Missing skill | Copy `skills/` into the app `.github/skills/` |
| Nested `.github/.github/` | You copied this toolkit’s old nested folder — copy **root** `workflows/` and `dpsa-ci/` instead |
| REVIEW INCOMPLETE comment | Check the Actions log; re-run the job |
| Job failed on Critical | Fix the cited lines and push, **or** add `dpsa-exception` and comment the Finding Analyst result on the PR. The Action marks the PR ready. |
| Check failed / `dpsa-blocked` but Merge still works | The label does not lock Merge. The PR must be a **draft**. Re-copy `workflows/` + `dpsa-ci/`. If still Ready, the Actions token could not convert draft — ask admin to allow Actions to create/approve PRs (see above). |
| Ready for review unlocked Merge with no code change | Re-copy `dpsa-ci/` and `workflows/`. Ready-for-review must convert back to draft and fail the check until a push or `dpsa-exception`. |
| Thinking / “Total ~N lines” above the report | Re-copy `dpsa-ci/post-dpsa-comment.sh` — CI now strips text before `## Digital Product Security Assessment` |
