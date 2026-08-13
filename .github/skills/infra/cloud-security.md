# Infra — Cloud Security

Apply to changed cloud/deployment configuration only.

## Checks

1. **Public exposure** — storage buckets, databases, or queues set to public read/write in diff
2. **Overly permissive IAM** — `Action: "*"`, `Resource: "*"`, or `Principal: "*"` on sensitive resources
3. **Security group rules** — `0.0.0.0/0` ingress on admin ports (22, 3389, 5432, 6379, 27017)
4. **Disabled encryption** — encryption at rest or in transit explicitly disabled on data stores
5. **Logging/monitoring disabled** — CloudTrail, audit logs, or WAF removed in changed config
6. **Metadata service exposure** — IMDSv1 enabled or overly broad instance role permissions added

## Patterns

```
"Effect":\s*"Allow".*"Action":\s*"\*"
0\.0\.0\.0/0|::/0
public-read|publicRead|acl\s*=\s*"public"
encrypt.*false|encrypted\s*=\s*false
```

Apply exploitability gate — config change must create realistic exposure path.
