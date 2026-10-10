# Database Audit

## Entities
- **User:** Primary authentication model. Role enum (ADMIN, MERCHANT, AFFILIATE). No tenant isolation.
- **MerchantProfile / AffiliateProfile:** Extended user data linked via OneToOne.
- **Product:** Owned by MerchantProfile. Base for campaigns.
- **Campaign:** Configures commission rules.
- **CampaignAffiliate:** Join table tracking affiliate approvals.
- **AffiliateLink:** Unique URL generation.
- **Click:** Records IPs, UserAgent. Missing soft deletes. Synchronous insert.
- **Conversion:** Tied to a click.
- **Commission:** Automatically generated on conversion.
- **Payout:** Affiliate request. Status driven.
- **FraudSignal:** Log of suspicious activity on clicks/conversions.
- **ChatHistory:** Logs AI interactions.

## Assessment
The database is heavily relational and lacks partitioning or logical sharding (Tenant ID). It works for MVP but will not support high-volume click tracking or enterprise multi-tenancy without major schema upgrades.
