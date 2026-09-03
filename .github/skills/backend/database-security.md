# Backend — Database Security

Apply to changed data access code only.

## Checks

1. **Missing authorization on queries** — fetch/update/delete by ID without ownership or role check
2. **Over-fetching** — SELECT * or returning sensitive columns (password hash, SSN) in changed serializers/responses
3. **Raw ORM escape hatches** — `.raw()`, `$queryRaw`, `extra()`, or native queries introduced without parameter binding
4. **Transaction boundaries** — financial or inventory changes without transaction/isolation when race enables double-spend
5. **Soft-delete bypass** — queries missing `deleted_at IS NULL` or equivalent allowing access to deleted records
6. **Pagination abuse** — unbounded `limit` from client enabling DoS or mass data export
7. **Row-level security bypass** — queries on RLS-protected tables missing tenant/user scope in changed code
8. **N+1 data leak** — eager loads or joins in diff exposing related records beyond authorized scope
9. **Cursor/offset enumeration** — predictable cursors or sequential IDs enabling mass record harvesting

## Patterns

```
findById|findOne|find\(|get\(.*params\.|WHERE.*\+
select\s+\*|password|ssn|credit_card
\$queryRaw|\.raw\(|queryRawUnsafe
limit\s*[:=].*req\.|take\(.*params
include:|with\(|preload\(|cursor|offset.*params
```

IDOR findings require missing ownership/tenant check in changed query path.

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
Report File + Line from diff only.
