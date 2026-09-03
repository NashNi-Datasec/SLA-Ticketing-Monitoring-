# Web — API Security

Apply to changed frontend code that calls APIs.

## Checks

1. **Missing CSRF protection** — state-changing requests (POST/PUT/DELETE) without CSRF token or SameSite cookie strategy when session auth is used
2. **Sensitive data in URLs** — tokens, emails, or PII in query parameters logged by proxies/browsers
3. **CORS misconfiguration in client-initiated changes** — `credentials: 'include'` with wildcard origins in changed fetch/axios config
4. **API keys in frontend** — secret keys embedded in client bundle (maps, payment, admin keys)
5. **Trusting API responses for security decisions** — using client-side response fields to grant access without server enforcement visible in diff
6. **GraphQL/introspection** — exposing admin mutations from public client code without auth headers
7. **WebSocket auth** — WebSocket connect/subscribe without token or session validation in changed client code
8. **GraphQL IDOR variables** — client-supplied IDs in GraphQL variables for sensitive queries without server-side auth visible in diff

## Patterns

```
fetch\(|axios\.(get|post|put|delete)
Authorization.*Bearer.*['\"][a-zA-Z0-9]{20,}
apiKey|api_key|secret.*process\.env\.NEXT_PUBLIC
WebSocket|new WebSocket|graphql.*variables
```

Report only when changed code introduces or worsens exposure. Existing patterns outside diff → skip.

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
Report File + Line from diff only.
