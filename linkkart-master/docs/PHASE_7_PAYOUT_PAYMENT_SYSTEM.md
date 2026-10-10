# PHASE 7 PAYOUT PAYMENT SYSTEM

## 1. Architecture
Phase 7 extends Phase 6's ledger with Payment Provider abstraction.
The system is separated into:
1. **Payment Destination Management**: Affiliates securely manage Bank/UPI details.
2. **Internal Payout Validation**: Payouts are reserved in the ledger internally.
3. **Provider Submission**: Async submission to payment providers returning an external reference.
4. **Webhook Reconciliation**: Provider async events transition payouts to `PAID` or `FAILED`.

## 2. Payout State Machine
* `REQUESTED`: Payout is created, Funds `RESERVED` in the Ledger.
* `PROCESSING`: Sent to external provider.
* `PAID`: Webhook received success, Ledger finalized.
* `FAILED`: Webhook received failure, Ledger funds released.
* `REJECTED`: Admin manually rejected, Ledger funds released.

## 3. Payment Provider Abstraction
See `PHASE_7_PAYMENT_PROVIDER.md`.

## 4. Payment Destination Model
`PaymentMethod` securely stores affiliate payout destinations (Bank, UPI).
* Associates with `User` (Affiliate).
* Masks sensitive identifiers (e.g., `****4821`).
* Uses a `providerDestinationId` to avoid storing raw bank numbers on our servers.

## 5. Provider Integration Flow
```
Admin Process -> Provider submitPayout -> Provider API
```
Does not hold open DB locks while making external HTTP calls.

## 6. Webhook Flow
```
Provider -> WebhookController -> verifySignature -> idempotency check -> parse reference -> mark Payout Paid/Failed
```

## 7. Idempotency
Webhooks are protected by `webhook_events` which stores `(provider, external_event_id)` uniquely.
Duplicate events are ignored safely.

## 8. Security
* Payment Methods belong to specific Affiliates.
* `PaymentMethodService` checks `SecurityContext` ownership before modification.
* Webhooks require signature verification (implemented conceptually in Mock).

## 9. Ledger Interaction
* `REQUESTED` -> Ledger `RESERVED`
* `PAID` -> Ledger `PAID`
* `FAILED` / `REJECTED` -> Ledger `RELEASED`

## 10. Reconciliation
Any payout can be traced via `Payout.externalReference` to a `WebhookEvent.externalEventId`, and subsequently to the `LedgerTransaction`s.

## 11. Failure Handling
If the Provider API fails, it can throw an exception. The Payout stays in `REQUESTED` state.
If the Webhook payload is failure, the Payout transitions to `FAILED` and ledger funds are returned to the user.

## 12. API Documentation
* `GET /api/payment-methods`: List active destinations.
* `POST /api/payment-methods`: Add destination.
* `DELETE /api/payment-methods/{id}`: Deactivate destination.
* `POST /api/webhooks/{provider}`: Receive provider events.

## 13. Frontend Behavior
*(Pending Next.js integration)* The affiliate will select a `PaymentMethod` when requesting a payout.

## 14. Test Coverage
Comprehensive integration tests verify the mock webhook and payment method assignment. (Verified via `Phase7FinancialIntegrationTest`).

## 15. Known Limitations
Real external provider (Stripe/Razorpay) is not yet implemented. `MockPaymentProviderAdapter` is active.
