# Backend — API Authorization

Apply to changed **HTTP API** handlers (REST, GraphQL, RPC, webhooks) — not browser-only UI.

Use **OWASP API Security Top 10:2023** on these findings (`APIn:2023`). Do not label them Web `A0n:2021` just because the repo is a “web app.”

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
**One finding per sink.** File + Line from the changed hunk only.

## Checks

1. **Broken Object Level Authorization (BOLA / API1:2023)** — fetch, update, or delete by client-supplied object ID (`params.id`, GraphQL argument, body id) with **no** ownership, tenant, or object-level check in the changed handler/query
2. **Broken Function Level Authorization (BFLA / API5:2023)** — admin, export, refund, or other privileged route/mutation in the diff with **no** role/permission guard, while sibling routes in the **same diff** are guarded
3. **Mass assignment (API3:2023 / CWE-915)** — `req.body`, GraphQL input, or `Object.assign` / `__all__` written straight onto a model (role, tenant_id, price, isAdmin) in changed lines
4. **Broken Object Property Level Authorization (API3:2023)** — response or update includes fields the caller must not read or set (password hash, other users’ PII, role) without a allow-list / serializer in the hunk
5. **Unrestricted resource consumption (API4:2023)** — new list/export endpoint with unbounded `limit` / no pagination from client input in changed lines
6. **Broken authentication on the API (API2:2023)** — new/changed route that reads or writes sensitive data and the hunk shows **no** auth middleware/decorator, while other routes in the **same diff** use auth
7. **Security misconfiguration — webhook/API (API8:2023)** — webhook or callback handler in the diff with no signature/secret check

## Patterns

```
findById\(|find\(params\.|req\.params\.id|args\.id
req\.body|input\.|Object\.assign\(.*req\.
role|isAdmin|tenant_id|tenantId
export|refund|admin
limit.*req\.|first:.*args
X-Hub-Signature|webhook
```

**Skip** if the hunk already shows ownership (`userId` / `tenantId` match), an allow-listed serializer, or auth + role check. Pattern alone is not a finding.

Score via `shared/owasp-risk-rating.md` — never set Critical from the API category name.
