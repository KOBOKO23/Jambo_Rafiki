# Deployment Runbook

## Deployment target

- Frontend: Vercel
- Backend: AWS

## Pre-deploy checklist

1. Ensure release gate passes locally.

```bash
npm run typecheck && npm run lint && npm run test:run && npm run build
```

2. Confirm environment values in Vercel.

- VITE_API_BASE_URL
- VITE_STRIPE_KEY
- VITE_ENABLE_CREDENTIALS=true

3. Confirm vercel.json rewrite and headers are committed.

## Deploy steps (frontend)

1. Push release branch to remote.
2. Trigger Vercel deploy for production branch.
3. Confirm deployment URL health and route loading.

Manual route checks:

- /
- /about
- /contact
- /donations
- /dashboard (auth gated)

## Post-deploy smoke checks

Run automated smoke check:

```bash
npm run smoke:prelaunch -- --frontend https://your-frontend.vercel.app --backend https://api.yourdomain.com
```

Expected outcomes:

- frontend root and SPA routes return success
- security headers present
- backend health and organization endpoints reachable
- CORS preflight includes origin + credentials

## Functional verification after deploy

1. Submit contact form and verify backend acceptance.
2. Submit testimonial and verify moderation/admin visibility.
3. Run donation tests with low test amounts:

- M-Pesa initiation path
- Stripe test card path

4. Verify organization-config email and call links render correctly.
5. Verify gallery image loading from backend URLs.

## Rollback strategy

Frontend rollback:

- redeploy last known-good Vercel deployment

Backend rollback:

- restore previous AWS release
- keep API contract compatibility for frontend in rollback window

Trigger rollback if:

- login/auth flow broken
- donation initiation failures sustained
- CORS/CSRF prevents form submissions
- major public route failures

## Production go/no-go criteria

Go live only if all true:

- quality gate passed
- smoke check passed
- donation test transaction succeeded
- contact email path confirmed
- testimonials endpoint functioning

Reference:

- Docs/10-Takeover-Checklist.md
