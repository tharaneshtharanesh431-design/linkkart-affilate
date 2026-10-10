# Phase 1 Changes

## Configuration Changes
- Created `application-dev.properties` and `application-prod.properties` to properly separate environment contexts.
- Rewrote `application.properties` to source credentials from environment variables (`${DATABASE_PASSWORD}`, `${JWT_SECRET}`, `${GEMINI_API_KEY}`).
- Added `.env.example` in `linkkart-backend`.

## Dependency Changes
- Added `flyway-core` and `flyway-mysql` to `pom.xml` to manage database schema explicitly rather than using Hibernate `ddl-auto`.

## Architecture Changes
- Created Docker configurations (`docker-compose.yml`, `Dockerfile` for frontend and backend) to ensure reproducible local development environments.
- Updated `GlobalExceptionHandler.java` to enforce a standardized API error format (`timestamp`, `status`, `error`, `message`, `path`).

## Files Changed
- `linkkart-backend/pom.xml`
- `linkkart-backend/src/main/resources/application.properties`
- `linkkart-backend/src/main/java/com/kart/exception/GlobalExceptionHandler.java`
- `linkkart-backend/src/main/java/com/kart/serviceImpl/AiServiceImpl.java`
- `linkkart-backend/src/main/java/com/kart/serviceImpl/EmailServiceImpl.java`

## Files Added
- `linkkart-backend/src/main/resources/application-dev.properties`
- `linkkart-backend/src/main/resources/application-prod.properties`
- `linkkart-backend/src/main/resources/db/migration/V1__initial_schema.sql`
- `linkkart-backend/.env.example`
- `docker-compose.yml`
- `linkkart-backend/Dockerfile`
- `linkkart-frontend/Dockerfile`

## Files Removed
- `linkkart-backend/target/` (Build output cleared)
- `linkkart-backend/src/main/resources/schema.sql` (Moved to Flyway)
