# Frontend Feature Guide

## Routing and layout

Main route wiring and layout composition is in App.tsx.

Public pages render inside shared Navigation and Footer.
Admin dashboard has dedicated protected route path.

## Public page ownership

Home:

- pages/Home
- marketing sections, stats, testimonials preview

About:

- pages/About
- mission, values, story, leadership

Programs:

- pages/Programs
- program details and impact messaging

Gallery:

- pages/Gallery
- category filtering, media listing, lightbox behavior

Get Involved:

- pages/GetInvolved
- volunteer and sponsorship pathways

Contact:

- pages/Contact
- contact forms, outreach entry points

Donations:

- pages/Donations and src/components/DonationForm.tsx
- M-Pesa and Stripe initiation flow

## Donation flow behavior

M-Pesa path:

- collects donor details and amount
- sends request to /donations/mpesa/
- displays pending, processing, completed, or fallback status messages

Card path:

- creates Stripe payment method in browser
- sends payment_method_id and donation metadata to backend /donations/stripe/
- confirms payment intent with client_secret

Rules:

- backend creates/manages payment intent lifecycle
- webhooks are backend-only

## Contact and engagement forms

Current forms include:

- contact
- volunteer
- newsletter subscribe/unsubscribe
- testimonial submit
- sponsorship interest

UI expectations:

- field-level validation where relevant
- user-friendly errors for 400 and 429
- success/failure feedback banners or states

## Organization config and fallback behavior

Organization contact and bank details are backend-driven via organization endpoint.

Frontend consumes config through hooks and shared state patterns.
If endpoint fails, safe fallback values are used for continuity.

## Gallery and media behavior

Gallery relies on backend categories/photos endpoints.

Image URL resolution supports:

- absolute URLs
- relative media URLs resolved against API origin

Expected behavior:

- graceful empty state
- loading indicators
- accessible lightbox interactions

## Admin behavior

Auth model:

- session-based with CSRF

Dashboard route:

- protected by ProtectedRoute

Admin resilience goals:

- resource fetch failures do not break entire dashboard
- list/detail/action states remain usable

## Accessibility and UX guardrails

- keyboard navigable forms and key interactions
- visible focus states
- route-level metadata/SEO alignment on public pages
- responsive layout support for mobile and desktop
