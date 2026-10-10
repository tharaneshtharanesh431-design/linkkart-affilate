# Phase 1 Security

## Improvements Made
- **Secrets Management:** Removed `gemini.api.key` and database credentials from being potentially hardcoded. They are now cleanly separated into environment variables.
- **Fail-Secure Defaults:** Updated `EmailServiceImpl` and `AiServiceImpl` to throw clear exceptions when secrets are missing, rather than logging success or defaulting to vulnerable placeholder strings.
- **Error Obfuscation:** The new `GlobalExceptionHandler` enforces a consistent API error structure, ensuring no stray Java stack traces or database schema details are leaked to the client during unexpected errors.

## Remaining Security Risks
- JWT Tokens are currently configured as `cookie-secure=false` in the development profile. This must be strictly overridden in production.
- Click attribution uses `ipHash`, which is vulnerable to botnet spoofing.

## Secrets Management Status
- Baseline achieved: No secrets in source code.
- Next step (Future Phase): Integrate a dedicated secret manager like AWS Secrets Manager or HashiCorp Vault.
