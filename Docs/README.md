# Jambo Rafiki Developer Documentation

This directory contains the canonical handover docs for engineers owning the frontend and coordinating backend integration.

## Who this is for

- Frontend engineers maintaining React/Vite app behavior
- Full-stack engineers integrating AWS backend services
- DevOps engineers handling deployment, secrets, and rollout safety
- QA engineers validating release readiness

## Documentation map

1. 01-Architecture.md
Purpose: system boundaries, app structure, and routing model.

2. 02-Local-Development.md
Purpose: local setup, scripts, and troubleshooting.

3. 03-Configuration-And-Environments.md
Purpose: environment variables, runtime config, and host-specific setup.

4. 04-API-Contract-Integration.md
Purpose: API base, endpoints used by the frontend, and payload rules.

5. 05-Frontend-Feature-Guide.md
Purpose: page ownership, forms, donation flow, admin flow, and media behavior.

6. 06-Testing-And-Quality-Gates.md
Purpose: testing strategy, release gates, and CI-ready commands.

7. 07-Deployment-Runbook.md
Purpose: Vercel deployment, smoke checks, and go/no-go steps.

8. 08-Security-Operations.md
Purpose: security controls, secrets policy, and operational alerts.

9. 09-AWS-Backend-Handover.md
Purpose: backend requirements for the frontend to work in production.

10. 10-Takeover-Checklist.md
Purpose: first-day onboarding checklist for a new owner.

11. 11-CTO-One-Page-Summary.md
Purpose: executive technical snapshot, risk posture, and launch decision gates.

12. 12-OnCall-Quick-Reference.md
Purpose: incident triage, fast commands, rollback cues, and response templates.

13. 13-Admin-Dashboard-Guide.md
Purpose: admin route access, module capabilities, operational actions, and backend dependency checklist.

## Quick start for new owners

1. Read 10-Takeover-Checklist.md.
2. Validate local setup with commands in 02-Local-Development.md.
3. Review runtime and secrets in 03-Configuration-And-Environments.md.
4. Confirm API compatibility in 04-API-Contract-Integration.md.
5. Run release gates and smoke checks from 06 and 07 before any deploy.

## Source references in repository

- App entry and route composition: App.tsx
- Runtime environment validation: src/config/runtimeEnv.ts
- API client and contract types: src/services/api.ts
- Build and script commands: package.json
- Vite chunking strategy and test config: vite.config.ts
- Rollout and checks: Docs/07-Deployment-Runbook.md
- Takeover status checklist: Docs/10-Takeover-Checklist.md
- Smoke checker script: scripts/prelaunch-smoke-check.mjs
