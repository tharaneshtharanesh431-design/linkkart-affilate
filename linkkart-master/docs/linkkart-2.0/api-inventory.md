# API Inventory

## Auth (`/api/auth`)
- `POST /register`: IMPLEMENTED
- `POST /login`: IMPLEMENTED

## Profile (`/api/profile`)
- `GET /merchant`, `PUT /merchant`: IMPLEMENTED
- `GET /affiliate`, `PUT /affiliate`: IMPLEMENTED

## Products & Campaigns
- `POST /api/products`: IMPLEMENTED
- `GET /api/products`: IMPLEMENTED
- `POST /api/campaigns`: IMPLEMENTED
- `POST /api/campaigns/{id}/join`: IMPLEMENTED

## Tracking & Conversions
- `GET /r/{code}`: IMPLEMENTED (Synchronous redirect + click log)
- `POST /api/conversions`: IMPLEMENTED

## Financials
- `GET /api/commissions/*`: IMPLEMENTED
- `POST /api/payouts/request`: PARTIAL (DB only, no real payment)

## AI & Fraud
- `POST /api/ai/chat`: MOCKED (Fallback to hardcoded string on error)
- `GET /api/fraud/signals`: IMPLEMENTED
