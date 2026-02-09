# Industrial Monitoring System - Dynamox Full Stack Role Test

A full-stack industrial monitoring system built with a monorepo architecture, designed for high-frequency telemetry ingestion and real-time visualization.

## 🏗️ Architecture

The project uses an **Nx Monorepo** structure to manage multiple specialized applications and shared libraries:

- **`apps/api` (REST Gateway)**: NestJS application serving as the entry point for clients. Handles Authentication (JWT), CRUD for Machines/Monitoring Points, and historical Telemetry data.
- **`apps/worker` (Data Ingestion)**: NestJS microservice that consumes telemetry data from RabbitMQ. It persists raw data in PostgreSQL and updates real-time state/counters in Redis.
- **`apps/simulator` (Sensor Simulator)**: Lightweight script to simulate heterogeneous sensor data and push it to RabbitMQ.
- **`libs/shared/persistence`**: Shared library containing Prisma Client (PostgreSQL), Redis, and RabbitMQ connection utilities.

## 🛠️ Tech Stack

- **Backend**: NestJS, TypeScript, Passport.js (JWT)
- **Database**: PostgreSQL (Relational Data)
- **Cache/Real-time**: Redis (Counters, Recent Streams)
- **Messaging**: RabbitMQ (Async Ingestion Pipeline)
- **ORM**: Prisma 7
- **Monorepo**: Nx

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- pnpm

### 1. Infrastructure Setup

Start the database, message broker, and cache:

```pnpm
docker-compose up -d
```

### 2. Database Initialization

Install dependencies and sync the schema:

```pnpm
pnpm install
npx prisma generate --schema=libs/shared/persistence/prisma/schema.prisma
npx prisma db push --schema=libs/shared/persistence/prisma/schema.prisma
```

### 3. Running Applications

Run each service in development mode:

```pnpm
# Start the API
npx nx serve api

# Start the Worker
npx nx serve worker

# Start the Simulator
npx nx serve simulator
```

## 🧪 Testing

- **Manual API Testing**: Use the [test.http](/source/test.http) file with the REST Client extension.
- **Default Credentials**: `admin@dynamox.com` / `admin` (seeded automatically on API startup).

## 📋 Business Rules

- **Strict Association**: Machines of type `Pump` cannot be associated with `TcAg` or `TcAs` sensors.
- **Telemetry**: High-frequency data is processed asynchronously to ensure sub-350ms response times for critical API paths.
