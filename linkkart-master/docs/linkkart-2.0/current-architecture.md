# Current Architecture

```text
Browser (Next.js)
   ↓ (REST over HTTP)
Spring Boot Web (Controllers)
   ↓
Service Layer (Business Logic)
   ↓
Spring Data JPA (Repositories)
   ↓
MySQL / H2 (Single DB Monolith)
```

**Evaluation:**
- Simple monolithic pattern.
- Synchronous blocking calls throughout (e.g., RedirectController writes to DB inline before HTTP 302).
- Tight coupling between layers.
