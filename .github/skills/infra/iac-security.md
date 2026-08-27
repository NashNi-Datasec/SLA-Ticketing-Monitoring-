# Infra — IaC Security

Apply to changed Terraform, CloudFormation, Helm, or K8s manifests.

## Checks

1. **Hardcoded secrets in IaC** — passwords, keys, or tokens in `.tf`, `.yaml`, or template files (use secret managers/refs)
2. **State file exposure** — backend config pointing to public or unencrypted state storage
3. **Privileged containers** — `privileged: true`, `runAsUser: 0`, or host namespace mounts added in diff
4. **Wildcard RBAC** — ClusterRole/RoleBinding granting `*` verbs on `*` resources
5. **Insecure defaults** — `hostNetwork: true`, `hostPID: true`, or service type LoadBalancer on internal-only services without auth
6. **Supply chain** — unpinned image tags (`:latest`) on production paths when combined with public registry pull

## Patterns

```
password\s*=|secret\s*=|api_key\s*
privileged:\s*true|runAsUser:\s*0
verbs:\s*\[?\s*["']\*["']
image:.*:latest
```

Report File + Line from diff. Theoretical misconfigurations outside changed lines → skip.

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
