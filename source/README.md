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
docker-compose -f .\docker\docker-compose.yml up -d
```

Setup the environment variables:

```
DATABASE_URL="postgresql://{USER}:{USER_PASSWORD}@localhost:5432/dynamox_db?schema=public"
REDIS_URL="redis://localhost:6379"
RABBITMQ_URL="amqp://{USER}:{USER_PASSWORD}@localhost:5672"
JWT_SECRET="{YOUR_JWT_SECRET}"
NEXTAUTH_SECRET="{YOUR_NEXT_AUTH_SECRET}"
NEXTAUTH_URL="http://localhost:4200"
```

The PostgreSQL and RabbitMQ credentials are set inside the `docker-compose.yml` file, make sure to use the same credentials in the environment variables.

### 2. Database Initialization

Install dependencies and sync the schema:

```pnpm
# Install all dependencies
pnpm install

# Generate the Prisma Client
pnpm prisma:generate

# Push the database tables to the running instance of PostgreSQL
pnpm prisma:push

# (Optional) Populate the database with data for testing (admin user, machines and monitoring points)
pnpm prisma:seed
```

### 3. Running Applications

Run each service in development mode:

```pnpm
# Build the persistence module
pnpm build:persistence

# Start the API
pnpm serve:api

# Start the Worker
pnpm serve:worker

# Start the Simulator
pnpm serve:simulator
```

## 🧪 Testing

- **Manual API Testing**: Use the [test.http](/source/test.http) file with the REST Client extension.
- **Default Credentials**: `admin@dynamox.com` / `admin` (seeded automatically on API startup).

## 📋 Business Rules

- **Strict Association**: Machines of type `Pump` cannot be associated with `TcAg` or `TcAs` sensors.
- **Telemetry**: High-frequency data is processed asynchronously to ensure sub-350ms response times for critical API paths.

## 📔 Notes

> [!TIP]  
> **Authentication Guard**: Pay attention to the matcher regular expression in `proxy.ts` when creating new pages, as it defines which routes require authentication.

> [!NOTE]  
> For detailed information about the project's development process and technical decisions, consult the [PROJECT-WALKTHROUGH.md](./documents/PROJECT-WALKTHROUGH.md) file.