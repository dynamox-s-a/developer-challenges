# Dynamox Full-Stack Challenge

Implementation of the [Full-Stack Developer Challenge](../full-stack-challenge.md).

## Structure

```
full-stack-challenge/
  apps/api       Node.js + Express + Prisma + PostgreSQL
  apps/web       Vite + React + TypeScript + MUI 5 + Redux Toolkit
  libs/shared    Shared types and domain rules
  cypress/       E2E tests (bonus)
  deploy/        Nginx (SPA + load balancer)
  scripts/load   Load / LB distribution checks
```

## Prerequisites

- Node.js 20+
- Docker (PostgreSQL / production stack)

## Quick start

```bash
cd full-stack-challenge
npm install
npm run db:up
cp apps/api/.env.example apps/api/.env   # if needed
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev:api   # http://localhost:3001
npm run dev:web   # http://localhost:4200
```

**Seed credentials:** `admin@dynamox.test` / `Dynamox@123`

## Tests

```bash
npm test                 # API + web unit tests
npm run test:e2e         # Cypress (API + web must be running)
npm run test:load        # autocannon against API (default http://localhost:3001)
npm run test:load:lb     # same suite against the prod LB (http://localhost:8080)
```

API responses include `X-Response-Time` and `X-Instance-Id` (exposed via CORS) to help verify the &lt;350ms latency target and LB distribution across replicas.

Tune load runs with env vars: `LOAD_BASE_URL`, `LOAD_CONNECTIONS` (default 20), `LOAD_DURATION` (default 10s), `LOAD_SAMPLES` (default 40 for instance distribution).

## Assumptions

1. Auth uses a single seeded user with JWT (stateless). Logout clears the client token and hits `POST /api/auth/logout` for API symmetry.
2. Machine types are exactly `Pump` and `Fan` (Prisma enums + shared TS enums).
3. Deleting a machine cascades to monitoring points, sensors and readings.
4. Private routes on the web require a valid JWT restored via `GET /api/auth/me`.
5. API CORS allows `http://localhost:4200`; the Vite proxy also forwards `/api` in development. Prod LB uses same-origin on `:8080`.
6. Each monitoring point has at most one sensor (1:1). Sensor IDs are unique across the system.
7. Sensor models are `TcAg`, `TcAs` and `HF+`. Pump machines cannot use `TcAg`/`TcAs` (enforced on API and reflected in the UI).
8. Changing a machine type to `Pump` is blocked if any of its monitoring points already has a `TcAg` or `TcAs` sensor; remove or replace those sensors first.
9. At least two monitoring points per machine is a soft recommendation: the API allows N points; the UI shows real `monitoringPointsCount` per machine and warns when below 2.
10. Monitoring points list is paginated server-side (default 5/page) and sortable by Machine Name, Machine Type, Monitoring Point Name, and Sensor Model.
11. Time-series readings belong to a monitoring point. Storing readings requires a sensor to be associated first. Readings are `{ timestamp, value }` batches. Metrics expose count/min/max/avg. Global reading count is available at `GET /api/readings/count`.
12. Forecast (bonus): `GET /api/monitoring-points/:id/readings/forecast?horizon=12` uses least-squares linear regression on the existing series to project future points. This is a transparent demo predictor, not a production ML model.
13. JWT is stateless, so API replicas behind the LB do not need sticky sessions.

## Deploy (bonus — template)

Production stack: Postgres + N API replicas + static web + nginx load balancer on **host port 8080**.

```bash
# Build and start with 2 API replicas
npm run prod:up
# equivalent: docker compose -f docker-compose.prod.yml up --build -d --scale api=2

# Apply schema + seed (one-shot against the compose network)
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec api npx prisma db seed

# Open app via LB
# http://localhost:8080

npm run test:load:lb   # latency + X-Instance-Id distribution
npm run prod:down
```

Configs: `deploy/nginx-lb.conf` (edge LB) and `deploy/nginx-web.conf` (SPA). The LB resolves `api` via Docker DNS so `--scale api=N` spreads traffic; each replica answers with a distinct `X-Instance-Id` (Docker hostname by default).

For cloud providers (Railway, Render, Fly.io): deploy Postgres + API, build the Vite app with `VITE_API_URL` pointing to the public API (or keep same-origin nginx proxy as in `deploy/nginx-lb.conf`). Publishing to a live URL requires your provider credentials.

## Current progress

- [x] Nx monorepo scaffold
- [x] PostgreSQL + Prisma + seed
- [x] Auth (login / logout / protected routes)
- [x] Machines CRUD (API + UI)
- [x] Monitoring points & sensors (create, associate, paginated/sorted list, Pump rule)
- [x] High-priority hardening (associateSensor tests, Fan→Pump guard, React 18 + Vite 5)
- [x] Reusable UI components, FE tests, X-Response-Time, soft ≥2 points rule, ConfirmDialog, Cypress scaffold, deploy template
- [x] Time-series (store/list/metrics/count/delete + Recharts visualization)
- [x] Bonus: linear-regression forecast overlaid on the chart
- [x] Bonus: nginx load balancer + scalable API replicas
- [x] Bonus: load tests (autocannon + instance distribution)
