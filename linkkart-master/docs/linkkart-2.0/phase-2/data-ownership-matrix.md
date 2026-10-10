# LINKKART 2.0 — PHASE 2: DATA OWNERSHIP MATRIX

This matrix outlines how each major entity in the LinkKart system is currently owned, and how it will be owned in the new multi-tenant architecture.

| Entity | Current Ownership | Future Ownership | Tenant Scoped? | Global? | Relationship |
| ------ | ----------------- | ---------------- | -------------- | ------- | ------------ |
| **User** | None (Root) | None (Root) | No | Yes | Core Identity |
| **Role** | None (Root) | None (Root) | No | Yes | Platform Role |
| **Organization (NEW)** | N/A | None (Root) | Yes (Self) | No | Tenant Root |
| **OrganizationMember (NEW)** | N/A | Organization | Yes | No | Connects User & Org |
| **MerchantProfile** | User | Deprecate/Migrate | No | No | (Will map business info to Org) |
| **AffiliateProfile** | User | User | No | Yes | Affiliate Info |
| **Product** | User (merchant) | Organization | Yes | No | Owned by Tenant |
| **Campaign** | User (merchant) | Organization | Yes | No | Owned by Tenant |
| **CampaignProduct** | Campaign | Organization (via Campaign) | Yes | No | Join Table |
| **Category** | None | None | No | Yes | Global lookup |
| **CampaignAffiliate** | Campaign & User | Organization (via Campaign) & User | Yes | No | Cross-Entity Join |
| **AffiliateLink** | User (Affiliate) & Campaign | User & Organization (via Campaign) | Yes | No | Cross-Entity Join |
| **Click** | AffiliateLink | Organization (via Link/Campaign) | Yes | No | Event data |
| **Conversion** | AffiliateLink | Organization (via Link/Campaign) | Yes | No | Financial event |
| **Commission** | Conversion & User (Aff) | Organization (via Conv) & User | Yes | No | Financial event |
| **Payout** | User (Affiliate) | User (Affiliate) | No | No | Owned by Affiliate |
| **Report** | User | Organization (for merchants) or User (for affiliates) | Yes/No | No | Scoped to owner |
| **Notification** | User | User | No | No | Personal alerts |
| **AuditLog** | User (Admin) | Organization (tenant) or Platform | Yes/No | No | Action trace |
| **FraudSignal** | Conversion | Organization (via Conversion) | Yes | No | System generated |
| **Feedback** | User | Organization | Yes | No | User submitted |
| **ChatHistory** | User | User | No | No | AI history |
| **RefreshToken** | User | User | No | No | Auth |

## Key Decisions
1. **Products and Campaigns** become strictly `Organization` owned. The `merchant_id` columns will be replaced with `organization_id`.
2. **Affiliates** remain independent `User` entities. They do not belong to an `Organization`. They participate in an `Organization`'s programs via `CampaignAffiliate`.
3. **Payouts** remain tied to the `Affiliate` (User) directly, as they aggregate commissions earned by the affiliate across multiple campaigns/organizations. (Note: Later phases may introduce organization-specific payout processing).
4. **MerchantProfile** will be functionally superseded by `Organization`. Existing merchant profiles will be migrated to `Organization`s, and the users will become `OrganizationMember`s (OWNERs) of those organizations.
