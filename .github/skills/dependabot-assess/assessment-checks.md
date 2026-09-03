# Dependabot Assessment Checks

Apply to each fetched Dependabot alert. Produce a per-alert verdict. Do **not** change the repo.

---

## 1. Alert facts

From the alert JSON + lockfile/manifest (static read):

- Package name, ecosystem, manifest path
- Dependabot severity (input filter only — not the app verdict)
- GHSA / CVE, vulnerable range, first patched version (if present)
- **Direct vs transitive** — named in the app manifest vs lockfile-only
- **Installed version** — from lockfile/manifest text. If unknown, say unknown (do not run `npm ls`)

---

## 2. Are we using this package?

Search the **application source** (not only the diff): imports, requires, plugin config, binary invocations that match the package.

| Evidence | Usage |
|----------|--------|
| App code imports/calls it | **Used** |
| Only lockfile / unused transitive | **Unused (lockfile)** |
| Name in manifest but no app reference | **Declared, no call sites found** |
| Cannot search (generated-only, missing lockfile) | **Unknown** |

Cite File + Line for at least one usage hit, or state none found.

---

## 3. Does the vulnerability affect this app?

Compare the advisory’s vulnerable API, config, or runtime condition to **how this app uses the package**.

| Verdict | When (all must be true for High confidence) |
|---------|-----------------------------------------------|
| **Affected** | Package is present **and** a realistic path exists from app (or a used parent library) to the vulnerable behavior |
| **Not affected** | Package absent, or unused, or vulnerable sink/config clearly not in this app’s call path |
| **Uncertain** | Missing lockfile, vague advisory, transitive-only with unclear sink, dynamic loading, or you cannot mark High confidence |

Dependabot **High/Critical** is the **input**. App impact may still be **Not affected** if the sink is unused.

Do **not** treat “newer version exists” as Affected.

---

## 4. Confidence

- **Affected** and **Not affected** require **High** confidence (observable in alert JSON + repo files).
- Otherwise verdict is **Uncertain**. Do not report Medium/Low confidence as a firm Affected/Not affected.

When uncertain → list what would resolve it (lockfile, call site, whether a parent library invokes the sink). Prefer Uncertain over a guessed Not affected.

---

## 5. Fix blast radius (advice only)

If a patched version is known, **describe** (do not apply):

- Smallest version that leaves the affected range
- Other packages in the **same lockfile** that would likely move (parent/child of this node)
- Conflict risk: major bump, many dependents, or unknown tree

**Never** run install/upgrade to “see what happens.” Never edit manifests.

---

## 6. What to do next (per alert)

| Verdict | Confidence | Next step |
|---------|------------|-----------|
| Not affected | High | Do **not** file Jira for this alert. Do **not** upgrade “just in case.” |
| Affected | High | File Jira (High/Critical process) and **paste this assessment**. Fix is a **later human** decision — this skill does not bump. |
| Uncertain | — | File Jira with this assessment and the gaps. Do not upgrade to explore. |

This skill never dismisses the GitHub alert and never opens a bump PR.
