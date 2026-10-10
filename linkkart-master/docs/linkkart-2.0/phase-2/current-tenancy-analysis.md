# LINKKART 2.0 — PHASE 2: CURRENT TENANCY ANALYSIS

## Executive Summary
The current architecture of LinkKart operates on a single-tenant, user-centric ownership model. Instead of having a centralized `Organization` or `Workspace` that owns business data, all merchant-related entities (Products, Campaigns) are directly owned by a specific `User` (where `Role = MERCHANT`). 

This model limits the platform from true B2B SaaS capabilities, as it ties business data to a single user account rather than a business entity that multiple users can manage.

## Current Ownership Flow

```
User (Role: MERCHANT)
├── MerchantProfile (1:1) - Holds business name, website, and integration secret
├── Product (1:N, mapped via merchant_id)
├── Campaign (1:N, mapped via merchant_id)
```

```
User (Role: AFFILIATE)
├── AffiliateProfile (1:1) - Holds payment email, social links, tax ID
├── CampaignAffiliate (1:N) - Maps affiliate to Campaign
├── AffiliateLink (1:N)
├── Commission (1:N)
├── Payout (1:N)
```

## Entity Analysis

1. **User**: The root entity for both Merchants and Affiliates. Authentication and roles (`MERCHANT`, `AFFILIATE`, `ADMIN`) are tied here.
2. **MerchantProfile**: A 1:1 extension of the `User` entity that holds business-specific details like `businessName` and `integrationSecret`. Currently, the integration secret is tied to the profile, which is tied to the user.
3. **AffiliateProfile**: A 1:1 extension of the `User` entity that holds affiliate-specific details.
4. **Product**: Has a `merchant_id` pointing to `User`.
5. **Campaign**: Has a `merchant_id` pointing to `User`.
6. **CampaignAffiliate**: Connects a `Campaign` and a `User` (Affiliate).
7. **AffiliateLink**: Connects an `Affiliate` (User), a `Campaign`, and a `Product`.
8. **Click / Conversion**: Tied to `AffiliateLink`.
9. **Commission**: Tied to `Conversion` and `Affiliate` (User).
10. **Payout**: Tied to `Affiliate` (User).
11. **Report**: Tied to `User`.
12. **Notification**: Tied to `User`.
13. **AuditLog**: Tied to `admin_user_id` (User).
14. **ChatHistory**: Tied to `user_id`.

## Security & Isolation Mechanisms
Currently, authorization relies heavily on checking if the `User` (from `SecurityContext`) matches the `merchant_id` or `affiliate_id` of the resource. There is no concept of team or organization membership.

## Architectural Changes Needed
1. Create `Organization` entity to represent a merchant business.
2. Extract business data (`businessName`, `websiteUrl`, `integrationSecret`) from `MerchantProfile` into `Organization` (or link `Organization` to `MerchantProfile`).
3. Replace `merchant_id` in `Product` and `Campaign` with `organization_id`.
4. Create `OrganizationMember` to allow multiple `User`s to manage the same `Organization`.
5. Update `CampaignAffiliate` to continue linking `Campaign` (now organization-owned) to `Affiliate` (User).
6. Update authorization checks (tenant isolation) to verify `OrganizationMembership` rather than a direct `User` match.
