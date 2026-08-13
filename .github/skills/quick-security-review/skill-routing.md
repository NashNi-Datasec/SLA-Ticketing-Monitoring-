# Skill Routing

Deterministic module selection for `/quick-security-review`. Follow this algorithm exactly — no AI discretion.

**Silent execution:** Routing and module loading happen internally. Do not describe this process in the chat reply — output the report from `SKILL.md` only.

## Allowed Modules

Only these paths may be loaded:

| Type    | Path              | Load rule                      |
| ------- | ----------------- | ------------------------------ |
| Shared  | `../shared/*.md`  | **Always** — all 4 files       |
| Web     | `../web/*.md`     | When `web` domain selected     |
| Mobile  | `../mobile/*.md`  | When `mobile` domain selected  |
| Backend | `../backend/*.md` | When `backend` domain selected |
| Infra   | `../infra/*.md`   | When `infra` domain selected   |


Never load modules outside this structure. Never invent new domains or files.

---

## Routing Algorithm

1. Collect **changed file paths from git diff only** (staged, unstaged, or branch comparison)
2. Do **not** include untracked files unless explicitly named by the user
3. For each domain, count how many changed paths match its patterns (one path can match multiple domains)
4. Rank domains by match count (descending)
5. Select **top 3** domains with count > 0
6. **Tie-break** when counts are equal: `backend` > `web` > `infra` > `mobile`
7. If zero domain matches:
  - load shared modules only
  - perform baseline security review without domain-specific checks
8. Always load all 4 files from `../shared/`
9. For each selected domain, load only modules relevant to the matched patterns for that domain

---

## Domain Path Patterns

Match against the full changed file path (case-insensitive).

### web

- `**/components/`**
- `**/*.tsx`
- `**/*.jsx`
- `**/*.vue`
- `**/pages/**`
- `**/views/**`
- `**/frontend/**`
- `**/static/**` (client-side JS/CSS)

### mobile

- `**/android/**`
- `**/ios/**`
- `**/*.swift`
- `**/*.kt`
- `**/*.kts`
- `**/*.gradle`
- `**/App.tsx` (React Native entry)

### backend

- `**/routes/**`
- `**/controllers/**`
- `**/api/**`
- `**/handlers/**`
- `**/models/**`
- `**/middleware/**`
- `**/services/**`
- `**/auth/**`
- `**/login/**`
- `**/*.py`
- `**/*.go`
- `**/*.java`
- `**/*.rb`
- `**/*.php`

### infra

- `**/*.tf`
- `**/*.tfvars`
- `**/terraform/**`
- `**/docker/**`
- `**/Dockerfile`
- `**/docker-compose*.yml`
- `**/k8s/**`
- `**/helm/**`
- `**/.env*`
- `**/cloudformation/**`
- `**/*.yaml` under `deploy/`, `k8s/`, `infra/`, `charts/`

---

## Routing Output

Before applying checks, record which modules were loaded. Include in the review header:

```
**Modules loaded:** shared, [domain1], [domain2], [domain3]
```

List domains in selection order (highest match count first; use tie-break order for ties).

---

## Examples


| Changed files                                                                                   | Match counts                            | Modules loaded                                               |
| ----------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------ |
| `src/routes/users.ts`                                                                           | backend: 1                              | shared, backend                                              |
| `src/pages/LandingPage.tsx`                                                                     | web: 1                                  | shared, web                                                  |
| `src/routes/api.ts`, `src/components/Form.tsx`                                                  | backend: 1, web: 1                      | shared, backend, web                                         |
| `terraform/main.tf`, `src/routes/auth.go`, `src/views/login.vue`, `android/app/MainActivity.kt` | infra: 1, backend: 2, web: 1, mobile: 1 | shared, backend, web, infra (mobile dropped — max 3 domains) |
| `README.md` only                                                                                | none                                    | shared only                                |


---

## Max Domain Rule

- Maximum **3** domain folders per review (plus shared, which is always loaded)
- When more than 3 domains match, keep the top 3 by match count; apply tie-break for equal counts
- Within each selected domain, load **every** module file in that folder



## Ignore Rules

Do not route on these file types unless explicitly requested:

- `*.md`
- `*.txt`
- `*.png`
- `*.jpg`
- `*.svg`
- `package-lock.json`
- `yarn.lock`
- generated build artifacts
- snapshot files

These files do not contribute to domain scoring.

## Explicit Scope Overrides

If the user explicitly specifies a comparison target, branch, commit, PR, or file list, use that scope instead of automatic diff detection.

Examples:

- `Review staged changes against main`
- `Review changes against develop`
- `Review PR #52`
- `Review only src/api/auth.ts`

Priority order:

1. Explicit user-provided scope
2. Git branch diff
3. Staged changes
4. Unstaged changes

Never expand beyond the requested scope.

## Nearby Logic Boundary

When reviewing a changed file, nearby supporting logic may be inspected only if directly referenced by the changed code.

Examples:
- called helper functions
- referenced middleware
- imported validators
- ownership/auth checks

Do not recursively expand review scope across unrelated modules or services.