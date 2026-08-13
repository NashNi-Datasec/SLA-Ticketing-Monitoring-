# Infra — Secrets Management

Apply to changed config, env, or secrets-related files.

## Checks

1. **Secrets in source control** — `.env`, credentials, private keys, connection strings committed in diff
2. **Secrets in logs/config dumps** — debug endpoints or startup logs printing env vars or secrets
3. **Weak secret references** — default passwords (`admin/admin`, `changeme`), empty secret values in prod config
4. **Secret sprawl** — same secret duplicated across multiple files in diff instead of centralized reference
5. **Client-exposed env vars** — server secrets prefixed for frontend exposure (`NEXT_PUBLIC_`, `VITE_`, `REACT_APP_`) on sensitive keys
6. **Rotation bypass** — hardcoded fallback secrets when env var missing in production code paths

## Patterns

```
(password|secret|api_key|token|private_key)\s*[:=]\s*['\"][^'\"]+['\"]
\.env|AWS_SECRET|DATABASE_URL
NEXT_PUBLIC_.*SECRET|VITE_.*KEY
process\.env\.\w+\s*\|\|\s*['\"]
```

Hardcoded production secrets in diff → **Critical** per severity calibration.

Apply exploitability gate — secret must be reachable or extractable.
