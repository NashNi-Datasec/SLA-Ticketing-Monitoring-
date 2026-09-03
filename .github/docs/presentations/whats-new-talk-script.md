# Talk script — Cloudstaff AI Security updates

Spoken walkthrough. About **8–10 minutes**. Treat this as **one update**, not two version numbers.

**Status:** Draft for the next talk. Do not announce a version tag unless a GitHub Release is already published.

**Presenter:** Nashni, Data Security Team  
**Show:** [ai-security](https://github.com/cloudstaff-apps/ai-security) and an app repo with files copied into `.github/`  
**Pictures:** [`docs/images/`](../images/README.md) — `/dpsa` chat (`03`), PR comment (`05`), agent picker (`04`)

---

Good day everyone, Nashni here from the Data Security Team. Today I’ll walk you through **what’s new in Cloudstaff AI Security**.

The Cloudstaff AI Security repository is something you add to your **application** repo. You copy its folders into your app’s `.github/` folder. After that, Copilot can help you write safer code, and it can run a security review of your changes.

[Show toolkit repo]

This is not a new security process. It is the same Digital Product Security Assessment we already use — now available **inside your development workflow**.

---

## 1. What changed

The old command was:

`/quick-security-review`

That is now:

`/dpsa`

DPSA means **Digital Product Security Assessment**.

We renamed it so the AI review matches the process we already use. Same idea. Clearer name.

There is also a **GitHub Action**. When you open a pull request into **staging or UAT**, it posts **the same DPSA report** as a comment on the PR. That comment is the **official record**.

In VS Code, `/dpsa` is optional. Use it if you want a look **before** the PR. It never blocks merge. You do **not** have to run it before you open a PR.

If the PR report finds a **Critical** issue, the check can fail until you fix those lines. High, Medium, and Low stay on the comment only — they do not fail the check.

We also added a few helpers in chat: **DPSA Finding Analyst**, **Dependabot Advisor**, and `/dependabot-assess`. I’ll come back to those in a moment.

---

## 2. Instructions vs review

Two instructions come with the toolkit.

**Secure Coding Baseline** — general security reminders when Copilot writes or edits code.

**CIA Self-Check** — extra reminders on sensitive paths. CIA means Confidentiality, Integrity, and Availability — things like login, APIs, and access control.

[Show instructions]

These only run when **Copilot** is helping. If you type the code yourself, they may not appear. That is fine.

Remember:

**Instructions guide Copilot while you work. `/dpsa` and the PR comment review the finished changes.**

---

## 3. What `/dpsa` does

In Copilot Chat, run:

`/dpsa`

[Show /dpsa]

It looks at your **current Git changes** — the lines you changed — and gives a short report.

Three results:

**PASS** — no clear security issue in this change. If the PR already has the comment, that is the official record.

**Security Issue Identified** — a problem at a **file and line**, not the whole PR.

**REVIEW INCOMPLETE** — the review could not finish. That is **not** approval.

Chat and the GitHub Action use the **same** report.

One important distinction:

**`/dpsa` is the AI report.** The official record is the comment on the staging or UAT PR.

---

## 4. When to run it

You do not need `/dpsa` after every commit.

**Want a preview?** Run `/dpsa` in VS Code.  
**Need the official result?** Open a PR into staging or UAT and read the comment.

It does not matter if the code was written by you, by Copilot, or both. What matters is that the **finished change** is reviewed.

Simple flow:

**Build → optional `/dpsa` → PR into staging or UAT → read the comment → fix if needed → push again**

The Action updates the **same** comment each time you push.

---

## 5. If it finds an issue

The finding is only those **file and line** numbers — not every ticket on the PR.

**If you can fix it now:** fix those lines and push. The PR report refreshes. Or re-run `/dpsa` if you are still in VS Code.

**If you want help on one finding:** paste that file and line into **DPSA Finding Analyst**. It tells you if it looks real and suggests a small fix. It will **not** edit your files.

[Show Finding Analyst]

**If it is Critical on the PR:** fix those lines and push, **or** add **`dpsa-exception`** (developer or Security) and comment the Finding Analyst result on the PR.

**If it is High, Medium, or Low:** the PR is not blocked. Fix it, or merge; Security can mark a false positive in monitoring.

If the comment is already on the PR, attach the **PR URL** on Jira. You do not need a screenshot of the same report.

---

## 6. Agents and Dependabot (short)

[Show picker]

Four people you can pick in Copilot Chat:

- **Security Advisor** — plan security **before** you write the code  
- **Security Review** or **`/dpsa`** — review the change  
- **DPSA Finding Analyst** — talk through **one** finding  
- **Dependabot Advisor** — explain a Dependabot alert. It **never** upgrades packages

There is also `/dependabot-assess` if you want a structured alert check. Same rule: it never upgrades or edits lockfiles.

---

## 7. How to get the update

[Show copy]

Copy these folders from the ai-security repo into your app’s `.github/`:

`instructions/`, `skills/`, `agents/`, `workflows/`, and `dpsa-ci/`

If you still have `skills/quick-security-review/`, delete it. Use `skills/dpsa/` instead.

Then:

1. In `workflows/dpsa-pr-comment.yml`, keep **only this app’s** staging or UAT branch names.  
2. If the repo is in the **organization**, leave `COPILOT_GITHUB_TOKEN: ${{ github.token }}`. You do not need a PAT.  
3. **Commit** those `.github/` files in the **app** repo. A copy on your laptop is not enough.  
4. Reload VS Code.

Full steps are in the README Quick Setup.

---

## 8. Quick look

I’ll run `/dpsa`.

[Run /dpsa]

This is the preview. Outcome, what changed, and any file-and-line findings.

This does not block anyone.

Now the pull request into staging or UAT.

[Show PR comment]

Same kind of report, on the PR. **That** is the official DPSA. PASS → done. Critical → fix those lines, or `dpsa-exception` plus Finding Analyst on the PR.

---

## 9. What to remember

The command is now **`/dpsa`**, not `/quick-security-review`.

Instructions help Copilot while you code. `/dpsa` and the PR comment review the finished work.

**Preview** in VS Code. **Official** on the staging or UAT PR.

A finding is a **file and a line**. Fix it if you can. Critical false positive: label plus Finding Analyst commented on the PR.

That’s the update.

Thank you. If you need help setting this up, reach out to the Data Security Team.

---

## Presenter notes (not spoken)

Aim for **8 minutes** of talk + **2 minutes** of demo. Skip section 6 if you are short on time.

- [ ] App `.github/` copied and committed  
- [ ] `/dpsa` ready in VS Code  
- [ ] One PR with the DPSA comment  
- [ ] Do not show tokens or customer data  
- [ ] Do not say “v0.7” or “v0.8” unless someone asks — this is one update
