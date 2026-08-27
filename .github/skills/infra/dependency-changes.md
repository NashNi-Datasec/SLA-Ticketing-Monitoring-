# Infra — Dependency Changes

Apply to changed dependency manifests only (`package.json`, lockfile-adjacent manifests, etc.).

## Checks

1. **Security-relevant downgrades** — version pin lowered or removed for auth, crypto, TLS, or validation libraries visible in diff
2. **Removed security dependencies** — dependency dropped that provided CSRF, helmet, rate limiting, or input sanitization in the same diff context
3. **Risky new direct dependencies** — added packages with shell execution, dynamic eval, or native addon patterns in diff (pattern signals only — no CVE lookup)
4. **Lifecycle script secrets** — `postinstall`, `preinstall`, or custom scripts added/changed with hardcoded tokens, curl-to-bash, or remote code fetch
5. **Script privilege escalation** — new npm/yarn scripts invoking `sudo`, broad file writes, or network calls to untrusted URLs in diff
6. **Dependency confusion signals** — scoped package name typos or registry URL overrides added in diff
7. **LLM SDK pinning** — new or changed LLM deps (`openai`, `@anthropic-ai/sdk`, `langchain`, `llamaindex`) with version pin removed or downgraded

## Patterns

```
"(helmet|bcrypt|jsonwebtoken|passport|csrf|sanitize|validator|crypto)"
-\s*".*":\s*"\^?[\d.]+"
\+\s*".*":\s*"\^?[\d.]+"
(postinstall|preinstall|prepare)\s*:
(curl\s+|wget\s+|eval\(|child_process|exec\()
registry\s*:|_authToken|npmrc
openai|@anthropic-ai/sdk|langchain|llamaindex
```

Report only when changed lines introduce or worsen supply-chain or dependency risk. Lockfile-only diffs (`package-lock.json`, `yarn.lock`) → skip unless user explicitly scopes them.

For **GitHub Dependabot CVE alerts** (is the app actually affected?), use `/dependabot-assess` — do not look up CVEs here.

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
