# Universal Security Checks

Diff-only **triage** on changed lines. Run **after** loaded domain modules — defer domain-specific depth to them.

For each candidate → [`exploitability-gate.md`](exploitability-gate.md) → [`owasp-risk-rating.md`](owasp-risk-rating.md). Do not score severity here.

---

## Execution Order

1. Read **git diff hunks only**
2. Apply loaded **domain module** checks first
3. Run this universal triage on remaining changed lines
4. For each candidate → exploitability gate → **High confidence only** → OWASP severity

---

## Evidence Rules (Anti-Hallucination)

- Report only if the issue is **visible in the git diff** (added/changed lines) or a helper **directly referenced in the same changed file**
- **File + Line required** — the cited line must appear in the hunk as added or changed. Do not guess from memory, unchanged files, or “nearby” lines
- **One finding per sink** — same File + Line + same sink = **one** finding. Do not group a whole file, a function, or a PR into one finding. Consecutive lines that are **one** sink (e.g. `eval(params.x)` across two lines) may use a short range
- **Pattern signal ≠ finding** — a signal requires a visible sink and data flow in changed code
- Do **not** infer missing auth, secrets, or IDOR from unchanged files, folder names, or framework defaults
- Do **not** report categories absent from the diff (UI-only diff → skip auth/injection items)
- If zero candidates after triage → clean pass (see `low-noise-rules.md`)
- When in doubt, **skip** rather than speculate. Do not report Medium/Low confidence.

---

## Skip Triage When

- Diff is docs, comments, formatting, UI copy only
- Diff is lockfiles only (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) with no manifest changes
- Changed lines have no security sinks (no API, auth, query, secret, deserialization)
- A domain module already reported the finding — do not duplicate

When **infra** domain loads for manifest files (`package.json`, `requirements.txt`, etc.), defer dependency checks to `infra/dependency-changes.md` — do not skip manifest diffs as lockfile-only.

Business-logic depth → `web/business-logic.md`, `backend/tenant-isolation.md` when those domains load.

---

## Universal Triage Checklist

Apply to **changed lines only**, in priority order:

1. **Hardcoded secrets** (CWE-798) — literal keys, tokens, passwords, private keys in changed lines
2. **Injection sinks** (CWE-89, CWE-78) — user input reaching query, exec, or render in changed lines
3. **Missing auth** on new/changed route/handler — no guard/middleware in hunk where auth is expected (see auth rule below)
4. **IDOR / BOLA** (CWE-639) — fetch/update by ID without ownership or tenant check in changed query/handler
5. **Mass assignment** (CWE-915) — full body spread or `__all__` on update in changed lines
6. **Verbose errors** (CWE-200) — stack trace or internal detail returned to client in changed code
7. **Client-trusted values** (CWE-840) — price, role, status, or plan from request used server-side in diff
8. **Unsafe deserialization** (CWE-502) — user input passed to deserialize in changed lines

---

## Pattern Signals (Diff Text Only)

Look for these in **changed lines** — not repo-wide search:

| Category | Signals (examples) |
|----------|-------------------|
| Secrets | `api_key = "`, `password: "`, `BEGIN PRIVATE KEY`, `sk-live-` |
| Injection | `.raw(`, `execute(`, `f"SELECT`, string concat + `req.` / `params.` |
| Mass assignment | `request.all()`, `Object.assign(..., req.body)`, `fields = '__all__'` |
| IDOR | `findById(`, `find(params.id`, `.get(id)` without `userId` / `tenant` in same hunk |

**Auth:** Flag only if the diff **adds or modifies** a route/handler and the hunk shows no auth decorator/middleware while sibling routes in the **same diff** use auth. Do not assume endpoints are public without code in the diff.

---

Domain modules provide depth; this file ensures universal categories are not missed on the diff.
