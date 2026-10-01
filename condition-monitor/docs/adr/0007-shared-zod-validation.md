# 0007. Validation with shared Zod schemas

- Status: accepted
- Date: 2026-09-29

## Context

Several rules are checked on both sides: a position belongs to the machine type, a
pump accepts only one sensor model, a quantity has a fixed unit and an axis rule. The
API must reject invalid input with a `422` naming the field before any query, and the
forms should show the same error before the request is sent.

## Decision

Validation schemas are written with Zod in `libs/shared`. The API validates every
request body and query with them at the edge, and the web app uses the same schemas in
its forms. TypeScript types are inferred from the schemas.

## Alternatives considered

- **class-validator DTOs**, the NestJS default. They serve only the backend, so the
  frontend would repeat every rule, and the two copies could diverge.

## Consequences

- A rule is written once and cannot disagree between frontend and backend.
- NestJS needs a small validation pipe to run Zod schemas instead of its default.
- The OpenAPI description is produced from the Zod schemas rather than from DTO
  decorators.
