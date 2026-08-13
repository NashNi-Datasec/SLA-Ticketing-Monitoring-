---
description: Brief security self-check when code changes may impact confidentiality, integrity, or availability
applyTo: "**/auth/**,**/login/**,**/routes/**,**/controllers/**,**/middleware/**,**/api/**,**/handlers/**,**/models/**,**/payments/**,**/admin/**,**/config/**,**/.env*"
---

Provide a brief CIA-gated security self-check when editing sensitive code paths.

Apply only when changes may impact Confidentiality, Integrity, or Availability.

## Skip when changes are only

- Grammar, spelling, comments, docs, or Markdown changes
- Formatting, whitespace, import ordering, or non-functional cleanup
- Renames with no behavioral impact
- Pure styling or CSS-only changes with no data-flow impact
- Test-only updates with no production behavior changes

If changes are limited to those cases, do not run this check.

## Apply when changes involve

- Authentication or authorization
- Sessions, JWT, OAuth, MFA, or permissions
- API routes, controllers, middleware, handlers, or webhooks
- SQL queries, ORM filtering, or dynamic query construction
- File uploads, exports, parsing, or deserialization
- Payments, checkout, credits, billing, or financial workflows
- Tenant isolation, admin features, or role-sensitive logic
- Secrets, configuration, environment variables, or security settings
- Rate limiting, throttling, or abuse protections

## Self-check requirements

Review only:

- the current diff
- changed files
- directly related nearby logic

Do not perform a full repository audit.

Check for:

- Missing authentication or authorization
- Injection risks
- Mass assignment risks
- Sensitive data exposure
- Broken tenant isolation
- Business-logic abuse opportunities
- Unsafe configuration changes
- Missing validation on security-sensitive inputs

## Finding Quality Rules

- Report only findings supported by visible code or the current diff
- Include the affected file and best-known line or code location when observable in the current context
- Clearly distinguish confirmed risks from low-confidence observations
- Assign a confidence level:
  - High — directly observable exploitable issue
  - Medium — likely issue with partial supporting evidence
  - Low — suspicious pattern requiring manual verification
- Prefer reporting:
  - exploitable vulnerabilities
  - authorization flaws
  - tenant isolation risks
  - injection risks
  - sensitive data exposure
  - business-logic abuse opportunities
- Avoid reporting:
  - hypothetical-only issues
  - framework-protected behavior already handled safely
  - missing controls that are not observable in the current code
  - speculative infrastructure assumptions
  - duplicate findings
  - compliance-only or best-practice-only observations without realistic security impact
  - UI, UX, wording, styling, accessibility, or maintainability observations unrelated to security
- Combine duplicate findings that share the same root cause
- Include only fields relevant to the observed issue
- Prefer minimal secure remediation over large architectural rewrites
- When possible, briefly explain:
  - how the issue could realistically be abused
  - what input, request, or flow triggers the issue
  - what condition makes the issue exploitable
- Keep abuse explanations concise:
  - 1–2 sentences maximum
  - no exploit walkthroughs
  - no attack scripts
  - no step-by-step penetration instructions
- Keep reproduction guidance realistic and evidence-based
- Do not invent attack scenarios unsupported by the visible implementation
- If confidence is Low:
  - explicitly recommend manual verification

## Preferred Finding Format

- File:
- Line:
- Severity:
- Confidence:
- Concern:
- Security impact:
- Minimal fix:

## Response rules

- If no CIA-relevant concern is found:
  - say nothing, or:
  - `No CIA-relevant concerns in this change.`
- If an issue is found:
  - keep feedback brief and actionable
  - include only relevant fields
  - keep remediation concise (approximately 3–5 lines)
- Prioritize exploitable issues over informational advice
- Avoid speculative or low-confidence findings
- Do not generate long reports or large rewrites
- Do not create report files
- Do not scan unrelated areas of the repository

## Escalation

For substantial changes involving:

- authentication
- authorization
- APIs
- payments
- tenant isolation
- administrative actions
- infrastructure or security configuration

suggest:

`/quick-security-review`

## Scope

- Follow only rules relevant to the current context
- Do not apply unrelated checks
- Keep reviews concise and security-focused

