-- Phase 5 Tracking and Attribution Indexes
-- Enhance performance for tracking deduplication and fraud evaluation queries

-- Faster lookups for duplicate click prevention based on IP and time
CREATE INDEX IF NOT EXISTS idx_clicks_ip_hash_time ON clicks(ip_hash, clicked_at);

-- Faster lookups for fraud conversion velocity detection
CREATE INDEX IF NOT EXISTS idx_conversions_status_time ON conversions(status, converted_at);
CREATE INDEX IF NOT EXISTS idx_conversions_order_reference ON conversions(order_reference);
