# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context

This directory is a solution to the **Dynamox Full-Stack Developer Challenge**. The official spec is `../full-stack-challenge.md`. Read these local planning docs (in Portuguese) before doing any work:

- `PLAN.md`: architecture, data model, API surface, testing, deploy, and CI. It is the source of truth for technical decisions. (It refers to the task list as `ROADMAP.md`, but the file is `TASKS.md`.)
- `TASKS.md`: atomic tasks grouped by day (`T1.1`, `T2.4`, …). Work through one task at a time, give each task its own semantic commit, and tick its checkbox when it's done.
- `decisions.md`: ADR-style log with title, context, options considered, decision, and rationale. Tasks tagged **[decisions.md]** must add an entry. Record any new architectural decision on the day it's made.

The Nx workspace has not been scaffolded yet (see T1.2–T1.5). Until it exists, the commands below are planned rather than verified.

## Commands (Nx)

```bash
docker compose up -d postgres postgres-test   # dev DB + ephemeral test DB
npx nx serve api                               # Express API
npx nx serve web                               # Vite frontend
npx nx run-many -t test [--coverage]           # all unit tests (Vitest)
npx nx test api -- -t "<test name>"            # single test by name (Vitest filter)
npx nx affected -t lint typecheck build        # same gates as CI
npm run lint && npm run typecheck              # all projects (npm run lint:fix to autofix)
npm run format:check                           # prettier check (npm run format to write)
docker compose up -d --wait api web            # stack the E2E suite runs against
npx nx e2e web-e2e                             # Cypress in Docker (local only, not a CI gate)
npx prisma migrate dev --schema apps/api/prisma/schema.prisma
npx prisma db seed                             # demo machines/points/sensors/readings
docker compose up                              # full stack: postgres + api + web
```

## Architecture

Nx integrated monorepo:

- **`apps/api`**: Express + TypeScript + Prisma (PostgreSQL). Code is organized by feature under `src/modules/{auth,machines,monitoring-points,sensors,readings}`, each module split into controller, service, and routes. Shared pieces:
  - `middlewares/`: `auth` (JWT cookie), `validate(schema, source)` (zod), and the central `errorHandler`.
  - `errors/AppError`.
  - `lib/prisma.ts` (singleton) and `lib/pagination.ts`.
  - `config/env.ts`, which validates the required env vars at boot.
- **`apps/web`**: Vite + React + TS + MUI 5 + Redux Toolkit. Async work uses **hand-written thunks (`createAsyncThunk`), not RTK Query or Saga**. Shared pieces:
  - `features/<name>/`: a slice plus its thunks.
  - `services/apiClient.ts`: axios with `withCredentials: true`. Its 401 interceptor dispatches logout. Each module also has its own `*Api.ts`.
  - `layouts/PrivateRoute`: gates routes on `authSlice.status`.
  - Reusable components: `DataTable<T>`, `FormDialog`, `ConfirmDialog`, `TimeSeriesChart` (Recharts), and `MetricsCards`.
  - Forms use react-hook-form.
- **`packages/shared-types`**: the `MachineType` and `SensorModel` enums plus DTOs, used by both apps. Prisma can't name an enum value `HF+`, so the DB stores `HFPlus` and shared-types maps it to `"HF+"` for display and the API.
- **`apps/web-e2e`**: Cypress. Its `e2e` target runs the `cypress/included` image against the compose stack, so there is no host Cypress binary (install with `CYPRESS_INSTALL_BINARY=0`); set `WEB_PORT`/`API_PORT` the same way for both (`decisions.md` #41).

All API routes use the prefix `/api/v1`. Full endpoint list: `PLAN.md` §4.

## Invariants and non-obvious rules

- **Auth**: there is no `User` table. The single fixed login comes from the env vars `AUTH_EMAIL` and `AUTH_PASSWORD_HASH` (a bcrypt hash). The JWT lives in an httpOnly, secure cookie, and on app boot `GET /auth/me` hydrates Redux. In production the frontend (Vercel) and API (Render) are on different domains, so the cookie needs `SameSite=None; Secure` and CORS needs `credentials: true`.
- **Sensor identity**: `id` is a system-generated uuid primary key. `serialNumber` is entered by the user, represents the physical sensor label, and is also unique. A duplicate `serialNumber` returns 409. `MonitoringPoint` to `Sensor` is **1:1**: `monitoringPointId` is `@unique`.
- **TcAg/TcAs are not allowed on Pump machines.** The rule is defined once, as `isSensorCompatibleWithMachine`/`disallowedSensorModels` in `packages/shared-types/src/rules.ts`. The API enforces it, and the web app imports the same functions only for UX; the backend is authoritative. There is no DB constraint, and a violation returns **422**. Two code paths must enforce it:
  - attaching a sensor: `assertSensorCompatibleWithMachine` in `sensors.service.ts`;
  - changing a machine's type in `machines.service.ts` `updateMachine`, which checks inside a transaction for sensors the new type forbids.
  - Both paths must call `lockMachine(tx, machineId)` (`lib/locks.ts`, `SELECT … FOR UPDATE`) at the start of their transaction. A plain transaction is not enough under READ COMMITTED: a concurrent type change and attach can both pass their checks. `sensors.spec.ts` has a race test that fails without the lock.
  - Tests must cover all 6 machine × sensor combinations.
- **Error mapping** happens in one place, `errorHandler`: Prisma P2025 → 404, P2002 → 409, zod → 400, malformed JSON → 400, body over the `express.json` limit → 413, anything else → 500. A P2003 (foreign key) is mapped in the service that expects it (e.g. unknown sensor → 404 in `readings.service.ts`). Throw an `AppError` instead of writing responses from inside services.
- **Monitoring-point listing** (`GET /monitoring-points`):
  - Pagination is server-side, with `pageSize` 5.
  - `sortBy` must be one of `machineName | machineType | pointName | sensorModel`. The `orderBy` is built from that whitelist and never comes straight from user input.
  - The query is a single `prisma.$transaction([findMany, count])` that includes `machine` and `sensor`.
  - The response shape is `{data, meta: {page, pageSize, total, totalPages}}`.
  - Enum columns sort alphabetically only because `MachineType`/`SensorModel` are declared in alphabetical order (PostgreSQL sorts enums by declaration order). Add new enum values in their alphabetical position (`decisions.md` #31).
- **Time series**: readings go in a plain `Reading` table with a **unique** index on `(sensorId, timestamp)`. There is no TimescaleDB. Bulk inserts use `createMany({ skipDuplicates: true })`, so re-uploading is idempotent; a batch holds at most `MAX_READINGS_PER_REQUEST` (1000, from shared-types) to stay under the latency budget, and the web chunks larger uploads (`decisions.md` #33). Reading the series (`GET /sensors/:id/readings`) pages by a keyset cursor on `timestamp` (`?from&to&limit&after` → `meta.nextCursor`), never OFFSET (`decisions.md` #34). Metrics (min/max/avg) use `aggregate`. Prediction is a backend endpoint: a moving average (`?window=N`) is the baseline, and linear regression is a stretch goal.
- **Latency budget is under 350 ms per request.** Keep `select`/`include` explicit, always paginate, and rely on the indexes. When you touch `/monitoring-points` or `/readings`, re-check that their latency still fits.
- **Deletes are physical (hard delete), never soft delete** (`decisions.md` #28). Deleting a machine cascades to its monitoring points, sensors, and readings (`onDelete: Cascade`). Deleting a point cascades to its sensor and readings, and removing a sensor deletes its readings. Do not add `deletedAt`/`archivedAt` filters. The UI's `ConfirmDialog` must state what the cascade will erase.

## Frontend guidelines

These are requirements, not preferences. Details are in `PLAN.md` §5.

- **Mobile first, always.** Write base styles for the smallest screen (360px), then add `theme.breakpoints.up(...)` overrides for larger ones. Never start desktop-first and patch down with `down(...)`. Wide tables need a mobile layout (horizontal scroll inside the table container, or a card/list view below `md`), and the page itself must never scroll horizontally. Touch targets are at least 44×44px on mobile. The app must be usable from 360px wide up to desktop.
- **Accessibility (WCAG 2.1 AA).**
  - Use semantic markup and landmarks (`header`, `nav`, `main`).
  - Every input has a visible label and announces its errors (`helperText` wired to `aria-describedby`).
  - Icon-only buttons need an `aria-label`.
  - Everything works from the keyboard, focus stays visible, and dialogs trap and restore focus.
  - Text contrast is ≥ 4.5:1 in **both** themes. Colour never carries meaning alone: statuses also get text or an icon.
  - Respect `prefers-reduced-motion`.
  - The chart needs a text alternative (an `aria-label` summary, with the metrics visible next to it).
  - Keep the `jsx-a11y` lint rules on. In tests, query with `getByRole`/`getByLabelText`.
- **Dark/light mode.**
  - Build a single MUI 5 theme factory in `theme/` (`createAppTheme(mode)`) and set its `palette.mode`.
  - Keep the mode in a Redux `uiSlice`. The initial value is the stored choice from `localStorage`, falling back to `prefers-color-scheme`.
  - A toggle in the AppBar (with an `aria-label`) switches the mode and persists the choice.
  - Components read colours from the theme (`theme.palette.*`, `sx` tokens). Never hard-code a colour; this also applies to Recharts series and axes.

## Testing

- **API**: Vitest + supertest against the `postgres-test` compose service (start it with `docker compose up -d postgres-test` before running tests). `apps/api/vitest.setup.ts` sets a fixed test environment and never reads `.env`. `DATABASE_URL` points at port 5433 unless `TEST_DATABASE_URL` overrides it. Validate the environment only through `config/env.ts` (`parseEnv`); never read `process.env` directly elsewhere.
- **Web**: Vitest + React Testing Library, covering reducers, `DataTable`, dialogs, `PrivateRoute`, and form validation.
- Coverage thresholds of 70–80% are set in each project's `vitest.config.ts`.

## CI / deploy

- **`.github/workflows/ci.yml`** lives at the **git root** (`developer-challenges/`), not in this workspace, because GitHub only reads workflows from the repo root. Every step runs with `working-directory: full-stack-challenge`, and the workflow triggers only on changes under this folder. It gates on lint+typecheck, build, and tests with coverage. A SonarCloud quality gate then reads the lcov report. Cypress is deliberately not a gate. CI runs `npx prisma generate` before typecheck/build, because the generated client is gitignored.
- **Docker** (multi-stage `api`/`web` Dockerfiles plus `docker-compose.yml`) is for dev and CI only. Production runs native builds: Neon (Postgres), Render (API), and Vercel (web, via `VITE_API_URL`).
- Out of scope: load balancer and load tests.

## Conventions

- Use atomic **Conventional Commits** (`feat:`, `fix:`, `test:`, `chore:`, `docs:`, `refactor:`). The challenge grades commit quality. You dont commit anything, you can reccomend, though.
- Work on branch `daniel-goncalves`. The final PR targets `main` of the Dynamox repo.
- Document every assumption about ambiguous requirements in `README.md`, along with setup steps, env vars, the fixed credentials, and the deploy link.
- Everytime a task is finish, check the @TASKS.md and check it done if it comes from there.
