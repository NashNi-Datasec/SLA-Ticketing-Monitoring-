# Severity Calibration

Severity is determined **exclusively** via [`owasp-risk-rating.md`](owasp-risk-rating.md). Do not use fixed severity by finding type.

---

## Report Severity Labels

Map OWASP overall severity to report sections:

| OWASP overall | Report section | Action |
|---------------|----------------|--------|
| Note | — | Do not report |
| Low | Medium / Low | Include finding |
| Medium | Medium / Low or Critical / High | Include finding |
| High | Critical / High | Include finding |
| Critical | Critical / High | Include finding |

**Findings counts** in report header: Critical N | High N | Medium N | Low N

---

## Required Finding Fields

Every reported finding must include:

- **Severity** — from OWASP matrix (Low, Medium, High, Critical)
- **OWASP Category** — one item from Web Top 10:2021, API Top 10:2023, or Mobile Top 10:2024 (see `owasp-risk-rating.md`)
- **OWASP Risk Rating** — calculator URL with vector
- **Severity rationale** — 1–2 sentences (app size, repo access, who can exploit)
- **Confidence** — orthogonal to severity (evidence quality)

---

## Confidence Levels

- **High** — issue is directly observable in the diff (File + Line, visible sink/flow). **Only High is reported.**
- **Medium** — likely issue, partial evidence. **Do not report.**
- **Low** — suspicious pattern. **Do not report.**

If you cannot mark Confidence **High**, skip the candidate.

---

## Rules

- Never auto-assign Critical from finding type (secrets, injection, etc.)
- When uncertain on factor scores, score lower and explain in rationale
- When uncertain whether it is a true finding, **skip** (do not report Low/Medium confidence)
- UI/copy/feature-flag issues remain **out of scope** — do not report regardless of severity
