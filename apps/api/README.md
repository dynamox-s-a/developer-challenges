# API - Tests

## Prerequisites

- Docker + Docker Compose
- Node.js 20+
- Dependencies installed at repo root (`npm install`)

## Test database setup

1. Start PostgreSQL:

```bash
docker compose up -d postgres
```

2. Create test database once (optional, integration script also auto-creates if missing):

```bash
docker exec -i postgres_dynamox_challenge psql -U postgres -c "CREATE DATABASE dynamox_test;"
```

If you run tests from the host machine (outside Docker network), update `DATABASE_URL` in `.env.test` to use host `localhost` instead of `postgres`.

## Run tests

From repository root:

```bash
npm run test --workspace apps/api
```

Only unit tests:

```bash
npm run test:unit --workspace apps/api
```

Only integration tests:

```bash
npm run test:integration --workspace apps/api
```

Watch mode:

```bash
npm run test:watch --workspace apps/api
```

## Test organization

- `tests/unit`: pure domain and validation rules
- `tests/integration`: REST API flows with real PostgreSQL + Prisma
- `tests/fixtures`: golden datasets reused by tests
- `tests/helpers`: app factory, DB reset and API factories
