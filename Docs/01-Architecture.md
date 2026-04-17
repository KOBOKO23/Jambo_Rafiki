# Architecture

## System overview

The repository contains a TypeScript React frontend built with Vite.
The frontend is deployed as a static app and communicates with a backend API contract rooted at /api/v1.

Production topology (target):

- Frontend hosting: Vercel
- Backend hosting: AWS
- Browser to backend communication: HTTPS with CORS and CSRF constraints
- Payments: Stripe and M-Pesa initiated by frontend, finalized server-side

## Frontend app architecture

Core runtime composition:

- Router: BrowserRouter with route-level lazy loading
- Auth boundary: AuthProvider wraps app routes
- Error boundary: top-level ErrorBoundary wraps route rendering
- Protected admin area: ProtectedRoute wraps dashboard routes

Reference file:

- App.tsx

## Route model

Public routes:

- /
- /about
- /programs
- /gallery
- /get-involved
- /contact
- /donations

Admin routes:

- /admin/login
- /admin/forbidden
- /dashboard/* (protected)

Catch-all behavior:

- Public fallback redirects to /

## Directory ownership model

Top-level page modules:

- pages/Home
- pages/About
- pages/Programs
- pages/Gallery
- pages/GetInvolved
- pages/Contact
- pages/Donations
- pages/Dashboard

Shared logic and UI:

- src/components
- src/contexts
- src/hooks
- src/services
- src/config

## Data flow principles

1. All HTTP calls go through shared API client in src/services/api.ts.
2. API base URL is derived by runtimeEnv and normalized to include /api/v1.
3. Frontend does not execute webhook logic.
4. Backend remains source of truth for organization contact/bank details and media URLs.

## Build and chunk strategy

Configured in vite.config.ts:

- Manual chunks for react ecosystem
- stripe chunk separation
- radix chunk separation
- charts chunk separation

Reasoning:

- Keep initial public route payload smaller
- Avoid loading dashboard/chart-heavy dependencies on first paint

## Operational constraints

Known behavior:

- Build passes
- Typecheck passes
- Lint passes
- Tests pass
- Bundle budget script currently fails due large charts/admin payload

Implication:

- Deployment can proceed
- Performance budget governance still needs follow-up optimization
