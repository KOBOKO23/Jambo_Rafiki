# Takeover Checklist

Use this on day 1 for any new engineer taking over the project.

## A. Repository orientation

- [ ] Read Docs/README.md
- [ ] Read Docs/01-Architecture.md
- [ ] Read Docs/05-Frontend-Feature-Guide.md
- [ ] Read Docs/11-CTO-One-Page-Summary.md for current state

## B. Local environment validation

- [ ] Copy .env.example to .env.local
- [ ] Set VITE_API_BASE_URL
- [ ] Set VITE_STRIPE_KEY
- [ ] Run npm install
- [ ] Run npm run dev

## C. Quality baseline

- [ ] Run npm run typecheck
- [ ] Run npm run lint
- [ ] Run npm run test:run
- [ ] Run npm run build

Expected baseline:

- all above pass
- optional budget check may fail due current chunk size

## D. Integration understanding

- [ ] Review src/services/api.ts endpoint groups
- [ ] Confirm /api/v1 contract assumptions
- [ ] Validate org config drives contact/bank details
- [ ] Confirm donation paths for M-Pesa and Stripe

## E. Deployment and operations readiness

- [ ] Review Docs/07-Deployment-Runbook.md
- [ ] Review Docs/12-OnCall-Quick-Reference.md for incident handling
- [ ] Run smoke checker against deployed URLs when available

Command:

```bash
npm run smoke:prelaunch -- --frontend https://your-frontend.vercel.app --backend https://api.yourdomain.com
```

## F. Security checks

- [ ] Confirm no secret backend values exist in frontend env
- [ ] Confirm CSRF and CORS requirements are understood
- [ ] Confirm webhook processing is backend-only

## G. Ownership handoff artifacts

Collect and store these before prior owner exits:

- active production URLs (frontend/backend)
- Vercel project access and environment ownership
- AWS account/service ownership and on-call contacts
- payment provider dashboard access paths
- known issues backlog and pending optimizations

## H. First improvement tasks after takeover

1. Resolve bundle budget overages by further chunk optimization.
2. Add CI workflow gates if not already enforced.
3. Add post-deploy synthetic monitoring for health/contact/donation checks.
4. Document rollback execution steps in team runbooks.
