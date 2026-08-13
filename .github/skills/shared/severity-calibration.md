# Severity Calibration

| Finding | Typical Severity |
|---------|-----------------|
| Hardcoded production secret | Critical |
| SQL/command injection in changed code | Critical – High |
| Auth bypass on new endpoint | Critical |
| IDOR on sensitive data | High |
| Mass assignment (role/admin field) | Critical – High |
| Client-trusted price/total/role | High – Critical |
| Verbose errors in production path | Medium |
| Missing validation without dangerous sink | Low or skip |
| UI copy / feature-flag inconsistency | **Out of scope — do not report** |

## Confidence Levels

- **High** — directly observable exploitable issue in the diff
- **Medium** — likely issue with partial supporting evidence
- **Low** — suspicious pattern requiring manual verification

Include **Confidence** on every finding. If confidence is Low, recommend manual verification.

When uncertain on severity, assign lower severity or skip.
