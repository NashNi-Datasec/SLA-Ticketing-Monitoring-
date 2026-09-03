# Mobile — Android Security

Apply to changed Android/Kotlin/Java code only.

## Checks

1. **Exported components** — activities, services, receivers, providers with `android:exported="true"` without permission guards on sensitive handlers
2. **Insecure WebView** — `setJavaScriptEnabled(true)` with `@JavascriptInterface` exposing native methods to untrusted content
3. **Insecure storage** — passwords, tokens, or PII in SharedPreferences without encryption or in world-readable files
4. **Deep link hijacking** — intent filters accepting broad schemes/hosts without verification of caller or path
5. **Certificate pinning removed** — NetworkSecurityConfig or pinning disabled in diff without documented reason
6. **Backup/debug flags** — `android:allowBackup="true"` or `android:debuggable="true"` on release paths in changed manifest
7. **Hardcoded secrets** — API keys in `strings.xml`, BuildConfig, or source

## Patterns

```
android:exported\s*=\s*["']true
addJavascriptInterface|setJavaScriptEnabled\(true\)
SharedPreferences|MODE_WORLD_READABLE
NetworkSecurityConfig|certificatePinner
```

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
Report File + Line from diff only.
