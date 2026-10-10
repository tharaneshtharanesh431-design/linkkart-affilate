CREATE TABLE IF NOT EXISTS ledger_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    affiliate_id BIGINT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id BIGINT NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ledger_transactions_affiliate FOREIGN KEY (affiliate_id) REFERENCES users(id),
    UNIQUE KEY uk_ledger_idempotency (idempotency_key)
);
CREATE INDEX idx_ledger_affiliate_time ON ledger_transactions(affiliate_id, created_at);

-- 1. Insert COMMISSION_ACCRUED for APPROVED and REVERSED commissions
INSERT INTO ledger_transactions (affiliate_id, transaction_type, direction, amount, reference_type, reference_id, idempotency_key, created_at)
SELECT affiliate_id, 'COMMISSION_ACCRUED', 'CREDIT', amount, 'COMMISSION', id, CONCAT('COMMISSION_ACCRUED:COMMISSION:', id), clears_at
FROM commissions WHERE status IN ('APPROVED', 'REVERSED');

-- 2. Insert COMMISSION_REVERSED for REVERSED commissions
INSERT INTO ledger_transactions (affiliate_id, transaction_type, direction, amount, reference_type, reference_id, idempotency_key, created_at)
SELECT affiliate_id, 'COMMISSION_REVERSED', 'DEBIT', amount, 'COMMISSION', id, CONCAT('COMMISSION_REVERSED:COMMISSION:', id), CURRENT_TIMESTAMP
FROM commissions WHERE status = 'REVERSED';

-- 3. Insert PAYOUT_RESERVED for all payouts
INSERT INTO ledger_transactions (affiliate_id, transaction_type, direction, amount, reference_type, reference_id, idempotency_key, created_at)
SELECT affiliate_id, 'PAYOUT_RESERVED', 'DEBIT', amount, 'PAYOUT', id, CONCAT('PAYOUT_RESERVED:PAYOUT:', id), requested_at
FROM payouts;

-- 4. Insert PAYOUT_PAID for PAID payouts
INSERT INTO ledger_transactions (affiliate_id, transaction_type, direction, amount, reference_type, reference_id, idempotency_key, created_at)
SELECT affiliate_id, 'PAYOUT_PAID', 'NEUTRAL', amount, 'PAYOUT', id, CONCAT('PAYOUT_PAID:PAYOUT:', id), processed_at
FROM payouts WHERE status = 'PAID';

-- 5. Insert PAYOUT_RELEASED for FAILED and REJECTED payouts
INSERT INTO ledger_transactions (affiliate_id, transaction_type, direction, amount, reference_type, reference_id, idempotency_key, created_at)
SELECT affiliate_id, 'PAYOUT_RELEASED', 'CREDIT', amount, 'PAYOUT', id, CONCAT('PAYOUT_RELEASED:PAYOUT:', id), processed_at
FROM payouts WHERE status IN ('FAILED', 'REJECTED');
