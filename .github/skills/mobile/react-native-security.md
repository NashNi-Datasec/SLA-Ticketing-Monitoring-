# Mobile — React Native / Expo

Apply to changed React Native, Expo, or `.native.` / `.ios.` / `.android.` JS/TS files.

Use **OWASP Mobile Top 10:2024** (`Mn:2024`) on these findings.

Produce **candidates only**. **One finding per sink.** File + Line from the changed hunk only.

## Checks

1. **Insecure data storage (M9:2024)** — tokens, session, or PII in `AsyncStorage`, unencrypted `MMKV`, or plaintext files
2. **Insecure communication (M5:2024)** — `http://` API URLs, TLS verification disabled, or `usesCleartextTraffic` in changed RN/Expo config
3. **Insufficient input/output validation (M4:2024)** — `WebView` `originWhitelist={'*'}` or `injectedJavaScript` with untrusted input; `Linking.openURL` of attacker-controlled URLs
4. **Insecure authentication (M3:2024)** — auth token only in JS memory / AsyncStorage with no Keychain/Keystore in the changed auth path
5. **Security misconfiguration (M2:2024)** — Expo/RN debug, `expo.extra` secrets, or `app.json` / `app.config` secrets in the diff
6. **Deep links** — `Linking` / intent filters accepting wide schemes without validating path or token

## Patterns

```
AsyncStorage|MMKV
http://|usesCleartextTraffic
WebView|originWhitelist|injectedJavaScript
Linking\.openURL|Linking\.addEventListener
expo\.extra|EXPO_PUBLIC_
```

Native iOS/Android files in the same diff → also load `ios-security.md` / `android-security.md` (same `mobile/` folder).
Score via `shared/owasp-risk-rating.md` — never set Critical from the Mobile category name.
