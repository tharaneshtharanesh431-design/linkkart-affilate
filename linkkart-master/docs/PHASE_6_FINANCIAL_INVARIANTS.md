# PHASE 6 FINANCIAL INVARIANTS

### Invariant 1 — Monetary Precision
All financial amounts must be represented exactly:
- **Java:** `java.math.BigDecimal`
- **Database:** `DECIMAL(19,2)`
- No `float` or `double` usage is permitted anywhere in the financial flow. Rounding must use `RoundingMode.HALF_UP`.

### Invariant 2 — Commission Uniqueness
A `Conversion` can have at most one `Commission`. 
This remains enforced via the `conversion_id UNIQUE` constraint in the `commissions` table.

### Invariant 3 — Ledger Immutability
Ledger transactions (`ledger_transactions`) are append-only.
Once created:
- `amount` cannot change.
- `type` cannot change.
- `reference_id` and `reference_type` cannot change.
- `affiliate_id` cannot change.
- Historical transactions cannot be deleted.
Corrections must be represented by compensating ledger transactions.

### Invariant 4 — Ledger Idempotency
The same financial event must never create duplicate ledger entries.
An explicit idempotency key must be enforced at the database level:
`UNIQUE KEY uk_ledger_idempotency (idempotency_key)`
Format: `{EVENT_TYPE}:{REFERENCE_TYPE}:{REFERENCE_ID}` (e.g., `COMMISSION_ACCRUED:COMMISSION:123`)

### Invariant 5 — Balance Reconstruction
Affiliate financial state must be reconstructable directly from immutable ledger transactions:
- **Available Balance** = `SUM(amount WHERE direction = CREDIT) - SUM(amount WHERE direction = DEBIT)`
- **Total Earned** = `SUM(amount WHERE type = COMMISSION_ACCRUED)`
- **Paid Amount** = `SUM(amount WHERE type = PAYOUT_PAID)`
- **Reserved Amount** = `SUM(amount WHERE type = PAYOUT_RESERVED) - SUM(amount WHERE type = PAYOUT_RELEASED) - SUM(amount WHERE type = PAYOUT_PAID)`

### Invariant 6 — Reversal
A financial reversal must create a compensating ledger entry.
- When an approved commission is reversed, a `COMMISSION_REVERSED` (DEBIT) transaction is inserted.
- The original `COMMISSION_ACCRUED` transaction remains untouched.

### Invariant 7 — Payout Reservation
Payout accounting distinguishes states:
- **Payout Requested:** Funds are reserved (`PAYOUT_RESERVED` - DEBIT from Available).
- **Payout Failed/Rejected:** Funds are returned (`PAYOUT_RELEASED` - CREDIT to Available).
- **Payout Paid:** Reservation is permanently consumed (`PAYOUT_PAID` - NEUTRAL to Available, resolves Reservation).
A requested payout is never permanently consumed until it transitions to `PAID`.
