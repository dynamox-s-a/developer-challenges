# 0002. NestJS backend on Express

- Status: accepted
- Date: 2026-09-29

## Context

The challenge requires a Node.js backend with RESTful endpoints, validation and error
handling. The API holds most of the business rules: sensor model per machine type,
positions per type, CSV ingestion and time-series metrics.

## Decision

NestJS, on its default Express adapter. Code is layered in one direction:
controllers extract the request and call a service, services hold the business rules,
and repositories are the only layer that talks to Prisma. The OpenAPI description is
generated from the code.

## Alternatives considered

- **Express or Fastify alone.** Lighter, but the layering, dependency injection and
  error handling would be ours to build and to keep consistent.
- **NestJS on the Fastify adapter.** Faster request handling, but for the 350 ms target
  the database is the bottleneck, not the HTTP layer, and the Express ecosystem for
  cookies and middleware is simpler.

## Consequences

- Nx supports NestJS natively, with generators for modules, controllers and services.
- The fixed layering keeps rules out of controllers and queries out of services, which
  makes each layer testable on its own.
- NestJS brings decorators and its module system, more structure than a small API
  strictly needs.
