# Risk Register

1. **Scalability Risk:** The synchronous tracking engine cannot handle virality. (CRITICAL)
2. **Financial Risk:** Lack of double-entry ledger means commissions could be duplicated or lost without reconciliation trails. (HIGH)
3. **Operational Risk:** No CI/CD or DB migrations setup. Deployments are manual and dangerous. (HIGH)
4. **Security Risk:** AI Prompts are un-sanitized and could suffer from prompt injection attacks in `AiServiceImpl.java`. (MEDIUM)
5. **Vendor Dependency Risk:** Tightly coupled to Gemini API for core features without robust fallback logic. (MEDIUM)
