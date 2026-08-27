Run `/dpsa` as a **read-only** Digital Product Security Assessment on this pull request.

Follow `.github/skills/dpsa/SKILL.md` exactly. Load routing and the 7 named shared modules from `.github/skills/`. Do not invent modules.

Scope:
- Review **only** the PR diff: `git diff origin/${DPSA_BASE_REF}...HEAD`
- Do not scan the full repository
- Do not read untracked files
- Do not execute application code, tests, installs, linters, formatters, or scanners
- Do not modify files, commit, push, approve, merge, or deploy

If `.github/security-context.md` exists, use it for OWASP scoring.

Set **Run:** to `GitHub Actions PR comment`.

Your **entire stdout** must be the DPSA report. The **first line** must be exactly:

## Digital Product Security Assessment (DPSA)

No narration. No tool announcements. No line-count or "fits" / "read the file" notes. Do not say the PR is approved.

On **PASS**, use the skill’s short TIP box. Do **not** add “optional Uberticket DPSA” on PASS — that is product intake, not this review.

If **Critical > 0**, the Scenario 4 next-steps must say **this PR is blocked** until they fix the cited lines or file Uberticket DPSA for that finding and add label `dpsa-exception`. High/Medium/Low must not say the PR is blocked.
