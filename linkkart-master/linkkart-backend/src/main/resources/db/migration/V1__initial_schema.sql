-- Database handled externally

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);

CREATE TABLE IF NOT EXISTS merchant_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    website_url VARCHAR(255),
    integration_secret VARCHAR(255) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_merchant_profiles_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS affiliate_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    payment_email VARCHAR(255) NOT NULL,
    website_url VARCHAR(255),
    social_links TEXT,
    tax_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_affiliate_profiles_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_id VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    merchant_id BIGINT NOT NULL,
    category_id BIGINT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(1000),
    destination_url VARCHAR(1000),
    price DECIMAL(19,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_merchant FOREIGN KEY (merchant_id) REFERENCES users(id),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE INDEX idx_products_merchant ON products(merchant_id);
CREATE INDEX idx_products_category ON products(category_id);

CREATE TABLE IF NOT EXISTS campaigns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    merchant_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    commission_type VARCHAR(20) NOT NULL DEFAULT 'PERCENTAGE',
    commission_rate DECIMAL(19,2) NOT NULL,
    clearing_period_days INT NOT NULL DEFAULT 30,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_campaigns_merchant FOREIGN KEY (merchant_id) REFERENCES users(id)
);
CREATE INDEX idx_campaigns_merchant ON campaigns(merchant_id);

CREATE TABLE IF NOT EXISTS campaign_products (
    campaign_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    PRIMARY KEY (campaign_id, product_id),
    CONSTRAINT fk_campaign_products_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    CONSTRAINT fk_campaign_products_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS campaign_affiliates (
    campaign_id BIGINT NOT NULL,
    affiliate_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
    PRIMARY KEY (campaign_id, affiliate_id),
    CONSTRAINT fk_campaign_affiliates_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    CONSTRAINT fk_campaign_affiliates_affiliate FOREIGN KEY (affiliate_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS affiliate_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    affiliate_id BIGINT NOT NULL,
    campaign_id BIGINT NOT NULL,
    product_id BIGINT,
    code VARCHAR(50) NOT NULL UNIQUE,
    target_url VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_affiliate_links_affiliate FOREIGN KEY (affiliate_id) REFERENCES users(id),
    CONSTRAINT fk_affiliate_links_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    CONSTRAINT fk_affiliate_links_product FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE INDEX idx_affiliate_links_affiliate ON affiliate_links(affiliate_id);
CREATE INDEX idx_affiliate_links_campaign ON affiliate_links(campaign_id);

CREATE TABLE IF NOT EXISTS clicks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tracking_id VARCHAR(36) NOT NULL UNIQUE,
    affiliate_link_id BIGINT NOT NULL,
    ip_hash VARCHAR(255),
    user_agent VARCHAR(255),
    clicked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_clicks_affiliate_link FOREIGN KEY (affiliate_link_id) REFERENCES affiliate_links(id)
);
CREATE INDEX idx_clicks_link ON clicks(affiliate_link_id);
CREATE INDEX idx_clicks_time ON clicks(clicked_at);

CREATE TABLE IF NOT EXISTS conversions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tracking_id VARCHAR(36) NOT NULL,
    affiliate_link_id BIGINT NOT NULL,
    order_amount DECIMAL(19,2) NOT NULL,
    order_reference VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'VALID',
    converted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversions_affiliate_link FOREIGN KEY (affiliate_link_id) REFERENCES affiliate_links(id),
    UNIQUE KEY uk_conversions_tracking_order (tracking_id, order_reference)
);
CREATE INDEX idx_conversions_tracking ON conversions(tracking_id);
CREATE INDEX idx_conversions_link ON conversions(affiliate_link_id);

CREATE TABLE IF NOT EXISTS commissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversion_id BIGINT UNIQUE,
    affiliate_id BIGINT NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    clears_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commissions_conversion FOREIGN KEY (conversion_id) REFERENCES conversions(id),
    CONSTRAINT fk_commissions_affiliate FOREIGN KEY (affiliate_id) REFERENCES users(id)
);
CREATE INDEX idx_commissions_affiliate ON commissions(affiliate_id);
CREATE INDEX idx_commissions_clears ON commissions(clears_at);
CREATE INDEX idx_commissions_status_clears ON commissions(status, clears_at);

CREATE TABLE IF NOT EXISTS payouts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    affiliate_id BIGINT NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    failure_reason VARCHAR(1000),
    rejection_reason VARCHAR(1000),
    CONSTRAINT fk_payouts_affiliate FOREIGN KEY (affiliate_id) REFERENCES users(id)
);
CREATE INDEX idx_payouts_affiliate ON payouts(affiliate_id);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message VARCHAR(1000) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS chat_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_history_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    ai_sentiment VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id)
);
