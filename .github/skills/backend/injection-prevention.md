# Backend — Injection Prevention

Apply to changed server-side code only.

## Checks

1. **SQL injection** — string concatenation or f-strings in queries with user input; raw queries without parameterization
2. **NoSQL injection** — `$where`, operator injection via unsanitized JSON/query objects (`{ "$gt": "" }`)
3. **Command injection** — `exec`, `system`, `subprocess`, `shell=True`, backtick execution with user input
4. **Template injection** — user input in template render paths (Jinja2, EJS, Handlebars) without auto-escape
5. **LDAP/XPath injection** — dynamic filter construction with concatenated user input
6. **Path traversal** — file read/write using user-supplied paths without normalization and root jail

## Patterns

```
execute\(|rawQuery|DB::raw|whereRaw|f["'].*SELECT
subprocess\.|exec\(|system\(
render\(.*request\.|req\.(query|body|params)
\.\./|\.\.\\
```

Apply exploitability gate — user input must reach the sink in changed lines.
