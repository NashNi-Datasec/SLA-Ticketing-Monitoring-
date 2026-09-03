# Web — Frontend Security

Apply to changed UI/component code only.

## Checks

1. **XSS sinks** — `dangerouslySetInnerHTML`, `innerHTML`, `v-html`, `document.write` with user-controlled or unsanitized data
2. **DOM-based XSS** — `location.hash`, `location.search`, or URL params inserted into DOM without encoding
3. **PostMessage** — `window.addEventListener('message')` without origin validation; overly permissive `postMessage(..., '*')`
4. **Clickjacking** — sensitive actions in iframe-friendly pages when frame-busting removed in diff
5. **Sensitive data in DOM** — PII, tokens, or internal IDs rendered in HTML attributes or hidden fields accessible to scripts
6. **Third-party scripts** — loading external scripts without SRI or integrity checks on security-sensitive pages
7. **CSP bypass** — inline event handlers (`onclick=`) or `javascript:` URLs added when CSP restricts inline scripts
8. **Partial sanitization** — `dangerouslySetInnerHTML` with allowlist sanitizer that misses script/event attributes
9. **DOM clobbering** — named form elements or IDs shadowing security-sensitive globals in changed markup

## Patterns

```
dangerouslySetInnerHTML|innerHTML\s*=|v-html
eval\(|new Function\(
postMessage\(.*\*|addEventListener\(['\"]message
onclick=|javascript:|sanitize|DOMPurify
```

UI/copy/feature-flag inconsistencies are **out of scope** — see `low-noise-rules.md`.

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
Report File + Line from diff only. User input must reach the sink in changed code.
