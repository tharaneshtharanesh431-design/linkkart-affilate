# Technical Debt

1. **Synchronous Clicks:** `RedirectController.java` blocks the request thread to write to the DB. Consequence: App crash under load.
2. **Mock Services:** `EmailServiceImpl.java` is a logger. Consequence: Broken user flows.
3. **Dummy Data in Tests:** `PayoutServiceImplTest` generates dummy entities rather than mocking the repository strictly or using test containers. Consequence: Unreliable testing.
4. **Lack of Tenant Isolation:** Missing `tenant_id` means global queries must explicitly filter by `merchant_id`, risking cross-tenant data exposure if omitted.
5. **Analytics Query Load:** Dashboard uses on-the-fly SQL SUMs across millions of rows (`AnalyticsController`). Consequence: DB CPU spikes.
