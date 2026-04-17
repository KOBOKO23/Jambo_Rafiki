# API Contract Integration

## Contract authority

Use these files as contract authority before changing frontend requests:

- Docs/04-API-Contract-Integration.md
- Docs/05-Frontend-Feature-Guide.md
- Docs/07-Deployment-Runbook.md
- Docs/09-AWS-Backend-Handover.md

## Shared API client

All request logic is centralized in:

- src/services/api.ts

Do not add direct fetch calls in page components.

## Base URL behavior

API base is built from runtime config and normalized to include /api/v1.

Export to reference:

- API_BASE_URL from src/services/api.ts

## Endpoint groups used by frontend

Organization:

- GET /organization/

Auth and CSRF:

- POST /admin/auth/login/
- POST /admin/auth/logout/
- GET /admin/auth/me/
- GET /admin/auth/csrf/

Public forms:

- POST /contacts/
- POST /volunteers/
- POST /newsletter/
- POST /newsletter/unsubscribe/
- POST /testimonials/
- POST /sponsorships/interest/

Donations:

- POST /donations/mpesa/
- POST /donations/stripe/

Gallery:

- GET /gallery/categories/
- GET /gallery/photos/
- GET /gallery/photos/featured/
- GET /gallery/photos/random/

Health/readiness:

- GET /health/
- GET /ready/

Admin resources:

- /admin/overview/
- /admin/audit-events/
- /admin/background-jobs/
- /admin/site-settings/
- /admin/pages/
- /admin/page-sections/
- /admin/navigation-menus/
- /admin/navigation-items/
- /admin/banners/
- /admin/redirect-rules/
- /admin/media-assets/
- /admin/content-revisions/
- /admin/gallery/categories/
- /admin/gallery/photos/

## Payload and type safety

Use exported TypeScript interfaces and union types in src/services/api.ts, including:

- DonationType
- DonationCurrency
- TestimonialRole
- ContactFormData
- MPesaDonation
- StripeDonation
- VolunteerApplication
- NewsletterSubscription
- SponsorshipInterest
- TestimonialSubmission

## Error handling expectations

Client fallback messages currently map:

- 400 invalid request
- 403 permission denied
- 429 retry later
- 500+ server error

Do not surface raw backend internals to users.

## Credentials and CSRF behavior

Client supports credentials mode via runtime variable VITE_ENABLE_CREDENTIALS.

Mutating requests rely on CSRF flow from backend.

Backend must:

- return CSRF token endpoint response
- accept token on mutating routes
- allow frontend origin and credentials via CORS

## Integration anti-patterns

Avoid the following:

- hardcoding endpoint URLs in components
- using undocumented payload fields
- calling webhook endpoints from browser
- bypassing typed API wrappers
