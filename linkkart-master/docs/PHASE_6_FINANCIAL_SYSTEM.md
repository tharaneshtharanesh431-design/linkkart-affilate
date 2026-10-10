# PHASE 6 FINANCIAL SYSTEM

## 1. Financial Architecture
LinkKart 2.0 uses an **immutable relational financial ledger** embedded within the existing MySQL + Spring Boot modular monolith.
All financial events create append-only ledger entries, replacing the legacy model where financial balances were derived from mutable entity statuses.

## 2. Commission Lifecycle
The business states remain `PENDING`, `APPROVED`, `REJECTED`, `REVERSED`.
- **PENDING**: Created upon conversion. No financial ledger impact.
- **APPROVED**: After clearing period, `LedgerService.recordCommissionAccrual` is invoked. An immutable CREDIT ledger entry is created.
- **REVERSED**: If a previously approved commission is reversed due to a merchant refund, `LedgerService.recordCommissionReversal` inserts a compensating DEBIT.
- **REJECTED**: No financial ledger impact (was never accrued).

## 3. Ledger Model
The `ledger_transactions` table enforces exact financial tracing.
- `transaction_type`
- `direction` (CREDIT / DEBIT / NEUTRAL)
- `amount` (DECIMAL(19,2))
- `reference_type` and `reference_id` (e.g., `COMMISSION` : `123`)
- `idempotency_key` (e.g., `COMMISSION_ACCRUED:COMMISSION:123`)

## 4. Ledger Transaction Types
1. `COMMISSION_ACCRUED` (CREDIT) - Commission clears and is payable.
2. `COMMISSION_REVERSED` (DEBIT) - Previously cleared commission is refunded.
3. `PAYOUT_RESERVED` (DEBIT) - Affiliate requests payout, funds locked.
4. `PAYOUT_PAID` (NEUTRAL) - Payout completes. No balance change (funds already reserved).
5. `PAYOUT_RELEASED` (CREDIT) - Payout fails/rejected. Reserved funds returned to available balance.

## 5. Balance Calculation
Balances are reconstructed purely from the ledger (`AffiliateBalanceServiceImpl`):
- `Available Balance` = SUM(CREDIT) - SUM(DEBIT)
- `Total Earned` = SUM(amount WHERE type = COMMISSION_ACCRUED)
- `Paid Amount` = SUM(amount WHERE type = PAYOUT_PAID)

*(Note: Pending and UI-specific Payout processing amounts are still aggregated from mutable tables purely for UX, but do not affect financial safety).*

## 6. Payout Accounting
Payout logic enforces strict separation of available vs. reserved funds.
When requested, funds instantly decrement from Available via a `PAYOUT_RESERVED` DEBIT.
If successful, no further Available Balance impact occurs (merely marked PAID).
If failed, the reservation is compensated by a `PAYOUT_RELEASED` CREDIT, making funds available again.

## 7. Reversal Accounting
Refunding a conversion triggers a reversing debit. It does NOT delete or modify the original accrual entry. The historical event trail is strictly preserved.

## 8. Idempotency
All financial mutations insert into `ledger_transactions` leveraging a `UNIQUE KEY` on `idempotency_key`. The application guarantees exactly-once financial event processing, shielded by native database constraints.

## 9. Concurrency
Payouts continue to utilize pessimistic locking (`findByIdWithLock`) to serialize requests and prevent over-withdrawal. In tandem, the idempotent ledger prevents race conditions resulting in double-credits.

## 10. Tenant Isolation
Financial visibility respects the established IDOR protections. Ledger records are hard-bound to `affiliate_id` and isolated natively. Merchants cannot mutate balances directly; they can only transition Conversion statuses, which cleanly trigger safe Ledger hooks.

## 11. Data Migration
Synthesizing opening balances from existing data was seamlessly handled in `V6__financial_ledger.sql` via deterministic `INSERT ... SELECT` aggregation of legacy mutable states, mapping them accurately to the new Ledger format.

## 12. API Compatibility
No external `DTOs` were structurally altered. `AffiliateBalanceResponse` correctly surfaces exactly the same schema to the Next.js frontend, ensuring zero breakage in client-side integrations.

## 13. Financial Invariants
Documented explicitly in `PHASE_6_FINANCIAL_INVARIANTS.md`.
* `DECIMAL(19,2)` everywhere.
* Immutability of ledger.
* Explicit reconstruction.

## 14. Test Coverage
Comprehensive coverage explicitly introduced in `Phase6FinancialIntegrationTest`, verifying lifecycle, ledger immutability, payout reservation release logic, and concurrency/balance failsafes.

## 15. Known Limitations
- High-volume transaction affiliates might face slight read overhead when aggregating `availableBalance`. If necessary, Phase 8/9 could introduce a materialized view or cached snapshot system.
- Real-world payment gateway integrations (Stripe/PayPal) are reserved for Phase 7.
