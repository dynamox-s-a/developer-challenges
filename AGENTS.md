# Project guidelines

## Objective

Keep the Dynamox measurements dashboard easy to run, faithful to the requirements, and ready for
evaluation. Prioritize functional correctness, accessibility, responsiveness, testing, and clarity
over additional abstractions or infrastructure.

## Stack

- React 19, TypeScript strict, and Vite 8
- Material UI 5
- Redux Toolkit and Redux Saga
- Highcharts
- Vitest, Testing Library, Cypress, and Storybook
- Biome, pnpm 9, and Node.js 24

## Architecture

- `src/features/measurements`: domain API, model, store, and components.
- `src/components`: cross-cutting states and components.
- `src/store`: global configuration and root saga.
- `mock/db.json`: dataset used by the local `json-server`.
- `api/measurements.ts`: Function that serves the same contract on Vercel.
- `.github/workflows`: quality gate, e2e, and deployment conditional on green CI.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm format:check
pnpm lint
pnpm exec tsc -b
pnpm typecheck:e2e
pnpm test
pnpm test:coverage
pnpm build
pnpm build-storybook
pnpm e2e:ci
```

Run validations proportional to the risk and the complete quality gate before declaring a delivery
ready.

## Constraints

- Do not add Nx, a production backend, or dependencies without a demonstrated benefit.
- Preserve TypeScript strict; do not use `any`, `@ts-ignore`, or disable rules to hide errors.
- Keep tooltip, crosshair, and Highcharts instances out of Redux.
- Preserve the contract among `mock/db.json`, the Function, and the mapper.
- Do not commit credentials, `.env`, `.vercel`, or generated artifacts.
- Update documentation when an architectural decision changes.
- Do not create commits or push without an explicit request.

The Node version is defined in `.nvmrc`.

## Documentation

- [README](README.md): setup, scripts, URLs, and delivery overview.
- [Blueprint](docs/sketch.md): scope, assumptions, and consolidated solution.
- [Architecture](docs/architecture.md): data, state, charts, and deployment.
- [Testing](docs/testing-strategy.md): layers, mocks, and CI.
- [AI](docs/ai-assisted-development.md): Rules, Commands, Skills, Bugbot, and MCPs.
- [Contributing](CONTRIBUTING.md): conventions and quality gate.
