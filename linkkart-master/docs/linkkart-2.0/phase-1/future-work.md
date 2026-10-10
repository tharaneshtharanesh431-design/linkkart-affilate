# Deferred Phase 2+ Work (Future Work)

| Issue | Reason | Affected Module | Future Phase |
|-------|--------|-----------------|--------------|
| Missing `tenant_id` on core tables | Required for true B2B isolation, but out of scope for Phase 1 cleanup. | Database Schema | Phase 2 |
| Synchronous Click Ingestion | `RedirectController` writes straight to DB. Needs Kafka/Redis for high throughput. | `RedirectController`, Tracking Engine | Phase 3 |
| Double-entry accounting missing | Commissions lack proper financial reconciliation ledgers. | `CommissionService` | Phase 6 |
| Payout Provider Integration | Payouts only update DB strings, do not transfer actual money. | `PayoutService` | Phase 7 |
| Enterprise SSO / OAuth | Currently using basic JWT with email/password. Needs SAML/OAuth. | `AuthService` | Phase 3 |
| Advanced Fraud Detection | `ipHash` is too basic. Needs comprehensive device fingerprinting. | `FraudDetectionService` | Phase 9 |
