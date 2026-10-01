# 0003. React with Vite

- Status: accepted
- Date: 2026-09-29

## Context

The challenge requires React with TypeScript, built with either Next.js or Vite. Every
screen of the application sits behind login, and no page needs to be indexed by search
engines.

## Decision

A single-page application built with Vite, with client-side routing.

## Alternatives considered

- **Next.js.** Server-side rendering and server components bring nothing to a private
  application, and server-side data fetching would overlap with the Redux store that
  the challenge requires.

## Consequences

- The frontend is static files served by any web server, talking only to the API.
- Development builds start fast, and Vitest shares Vite's configuration
  ([ADR 0010](0010-testing-strategy.md)).
- Route protection happens on the client, so the API must, and does, reject every
  unauthenticated request on its own ([ADR 0008](0008-jwt-cookie-authentication.md)).
