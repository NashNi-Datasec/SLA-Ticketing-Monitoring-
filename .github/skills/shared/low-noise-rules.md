# Low Noise Rules

## Reply Format

When running as part of `/dpsa` or `/full-assessment-security-review`, contribute rules only — do **not** add narration about applying these rules. The orchestrator outputs its report template with no preamble (`## Digital Product Security Assessment (DPSA)` or `## Full Assessment Security Review`).

## Out of Scope — Do NOT Report

Always ignore these, even if present in the diff:

- UX, copy, wording, or UI inconsistencies
- Feature-flag or conditional UI differences
- Product or functional regressions without security impact
- Styling, layout, accessibility, performance (unless clear DoS risk in changed code)
- Missing tests or coverage gaps
- Refactoring, naming, DRY, maintainability issues
- Docs or `.github/` files unless the diff itself introduces an exploitable workflow/script issue
- Compliance-only or best-practice-only observations without exploitability
- “Might be vulnerable”, missing hardening, or defense-in-depth suggestions without a visible exploit in the diff
- Workflow/CI/docs-only nits that are not a concrete injection or secret leak in changed lines

## Do NOT Report as Medium or High

- Missing security headers, TLS, or CORS (unless introduced insecurely in diff)
- Rate limiting suggestions without relevant auth endpoints in diff
- MFA suggestions without admin/payment context in diff
- TODO comments unless they disable a security control
- Generic hardening advice without exploitable code in changed files
- UI/copy/feature-flag differences

## Clean Pass Rule

If no realistic security issue exists in the diff:

Return in Summary:
> No exploitable security issues found in the changed code.

Do not add commentary or non-security observations.

If the diff contains only UI/copy/feature-flag changes with no auth, API, secrets, or user-data handling → clean pass.
