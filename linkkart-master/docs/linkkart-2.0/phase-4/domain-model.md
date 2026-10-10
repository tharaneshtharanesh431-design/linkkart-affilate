# Phase 4 - Domain Audit

## 1. Existing Working Components
- **Organization & OrganizationMember**: Accurately capture multi-tenant relationships. Owner/Member roles dictate tenant access control.
- **AffiliateProfile**: Maintains the affiliate's global platform persona independently from specific campaigns or tenants. Currently holds `paymentEmail`, `websiteUrl`, `socialLinks`, `taxId`.
- **Product**: Contains core attributes (`name`, `price`, `imageUrl`) and maps exclusively to `Organization`. Supports `ACTIVE` and `INACTIVE` statuses.
- **Campaign**: Maps to `Organization` and tracks `commissionRate`, `commissionType`, `clearingPeriodDays`. Has an existing `@ManyToMany` join table `campaign_products` for Products.
- **CampaignAffiliate**: Exists as an intersection (`campaign_id`, `affiliate_id`) showing an Affiliate’s participation in a specific Campaign. Contains a `status` field (defaulting to `"APPROVED"`).
- **Security & Workflows**: Auth boundaries are hardened against cross-tenant IDOR. Existing tests confirm `Product` and `Campaign` mutations are bound securely.

## 2. Incomplete Components
- **Organization Profile Data**: `Organization` acts purely as a tenancy boundary right now. It lacks public business profiles (e.g., description, logoUrl, industry, location, contactEmail).
- **Affiliate Profile Data**: The profile lacks soft presentation fields (e.g., displayName, bio, niche, audienceSize, profileImageUrl).
- **Campaign Management API**: `CampaignServiceImpl` hardcodes campaign creation implicitly during product creation. It lacks explicit API methods to manage `Campaign` dates (`startDate`, `endDate`), budgets, and explicitly attach/detach `Product` entities.
- **Campaign Participation Lifecycle**: `CampaignAffiliate` defaults to `"APPROVED"`. There is no robust state machine implemented (e.g., `INVITED`, `PENDING`, `REJECTED`, `SUSPENDED`).
- **Affiliate Discovery API**: Lacks search/filtering over the `AffiliateProfile` pool.

## 3. Duplicated or Legacy Code
- `MerchantOnboardingRequest` asks for `businessName` and `websiteUrl`, but these just patch the `Organization` directly. No `MerchantProfile` entity remains, which is good (removed during Phase 2). The codebase successfully transitioned to the `Organization` concept.

## 4. Planned Schema Updates
- **Organization**: Add `description` (TEXT), `logo_url` (VARCHAR), `industry` (VARCHAR), `contact_email` (VARCHAR), `location` (VARCHAR).
- **AffiliateProfile**: Add `display_name` (VARCHAR), `bio` (TEXT), `niche` (VARCHAR), `audience_size` (VARCHAR), `profile_image_url` (VARCHAR), `status` (VARCHAR).
- **Campaign**: Add `description` (TEXT), `start_date` (DATE), `end_date` (DATE), `budget` (DECIMAL).
- **CampaignAffiliate**: Lifecycle statuses: `INVITED`, `PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `SUSPENDED`, `COMPLETED`.

## 5. Architectural Rule Adherence
- `Affiliate` -> `CampaignAffiliate` -> `Campaign` -> `Organization` is fully maintained.
- Products belong exclusively to the `Organization`.
- Campaign products are strictly validated to belong to the Campaign's `Organization`.
