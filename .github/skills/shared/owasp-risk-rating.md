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

## OWASP Category (required on every finding)

Pick **one** category from the catalog that matches the **changed code** (not the whole app). Severity still comes from the Risk Rating matrix — do not set Critical from the category name.

**Which catalog**

| Changed code | Catalog |
|--------------|---------|
| Browser / frontend (HTML, JS/TS UI, pages, XSS, cookies in the browser) | [OWASP Top 10:2021](https://owasp.org/Top10/) — `A0n:2021` |
| HTTP API / backend handlers (REST, GraphQL, BFF, webhooks) | [OWASP API Security Top 10:2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/) — `APIn:2023` |
| iOS / Android app code (storage, IPC, TLS pinning, binary, mobile auth) | [OWASP Mobile Top 10:2024](https://owasp.org/www-project-mobile-top-10/) — `Mn:2024` |

Use `.github/security-context.md` `platform:` as a hint only. If the diff is an API route in a “web” app, use **API**. If the diff is a React Native screen in a “multi” app, use **Mobile**. Never list two catalogs on one finding.

### Web — Top 10:2021

| Category | Use when |
|----------|----------|
| A01:2021 – Broken Access Control | Missing authz, IDOR, forced browsing, CSRF that changes another user's state |
| A02:2021 – Cryptographic Failures | Secrets in code, weak crypto, plaintext sensitive data |
| A03:2021 – Injection | XSS, SQL/command/LDAP/template injection, prompt injection |
| A04:2021 – Insecure Design | Missing threat controls, trust-the-client workflows |
| A05:2021 – Security Misconfiguration | Debug left on, overly open CORS, default creds in config |
| A06:2021 – Vulnerable and Outdated Components | Known-vulnerable dependency **reachable in this diff** |
| A07:2021 – Identification and Authentication Failures | Session, password, MFA, token handling |
| A08:2021 – Software and Data Integrity Failures | Insecure deserialization, untrusted CI/plugin, unsigned updates |
| A09:2021 – Security Logging and Monitoring Failures | Auth/security events not logged when the diff removes or skips them |
| A10:2021 – Server-Side Request Forgery (SSRF) | User-controlled URL fetched server-side |

### API — API Security Top 10:2023

| Category | Use when |
|----------|----------|
| API1:2023 – Broken Object Level Authorization | Object ID in the request used without an ownership/tenant check |
| API2:2023 – Broken Authentication | Token/session flaws on the API |
| API3:2023 – Broken Object Property Level Authorization | Mass assignment, excess data in the response |
| API4:2023 – Unrestricted Resource Consumption | Missing pagination/rate limits that enable exhaustion on this handler |
| API5:2023 – Broken Function Level Authorization | User can call an admin/privileged operation |
| API6:2023 – Unrestricted Access to Sensitive Business Flows | Automated abuse of purchase, signup, or transfer flows |
| API7:2023 – Server Side Request Forgery | User-controlled URL fetched by the API |
| API8:2023 – Security Misconfiguration | CORS, debug, default keys on the API |
| API9:2023 – Improper Inventory Management | Deprecated or shadow endpoint left reachable in this diff |
| API10:2023 – Unsafe Consumption of APIs | Trusting a third-party API response without validation |

### Mobile — Mobile Top 10:2024

| Category | Use when |
|----------|----------|
| M1:2024 – Improper Credential Usage | Hardcoded or insecurely handled mobile credentials |
| M2:2024 – Inadequate Supply Chain Security | Untrusted mobile SDK / build pipeline in this diff |
| M3:2024 – Insecure Authentication/Authorization | Mobile authn/authz bypass |
| M4:2024 – Insufficient Input/Output Validation | Injection or unsafe rendering in the mobile client |
| M5:2024 – Insecure Communication | Cleartext or unpinned sensitive traffic |
| M6:2024 – Inadequate Privacy Controls | Unnecessary PII collection/leak on device |
| M7:2024 – Insufficient Binary Protections | Missing tamper/debug protections where the diff weakens them |
| M8:2024 – Security Misconfiguration | Debug flags, exported components, weak ATS/NSAppTransport |
| M9:2024 – Insecure Data Storage | Secrets or PII in plaintext prefs, files, backups |
| M10:2024 – Insufficient Cryptography | Weak or home-grown crypto on device |

Format on the report (one line):

```text
OWASP Category: A03:2021 – Injection
OWASP Category: API1:2023 – Broken Object Level Authorization
OWASP Category: M9:2024 – Insecure Data Storage
```

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
2. Every finding includes **OWASP Category**, **OWASP Risk Rating** URL, and **Severity rationale** (1–2 sentences)
3. Rationale must mention: who can exploit, repo access model, app size/context if known
4. Never rate **Critical** unless matrix yields Critical (typically HIGH likelihood + HIGH impact)
5. Secrets in assigned-dev-only repos are often **Low–Medium**, not automatic Critical — they still **pass the gate** and must be reported
6. If unable to verify production impact (e.g. unknown if production key) → **report anyway** with Low confidence; lower OWASP impact scores; state in rationale — do not skip via exploitability gate
