# LinkKart 2.0 - Phase 3: Authentication & Authorization

## 1. Authentication Audit

### Current Authentication Flow
*   **Method**: JWT (JSON Web Token) with Spring Security.
*   **Endpoints**: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`.
*   **Storage**: Access tokens and Refresh tokens are stored in HTTP-only cookies (`access_token`, `refresh_token`).
*   **Token Rotation**: Refresh tokens are rotated. Upon a successful `/refresh`, the old refresh token is marked as revoked (`revokedAt = LocalDateTime.now()`), and a new access/refresh token pair is generated and sent as cookies.
*   **Security Mechanisms**:
    *   CSRF is enabled (`CookieCsrfTokenRepository.withHttpOnlyFalse()`) for non-auth endpoints.
    *   CORS is configured.
    *   `JwtAuthenticationFilter` intercepts requests and sets the `SecurityContext` based on the valid `access_token`.
*   **MFA/OAuth**: Neither Multi-Factor Authentication (MFA) nor OAuth (Google/GitHub/etc.) are currently implemented in the codebase.
*   **Vulnerabilities/Improvements Needed**:
    *   Refresh tokens (`token_id` which is a UUID) are stored as plaintext in the database (`refresh_tokens.token_id`). If the database is compromised, these tokens could potentially be reused if they haven't expired/revoked. We should hash the refresh tokens in the database.
    *   Need to implement strict token revocation (e.g. revoking all tokens when password changes, which doesn't exist yet, but for future-proofing).

## 2. Authorization Model

### Platform Level Authorization (RBAC)
*   Controlled by the `User.role` (e.g., `ROLE_PLATFORM_ADMIN`, `ROLE_MERCHANT`, `ROLE_AFFILIATE`).
*   This determines what broad APIs a user can hit.

### Organization Level Authorization (Tenant Isolation)
*   The primary authorization mechanism for B2B SaaS.
*   **Authoritative Resolution**: A user's access to an Organization is determined STRICTLY by the `organization_members` table linking `User` and `Organization`.
*   The `organizationId` passed from the frontend (e.g., in a request body or URL path) MUST NEVER be trusted for authorization. 
*   **Data Access**: When a `MERCHANT` attempts to modify a `Campaign`, the system must query `OrganizationMemberRepository` to find the user's organization, then verify the `Campaign` belongs to that organization.

## 3. Centralized Authorization Logic

We will introduce a centralized `@Component` (e.g., `SecurityService` or methods on the existing domain services) that enforces these tenant checks consistently, rather than relying on disparate checks across multiple controllers/services.
