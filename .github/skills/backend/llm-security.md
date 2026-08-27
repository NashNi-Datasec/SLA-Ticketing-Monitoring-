# Backend — LLM Security

Apply to changed LLM, agent, RAG, or embedding code only.

## Checks

1. **Prompt injection** — user or retrieved content concatenated into system prompts without role separation; user-controlled fields overwriting system instructions
2. **Indirect injection (RAG)** — untrusted document, HTML, email, or web content injected into context without sanitization or source allowlist
3. **Insecure output handling** — LLM output passed to SQL, shell, `eval`, file write, SSRF fetch, or HTML render without validation
4. **Tool/function calling abuse** — tools callable without authz; dynamic tool lists from user input; destructive tools (delete, email, code exec) without allowlist
5. **Excessive agency** — autonomous agent loops/chains executing destructive actions without human confirmation in changed code
6. **Sensitive data disclosure** — PII, secrets, or tokens embedded in prompts; full prompt/response logged in debug; external model calls without redaction
7. **Model DoS / cost abuse** — new LLM endpoints without rate limits, token caps, or timeout in changed handler
8. **Supply chain (code-visible)** — hardcoded model API keys; model name or endpoint taken from user input without validation

## Patterns

```
system_prompt.*\+|f".*\{.*user|messages\.append\(.*role.*system
tool_call|function_call|bind_tools|execute_tool|ToolNode
openai\.|anthropic\.|ChatCompletion|embeddings\.create
vector\.(query|search|retrieve)|similarity_search|as_retriever
logger\.(debug|info)\(.*prompt|console\.log\(.*messages
model\s*[:=].*req\.|endpoint\s*[:=].*params\.
```

Report only when changed code introduces or worsens LLM risk. Existing safe patterns outside diff → skip.

Produce **candidates only** — orchestrator applies exploitability gate and OWASP scoring.
Score severity via `shared/owasp-risk-rating.md` — never hardcode Critical.
When `llm_handles_pii: true` in security-context, increase PV/LC for prompt logging or external model data exposure.
Report File + Line from diff only.
