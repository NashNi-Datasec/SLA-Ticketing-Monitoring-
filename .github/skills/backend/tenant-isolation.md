# Backend — Tenant Isolation

Apply when changed code handles multi-tenant or org-scoped data.

## Checks

1. **Missing tenant filter** — queries on tenant-scoped tables without `tenant_id`, `org_id`, or equivalent in WHERE clause
2. **Client-supplied tenant ID** — tenant/org ID from request body or query used directly without verifying user's membership
3. **Cross-tenant IDOR** — update/delete by resource ID only, ignoring tenant boundary
4. **Shared cache keys** — cache keys without tenant prefix allowing cross-tenant data leakage
5. **Background jobs** — queue payloads missing tenant context, processing data across tenants
6. **Admin impersonation** — sudo/switch-tenant features without audit logging or strict role gate in diff

## Patterns

```
tenant_id|org_id|organization_id|workspace_id
WHERE.*id\s*=.*params\.(?!.*tenant)
cache\.(get|set)\(
switchTenant|impersonate
```

Report only when changed code weakens or omits isolation. Apply exploitability gate with cross-tenant data access as impact.
