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
├── docker-compose.yml
└── pnpm workspace
```

## Requirements

- Node.js 18+
- pnpm
- Docker + Docker Compose

## Setup

All commands below assume you are inside the `full-stack` directory.

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start database

```bash
docker-compose up -d
```

### 3. Configure backend environment

```bash
cp apps/backend/.env.example apps/backend/.env
```

### 4. Run database migrations

```bash
cd apps/backend
pnpm prisma:migrate
cd ../..
```

### 5. Start backend

```bash
cd apps/backend
pnpm dev
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

Open a new terminal:

```bash
cd apps/frontend
pnpm dev
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
pnpm dev
pnpm prisma:migrate
pnpm prisma:studio
```

Frontend:

```bash
pnpm dev
pnpm build
```

Database:

```bash
docker-compose up -d
docker-compose down
```

## Troubleshooting

If frontend shows no data:

- ensure backend is running
- ensure database migrations were applied
- create sample machines and monitoring points

Check backend health:

```bash
curl http://localhost:3001/health
```

## Notes

The project is structured as a monorepo using pnpm workspaces. Backend and frontend are independent applications sharing the same repository.

Swagger UI provides full API testing capability.