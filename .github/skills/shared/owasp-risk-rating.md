# OWASP Risk Rating

Severity is determined using the [OWASP Risk Rating Methodology](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology) and [OWASP Risk Rating Calculator](https://owasp-risk-rating.com/).

**Never auto-assign severity from finding type alone.** Score factors, compute likelihood and impact, apply the matrix, then assign overall severity.

---

## Calculator URL Format

For every reported finding, include a calculator link with the scored vector:

```
https://owasp-risk-rating.com/?vector=(SL:n/M:n/O:n/S:n/ED:n/EE:n/A:n/ID:n/LC:n/LI:n/LAV:n/LAC:n/FD:n/RD:n/NC:n/PV:n)
```

Replace each `n` with the scored value (0–9).

---

## Context Sources

1. **Preferred:** `.github/security-context.md` in the app repo (app_size, platform, repo_access, users, data classification)
2. **Fallback:** Cloudstaff defaults below when no context file exists

---

## Cloudstaff Defaults (no security-context.md)

Assume unless diff or context contradicts:

| Assumption | OWASP effect |
|------------|--------------|
| Private GitHub repo, assigned developers only | **Opportunity (O):** 0–4 (special access required) |
| Threat agent = assigned devs, not public Internet | **Size (S):** 2 (developers) |
| Unknown app size | **app_size:** Medium for business impact scoring |
| Unknown user exposure | **external_users:** false |

Do not assume anonymous Internet attackers unless the app or diff indicates public exposure.

---

## App Context → Business Impact

When `.github/security-context.md` is loaded, scale **FD, RD, NC, PV** using `app_size`:

When `llm_handles_pii: true`, increase **PV** and **LC** for findings involving prompt logging, PII in prompts, or data sent to external model providers.

| app_size | Typical FD / RD / PV range |
|----------|------------------------------|
| Low | 1–3 |
| Medium | 3–5 |
| High | 5–7 |
| Critical | 7–9 |

Adjust upward when `data_classification` is confidential/restricted, `external_users: true`, or notes mention payments/PII/SOC2.

Adjust **Opportunity (S)** upward only when repo is public or broad org access — not for standard assigned-dev-only repos.

---

## Factor Reference (0–9)

### Threat Agent — Likelihood

| Factor | Key | Low examples | High examples |
|--------|-----|--------------|---------------|
| Skill Level | SL | No technical skills (1) | Security penetration skills (9) |
| Motive | M | Low/no reward (1) | High reward (9) |
| Opportunity | O | Full/special access required (0–4) | No access required (9) |
| Size | S | Developers (2) | Anonymous Internet users (9) |

### Vulnerability — Likelihood

| Factor | Key | Low examples | High examples |
|--------|-----|--------------|---------------|
| Ease of Discovery | ED | Practically impossible (1) | Automated tools (9) |
| Ease of Exploit | EE | Theoretical (1) | Automated exploit (9) |
| Awareness | A | Unknown (1) | Public knowledge (9) |
| Intrusion Detection | ID | Active detection (1) | Not logged (9) |

### Technical Impact

| Factor | Key | Description |
|--------|-----|-------------|
| Loss of Confidentiality | LC | Data disclosed if exploited |
| Loss of Integrity | LI | Data corrupted if exploited |
| Loss of Availability | LAV | Service lost if exploited |
| Loss of Accountability | LAC | Attacker traceability |

Use **0** for technical impact factors when the issue does not apply (e.g. secret exposure with no integrity/availability impact).

### Business Impact

| Factor | Key | Description |
|--------|-----|-------------|
| Financial damage | FD | Effect on profit/cost |
| Reputation damage | RD | Brand/account loss |
| Non-compliance | NC | Regulatory exposure |
| Privacy violation | PV | PII disclosure scale |

**Prefer business impact** over technical impact when context file provides app_size and data_classification.

---

## Calculation (Repeatable Method)

1. Score all 16 factors (0–9) based on diff evidence + app context
2. **Likelihood average** = mean(SL, M, O, S, ED, EE, A, ID)
3. **Impact average** = mean(LC, LI, LAV, LAC, FD, RD, NC, PV) — weight business factors when context available
4. Band each average:
   - **LOW:** 0 to < 3
   - **MEDIUM:** 3 to < 6
   - **HIGH:** 6 to 9

---

## Overall Severity Matrix

| | Impact LOW | Impact MEDIUM | Impact HIGH |
|--|------------|---------------|-------------|
| **Likelihood LOW** | Note | Low | Medium |
| **Likelihood MEDIUM** | Low | Medium | High |
| **Likelihood HIGH** | Medium | High | Critical |

- **Note** → do not report as a finding (skip per noise rules)
- **Low / Medium / High / Critical** → use as report severity label

---

## Worked Example — Exposed Secret in Private Repo

**Finding:** Google API key committed in GitHub repository.

**Context:** assigned developers only, app_size Low, internal data, unable to verify if production secret.

**Sample vector:**

```
https://owasp-risk-rating.com/?vector=(SL:3/M:1/O:4/S:2/ED:7/EE:5/A:6/ID:8/LC:0/LI:0/LAV:0/LAC:0/FD:1/RD:1/NC:2/PV:0)
```

**Likelihood:** MEDIUM (limited opportunity, small threat agent, easy discovery)

**Impact:** LOW (low business impact for small internal app; technical impact minimal if unverified/non-production)

**Overall:** **Low** — recommend removing exposed secret; severity reflects analyst judgment considering repo access and app context, not finding type alone.

---

## Reporting Rules

1. Apply [`exploitability-gate.md`](exploitability-gate.md) first — only score findings that pass the gate
2. Every finding includes **OWASP Risk Rating** URL and **Severity rationale** (1–2 sentences)
3. Rationale must mention: who can exploit, repo access model, app size/context if known
4. Never rate **Critical** unless matrix yields Critical (typically HIGH likelihood + HIGH impact)
5. Secrets in assigned-dev-only repos are often **Low–Medium**, not automatic Critical — they still **pass the gate** and must be reported
6. If unable to verify production impact (e.g. unknown if production key) → **report anyway** with Low confidence; lower OWASP impact scores; state in rationale — do not skip via exploitability gate
