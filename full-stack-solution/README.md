# Dynamox Full-Stack Challenge — Kiane Casagrande

Full-stack application for managing industrial machines, monitoring points, sensors, and time-series readings.

## Live Demo

- **Frontend:** [https://developer-challenges.vercel.app/](https://developer-challenges.vercel.app/)
- **API:** [https://developer-challenges-4km3.onrender.com](https://developer-challenges-4km3.onrender.com)
- **API Health Check:** [https://developer-challenges-4km3.onrender.com/api/health](https://developer-challenges-4km3.onrender.com/api/health)

### Demo Credentials

Use the following account to access the deployed application:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `dynamox@dynamox.com` |
| Password | `12345678`            |

**Note:** The API is hosted on Render and may take a short time to respond after a period of inactivity.

### Deployment notes

The frontend is a single-page application: the server returns one `index.html` and
React Router decides what to render. Paths such as `/login` are routes inside the
bundle, not files on disk, so the host has to fall back to `index.html` for any path
it cannot find — otherwise a refresh or a direct link answers 404. That fallback is
`vercel.json` in this directory, which Vercel reads from the project's configured
**Root Directory**; the dev server does the same thing locally on its own.

The API needs `CORS_ALLOWED_ORIGINS` set to the frontend origin, since the two are
deployed to different hosts.

## Technologies

- **Backend:** Node.js, Express 5, TypeScript, Prisma 7, and PostgreSQL 16.
- **Frontend:** React 18, Vite 8, TypeScript, MUI 5, Redux Toolkit, and Recharts.
- **Shared:** Nx monorepo and Zod 4 for shared validation schemas and business rules.

## Project Structure

```text
full-stack-solution/
├── apps/
│   ├── api/       # REST API
│   └── web/       # Frontend application
└── libs/
    └── shared/    # Shared schemas, types, and rules
```

## Getting Started

### 1. Prerequisites

- Node.js `^20.19` or `>=22.12`
- npm 10+
- Docker

### 2. Install dependencies

```bash
git clone <repo-url>
cd full-stack-solution
npm install
```

### 3. Configure the environment

```bash
cp .env.example .env
```

Fill in the required variables in `.env`, including the PostgreSQL credentials, `DATABASE_URL`, `JWT_SECRET`, `SEED_USER_EMAIL`, and `SEED_USER_PASSWORD`.

Use a randomly generated JWT secret with at least 32 characters. Refer to `.env.example` for all available environment variables.

### 4. Start the database

```bash
docker compose up -d
```

Apply the database migrations and create the initial user:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 5. Start the applications

Start the API:

```bash
npx nx serve api
```

In a separate terminal, start the frontend:

```bash
npx nx serve web
```

Open [http://localhost:4200](http://localhost:4200) and sign in using the credentials configured in `SEED_USER_EMAIL` and `SEED_USER_PASSWORD`.

The API is available at [http://localhost:3000/api](http://localhost:3000/api).

Health check: `GET /api/health`.

## Testing and Code Quality

```bash
# Run tests and lint across all projects
npx nx run-many -t test lint -p shared api web

# Type-check, test, and lint the frontend
npx nx run-many -t typecheck test lint -p web

# Build the frontend for production
npx nx build web
```

Tests use mocked dependencies where appropriate and do not require the database or API to be running.

### End-to-end tests (Cypress)

These drive the real stack, so the database, the API and the frontend must all be
running first (steps 4 and 5 above). `VITE_API_URL` must be empty so the browser
goes through the dev-server proxy rather than to a deployed API.

```bash
npx nx e2e web-e2e        # headless
npx nx e2e-open web-e2e   # interactive runner
```

One spec covers a full user flow: sign in, create a machine, add two monitoring
points, install a sensor, confirm the API refuses `Fan` → `Pump` while `TcAg` is
installed, send readings and see them charted with their unit, then sign out and
confirm the private area stays closed.

Credentials come from `SEED_USER_EMAIL` / `SEED_USER_PASSWORD`, so run
`npx prisma db seed` after changing them. The spec names its data with a
run-specific suffix and deletes the machine at the end, which cascades to its
points, sensor and readings — a run leaves the database as it found it.

> If Cypress fails to start with `bad option: --no-sandbox`, the shell has
> `ELECTRON_RUN_AS_NODE=1` set (some editors export it). Run the command with
> `env -u ELECTRON_RUN_AS_NODE`.

## API

**Local base URL:** `http://localhost:3000/api`

**Production base URL:** `https://developer-challenges-4km3.onrender.com/api`

The API uses JWT authentication and provides the following features:

- Authentication and session management.
- Machine creation and management.
- Monitoring point and sensor management.
- Ingestion, querying, aggregation, and deletion of time-series readings.

All endpoints require an access token except `POST /auth/login` and `GET /health`.

## Documentation

Technical documentation is organized in [`docs/`](./docs/README.md):

- [Architecture](./docs/01-architecture.md) — structure, runtime topology, layering and conventions.
- [Domain Model](./docs/02-domain-model.md) — entities, schema, enumerations and invariants.
- [Business Rules](./docs/03-business-rules.md) — the domain rules and how each one fails.
