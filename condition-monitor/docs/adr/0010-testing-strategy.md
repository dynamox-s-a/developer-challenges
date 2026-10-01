# 0010. Testing strategy

- Status: accepted
- Date: 2026-09-29

## Context

The challenge requires unit tests on frontend and backend that ensure correct business
logic. Several rules live in the database itself: composite foreign keys, `CHECK`
constraints and partial indexes ([domain model](../domain-model.md)). A mocked
database cannot prove those rules reject invalid data.

## Decision

- **Vitest** for the web app, the simulator and `libs/shared`: the native runner for
  Vite, and the lighter choice wherever NestJS is not involved.
- **Jest** for the API, the default for NestJS in Nx.
- **Integration tests** for the API against a real PostgreSQL started by Docker
  Compose, dedicated to tests. They cover every database rule, asserting that the
  invalid case is rejected, next to the valid case at the limit.
- **End-to-end tests** with Cypress are a bonus, planned after the required features.

## Alternatives considered

- **One runner everywhere.** Vitest on NestJS or Jest on Vite both work, at the cost of
  extra configuration for no gain in coverage.
- **SQLite or mocks in API tests.** Faster, but SQLite has no `NULLS NOT DISTINCT`,
  and its types and locking differ from PostgreSQL, so a passing test would not prove
  the production database behaves the same. Mocks test nothing of the database.

## Consequences

- Running the integration tests requires Docker.
- A constraint that exists in the schema but does not reject what it should is caught,
  not only a constraint that is missing.
