# 0001. Nx monorepo

- Status: accepted
- Date: 2026-09-29

## Context

The project has three runnable parts, a web app, an API and a simulator, plus code
they must share: quantities, positions, validation schemas and value mappings
([domain model](../domain-model.md)). Kept in separate repositories, the shared code
would be published, versioned and kept in sync by hand. The challenge lists Nx as a
bonus and states it is used at Dynamox.

## Decision

One Nx workspace:

```
apps/web         React frontend
apps/api         NestJS backend
apps/simulator   command-line telemetry simulator
libs/shared      types, enums, validation schemas and mappings
```

Nx module boundary rules forbid imports between apps: the web app never imports API
code, and both reach shared code only through `libs/shared`.

## Alternatives considered

- **Separate repositories.** The shared library would need publishing and version
  pinning, and a change to a rule would span several pull requests.
- **npm or pnpm workspaces without Nx.** They share code, but give no task caching,
  no affected-only runs and no enforced boundaries.

## Consequences

- A rule changed in `libs/shared` reaches the API and the web app in the same commit,
  and the compiler flags every place it breaks.
- Lint, tests and builds can run only on the projects a change affects.
- Nx adds its own configuration and generators to learn.
