# Full Stack Challenge – Initial Setup

This project is part of the Dynamox Full Stack technical challenge.

At this stage, it contains the initial infrastructure and backend setup, including:
- Node.js backend with Fastify
- PostgreSQL database using Docker
- Prisma ORM with migrations

## Requirements

- Node.js >= 18
- Docker & Docker Compose
- pnpm

## How to run

```bash
cd full-stack
```

Start the database:
```bash
docker-compose up -d
```

Create a .env file based on the example:
```bash
cp apps/backend/.env.example apps/backend/.env
```

Install pnpm (if not already installed):
```bash
npm install -g pnpm
```

Install dependencies:
```bash
pnpm install
```

Install JWT and sensible packages:
```bash
pnpm add @fastify/jwt @fastify/sensible
pnpm add -D @types/jsonwebtoken
```

Run database migrations:
```bash
cd apps/backend
```

Start the backend:
```bash
pnpm prisma:migrate
```

Start the backend:
```bash
pnpm dev
```

## API

```bash
curl http://localhost:3001
```

## Health check endpoint:
```bash
curl http://localhost:3001/health
```