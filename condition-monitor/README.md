# Condition Monitor

Full-stack application for machine condition monitoring: authentication, machines,
monitoring points, sensors and sensor time-series, built for the Dynamox full-stack
challenge ([full-stack-challenge.md](../full-stack-challenge.md)).

> The challenge asks for a pull request to `dynamox-s-a/js-ts-full-stack-test`. That
> repository was renamed to `dynamox-s-a/developer-challenges`, which is where this
> branch is proposed. The project lives in this folder so that the challenge catalog
> at the repository root stays untouched.

## Status

The workspace runs end to end: the web app reaches the API through its dev server, the
API reaches PostgreSQL through Prisma, and CI checks every project on each push. The
features arrive one vertical slice at a time, each with its migration, API routes,
tests and screen:

| Slice | State |
|---|---|
| Authentication | done: login, logout, session cookie, every route private by default |
| Sectors | done: list, create, edit and delete, with the `DRY` sector seeded |
| Machines | done: paginated, sortable list, tag built from sector, type and number |
| Monitoring points and sensors | done: positions per machine type, one sensor per point, pump rule, the paginated list sortable by every column |
| Time-series | done: readings from CSV or JSON, metrics, full retrieval, deletion, the count on the overview, charts per monitoring point |
| Simulator | done: backfill and live telemetry for the installed sensors, through the API |
| Latency measurement | done: every route answers 99 % of its requests below 350 ms under load, measured with 2.7 million readings |
| Forecast (bonus) | done: the next 24 hours of each series, with a measured uncertainty band, on the monitoring point screen |
| End-to-end tests (bonus) | done: Cypress drives the real application through the full user flow and an adversarial suite that tries to break it |

## Stack

An Nx monorepo with a React and Vite frontend (Material UI 5, Redux Toolkit), a
NestJS API and PostgreSQL 16 through Prisma. Each choice is recorded as an
architecture decision record in [docs/adr](docs/adr/README.md).

## Repository layout

```
condition-monitor/
  apps/
    api/              NestJS API, Prisma schema and migrations
    web/              React app built with Vite
    simulator/        command-line telemetry simulator
    web-e2e/          Cypress end-to-end tests and the script that runs them
  libs/
    shared/           types, rules and mappings used by the three apps
  load-tests/         k6 latency test, its plant setup and its runner
  studies/forecast/   script that compares the forecasting candidates
  docker/postgres/    database initialisation scripts
  docs/               assumptions, domain model, architecture, API contract, ADRs,
                      performance and forecast study
  docker-compose.yml  PostgreSQL for development and integration tests
```

## Getting started

### Prerequisites

- **Node.js 24**, the version in `.nvmrc`. With nvm: `nvm install` then `nvm use`.
  npm 11, bundled with Node 24, is required: npm 10 fails to install the test tooling.
- **Docker** with Compose, for PostgreSQL.
- Free ports: **5432** (PostgreSQL), **3000** (API) and **4200** (web app).

### Run

From this folder, `condition-monitor/`:

```bash
npm ci
cp .env.example .env
docker compose up -d
npm run db:deploy
npm run db:seed
npm run dev
```

- `npm ci` installs the exact versions in `package-lock.json`.
- `.env.example` holds development-only values; the defaults work as they are.
- `docker compose up -d` starts PostgreSQL 16 with two databases: `condition_monitor`
  for the application and `condition_monitor_test` for integration tests.
- `npm run db:deploy` applies the database migrations.
- `npm run db:seed` creates the fixed user from `SEED_USER_EMAIL` and
  `SEED_USER_PASSWORD` in `.env`. It is idempotent: run again, it reports `unchanged`.
- `npm run dev` serves the API and the web app together. The API refuses to start
  without a `JWT_SECRET` of at least 32 characters, which `.env.example` provides.

Then open **http://localhost:4200** and log in with the development credentials from
`.env.example` (assumption A1):

| Email | Password |
|---|---|
| `operator@condition-monitor.test` | `Monitor-2026-dev` |

These are local development values only. The chip in the top bar reads "API: online"
when the web app reaches the API, which alone answers at
`http://localhost:3000/api/health`.

An `.env` copied before a slice added new variables lacks them: compare it with
`.env.example`, or copy it again.

The container restarts on its own after a reboot, unless it was stopped with
`docker compose stop`. The data is kept in the volume.

The test database is created only when the data volume is first created. If the volume
already existed from an earlier run, recreate it, which erases its data:

```bash
docker compose down -v
docker compose up -d
```

### Try it with readings

The seed creates only the user and the `DRY` sector. To see a chart:

1. In **Machines**, add a machine, open it and add its positions.
2. Install a sensor with serial number `DX-000001` at one of them: `HF+` on a pump, any
   model on a fan.
3. In **CSV import**, download the example file and import it: one day of the seven
   series of that sensor, with synthetic values. Or run the simulator, below.
4. In **Monitoring points**, open the point: one chart per quantity, and the metrics of
   each series.

Importing the same file again stores nothing new and says so.

### Simulator

A command-line client that plays the sensors (assumption C13). It logs in with
`SIMULATOR_EMAIL` and `SIMULATOR_PASSWORD` from `.env`, discovers the installed sensors
through the API and sends their seven series. With the API running:

```bash
npm run simulate -- backfill --days 30
```

```bash
npm run simulate -- live
```

- `backfill` sends a history ending now and exits; `live` sends the current reading
  every 10 minutes until stopped with Ctrl+C.
- `--serial DX-000001` limits it to one sensor, repeatable for several; `--interval`,
  `--seed` and `--api-url` change the defaults. `npm run simulate -- help` lists them.
- `--degrade DX-000001 --degrade-since 2026-09-01` makes a sensor drift upward from a
  day, so the forecast has a trend to follow.
- The same seed gives the same values, so running a backfill again stores nothing new.
- It exits with 0 when done, 1 when it could not send (API unreachable, login refused,
  no sensor installed, a serial number not installed), and 2 for a wrong command line.

In the load test setup, the 30-day backfill of 80 sensors, 2,419,200 readings, took
190 s on the development machine (measured once, from the timestamps the setup prints).

## Assumptions

The challenge leaves several points open. Each one is recorded with the decision
taken in [docs/assumptions.md](docs/assumptions.md).

## Architecture

Entities, relations and database rules in [docs/domain-model.md](docs/domain-model.md).
Components, workspace layout and data flows in [docs/architecture.md](docs/architecture.md).
REST endpoints, payloads and error format in [docs/api-contract.md](docs/api-contract.md).
Latency measurements, their method and what they changed in [docs/performance.md](docs/performance.md).
How the forecast model was chosen, by measurement, in [docs/forecast-study.md](docs/forecast-study.md).

## Changing the database schema

Edit `apps/api/prisma/schema.prisma`, then, before committing it:

```bash
npm run db:migration -- --name=add_something
npm run db:deploy
```

The first command writes a migration holding only the change since the last commit.
Rules Prisma cannot model, such as `CHECK` constraints and partial indexes, are then
added to that file by hand, and the second command applies it. `prisma migrate dev` is
not used, since it would drop those hand-written rules
([ADR 0006](docs/adr/0006-postgresql-prisma.md)).

## Testing

| Command | What it runs | Needs |
|---|---|---|
| `npm test` | unit tests of every project: Vitest for web, simulator and shared, Jest for the API | nothing |
| `npm run test:integration` | API tests against the real test database | `docker compose up -d` |
| `npm run lint` | ESLint, including module boundary rules between projects | nothing |
| `npm run typecheck` | TypeScript in strict mode | nothing |
| `npm run format:check` | Prettier | nothing |
| `npm run e2e` | Cypress against the built application over its own database | `docker compose up -d` |

Integration tests always use `DATABASE_URL_TEST`, never the development database
([ADR 0010](docs/adr/0010-testing-strategy.md)). The end-to-end tests use a third
database, `condition_monitor_e2e`, recreated on each run ([ADR 0013](docs/adr/0013-cypress-e2e.md)).

### Load test

The challenge asks for a latency below 350 ms for all requests. It is measured with k6
over 80 sensors and 2.7 million readings produced by the simulator, against the
production build of the API and a database of its own:

```bash
npm run load:setup
```

```bash
npm run load:test
```

The setup takes about four minutes and the test about three. They need Docker, port
3100 free, and pull the image `grafana/k6:2.3.0` (111 MB) on the first run. The test
exits with an error when a route has its 99th percentile above 350 ms. The result, on
the development machine: all 30 routes within the limit, the slowest being the CSV
import at 321 ms and the largest submission of readings at 314 ms. Method, full table and limits of what it proves in
[docs/performance.md](docs/performance.md).

### Continuous integration

[`.github/workflows/condition-monitor.yml`](../.github/workflows/condition-monitor.yml)
runs on every push and pull request that touches this folder: `npm ci`, format check,
then lint, unit tests, type check and build of every project, and the integration tests
against a PostgreSQL 16 service. GitHub reads workflows only from the repository root,
which is why the file lives there.

A second job, `e2e`, builds the application and runs the Cypress suite against a
database of its own, under a virtual display; it caches the Cypress binary, which the
`check` job skips, since only this job runs the browser.

## Known issues

### Dependency audit

`npm audit` reports advisories in seven packages, all third-party and none in this
project's code. Measured on 2026-09-30 with `npm audit` after `npm ci`, again after the
chart libraries were added, and on 2026-10-01 after `bcrypt` replaced `bcryptjs`;
neither change brought an advisory of its own:

| Package | Pulled in by | Why this project is not exposed |
|---|---|---|
| `mysql2` | Prisma CLI | only used with MySQL; this project uses PostgreSQL |
| `deepmerge-ts` | Prisma configuration loader | only merges this project's own static `prisma.config.ts` |
| `brace-expansion` | Nx Jest and webpack tooling | expands file patterns written in this project's configuration |
| `smol-toml` | Nx | parses TOML files, and the project has none |
| `uuid` | `webpack-dev-server` | development server the API does not use; the advisory covers v3, v5 and v6 with a buffer, not the v4 it calls |
| `esbuild` | Vite, simulator build | affects esbuild's own development server on Windows, which is not used |
| `axios` | Nx | loaded only for Nx Cloud, `nx release` and Nx's setup prompts; this workspace uses none of them |
| Cypress and its tree | the end-to-end test runner | a development dependency; it runs the tests and is in no build output, so none of its advisories reach the application |

Adding Cypress raised the advisory count sharply, all of it inside Cypress's own
tooling tree. Cypress is a development dependency used only to run the end-to-end tests;
it is absent from every build output, so none of those advisories ship.

`npm audit --omit=dev` still lists the Prisma CLI, because `@prisma/client` declares it
as a peer dependency and npm then counts it as a production package. The built API
never loads the CLI. `npm audit fix --force` is not a fix here: it would move Nx and
Prisma to older versions.

### Install script warnings

npm 11 warns that some packages (`@swc/core`, `nx`, `@parcel/watcher`, `unrs-resolver`)
have install scripts not yet approved in its new install-scripts policy. The warning
does not block the installation, and the project installs, builds and tests as is.

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/), one logical change per
commit.
