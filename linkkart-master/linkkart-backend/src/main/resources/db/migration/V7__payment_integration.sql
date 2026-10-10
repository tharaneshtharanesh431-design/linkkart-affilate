CREATE TABLE payment_methods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    affiliate_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL, -- BANK_ACCOUNT, UPI, etc.
    account_holder_name VARCHAR(100) NOT NULL,
    masked_identifier VARCHAR(50) NOT NULL,
    provider_destination_id VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_method_affiliate FOREIGN KEY (affiliate_id) REFERENCES users(id)
);

CREATE INDEX idx_payment_method_affiliate ON payment_methods(affiliate_id);

CREATE TABLE webhook_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    external_event_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    processing_status VARCHAR(20) NOT NULL, -- PENDING, PROCESSED, FAILED
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_at TIMESTAMP NULL,
    CONSTRAINT uk_webhook_provider_event UNIQUE (provider, external_event_id)
);

ALTER TABLE payouts ADD COLUMN external_reference VARCHAR(100) UNIQUE;
ALTER TABLE payouts ADD COLUMN payment_method_id BIGINT;
ALTER TABLE payouts ADD CONSTRAINT fk_payout_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id);
