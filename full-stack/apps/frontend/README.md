
# Dynamox Full Stack Challenge

This repository contains my solution for the Dynamox Full Stack challenge.  
It includes a full backend API, database, authentication system, and a React frontend.

## Tech Stack

- Backend: Node.js, TypeScript, Fastify, Prisma, JWT
- Frontend: React, TypeScript, Vite, Material UI
- Database: PostgreSQL (Docker)
- Package manager: pnpm workspace

## Project Structure

```
full-stack/
├── apps/
│   ├── backend/          # Fastify API + Prisma + Auth
│   └── frontend/         # React UI
├── docker-compose.yml    # PostgreSQL database
├── pnpm-workspace.yaml
└── package.json
```

## Requirements

- Node.js >= 18
- Docker + Docker Compose
- pnpm

## Environment Variables

Create the backend environment file:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Main variables:

- DATABASE_URL — PostgreSQL connection string
- JWT_SECRET — JWT signing secret
- SEED_ADMIN_USERNAME — admin username created by seed
- SEED_ADMIN_PASSWORD — admin password created by seed

Login credentials are validated against the database.  
The seed script creates or updates the admin user.

## Full Setup

From the repository root:

```bash
cd full-stack
pnpm install
docker compose up -d
```

Run database migrations and seed data:

```bash
cd apps/backend
pnpm prisma:migrate
pnpm prisma:seed
pnpm exec prisma generate
```

## Running the Applications

Start backend:

```bash
cd apps/backend
pnpm dev
```

Backend runs at:

```
http://localhost:3001
```

Start frontend (in a new terminal):

```bash
cd full-stack
pnpm --filter frontend dev
```

Frontend runs at:

```
http://localhost:5173
```

## API Access

Backend base URL:

```
http://localhost:3001
```

Available endpoints:

- Health check: GET /health
- Authentication: POST /auth/login
- Machines endpoints
- Monitoring points endpoints

Swagger documentation:

```
http://localhost:3001/docs
```

## Authentication

Login endpoint:

```
POST /auth/login
```

Default credentials (created by seed):

- username: admin
- password: admin

Example login test:

```bash
curl -s -X POST http://localhost:3001/auth/login   -H "Content-Type: application/json"   -d '{"username":"admin","password":"admin"}'
```

Use returned token:

```bash
TOKEN="PASTE_TOKEN_HERE"
curl -i http://localhost:3001/machines   -H "Authorization: Bearer $TOKEN"
```

## Database

PostgreSQL container settings:

- Host: localhost
- Port: 5433
- Database: dynamox
- User: dynamox
- Password: dynamox

## Useful Commands

Backend:

```bash
cd apps/backend
pnpm dev
pnpm build
pnpm prisma:migrate
pnpm prisma:seed
pnpm prisma:studio
```

Frontend:

```bash
cd apps/frontend
pnpm dev
pnpm build
pnpm preview
```

Database:

```bash
docker compose up -d
docker compose down -v
docker compose logs -f
```