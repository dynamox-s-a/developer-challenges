# DynaPredict

A full-stack industrial asset monitoring platform. Users can manage machines, monitoring points, and sensor readings through a web interface — backed by a REST API — while keeping up with important asset metrics on a dashboard.

This project was built for the [Dynamox Full-Stack Developer Challenge](https://github.com/dynamox-s-a/developer-challenges/blob/main/full-stack-challenge.md).

---

## Stack

| | Technology |
|---|---|
| **Repository Management** | Nx |
| **Backend** | Fastify + TypeBox (Runtime Schema Validation), Prisma, PostgreSQL, and JWT based authentication. |
| **Frontend** | React + Vite, Redux, Redux Thunk, Material UI 5, Recharts |
| **Shared Structure via Nx** | `@dynamox/types` — TypeBox schemas consumed by both API and web app |
| **Testing** | Vitest (API and web) |

---

## Application Overview

### Login

A card with email and password fields. User credentials are validated on the backend; on success, a JWT is stored in an `httpOnly` cookie and the user is redirected to the dashboard. Demo credentials are displayed inline for evaluators below the "Entrar" button.

### Dashboard

Five KPI cards show the authenticated user's main metrics: total machines, total monitoring points, total assigned sensors, time-series records ingested, and the percentage of monitoring points that have a sensor assigned. That last metric gives users an immediate sense of how much of their asset fleet is still uncovered.

The dashboard also includes two Recharts pie charts — one breaking down machines by type, and another showing sensor model distribution across the fleet.

### Machines (Máquinas)

A table of the user's machines showing each machine's name, type (`Pump` or `Fan`), and linked monitoring points. The monitoring point count is displayed on a badge; a warning icon appears when any of them are missing a sensor. A dedicated button lets the user drill into the monitoring points for that machine.

Actions allow creating, renaming, changing the type, and deleting a machine. Deletion cascades to all monitoring points and sensors associated with it.

### Monitoring Points (Pontos de Monitoramento)

A paginated, sortable table (5 rows per page, as specified in the challenge) listing monitoring points with their parent machine name, machine type, monitoring point name, assigned sensor model, and a sensor data row.

Monitoring points can be created with or without an immediate sensor assignment (more on this in the Assumptions section), and the sensor can be swapped or removed independently of the monitoring point itself. The table columns (`machineName`, `machineType`, `monitoringPointName`, `sensorModel`) are all independently sortable in ascending or descending order. The sensor data row does not support sorting.

### Time-Series

Time-series data is accessed via the sensor data row on the Monitoring Points page. For monitoring points with an assigned sensor, a chart modal displays the last 24 hours of readings — temperature (°C), acceleration RMS (g), and velocity RMS (mm/s) — each on its own tab.

Besides the data, the modal exposes two user actions: deleting all time-series data for a given sensor, and ingesting a batch of readings. The batch insertion feature exists purely for testing purposes in this challenge — in a production environment, sensors would deliver data through a pub/sub or polling mechanism.

---

## Table of Contents

- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Demo Accounts](#demo-accounts)
- [API Reference](#api-reference)
- [Business Rules Applied](#business-rules-applied)
- [Assumptions](#assumptions)
- [Architecture](#architecture)
- [Testing](#testing)
- [Plugins & Infrastructure](#plugins--infrastructure)
- [Code Standards](#code-standards)
- [Future Improvements](#future-improvements)

---

## Setup

**Prerequisites:** Node.js 20+, PostgreSQL 14+, and `npm`.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API environment

```bash
cp apps/dyna-predict-api/.env.example apps/dyna-predict-api/.env.development
```

Edit `.env.development` with your values:

```env
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info

# PostgreSQL connection string
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/dynapredict

# JWT — use a long random string
JWT_SECRET=your-super-secret-key

# Cookie signing secret
COOKIE_SECRET=another-secret-key

# CORS — frontend origin
CORS_ORIGIN=http://localhost:5173

# Sentry DSN (optional — only active in production)
SENTRY_DSN=
```

> **Make sure to replace all placeholder values** — especially `USER` and `PASSWORD` in `DATABASE_URL` with your actual PostgreSQL credentials. Leaving them as-is will cause a `P1010` access error when running migrations.
>
> If you don't have a local database yet, create one first. On macOS with Homebrew PostgreSQL:
> ```bash
> createdb dynapredict
> ```
> On Linux or any setup with a dedicated `postgres` superuser:
> ```bash
> psql -U postgres -c "CREATE DATABASE dynapredict;"
> ```
>
> To find your connection string, run `psql postgres` (connecting to the default `postgres` database) and check with `\conninfo` — it will print your username, host, and port. On macOS with Homebrew, there is usually no password and the username matches your OS user (`whoami`), so the URL becomes:
> ```
> DATABASE_URL=postgresql://your-os-username@localhost:5432/dynapredict
> ```

### 3. Configure the web environment

From the project root (`dynamox/`):

```bash
cp apps/dyna-predict-web/.env.example apps/dyna-predict-web/.env.development
```

```env
VITE_API_BASE_URL=http://localhost:3000/v1
```

> **Note:** The `/v1` suffix is required — the API client appends paths like `/auth/login` directly to this base URL, so omitting it will result in requests hitting the wrong endpoints.

### 4. Create the database and run migrations

```bash
cd apps/dyna-predict-api
npm run dev:db:migrate
```

> **Note:** `migrate dev` already runs `prisma generate` automatically. If the seed step fails with a Prisma Client error, run `npm run dev:db:generate` explicitly as a fallback.

### 5. Seed demo data

Still inside `apps/dyna-predict-api`:

```bash
npm run dev:db:seed
```

The seeder creates two demo accounts and populates `demo1` with machines, monitoring points, and sensors while leaving `demo2` untouched.

To also populate `demo1` with time-series data (optional — useful for visualizing charts right away):

```bash
npm run dev:db:seed:time-series
```

---

## Running the Application

### Two terminals (recommended)

Run each in a separate terminal so backend and frontend logs stay isolated — this makes it much easier to debug API errors:

**Terminal 1 — API (Backend):**
```bash
npx nx serve dyna-predict-api   # http://localhost:3000
```

**Terminal 2 — Web (Frontend):**
```bash
npx nx serve dyna-predict-web   # http://localhost:5173
```

### Single terminal

```bash
npx nx run-many -t serve -p dyna-predict-api,dyna-predict-web
```

> **Note:** Running both in the same terminal mixes API and frontend output. If something is not working as expected, check the backend logs carefully — errors may be buried in the output.

---

## Demo Accounts

| Account | Email | Password | Data |
|---|---|---|---|
| Demo 1 | `demo1@dynapredict.com` | `demo123` | 3 machines, 12 monitoring points, 11 sensors |
| Demo 2 | `demo2@dynapredict.com` | `demo456` | Empty — populate and test freely |

---

## API Reference

> **Interactive docs available for development mode.** With the API running, navigate to `http://localhost:3000/docs` for the full Swagger UI — all endpoints, request bodies, and response schemas are documented there automatically via `@fastify/swagger`.

All routes except `/health` and `POST /v1/auth/login` require authentication (JWT stored in `httpOnly` cookie, set automatically on login).

### Auth

| Method | Path | Description |
|---|---|---|
| `POST` | `/v1/auth/login` | Login with email + password. Sets JWT cookie. |
| `POST` | `/v1/auth/logout` | Clears the JWT cookie. |
| `GET` | `/v1/auth/me` | Returns the authenticated user's profile. |

### Machines

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/machines` | List all machines for the authenticated user. |
| `POST` | `/v1/machines` | Create a machine (`name`, `type`: `Pump` \| `Fan`). |
| `PATCH` | `/v1/machines/:uuid` | Update machine name and/or type. |
| `DELETE` | `/v1/machines/:uuid` | Delete a machine (cascades to monitoring points and sensors). |

### Monitoring Points

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/monitoring-points` | Paginated list (5/page) with sorting. Includes machine and sensor data. |
| `POST` | `/v1/monitoring-points` | Create a monitoring point linked to a machine. Optionally assign a sensor model. |
| `PATCH` | `/v1/monitoring-points/:uuid` | Update name and/or sensor model. Omitting `sensorModel` removes any existing sensor. |
| `DELETE` | `/v1/monitoring-points/:uuid` | Delete a monitoring point. |
| `DELETE` | `/v1/monitoring-points/:uuid/sensor` | Remove only the sensor from a monitoring point. |

### Time Series

| Method | Path | Description |
|---|---|---|
| `POST` | `/v1/time-series/:sensorUuid` | Insert a batch of time series entries (`temperature`, `accelerationRms`, `velocityRms`, `timestamp`). |
| `GET` | `/v1/time-series/:sensorUuid` | List readings for a sensor. Optional `startDate` / `endDate` filters (defaults to last 24 hours). |
| `GET` | `/v1/time-series/:sensorUuid/metrics` | Aggregated min/max/avg per metric plus count. (defaults to last 24 hours) |
| `DELETE` | `/v1/time-series/:sensorUuid/all` | Delete all readings for a sensor. |

### Reports

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/reports/dashboard/metrics` | Returns total machines, monitoring points, sensors, and time-series entries. Also includes machines grouped by type and sensors grouped by model. |

### Health

| Method | Path | Description |
|---|---|---|
| `GET` / `HEAD` | `/health` | Simple health check to be used by uptime monitoring (e.g. Uptime Robot). No auth required. |

---

## Business Rules Applied

### Sensor model restrictions (requested on the challenge)

Machines of type "Pump" only accept monitoring points with sensors that have specifically the model "H+" (Hplus on the backend).

Attempting to assign a sensor of model `TcAg` or `TcAs` to a monitoring point associated with a machine of type "Pump" returns `422 Unprocessable Entity`.

### Monitoring point uniqueness

A monitoring point name must be **unique within its machine**. Duplicates return `409 Conflict`.

### Pagination and sorting (requested on the challenge)

The `GET /v1/monitoring-points` endpoint supports:
- `page` (default: 1), `pageSize` (default: 5)
- `sortBy`: `machineName`, `machineType`, `monitoringPointName`, `sensorModel`
- `sortOrder`: `asc` | `desc`

---

## Assumptions

The challenge intentionally leaves several design decisions open for the developer to make. The following assumptions were made and applied consistently throughout the implementation.

### Sensor model identifier: `HFPlus` instead of `HF+`

The challenge specifies the sensor model name `"HF+"`. Because `HF+` is not a valid identifier in most programming languages and database enums, it was normalized to `HFPlus` throughout the codebase (database enum, API contracts, frontend state). This is a purely technical normalization with no functional impact on the application.

### One sensor per monitoring point

A monitoring point can have at most one sensor associated with it. This reflects two physical constraints in a real-world scenario: it is mechanically impossible for two sensors to occupy exactly the same position on a machine component, and two precision industrial sensors placed in close proximity would generate electromagnetic interference that would compromise the data of both.

### Monitoring points can exist without a sensor

A monitoring point does not require a sensor. This supports two scenarios: a sensor that was previously installed has failed and been physically removed, but the monitoring location remains valid; or an operator pre-registers all desired monitoring points before the physical sensors arrive. Deleting the monitoring point in either case would discard possible configurations that should be preserved.

### Time-series fields: `temperature`, `accelerationRms`, and `velocityRms`

Rather than storing a single generic `value: Float` per reading, each time-series record stores three explicit fields: `temperature` (°C), `accelerationRms` (g), and `velocityRms` (mm/s). This decision was made based on the official Dynamox sensor datasheets: all three sensor models mentioned in this challenge's domain — TcAg, TcAs, and HFPlus — capture exactly these three measurements.

All three sensors are triaxial accelerometers, meaning each RMS measurement has triaxial components. For the scope of this challenge, per-axis breakdowns were intentionally omitted in favor of single scalar values per metric.

---

## Architecture

### Project Structure

```
dynamox/                          ← Nx monorepo root
├── apps/
│   ├── dyna-predict-api/         ← Fastify REST API
│   │   ├── prisma/               ← Schema, migrations, seed
│   │   └── src/
│   │       ├── auth/             ← Login, JWT, cookie plugins
│   │       ├── machines/         ← Machine CRUD
│   │       ├── monitoring-points/← Monitoring point CRUD + sensor management
│   │       ├── time-series/      ← Time-series insertion and metrics
│   │       ├── reports/          ← Dashboard aggregated metrics
│   │       ├── prisma/           ← Prisma plugin + generated client
│   │       └── shared/           ← Error handler, CORS, rate-limit, health
│   └── dyna-predict-web/         ← React SPA
│       └── src/
│           ├── api/              ← Typed API client functions
│           ├── app/pages/        ← Page components
│           ├── components/       ← Reusable UI components
│           ├── router/           ← Route definitions and loaders
│           └── store/            ← Redux slices (auth, machines, monitoring-points, time-series, reports)
└── libs/shared/types/            ← @dynamox/types — shared TypeBox schemas
```

### Nx monorepo with `@dynamox` scope

The challenge awards bonus points for using Nx, but the decision also solves a coupling problem: sharing TypeBox schemas between the API and the web app without duplicating type definitions. In Nx, the top-level entity is the workspace — here defined as `dynamox` rather than `dyna-predict`, since `dynamox` represents the organization and leaves room for other products (e.g., a future `DynaLogger` or `DynaGateway` web client) to live in the same workspace alongside DynaPredict.

### Application naming: `dyna-predict-api` and `dyna-predict-web`

The `api` and `web` suffixes were adopted as the naming convention for the backend and frontend applications respectively.

### Shared types library with TypeBox

`@dynamox/types` contains TypeBox schemas that serve as the single source of truth for all request/response contracts. The same schema object is used by the API for Fastify route validation and serialization, and by the web app for static TypeScript types via `Static<typeof Schema>`. This eliminates the possibility of type drift between frontend and backend.

### TypeBox as the schema layer

TypeBox was chosen because it produces schemas that are simultaneously valid JSON Schema (consumed by `@fastify/swagger` to generate OpenAPI docs automatically) and TypeScript types (via `Static<T>`). The result is that adding a route with a TypeBox schema automatically documents it in Swagger with zero extra effort.

### PostgreSQL with Prisma

PostgreSQL was chosen as the database. Prisma was one of the ORMs suggested by the challenge and the one adopted here. The Prisma client is exposed to route handlers through a dedicated Fastify plugin (`fastify.prisma`), keeping the database connection centralized and available across the entire application.

### Dashboard metrics endpoint

`GET /v1/reports/dashboard/metrics` returns aggregate data scoped to the authenticated user: four counts (machines, monitoring points, assigned sensors, time-series records), the percentage of monitoring points that have a sensor assigned, and two breakdowns for the pie charts — machines grouped by type and sensors grouped by model. All queries are resolved in parallel via `Promise.all`, so the total latency equals the slowest individual query rather than their sum. With the indexes already defined on the schema, each query is resolved against an index and remains fast regardless of data volume.

A natural evolution would be to cache these values per user in Redis with a short TTL. Dashboard metrics most of the time tolerate slight staleness, so TTL-based expiration avoids explicit invalidation and the cross-domain coupling that event-driven invalidation would introduce. This optimization was intentionally deferred: at the scale of this challenge, the parallel query approach is already well within the 350 ms latency requirement.

### Time-series data insertion

The current implementation exposes `POST /v1/time-series/:sensorUuid` as a bulk upload endpoint: the client submits a list of timestamped readings in a single HTTP request.

In a production environment, this would most likely be replaced by an event-driven architecture — the **DynaGateway** devices (Dynamox's automated data collectors) publish readings to a **RabbitMQ** queue, and a dedicated worker consumes and persists them asynchronously. This decouples data insertion from the API lifecycle and scales better with sensor data volume.

---

## Testing

Run the test suites with coverage using the Nx project names:

```bash
npx nx test @dynamox/dyna-predict-api -- --coverage
npx nx test @dynamox/dyna-predict-web -- --coverage
```

Coverage metrics are printed directly in the terminal. A full HTML report is also generated at `coverage/index.html` inside each project's test output directory, providing a visual breakdown of covered lines, branches, and functions.

---

## Plugins & Infrastructure

> *"As with JavaScript, where everything is an object, with Fastify everything is a plugin."*

Fastify's plugin system is the foundation of how the framework is extended. The Fastify core team maintains a set of official plugins under the `@fastify` scope that can be reused across applications without writing infrastructure code from scratch. The plugins below were specifically chosen to cover the backend's infrastructure requirements: authentication, cookie handling, request rate limiting, cross-origin access control, and interactive API documentation.

### JWT

`@fastify/jwt` handles JWT signing and verification. The token payload is typed via module augmentation (`declare module '@fastify/jwt'`), so all route handlers receive a fully typed `request.user` object with no manual casting needed.

### Cookie

`@fastify/cookie` enables cookie parsing and serialization. The JWT is stored in an `httpOnly` cookie set on login and cleared on logout, keeping the token completely inaccessible to JavaScript running in the browser.

### Rate limiting

- Global: 100 requests / minute per IP
- Login endpoint: 5 requests / 15 minutes per IP (brute-force mitigation)

### CORS

Cross-Origin Resource Sharing is configured to allow requests only from the frontend origin, set via the `CORS_ORIGIN` environment variable. This prevents unauthorized third-party websites from making authenticated requests on behalf of logged-in users.

### Swagger / OpenAPI

`@fastify/swagger` and `@fastify/swagger-ui` generate interactive API documentation automatically from the TypeBox schemas attached to each route. The docs are available at `/docs` in non-production environments. Because TypeBox schemas are the source of truth for both validation and documentation, the docs are always in sync with the actual API behavior.

### Sentry *(custom plugin)*

The custom Sentry plugin hooks into the global error handler (also a custom plugin) and is active in both the backend and the frontend, in production only. On the backend, only 5xx errors are reported to Sentry. 4xx errors (client mistakes such as invalid input or not-found) are expected behavior and are not treated as incidents.

---

## Code Standards

### Commit convention

All commits follow the Conventional Commit pattern, written in English. An `Issue` field is also included in the body to enhance tracking in real-world scenarios where each PR maps to a ticket.
```
<type>: <short imperative description, aiming for max 50 chars>

* (Optional) Detailed bullet points about the changes made

Issue: N/A
```

The `Issue: N/A` is always present since there is no associated ticket to this challenge, keeping a consistent structure.

### Backend

#### Testing philosophy

Schema validation (required fields, field types, enum values) is intentionally not covered by unit tests. Fastify's JSON Schema validation is a framework guarantee — testing it would mean testing the framework, not the application. The boundary tested is business logic: what the handler does given valid input.

This decision was made explicitly to avoid the pattern of writing hundreds of schema contract tests that break on cosmetic changes and provide no signal about actual behavior.

All test suites follow the **AAA** pattern and are built using Vitest fixtures (via `.extend()` — a pattern similar to pytest's `conftest` system) to simplify the code and keep each test focused on the scenario it covers.

### Frontend

#### Redux and Redux Thunk

The frontend state is managed with Redux Toolkit, organized into domain slices: `auth`, `machines`, `monitoringPoints`, `timeSeries`, and `reports`. Each slice owns its state shape, reducers, and selectors.

Side effects (API calls) are handled exclusively via Redux Thunk. Network requests go through the typed client in `src/api/` and are dispatched as thunks.

#### Testing philosophy

Slice reducers are tested in isolation as pure functions — no mocks, no network calls. Each test dispatches a Redux action directly against the reducer and asserts the resulting state. The same **AAA** pattern and Vitest fixture system used on the backend applies here, with `@faker-js/faker`-generated data exposed through fixture context.

---

## Future Improvements

Here's a list of possible architectural evolutions intentionally deferred in favor of core feature delivery.

### Backend

#### Docker Compose for development

The setup currently requires a locally running PostgreSQL instance. A `docker-compose.yml` covering the database (and optionally the API) would reduce the onboarding steps to `docker compose up` and make the environment fully reproducible across machines.

#### File-based time-series insertion

A possible extension of the current batch endpoint would be to accept `.xlsx` or `.csv` uploads, allowing operators to import historical readings or data exported from field devices without having to interact with the JSON API directly. The parsing, validation, and transformation of the uploaded file could be handled by a dedicated microservice built with **FastAPI + pandas** (or a similar Python data-processing library), keeping that concern isolated from the main API and leveraging the Python ecosystem's strength for tabular data handling.

### General

#### Shared test fixtures library

Both `dyna-predict-api` and `dyna-predict-web` are TypeScript projects that depend on `@faker-js/faker` for test data generation. A `@dynamox/fixtures` library — structured the same way `@dynamox/types` centralizes type contracts — would eliminate duplicated factory functions across test suites and make it easier to share realistic data shapes between frontend and backend tests.

#### End-to-end tests

The current test suite focuses on covering unit testing throughout the projects. Adding Cypress end-to-end tests to validate full user flows — login, machine creation, sensor assignment — against a running stack, would significantly improve overall test reliability and coverage.
