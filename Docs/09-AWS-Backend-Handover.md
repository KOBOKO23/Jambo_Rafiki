# AWS Backend Handover Requirements

This document defines backend capabilities required for the deployed frontend to function fully in production.

## Required backend base behavior

- API exposed over HTTPS
- base path supports /api/v1
- health endpoint live at /api/v1/health/
- organization endpoint live at /api/v1/organization/

## CORS and CSRF

Required configuration:

- allow exact Vercel frontend origin
- allow credentials
- trusted CSRF origins include frontend domain
- secure SameSite cookie policy suitable for cross-origin session flow

## Authentication and admin

Frontend assumes session auth for admin routes.

Required endpoints:

- /api/v1/admin/auth/csrf/
- /api/v1/admin/auth/login/
- /api/v1/admin/auth/me/
- /api/v1/admin/auth/logout/

## Donations and payments

Required endpoints:

- /api/v1/donations/mpesa/
- /api/v1/donations/stripe/

Backend responsibilities:

- validate all donation payload fields
- create/manage Stripe payment intents
- process M-Pesa initiation and callbacks
- reconcile final payment state with webhooks/callbacks
- return user-safe status messages

Do not require frontend to call webhook endpoints directly.

## Public engagement endpoints

Required endpoints:

- /api/v1/contacts/
- /api/v1/volunteers/
- /api/v1/newsletter/
- /api/v1/newsletter/unsubscribe/
- /api/v1/testimonials/
- /api/v1/sponsorships/interest/

## Gallery and media

Required endpoints:

- /api/v1/gallery/categories/
- /api/v1/gallery/photos/
- /api/v1/gallery/photos/featured/
- /api/v1/gallery/photos/random/

Media behavior requirements:

- return stable image_url values
- support absolute or relative URL format
- keep public media URLs accessible if intended for public pages

## Email integration requirements

Contact/testimonial/admin notifications depend on backend mail provider.

Backend must provide:

- reliable SMTP or API email provider integration
- retry handling for temporary failures
- observable delivery logs

## Storage requirements

Recommended:

- S3 for media
- CloudFront optional for caching

Must have:

- upload permission model
- durable storage lifecycle policy
- URL access strategy aligned with public/private assets

## Suggested AWS components

- ECS/EKS or Elastic Beanstalk for app runtime
- RDS for relational data
- S3 for uploads/media
- CloudWatch for logs and alarms
- Secrets Manager or SSM Parameter Store for secrets

## Acceptance test checklist before full launch

1. API health and organization endpoints pass.
2. CORS preflight passes from Vercel origin.
3. Admin login/logout flow works in production domain.
4. Contact submission accepted and email sent.
5. Testimonial submission accepted and reviewable.
6. M-Pesa test donation initiated and callback observed.
7. Stripe test donation succeeds and webhook confirmation observed.
8. Gallery renders backend media assets.
