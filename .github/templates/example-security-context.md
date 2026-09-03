---
app_name: ExampleApp
app_size: Medium
platform: web
repo_access: assigned_developers_only
estimated_users: 1000
data_classification: internal
production_deployed: false
external_users: false
---

# Example Security Context

**Do not deploy this file as-is.** This is a sample only for authors and training.

Copy [`security-context.md`](security-context.md) to `.github/security-context.md` in your **application** repo and customize values for that app.

Copilot reads `.github/security-context.md` when running `/dpsa` to score business impact and threat agent factors accurately.

## Field Guide

| Field | Values | Used for |
|-------|--------|----------|
| `app_name` | string | Report scope identification |
| `app_size` | Low, Medium, High, Critical | Business impact (FD, RD, NC, PV) |
| `platform` | web, android, ios, multi | Domain context |
| `repo_access` | assigned_developers_only, team, org_wide, public | Opportunity (O), Size (S) |
| `estimated_users` | number or range | Privacy violation (PV), reputation |
| `data_classification` | public, internal, confidential, restricted | Business impact scaling |
| `production_deployed` | true, false | Impact if secrets/config exposed |
| `external_users` | true, false | Threat agent Size (S) — anonymous users vs internal only |

## Notes

Add app-specific context below (optional).
