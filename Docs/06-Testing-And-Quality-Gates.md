# Testing And Quality Gates

## Current baseline

Latest verified baseline:

- Typecheck passing
- Lint passing
- Build passing
- Tests passing (8 suites, 17 tests)

## Test location

- src/test

Key test coverage includes:

- routing smoke behavior
- donation flows (M-Pesa + Stripe)
- contact form success/error paths
- testimonial submit success/error paths
- gallery media URL handling
- organization config rendering
- accessibility interactions
- error boundary behavior

## Core quality commands

Typecheck:

```bash
npm run typecheck
```

Lint:

```bash
npm run lint
```

Test run:

```bash
npm run test:run
```

Build:

```bash
npm run build
```

Optional budget check:

```bash
npm run budget
```

Combined strict check:

```bash
npm run check
```

Note:

- npm run check includes budget gate
- budget gate may fail due current charts/admin size

## Release gate recommendation

Use this minimum release gate before deployment:

```bash
npm run typecheck && npm run lint && npm run test:run && npm run build
```

Run smoke validation against deployed URLs after deploy:

```bash
npm run smoke:prelaunch -- --frontend https://your-frontend.vercel.app --backend https://api.yourdomain.com
```

## Testing principles for future changes

1. Add tests for high-risk user paths before refactor.
2. Keep API integration tests aligned with payload contracts.
3. Add regression tests for every production bug fix.
4. Keep route and accessibility smoke checks stable.
5. Mock external services (Stripe/API) in unit tests.

## CI suggestions

Required checks on pull request:

- typecheck
- lint
- test:run
- build

Optional non-blocking check:

- budget

If budget becomes blocking, complete chunk optimization first.
