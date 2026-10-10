# LinkKart 2.0 - Phase 5 Tracking Architecture Report

## Overview
This report outlines the implementation details and verifications performed for the **Phase 5 Tracking and Attribution Engine**. The tracking architecture acts as the heart of LinkKart's core loop, funneling clicks and conversions into commissions through a highly secure, tenant-isolated architecture.

## 1. Tracking Architecture Model

### Entities involved:
- **AffiliateLink**: Represents a tracking link mapped uniquely to a combination of an Affiliate, a Product, and a Campaign. Each link gets a globally unique 10-character `code`.
- **Click**: Logs when an external user clicks on a tracking link. It creates a short-lived session tracking ID (`trackingId`) to track downstream conversions while remaining stateless on the browser end.
- **Conversion**: Captures when a tracked click leads to a successful purchase or action (e.g., via a backend webhook).
- **Commission**: Generated automatically from a successful conversion event, calculating the pending monetary reward based on the active campaign parameters.

### Tracking Process (Last-Click Attribution):
1. **Link Generation**: Handled by `AffiliateLinkServiceImpl`. The system ensures that the affiliate's participation in the specified campaign is exactly `ACTIVE`.
2. **Link Resolution (`/t/{code}`)**: Managed by `RedirectController`.
    - **Validation**: Ensures the Campaign is `ACTIVE`, the Product is `ACTIVE`, and the `CampaignAffiliate` status is `ACTIVE`.
    - **Anonymization**: The IP Address is hashed with a system-wide `ipSalt` for privacy before recording.
    - **Click Tracking**: A new UUID `tracking_id` is created and appended to the final redirect URL (`?lkrt_click=trk_...`). Duplicate clicks within 60 seconds reuse the same `tracking_id`.
    - **Fraud Hook**: Triggered asynchronously for bot or click-burst detection.
3. **Conversion Webhook**: Hits `/api/conversions` using the `trackingId` and an external `orderReference`.
    - Retrieves the original `Click`.
    - Checks the tenant API keys (Merchant Secret) against the `Organization` associated with the campaign.

## 2. Security and Tenant Isolation
- Tracking endpoints do not expose `organization_id`, `affiliate_id`, or `campaign_id` directly in payloads, preventing public IDORs and unauthorized organization/affiliate injection. They operate entirely via the 10-character code or the opaque `trackingId`.
- Internal operations strictly map these opaque strings to internal relational entities. If a merchant's API secret is wrong or missing, the conversion is rejected.

## 3. Idempotency Mechanisms
Conversions are strictly idempotent by design within an organization to prevent double counting:
- Evaluated in `ConversionServiceImpl.recordConversion()`.
- Repository query: `existsByOrderReferenceAndAffiliateLink_Campaign_Organization_Id(orderReference, orgId)`.
- **Outcome**: A repeated web hook for the same `orderReference` (belonging to the same Organization) will return a safe, valid response immediately without re-calculating commissions or creating duplicate conversion entries.

## 4. Fraud Hooks Implemented
Integrated with `FraudDetectionService`:
- **Click Path**: Captures bot signatures and click-burst patterns.
- **Conversion Path**: Checks for anomalous conversion rates relative to the recorded clicks and suspends payouts if suspicious (Status: FRAUD).

## Verification Summary
- **Unit & Integration Tests**: `Phase5TrackingIntegrationTest` passing, validating the idempotency, missing secret rejection, and active affiliate validation.
- **Total test suites passing**: 56 out of 56 tests across the platform suite.
- **Build Status**: Green
- **Financial Architecture (Phase 6)**: Ready to proceed. No financial settlement logic (like payout processing or ledger ledgers) has been introduced into Phase 5.
