# Tracking Test Matrix

## Regression Testing
- `ConversionIDORTest`: Verified that Merchant B cannot alter the conversion status of Merchant A's conversion. Expected: 403 Access Denied.

## Deduplication Integrity
- Duplicate conversions (same `tracking_id` + `order_reference`) were verified to throw `DataIntegrityViolationException`, which is caught and handled without affecting database state.

## Attribution Model
- Verified Last Valid Affiliate Click tracking by ensuring `tracking_id` exclusively links the conversion to the explicit link.

## 30-Day Window Testing
- Integration tests confirm `Click` expiration logic works dynamically alongside Campaign and Participation status boundaries.

## S2S Authentication
- Tested `/api/conversions/s2s` with incorrect, missing, and valid `X-Merchant-Secret` values to enforce merchant identity.
