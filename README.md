# Dynamox Condition Monitoring Challenge

An end-to-end implementation of the [Dynamox full-stack challenge](./full-stack-challenge.md):
machines, monitoring points, sensors, raw three-axis time-series ingestion, PostgreSQL metrics,
and visualization behind fixed-credential authentication.

The application uses React 18, Vite, Redux Toolkit with explicit async thunks, Material UI 5,
Recharts, Hono, Drizzle ORM/Kit, PostgreSQL 16, and a small pnpm workspace. The public HTTP
surface is RESTful; shared Zod contracts provide runtime validation and TypeScript types without
adding a second tRPC transport.

## Quick start

Prerequisites:

- Docker with Docker Compose.
- Ports `3000`, `5173`, and `5432` available, or equivalent overrides in `.env`.

```bash
cp .env.example .env
docker compose up --build
```

Open <http://localhost:5173>. The default development login is:

```text
Email:    admin@dynamox.local
Password: dynamox
```

The API health endpoint is <http://localhost:3000/health>. The `migrate` service waits for
PostgreSQL, applies all checked-in migrations, and exits successfully before the API starts. The
web service starts only after the API is healthy.

Stop the stack while preserving the database:

```bash
docker compose down
```

## Architecture

```text
apps/web  ── REST/JSON ──> apps/api ──> feature service ──> repository ──> PostgreSQL
    │                         │                                      via Drizzle ORM
    └── packages/contracts <─┘

packages/database: schema, client, and generated Drizzle migrations
packages/contracts: browser-safe Zod request/response contracts and enums
```

The API is organized as feature slices rather than layer-wide files:

```text
apps/api/src
├── app.ts           composition root: middleware, error envelope, mounted feature routers
├── dependencies.ts  wires the per-feature repositories and services into one seam
├── modules
│   ├── auth.ts
│   ├── machines           routes.ts · service.ts · repository.ts
│   ├── monitoring-points  routes.ts · service.ts · repository.ts (sensors live here)
│   └── time-series        routes.ts · service.ts · repository.ts
└── shared           errors, HTTP helpers, database plumbing, compatibility rules
```

The repository applies a small set of layered boundaries:

- Each feature owns its routes, service, and repository; only the composition root and the shared
  helpers are cross-cutting.
- Route handlers validate HTTP input and delegate; business rules stay in functional service
  factories.
- Repositories own Drizzle queries, and the browser never imports the database package.
- Shared contracts are client-safe; cross-record rules are still enforced by the API.
- Domain errors are converted once into a stable JSON error envelope.
- Feature UI and Redux logic live outside the thin route components.

A separate core package, event bus, observability package, and production deployment framework
would add ceremony without helping this proof of concept.

## Functional assumptions and deliberate deviations

- Authentication was implemented after the machine/time-series round. In the final state,
  `/health`, `/api/v1/auth/login`, and `/api/v1/auth/register` are public; every other API route
  requires a bearer token.
- This is a single-workspace challenge app. Accounts live in a `users` table (the spec's fixed
  admin is seeded from environment configuration), but all accounts share one workspace; there is
  no per-user data ownership or tenancy.
- Machine names are required but are not globally unique.
- A machine name and type are both editable. `PATCH` accepts `name`, `type`, or both, and requires
  at least one of them. Changing the type to `Pump` is refused with `SENSOR_INCOMPATIBLE` (422) when
  any monitoring point of that machine already carries a `TcAg` or `TcAs` sensor, because pumps only
  support `HF+`. The check and the write share one transaction, so a concurrent update cannot leave
  a pump holding an incompatible sensor. Changing the type to `Fan` always succeeds.
- Monitoring-point names are not forced to be unique because the challenge allows arbitrary
  names. Each point can have at most one sensor, and a sensor ID can be used only once.
- Pumps accept only `HF+` sensors. Fans accept `TcAg`, `TcAs`, or `HF+`. The UI guides the user,
  but the API remains the source of truth.
- A monitoring point must have a sensor before receiving a time series.
- Monitoring-point lists use server-side sorting and a fixed page size of five. Missing sensor
  models sort last.
- Deleting a machine cascades to its monitoring points, sensors, series, and samples. The UI asks
  for confirmation because recovery requires a database backup.
- No physical units are assumed for `x`, `y`, or `z`; values are stored exactly as submitted.

## Authentication

Accounts live in a `users` table with per-user scrypt salts and hashes; the login page doubles as
a registration form, and a new account is signed in by its registration response. The challenge's
fixed admin identity is seeded into the same table at API startup from the `AUTH_*` variables, so
`admin@dynamox.local` works on a fresh database. Login returns a signed JWT with a 15-minute
default lifetime. The web app stores the session in `localStorage` and sends it as:

```http
Authorization: Bearer <access-token>
```

Logout clears the client session. JWTs are stateless and are not server-revoked before expiry,
which is acceptable for this fixed-user POC but would need a revocation/session design in a
multi-user production system.

Registration enforces a minimum password length of eight characters; login deliberately does not,
so it never reveals the policy, and unknown emails and wrong passwords share one generic error.
All accounts see the same shared workspace of machines and series.

Configure authentication through:

- `AUTH_EMAIL` (seeded admin account)
- `AUTH_PASSWORD_SALT` (base64-encoded scrypt salt for the seeded admin)
- `AUTH_PASSWORD_HASH` (base64-encoded 64-byte scrypt result for the seeded admin)
- `JWT_SECRET` (at least 32 characters; replace the development value outside local use)
- `JWT_EXPIRES_IN_SECONDS` (defaults to `900`)

## REST API

Except for the public routes noted below, send the bearer token returned by login.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Public process/database health |
| `POST` | `/api/v1/auth/register` | Public account registration, returns a session |
| `POST` | `/api/v1/auth/login` | Public login |
| `GET` | `/api/v1/auth/me` | Validate the current token |
| `GET` | `/api/v1/machines` | List machines |
| `POST` | `/api/v1/machines` | Create a machine |
| `GET` | `/api/v1/machines/:machineId` | Get one machine |
| `PATCH` | `/api/v1/machines/:machineId` | Update a machine's name and/or type |
| `DELETE` | `/api/v1/machines/:machineId` | Delete a machine and dependent data |
| `POST` | `/api/v1/machines/:machineId/monitoring-points` | Create a monitoring point |
| `GET` | `/api/v1/machines/:machineId/monitoring-points` | List one machine's points |
| `GET` | `/api/v1/monitoring-points` | Paginate and sort all monitoring points |
| `POST` | `/api/v1/monitoring-points/:monitoringPointId/sensor` | Attach one sensor |
| `POST` | `/api/v1/monitoring-points/:monitoringPointId/time-series` | Store one complete series |
| `GET` | `/api/v1/time-series` | Paginate/filter series summaries |
| `GET` | `/api/v1/time-series/:seriesId` | Retrieve a complete ordered series |
| `GET` | `/api/v1/time-series/:seriesId/metrics` | Retrieve SQL-computed metrics |
| `DELETE` | `/api/v1/time-series/:seriesId` | Delete a series and its samples |

Monitoring-point query parameters are `page`, `sortBy`, and `sortOrder`. `sortBy` accepts
`machineName`, `machineType`, `monitoringPointName`, or `sensorModel`; `sortOrder` accepts `asc`
or `desc`.

Time-series list pagination defaults to 20 and is capped at 100. The list route accepts an optional
`monitoringPointId` filter and reports the filtered total alongside each page.

Validation, conflict, authorization, and unexpected failures share this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "requestId": "request-id",
    "issues": [
      {
        "path": "samples.0.timestamp",
        "message": "Invalid ISO-8601 timestamp"
      }
    ]
  }
}
```

## CSV ingestion and time-series metrics

The browser accepts a CSV with this exact header:

```csv
timestamp,x,y,z
2026-08-24T12:00:00.000Z,0.14,-0.02,0.41
2026-08-24T12:00:01.000Z,0.11,-0.01,0.39
```

Rules:

- Include between 1 and 10,000 data rows.
- `timestamp` must be a valid ISO-8601 instant with `Z` or an explicit UTC offset and must be
  unique within the file.
- `x`, `y`, and `z` must be finite decimal numbers.
- Input rows may be unordered; the preview and stored result are normalized ascending by time.
- The frontend parses and validates the CSV, shows a preview, then sends JSON:

```json
{
  "label": "Pump baseline",
  "samples": [
    {
      "timestamp": "2026-08-24T12:00:00.000Z",
      "x": 0.14,
      "y": -0.02,
      "z": 0.41
    }
  ]
}
```

The API validates the JSON independently. Series creation is all-or-nothing: the series and its
samples are inserted in one database transaction with a single multi-row insert.

PostgreSQL computes the metrics response:

```text
sampleCount
startedAt / endedAt
axes.x / axes.y / axes.z: { min, max, mean, rms }
vectorMagnitudeRms
```

For one axis, `rms = sqrt(avg(axis * axis))`.
`vectorMagnitudeRms = sqrt(avg(x*x + y*y + z*z))`.

## Database and migrations

The normal schema workflow is migration-first:

```bash
pnpm db:generate
pnpm db:check
pnpm db:migrate
```

Inspect generated SQL before applying it and commit both schema changes and generated migration
files together. `docker compose up` applies pending migrations automatically through the one-shot
`migrate` service.

For host-side Drizzle commands, start PostgreSQL and explicitly export the localhost URL. Drizzle
Kit runs from `packages/database` and does not automatically load the repository-root `.env`:

```bash
docker compose up -d db
export DATABASE_URL=postgresql://dynamox:dynamox_dev_only@localhost:5432/dynamox
pnpm db:studio
```

After generating a new migration while Compose is already running, rebuild and apply it
explicitly, then recreate the application containers from that image:

```bash
docker compose build
docker compose run --rm migrate
docker compose up -d --force-recreate api web
```

Migration artifacts are applied explicitly so schema changes remain reviewable and reproducible.

`pnpm db:push` exists for disposable prototyping only. It is not used by startup or the normal
workflow because it bypasses reviewed migration artifacts.

## Quality checks and tests

With Node 22.19 and pnpm 10.27 installed locally:

```bash
corepack enable
pnpm install
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

Tests are organized by boundary: contract validation, database constraints, API service/route
behavior, Redux thunks/reducers, and React user interactions. API tests exercise the exported Hono
app without opening a network port.

To run the workspace suite against a disposable PostgreSQL instance entirely in Docker:

```bash
docker compose --profile test up --build --abort-on-container-exit --exit-code-from test test
docker compose --profile test rm -sf test db-test
```

`db-test` uses `tmpfs`, so test data is discarded when the service stops and never touches the
development volume.

## Destructive reset

The following command deletes the PostgreSQL named volume and all machines, points, sensors,
series, and samples. It cannot be undone from this repository:

```bash
docker compose down --volumes
```

Use plain `docker compose down` for routine shutdowns.

## Intentionally out of scope

- Nx, cloud deployment, load balancer, and predictive modeling bonuses
- Cypress end-to-end automation and full multi-client load testing
- Multi-user registration, password reset, refresh tokens, and server-side token revocation
- Sensor reassignment and monitoring-point editing/deletion outside machine cascade
- Physical-unit conversion and production telemetry retention policies

These boundaries keep the submission focused on complete, testable vertical slices rather than
partially implemented bonus infrastructure.
