# Web — Business Logic

Apply to changed frontend workflow, form, or state logic.

## Checks

1. **Client-trusted workflow state** — approval status, payment status, or step completion sent from client without server-side validation in related diff
2. **Price/quantity manipulation** — totals, discounts, or cart values computed client-side and sent as authoritative values
3. **Role/plan escalation** — UI hides admin features but API calls in diff omit auth or send client-selected role/plan IDs
4. **Race conditions** — double-submit or concurrent requests bypassing limits (coupon reuse, vote twice) when changed code removes guards
5. **Feature bypass** — client-side flags (`isPremium`, `certEnabled`) gating security-sensitive actions without server check
6. **Tenant/org scoping** — org/tenant ID taken from client storage without validation on data fetch in changed code

## Patterns

```
(status|role|plan|price|total|discount|approved)\s*[:=].*req\.|body\.|params\.
setState.*admin|isAdmin\s*=\s*true
```

Report only when changed code enables abuse. UI label mismatches without data-flow impact → skip.

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
Report File + Line from diff only.
