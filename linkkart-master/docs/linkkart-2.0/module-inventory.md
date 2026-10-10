# Module Inventory

| Module | Purpose | Main Files | Dependencies | Status |
| ------ | ------- | ---------- | ------------ | ------ |
| Authentication | User auth and JWT generation | `AuthController`, `AuthService`, `JwtService` | Spring Security, JJWT | IMPLEMENTED |
| Users / Profiles | Manage Merchant and Affiliate details | `ProfileController`, `ProfileService`, `User` | Spring Data JPA | IMPLEMENTED |
| Products | Merchants creating/managing products | `ProductController`, `ProductService`, `Product` | DB, Auth | IMPLEMENTED |
| Campaigns | Connecting products to affiliate promotions | `CampaignController`, `CampaignService` | Products | IMPLEMENTED |
| Affiliate Links | Generating tracking URLs | `AffiliateLinkController`, `AffiliateLinkService` | Campaigns | IMPLEMENTED |
| Tracking & Redirects | Logging clicks and redirecting | `RedirectController` | AffiliateLinks | IMPLEMENTED |
| Conversions | Server-to-Server postback and sales logging | `ConversionController`, `ConversionService` | Tracking | IMPLEMENTED |
| Commissions | Calculating affiliate earnings | `CommissionController`, `CommissionService` | Conversions | IMPLEMENTED |
| Payouts | Financial withdrawals by affiliates | `PayoutController`, `PayoutService` | Commissions | PARTIAL |
| Fraud Detection | Blocking bad clicks/conversions | `FraudDetectionService`, `FraudController` | Clicks | PARTIAL |
| AI / Gemini | Chat and content generation | `AiController`, `AiService` | WebClient, Gemini API | MOCKED |
| Notifications | Email / In-app alerts | `NotificationService`, `EmailService` | User, DB | MOCKED |
| Analytics | Reporting dashboards | `AnalyticsController`, `AnalyticsService` | DB Aggregation | PARTIAL |
