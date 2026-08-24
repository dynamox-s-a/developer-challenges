# ADR 0001 — Use json-server in development

## Status

Accepted.

## Context

The challenge requires fetching the provided dataset through a mock REST API and suggests
`json-server`. The solution must also be easy to start locally and deploy to Vercel without turning
the mock into a production backend.

## Decision

Use `json-server` with [`mock/db.json`](../../mock/db.json) in development and local end-to-end
tests. Add a stable `id` per series, as required to represent REST resources, without modifying
`name` or `data` from the official file.

In production, use a Vercel Function that imports the same file and responds at
`GET /api/measurements`. The runtime changes, but the payload and data source remain the same.

## Alternatives considered

### Mock Axios in the frontend

This would reduce setup, but would not satisfy REST API integration or exercise the HTTP boundary
in success scenarios.

### Host json-server as a persistent process

This would reproduce the local runtime, but add unnecessary service and operational overhead for a
static, read-only dataset.

### Implement a backend and database

This is not a requirement of this front-end challenge and would introduce authentication,
persistence, deployment, and maintenance without benefiting the requested evaluation.

## Consequences

Positive:

- predictable local execution;
- real HTTP integration;
- a single data source;
- contract parity between local and production environments;
- verifiable parity with the official dataset, ignoring only the `id` extension;
- straightforward testing and deployment.

Negative:

- the Function does not reproduce every `json-server` behavior;
- the API is read-only and has no persistence;
- contract changes require coordinated updates to the mock, Function, mapper, tests, and docs.
