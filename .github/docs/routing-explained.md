# Routing Explained

How `/quick-security-review` selects domain modules from a git diff.

The router is defined in `skills/quick-security-review/skill-routing.md` — the orchestrator must follow it exactly.

---

## Algorithm

```
1. Get changed file paths from git diff
2. Count path matches per domain (web, mobile, backend, infra)
3. Rank by count (descending)
4. Select top 3 with count > 0
5. Tie-break: backend > web > infra > mobile
6. If zero matches → fallback to backend
7. Always load shared/ (all 4 files)
8. Load all .md files in each selected domain folder
```

---

## Path Patterns

### web

`components/`, `*.tsx`, `*.jsx`, `*.vue`, `pages/`, `views/`, `frontend/`, `static/`

### mobile

`android/`, `ios/`, `*.swift`, `*.kt`, `*.kts`, `*.gradle`, `App.tsx`

### backend

`routes/`, `controllers/`, `api/`, `handlers/`, `models/`, `middleware/`, `services/`, `auth/`, `login/`, `*.py`, `*.go`, `*.java`, `*.rb`, `*.php`

### infra

`*.tf`, `*.tfvars`, `terraform/`, `docker/`, `Dockerfile`, `docker-compose*.yml`, `k8s/`, `helm/`, `.env*`, `cloudformation/`, deploy/k8s/infra/charts `*.yaml`

Full pattern list: [skill-routing.md](../skills/quick-security-review/skill-routing.md)

---

## Worked Examples

### Example 1 — Backend only

**Diff:**
```
src/routes/users.ts
src/controllers/userController.ts
```

**Match counts:** backend: 2

**Modules loaded:** `shared`, `backend`

**Domain files loaded:**
- `backend/injection-prevention.md`
- `backend/database-security.md`
- `backend/tenant-isolation.md`

---

### Example 2 — Web only

**Diff:**
```
src/pages/LandingPage.tsx
```

**Match counts:** web: 1

**Modules loaded:** `shared`, `web`

**Domain files loaded:**
- `web/auth-review.md`
- `web/api-security.md`
- `web/frontend-security.md`
- `web/business-logic.md`

---

### Example 3 — Mixed backend + web

**Diff:**
```
src/routes/api.ts
src/components/UserForm.tsx
```

**Match counts:** backend: 1, web: 1

**Modules loaded:** `shared`, `backend`, `web` (tie-break: backend before web when equal)

---

### Example 4 — Four domains, max 3 cap

**Diff:**
```
terraform/main.tf          → infra: 1
src/routes/auth.go         → backend: 2 (routes + .go)
src/views/login.vue        → web: 1
android/app/MainActivity.kt → mobile: 1
```

**Match counts:** backend: 2, web: 1, infra: 1, mobile: 1

**Selected (top 3):** backend (2), web (1), infra (1) — mobile dropped

**Modules loaded:** `shared`, `backend`, `web`, `infra`

---

### Example 5 — No domain match (fallback)

**Diff:**
```
README.md
docs/CHANGELOG.md
```

**Match counts:** none

**Modules loaded:** `shared`, `backend` (fallback)

Review applies universal checks from `shared/security-checks.md` and backend modules. UI/docs-only diffs typically produce a clean pass via `low-noise-rules.md`.

---

## Output Transparency

Every review includes which modules were loaded:

```markdown
**Modules loaded:** shared, backend, web
```

This confirms routing ran correctly. If this line is missing, the orchestrator may not have followed `skill-routing.md`.

---

## What Routing Does NOT Do

- Does not scan untracked files (unless user explicitly names them)
- Does not scan the full repository
- Does not load modules outside the defined structure
- Does not let the AI choose modules by "best guess" — path matching only
- Does not create slash commands for domain folders

---

## Troubleshooting Routing

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Wrong domain loaded | Path doesn't match expected pattern | Check pattern table; update `skill-routing.md` if needed |
| `Modules loaded:` missing | Old monolithic skill copied | Re-copy full `skills/` tree including `skill-routing.md` |
| Missing module error | Domain folder not copied to app repo | Copy entire `skills/` tree to `.github/skills/` |
| Backend loaded for docs-only diff | Fallback behavior | Expected — review should still clean-pass if no security issues |

See [architecture.md](architecture.md) for system overview.
