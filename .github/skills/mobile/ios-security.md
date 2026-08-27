# Mobile — iOS Security

Apply to changed iOS/Swift/Objective-C code only.

## Checks

1. **Insecure storage** — tokens, credentials, or PII in UserDefaults, plist files, or unencrypted Keychain misuse
2. **WKWebView / UIWebView bridges** — JavaScript message handlers exposing native APIs to untrusted web content
3. **Deep link / universal link validation** — URL schemes or associated domains handled without origin/path verification
4. **ATS disabled** — `NSAllowsArbitraryLoads` or exception domains added in changed Info.plist
5. **Pasteboard exposure** — sensitive data copied to general pasteboard without expiration or local-only scope
6. **Hardcoded secrets** — API keys in source, Info.plist, or xcconfig committed in diff
7. **Jailbreak/debug bypass** — security checks removed or stubbed in changed code

## Patterns

```
UserDefaults\.(standard|set)
WKScriptMessageHandler|evaluateJavaScript
NSAllowsArbitraryLoads|NSExceptionDomains
UIPasteboard\.general
```

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
Report File + Line from diff only.

React Native shared patterns may appear in `App.tsx` — also check web modules if selected.