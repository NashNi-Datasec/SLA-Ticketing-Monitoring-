# Web — Auth Review

Apply to changed frontend/auth-related code only.

## Checks

1. **Token storage** — access/refresh tokens in `localStorage` or `sessionStorage` without httpOnly cookie alternative (XSS theft risk)
2. **Auth state in client** — role, admin flag, or permissions stored only in client state without server verification on protected actions
3. **OAuth redirect** — open redirect in `redirect_uri`, missing state/nonce validation
4. **Session handling** — session ID in URL, missing logout/token invalidation on sign-out
5. **Protected routes** — client-only route guards with no corresponding server-side auth on API calls
6. **Credential handling** — passwords or secrets logged to console, sent in query strings, or cached in browser storage
7. **OAuth PKCE** — public OAuth clients missing `code_challenge`/`code_verifier` in changed auth flow
8. **Refresh token rotation** — refresh tokens reused indefinitely without rotation or revocation on logout in diff
9. **Cookie flags** — session cookies missing `Secure`, `HttpOnly`, or `SameSite` in changed auth code

## Patterns

```
localStorage\.(setItem|getItem).*(token|jwt|auth)
redirect_uri=|window\.location\.(href|replace)\s*=
role\s*[:=].*(admin|superuser)
code_challenge|code_verifier|SameSite|httpOnly|secure:\s*true
```

Client-only guards without server bypass in diff → skip unless API call in same diff lacks auth.

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
Report File + Line from diff only.
