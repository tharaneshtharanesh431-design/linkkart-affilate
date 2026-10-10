# Tracking API Documentation

## Click Tracking (Redirect Endpoint)
`GET /t/{code}`
- **Description**: Public endpoint that resolves an affiliate shortcode, logs a click (with a new `tracking_id`), and redirects the user to the merchant site with the `tracking_id` appended to the URL (e.g., `?lk_tracking_id=...`).
- **Rate Limit**: 50 requests/minute per IP.

## Server-to-Server Conversion Postback
`POST /api/conversions/s2s`
- **Description**: S2S endpoint used by Merchants to report successful transactions.
- **Headers**: `X-Merchant-Secret` (required)
- **Body**:
  ```json
  {
    "trackingId": "UUID",
    "orderReference": "string",
    "orderAmount": "decimal"
  }
  ```
- **Rate Limit**: 100 requests/minute per IP.

## Conversion Verification (Merchant API)
`GET /api/conversions/merchant`
- **Description**: Used by the Merchant Dashboard to view conversion ledger.
- **Auth**: Requires valid Bearer Token for the logged-in Merchant.
