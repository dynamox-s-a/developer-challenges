# Contributing

## Before you begin

Read:

- [`README.md`](README.md) for running the project;
- [`docs/sketch.md`](docs/sketch.md) for scope;
- [`docs/architecture.md`](docs/architecture.md) for boundaries;
- [`docs/testing-strategy.md`](docs/testing-strategy.md) for selecting tests;
- [`docs/TODO.md`](docs/TODO.md) for the roadmap.

Prioritize challenge requirements, correctness, accessibility, and proportionate changes. Do not
add infrastructure, dependencies, or abstractions without a demonstrated benefit.

## Environment

- Node.js 24
- pnpm 9.15.4

```bash
corepack enable
cp .env.example .env
pnpm install --frozen-lockfile
pnpm dev
```

Do not commit `.env`, `.vercel`, credentials, or generated artifacts.

## Work organization

1. Relate the change to a requirement, bug, or documented decision.
2. Identify the smallest boundary that completely solves the problem.
3. Preserve existing changes outside the scope.
4. Implement with TypeScript strict.
5. Add or adjust proportionate tests.
6. Update documentation when the contract, architecture, or operation changes.
7. Review the complete diff.
8. Run the appropriate validations.

## Code

- Use functional components and composition.
- Separate presentation, transformation, HTTP access, and effects.
- Prefer `@/` aliases between `src` modules.
- Do not use `any`, `@ts-ignore`, or disabled rules to hide errors.
- Keep global state serializable and shared.
- Keep transient interaction and library instances outside Redux.
- Extract abstractions when they provide reuse, isolation, or a clear benefit.
- Follow Biome formatting and linting.

## Measurement contract changes

The contract crosses runtimes and layers. When changing it, review:

- [`mock/db.json`](mock/db.json);
- [`api/measurements.ts`](api/measurements.ts);
- `src/features/measurements/api`;
- `src/features/measurements/model`;
- slice and selectors;
- unit and Function tests;
- Cypress and documentation.

The local `json-server` and the Function must remain equivalent.

## Charts

- Keep timestamps in the model and formatting in presentation.
- Preserve units and metric/axis associations.
- Do not put tooltip, crosshair, or `Highcharts.Chart` in Redux.
- Remove listeners and refs during cleanup.
- Test preparation and synchronization outside library internals.
- Validate real interaction in Cypress.

## Accessibility and responsiveness

- Use semantic HTML and accessible names.
- Preserve visible focus and keyboard support.
- Do not rely solely on color, icons, or tooltips.
- Validate loading, error, empty, and success states.
- Check overflow and resizing on mobile, tablet, and desktop.
- Use axe-core as support, not as a substitute for manual review.

## Proportionate testing

- Pure transformation: Vitest.
- State or effect: reducer, selector, or Saga.
- Accessible behavior: Testing Library.
- Isolated visual state: Storybook.
- Browser/API integration: Cypress.
- Production contract: Function test or smoke test.

Every bug should receive a regression test when it can be reproduced deterministically.

## Quality gate

For a complete delivery:

```bash
pnpm format:check
pnpm lint
pnpm exec tsc -b
pnpm typecheck:e2e
pnpm test:coverage
pnpm build
pnpm build-storybook
pnpm e2e:ci
```

Run `pnpm install --frozen-lockfile` first when dependencies are missing or the lockfile has changed.
Do not declare the delivery ready if a step failed or was not run without explaining why.

## Commits

- Use English messages in Conventional Commits format.
- Keep each commit reviewable and functional.
- Separate documentation, refactoring, tests, and behavior when they are independent changes.
- Do not include personal files, generated artifacts, or adjacent changes.

Examples:

```text
feat: add synchronized chart indicators
fix: prevent duplicate chart listeners
test: cover measurement retry flow
docs: document testing strategy
```

Agents must not create commits or push without an explicit request.

## Pull requests

Before opening one:

- synchronize the branch without rewriting shared history;
- review commits and the diff against the base;
- confirm that documentation and tests reflect the change;
- look for secrets and artifacts;
- run the quality gate;
- describe the summary, risks, and test plan.

The fork preserves official files on `main`; the solution lives on `leonardo-jacomussi`, and the
evaluation pull request targets `dynamox-s-a/developer-challenges:main`.

## Assisted tools

Cursor Rules, Commands, Skills, Bugbot, and MCPs are optional. `/pr-ready` and the
`frontend-quality-gate` skill can support review, but do not replace the commands or human
judgment. See [`docs/ai-assisted-development.md`](docs/ai-assisted-development.md).
