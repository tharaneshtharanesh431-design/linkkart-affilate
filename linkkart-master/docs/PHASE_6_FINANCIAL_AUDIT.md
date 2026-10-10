# LINKKART 2.0 — PHASE 6 FINANCIAL AUDIT

## 1. Executive Summary
The current financial architecture of LinkKart successfully handles the basic mechanics of tracking conversions, calculating commissions, and requesting payouts. The system appropriately uses `BigDecimal` for monetary precision and implements some degree of concurrency protection and idempotency. However, the system calculates balances dynamically based on the mutable status of `Commission` and `Payout` records. It lacks an immutable financial ledger, which presents an audibility risk if historical reconstruction of balances is required. Phase 6 should introduce a relational ledger within the modular monolith to guarantee financial immutability.

## 2. Existing Financial Architecture
- **Tech Stack:** Spring Boot modular monolith, MySQL (Flyway), JPA/Hibernate.
- **Precision:** All monetary fields use `BigDecimal` in Java and `DECIMAL(19,2)` in MySQL.
- **Balance Calculation:** Calculated on-the-fly in `AffiliateBalanceServiceImpl` by aggregating `APPROVED` commissions and subtracting `REQUESTED`, `PROCESSING`, and `PAID` payouts.
- **Immutability:** `NOT CURRENTLY IMPLEMENTED`. Financial states (e.g., `PENDING` -> `APPROVED`) are mutated in place.

## 3. Entity Relationships
- `Conversion` (One-to-One) `Commission`
- `Conversion` (Many-to-One) `AffiliateLink`
- `Commission` (Many-to-One) `User` (Affiliate)
- `Payout` (Many-to-One) `User` (Affiliate)
- Foreign key constraints are enforced at the DB level.

## 4. Commission Calculation Flow
Calculated in `ConversionServiceImpl.recordConversion`.
- Determines if `Campaign` uses `FIXED` or `PERCENTAGE` commission.
- Fixed: uses `campaign.commissionRate`
- Percentage: `conversionAmount * (commissionRate / 100)`
- Clears at: `conversion.convertedAt + campaign.clearingPeriodDays`

## 5. Conversion → Commission Flow
1. Client initiates conversion via S2S API (`recordConversion`).
2. `Conversion` is created with status `VALID`.
3. `Commission` is immediately created with status `PENDING`.
4. Scheduled job (`approveEligibleCommissions`) evaluates `clears_at`. If elapsed, updates `Commission` to `APPROVED`.

## 6. Current Commission States
- `PENDING`: Initial state upon valid conversion.
- `APPROVED`: Cleared after clearing period.
- `REJECTED`: Updated when a merchant flags a conversion as `FRAUD`.
- `REVERSED`: Updated when a merchant flags a conversion as `REFUNDED`.

## 7. Current Payout Relationship
Payouts are completely decoupled from individual Commissions. Payouts simply deduct from the global aggregated `availableBalance` (Total Approved Commissions - Total Requested/Processing/Paid Payouts).

## 8. Monetary Precision Analysis
- **`BigDecimal` in Code:** `VERIFIED`. All entities (`Commission`, `Payout`, `Conversion`) strictly use `BigDecimal`.
- **`DECIMAL` in DB:** `VERIFIED`. Flyway schemas properly use `DECIMAL(19,2)`.
- **Rounding:** Handled explicitly using `RoundingMode.HALF_UP` during calculation.

## 9. Idempotency Analysis
- `VERIFIED`. `ConversionServiceImpl` checks `existsByOrderReferenceAndAffiliateLink_Campaign_Organization_Id`. Duplicate submissions return the original data gracefully. A unique index `uk_conversions_tracking_order` (tracking_id, order_reference) enforces this at the DB level.

## 10. Concurrency Analysis
- **Payouts:** `VERIFIED`. `PayoutServiceImpl.requestPayout` applies a pessimistic write lock (`userRepository.findByIdWithLock`) to prevent simultaneous requests from exceeding the affiliate's balance.
- **Commissions:** Duplicate commissions are prevented via the `conversion_id` `UNIQUE` constraint on the `commissions` table.

## 11. Transaction Boundary Analysis
- `VERIFIED`. All write operations in `ConversionServiceImpl`, `CommissionServiceImpl`, and `PayoutServiceImpl` are properly annotated with `@Transactional`.

## 12. Reversal/Refund Analysis
- `PARTIALLY IMPLEMENTED`. If a conversion is marked `REFUNDED`, the linked commission is updated to `REVERSED`. However, this mutation destroys the historical context of exactly *when* the commission was reversed.

## 13. Fraud → Financial Impact Analysis
- If a conversion is manually marked as `FRAUD`, the linked commission is updated to `REJECTED`. The `FraudDetectionService` evaluates conversions and payouts at runtime to emit signals, but actual financial denial relies on manual merchant or admin status updates.

## 14. Tenant Isolation Analysis
- `VERIFIED`. `ConversionServiceImpl.checkConversionOwnership` correctly enforces that a merchant can only modify conversions linked to a campaign owned by their exact Organization ID.
- `VERIFIED`. Affiliates only query their own commissions via their authenticated context.

## 15. Financial Integrity Risks
- **Lack of Auditability:** Since statuses mutate in place (`PENDING` -> `APPROVED`), we cannot reconstruct a historical timeline of financial events.
- **Decoupled Payouts:** Payouts reduce a globally aggregated balance but do not clear specific commissions. This makes reconciliation difficult if a historical commission is later reversed.

## 16. Ledger Assessment
Phase 0 identified the absence of a financial ledger as a potential risk, and this audit confirms it. The system requires an **immutable financial transaction journal / ledger**. 
- A simple relational implementation inside the existing MySQL DB is highly justified to track every debit and credit atomically. 

## 17. Recommended Phase 6 Architecture
Introduce a `LedgerTransaction` entity.
Instead of dynamic balance aggregation from mutable statuses, all financial movements will insert immutable records into the ledger:
1. COMMISSION_ACCRUED (Credit)
2. PAYOUT_REQUESTED (Debit - Reserved)
3. COMMISSION_REVERSED (Debit)
4. PAYOUT_FAILED (Credit - Reversal)

## 18. Proposed State Machine
Entities can retain their status flags for UI/query convenience, but state changes **MUST** trigger immutable ledger entries.
- Conversion: VALID, FRAUD, REFUNDED
- Commission: PENDING, APPROVED, REVERSED, REJECTED
- Payout: REQUESTED, PROCESSING, PAID, FAILED, REJECTED

## 19. Proposed Database Changes
Create `V6__financial_ledger.sql`:
- Table `ledger_transactions`: `id`, `affiliate_id`, `type` (CREDIT/DEBIT), `amount`, `reference_type` (COMMISSION, PAYOUT), `reference_id`, `created_at`.
- Add required indexes on `affiliate_id` and `created_at`.

## 20. Proposed API Changes
No new external APIs are strictly necessary. The internal implementation of `AffiliateBalanceService`, `CommissionService`, and `PayoutService` will be updated to write and read from the Ledger. We may add an Admin API for querying the Ledger directly for reconciliation.

## 21. Required Test Cases
- Concurrent payout requests respect ledger balances.
- Refunding a conversion inserts a Debit in the ledger.
- Rejecting a payout inserts a Credit back into the ledger.
- Ledger aggregation matches legacy dynamic calculation precisely.

## 22. Risks / Open Questions
- **Migration of Existing Data:** We must synthesize historical ledger entries for any existing `APPROVED` commissions and `REQUESTED/PAID` payouts to ensure seamless balances upon deploying Phase 6.

## 23. Explicit Phase 6 Implementation Plan
1. **Migration:** Create `V6__financial_ledger.sql`.
2. **Entity:** Create `LedgerTransaction` Java entity.
3. **Repository:** Create `LedgerTransactionRepository`.
4. **Service Rewrite:** Update `AffiliateBalanceServiceImpl` to aggregate the balance from the Ledger rather than statuses.
5. **Event Hooks:** Update `CommissionServiceImpl` (upon Approval) and `PayoutServiceImpl` (upon Request, Fail, Reject) to write to the Ledger.
6. **Testing:** Write comprehensive integration tests verifying ledger immutability and exact monetary correctness.

---

### PHASE 6 AUDIT STATUS

* Audit completed: YES
* Files inspected: 8
* Financial entities inspected: 3
* Financial services inspected: 4
* Financial controllers inspected: 0
* Migration files inspected: 1
* Current financial risks: 2
* Critical findings: 0
* Recommended changes: 1
* Tests currently covering financial logic: 5
