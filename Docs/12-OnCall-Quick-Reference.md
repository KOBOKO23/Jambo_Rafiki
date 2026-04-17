# On-Call Quick Reference

Use this file during incidents and production checks.

## Critical links to know

- Runbook: Docs/07-Deployment-Runbook.md
- Security: Docs/08-Security-Operations.md
- AWS backend requirements: Docs/09-AWS-Backend-Handover.md
- Ownership and launch checklist: Docs/10-Takeover-Checklist.md

## Fast health checks

Local quality gate:

```bash
npm run typecheck && npm run lint && npm run test:run && npm run build
```

Deployed smoke check:

```bash
npm run smoke:prelaunch -- --frontend https://your-frontend.vercel.app --backend https://api.yourdomain.com
```

## Incident triage matrix

P1 (Immediate):

- Donations failing broadly
- Admin login unavailable
- Public site unavailable or broken routing

P2 (Urgent):

- Contact/testimonial submissions failing
- Gallery assets failing to load for most users
- Significant auth/session instability

P3 (Normal):

- Minor UI regressions
- Non-critical admin page issues
- Performance degradation without functional outage

## First 10 minutes checklist

1. Confirm blast radius
- all users vs some users
- one flow vs platform-wide

2. Identify failing layer
- frontend route rendering
- API endpoint behavior
- auth/CORS/CSRF rejection
- third-party payment/email/storage dependency

3. Pull quick evidence
- browser console/network logs
- backend error logs
- deployment status and recent release diff

4. Decide rollback threshold
- if critical flow down and no fix <15 min, rollback to last known-good

## Common failure patterns and responses

1. CORS preflight fails
Symptoms:
- browser blocks request before backend processing

Action:
- verify backend Access-Control-Allow-Origin equals exact frontend origin
- verify Access-Control-Allow-Credentials true

2. CSRF failures on mutating endpoints
Symptoms:
- 403 on form submit/admin actions

Action:
- verify CSRF trusted origins
- verify cookie/security settings for production domain

3. Stripe donation errors
Symptoms:
- payment confirmation fails or webhook not updating final status

Action:
- verify backend Stripe secret and webhook signing secret
- verify webhook endpoint health and recent event logs

4. M-Pesa initiation without completion
Symptoms:
- pending states never resolve

Action:
- verify callback URL accessibility
- verify provider credentials and callback signature validation

5. Contact form succeeds but no email arrives
Symptoms:
- API returns success but mailbox empty

Action:
- inspect backend mail provider logs and queue retries
- validate sender domain/auth records

## Rollback quick steps

Frontend:

- redeploy prior stable Vercel deployment

Backend:

- rollback AWS release to known-good version
- preserve /api/v1 compatibility during rollback

After rollback:

- re-run smoke check
- verify donation/contact/admin paths

## Communication template (internal)

Status update:

- Incident: <summary>
- Impact: <who/what is affected>
- Start time: <timestamp>
- Current state: investigating | mitigating | monitoring
- Next update ETA: <time>

Resolution update:

- Root cause: <short description>
- Fix: <what changed>
- Validation: <checks run>
- Follow-up actions: <preventive items>

## Post-incident follow-up

1. Add a regression test if applicable.
2. Update Docs runbook/checklist with learned fix.
3. Record timeline and root cause in team incident log.
