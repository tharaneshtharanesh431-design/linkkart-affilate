# PHASE 6 DATA MIGRATION STRATEGY

## Context
Phase 6 introduces an immutable `ledger_transactions` table to replace dynamic state-based balance calculations. Existing `commissions` and `payouts` data must be accurately represented in the new ledger to ensure seamless balances upon deployment.

## Existing Schema
- `commissions` table has statuses: `PENDING`, `APPROVED`, `REJECTED`, `REVERSED`.
- `payouts` table has statuses: `REQUESTED`, `PROCESSING`, `PAID`, `FAILED`, `REJECTED`.

## Ledger Transaction Mapping

### 1. Existing APPROVED Commissions
- Insert `COMMISSION_ACCRUED` (CREDIT) transaction.
- Amount: `commission.amount`
- Idempotency Key: `COMMISSION_ACCRUED:COMMISSION:{id}`

### 2. Existing REVERSED Commissions
- Insert `COMMISSION_ACCRUED` (CREDIT) transaction (simulating the original approval).
- Insert `COMMISSION_REVERSED` (DEBIT) transaction (simulating the reversal).
- Idempotency Keys: 
  - `COMMISSION_ACCRUED:COMMISSION:{id}`
  - `COMMISSION_REVERSED:COMMISSION:{id}`

### 3. Existing PENDING / REJECTED Commissions
- Do nothing. These have not historically recognized any financial value in the ledger.

### 4. Existing REQUESTED / PROCESSING Payouts
- Insert `PAYOUT_RESERVED` (DEBIT) transaction.
- Amount: `payout.amount`
- Idempotency Key: `PAYOUT_RESERVED:PAYOUT:{id}`

### 5. Existing PAID Payouts
- Insert `PAYOUT_RESERVED` (DEBIT) transaction.
- Insert `PAYOUT_PAID` (NEUTRAL) transaction.
- Idempotency Keys:
  - `PAYOUT_RESERVED:PAYOUT:{id}`
  - `PAYOUT_PAID:PAYOUT:{id}`

### 6. Existing FAILED / REJECTED Payouts
- Insert `PAYOUT_RESERVED` (DEBIT) transaction.
- Insert `PAYOUT_RELEASED` (CREDIT) transaction.
- Idempotency Keys:
  - `PAYOUT_RESERVED:PAYOUT:{id}`
  - `PAYOUT_RELEASED:PAYOUT:{id}`

## Execution
This migration will be explicitly written in `V6__financial_ledger.sql` using an `INSERT INTO ledger_transactions ... SELECT ...` approach, guaranteeing exact transactional safety during the Flyway deployment.
