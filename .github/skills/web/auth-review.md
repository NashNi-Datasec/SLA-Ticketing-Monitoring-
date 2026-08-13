# Web — Auth Review

Apply to changed frontend/auth-related code only.

## Checks

1. **Token storage** — access/refresh tokens in `localStorage` or `sessionStorage` without httpOnly cookie alternative (XSS theft risk)
2. **Auth state in client** — role, admin flag, or permissions stored only in client state without server verification on protected actions
3. **OAuth redirect** — open redirect in `redirect_uri`, missing state/nonce validation
4. **Session handling** — session ID in URL, missing logout/token invalidation on sign-out
5. **Protected routes** — client-only route guards with no corresponding server-side auth on API calls
6. **Credential handling** — passwords or secrets logged to console, sent in query strings, or cached in browser storage

## Patterns

```
localStorage\.(setItem|getItem).*(token|jwt|auth)
redirect_uri=|window\.location\.(href|replace)\s*=
role\s*[:=].*(admin|superuser)
```

Apply exploitability gate. Client-only guards without server bypass in diff → skip unless API call in same diff lacks auth.
