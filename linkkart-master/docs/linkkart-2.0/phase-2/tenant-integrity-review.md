# LINKKART 2.0 — PHASE 2 TENANT INTEGRITY REVIEW

## 1. DOMAIN OWNERSHIP GRAPH

| Entity | Classification |
| :--- | :--- |
| `Organization` | **GLOBAL** (Root tenant container) |
| `OrganizationMember` | **RELATIONSHIP ENTITY** (User <-> Organization) |
| `User` | **GLOBAL** (Can belong to multiple Orgs as members, or as Affiliates to multiple campaigns) |
| `Product` | **DIRECTLY ORGANIZATION OWNED** |
| `Campaign` | **DIRECTLY ORGANIZATION OWNED** |
| `CampaignAffiliate` | **RELATIONSHIP ENTITY** (Affiliate <-> Campaign) |
| `Affiliate` | **GLOBAL** (Role assigned to a User) |
| `AffiliateLink` | **RELATIONSHIP ENTITY** (Affiliate <-> Campaign) |
| `Click` | **INDIRECTLY ORGANIZATION OWNED** (via `AffiliateLink -> Campaign -> Organization`) |
| `Conversion` | **INDIRECTLY ORGANIZATION OWNED** (via `AffiliateLink -> Campaign -> Organization`) |
| `Commission` | **INDIRECTLY ORGANIZATION OWNED** (via `Conversion -> ... -> Organization`) |
| `Payout` | **AFFILIATE OWNED** (and Platform Owned. Payouts are aggregated at the platform level, not per organization) |
| `FraudSignal` | **INDIRECTLY ORGANIZATION OWNED** (via `Conversion`) / **AFFILIATE OWNED** (via `Payout`) |
| `Notification` | **USER OWNED** |
| `RefreshToken` | **USER OWNED** |
| `Category` | **GLOBAL** |

## 2. AFFILIATE CROSS-ORGANIZATION TEST

Affiliates legitimately participate in multiple organizations.
- Affiliates interact with specific `Campaigns` through the `CampaignAffiliate` and `AffiliateLink` entities.
- This creates no tenant leakage because the relationship isolates data (e.g., clicks and conversions) to the specific `AffiliateLink` and, consequently, the specific `Organization`.
- Affiliates only see their own commissions/payouts, while Organizations only see conversions associated with their campaigns.

## 3. TENANT ISOLATION AUDIT

- **Product / Campaign**: Isolation is correctly enforced. The services use `findById(id)` and immediately follow up with `checkProductOwnership()` / `checkCampaignOwnership()`.
- **Payout**: Correctly restricted via `findByAffiliateOrderByRequestedAtDesc(affiliate)` for standard users, and strictly via Admin interfaces for others.
- **Conversion / Commission**: The `getMerchantConversions()` and `getMerchantCommissions()` functions correctly enforce context by querying based on the authenticated user's organization/email.
- 🚨 **RESOLVED CRITICAL FINDING (Conversion)**: The `updateConversionStatus` method in `ConversionServiceImpl` was previously vulnerable to IDOR. This has been fixed to enforce proper tenant ownership checks.

## 4. IDOR TEST MATRIX

Current Test Coverage (based on `AuthorizationIDORTest` and `ConversionIDORTest`):

| Resource | Action | IDOR Test Exists? | Actual Test Result |
| :--- | :--- | :--- | :--- |
| **Product** | Update (Cross-tenant) | Yes | **PASS** (403 AccessDeniedException) |
| **Product** | Update (Affiliate) | Yes | **PASS** (403 AccessDeniedException) |
| **Campaign** | Update/Delete | No | *Untested* (Code looks safe, but no test) |
| **Conversion** | Update Status | Yes | **PASS** (403 AccessDeniedException) |
| **Payout** | Admin Actions | No | *Untested* |

## 5. DATA MIGRATION SAFETY

The V2 migration (`V2__multi_tenant_organizations.sql`) is **SAFE**:
- It successfully selects existing records from `merchant_profiles` and inserts them into `organizations`.
- It maps the users properly to `organization_members` as `OWNER`.
- It dynamically links `products` and `campaigns` to the newly established `organization_id` using correlated subqueries mapping the old `user_id`.
- Old constraint/column removal is safely executed at the end.
- It does **not** drop the legacy `merchant_profiles` table, preserving historical records for rollback safety.

## 6. ORGANIZATION MEMBER SECURITY

- Organizations are only created upon onboarding by a valid `MERCHANT` user who hasn't onboarded yet.
- Membership management (adding new members) is currently absent (not exposed via API), meaning there is no risk of unauthorized users hijacking or joining organizations at this stage.

## 7. PLATFORM ADMIN VS ORGANIZATION USER

- **PLATFORM_ADMIN**: Currently operates globally, pulling all records bypassing tenant filters (e.g., in `ProductServiceImpl`, `CampaignServiceImpl`).
- **Organization OWNER**: Isolated to their own `Organization`'s data via `organizationMemberRepository` lookups.
- **Organization ADMIN / MEMBER**: Not fully distinguished yet, as the application logic relies predominantly on `ROLE_MERCHANT` and the simple presence of an `OrganizationMember` record. 

## 8. LEGACY MERCHANT TERMINOLOGY

Terminologies like `MerchantAffiliateController`, `getMerchantConversions()`, and `MerchantProfile` in older contexts remain throughout the codebase.
- **Status**: **SAFE LEGACY NAMING**
- These names are architecturally inconsistent but do not introduce security risks. They should be refactored in a future API cleanup phase to prevent breaking current clients.

## 9. FRONTEND TENANT CONTEXT

The backend remains completely authoritative. The controllers and services (like `CampaignServiceImpl` and `ProductServiceImpl`) derive the `Organization` from `SecurityContextHolder.getContext().getAuthentication()`, rather than relying on `organizationId` payloads from the client. No unsafe client-side authorization assumptions were found.
