# Security Operations

## Security model summary

Frontend is a public client and must never hold secret credentials.
All sensitive operations are enforced server-side.

## Frontend controls already present

- CSP and security headers configured in host configs
- session and CSRF-aware API interaction patterns
- credentials mode configurable via runtime env
- webhook endpoints are not called directly by browser

Config references:

- vercel.json
- netlify.toml
- src/services/api.ts
- src/config/runtimeEnv.ts

## Secret management policy

Never place these in frontend env vars:

- Stripe secret key
- Stripe webhook secret
- M-Pesa consumer secret and passkey
- SMTP/API mail provider secrets
- database credentials

Allowed in frontend env:

- publishable keys only (for Stripe)
- public API base URL

## Payment security requirements (backend)

- verify Stripe webhook signatures
- ensure payment status is confirmed server-side
- validate amount/currency server-side, not browser-only
- keep idempotency for repeated retries

M-Pesa:

- validate callbacks from provider
- protect callback endpoint from spoofing
- log transaction state transitions

## CORS and CSRF requirements

Backend must:

- allow exact frontend origin, not wildcard when credentials used
- send Access-Control-Allow-Credentials true
- include frontend origin in CSRF trusted origins
- enforce secure cookies in production

## Logging and audit expectations

Track these in backend logs and monitoring:

- auth failures and forbidden responses
- repeated 429 throttling events
- donation initiation and confirmation lifecycle
- upload failures and storage permission errors
- email provider failures

## Incident response starter playbook

Severity 1:

- payments failing globally
- authentication unavailable
- major route outage

Immediate actions:

1. freeze new deployments
2. capture failing request/response metadata
3. switch to known-good deployment if recovery > 15 minutes
4. publish internal incident note with timeline

Severity 2:

- partial form failures
- non-critical admin page degradation

Actions:

1. isolate impacted endpoint
2. add temporary user-facing notice if needed
3. patch and deploy with targeted test coverage

## Security review cadence

- run npm audit regularly
- review CSP changes before each release
- rotate backend credentials on schedule
- verify webhook secrets after infra changes
