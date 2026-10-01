# 0011. k6 in Docker for load tests

- Status: accepted
- Date: 2026-10-01

## Context

The challenge requires a latency below 350 ms for all requests, and assumption D1
commits to proving it with a load test over a realistic volume of data. The test must
keep a session per virtual user, cover every route with its own limit, and fail when a
route is above it.

## Decision

k6, run from its official image `grafana/k6`, pinned to 2.3.0. The scenario is one
script, `load-tests/latency.js`, with a threshold on the 99th percentile of each route.
`npm run load:setup` builds the data through the API and the simulator, and
`npm run load:test` starts the production build of the API against a database of its
own, runs k6 and stops the API.

## Alternatives considered

- **autocannon.** An npm package, so nothing beyond Node. It measures one URL well; a
  scenario with sessions, several flows at once and a limit per route would be code
  written around it.
- **Artillery.** Scenarios in YAML with JavaScript hooks. Comparable, with a heavier
  dependency tree inside the workspace.
- **k6 installed on the machine.** One more thing to install for whoever runs the test;
  the image needs only the Docker already required for PostgreSQL.

## Consequences

- Nothing is added to `package.json`; the first run pulls an image of 111 MB.
- The script runs in k6's own JavaScript runtime, not Node: it cannot import the shared
  library, so it repeats the list of series and builds its readings by hand.
- k6 clears cookies at every iteration unless told otherwise; the script sets
  `noCookiesReset`, since each virtual user logs in once.
- The container reaches the API through the host network. That works on Linux, where
  the test was run; Docker Desktop on macOS and Windows handles host networking
  differently, and the test was not run there.
- The load test stays out of CI: shared runners vary too much for a fixed limit to mean
  the same thing on each run. The published numbers come from one named machine
  ([performance](../performance.md)).
