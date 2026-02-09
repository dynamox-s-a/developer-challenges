# Execution Plan

Based on the `planning/PROJECT-OVERVIEW.md`, this plan outlines the necessary steps to build the Industrial Monitoring System.

## 1. Server Implementation (`apps/api`, `apps/worker`)

The backend is built with NestJS within an Nx Monorepo, using PostgreSQL and Redis.

### Setup & Infrastructure
- [ ] Initialize Nx Monorepo structure.
- [ ] Configure `docker-compose.yml` for PostgreSQL, Redis, and RabbitMQ with explicit admin credentials.
- [ ] Initialize `libs/shared/persistence` with Prisma and Redis clients.
- [ ] Define DBML schema in Prisma and run migrations.

### `apps/api` (REST Gateway)
- [ ] **Auth Module**: Implement JWT strategy, Login (public), and Logout (secure) endpoints.
- [ ] **Machines Module**: CRUD endpoints (`GET`, `POST`, `PATCH`, `DELETE`) for Machines.
- [ ] **Monitoring Points Module**: Endpoints for listing points and associating sensors.
- [ ] **Telemetry Module**:
  - `GET /api/telemetry/metrics`: Total counts (from Redis).
  - `GET /api/telemetry/:id`: Historical data (from Postgres).

### `apps/worker` (Data Ingestion)
- [ ] **RabbitMQ Consumer**: Implement listener for `telemetry_data` and `sensor_update` topics.
- [ ] **Data Processing**:
  - Store raw readings in PostgreSQL (`telemetry` table).
  - Update real-time state in Redis (`latest` hash & `stream` buffer).
  - Increment global counters in Redis.

## 2. Basic Server Testing

Verification of backend logic and performance.

### Automated Tests
- [ ] **Unit Tests**: Test individual services (AuthService, MachinesService) using Jest.
- [ ] **Integration Tests**: Test API endpoints with a test database to ensure correct HTTP responses and DB persistence.
- [ ] **Worker Tests**: Mock RabbitMQ messages to verify ingestion logic and database writes.

### Manual Verification
- [ ] Use Postman/Insomnia to verify all implementation API endpoints.
- [ ] Create `.http` files for lightweight API testing.
- [ ] Verify Redis keys are updating correctly during data ingestion.

## 3. Client Implementation (`apps/client`)

Frontend built with Next.js, Material UI 5, and Redux.

### Foundation
- [ ] Setup Next.js with TypeScript and Material UI 5.
- [ ] Configure Redux Toolkit and Thunks for global state.
- [ ] Implement `NextAuth` for authentication.

### Feature Implementation
- [ ] **Authentication**: Login page with validation and redirect logic.
- [ ] **Layout**: Main dashboard layout with navigation (Sidebar/TopBar).
- [ ] **Dashboard**: Real-time metric cards (Total Telemetry, System Health).
- [ ] **Machines**: CRUD views (List, Create Modal, Edit Modal, Delete confirmation).
- [ ] **Monitoring**:
  - Paginated table for Monitoring Points.
  - Detail view with **Real-time Charts** (recharts/chart.js) consuming the stream.

## 4. Basic Client Testing

Ensuring UI correctness and user flows.

### Tests
- [ ] **Component Tests**: Verify rendering of key components (MachineCard, SensorTable).
- [ ] **E2E Tests**: Use Cypress/Playwright to test the "Happy Path":
  - Login -> Create Machine -> Add Sensor -> View Dashboard.

## 5. Deployment

Preparing the application for production-like environments.

### Containerization
- [ ] Create `Dockerfile` for `apps/api`.
- [ ] Create `Dockerfile` for `apps/worker`.
- [ ] Create `Dockerfile` for `apps/client`.

### Orchestration
- [ ] Update `docker-compose.yml` to include the application services.
- [ ] Configure environment variables (`.env`) for production.

## 6. Final General Testing

Validation against success metrics.

### Performance & Integrity
- [ ] **Latency Test**: Measure API response times to ensure < 350ms target.
- [ ] **Data Integrity**: Verify relationships (Machine <-> Point <-> Sensor) and ensure no orphan records.
- [ ] **Load Test**: Simulate high-frequency sensor (simulator) data to test Worker throughput.

### User Acceptance
- [ ] Verify strict prohibition logic (Pump != TcAg/TcAs).
- [ ] Verify redundancy requirement (Machine has >= 2 monitoring points).
