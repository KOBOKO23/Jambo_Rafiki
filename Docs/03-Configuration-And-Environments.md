# Configuration And Environments

## Runtime config source

Runtime variables are parsed in:

- src/config/runtimeEnv.ts

Behavior:

- VITE_API_BASE_URL or VITE_API_URL is required in production-like runtime
- VITE_STRIPE_KEY is required in production-like runtime
- VITE_ENABLE_CREDENTIALS defaults to true

## Required environment variables

- VITE_API_BASE_URL
Example: https://api.example.org

- VITE_STRIPE_KEY
Example: pk_live_xxx or pk_test_xxx

- VITE_ENABLE_CREDENTIALS
Allowed values: true or false
Default: true

## URL normalization rules

The API client normalizes configured base URL in src/services/api.ts:

- If base already ends with /api/v1, use as-is
- If base ends with /api, append /v1
- Otherwise append /api/v1

## Environment matrix

Development:

- Can fall back to http://localhost:8000/api/v1 when API var missing
- Stripe key may be empty

Production:

- Missing API base triggers hard error
- Missing Stripe key triggers hard error

## Vercel setup

Set project environment variables:

- VITE_API_BASE_URL
- VITE_STRIPE_KEY
- VITE_ENABLE_CREDENTIALS=true

Build settings:

- Build command: npm run build
- Output directory: dist

Routing config:

- vercel.json includes SPA rewrite to index.html

## Netlify notes

- netlify.toml includes SPA redirect
- netlify.toml includes security headers and caching policies

## Secrets policy

Never place private backend secrets in VITE_ variables.

VITE_ variables are public at build/runtime in browser bundles.

Do not expose:

- Stripe secret keys
- M-Pesa consumer secret
- Webhook signing secrets
- SMTP credentials
