# Tracking Engine Security

## Open Redirect Prevention
Target URLs are strictly loaded from the trusted `AffiliateLink` record in the database. Client-side URL injection (e.g., `?target=...`) is ignored.

## Cross-Tenant IDOR
All state changes to a `Conversion` (e.g., status mutations) strictly enforce a `checkConversionOwnership` method. A Merchant in Organization B cannot update or view conversions belonging to Organization A.

## Duplicate Protection
A `UNIQUE KEY uk_conversions_tracking_order (tracking_id, order_reference)` is enforced in the database. The `ConversionServiceImpl` captures integrity violations and rejects the postback gracefully.

## Postback Security (S2S)
Conversions can only be created by submitting the merchant's private integration secret (`X-Merchant-Secret`) alongside the payload. Fabricating a conversion requires both the exact `tracking_id` and the secret key.

## Privacy & Rate Limiting
- IP addresses are processed securely. Fraud detection stores an SHA-256 hash of the IP Address, completely obfuscating PII.
- `Bucket4j` dynamically protects `/t/` (50 req/min) and `/api/conversions/s2s` (100 req/min).
