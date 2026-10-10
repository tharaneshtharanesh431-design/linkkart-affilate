# Tracking & Attribution Architecture

## Core Components
- **RedirectController**: Handles incoming clicks from affiliates (`/t/{code}`). Validates the tracking link, verifies campaigns, creates a `Click` record with a newly generated `tracking_id`, and safely redirects to the trusted `target_url` from the database.
- **ConversionController**: Handles secure Server-to-Server postbacks (`/api/conversions/s2s`). Uses merchant integration secrets to validate incoming events and trigger attribution.
- **ConversionServiceImpl**: Core attribution logic. Processes the `tracking_id` passed by the merchant, looks up the original click, and securely creates a Conversion mapped to the appropriate `AffiliateLink`.

## Data Model
- **AffiliateLink**: Represents a trusted relationship between an Affiliate and a Campaign/Product.
- **Click**: Contains timestamp, IP Hash, User-Agent, and explicitly the unique `tracking_id`.
- **Conversion**: Contains order metadata (`order_reference`, `order_amount`), linked to `AffiliateLink` directly based on the `tracking_id` from the matching `Click`.

## Storage
MySQL is used via Spring Data JPA. Database deduplication is enforced at the schema level. Flyway migration `V5__tracking_attribution.sql` adds performance indexes for fraud analysis.
