Run `/dpsa` as a **read-only** Digital Product Security Assessment on this pull request.

Follow `.github/skills/dpsa/SKILL.md` exactly — routing, the 7 named shared modules, PR Scenarios 1–4, OWASP Category, File + Line, one finding per sink. Do **not** invent modules or scenario rules.

Scope:
- Review **only** the PR diff: `git diff origin/${DPSA_BASE_REF}...HEAD`
- Do not scan the full repository
- Do not read untracked files
- Do not execute application code, tests, installs, linters, formatters, or scanners
- Do not modify files, commit, push, approve, merge, or deploy

If `.github/security-context.md` exists, use it for OWASP scoring.

Set **Run:** to `GitHub Actions PR comment`. Use the skill’s GitHub Actions templates. Do not use the VS Code preview templates.

Gate (do not invent): **Block on: ${DPSA_BLOCK_ON}**

Your **entire stdout** must be the DPSA report. The **first line** must be exactly:

## Digital Product Security Assessment (DPSA)

No narration. No tool announcements. No line-count or "fits" / "read the file" notes.

"Ready to merge" is report text only. Do not approve or merge the pull request.
