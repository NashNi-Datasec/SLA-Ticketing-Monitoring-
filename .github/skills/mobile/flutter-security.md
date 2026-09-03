# Mobile — Flutter

Apply to changed Dart / Flutter files (`*.dart`, `pubspec.yaml`).

Use **OWASP Mobile Top 10:2024** (`Mn:2024`) on these findings.

Produce **candidates only**. **One finding per sink.** File + Line from the changed hunk only.

## Checks

1. **Insecure data storage (M9:2024)** — tokens or PII in `SharedPreferences`, unencrypted Hive/GetStorage, or plaintext files
2. **Insecure communication (M5:2024)** — `http://` Uri, `badCertificateCallback` that accepts all certs, or cleartext in changed Android/iOS config touched by this Flutter app
3. **WebView / deep links (M4:2024)** — `WebView` JavaScript channels or `uni_links` / `app_links` handling untrusted URIs without validation
4. **Insecure authentication (M3:2024)** — session only in preferences with no `flutter_secure_storage` / Keychain in the changed auth path
5. **Hardcoded secrets (M2:2024)** — API keys or signing material in Dart source or `pubspec` / `--dart-define` committed in the diff
6. **Debug / insecure flags** — `android:debuggable`, cleartext, or kDebugMode-gated security bypass left on in release paths in the hunk

## Patterns

```
SharedPreferences|Hive\.|GetStorage
badCertificateCallback|HttpClient
WebView|JavascriptChannel|uni_links|app_links
flutter_secure_storage
apiKey|api_key|sk-live-
```

Platform folders (`android/`, `ios/`) in the same diff use the native modules in this folder as well.
Score via `shared/owasp-risk-rating.md` — never set Critical from the Mobile category name.
