# Roadmap

This document tracks project deliveries and pending work at the capability level. Commit history
remains in Git; decisions and technical details are documented in
[`docs/sketch.md`](sketch.md) and [`docs/architecture.md`](architecture.md).

## Status

- [x] completed and validated
- [ ] pending

## Completed phases

### Phase 1 — Scaffold and tooling

- [x] Configure React, TypeScript strict, Vite, Material UI, and Biome.
- [x] Define Node 24, pnpm 9, aliases, and combined application/API execution.
- [x] Prepare the theme, font, favicon, and environment files without credentials.

### Phase 2 — Data layer

- [x] Model the external contract and internal domain.
- [x] Implement the mapper, Axios, slice, selectors, and Redux Saga.
- [x] Cover transformation, state, and effects with tests.

### Phase 3 — Base interface

- [x] Create the `/data` route, providers, and loading, error, retry, and empty states.
- [x] Implement the machine summary and prototype-based layout.
- [x] Add semantics, an Error Boundary, and component tests.

### Phase 4 — Charts

- [x] Implement RMS acceleration, temperature, and RMS velocity cards.
- [x] Map series, axes, units, and Highcharts options.
- [x] Synchronize tooltip and crosshair by the nearest timestamp.
- [x] Ensure cleanup and test the synchronization functions.

### Phase 5 — Responsiveness and accessibility

- [x] Adapt the interface for mobile, tablet, and desktop.
- [x] Eliminate horizontal overflow and validate chart resizing.
- [x] Improve keyboard support, focus, semantics, contrast, and accessible states.
- [x] Review performance and bundle splitting based on evidence.

### Phase 6 — Storybook

- [x] Configure Storybook with the theme and accessibility addon.
- [x] Document cross-cutting states, the summary, and chart components.
- [x] Validate type checking and the static build.

### Phase 7 — Cypress

- [x] Configure interactive and headless execution.
- [x] Cover real loading, failure/retry, responsiveness, and synchronization.
- [x] Use a hybrid approach with `json-server` and boundary-level interception.

### Phase 8 — CI

- [x] Create separate quality and end-to-end jobs.
- [x] Configure caching, failure artifacts, concurrency, and Dependabot.
- [x] Validate the workflow locally and in GitHub Actions.

### Phase 9 — Vercel deployment

- [x] Publish the application and mock API on the same domain.
- [x] Publish Storybook in a separate project.
- [x] Make CD conditional on passing CI.
- [x] Run endpoint smoke tests and Cypress in production.

### Phase 10 — AI-oriented documentation

- [x] Create `AGENTS.md` and six scoped Rules.
- [x] Create Commands and Skills for auditing and quality.
- [x] Define Bugbot criteria.
- [x] Configure optional MCPs without committed credentials.

## Phase 11 — Final public documentation

- [x] Publish this roadmap and rewrite `docs/sketch.md` as the final blueprint.
- [x] Consolidate `README.md` as the entry point for evaluation and execution.
- [x] Create `docs/architecture.md`.
- [x] Create `docs/testing-strategy.md`.
- [x] Create `docs/ai-assisted-development.md`.
- [x] Record ADRs for json-server, Redux Saga, and Highcharts.
- [x] Create `CONTRIBUTING.md`.
- [x] Align `AGENTS.md`, Rules, and Commands with the public documentation.
- [x] Validate links, security, URLs, and the complete quality gate.

## Phase 12 — Final audit

- [x] Audit functional and technical requirements, bonus items, and evaluation criteria.
- [x] Protect dataset parity, the Saga watcher, and route behavior with tests.
- [x] Validate the interface, states, responsiveness, keyboard support, and accessibility in a browser.
- [x] Perform manual review, Bugbot, Security Review, and dependency auditing.
- [x] Align the branch tree with the delivery strategy without restoring instructions from `main`.
- [x] Run the complete local quality gate and validate the current public URLs.
- [x] Confirm bases, diff, and local pull request readiness, without pushing or creating it remotely.

Residual risk: `pnpm audit --prod` is clean, but the latest Vercel CLI retains transitive advisories
in tooling dependencies. The CLI is not part of the runtime bundle and is used only with trusted
configuration and code in a controlled environment; the advisories remain monitored without
incompatible overrides.
