# Target Architecture (LinkKart 2.0)

```text
Browser / API Clients
   ↓ (HTTPS, CDN, WAF)
API Gateway (Rate Limiting, Routing)
   ↓
Modular Monolith / Microservices
  ├─ Auth & IAM (Tenant Isolation, RBAC)
  ├─ Tracking Engine (Async Ingestion via Kafka/Redis)
  ├─ Ledger & Finance (Double-entry accounting, Payout integration)
  └─ Operations & Analytics (Pre-aggregated material views)
   ↓
Event Bus (Kafka)
   ↓
PostgreSQL (Transactional) + Redis (Cache/Rate Limiter) + ClickHouse/BigQuery (Analytics)
```
