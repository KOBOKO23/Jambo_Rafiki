# Backend Transfer Spec: Image Placement And Uploads

This document is a backend handoff for the image workflow that the frontend already expects.

The frontend now has upload surfaces for gallery photos, reusable media, site branding, and the About page director portraits. The backend needs matching endpoints and fields so those uploads resolve to stable public URLs and the public site can read them.

Backend ownership for this workflow is:

- file storage and public URL generation
- admin create, update, and delete endpoints
- site settings fields for branding and director portraits
- gallery category data and counts
- returning consistent field names such as `image_url` and `file_url`

The frontend should not need to invent upload routes, guess storage paths, or reassemble broken labels from backend data.

The admin upload flow should use a destination dropdown first, then show only the fields that belong to that destination. Free-form guessing should not be required from staff.

## 1) Frontend Targets That Must Be Supported

Use these exact public-facing targets when implementing backend storage and admin forms:

1. Home page / Hero section
2. Home page / Featured Programs section
3. Home page / Programs section
4. Home page / Recent Activities section
5. Home page / Stories of Hope section
6. About page / Director section
7. Gallery page / Gallery grid
8. Dashboard / Media Library
9. Site branding / Logo
10. Site branding / Favicon

## 2) Upload Destination Dropdown

Use these exact dropdown options when a staff member uploads an image:

1. Home page / Hero section
2. Home page / Featured Programs section
3. Home page / Programs section
4. Home page / Recent Activities section
5. Home page / Stories of Hope section
6. About page / Director section
7. Gallery page / Gallery grid
8. Dashboard / Media Library
9. Site branding / Logo
10. Site branding / Favicon

The dropdown should control which fields are shown next.

Group the dropdown into these sections so staff can scan it quickly:

- Home page
- About page
- Gallery
- Library
- Branding

Each option should show a short helper line or secondary description so staff know what the upload is for before they save it.

Recommended field behavior:

- Tags should stay as free text or comma-separated input.
- Title should always be required.
- File upload should always be required.
- Caption, description, date, and category should only appear when the selected destination uses them.
- Gallery category options should show both the category name and a short description, if available.
- CMS media should show tags as the reusable search field, not as the only location field.

## 3) Current Frontend Behavior

### Home page / Hero section

- Uses the first featured gallery photo, then a random gallery photo fallback.
- Expects `image_url` or `image` from the gallery API.
- If nothing exists, it shows a helper message to add a featured photo in Gallery CMS.

File: [pages/Home/HeroSection.tsx](pages/Home/HeroSection.tsx)

### Home page / Featured Programs section

- Uses featured gallery photos first, then random gallery photos.
- Expects gallery photo records with `image_url` or `image`.

File: [pages/Home/FeaturedProgramsSection.tsx](pages/Home/FeaturedProgramsSection.tsx)

### Home page / Programs section

- Uses the first three gallery photos.
- Expects gallery photo records with `image_url` or `image`, plus title and category name.

File: [pages/Home/ProgramsSection.tsx](pages/Home/ProgramsSection.tsx)

### Home page / Recent Activities section

- Still uses static local files under `/images/...`.
- No backend mapping exists yet.

File: [pages/Home/RecentActivitiesSection.tsx](pages/Home/RecentActivitiesSection.tsx)

### Home page / Stories of Hope section

- Still uses static local files under `/images/...`.
- No backend mapping exists yet.

File: [pages/Home/StoriesOfHopeSection.tsx](pages/Home/StoriesOfHopeSection.tsx)

### About page / Director section

- Currently uses static local files for both portraits.
- The frontend has now been updated to read optional backend URLs first, then fall back to the local files.
- The exact targets are:
  - Mr. Benjamin Oyoo Ondoro - Executive Director & Founder
  - JM - International Director

File: [pages/About/DirectorSection.tsx](pages/About/DirectorSection.tsx)

### Gallery page / Gallery grid

- Uses the gallery endpoints directly.
- Expects stable `image_url` values for public rendering.

File: [pages/Gallery/GalleryPage.tsx](pages/Gallery/GalleryPage.tsx)

### CMS media

- Lists reusable media assets.
- Expects `file_url || file` for previews and detail links.
- The frontend can now upload, rename, and delete media assets.

File: [pages/Dashboard/DashboardPage.tsx](pages/Dashboard/DashboardPage.tsx)

### Site branding / Logo and favicon

- The settings page now provides upload cards for logo and favicon.
- The public app should prefer backend-provided `logo_url` and `favicon_url` when available.

File: [pages/Dashboard/DashboardPage.tsx](pages/Dashboard/DashboardPage.tsx)

## 4) Backend Responsibilities By Target

Implement these targets on the backend before attempting to mirror the same workflow in another service:

### Home page / Hero section

Backend should continue to serve this from gallery photo records.

Required behavior:

- gallery photos must return `image_url`
- featured photos must be queryable through `/api/v1/gallery/photos/featured/`
- random photos must be queryable through `/api/v1/gallery/photos/random/`

### Home page / Featured Programs section

Backend should continue to serve this from the same gallery photo pool.

Required behavior:

- featured flag on gallery photos
- stable public URL fields

### Home page / Programs section

Backend should continue to serve this from gallery photo records.

Required behavior:

- photo title
- description
- category relation or category name
- public image URL

### Home page / Recent Activities section

Backend work required if this section should stop using hard-coded files.

Recommended backend support:

- either convert this section to gallery photos
- or add a page-section/media relation that stores a section image URL and sort order

### Home page / Stories of Hope section

Backend work required if this section should stop using hard-coded files.

Recommended backend support:

- a page-section record per story
- fields for name, story, age, image, and ordering

### About page / Director section

Backend must add persistent image URL fields for the two portraits.

Required fields:

- `director_executive_image_url`
- `director_international_image_url`

Required behavior:

- public organization/site settings endpoint must return these values
- frontend should use them if present
- fallback to existing static files if missing

### Gallery page / Gallery grid

Backend must continue to support gallery photo create/list/detail behavior.

Required behavior:

- `POST /api/v1/admin/gallery/photos/`
- `GET /api/v1/admin/gallery/photos/`
- `GET /api/v1/admin/gallery/photos/{id}/`
- `PATCH /api/v1/admin/gallery/photos/{id}/`
- `DELETE /api/v1/admin/gallery/photos/{id}/`
- public photo payloads should include `image_url`
- the admin UI should be able to rename or delete gallery photos after upload

### CMS media

Backend must support reusable file uploads and edits.

Required behavior:

- `POST /api/v1/admin/media-assets/`
- `GET /api/v1/admin/media-assets/`
- `GET /api/v1/admin/media-assets/{id}/`
- `PATCH /api/v1/admin/media-assets/{id}/`
- `DELETE /api/v1/admin/media-assets/{id}/`
- each asset should return `file_url` and/or `file`
- the admin UI should be able to rename, retag, and delete media assets after upload

Backend should also preserve the category value as a stable machine field, but the returned display label should be clean and human readable. If a suffix like `92f36f8f -` exists in the source data, strip it from the name shown in the admin UI.

### Site branding / Logo and favicon

Backend must store branding image URLs in the site settings or organization config.

Required fields:

- `logo_url`
- `favicon_url`

Optional compatibility fields if the backend wants to preserve legacy payloads:

- `logo`
- `favicon`

If legacy fields exist, keep them in sync with the `_url` variants until the frontend no longer needs compatibility.

## 5) Required API Contract Changes

The frontend already assumes the shared API client in [src/services/api.ts](src/services/api.ts) is the only transport layer.

The backend should support these request/response shapes:

### Gallery photo create

- multipart form upload
- file field: `image`
- metadata fields: `title`, `description`, `category`, `is_featured`, `date_taken`
- response fields: `id`, `title`, `image`, `image_url`, `category_name`, `is_featured`

### Media asset create

- multipart form upload
- file field: `file`
- metadata fields: `title`, `alt_text`, `caption`, `category`, `tags`
- response fields: `id`, `title`, `file`, `file_url`, `alt_text`, `caption`, `category`, `tags`, `usage_count`

### Media asset update

- should allow changing `title`, `alt_text`, `caption`, `category`, and `tags`
- should support `PATCH` for metadata edits without re-uploading the file

### Gallery photo update

- should allow changing `title`, `description`, `category`, `is_featured`, and `date_taken`
- should support `PATCH` for metadata edits without re-uploading the file

### Gallery category list

- should return a list of categories with `id`, `name`, `slug`, `description`, and `count`
- should support clean display labels for the admin dropdown
- should not append opaque identifiers to the public-facing category name

### Site settings update

- should accept branding and director image URL fields
- should return the same values in the response

Expected fields:

- `logo_url`
- `favicon_url`
- `director_executive_image_url`
- `director_international_image_url`

## 6) Storage And URL Rules

The backend should store files in durable object storage, ideally S3 or equivalent.

Required behavior:

- return stable public URLs for public assets
- support either absolute or relative URL strings, but stay consistent
- do not force the frontend to construct upload URLs manually
- do not make the browser call webhook endpoints directly

## 7) Admin Permission Rules

The image upload endpoints should follow the same session auth and CSRF model as the rest of the admin API.

Required behavior:

- accept authenticated admin session requests
- enforce CSRF for mutating requests
- reject unauthenticated or non-admin uploads

## 8) What The Frontend Already Does

The frontend has already been updated to:

- upload media assets to CMS media
- upload gallery photos to Gallery page / Gallery grid
- rename and delete media assets
- rename and delete gallery photos
- upload logo and favicon images through Settings
- read About page director portrait URLs from backend settings when available

The frontend upload forms should keep the destination dropdown, tags field, and CRUD actions available without requiring the backend team to invent additional UI logic.

That means the backend only needs to match the data contract and persistence model; no extra frontend plumbing is required for the core upload paths.

In practical terms, the backend team should implement the current frontend contract exactly as-is instead of redesigning the upload flow.

## 9) Minimal Implementation Order

If this is being handed off to the backend team, implement in this order:

1. Add multipart create/update/delete for `/admin/media-assets/`.
2. Add multipart create/update/delete for `/admin/gallery/photos/`.
3. Add `logo_url`, `favicon_url`, `director_executive_image_url`, and `director_international_image_url` to site settings or organization config.
4. Make the public organization endpoint return those values.
5. Ensure all public image records return stable `image_url` or `file_url` values.
6. Keep gallery category names clean in API responses so admin dropdown labels do not show generated suffixes.

## 10) Acceptance Criteria

The backend transfer is complete when all of the following are true:

- admin can upload a media asset and receive a stable URL
- admin can upload a gallery photo and see it on the public gallery
- admin can set logo and favicon images from Settings
- About page director portraits can be changed from backend settings
- public gallery pages continue to resolve images through `image_url`
- frontend no longer depends on hard-coded About-page portrait URLs unless the backend value is missing

## 11) Summary

The frontend is already aligned to a backend-first image workflow.

The backend now needs to own storage, URLs, and admin mutation endpoints for media assets, gallery photos, branding images, and the two director portraits. Once those fields and routes are implemented, the public site and dashboard will both read from the same source of truth.