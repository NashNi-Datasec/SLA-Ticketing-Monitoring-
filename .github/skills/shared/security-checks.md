# Universal Security Checks

Apply to **changed lines only**, in priority order. Apply exploitability gate from `exploitability-gate.md` before reporting.

1. **Hardcoded secrets** (CWE-798) — API keys, passwords, tokens, private keys in source
2. **Injection** (CWE-89, CWE-78) — SQL/command/template injection via user input concatenation
3. **Missing authentication** (CWE-306) — new/changed endpoints without auth middleware/guard
4. **IDOR / BOLA** (CWE-639) — fetch/update by ID without ownership or tenant check
5. **Mass assignment** (CWE-915) — `$request->all()`, `req.body` spread, `fields = '__all__'`
6. **Debug / verbose errors** (CWE-200) — stack traces or internals returned to clients
7. **Client-trusted values** (CWE-840) — price, role, status, plan from request body used server-side
8. **Unsafe deserialization** (CWE-502) — `unserialize`, `pickle.loads`, `ObjectInputStream` on user input
9. **Business logic abuse** — approval bypass, workflow skipping, tenant crossover, privilege escalation, client-controlled state transitions

## Search Patterns (changed files only)

```
# Secrets
(password|secret|api_key|token)\s*=\s*['\"]

# Injection
(query|execute|raw|DB::raw|whereRaw).*\$|f[\"'].*SELECT|\+.*req\.(query|body)

# Missing auth
@(Public|GetMapping|PostMapping|Route).*without.*(auth|guard|middleware)

# IDOR
findById|find\(|get\(.*params\.|Order::find

# Mass assignment
request\.all\(\)|Object\.assign.*req\.body|fields\s*=\s*['\"]__all__
```

Domain modules add checks on top of this list. Do not duplicate universal checks unless domain-specific context applies.
