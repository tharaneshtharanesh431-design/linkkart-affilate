-- 1. Create Organizations table
CREATE TABLE organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    integration_secret VARCHAR(255) UNIQUE,
    website_url VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Create Organization Members table
CREATE TABLE organization_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_org_members_org FOREIGN KEY (organization_id) REFERENCES organizations(id),
    CONSTRAINT fk_org_members_user FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY uk_org_members_user_org (user_id, organization_id)
);
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- 3. Migrate Data from merchant_profiles to organizations
INSERT INTO organizations (id, name, slug, integration_secret, website_url, created_at, updated_at)
SELECT id, business_name, CONCAT(LOWER(REPLACE(business_name, ' ', '-')), '-', id), integration_secret, website_url, created_at, updated_at
FROM merchant_profiles;

-- 4. Map existing users to the newly created organizations as OWNER
INSERT INTO organization_members (organization_id, user_id, role, status, created_at)
SELECT id, user_id, 'OWNER', 'ACTIVE', CURRENT_TIMESTAMP
FROM merchant_profiles;

-- 5. Add organization_id to products and campaigns
ALTER TABLE products ADD COLUMN organization_id BIGINT;
ALTER TABLE campaigns ADD COLUMN organization_id BIGINT;

-- 6. Migrate ownership (using correlated subqueries for DB compatibility)
UPDATE products SET organization_id = (SELECT id FROM merchant_profiles WHERE merchant_profiles.user_id = products.merchant_id);
UPDATE campaigns SET organization_id = (SELECT id FROM merchant_profiles WHERE merchant_profiles.user_id = campaigns.merchant_id);

-- 7. Ensure NOT NULL and add foreign keys. But before we do, we need to delete orphaned products/campaigns if any.
DELETE FROM products WHERE organization_id IS NULL;
DELETE FROM campaigns WHERE organization_id IS NULL;

ALTER TABLE products ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE products ADD CONSTRAINT fk_products_organization FOREIGN KEY (organization_id) REFERENCES organizations(id);
CREATE INDEX idx_products_org ON products(organization_id);

ALTER TABLE campaigns ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE campaigns ADD CONSTRAINT fk_campaigns_organization FOREIGN KEY (organization_id) REFERENCES organizations(id);
CREATE INDEX idx_campaigns_org ON campaigns(organization_id);

-- 8. Drop old columns
ALTER TABLE products DROP CONSTRAINT fk_products_merchant;
DROP INDEX idx_products_merchant ON products;
ALTER TABLE products DROP COLUMN merchant_id;

ALTER TABLE campaigns DROP CONSTRAINT fk_campaigns_merchant;
DROP INDEX idx_campaigns_merchant ON campaigns;
ALTER TABLE campaigns DROP COLUMN merchant_id;
