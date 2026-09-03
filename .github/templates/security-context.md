---
app_name: ExampleApp
app_size: Low
platform: web
repo_access: assigned_developers_only
estimated_users: 500
data_classification: internal
production_deployed: false
external_users: false
uses_llm: false
llm_external_provider: false
llm_handles_pii: false
---

# Security Context

Optional per-app context for OWASP severity scoring. Copy this file to `.github/security-context.md` in your app repo and customize.

Copilot reads this file when running `/dpsa` to score business impact and threat agent factors accurately.

## Field Guide

| Field | Values | Used for |
|-------|--------|----------|
| `app_name` | string | Report scope identification |
| `app_size` | Low, Medium, High, Critical | Business impact (FD, RD, NC, PV) |
| `platform` | web, android, ios, multi | Domain context; hint for OWASP Category catalog (Web / API / Mobile). The **changed file** still wins. |
| `repo_access` | assigned_developers_only, team, org_wide, public | Opportunity (O), Size (S) |
| `estimated_users` | number or range | Privacy violation (PV), reputation |
| `data_classification` | public, internal, confidential, restricted | Business impact scaling |
| `production_deployed` | true, false | Impact if secrets/config exposed |
| `external_users` | true, false | Threat agent Size (S) — anonymous users vs internal only |
| `uses_llm` | true, false | Scope identification for LLM-related findings |
| `llm_external_provider` | true, false | Whether app calls external model APIs (OpenAI, Anthropic, etc.) |
| `llm_handles_pii` | true, false | Increases PV/LC when findings involve prompt logging or data sent to models |

## Notes

Add app-specific context below (optional):

- Payment or billing data handled: no
- SOC2 / compliance scope: no
- Known exceptions: