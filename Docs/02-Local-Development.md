# Local Development

## Prerequisites

- Node.js 18+
- npm 9+
- Backend API reachable for integrated testing, or local fallback URL available

## Installation

1. Install dependencies.

```bash
npm install
```

2. Create local env file from template.

```bash
cp .env.example .env.local
```

3. Populate required variables.

- VITE_API_BASE_URL
- VITE_STRIPE_KEY
- VITE_ENABLE_CREDENTIALS

## Daily commands

Start dev server:

```bash
npm run dev
```

Run type checks:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

Run test suite once:

```bash
npm run test:run
```

Run production build:

```bash
npm run build
```

Optional budget check:

```bash
npm run budget
```

## Recommended pre-PR command sequence

```bash
npm run typecheck && npm run lint && npm run test:run && npm run build
```

## Troubleshooting

1. Runtime env errors at startup
Cause: missing required VITE variables in production-like mode.
Fix: verify src/config/runtimeEnv.ts requirements and set env vars.

2. API calls failing locally
Cause: backend base URL mismatch or CORS issue.
Fix: verify VITE_API_BASE_URL and backend CORS origin allowlist.

3. Stripe donation path unavailable
Cause: missing VITE_STRIPE_KEY.
Fix: set publishable key in local env.

4. Flaky route tests
Cause: missing router context in specific test renders.
Fix: wrap components with BrowserRouter or MemoryRouter where needed.

5. Budget script fails
Cause: large charts/admin chunks.
Fix: treat as optimization item, not immediate deploy blocker unless CI enforces it.
