# Dynamox Full Stack Challenge

This repository contains a full-stack implementation for the Dynamox technical challenge, including a backend API, a frontend application, and a PostgreSQL database.

## Project Overview

The system allows management of machines, monitoring points, and sensors with business rules enforced on the backend. The frontend displays monitoring data with pagination and sorting.

## Project Structure

```
full-stack/
├── apps/
│   ├── backend/      Fastify API + Prisma
│   └── frontend/     React + TypeScript + MUI
├── scripts/          Deployment and utility scripts
│   ├── get-token.sh
│   ├── up.sh
│   ├── down.sh
│   └── smoke-test.sh
├── .github/
│   └── workflows/
│       └── ci.yml    CI/CD pipeline
├── docker-compose.yml        Complete application stack (postgres + backend + frontend)
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Requirements

- Node.js 18+
- pnpm
- Docker + Docker Compose

## Quick Start (Docker) - Recommended

This is the fastest way to get the full application running with all services.

```bash
# Deploy everything with one command
./scripts/up.sh
```

Services will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001  
- **Swagger**: http://localhost:3001/docs
- **PostgreSQL**: localhost:5433

### First Run Tip

On first startup, the backend automatically runs migrations and seeds sample data automatically.
Default credentials:

```
username: admin
password: admin
```

### Verification

After startup, run:

```bash
./scripts/smoke-test.sh
```

Expected output:
- Health endpoint OK
- Monitoring points returned
- Time-series data available

### Docker Commands

```bash
# Stop all services
./scripts/down.sh

# View logs
docker compose logs -f

# Rebuild without cache
docker compose build --no-cache

# Start only database (for local development)
docker compose up -d postgres
```

## Alternative Local Development (pnpm)

If you prefer to run services locally for development with hot reload.

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start database

```bash
docker compose up -d postgres
```

PostgreSQL will be available at: **localhost:5433**

### 3. Configure backend environment

```bash
cp apps/backend/.env.example apps/backend/.env
```

### 4. Run database migrations and seed data

```bash
pnpm --filter backend prisma:migrate
pnpm --filter backend prisma:seed
```

### 5. Start backend

```bash
pnpm --filter backend dev
```

Backend runs at:
```
http://localhost:3001
```

Swagger documentation:
```
http://localhost:3001/docs
```

### 6. Start frontend

```bash
pnpm --filter frontend dev
```

Frontend runs at:
```
http://localhost:5173
```

## Backend Features

- Machines CRUD
- Monitoring Points CRUD
- Sensor validation rules
- Pagination and sorting endpoint
- Swagger API documentation

### Business Rules

- Pump machines cannot use TcAg or TcAs sensors
- Fan machines support all sensor models

## API Highlights

Health check:

```
GET /health
```

Monitoring table endpoint:

```
GET /monitoring-points
```

Supports pagination and sorting.

## Development Commands

Backend:

```bash
pnpm --filter backend dev
pnpm --filter backend prisma:migrate
pnpm --filter backend prisma:studio
```

Frontend:

```bash
pnpm --filter frontend dev
pnpm --filter frontend build
```

Database:

```bash
docker compose up -d postgres
docker compose down  # stops all containers
```

## Troubleshooting

If frontend shows no data or you want to verify the setup:

### 1. Run smoke test
```bash
./scripts/smoke-test.sh
```
This script tests all endpoints and verifies the system is working correctly.

### 2. Get authentication token
```bash
./scripts/get-token.sh
```
This script retrieves a JWT token for API testing.

### 3. Manual health check
```bash
curl http://localhost:3001/health
```

### 4. Common issues
- **No data in frontend**: Run the smoke test to verify backend and database connectivity
- **Authentication errors**: Use get-token.sh to obtain a valid JWT token
- **Database connection issues**: Ensure PostgreSQL container is running with `docker compose ps`

## Notes

The project uses a unified Docker setup with a single `docker-compose.yml` that contains the complete application stack (postgres + backend + frontend).

For local development, you can use `docker compose up -d postgres` to run only the database while running backend/frontend locally with hot reload.

The project is structured as a monorepo using pnpm workspaces. Backend and frontend are independent applications sharing the same repository.

Swagger UI provides full API testing capability.