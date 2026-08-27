# Backend — Injection Prevention

Apply to changed server-side code only.

## Checks

1. **SQL injection** — string concatenation or f-strings in queries with user input; raw queries without parameterization
2. **NoSQL injection** — `$where`, operator injection via unsanitized JSON/query objects (`{ "$gt": "" }`)
3. **Command injection** — `exec`, `system`, `subprocess`, `shell=True`, backtick execution with user input
4. **Template injection** — user input in template render paths (Jinja2, EJS, Handlebars) without auto-escape
5. **LDAP/XPath injection** — dynamic filter construction with concatenated user input
6. **Path traversal** — file read/write using user-supplied paths without normalization and root jail
7. **Header injection** — user input in HTTP response headers (`Location`, `Set-Cookie`) without encoding or validation
8. **Log injection** — unsanitized user input written to logs enabling forged entries or log viewer XSS
9. **ReDoS** — user-supplied regex or pattern passed to `RegExp()`/`re.compile()` without timeout or length cap

## Patterns

```
execute\(|rawQuery|DB::raw|whereRaw|f["'].*SELECT
subprocess\.|exec\(|system\(
render\(.*request\.|req\.(query|body|params)
\.\./|\.\.\\
setHeader\(|res\.(header|set)\(|Location.*\+
logger\.(info|warn|error|debug)\(.*\+|log\(.*req\.
new RegExp\(|re\.compile\(
```

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
Report File + Line from diff only. User input must reach the sink in changed lines.
