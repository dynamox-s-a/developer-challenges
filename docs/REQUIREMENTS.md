# Requirements coverage — Dynamox Full-Stack Developer Challenge

Audit of the implementation against the original statement
([`full-stack-challenge.md`](../full-stack-challenge.md)), requirement by requirement. Each row
names where the requirement lives, how to verify it and which tests protect it. Statuses use
the challenge's own scale; nothing is marked implemented without evidence in code, tests or
the running application.

Status vocabulary: **IMPLEMENTED WITH EXCELLENCE** (beyond the ask, verified end to end) ·
**IMPLEMENTED** · **IMPLEMENTED WITH ISSUES** · **NOT IMPLEMENTED** · **NOT APPLICABLE**.

Paths are relative to the repository root. Routes are relative to `http://localhost:3000`
(API) and `http://localhost:5173` (web).

## Summary

| Block | Result |
|---|---|
| 1 · Authentication | 3/3 implemented (2 with excellence) |
| 2 · Machine management | 3/3 implemented with excellence |
| 3 · Monitoring points and sensors | 5/5 implemented (4 with excellence) |
| 4 · Ambiguity handling | 2/2 implemented |
| 5 · Technical requirements | 10/10 implemented |
| 6 · Back-end requirements | 9/9 implemented |
| 7 · Time-series data management | 6/6 implemented |
| 8 · Bonus | Nx implemented · Cypress, deployment, prediction, load balancer, load tests **not implemented** · refactor of a baseline **not applicable** |
| 9 · Evaluation criteria | see the last table |

## 1 · Authentication

| Requirement | Status | Implementation | Evidence | Test | Route / Endpoint | Notes |
|---|---|---|---|---|---|---|
| Log in with a fixed e-mail and password to access private routes | IMPLEMENTED WITH EXCELLENCE | `apps/api/src/auth` (JWT, scrypt password hash, seeded users), `apps/web/src/pages/LoginPage.tsx`, `features/auth/authSlice.ts` | login with `analista@dynamox.local` / `Dynamox@2026`; `POST /api/auth/login` → `{ token }`; session restored on reload via `GET /auth/me` | `apps/api/test/auth.e2e-spec.ts`, `apps/web/src/App.spec.tsx`, `features/auth/authSlice.spec.ts` | `POST /api/auth/login`, `GET /api/auth/me`, `/login` | credentials are seeded (configurable by env), never hard-coded in the frontend; two roles: `ADMIN` and `VIEWER` (`consulta@dynamox.local` / `Consulta@2026`) |
| Log out | IMPLEMENTED | `AppHeader` "Sair" action → `authSlice.logout` clears the token (`sessionStorage`) and redirects to `/login` | click "Sair"; the next private navigation redirects to `/login` | `apps/web/src/App.spec.tsx` (login → private route → logout → blocked return) | `/login` | logout is client-side (stateless JWT); the token expires after `JWT_EXPIRES_IN` (8 h) |
| No private route accessible without authentication | IMPLEMENTED WITH EXCELLENCE | API: global JWT guard (`401` everywhere except `/api/health` and `/api/auth/login`); web: `components/RequireAuth.tsx` redirects to `/login` and back to the requested URL; one central `401` handler in `api/client.ts` | `curl /api/alerts` → `401`; open `/machines` without a session → `/login` | `auth.e2e-spec.ts`, `rbac-and-query.e2e-spec.ts` (`VIEWER` → `403` on every mutation and state unchanged), `App.spec.tsx`, `openapi-contract.e2e-spec.ts` (security documented per operation) | all routes | RBAC goes beyond the ask: mutations and alert acknowledgement are `ADMIN`-only |

## 2 · Machine management

| Requirement | Status | Implementation | Evidence | Test | Route / Endpoint | Notes |
|---|---|---|---|---|---|---|
| Create a machine with an arbitrary name and type in `Pump` / `Fan` | IMPLEMENTED WITH EXCELLENCE | `apps/api/src/machines` (hand-parsed DTO, closed vocabulary), `apps/web/src/pages/resources/MachineFormPage.tsx` | "Nova máquina" → form → row appears in `/machines`; duplicate name shows the API's `409` message | `machines.e2e-spec.ts`, `machines.dto.spec.ts`, `machines.service.spec.ts`, `machines-crud.spec.tsx` | `POST /api/machines`, `/machines/new` | name unique (case-insensitive trim, ≤ 120 chars); uniqueness enforced by the database index |
| Change name and type after creation | IMPLEMENTED WITH EXCELLENCE | `PATCH /api/machines/:id` with row lock; `MachineFormPage` in edit mode | edit P-101 → save → list and page reflect it; turning a machine into `Pump` while it holds `TcAg`/`TcAs` is refused with `409 MACHINE_TYPE_SENSOR_CONFLICT` | `machines.e2e-spec.ts` (including the `PATCH → Pump` × sensor association race), `machines-crud.spec.tsx` | `PATCH /api/machines/:id`, `/machines/:key/edit` | empty body → `400` |
| Delete a machine | IMPLEMENTED WITH EXCELLENCE | `DELETE /api/machines/:id` (monitoring points cascade, sensors are detached); `DeleteMachineDialog` explains the cascade before confirming | delete → `204`; points gone, sensors kept unassigned | `machines.e2e-spec.ts`, `machines-crud.spec.tsx` | `DELETE /api/machines/:id`, `/machines/:key` (menu → Excluir) | `404` for unknown id |

## 3 · Monitoring points and sensors management

| Requirement | Status | Implementation | Evidence | Test | Route / Endpoint | Notes |
|---|---|---|---|---|---|---|
| Create at least two monitoring points with arbitrary names for an existing machine | IMPLEMENTED | `apps/api/src/monitoring-points`, `pages/resources/PointFormPage.tsx` | seed creates P-101 with two points; the demo plant has 12 points on 6 machines; UI "Novo ponto" on the machine page | `monitoring-points.e2e-spec.ts`, `machines-crud.spec.tsx` | `POST /api/monitoring-points`, `/machines/:key/points/new` | point name unique per machine |
| Associate a sensor with a unique ID and model in `TcAg` / `TcAs` / `HF+` | IMPLEMENTED WITH EXCELLENCE | `POST /api/monitoring-points/:id/sensor` (serial unique, one sensor per point by unique index), `AssignSensorDialog` | associate from the point page; a second sensor on the same point → `409` | `monitoring-points.e2e-spec.ts`, `machines-crud.spec.tsx` | `POST /api/monitoring-points/:id/sensor`, `/machines/:key/points/:pointKey` | the dialog offers only models compatible with the machine type; the API remains the barrier |
| Prevent `TcAg` / `TcAs` on machines of type `Pump` | IMPLEMENTED WITH EXCELLENCE | rule in `libs/domain` (`isSensorModelAllowedForMachine` / `assertSensorModelAllowedForMachine`), enforced in `monitoring-points.service.ts` (association) **and** `machines.service.ts` (type change), both under row lock | associating `TcAg` to a Pump point → `409 SENSOR_MODEL_NOT_ALLOWED`; `PATCH` to Pump with a forbidden sensor → `409 MACHINE_TYPE_SENSOR_CONFLICT` | e2e on both flows plus the concurrent race; unit specs of both services | both endpoints above | business rule location: `libs/domain/src/index.ts`; test location: `apps/api/test/monitoring-points.e2e-spec.ts`, `machines.e2e-spec.ts` |
| Paginated list of monitoring points, up to 5 per page, with Machine Name, Machine Type, Monitoring Point Name and Sensor Model | IMPLEMENTED WITH EXCELLENCE | server-side pagination (`DEFAULT_PAGE_SIZE = 5`, `MAX_PAGE_SIZE = 50` for programmatic clients), `components/MonitoringPointsPanel.tsx` shows exactly the four columns | `/monitoring-points` shows "1–5 de 12"; `GET /api/monitoring-points?page=2` | `rbac-and-query.e2e-spec.ts` (defaults, bounds, `page=0` → `400`), `MonitoringPointsPanel.spec.tsx` | `GET /api/monitoring-points`, `/monitoring-points` | search and filters (machine type, sensor model, has sensor) added on top, all server-side |
| Sort the list by any column, ascending or descending | IMPLEMENTED WITH EXCELLENCE | `sortBy ∈ machineName, machineType, pointName, sensorModel`, `sortDir ∈ asc, desc`, resolved in SQL by the public labels with deterministic tie-break | click any header twice; URL keeps `sortBy`/`sortDir` | e2e covering the four columns in both directions and combined with search + filter + pagination | `GET /api/monitoring-points?sortBy=&sortDir=` | points without sensor always sort last |

## 4 · Ambiguity handling

| Requirement | Status | Implementation | Evidence | Notes |
|---|---|---|---|---|
| Make reasonable assumptions | IMPLEMENTED | decisions recorded as ADRs in `docs/analysis/06-decisions/` | — | 13 ADRs with context, alternatives and consequences |
| Document assumptions in the README | IMPLEMENTED | [`README.md` → Assumptions and design decisions](../README.md#assumptions-and-design-decisions) | — | Portuguese version kept in [`docs/README.pt-BR.md`](./README.pt-BR.md) |

## 5 · Technical requirements

Versions are the ones declared in the workspace `package.json` files.

| Requirement | Status | Implementation | Evidence | Notes |
|---|---|---|---|---|
| TypeScript | IMPLEMENTED | `typescript ^5.6.3`, strict mode in every project | `npm run typecheck` | — |
| React | IMPLEMENTED | `react ^18.3.1`, `react-dom ^18.3.1` | `apps/web` | — |
| Redux for global state | IMPLEMENTED | `@reduxjs/toolkit ^2.3.0`, `react-redux ^9.1.2`; slices per domain in `apps/web/src/features/*` | `store/index.ts` | global only when global: analytical query state lives in the URL ([ADR-0003](./analysis/06-decisions/adr-0003-redux-toolkit-thunks.md)) |
| Redux Thunks or Saga | IMPLEMENTED | `createAsyncThunk` for every asynchronous effect | `features/*/…Slice.ts` | thunks, no RTK Query |
| Next.js or Vite | IMPLEMENTED | `vite ^5.4.11` | `apps/web/vite.config.ts` | — |
| Material UI 5 | IMPLEMENTED | `@mui/material ^5.16.7`, `@mui/icons-material ^5.18.0`, custom theme | `apps/web/src/theme.ts` | — |
| Reusable components | IMPLEMENTED | `@dynamox/ui` (`LoadingState`, `ErrorState`, `EmptyState`); web: `PageHeader`, `ConditionTag`, `ConditionFilter`, `AlertLevelTag`/`AlertStatusTag`, `AlertsSection`, `HelpTip`, `DashboardCard`, `MonitoringPointFilters`, `PageSkeleton`, typed navigation config | `libs/ui/src/index.tsx`, `apps/web/src/components/` | — |
| Well-organized and documented code | IMPLEMENTED | Nx projects with clear boundaries; comments explain intent; knowledge base under `docs/analysis` | this documentation | — |
| Responsive layout | IMPLEMENTED | Material UI breakpoints, temporary drawer below `md`, grid slots per breakpoint on the dashboard, horizontal scroll containers for wide tables | resize the browser window | validated for overflow and layout behaviour at desktop resolution; full device emulation is a known validation limitation |
| Unit tests for business logic | IMPLEMENTED WITH EXCELLENCE | 689 tests in the conventional suite: 353 API (unit + e2e against a real PostgreSQL + contract), 212 web, 124 sensor twin | `npm run test` | plus opt-in integration suites and semantic validation (`demo:verify`, `alerts:validate`) |

## 6 · Back-end requirements

| Requirement | Status | Implementation | Evidence | Test | Notes |
|---|---|---|---|---|---|
| Own back-end in Node.js | IMPLEMENTED | NestJS 10 (`@nestjs/core ^10.4.7`) on Node.js 22, TypeScript, modular (`auth`, `machines`, `monitoring-points`, `telemetry`, `time-series`, `analytics`, `alerts`, `health`) | `apps/api/src` | all suites | — |
| PostgreSQL or MongoDB | IMPLEMENTED | PostgreSQL 16 (`postgres:16-alpine`, Docker Compose, port 5433) | `docker-compose.yml` | e2e against the real database | — |
| Prisma for PostgreSQL | IMPLEMENTED WITH EXCELLENCE | `prisma ^5.22.0`; versioned migrations, idempotent seed, transactions and row locks; raw SQL through Prisma for analytics | `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.ts` | e2e | [ADR-0002](./analysis/06-decisions/adr-0002-postgresql-prisma.md) |
| RESTful endpoints for authentication, machines, sensors | IMPLEMENTED WITH EXCELLENCE | 30 documented operations; core: auth (2), machines (5), monitoring points + sensor (3), telemetry (1), time-series (4); extended: analytics (10), alerts (3), health (1) | `GET /api/docs-json` | `openapi-contract.e2e-spec.ts`, per-module e2e | Swagger UI at `/api/docs` |
| Time-series storage and retrieval | IMPLEMENTED WITH EXCELLENCE | see block 7 | — | — | idempotent ingestion through a public-contract-derived schema |
| Proper error handling and validation | IMPLEMENTED WITH EXCELLENCE | hand-parsed DTOs and queries with closed vocabularies; stable `{ code, message }` envelope; unknown body/query properties → `400` | `400 INVALID_ALERTS_QUERY` (`?inventado=1`), `400` on `pageSize=0`, `401` without token, `403` VIEWER on `POST /machines`, `404 MACHINE_NOT_FOUND`, `409` duplicate name / `IDEMPOTENCY_KEY_REUSED` / `MACHINE_TYPE_SENSOR_CONFLICT`, `422 RESOURCE_ID_MISMATCH` / `QUANTITY_AXIS_MISMATCH` / `SENSOR_NOT_ASSOCIATED` | `machines.dto.spec.ts`, `alerts.e2e-spec.ts`, `telemetry.e2e-spec.ts`, `rbac-and-query.e2e-spec.ts` | every 4xx in the OpenAPI is an `ErrorResponse` (contract-tested) |
| Unit tests for the back-end | IMPLEMENTED | 353 tests: isolated unit specs (parsers, mappers, pure alert engine) + e2e + contract | `npm run test -w @dynamox/api` | — | `test:unit` runs the isolated part in under 2 s |
| Latency below 350 ms for all requests | IMPLEMENTED | reproducible benchmark `npm run perf:latency` over 19 routes including the heaviest analytical routes at 30-day windows on the 10 M-sample dataset; fails if any route's maximum reaches 350 ms | last run: max 198 ms (`GET /analytics/series/:id/points`, 30 d); heatmap 30 d 115 ms; login 48 ms | `tools/measure-latency.ts` | measured locally, single client; see [Architecture → Performance](./ARCHITECTURE.md#performance) |

## 7 · Time-series data management

| Requirement | Status | Implementation | Evidence | Test | Route / Endpoint | Notes |
|---|---|---|---|---|---|---|
| Store raw sensor data as time series for monitoring points | IMPLEMENTED WITH EXCELLENCE | `apps/api/src/telemetry`: one acquisition cycle per `POST`, validated by Ajv against `contracts/dynamox/telemetry-cycle.schema.json`, persisted in one transaction, idempotent by header key and content fingerprint | repeat the same `POST` → `200 duplicate:true`, zero new samples | `telemetry.e2e-spec.ts` (matrix + concurrency), `contract.spec.ts`, `telemetry-schema-parity.e2e-spec.ts` | `POST /api/telemetry-cycles` | payload derived from the public Dynamox `POST /v1/telemetry-cycles` ([ADR-0005](./analysis/06-decisions/adr-0005-internal-contract-reduction.md)) |
| Retrieve metrics about the time series | IMPLEMENTED | count, min, max, average, last value, first/last timestamp | `GET /api/time-series/:id/metrics` | e2e | `GET /api/time-series/:id/metrics` | analytical statistics per window also in `GET /api/analytics/series/:id/points` |
| Delete time-series data sent to the server | IMPLEMENTED | `DELETE /api/time-series/:id` removes the series and all its samples (cascade) | `204`, then `404` | e2e | `DELETE /api/time-series/:id` | the ingestion cycle row is kept for audit; ADMIN only |
| Retrieve the number of time series stored | IMPLEMENTED | `GET /api/time-series` lists every series with machine, point, sensor and last reading; `withCounts=true` adds `sampleCount` | length of the list = number of series (60 in the demo) | e2e | `GET /api/time-series?withCounts=true` | interpretation documented in the assumptions |
| Retrieve a full time series | IMPLEMENTED | `GET /api/time-series/:id/samples?limit&offset` with `total`; no silent truncation | e2e walks a whole series page by page | `telemetry.e2e-spec.ts` | `GET /api/time-series/:id/samples` | the investigation pages additionally page samples per acquisition with a keyset cursor |
| Visualize time series in a chart | IMPLEMENTED WITH EXCELLENCE | dashboard `TrendPanel` (server-aggregated buckets, min/max band, wheel zoom), `SensorPage` chart, raw samples page | `/` → "Série temporal"; `/sensors/SIM-HF-002` | `OperationalDashboard.spec.tsx`, `investigation.spec.tsx` | `GET /api/analytics/series/:id/points`, `/` | Recharts |

## 8 · Bonus

| Requirement | Status | Evidence / Notes |
|---|---|---|
| Nx monorepo | IMPLEMENTED | `nx ^20.2.0`; projects `@dynamox/api`, `@dynamox/web`, `@dynamox/domain`, `@dynamox/contracts`, `@dynamox/ui`, `@dynamox/sensor-twin`; targets `build`, `lint`, `typecheck`, `test` with `dependsOn: ["^build"]` and caching |
| E2E tests with Cypress | NOT IMPLEMENTED | end-to-end coverage exists with Supertest (API against a real database), Vitest + Testing Library (screens by role, navigation) and manual browser walkthroughs — none of it is Cypress |
| Refactor a provided baseline | NOT APPLICABLE | no baseline code was provided with this challenge |
| Cloud deployment | NOT IMPLEMENTED | runs locally with Docker Compose |
| Future prediction of time-series data | NOT IMPLEMENTED | the alert engine detects sustained deviations against a learned baseline (A1/A2 thresholds, consecutive trigger); it is condition/alarm detection, not forecasting |
| Load balancer | NOT IMPLEMENTED | — |
| Load tests | NOT IMPLEMENTED | `perf:latency` is a sequential single-client latency benchmark, not a load test |

## 9 · Evaluation criteria

| Criterion | Where to look |
|---|---|
| Anyone can follow the instructions and run it | [`README.md` → Quick start](../README.md#quick-start), [`docs/SETUP.md`](./SETUP.md); one-command demo `npm run demo:prepare` |
| User stories implemented as specified | blocks 1–3 and 7 above |
| Front-end integrated with the back-end | every screen reads and writes through `apps/web/src/api/client.ts`; no mocked data outside tests |
| Back-end integrated with persistent storage | PostgreSQL + Prisma, e2e suites run against the real database |
| Time-series stored, processed and visualized | block 7; [Architecture → Analytics](./ARCHITECTURE.md#analytics) |
| Refactoring ability and unit tests | 689 tests; commit history shows successive refactors of the dashboard, navigation and analytics |
| Best practices | ADRs, closed contracts, database as authority, OpenAPI contract tests |
| API latency | block 6, [Architecture → Performance](./ARCHITECTURE.md#performance) |
| Problem-solving and ambiguity | README assumptions, ADRs 0004–0013 |
| Code quality, readability, maintainability | lint zero warnings, typecheck strict, documented modules |
| Organized and documented code | this file, [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`docs/analysis`](./analysis/README.md) |
| Atomic, semantic commits | every commit on the delivery branch (130+) follows Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `chore`); verified with a regex over `git log main..HEAD` |

## Ready to begin — Git delivery

| Step | Status |
|---|---|
| Fork to a personal GitHub account | done — `origin` is the personal fork |
| Branch named first-last | `diogo-fragoso` exists locally and on `origin`; it must be fast-forwarded to the delivery branch before the pull request |
| Pull request to `dynamox-s-a/js-ts-full-stack-test`, `main` | not opened yet — an operator step performed at submission time |

## Beyond the challenge

Capabilities that are not challenge requirements but are part of the delivery. Each row
points to the implementation and the test that proves it.

| Capability | Implementation | Test / evidence |
|---|---|---|
| Condition monitoring computed in SQL (fleet condition, machine and point summaries, time windows, severity heatmap) | `apps/api/src/analytics/analytics.sql.ts`, `analytics.service.ts` | `analytics.e2e-spec.ts`, `condition.spec.ts`, `evaluation-window.spec.ts` |
| Versioned condition policy shared by API and web | `libs/domain/src/condition.ts` | `apps/api/src/analytics/condition.spec.ts`, `dashboardAggregations.spec.ts` |
| Alert engine: persistent A1/A2 episodes, learned baselines, consecutive trigger, hysteresis, acknowledgement, presence and fleet collapse | `apps/api/src/alerts/` | `core/*.spec.ts`, `alerts.e2e-spec.ts`, `leakage.spec.ts` |
| Exactly-once replay and backfill | `alert_cycle_evidence`, `alert_rule_evaluations`, `activeKey`; `alerts:backfill` | e2e (`OUT_OF_ORDER`, duplicates), rerun → 0 new evaluations |
| Validation against synthetic ground truth | `apps/api/src/alerts/validate.cli.ts` | [`alert-validation.md`](./analysis/07-validation/alert-validation.md) |
| Deterministic sensor twin and 30-day history | `simulation/sensor-twin/` | 124 unit tests; `twin:integration`; `demo:verify` |
| Operational alert history for the alert list | `prisma/operational-history.ts` (`alerts:seed-history`) | `demo:verify` invariants (all episodes resolved, none inside the labelled window) |
| Reproducible demo | `tools/demo-prepare.ts`, `tools/demo-verify.ts` | 29 semantic invariants |
| OpenAPI contract tests and schema parity | `apps/api/test/openapi-contract.e2e-spec.ts`, `telemetry-schema-parity.e2e-spec.ts` | the suites themselves |
| ROS provenance bridge (optional, offline) | `simulation/sensor-twin/ros/`, `src/rosbridge.ts` | `twin:ros` (requires ROS Noetic) |
