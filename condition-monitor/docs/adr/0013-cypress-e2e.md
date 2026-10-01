# 0013. Cypress for end-to-end tests

- Status: accepted
- Date: 2026-10-01

## Context

The challenge offers, as a bonus, end-to-end tests with Cypress covering a full user
flow. Beyond the happy path, the tests should also try to break the application, since
that is where a full-stack flow earns its keep.

## Decision

Cypress, added through `@nx/cypress`, as its own project `apps/web-e2e`, with two specs:
`full-flow.cy.ts`, one run from login to logout, and `adversarial.cy.ts`, which attacks
every boundary it can reach. Selectors are by role and name, through
`@testing-library/cypress`, the same way the component tests read the interface.

`apps/web-e2e/run.mjs` orchestrates a run: it recreates a database of its own,
`condition_monitor_e2e`, builds the API and the web app for production, starts them on
ports of their own, and runs Cypress against them. Each test starts from the same state
through a `db:reset` task that truncates and reseeds two users and the `DRY` sector; the
second user is there to prove one account cannot reach another's data.

## Alternatives considered

- **Playwright.** Comparable, and lighter in CI. The challenge names Cypress, and the
  interface is already tested with Testing Library, which Cypress reuses.
- **The `cypress-io/github-action`.** It installs and caches Cypress and wraps the run.
  The workflow already caches the binary and runs the orchestration script, so the
  action would add a layer without removing one.
- **Reusing the test database.** The e2e run recreates and reseeds its database between
  tests, which would disrupt the integration tests; a third database keeps them apart.

## Consequences

- Cypress is a large development dependency: a browser binary, cached in CI, and a
  tooling tree that carries its own advisories, none of which ship
  ([performance and audit notes in the README](../../README.md)).
- The API runs with `NODE_ENV` set to `e2e`, not production, so the session cookie is
  served without the `Secure` flag and the browser keeps it over plain HTTP.
- The tests reach the API through the web app's own proxy, so `cy.request`,
  `window.fetch` and the application share one session cookie.
- The suite runs in CI in a job of its own, under `xvfb`, since it is the only job that
  opens a browser; the `check` job skips the Cypress binary.
