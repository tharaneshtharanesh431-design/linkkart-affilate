# Production Blockers

| ID | Area | Severity | Problem | Evidence | Impact | Future Fix |
| -- | ---- | -------- | ------- | -------- | ------ | ---------- |
| 1 | Database | CRITICAL | Synchronous Click Tracking | `RedirectController.java` inserts to DB immediately | Will exhaust connection pool and crash DB on traffic spikes | Implement async ingestion via Redis/Kafka |
| 2 | Integrations | HIGH | No Actual Payment Gateway | `PayoutServiceImpl.java` just updates string status | Cannot physically pay affiliates | Integrate Stripe Connect / PayPal API |
| 3 | Integrations | HIGH | Mocked Email Provider | `EmailServiceImpl.java` logs to console | Users will not receive critical notifications or auth resets | Configure JavaMailSender |
| 4 | Security | HIGH | Missing Secrets Manager | `AiServiceImpl.java` reads bare `gemini.api.key` | Credentials risk exposure in CI/CD | Use Vault / AWS Secrets Manager |
| 5 | DB | HIGH | Missing Migrations | `application.properties` uses `hibernate.hbm2ddl.auto` | High risk of destructive schema changes on restart | Implement Flyway/Liquibase |
