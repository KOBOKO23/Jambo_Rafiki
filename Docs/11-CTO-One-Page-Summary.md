# CTO One-Page Summary

## Project

Jambo Rafiki frontend web platform for public outreach, donations, engagement forms, gallery, and admin dashboard.

Current stack:

- React 18 + TypeScript + Vite
- Tailwind CSS + UI primitives
- Route-level lazy loading
- Shared typed API client

Deployment target:

- Frontend on Vercel
- Backend on AWS

## Release status

Current readiness baseline:

- Typecheck: passing
- Lint: passing
- Build: passing
- Tests: passing (8 suites, 17 tests)

Known non-blocking item:

- Bundle budget script currently fails due large admin/charts chunks

## Business-critical flows

1. Donations
- M-Pesa initiation and status handling
- Stripe payment method + payment intent confirmation
- Webhooks intentionally backend-only

2. Public engagement
- Contact form
- Testimonials submission
- Volunteer and sponsorship interest
- Newsletter subscribe/unsubscribe

3. Media
- Gallery data and image URLs sourced from backend
- Relative and absolute media URL support

4. Admin
- Session + CSRF-based protected dashboard routes

## Security posture

- Secrets are not stored in frontend
- Runtime env enforces required API/Stripe publishable config in production
- Security headers configured in deployment config
- CSRF and credentials-aware API flow implemented

Critical backend requirements:

- strict CORS with exact frontend origin
- CSRF trusted origins configured
- webhook signature verification (Stripe)
- secure payment callback handling (M-Pesa)

## Operational risk snapshot

Top risks:

1. Backend misconfiguration (CORS/CSRF) causing form and admin failures
2. Payment webhook/callback misconfiguration causing donation state inconsistency
3. Media storage misconfiguration causing gallery upload/render issues

Mitigations in place:

- documented prelaunch and smoke checks
- defined go/no-go criteria
- rollback guidance in deployment runbook

## Decision gates before launch

Mandatory go-live checks:

- smoke check passes against deployed Vercel and AWS URLs
- real test donation succeeds and backend confirmation observed
- contact submission delivers email successfully
- testimonial submit visible in moderation workflow

Command:

```bash
npm run smoke:prelaunch -- --frontend https://your-frontend.vercel.app --backend https://api.yourdomain.com
```

## Immediate next priorities

1. Complete production hosting and run smoke checks
2. Confirm payment and contact flows end-to-end in production
3. Optimize chart/admin chunk size to restore budget gate compliance
4. Add automated CI enforcement for release gates if not already enabled
