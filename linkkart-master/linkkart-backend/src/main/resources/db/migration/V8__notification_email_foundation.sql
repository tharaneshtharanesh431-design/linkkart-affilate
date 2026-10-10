-- V8__notification_email_foundation.sql

-- 1. Align notifications schema with Notification entity
ALTER TABLE notifications ADD COLUMN type VARCHAR(50);
ALTER TABLE notifications ADD COLUMN title VARCHAR(255);
ALTER TABLE notifications ADD COLUMN reference_type VARCHAR(50);
ALTER TABLE notifications ADD COLUMN reference_id BIGINT;
ALTER TABLE notifications ADD COLUMN read_at TIMESTAMP;

-- Since the DB is already populated, set defaults before adding NOT NULL constraint
UPDATE notifications SET type = 'SYSTEM', title = 'System Notification' WHERE type IS NULL;
ALTER TABLE notifications MODIFY COLUMN type VARCHAR(50) NOT NULL;
ALTER TABLE notifications MODIFY COLUMN title VARCHAR(255) NOT NULL;

-- Ensure indexes from entity exist
CREATE INDEX idx_notification_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notification_user_created ON notifications(user_id, created_at);
CREATE INDEX idx_notification_reference ON notifications(reference_type, reference_id);

-- 2. Create Email Delivery Logs
CREATE TABLE email_delivery_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_id BIGINT,
    template_name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_message_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    attempt_count INT NOT NULL DEFAULT 0,
    last_error TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_email_delivery_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_email_delivery_notification FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
);
CREATE INDEX idx_email_delivery_user ON email_delivery_logs(user_id);
CREATE INDEX idx_email_delivery_status ON email_delivery_logs(status);

-- 3. Create Notification Preferences
CREATE TABLE notification_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_prefs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create Password Reset Tokens
CREATE TABLE password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pwd_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_pwd_reset_token ON password_reset_tokens(token_hash);

-- 5. Create Email Verification Tokens
CREATE TABLE email_verification_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_email_verify_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_email_verify_token ON email_verification_tokens(token_hash);
