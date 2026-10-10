# Attribution Rules

## Last Valid Affiliate Click
LinkKart uses a **Last Valid Affiliate Click** deterministic attribution model. The system attributes conversions securely using a unique UUID (`tracking_id`) generated exactly at the moment of click.

### Validation Gates
For attribution to be successful, the following must hold true:
1. **Valid Link**: The `tracking_id` must map to a known, valid `Click`.
2. **Valid Association**: The `Click` must map to an active `AffiliateLink`.
3. **Active Campaign**: The linked `Campaign` must be in the `ACTIVE` status at the time of conversion.
4. **Active Affiliate**: The linked `Affiliate` must still be actively participating (`APPROVED`) in the `Campaign` at the time of conversion.

## 30-Day Attribution Window
The timestamp of the `Click` must be within the allowed time window defined by the Campaign's `clearing_period_days`. If `converted_at - clicked_at` exceeds this duration, the conversion is firmly rejected and discarded.
