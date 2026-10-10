# Phase 1 Migration Strategy

## Migration Strategy
We have transitioned from Hibernate `ddl-auto` to **Flyway** to ensure deterministic and version-controlled schema management across environments.

## Migration Files
- `src/main/resources/db/migration/V1__initial_schema.sql`: Contains the baseline database schema based on the existing `schema.sql` file.

## Database Validation Results
- Hibernate is now set to `validate` in all profiles to ensure the JPA entities exactly match the Flyway-managed schema.
- Automatic destructive updates (`create`, `update`, `create-drop`) are strictly disabled.
