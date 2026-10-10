# PHASE 8 NOTIFICATION & EMAIL AUDIT

## 1. Executive Summary
The Phase 8 audit verifies the existing notification and email systems in LinkKart. Notifications are currently persisted in the database with basic in-app functionality (create, list, mark read), but there is zero email delivery capability or notification preference configuration. The `EmailService` acts as a fail-fast placeholder that intentionally throws `UnsupportedOperationException`. Furthermore, critical communication features like password reset and email verification are completely missing from the application.

## 2. Existing Notification Architecture
- **In-App:** Persisted in the MySQL database via `NotificationRepository`.
- **Triggering:** Synchronous creation inside core business logic (`PayoutServiceImpl`, `CommissionServiceImpl`).
- **Email:** The `EmailServiceImpl` is incomplete and throws exceptions to prevent fake success states.

## 3. Notification Entity Analysis
**Entity:** `Notification`
- `id` (Long, PK)
- `user` (User, tenant-aware, immutable)
- `type` (NotificationType enum, immutable)
- `title` (String, immutable)
- `message` (String, immutable)
- `referenceType` (String, immutable)
- `referenceId` (Long, immutable)
- `isRead` (Boolean, mutable)
- `createdAt` (LocalDateTime, immutable)
- `readAt` (LocalDateTime, mutable)

*Missing:* Delivery channel, delivery status, severity.

## 4. Notification Types
Based on `NotificationType` enum:
- **Financial:** `COMMISSION_PENDING`, `COMMISSION_APPROVED`, `COMMISSION_REJECTED`, `COMMISSION_REVERSED`, `PAYOUT_REQUESTED`, `PAYOUT_PROCESSING`, `PAYOUT_PAID`, `PAYOUT_REJECTED`, `PAYOUT_FAILED` (Verified partially implemented)
- **Entities:** `PRODUCT_APPROVED`, `PRODUCT_REJECTED`, `CAMPAIGN_APPROVED`, `CAMPAIGN_REJECTED` (Verified partially implemented)
- **Affiliate:** `AFFILIATE_APPLICATION`, `AFFILIATE_APPROVED`, `AFFILIATE_REJECTED` (Not currently implemented)
- **System:** `SECURITY`, `SYSTEM` (Not currently implemented)

*Missing:* Password reset, org invitation, email verification.

## 5. Existing Business Event → Notification Flow
Notifications are manually triggered within service methods.
For example, in `PayoutServiceImpl`, `notificationService.createNotificationIfNotExists` is invoked inline with state changes. This couples business logic directly with notification generation.

## 6. Email System Analysis
- `EmailService` interface and `EmailServiceImpl` exist.
- It consumes `spring.mail.*` properties.
- It currently throws `UnsupportedOperationException` when invoked, verifying that the system does not silently mock email success.
- Email sending is completely absent.

## 7. Authentication Email Analysis
- Email Verification: **NOT CURRENTLY IMPLEMENTED**
- Password Reset: **NOT CURRENTLY IMPLEMENTED**
- Login Alerts / MFA: **NOT CURRENTLY IMPLEMENTED**
*There are no endpoints or logic in `AuthController` for these flows.*

## 8. Email Provider Analysis
There is no external provider integrated. A provider adapter architecture (similar to `PaymentProvider`) will be required to abstract the underlying email vendor (e.g., Resend, SendGrid, Amazon SES) away from the business logic.

## 9. Notification Delivery Model
- **In-App:** Yes.
- **Email:** No.
- **Other (SMS/Push):** No.

## 10. Notification Preferences
There is no `notification_preferences` table or entity. Users cannot opt-in or opt-out of notifications. All triggered events currently result in a mandatory in-app notification.

## 11. Read/Unread System
Fully supported. The `Notification` entity tracks `isRead` and `readAt`. The backend and frontend correctly handle marking as read, marking all as read, and unread counts.

## 12. Notification APIs
- `GET /api/notifications` (Paginated)
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/{id}/read`
- `PATCH /api/notifications/read-all`
- `DELETE /api/notifications/{id}`

## 13. Frontend Notification Experience
The frontend notification experience is verified and robust:
- Uses `useNotifications` React Query hook.
- Implements `NotificationDropdown` in the header with a red unread badge.
- Implements `NotificationsPage` (`/dashboard/notifications`) with pagination.
- Handles empty, loading, and interactive states gracefully using Lucide `Bell` icons.

## 14. Email Template System
There is no template system (no Thymeleaf or FreeMarker). `EmailServiceImpl` uses hard-coded `String.format()` plain-text strings.

## 15. Email Security
Since emails are currently plain-text and disabled, there is no immediate HTML injection risk. However, password reset tokens and verification tokens must be securely generated, hashed, and safely embedded when implemented.

## 16. Email Idempotency
The system leverages `notificationService.createNotificationIfNotExists()` to prevent duplicate DB notifications for the same reference ID. However, there is no idempotency mechanism for outbound email delivery.

## 17. Email Failure & Retry
No failure handling or retry logic exists. `EmailServiceImpl` currently throws an exception, meaning any integration right now would fatally crash the executing thread.

## 18. Transaction Boundary Analysis
**CRITICAL FINDING:** `NotificationServiceImpl.createNotification` is annotated with `@Transactional`, meaning it joins the caller's transaction (e.g., `PayoutServiceImpl.processPayout`).
If a synchronous email call were added to this method and the email provider timed out, the exception would cause the entire **financial transaction to roll back**.

## 19. Tenant Isolation
Tenant isolation is secure. `NotificationServiceImpl` fetches the `currentUser` via `SecurityContextHolder` and restricts all repository queries (`findByUserOrderByCreatedAtDesc`, `countByUserAndIsReadFalse`) to that user.

## 20. Rate Limiting
No rate limiting is applied to notification endpoints. Since password reset does not exist, rate limiting for auth emails is absent.

## 21. Database Analysis
The `notifications` table exists, but there is a discrepancy. `V1__initial_schema.sql` defines:
`id, user_id, message, is_read, created_at`
However, the `Notification.java` entity expects `type, title, reference_type, reference_id, read_at`.
Since the application compiles and runs tests, either a missing migration file exists outside the audited scope, or Hibernate auto-DDL (`spring.jpa.hibernate.ddl-auto`) is actively mutating the schema.

## 22. Existing Test Coverage
- `NotificationServiceImplTest`: Contains 9 tests validating CRUD operations and tenant isolation.
- Missing: Transaction boundary testing, email failure resilience testing.

## 23. Recommended Phase 8 Architecture
To protect financial transactions while utilizing the existing modular monolith:
1. **Domain Events:** Core services publish Spring `ApplicationEvent` (e.g., `PayoutPaidEvent`).
2. **Transactional Event Listener:** An `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)` listens for the event.
3. **Async Dispatch:** The listener handles the event `@Async` to create the DB notification and dispatch the email without blocking or risking the core business transaction.

## 24. Recommended Email Provider Strategy
Adopt an `EmailProvider` interface. Use JavaMailSender (SMTP) for development/testing, and build a provider adapter for a modern transactional email service (e.g., Resend or SendGrid) for production.

## 25. Required Database Changes
- Validate/Align the `notifications` table schema with Flyway.
- Create `email_delivery_logs` table (for tracking bounces/failures).
- Create `notification_preferences` table.
- Create `password_reset_tokens` table.

## 26. Required API Changes
- Add endpoints for updating notification preferences.
- Add endpoints for `/auth/forgot-password` and `/auth/reset-password`.

## 27. Required Frontend Changes
- Build Notification Settings page.
- Build Forgot Password / Reset Password screens in the authentication flow.

## 28. Required Security Controls
- Rate limiting on `/auth/forgot-password`.
- Cryptographically secure token generation for password resets.
- Short-lived token expiration (e.g., 15 minutes).

## 29. Required Test Plan
- Unit test event publication.
- Integration test `@TransactionalEventListener` behavior.
- Test password reset token lifecycle.

## 30. Risks / Open Questions
- Schema desync: The difference between V1 and the JPA entity needs to be explicitly resolved in Flyway.
- Can we safely decouple all existing manual `createNotification` calls to Spring Events without losing context?

## 31. Phase 8 Implementation Plan
1. **Schema Fix:** Create a Flyway migration ensuring `notifications` matches the JPA entity perfectly.
2. **Event System:** Implement Spring application events for critical triggers.
3. **Email Subsystem:** Implement Thymeleaf templates and `EmailProvider` adapters.
4. **Auth Communication:** Implement password reset and email verification.
5. **Preferences:** Implement DB and APIs for notification preferences.

---

### PHASE 8 AUDIT STATUS

* Audit completed: YES
* Files inspected: 15
* Notification entities inspected: 2
* Notification services inspected: 1
* Notification controllers inspected: 1
* Email services inspected: 1
* Email templates inspected: 0 (None exist)
* Notification APIs found: 5
* Email provider integrations found: 0
* Webhook/communication integrations found: 0
* Database tables inspected: 1 (notifications)
* Existing notification/email tests: 9
* Security findings: 1 (missing password reset/verification)
* Critical findings: 1 (Transaction boundary risk with synchronous notifications)
* Missing capabilities: 3 (Email delivery, Notification preferences, Authentication flows)
* Recommended architecture changes: 2 (Spring Events, Async dispatch)
