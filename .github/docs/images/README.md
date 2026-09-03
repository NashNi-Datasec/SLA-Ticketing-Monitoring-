# Screenshot and video placeholders

The [Product Guide](../product-guide.md) links here. Gray SVG boxes are stand-ins until you add real captures.

## Screenshots

| Guide figure | Placeholder file | Replace with |
|--------------|------------------|--------------|
| Copy into `.github/` | `01-copy-into-dotgithub.svg` | Explorer or VS Code showing `your-app/.github/` after the copy |
| Instructions while coding | `02-instructions-pass.svg` | Copilot Chat after a docs-only edit — Scenario 1 PASS |
| `/dpsa` in VS Code | `03-dpsa-chat.svg` | Copilot Chat; first line `## Digital Product Security Assessment (DPSA)` |
| Agent picker | `04-agent-picker.svg` | Copilot Chat agent dropdown with all four security agents |
| PR DPSA comment | `05-pr-dpsa-comment.svg` | GitHub PR conversation: DPSA comment (PASS TIP or Critical CAUTION) |
| `security-context.md` | `06-security-context.svg` | `.github/security-context.md` open in the app repo |
| Dependabot assess | `07-dependabot-assess.svg` | Chat after `/dependabot-assess` |
| Finding Analyst | `08-finding-analyst.svg` | Chat after pasting one File+Line into DPSA Finding Analyst |

Save real files as **PNG** (same number and name, `.png`). Then change the image path in `docs/product-guide.md` from `.svg` to `.png`.

Do not commit secrets, tokens, or customer PII in screenshots.

## Video

Paste the recording URL in `docs/product-guide.md` where it says `https://REPLACE-ME`. SharePoint, Stream, YouTube, or Loom all work.
