# Admin Dashboard CMS Spec

This document is a frontend build brief for a separate React-based admin UI.

Goal:
- Build a secure, scalable, staff-only content platform that can handle both CMS work and operational moderation without using Django admin.
- Use the existing backend APIs in `apis.md` as the source of truth. The backend now includes a first-class admin CMS API under `/api/v1/admin/` and matching content models.
- Prefer industry-standard patterns: session auth, CSRF protection, server-side pagination, role gates, auditability, publishing workflows, and accessible UI.

Definition of success:
- Staff can create, edit, preview, schedule, publish, and archive content.
- Editors can manage structure, not just records: pages, navigation, banners, media, SEO metadata, and reusable content blocks.
- Moderation tools remain available, but they sit inside a larger content studio rather than defining the whole product.
- The UI should feel like a real editorial console, not an admin list of forms.

## 1) Recommended Frontend Stack

Use a separate React application, not Django admin.

Recommended stack:
- React 18+
- TypeScript
- Vite
- React Router
- TanStack Query for server state
- React Hook Form + Zod for forms and validation
- A component system such as shadcn/ui, Radix UI, or MUI
- Tailwind CSS for layout and theming
- Recharts or Nivo for dashboard charts
- date-fns for dates
- Playwright for end-to-end tests

Recommended app style:
- SPA is fine for this use case.
- Keep the admin under a separate route prefix such as `/dashboard` or `/cms`.
- Do not reuse the Django admin route.
- Use a layout that supports both fast operations and deep content editing: fixed sidebar, contextual inspector, top command bar, and preview-aware detail panes.

## 2) Security and Permission Model

Backend auth reality:
- Backend uses `SessionAuthentication` for protected routes.
- Admin routes require `IsAdminUser`.
- CSRF is required for mutating session-auth requests.

Frontend security rules:
- Store no sensitive tokens in localStorage.
- Use cookies/session auth for admin sessions.
- Send CSRF token on all write requests.
- Protect all dashboard routes with auth guards.
- Redirect unauthenticated users to login.
- Prevent non-admin users from accessing dashboard routes.
- Treat every write action as a privileged operation and confirm before destructive changes.

Recommended permission roles in the UI:
- `super_admin`: full access to everything
- `content_director`: pages, navigation, banners, media, SEO, settings, and all moderation content
- `content_editor`: pages, media, testimonials, gallery, newsletter, and approved content editing
- `community_manager`: testimonials, contacts, volunteers, sponsorships, gallery, newsletter
- `finance_manager`: donations and reconciliation only
- `viewer`: read-only dashboard access

Important implementation note:
- If backend does not yet expose granular role claims, build the UI with role-aware route guards and default all authenticated staff users to `super_admin` behavior until a dedicated permissions endpoint is added.
- For a true CMS, plan for draft, review, scheduled publish, published, and archived states even if the first backend pass still uses simpler moderation states.

## 3) CMS Domain Model To Support

The backend now includes CMS content objects and admin endpoints. The frontend should consume these as first-class modules.

Recommended CMS entities:
- Site settings singleton
- Navigation menus and nested menu items
- Pages with slugs, SEO metadata, and publish status
- Page sections or content blocks with reusable templates
- Homepage hero banners and announcement strips
- Media assets with alt text, captions, usage notes, and categories
- Redirects and slug management
- Content revisions and publish history
- Staff roles and permissions
- Global footer and social link configuration

Recommended CMS workflows:
- Draft editing with autosave
- Preview before publish
- Scheduled publishing
- Version history and rollback
- Soft delete or archive instead of hard delete where possible
- Reusable blocks so the same content can appear on multiple pages
- Asset metadata management, not only file upload

Implemented CMS backend models:
- `SiteSetting` for logo, site title, contact details, social links, and homepage configuration
- `NavigationMenu` and `NavigationMenuItem` for header, footer, and utility navigation
- `Page` for editable public pages
- `PageSection` or `PageBlock` for structured homepage and landing-page content
- `Banner` or `Announcement` for time-bound campaigns
- `MediaAsset` for image metadata, alt text, tags, and reuse tracking
- Page-level SEO fields on `Page` (`seo_title`, `seo_description`, `canonical_url`)
- `RedirectRule` for slug changes and retired pages
- `ContentRevision` for drafts and publish history

Current limitation:
- Granular RBAC models (`Role`/`Permission` by content domain) are not yet exposed as dedicated API resources; admin gating is currently `IsAdminUser`.

Frontend expectation:
- Treat these as first-class modules in the UI.
- Build routes, table views, forms, preview panels, and publish actions directly against the implemented endpoints.
- Only use placeholder screens for capabilities that are truly not implemented.

## 4) Backend APIs Already Available

Use the current backend APIs exactly as documented in `apis.md`.

Base paths:
- Preferred: `/api/v1/`
- Backward-compatible: `/api/`

### Operational
- `GET /health/`
- `GET /ready/`

### Contacts
- `POST /api/v1/contacts/` public submit
- `GET /api/v1/contacts/` admin list
- `GET /api/v1/contacts/{id}/` admin detail
- `PATCH /api/v1/contacts/{id}/mark_read/` admin action

### Donations
- `POST /api/v1/donations/mpesa/` queue-backed initiation, returns `202`
- `POST /api/v1/donations/mpesa-async/` same as above
- `POST /api/v1/donations/mpesa-sync/` immediate initiation
- `POST /api/v1/donations/stripe/` returns `202` with `client_secret`
- `GET /api/v1/donations/` admin list
- `GET /api/v1/donations/{id}/` admin detail
- `GET /api/v1/donations/reconciliation/` admin reconciliation summary
- `POST /api/v1/donations/mpesa-callback/` provider callback
- `POST /api/v1/donations/stripe-webhook/` provider webhook

### Volunteers
- `POST /api/v1/volunteers/` public submit
- `GET /api/v1/volunteers/` admin list
- `GET /api/v1/volunteers/{id}/` admin detail
- `PATCH /api/v1/volunteers/{id}/update_status/` admin action

### Newsletter
- `POST /api/v1/newsletter/` public subscribe
- `POST /api/v1/newsletter/unsubscribe/` public unsubscribe
- `GET /api/v1/newsletter/` admin list
- `GET /api/v1/newsletter/{id}/` admin detail

### Sponsorships
- `GET /api/v1/sponsorships/children/` public children list
- `GET /api/v1/sponsorships/children/{id}/` public child detail
- `GET /api/v1/sponsorships/sponsors/` admin list
- `POST /api/v1/sponsorships/sponsors/` admin create
- `GET /api/v1/sponsorships/sponsors/{id}/` admin detail
- `PUT/PATCH /api/v1/sponsorships/sponsors/{id}/` admin update
- `DELETE /api/v1/sponsorships/sponsors/{id}/` admin delete
- `GET /api/v1/sponsorships/sponsorships/` admin list
- `POST /api/v1/sponsorships/sponsorships/` admin create
- `GET /api/v1/sponsorships/sponsorships/{id}/` admin detail
- `PUT/PATCH /api/v1/sponsorships/sponsorships/{id}/` admin update
- `DELETE /api/v1/sponsorships/sponsorships/{id}/` admin delete
- `POST /api/v1/sponsorships/interest/` public interest form

### Gallery
- `GET /api/v1/gallery/categories/` public categories list
- `GET /api/v1/gallery/categories/{slug}/` public category detail
- `GET /api/v1/gallery/photos/` public photo list
- `GET /api/v1/gallery/photos/featured/` public featured photos
- `GET /api/v1/gallery/photos/random/?count=30` public random photos
- `GET /api/v1/gallery/photos/{id}/` public photo detail

### Testimonials
- `GET /api/v1/testimonials/` public approved testimonials list
- `POST /api/v1/testimonials/` public submit
- `GET /api/v1/testimonials/pending/` admin pending list
- `PATCH /api/v1/testimonials/{id}/approve/` admin action
- `PATCH /api/v1/testimonials/{id}/reject/` admin action
- `GET /api/v1/testimonials/{id}/` admin detail

### Admin CMS control plane

Base: `/api/v1/admin/` (also available at `/api/admin/`)

### Admin Session Auth Contract

Use cookie-based session auth with CSRF. Do not store tokens in localStorage.
The backend exposes these routes under both `/api/v1/admin/auth/*` and the compatibility alias `/api/v1/auth/*`.

#### Admin Account Provisioning (Django Admin)
- Admin/staff user creation requires a unique email address.
- Frontend login should always use email + password.
- Username remains a backend identity field and should not be treated as the primary frontend credential.

#### GET `/api/v1/admin/auth/csrf/`
- Access: Public
- Purpose: Bootstrap CSRF cookie for the frontend session flow
- Response 200:
```json
{
   "csrf_token": "..."
}
```

#### POST `/api/v1/admin/auth/login/`
- Access: Public
- Purpose: Start a CMS session using email + password
- Request body:
```json
{
   "email": "admin@example.com",
   "password": "secret"
}
```
- Legacy compatibility: username is still accepted by the backend for older accounts, but frontend clients should send email.
- Response 200:
```json
{
   "message": "Signed in successfully.",
   "csrf_token": "...",
   "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "first_name": "",
      "last_name": "",
      "display_name": "Admin User",
      "is_active": true,
      "is_staff": true,
      "is_superuser": true,
      "date_joined": "...",
      "last_login": "...",
      "role": "super_admin",
      "permissions": {
         "can_access_admin": true,
         "can_manage_pages": true,
         "can_manage_navigation": true,
         "can_manage_media": true,
         "can_manage_donations": true,
         "can_manage_contacts": true,
         "can_manage_volunteers": true,
         "can_manage_newsletter": true,
         "can_manage_sponsorships": true,
         "can_manage_testimonials": true,
         "can_manage_gallery": true,
         "can_manage_settings": true
      }
   }
}
```

#### POST `/api/v1/admin/auth/logout/`
- Access: Authenticated session
- Purpose: Destroy the active CMS session
- Response 200:
```json
{
   "message": "Signed out successfully."
}
```

#### GET `/api/v1/admin/auth/me/`
- Access: Authenticated session
- Purpose: Return the current logged-in CMS user and role info
- Response 200: same shape as `user` above

Frontend auth rules:
- Use `/api/v1/admin/auth/csrf/` before the first write request in a browser session.
- Send `credentials: include` on all admin requests.
- Send `X-CSRFToken` on all mutating admin requests.
- Call `/api/v1/admin/auth/me/` on app load to hydrate the route guard.
- On `403`, treat the user as authenticated but not authorized, and redirect to a forbidden state.
- On `401`, treat the session as logged out and redirect to the login page.

#### Frontend Login UX Rules
- Login form should expose only `email` and `password` fields.
- Label the primary identifier field as `Email address` (not username).
- Make email required and validate format before submit.
- Send login payload as:
```json
{
    "email": "admin@example.com",
    "password": "secret"
}
```
- Handle login errors:
   - `400`: show inline field errors.
   - `403`: show access denied message (account exists but lacks CMS access).
   - `401`: show invalid credentials message.
- After successful login, immediately fetch `/api/v1/admin/auth/me/` (or `/api/v1/auth/me/`) and route by role.
- On logout, call the logout endpoint then clear in-memory auth state and redirect to login.

Operational and dashboard:
- `GET /api/v1/admin/auth/csrf/`
- `POST /api/v1/admin/auth/login/`
- `POST /api/v1/admin/auth/logout/`
- `GET /api/v1/admin/auth/me/`
- `GET /api/v1/admin/overview/`
- `GET /api/v1/admin/audit-events/`
- `GET /api/v1/admin/background-jobs/`
- `GET /api/v1/admin/background-jobs/{id}/`
- `POST /api/v1/admin/background-jobs/{id}/retry/`

Site settings:
- `GET /api/v1/admin/site-settings/`
- `PUT /api/v1/admin/site-settings/`
- `PATCH /api/v1/admin/site-settings/`

Pages and sections:
- `GET/POST /api/v1/admin/pages/`
- `GET/PUT/PATCH/DELETE /api/v1/admin/pages/{id}/`
- `POST /api/v1/admin/pages/{id}/publish/`
- `POST /api/v1/admin/pages/{id}/archive/`
- `POST /api/v1/admin/pages/{id}/schedule/`
- `GET /api/v1/admin/pages/{id}/preview/`
- `GET/POST /api/v1/admin/page-sections/`
- `GET/PUT/PATCH/DELETE /api/v1/admin/page-sections/{id}/`

Navigation:
- `GET/POST /api/v1/admin/navigation-menus/`
- `GET/PUT/PATCH/DELETE /api/v1/admin/navigation-menus/{id}/`
- `GET/POST /api/v1/admin/navigation-items/`
- `GET/PUT/PATCH/DELETE /api/v1/admin/navigation-items/{id}/`

Marketing and redirects:
- `GET/POST /api/v1/admin/banners/`
- `GET/PUT/PATCH/DELETE /api/v1/admin/banners/{id}/`
- `GET/POST /api/v1/admin/redirect-rules/`
- `GET/PUT/PATCH/DELETE /api/v1/admin/redirect-rules/{id}/`

Media and revisions:
- `GET/POST /api/v1/admin/media-assets/`
- `GET/PUT/PATCH/DELETE /api/v1/admin/media-assets/{id}/`
- `GET /api/v1/admin/content-revisions/`
- `GET /api/v1/admin/content-revisions/{id}/`

Gallery admin:
- `GET/POST /api/v1/admin/gallery/categories/`
- `GET/PUT/PATCH/DELETE /api/v1/admin/gallery/categories/{id}/`
- `GET/POST /api/v1/admin/gallery/photos/`
- `GET/PUT/PATCH/DELETE /api/v1/admin/gallery/photos/{id}/`

### Frontend Endpoint Matrix (Implementation Map)

Use this matrix to wire frontend modules directly to backend routes.

| Module | Method | Endpoint | Auth | Notes |
|---|---|---|---|---|
| Admin Auth | GET | `/api/v1/admin/auth/csrf/` or `/api/v1/auth/csrf/` | Public | Sets CSRF cookie and returns token |
| Admin Auth | POST | `/api/v1/admin/auth/login/` or `/api/v1/auth/login/` | Public | Session login with email + password (username accepted only for legacy compatibility) |
| Admin Auth | POST | `/api/v1/admin/auth/logout/` or `/api/v1/auth/logout/` | Auth | Ends session |
| Admin Auth | GET | `/api/v1/admin/auth/me/` or `/api/v1/auth/me/` | Auth | Current logged-in user + role info |
| Health | GET | `/health/` | Public | Liveness probe |
| Health | GET | `/ready/` | Public | Readiness probe |
| Contacts | POST | `/api/v1/contacts/` | Public | Contact form submit |
| Volunteers | POST | `/api/v1/volunteers/` | Public | Volunteer application submit |
| Newsletter | POST | `/api/v1/newsletter/` | Public | Subscribe; can return `200` or `201` |
| Newsletter | POST | `/api/v1/newsletter/unsubscribe/` | Public | Unsubscribe |
| Testimonials | GET | `/api/v1/testimonials/` | Public | Approved testimonials list |
| Testimonials | POST | `/api/v1/testimonials/` | Public | Testimonial submit |
| Sponsorships | GET | `/api/v1/sponsorships/children/` | Public | Children list |
| Sponsorships | GET | `/api/v1/sponsorships/children/{id}/` | Public | Child detail |
| Sponsorships | POST | `/api/v1/sponsorships/interest/` | Public | Interest registration |
| Gallery | GET | `/api/v1/gallery/categories/` | Public | Categories list |
| Gallery | GET | `/api/v1/gallery/categories/{slug}/` | Public | Category detail |
| Gallery | GET | `/api/v1/gallery/photos/` | Public | Photos list |
| Gallery | GET | `/api/v1/gallery/photos/featured/` | Public | Featured photos |
| Gallery | GET | `/api/v1/gallery/photos/random/?count=30` | Public | Random photos |

| Module | Method | Endpoint | Auth | Notes |
|---|---|---|---|---|
| Donations | POST | `/api/v1/donations/mpesa/` | Public | Queue-backed initiation; returns `202` |
| Donations | POST | `/api/v1/donations/mpesa-async/` | Public | Async alias; returns `202` |
| Donations | POST | `/api/v1/donations/mpesa-sync/` | Public | Immediate initiation |
| Donations | POST | `/api/v1/donations/stripe/` | Public | Stripe intent init; returns `202` with `client_secret` |
| Donations | GET | `/api/v1/donations/` | Admin | Donation list |
| Donations | GET | `/api/v1/donations/{id}/` | Admin | Donation detail |
| Donations | GET | `/api/v1/donations/reconciliation/` | Admin | Reconciliation summary |
| Donations | POST | `/api/v1/donations/mpesa-callback/` | Provider | Backend/provider only |
| Donations | POST | `/api/v1/donations/stripe-webhook/` | Provider | Backend/provider only |
| Contacts | GET | `/api/v1/contacts/` | Admin | Inbox list |
| Contacts | GET | `/api/v1/contacts/{id}/` | Admin | Submission detail |
| Contacts | PATCH | `/api/v1/contacts/{id}/mark_read/` | Admin | Mark as read |
| Volunteers | GET | `/api/v1/volunteers/` | Admin | Applications list |
| Volunteers | GET | `/api/v1/volunteers/{id}/` | Admin | Application detail |
| Volunteers | PATCH | `/api/v1/volunteers/{id}/update_status/` | Admin | Status update |
| Newsletter | GET | `/api/v1/newsletter/` | Admin | Subscriber list |
| Newsletter | GET | `/api/v1/newsletter/{id}/` | Admin | Subscriber detail |
| Testimonials | GET | `/api/v1/testimonials/pending/` | Admin | Pending testimonials |
| Testimonials | PATCH | `/api/v1/testimonials/{id}/approve/` | Admin | Approve testimonial |
| Testimonials | PATCH | `/api/v1/testimonials/{id}/reject/` | Admin | Reject testimonial |
| Testimonials | GET | `/api/v1/testimonials/{id}/` | Admin | Testimonial detail |
| Sponsorships | GET | `/api/v1/sponsorships/sponsors/` | Admin | Sponsors list |
| Sponsorships | POST | `/api/v1/sponsorships/sponsors/` | Admin | Sponsor create |
| Sponsorships | GET | `/api/v1/sponsorships/sponsors/{id}/` | Admin | Sponsor detail |
| Sponsorships | PUT/PATCH | `/api/v1/sponsorships/sponsors/{id}/` | Admin | Sponsor update |
| Sponsorships | DELETE | `/api/v1/sponsorships/sponsors/{id}/` | Admin | Sponsor delete |
| Sponsorships | GET | `/api/v1/sponsorships/sponsorships/` | Admin | Sponsorship list |
| Sponsorships | POST | `/api/v1/sponsorships/sponsorships/` | Admin | Sponsorship create |
| Sponsorships | GET | `/api/v1/sponsorships/sponsorships/{id}/` | Admin | Sponsorship detail |
| Sponsorships | PUT/PATCH | `/api/v1/sponsorships/sponsorships/{id}/` | Admin | Sponsorship update |
| Sponsorships | DELETE | `/api/v1/sponsorships/sponsorships/{id}/` | Admin | Sponsorship delete |

| Module | Method | Endpoint | Auth | Notes |
|---|---|---|---|---|
| Admin Overview | GET | `/api/v1/admin/overview/` | Admin | Dashboard counts + recent activity |
| Admin Audit | GET | `/api/v1/admin/audit-events/` | Admin | Audit feed |
| Admin Jobs | GET | `/api/v1/admin/background-jobs/` | Admin | Job queue list |
| Admin Jobs | GET | `/api/v1/admin/background-jobs/{id}/` | Admin | Job detail |
| Admin Jobs | POST | `/api/v1/admin/background-jobs/{id}/retry/` | Admin | Retry failed job |
| Settings | GET | `/api/v1/admin/site-settings/` | Admin | Site settings read |
| Settings | PUT/PATCH | `/api/v1/admin/site-settings/` | Admin | Site settings update |
| Pages | GET/POST | `/api/v1/admin/pages/` | Admin | Page list/create |
| Pages | GET/PUT/PATCH/DELETE | `/api/v1/admin/pages/{id}/` | Admin | Page detail/update/delete |
| Pages | POST | `/api/v1/admin/pages/{id}/publish/` | Admin | Publish page |
| Pages | POST | `/api/v1/admin/pages/{id}/archive/` | Admin | Archive page |
| Pages | POST | `/api/v1/admin/pages/{id}/schedule/` | Admin | Schedule page publish |
| Pages | GET | `/api/v1/admin/pages/{id}/preview/` | Admin | Preview payload |
| Page Sections | GET/POST | `/api/v1/admin/page-sections/` | Admin | Section list/create |
| Page Sections | GET/PUT/PATCH/DELETE | `/api/v1/admin/page-sections/{id}/` | Admin | Section detail/update/delete |
| Navigation Menus | GET/POST | `/api/v1/admin/navigation-menus/` | Admin | Menu list/create |
| Navigation Menus | GET/PUT/PATCH/DELETE | `/api/v1/admin/navigation-menus/{id}/` | Admin | Menu detail/update/delete |
| Navigation Items | GET/POST | `/api/v1/admin/navigation-items/` | Admin | Item list/create |
| Navigation Items | GET/PUT/PATCH/DELETE | `/api/v1/admin/navigation-items/{id}/` | Admin | Item detail/update/delete |
| Banners | GET/POST | `/api/v1/admin/banners/` | Admin | Banner list/create |
| Banners | GET/PUT/PATCH/DELETE | `/api/v1/admin/banners/{id}/` | Admin | Banner detail/update/delete |
| Redirect Rules | GET/POST | `/api/v1/admin/redirect-rules/` | Admin | Redirect list/create |
| Redirect Rules | GET/PUT/PATCH/DELETE | `/api/v1/admin/redirect-rules/{id}/` | Admin | Redirect detail/update/delete |
| Media Assets | GET/POST | `/api/v1/admin/media-assets/` | Admin | Media list/create (multipart for upload) |
| Media Assets | GET/PUT/PATCH/DELETE | `/api/v1/admin/media-assets/{id}/` | Admin | Media detail/update/delete |
| Revisions | GET | `/api/v1/admin/content-revisions/` | Admin | Revision history list |
| Revisions | GET | `/api/v1/admin/content-revisions/{id}/` | Admin | Revision detail |
| Admin Gallery Categories | GET/POST | `/api/v1/admin/gallery/categories/` | Admin | Category list/create |
| Admin Gallery Categories | GET/PUT/PATCH/DELETE | `/api/v1/admin/gallery/categories/{id}/` | Admin | Category detail/update/delete |
| Admin Gallery Photos | GET/POST | `/api/v1/admin/gallery/photos/` | Admin | Photo list/create |
| Admin Gallery Photos | GET/PUT/PATCH/DELETE | `/api/v1/admin/gallery/photos/{id}/` | Admin | Photo detail/update/delete |

Matrix usage rules:
- Default frontend base URL should point to `/api/v1`.
- Treat `/api/*callback*` and `/api/*webhook*` as backend/provider-only endpoints, not user-initiated frontend calls.
- Use the `/api/admin/*` path only as backward-compatible fallback.

## 5) Backend Data Fields To Use

Use these fields in the UI exactly as returned by backend serializers.

### Contact submission
- `id`
- `name`
- `email`
- `subject`
- `message`
- `created_at`
- `updated_at`
- `is_read`
- `notes`

### Donation
- `id`
- `donor_name`
- `donor_email`
- `donor_phone`
- `is_anonymous`
- `amount`
- `currency`
- `donation_type`
- `purpose`
- `message`
- `payment_method`
- `status`
- `transaction_id`
- `mpesa_receipt`
- `mpesa_phone`
- `mpesa_checkout_request_id`
- `mpesa_merchant_request_id`
- `stripe_payment_intent`
- `stripe_charge_id`
- `paypal_order_id`
- `receipt_sent`
- `receipt_number`
- `created_at`
- `updated_at`
- `completed_at`
- `notes`

### Donation reconciliation summary
- `generated_at`
- `donation_status_counts`
- `stale_processing_count`
- `stale_processing`
- `callbacks_last_24h.total`
- `callbacks_last_24h.unprocessed`
- `callbacks_last_24h.orphans`

### Volunteer application
- `id`
- `name`
- `email`
- `phone`
- `location`
- `skills`
- `availability`
- `duration`
- `motivation`
- `experience`
- `areas_of_interest`
- `status`
- `created_at`
- `updated_at`
- `notes`

### Newsletter subscriber
- `id`
- `email`
- `name`
- `is_active`
- `subscribed_at`
- `unsubscribed_at`
- `source`

### Sponsorship child
- `id`
- `first_name`
- `last_name`
- `age`
- `gender`
- `bio`
- `interests`
- `photo`
- `photo_url`
- `is_sponsored`
- `needs_sponsor`

### Sponsor
- Use all model fields from serializer/admin detail.
- Build generic CRUD form and table views.

### Sponsorship
- Use all model fields from serializer/admin detail.
- Display child + sponsor names clearly.

### Sponsorship interest
- `id`
- `name`
- `email`
- `phone`
- `preferred_level`
- `created_at`

### Gallery category
- `id`
- `name`
- `slug`
- `description`
- `icon`
- `color`
- `count`

### Gallery photo
- `id`
- `title`
- `description`
- `image`
- `image_url`
- `category`
- `category_name`
- `date_taken`
- `is_featured`
- `created_at`

### Page
- `id`
- `title`
- `slug`
- `summary`
- `body`
- `status`
- `published_at`
- `scheduled_for`
- `created_at`
- `updated_at`
- `seo_title`
- `seo_description`
- `canonical_url`
- `parent`
- `sort_order`

### Page section or block
- `id`
- `page`
- `section_type`
- `title`
- `subtitle`
- `body`
- `cta_label`
- `cta_url`
- `image`
- `image_url`
- `settings`
- `sort_order`
- `is_active`

### Navigation item
- `id`
- `menu`
- `label`
- `url`
- `page`
- `parent`
- `sort_order`
- `is_active`
- `open_in_new_tab`

### Banner or announcement
- `id`
- `title`
- `message`
- `cta_label`
- `cta_url`
- `starts_at`
- `ends_at`
- `is_active`
- `priority`

### Media asset
- `id`
- `title`
- `file`
- `file_url`
- `alt_text`
- `caption`
- `category`
- `tags`
- `width`
- `height`
- `size`
- `created_at`
- `updated_at`
- `usage_count`

### Global settings
- `id`
- `site_name`
- `tagline`
- `logo`
- `logo_url`
- `favicon`
- `favicon_url`
- `primary_color`
- `secondary_color`
- `support_email`
- `support_phone`
- `address`
- `social_links`
- `seo_default_title`
- `seo_default_description`
- `homepage_title`
- `homepage_subtitle`
- `updated_at`

### Redirect
- `id`
- `source_path`
- `target_url`
- `status_code`
- `is_active`
- `created_at`
- `updated_at`

### Content revision
- `id`
- `entity_type`
- `entity_id`
- `version`
- `status`
- `author`
- `published_by`
- `created_at`
- `published_at`
- `summary`
- `snapshot`

### Testimonial public/admin fields
- Public fields: `id`, `name`, `display_role`, `text`, `approved_at`
- Admin fields include full detail, including:
  - `email`
  - `role`
  - `role_custom`
  - `text`
  - `status`
  - `notes`
  - `created_at`
  - `updated_at`
  - `approved_at`

## 6) CMS Information Architecture

Build the dashboard with these sections in a left sidebar and top header:

1. Overview
2. Content Studio
3. Pages
4. Navigation
5. Media Library
6. Donations
7. Testimonials
8. Contacts
9. Volunteers
10. Newsletter
11. Sponsorships
12. Marketing / Banners
13. Audit Log / Activity
14. Settings
15. Profile / Account

Recommended route structure:
- `/dashboard`
- `/dashboard/content`
- `/dashboard/content/pages`
- `/dashboard/content/pages/:id`
- `/dashboard/content/blocks`
- `/dashboard/content/banners`
- `/dashboard/navigation`
- `/dashboard/navigation/:id`
- `/dashboard/media`
- `/dashboard/media/:id`
- `/dashboard/donations`
- `/dashboard/donations/:id`
- `/dashboard/testimonials`
- `/dashboard/testimonials/:id`
- `/dashboard/contacts`
- `/dashboard/contacts/:id`
- `/dashboard/volunteers`
- `/dashboard/volunteers/:id`
- `/dashboard/newsletter`
- `/dashboard/sponsorships`
- `/dashboard/sponsorships/:id`
- `/dashboard/gallery`
- `/dashboard/gallery/:id`
- `/dashboard/marketing`
- `/dashboard/marketing/banners`
- `/dashboard/settings`
- `/dashboard/audit-log`

## 7) Dashboard Modules and Required Behavior

### Content studio
Must include:
- page list with status, slug, and publish state
- page editor with block-based layout or structured rich text
- draft save, preview, publish, archive, and schedule controls
- content revision history
- reusable sections or snippets library

Recommended behavior:
- Show a live preview panel alongside the editor.
- Make the publish action distinct from save draft.
- Preserve unsaved changes on accidental navigation.
- Support block ordering, drag handles, and block-specific validation.

### Pages module
Must include:
- page table with filters for status and template
- page detail/edit view
- SEO metadata controls
- slug editor with uniqueness warning
- parent/child page structure where relevant

Recommended behavior:
- Allow cloning an existing page as a starting point.
- Show URL preview and canonical link preview.
- Highlight unpublished content clearly.

### Navigation module
Must include:
- header menu editor
- footer menu editor
- utility menu editor if needed
- nested links and ordering controls

Recommended behavior:
- Support drag-and-drop ordering.
- Warn when a page is unpublished or a URL is broken.
- Show a responsive preview for desktop and mobile navigation states.

### Media library
Must include:
- image grid and table views
- file upload and metadata editing
- alt text, caption, tags, categories, and usage tracking
- link to all content entries using a file

Recommended behavior:
- Use `image_url` and `photo_url` or analogous absolute fields.
- Validate alt text and image dimensions where applicable.
- Surface file usage so editors avoid breaking live pages.

### Marketing / banners module
Must include:
- homepage hero management
- announcement strip management
- timed campaigns
- CTA editing

Recommended behavior:
- Support start/end dates and active toggles.
- Preview how banners render on the public site.
- Keep campaigns editable without touching code.

### Overview dashboard
Must include:
- Total donations
- Published pages
- Draft pages
- Active banners
- Media assets
- Pending testimonials
- Unread contacts
- Pending volunteer applications
- Active newsletter subscribers
- Sponsorship counts
- Recent content changes
- Recent donations
- Queue/reconciliation health

Recommended behavior:
- Use server-side counts where available.
- Use skeleton loading.
- Show empty and error states.
- Use charts sparingly and only when data is stable.
- Add editorial shortcuts for creating a page, banner, or media upload.

### Donations module
Must include:
- donation table with filters
- donor detail drawer/page
- payment method/status badges
- reconciliation summary
- callback history visibility
- receipt status
- failure and stale processing highlighting

Recommended actions:
- Search by donor name, email, transaction ID, receipt number.
- Filter by payment method, status, currency, donation type.
- Show stripe intent and M-Pesa identifiers.
- Highlight unresolved orphans/stale processing.
- Allow export CSV if added later.

### Testimonials module
Must include:
- pending list
- approved list
- rejected list
- approve action
- reject action with notes
- detail view

Recommended behavior:
- Show preview text truncation.
- Use confirmation modal before approve/reject.
- Optimistically update rows after successful mutation.

### Contacts module
Must include:
- inbox/table with unread/read state
- detail page
- mark as read action
- notes visibility for admin

Recommended behavior:
- Prioritize unread items visually.
- Allow quick search and filters.
- Keep one-click read action.

### Volunteers module
Must include:
- application table
- detail view
- status change action
- notes and review timestamp

Recommended behavior:
- Quick status transitions with modal confirmation.
- Show skill and availability summaries.

### Newsletter module
Must include:
- subscriber list
- active/inactive state
- unsubscribe status
- source tracking

Recommended behavior:
- Use safe bulk actions only if backend later supports them.
- Keep reads paginated.

### Sponsorships module
Must include:
- children list for sponsorship review
- sponsor CRUD
- sponsorship CRUD
- sponsorship interest inbox

Recommended behavior:
- Use `photo_url` for child avatars/cards.
- Use `select_related`-friendly table layouts.
- Show child-sponsor uniqueness clearly.

### Gallery / Media module
Must include:
- category list/detail
- photo list
- featured photos
- random photos
- media preview grid
- upload/create/edit modal for gallery photos if backend supports admin writes in this UI

Recommended behavior:
- Use `image_url` for rendering.
- Support image previews before save.
- Validate size and file type client-side before upload.
- Show category counts.
- Treat gallery as a real media library, not just a photo feed: add captions, tags, alt text, and usage tracking when backend support exists.

### Audit log / activity
Implemented backend audit/activity inputs:
- Show content publish history
- Show moderation history
- Show donation processing events
- Show callback replays and failures
- Show navigation, banner, and page revisions

Use these endpoints as primary sources:
- `GET /api/v1/admin/audit-events/`
- `GET /api/v1/admin/content-revisions/`
- `GET /api/v1/admin/background-jobs/`

### Settings
Must include:
- site identity and branding
- contact information
- social links
- SEO defaults
- homepage defaults
- notification preferences
- staff profile preferences

Backend endpoints are available:
- `GET /api/v1/admin/site-settings/`
- `PUT /api/v1/admin/site-settings/`
- `PATCH /api/v1/admin/site-settings/`

## 8) Data Fetching Rules

Use TanStack Query or equivalent.

Rules:
- Use query keys per module and entity.
- Use paginated server-side lists.
- Debounce search input.
- Refetch after mutations.
- Invalidate related caches on publish, archive, approve, reject, read, unsubscribe, and update actions.
- Use optimistic UI only where rollback is simple.

Recommended query mapping:
- overview cards -> dedicated count queries or derived list counts
- tables -> paginated list queries with filters, sort, and pagination state in URL
- detail panels -> single entity query
- mutations -> invalidate lists + detail query
- editor screens -> fetch current entity, revision history, and preview dependencies together

## 9) Forms and Validation

Use React Hook Form + Zod.

Requirements:
- Mirror backend field names exactly.
- Show backend `400` field errors inline.
- Preserve entered values on failed submit.
- Use multipart form data only when uploading files.
- Use client-side validation for required fields, length, email format, publish state, and image type/size.
- Handle slug uniqueness, scheduled publish timestamps, and block ordering with explicit validation.

## 10) Media and Upload Handling

Backend supports S3-backed media when configured.

Frontend rules:
- Prefer `image_url` and `photo_url` if present.
- Fallback to `image` or `photo` if only relative paths are returned.
- Resolve absolute URLs safely.
- Show image upload preview and filename.
- If upload support is implemented, keep a clear upload state and disable submit while uploading.
- Treat media as a managed asset with title, alt text, caption, tags, and usage context.

Recommended upload behavior:
- Validate file type before upload.
- Validate file size before upload.
- Show server error if upload fails.
- Never hardcode S3 URLs in the UI.

## 11) Error Handling and Notifications

Handle these backend statuses explicitly:
- `200`: success
- `201`: created
- `202`: accepted / async processing
- `400`: validation errors
- `403`: forbidden / permission denied
- `404`: not found
- `409`: conflict / duplicate slug or publish collision
- `429`: rate limited
- `500`: server failure

Recommended UI behavior:
- Success toast for mutation success
- Error toast for server failures
- Inline field errors for validation
- Readable retry message for 429
- Permission denied state for 403
- Conflict state for duplicate paths or publishing collisions

## 12) Accessibility Standards

Build to accessibility standards:
- Keyboard accessible navigation
- Visible focus states
- ARIA labels for controls and dialogs
- Sufficient color contrast
- Semantic tables and buttons
- Screen-reader friendly status messages
- No color-only status indicators

## 13) Scalability and Performance Standards

Requirements:
- Server-side pagination for all large tables
- Lazy-load heavy modules
- Use route-level code splitting
- Use virtualization for very large tables if needed
- Debounce search and filter inputs
- Avoid loading all entities into memory
- Keep dashboard cards light and fast
- Use image thumbnails in tables instead of full-size assets
- Keep page editor payloads compact by fetching revisions, blocks, and assets on demand

## 14) Auditability and Operations

The dashboard should help the client understand what happened in the system and what is going to happen next.

Required visible signals:
- Who approved or rejected content
- Who edited or published a page
- What changed in navigation or banners
- What is scheduled to go live next
- Which donations are complete, processing, or stale
- Which callbacks are unresolved
- Whether receipts were sent
- Whether queue jobs are healthy
- Whether uploads are saved correctly

Use these implemented endpoints as primary audit/activity sources:
- `GET /api/v1/admin/audit-events/`
- `GET /api/v1/admin/content-revisions/`
- `GET /api/v1/admin/background-jobs/`

## 15) Testing Expectations

Frontend tests to add:
- Unit tests for helpers, guards, and API client
- Component tests for moderation actions, page editing, publish states, and forms
- Integration tests for list/detail/mutation flows
- E2E tests for login, navigation, page editing, publish flow, approve/reject, donation review, media upload, and logout

## 16) Recommended Future Backend Enhancements for a Strong CMS

These are optional but strongly recommended for a true CMS:
- Granular role and permission APIs for real RBAC beyond `IsAdminUser`
- Dedicated content publish scheduler worker and execution logs
- Bulk moderation endpoints for testimonials and contacts
- Content revision rollback endpoint (currently revisions are read-only)
- Dedicated media upload signing endpoint (if direct uploads move to presigned flow)
- Export endpoints for CSV/XLSX

Do not block the first release on these if the current APIs are enough, but do not design the UI as though they will never exist.

## 17) Copilot Prompt For Building The Admin UI

Paste the prompt below into Copilot in the frontend workspace:

```text
Use admin_dashboard.md, frontend_backend_alignment.md, and apis.md as the source of truth.

Build a separate React-based admin CMS UI for this project.

Goals:
1) Create a secure, scalable, staff-only content platform that does not use Django admin.
2) Use the existing backend APIs already documented in apis.md.
   - Prefer `/api/v1/` endpoints.
   - Use admin CMS control-plane endpoints under `/api/v1/admin/`.
3) Build the dashboard as a professional CMS with sidebar navigation, tables, detail drawers/pages, filters, forms, modals, live previews, version history, and audit-friendly activity views.
4) Implement session-auth + CSRF-based admin access.
5) Design the UI so permissions can be extended later, but assume staff/admin-only access for now.
6) Use TanStack Query (or equivalent) for server state, React Hook Form + Zod for forms, and TypeScript throughout.
7) Handle backend status codes exactly:
   - 200, 201, 202, 400, 403, 409, 429, 500
8) Use backend media fields correctly:
   - prefer `image_url` and `photo_url`
   - fall back safely for relative URLs
9) Keep all list views paginated and searchable where appropriate.
10) Add confirmation dialogs for destructive actions and audit-sensitive mutations.
11) Make the UI accessible, responsive, and optimized for large datasets.
12) Treat pages, navigation, banners, media metadata, SEO, and revisions as first-class CMS features.
13) Produce a final implementation report grouped by module:
   overview, content studio, pages, navigation, media library, donations, testimonials, contacts, volunteers, newsletter, sponsorships, marketing, audit log, settings.

Modules to implement:
- Overview dashboard
- Content studio
- Pages and SEO management
- Navigation and menu management
- Media library with asset metadata
- Donations and reconciliation
- Testimonials moderation
- Contacts inbox
- Volunteer applications
- Newsletter subscribers
- Sponsorships and interest management
- Gallery/media library
- Marketing banners and announcements
- Audit log / activity panel
- Settings / profile

Backend endpoints to use are already in apis.md and include `/api/v1/admin/*` CMS resources. Do not invent new backend fields or endpoints unless explicitly called out as future work.

Constraints:
- Do not use Django admin.
- Do not store secrets in localStorage.
- Do not hardcode S3 URLs.
- Keep changes minimal and maintainable.
- Prefer reusable components and a consistent design system.
- Make it feel like an editorial console rather than a CRUD admin.
```

## 18) Build Order Recommendation

When implementing this CMS, use this order:
1. Auth/session/CSRF and route guards
2. Shared API client and error handling
3. Overview dashboard and shell layout
4. Content studio, pages, navigation, and media foundations
5. Testimonials, contacts, volunteers moderation flows
6. Donations and reconciliation
7. Sponsorships and newsletter
8. Gallery/media library
9. Marketing, audit log, and settings
10. Testing, accessibility, and preview/publish workflow pass

## 19) Release Gate

Do not consider the CMS done until:
- Admin login is protected
- All list views are paginated
- All mutation flows confirm before commit
- Pages can be drafted, previewed, published, and archived
- Navigation and banners are editable without code changes
- Media works with S3-ready URLs and asset metadata
- Approval and reconciliation flows are stable
- Revision history exists for editable public content
- E2E tests pass
- No dashboard route leaks unauthorized access
