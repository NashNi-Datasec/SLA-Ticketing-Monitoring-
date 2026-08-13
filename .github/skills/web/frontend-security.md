# Web — Frontend Security

Apply to changed UI/component code only.

## Checks

1. **XSS sinks** — `dangerouslySetInnerHTML`, `innerHTML`, `v-html`, `document.write` with user-controlled or unsanitized data
2. **DOM-based XSS** — `location.hash`, `location.search`, or URL params inserted into DOM without encoding
3. **PostMessage** — `window.addEventListener('message')` without origin validation; overly permissive `postMessage(..., '*')`
4. **Clickjacking** — sensitive actions in iframe-friendly pages when frame-busting removed in diff
5. **Sensitive data in DOM** — PII, tokens, or internal IDs rendered in HTML attributes or hidden fields accessible to scripts
6. **Third-party scripts** — loading external scripts without SRI or integrity checks on security-sensitive pages

## Patterns

```
dangerouslySetInnerHTML|innerHTML\s*=|v-html
eval\(|new Function\(
postMessage\(.*\*|addEventListener\(['\"]message
```

UI/copy/feature-flag inconsistencies are **out of scope** — see `low-noise-rules.md`.

Apply exploitability gate — user input must reach the sink in changed code.
