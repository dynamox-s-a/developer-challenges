# Testing strategy

## Objective

The strategy prioritizes observable behavior, domain rules, and boundary contracts. Each layer
covers a different risk; no isolated test is treated as a sufficient guarantee.

## Principles

- Test our logic, not library internals.
- Use accessible queries and interactions close to user actions.
- Keep fixtures deterministic.
- Mock at the narrowest external boundary.
- Cover reproducible regressions.
- Avoid large snapshots and brittle structural assertions.
- Distinguish product failures from test environment limitations.

## Layers

### Domain functions

Vitest covers pure transformations:

- metric and axis parsing;
- unit association;
- ISO-to-timestamp conversion;
- mapping `max` to `value`;
- nearest-point lookup;
- indicator synchronization and hiding.

These tests are fast and require neither the DOM nor network access.

### State and effects

Reducers are exercised through public actions and validate transitions between `idle`, `loading`,
`success`, and `error`.

Selectors receive representative states and confirm grouping by metric and stable derivations.

Sagas are tested with declarative effects and `redux-saga-test-plan`, covering:

- service calls;
- mapper transformation;
- success dispatch;
- error normalization and dispatch;
- watching with `takeLatest`.

### Components

Testing Library renders components with real providers when integration matters. Tests query roles,
names, and accessible text instead of classes or the internal tree.

Scenarios include:

- loading;
- error and retry;
- no data;
- complete and partial summaries;
- composition of all three charts;
- Error Boundary fallback;
- navigation and routes.

### Highcharts

JSDOM does not implement SVG layout like a browser. Therefore:

- components mock Highcharts at the boundary;
- `chartOptions` is tested as configuration preparation;
- synchronization is tested against the `SynchronizableChart` interface;
- adapters receive minimal doubles of the imperative API;
- SVG rendering and real events are validated in Cypress.

This boundary avoids reproducing Highcharts internals in tests.

### Function contract

`tests/api/measurements.test.ts` imports `GET` directly and confirms:

- HTTP 200 status;
- JSON content;
- equivalence with `mock/db.json`;
- stable, unique IDs;
- full parity of `name` and `data` with the official file through a SHA-256 hash.

The test protects parity between local and production runtimes without starting a server.

### Storybook

Stories document isolated components and states:

- loading, error, and empty states;
- complete and partial summaries;
- cards and charts with predictable data.

The accessibility addon runs axe checks in the canvas. Storybook supports development and visual
review but does not replace integration testing or Cypress.

### Local Cypress

The approach is hybrid:

- success scenarios use `json-server` and the real application;
- deterministic failures use `cy.intercept`;
- the e2e build receives `VITE_API_BASE_URL=http://127.0.0.1:3001`.

The covered flows are:

- load the page and render the summary and charts;
- receive an API failure, display an error, and recover after retry;
- prevent overflow on mobile and tablet;
- show and hide tooltip/crosshair across all three charts.

The SVG synchronization scenario allows retries only in headless mode because Electron events and
layout may vary. The assertion still requires indicators in all three charts.

### Production smoke test

After deployment, CD:

1. confirms HTTP responses for `/data`, `/api/measurements`, and Storybook;
2. validates with `jq` that the API contains seven series with `id`, `name`, and `data`;
3. runs the loading and synchronization specs against the public URL.

The smoke test detects environment differences that local tests do not cover.

## Accessibility

Checks combine:

- accessible Testing Library queries;
- the axe helper in component tests;
- the a11y addon in Storybook;
- semantics and keyboard support in Cypress when part of the flow;
- manual inspection of focus, contrast, and reading.

axe-core detects known classes of problems but does not certify complete accessibility.

## Responsiveness

Components are validated by behavior in JSDOM when possible. Overflow and resizing depend on real
layout and are checked by Cypress in mobile and tablet viewports, in addition to visual review on
desktop.

## Coverage

```bash
pnpm test:coverage
```

The V8 provider generates a local report. No threshold is configured, and coverage does not run in
the current `quality` job. The percentage is a signal for identifying untested areas, not a
standalone quality target.

## Commands

```bash
pnpm test              # Vitest suite
pnpm test:watch        # Vitest in watch mode
pnpm test:coverage     # Vitest with coverage
pnpm typecheck:e2e     # Cypress types
pnpm storybook         # isolated review
pnpm build-storybook   # static build
pnpm e2e               # interactive Cypress with temporary services
pnpm e2e:ci            # headless Cypress against the build
```

## CI

The `quality` job runs unit tests and builds after formatting, lint, and type checks. The `e2e` job
installs the Cypress binary and runs `pnpm e2e:ci` in parallel. Cypress failures upload screenshots
and videos as artifacts with limited retention.

Deployment can begin only after both jobs complete successfully.

## When to add a test

- Transformation rule: pure unit test.
- State transition: reducer or saga.
- Accessible behavior: component test.
- Isolated visual state: Storybook.
- Browser/API integration: Cypress.
- Production contract: Function test or smoke test.

A bug should receive the lowest-level test that faithfully reproduces its cause. Higher-layer tests
are added when the risk lies in integration, not to duplicate the entire pyramid.

## Completion criteria

A change is tested proportionately when:

- changed rules have behavioral coverage;
- loading, error, empty, and success states remain consistent;
- mocks do not hide the modified boundary;
- test TypeScript passes;
- application and Storybook builds pass;
- Cypress covers affected critical integrations;
- failures are not hidden by retries, snapshots, or disabled rules.
