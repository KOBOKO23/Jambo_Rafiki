# Frontend Configuration Guide (Align To Current Backend)

Use this document in your frontend workspace to align implementation to the backend contract.

Primary backend contract source:
- See `apis.md` for full endpoint list and request/response details.

## 1) Frontend Environment Configuration

Set these frontend env values (example names shown for Vite/React):

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_ENABLE_CREDENTIALS=true
VITE_SENTRY_DSN=<frontend-sentry-dsn-if-used>
VITE_APP_ENV=production
```

Notes:
- Always target `/api/v1` as the default API base.
- Keep a fallback switch only if you intentionally support legacy `/api` routes.

## 2) HTTP Client Rules

Configure a single shared API client.

Requirements:
1. Base URL must be `VITE_API_BASE_URL`.
2. Include credentials for session-auth endpoints:
   - `withCredentials: true`
3. Send `Content-Type: application/json` for JSON requests.
4. Handle CSRF for admin/session-auth write operations (`POST`, `PATCH`, `PUT`, `DELETE`).

Recommended behavior:
1. Add a response interceptor for common errors:
   - `400`: show field validation errors
   - `401/403`: auth/permission handling
   - `429`: rate-limit retry UI message
   - `500`: generic error and logging
2. Add request timeout and retry only for idempotent `GET` calls.

## 3) Media/Image URL Handling (S3-Compatible)

Backend now supports S3 media when configured (`USE_S3_MEDIA=True`).

Frontend rule:
1. Prefer backend-provided absolute fields such as `image_url` and `photo_url` when available.
2. Treat image/file values from API as absolute URLs when they start with `http`.
3. Treat as relative URLs otherwise and prepend API origin.

Safe resolver logic:
1. If url starts with `http://` or `https://`: use as-is.
2. Else: prepend backend origin (not frontend origin).

This guarantees compatibility for:
- local/dev media (`/media/...`)
- S3/CloudFront media (`https://cdn.../...`)

## 4) Authentication and Access Model

Backend access model:
1. Public endpoints are explicitly `AllowAny`.
2. Admin endpoints require staff/admin session (`IsAdminUser`).

Frontend implications:
1. Keep public pages/forms fully unauthenticated.
2. Gate admin screens behind authenticated staff flow.
3. Do not assume JWT unless separately added; current backend is session-auth oriented.

## 5) Organization Configuration For Frontend

Use the public organization config endpoint as the single source of truth for site contact and bank transfer details:

- `GET /api/v1/organization/`

Expected response shape:

```json
{
   "website": {
      "domain": "www.jamborafiki.org",
      "url": "https://www.jamborafiki.org"
   },
   "contact": {
      "email": "infodirector@jamborafiki.org",
      "call_redirect_number": "+254799616542",
      "call_redirect_url": "tel:+254799616542"
   },
   "bank_account": {
      "bank_code": "07",
      "branch_code": "123",
      "swift_code": "CBAFKENX",
      "account_name": "Benjamin Oyoo Ondoro",
      "account_number": "1002622088"
   },
   "timestamp": "ISO datetime"
}
```

Frontend rules:
1. Use `call_redirect_url` or `call_redirect_number` for all call-to-action links.
2. Display `contact.email` wherever public contact email is shown.
3. Display `website.domain` and `website.url` in footer, header, and SEO/contact surfaces.
4. Render donation/bank transfer instructions from `bank_account` instead of hardcoding values in UI components.
5. Treat this endpoint as public and cacheable, but keep a fallback state if it is unavailable.

## 6) Endpoint Grouping To Implement

Use these feature groups in frontend services:
1. Operations:
   - `GET /health/`
   - `GET /ready/`
   - `GET /organization/`
2. Contacts:
   - public submit
   - admin listing/detail/mark-read
3. Donations:
   - `mpesa` (async default)
   - `mpesa-async` (alias)
   - `mpesa-sync` (immediate)
   - `stripe` (intent creation)
   - admin reconciliation
4. Volunteers:
   - public submit
   - admin listing/detail/status update
5. Newsletter:
   - subscribe
   - unsubscribe
   - admin listing/detail
6. Sponsorships:
   - public children list/detail
   - public interest submit
   - admin sponsors/sponsorship CRUD
    - use `photo_url` for child images
7. Gallery:
   - categories list/detail by slug
   - photos list + filters/search/order
   - featured
   - random
    - use `image_url` for rendered photo assets
8. Testimonials:
   - public list approved
   - public submit
   - admin pending/detail/approve/reject

## 7) Critical Response/Status Handling

Implement exact handling for these backend behaviors:

1. Donations
- `POST /donations/mpesa/` returns `202` (queued).
- `POST /donations/stripe/` returns `202` (requires webhook completion).

2. Newsletter
- subscribe may return:
  - `201` new subscription
  - `200` already subscribed or re-subscribed

3. Throttling
- Public forms and payment paths can return `429`.
- Show user-friendly retry messaging.

4. Validation
- `400` returns field-level serializer errors.
- Map backend field names directly to form errors.

## 8) Type/Model Alignment Checklist

Create frontend types directly from backend serializers/enums in `apis.md`.

Must align:
1. Donation enums:
   - payment method, status, donation type, currency
2. Volunteer status enum
3. Testimonial role and status enums
4. Pagination response shape
5. Reconciliation response structure

Rule:
- Do not invent fields not present in backend contract.

## 9) Form Field Mapping Checklist

Before release, verify each form sends exact backend fields:

1. Contact form:
- `name`, `email`, `subject`, `message`

2. Volunteer form:
- `name`, `email`, `phone`, `location`, `skills`, `availability`, `duration`, `motivation`, optional `experience`, optional `areas_of_interest`

3. Newsletter form:
- subscribe: `email`, optional `name`, optional `source`
- unsubscribe: `email`

4. Testimonial form:
- `name`, `email`, `role`, optional `role_custom`, `text`

5. Donation forms:
- mpesa: donor details + amount/currency/type/purpose/message/is_anonymous
- stripe: same donation fields + optional payment_method_id

6. Organization config usage:
- read-only data from `GET /api/v1/organization/`
- no form submission required

## 10) QA/Verification Script For Frontend Team

Run this after alignment:

1. Confirm all API calls use `/api/v1` base.
2. Confirm no frontend call targets webhook endpoints directly.
3. Confirm admin requests include session + CSRF flow.
4. Confirm image rendering works for both relative and absolute URLs.
5. Confirm organization contact/bank details are sourced from `/api/v1/organization/`.
6. Confirm call CTA opens `tel:+254799616542`.
7. Confirm 202/200/201/429 cases are handled in UI state.
8. Confirm all API services map to endpoint groups listed above.

## 11) Copy-Paste Prompt For Copilot In Frontend Workspace

```text
Use frontend_backend_alignment.md and apis.md as the source of truth.

Task: realign this frontend codebase to the current backend.

Requirements:
1) Replace any non-versioned backend calls with /api/v1 base usage.
2) Build/normalize one shared API client with credentials support and consistent error handling.
3) Align all request payloads and response parsing with apis.md.
4) Add organization config support from GET /api/v1/organization/ and use it for call/email/bank details.
5) Add strict handling for these response cases:
   - donations mpesa/stripe => 202 async flow
   - newsletter subscribe => 200 or 201
   - throttling => 429
6) Ensure admin-only endpoints are only used from admin flows.
7) Add/update TypeScript types/enums to match backend enums and serializer fields.
8) Implement robust media URL resolver for both relative URLs and S3/CloudFront absolute URLs.
9) Provide a final report grouped by domain:
   contacts, donations, volunteers, newsletter, sponsorships, gallery, testimonials, operations.

Constraints:
- Do not add fields that are not in backend contract.
- Keep UI behavior unchanged unless required for API correctness.
- Prefer minimal safe refactors.
```

## 12) Final Recommendation

When running frontend realignment, use this order:
1. API client/base URL/CSRF
2. Endpoint path normalization
3. Payload and response shape fixes
4. Types/enums sync
5. UI error-state and async-flow adjustments
6. End-to-end QA pass

## 13) Backend/Frontend Sync Checklist

Use this as a final release gate:

1. All API calls point to `/api/v1`.
2. Admin-only screens use session auth + CSRF.
3. Donation flows handle `202` async responses correctly.
4. Newsletter subscribe handles both `200` and `201`.
5. Public form and payment errors handle `429` gracefully.
6. Organization contact/bank details are read from `/api/v1/organization/`.
7. Call CTAs use `tel:+254799616542`.
8. Image rendering uses `image_url` and `photo_url` when present.
9. No frontend code calls webhook endpoints directly.
10. TypeScript types match backend enums and serializer fields.
11. Pagination handling matches DRF response shape.
12. All public form payloads match backend field names exactly.

## 14) One-Shot Copilot Prompt

Paste the prompt below into Copilot in your frontend workspace:

```text
Use frontend_backend_alignment.md and apis.md as the source of truth.

Realign this frontend codebase to the backend with the following rules:
1) Use /api/v1 as the default base URL for all backend calls.
2) Keep admin routes session-auth + CSRF based; do not assume JWT.
3) Align all request payloads, response parsing, and error handling to apis.md.
4) Add support for GET /api/v1/organization/ and use it to populate call/email/bank transfer details.
5) Handle backend status codes exactly:
   - donations mpesa/stripe => 202
   - newsletter subscribe => 200 or 201
   - throttling => 429
   - validation => 400
6) Prefer backend-provided image_url/photo_url fields for media rendering.
7) Ensure no frontend code calls webhook endpoints directly.
8) Add/update shared types and enums to match backend serializers.
9) Keep changes minimal and safe; do not invent backend fields.
10) Return a concise report grouped by domain:
   contacts, donations, volunteers, newsletter, sponsorships, gallery, testimonials, operations.
```
