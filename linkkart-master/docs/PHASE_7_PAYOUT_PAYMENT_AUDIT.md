# LINKKART 2.0 — PHASE 7 PAYOUT & PAYMENT AUDIT

## 1. Executive Summary

A comprehensive, read-only architectural audit of the Phase 6 Payout System has been conducted to prepare for Phase 7 (Payment Integration).
The internal financial ledger established in Phase 6 is robust, enforcing strict consistency and immutability.
However, the application currently lacks any external payment provider integration, payment destination models (Bank/UPI details), and webhook infrastructure. The current payout system functions exclusively as an internal ledger state machine manually operated by Admins.

## 2. Existing Payout Architecture

The current architecture is a modular monolith (Spring Boot + Next.js).
**Key Entities:**
* `Payout`: Tracks withdrawal requests (amount, status, requested/processed times).
* `LedgerTransaction`: The append-only financial source of truth.
* `AffiliateProfile`: Stores the affiliate's `paymentEmail`.

**Key Services:**
* `PayoutServiceImpl`: Manages the business flow of requesting, processing, paying, rejecting, and failing payouts.
* `AffiliateBalanceServiceImpl`: Computes real-time balances directly from `LedgerTransaction`s.

**Controllers:**
* `PayoutController`: Affiliate endpoints for requesting payouts and viewing balance.
* `AdminPayoutController`: Admin endpoints for reviewing and managing payout states.

## 3. Payout State Machine

The current system has a manual 5-state machine:

1. `REQUESTED`: Initiated by Affiliate.
2. `PROCESSING`: Initiated by Admin (moves from Requested).
3. `PAID`: Initiated by Admin (moves from Processing).
4. `REJECTED`: Initiated by Admin (moves from Requested, requires a reason).
5. `FAILED`: Initiated by Admin (moves from Processing, requires a reason).

*Note: There is no `CANCELLED` state for affiliates to revoke a requested payout.*

## 4. Payout → Ledger Relationship

State transitions strongly enforce financial integrity:
* **Requested**: Triggers `ledgerService.reservePayout()` -> Records a `PAYOUT_RESERVED` (DEBIT). This reduces available balance.
* **Processing**: No ledger impact (purely operational state).
* **Paid**: Triggers `ledgerService.recordPayoutPaid()` -> Records a `PAYOUT_PAID` (NEUTRAL). Moves the reserved funds to completed status.
* **Rejected**: Triggers `ledgerService.releasePayout()` -> Records a `PAYOUT_RELEASED` (CREDIT). Returns funds to available balance.
* **Failed**: Triggers `ledgerService.releasePayout()` -> Records a `PAYOUT_RELEASED` (CREDIT). Returns funds to available balance.

## 5. Balance & Reservation Flow

Available balance is purely derived from the Ledger:
`SUM(CREDIT) - SUM(DEBIT) = Available Balance`
When a payout is requested, a DEBIT is instantly inserted. If the payout fails, a CREDIT is inserted.
This architecture is structurally sound and effectively prevents double-spending.

## 6. Payout Eligibility

* **Minimum Payout Amount**: VERIFIED (`app.payout.minimum-amount` defaulting to 50.00).
* **Maximum Payout Amount**: NOT CURRENTLY IMPLEMENTED.
* **Account Age Limits**: NOT CURRENTLY IMPLEMENTED.
* **Fraud Checks**: VERIFIED (`fraudDetectionService.evaluatePayoutRequest` is called).
* **KYC / Verification**: NOT CURRENTLY IMPLEMENTED.
* **Payout Frequency/Cooldown**: NOT CURRENTLY IMPLEMENTED.
* **Payment Destination Setup**: NOT CURRENTLY IMPLEMENTED.

## 7. Payment Destination

`NOT CURRENTLY IMPLEMENTED` (Strictly speaking).
The `AffiliateProfile` entity contains a basic `paymentEmail` column.
There are no tables or encrypted vaults for Bank Accounts, IFSC codes, Routing Numbers, or UPI IDs.

## 8. Existing Payment Provider Integration

`NOT CURRENTLY IMPLEMENTED`
The codebase does not contain SDKs, secrets, or integration logic for Stripe, Razorpay, PayPal, Cashfree, or Adyen.

## 9. Webhook Infrastructure

`NOT CURRENTLY IMPLEMENTED`
There are no endpoints for receiving payment provider callbacks, nor infrastructure for webhook signature validation, idempotency, or retry queues.

## 10. Security Audit

* **IDOR**: Prevented. Affiliates use `getAuthenticatedUser()` which strips ID from the payload. Admins have global access.
* **Amount Manipulation**: Prevented. `PayoutServiceImpl` verifies the requested amount <= available ledger balance.
* **Ownership Manipulation**: Prevented. The payout is tied to the authenticated user token.
* **Replay / Race Conditions**: Prevented via pessimistic database locks on the `User` entity during request.
* **Sensitive Data Exposure**: Safe, as no sensitive financial destinations exist yet.

## 11. IDOR Analysis

Affiliate API (`/api/payouts/request`) does not accept `affiliateId`. It uses the Spring Security Context, eliminating IDOR vulnerabilities at the payout creation layer.

## 12. Amount Manipulation Analysis

Strict balance checking against the Ledger prevents negative balances:
`if (request.getAmount().compareTo(balance.getAvailableBalance()) > 0) throw new BadRequestException(...)`

## 13. Replay / Idempotency Analysis

The Ledger enforces an `idempotencyKey` uniqueness constraint, preventing duplicate ledger entries. However, the payout request endpoint relies solely on the pessimistic lock; it does not currently accept an explicit `Idempotency-Key` HTTP header.

## 14. Concurrency Analysis

Pessimistic locking (`findByIdWithLock` on the `User` table) serializes concurrent payout requests from the same affiliate, preventing two simultaneous ₹500 requests from passing the balance check if only ₹500 is available.

## 15. Reconciliation Analysis

* **Internal Reconciliation**: Excellent. The ledger perfectly tracks Reserved vs Released vs Paid funds.
* **External Reconciliation**: Missing. The `Payout` entity has no `external_provider_id`, `provider_reference`, or `transfer_id`, making automated bank reconciliation impossible.

## 16. Frontend Payout Experience

* **Affiliate Dashboard**: Shows earnings, allows entering a withdrawal amount. Lacks UI for capturing/editing Bank/UPI details.
* **Admin Dashboard**: Displays payout requests, allows manual state transitions (Process, Mark Paid, Reject, Fail).

## 17. Database Analysis

To support Phase 7, the database requires modifications:
* **Payouts Table**: Needs `external_reference_id`, `provider_status`.
* **Payment Methods Table (New)**: Needs to store Bank/UPI details, securely mapped to the affiliate.
* **Webhooks Table (New)**: Needs an audit log for incoming webhook events (Idempotency).

## 18. Existing Tests

There are currently **58** passing backend tests.
Relevant payout tests include:
* `PayoutServiceImplTest` (5 tests for creation, state transitions, validation).
* `PayoutServiceImplConcurrencyTest` (1 test verifying pessimistic locking).
* `Phase6FinancialIntegrationTest` (2 tests verifying ledger/balance immutability).
Missing tests for Phase 7: Webhook controller tests, provider serialization tests.

## 19. Recommended Phase 7 Architecture

**Provider Abstraction (Adapter Pattern)**
The payment provider MUST NOT leak into the core Ledger business logic.
Create a `PaymentProvider` interface that is implemented by `StripeAdapter` or `RazorpayAdapter`. The Ledger remains the ultimate source of truth, and external payment states strictly map back to internal Payout states.

## 20. Recommended Payment Integration Strategy

1. **Tokenization**: Offload sensitive bank details to the payment provider. Do not store plain-text account numbers in LinkKart; store the Provider's `destination_id` (e.g., Stripe Connect Account ID or Razorpay Fund Account ID).
2. **Asynchronous Fulfillment**: Admin clicks "Process Payout" -> Calls Provider API -> Marks internal payout as `PROCESSING` -> Awaits Webhook -> Webhook sets state to `PAID` or `FAILED`.

## 21. Required Database Changes

* `CREATE TABLE payment_methods (...)`
* `CREATE TABLE webhook_events (...)`
* `ALTER TABLE payouts ADD COLUMN external_reference VARCHAR(100)`

## 22. Required API Changes

* Endpoints to Add/Verify Payment Destinations.
* Webhook Endpoint (Unauthenticated but Signature-Verified).

## 23. Required Frontend Changes

* Payment Destination Management UI in Affiliate Profile.
* Disable Withdrawal Button if no Payment Destination is configured.

## 24. Required Security Controls

* Webhook Signature Verification.
* Idempotency constraints on Webhook processing.
* Strict validation of external reference IDs.

## 25. Required Test Plan

* Webhook controller tests (Valid/Invalid signatures).
* Payout synchronization tests.
* Duplicate webhook replay protection tests.

## 26. Risks / Open Questions

* **Which Payment Provider will be used?** (Determines if we need Stripe Connect or Razorpay Route).
* **Who pays the transfer fees?** (Admin or Affiliate? This affects the Ledger deduction).
* **Tax/TDS Compliance?** (Does the system need to deduct tax before payout?)

## 27. Phase 7 Implementation Plan

1. Select Payment Provider.
2. Implement Payment Destination/Onboarding (Database + APIs + UI).
3. Implement Provider Adapter.
4. Implement Webhook Listener & Signature Validator.
5. Connect Admin "Process" button to the Provider Adapter.

---

### PHASE 7 AUDIT STATUS
* Audit completed: YES
* Files inspected: 25
* Payout entities inspected: 3
* Payout services inspected: 2
* Payout controllers inspected: 2
* Payment-related entities inspected: 0
* Payment-provider integrations found: 0
* Webhook endpoints found: 0
* Database tables inspected: 5
* Existing payout tests: 8
* Security findings: 0
* Critical findings: 0
* Missing capabilities: 5
* Recommended architecture changes: 3
