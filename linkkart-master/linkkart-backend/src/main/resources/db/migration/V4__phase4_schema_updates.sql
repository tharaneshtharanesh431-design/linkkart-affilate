-- V4__phase4_schema_updates.sql

-- Organization profile enhancements
ALTER TABLE organizations ADD COLUMN description TEXT;
ALTER TABLE organizations ADD COLUMN logo_url VARCHAR(255);
ALTER TABLE organizations ADD COLUMN industry VARCHAR(100);
ALTER TABLE organizations ADD COLUMN contact_email VARCHAR(255);
ALTER TABLE organizations ADD COLUMN location VARCHAR(255);

-- Affiliate profile enhancements
ALTER TABLE affiliate_profiles ADD COLUMN display_name VARCHAR(100);
ALTER TABLE affiliate_profiles ADD COLUMN bio TEXT;
ALTER TABLE affiliate_profiles ADD COLUMN niche VARCHAR(100);
ALTER TABLE affiliate_profiles ADD COLUMN audience_size VARCHAR(50);
ALTER TABLE affiliate_profiles ADD COLUMN profile_image_url VARCHAR(255);
ALTER TABLE affiliate_profiles ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL;
ALTER TABLE affiliate_profiles ADD COLUMN is_discoverable BOOLEAN DEFAULT TRUE NOT NULL;
ALTER TABLE affiliate_profiles ADD COLUMN location VARCHAR(100);

-- Campaign enhancements
ALTER TABLE campaigns ADD COLUMN description TEXT;
ALTER TABLE campaigns ADD COLUMN start_date DATE;
ALTER TABLE campaigns ADD COLUMN end_date DATE;
ALTER TABLE campaigns ADD COLUMN budget DECIMAL(19, 2);
