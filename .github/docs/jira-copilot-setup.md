# Jira Copilot Setup

Configure Atlassian MCP in VS Code so GitHub Copilot can fetch Jira issues and (with your confirmation) post security advisory comments.

**Used by:** `/jira-security-advisory` and Security Advisor agent when a Jira issue key is provided.

**Prerequisites:**

- VS Code 1.99+ with MCP support
- GitHub Copilot extension — signed in
- Jira account with read access to target issues; comment permission if posting notes

**Credentials never go in this repo** — authenticate via VS Code MCP or user-level settings only.

---

## Choose Your Jira Deployment

| Deployment | Recommended MCP | Authentication |
|------------|-----------------|----------------|
| **Jira Cloud** | Official [Atlassian MCP](https://marketplace.visualstudio.com/items?itemName=SethFord.atlassian-mcp-server) or VS Code MCP directory | OAuth via VS Code, or [API token](https://support.atlassian.com/atlassian-rovo-mcp-server/docs/configuring-authentication-via-api-token/) if org admin enabled |
| **Jira Data Center / Server** | [Atlassian Private MCP Server](https://marketplace.visualstudio.com/items?itemName=bhayanak.atlassian-vscode-extension) | Personal Access Token (PAT) in **user** VS Code settings |

Org admins may need to enable Atlassian MCP or API tokens: [Control Atlassian Rovo MCP settings](https://support.atlassian.com/security-and-access-policies/docs/control-atlassian-rovo-mcp-server-settings/).

---

## Jira Cloud — OAuth Setup

1. Open VS Code **MCP Servers** panel (or Command Palette → MCP)
2. Add **Atlassian** from the MCP directory, or install the [Atlassian MCP extension](https://marketplace.visualstudio.com/items?itemName=SethFord.atlassian-mcp-server)
3. Start the server and complete OAuth in the browser when prompted
4. Verify tools appear in Copilot Chat → **Tools** (e.g. get issue, add comment)
5. Reload VS Code if tools do not appear: `Ctrl+Shift+P` → Developer: Reload Window

**Example workspace config** (no secrets): copy [templates/mcp-atlassian.example.json](../templates/mcp-atlassian.example.json) to `.vscode/mcp.json` in your app repo and adjust — use OAuth flow rather than embedding tokens when possible.

Official endpoint (if configuring manually):

```json
{
  "servers": {
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/mcp"
    }
  }
}
```

Use the auth endpoint your MCP extension documents if OAuth fails on the default URL.

---

## Jira Cloud — API Token (optional)

If your organization enables API token auth for Atlassian MCP:

1. Follow [Atlassian: Configuring authentication via API token](https://support.atlassian.com/atlassian-rovo-mcp-server/docs/configuring-authentication-via-api-token/)
2. Store the token in VS Code secret storage or MCP config as documented by your admin — **not** in git
3. Use a dedicated service account with least privilege (read issues; comment only if posting)

---

## Jira Data Center / Server — PAT Setup

1. Install [Atlassian Private MCP Server](https://marketplace.visualstudio.com/items?itemName=bhayanak.atlassian-vscode-extension)
2. In VS Code **user** settings (not workspace — avoid committing secrets):

   | Setting | Value |
   |---------|-------|
   | `jiraBaseUrl` | `https://jira.your-company.com` |
   | `jiraAuthType` | `pat` |
   | `jiraPat` | Your Personal Access Token |

3. Start the MCP server from the MCP Servers panel
4. Confirm Jira tools appear in Copilot Chat → Tools

For self-signed TLS, see extension docs for `tlsRejectUnauthorized`.

---

## Copy Skills to App Repo

Jira integration is markdown-only in `.github/skills/`:

```
your-app/.github/skills/
  jira-security-advisory/
    SKILL.md
    jira-workflow.md
  shared/
    jira-integration-safety.md
    ... (full shared tree)
```

Copy the entire `skills/` tree from this repo — see [vscode-setup.md](vscode-setup.md).

---

## Test the Integration

### Test 1: Fetch

In Copilot Chat:

```
/jira-security-advisory YOUR-TEST-123
```

**Pass:**

- Reply starts with `## Jira Security Advisory`
- Issue summary matches Jira (or paste fallback if MCP unavailable)
- Ends with: `Post this note as a comment on YOUR-TEST-123? Reply yes to confirm or no to skip.`

**Fail:** Narration before report; auto-post without asking

### Test 2: Confirm post

After the report, reply: `yes`

**Pass:** One-line success (`Posted security note to YOUR-TEST-123.`) and comment visible in Jira

**Fail:** Posted without confirmation; full report repeated

### Test 3: No post

Run advisory again; reply `no`

**Pass:** No new Jira comment

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| MCP tools not visible | Reload VS Code; restart MCP server; confirm Copilot signed in |
| OAuth popup blocked | Allow popups for VS Code; retry auth URL from MCP output |
| "Authentication failed" | Reconnect MCP; check org MCP policy; use paste fallback |
| Issue not found | Verify key and project access; paste ticket text manually |
| Post permission denied | Jira role needs Add Comments; use manual paste of Suggested Security Note |
| Tool names differ | Check Copilot Tools list; skill uses closest get-issue / add-comment tool |

Known OAuth issues: [Atlassian MCP GitHub issues](https://github.com/atlassian/atlassian-mcp-server/issues)

---

## Security Notes

- Use a least-privilege Jira account for MCP
- Rotate PATs and API tokens on schedule
- Never commit `.vscode/mcp.json` with embedded secrets — add to `.gitignore` if tokens are used
- Review **Suggested Security Note** content before replying `yes` to post
- Redact secrets from ticket descriptions in chat output (skill enforces this)

---

## Related

- Skill: [`skills/jira-security-advisory/SKILL.md`](../skills/jira-security-advisory/SKILL.md)
- Safety: [`skills/shared/jira-integration-safety.md`](../skills/shared/jira-integration-safety.md)
- Agent: [`agents/security-advisor.agent.md`](../agents/security-advisor.agent.md)
