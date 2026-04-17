# Admin Dashboard Guide

This document is the GitHub-safe guide for operating and supporting the admin dashboard in production.

## Access

Login path:

- /admin/login

Dashboard path:

- /dashboard

Access control:

- ProtectedRoute guards dashboard routes.
- Session auth is required.
- CSRF is required for mutating requests.
- Unauthorized users are redirected to /admin/forbidden.

## Dashboard Modules And What Admins Can Do

Overview:

- View donation totals, contacts, volunteer pipeline, testimonial queue, and gallery snapshot.
- View reconciliation health and recent moderation activity.

Content:

- Browse pages and revisions.
- Publish pages.
- Archive pages.
- Schedule pages.

Navigation:

- Inspect navigation menus and menu items.
- Open record details from list views.

Media Library:

- Upload reusable media assets.
- Set metadata (title, alt text, caption, tags, destination category).
- Rename assets.
- Delete assets.

Gallery:

- Upload gallery photos.
- Set category, featured flag, date taken, and description.
- Rename photos.
- Delete photos.
- Inspect category list and photo counts.

Marketing:

- Manage banner and redirect resources through admin endpoints.
- Open record details from list views.

Audit Log:

- Inspect audit events, revisions, and background jobs.
- Retry failed background jobs.

Contacts:

- Review contact submissions.
- Mark submissions as read.

Donations:

- Review donation records and payment references.
- Inspect status and transaction-level details.

Volunteers:

- Review volunteer applications.
- Move records between workflow statuses (pending, reviewing, approved, rejected, contacted, scheduled).

Newsletter:

- Review subscriber records.
- Unsubscribe addresses.

Testimonials:

- Review pending and approved queues.
- Approve pending testimonials.
- Reject pending testimonials with optional notes.

Sponsorships:

- Inspect children, sponsors, and sponsorship records.
- Open record-level detail preview.

Settings:

- Update site identity and SEO settings.
- Upload logo and favicon.
- Set director portrait URLs for About page.

Profile:

- View current account/access model notes.

## Backend Dependencies

Admin modules are operational only when these backend APIs are live and permissioned:

- /api/v1/admin/media-assets/
- /api/v1/admin/gallery/photos/
- /api/v1/admin/pages/
- /api/v1/admin/navigation/menus/
- /api/v1/admin/navigation/items/
- /api/v1/admin/site-settings/
- /api/v1/admin/banners/
- /api/v1/admin/redirect-rules/
- /api/v1/admin/audit-events/
- /api/v1/admin/background-jobs/
- /api/v1/contacts/
- /api/v1/donations/
- /api/v1/volunteers/
- /api/v1/newsletter/
- /api/v1/testimonials/
- /api/v1/sponsorships/

## Production Smoke Checklist (Admin)

1. Open /admin/login and sign in with an admin account.
2. Open /dashboard and confirm overview metrics render.
3. Upload one image in Media Library and verify preview URL resolves.
4. Upload one image in Gallery and verify it appears in gallery list.
5. Update one setting (for example site tagline), save, and reload.
6. Open Testimonials and verify approve/reject controls appear.
7. Open Volunteers and run one status transition.
8. Confirm no dashboard route throws runtime errors in browser console.

## Operating Notes

- Keep category labels human-readable in backend payloads.
- Do not expose internal-only planning docs in public repository roots.
- Track backend/frontend contract changes in Docs/04-API-Contract-Integration.md.
