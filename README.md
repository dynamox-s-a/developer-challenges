# Dynamox Full-Stack Challenge

Machine and sensor monitoring system developed with React, Fastify, and PostgreSQL.

---

## 7-Day Plan

### Day 1 (02/01) — Setup + Backend Authentication ✅
- [x] Configure Git (branch `gabriel-leite-araujo`, remote)
- [x] Clean up unnecessary repo files
- [x] Fix missing tsconfig.spec.json
- [x] Configure user seed with bcryptjs
- [x] Layer structure (repositories, services, routes)
- [x] POST /auth/login with JWT working
- [x] Configure ts-node-dev for hot reload

### Day 2 (02/02) — Backend: Auth Middleware + Machines
- [x] Create JWT authentication middleware
- [x] `authenticate` decorator for protected routes
- [x] CRUD `/machines`:
  - [x] POST /machines (create)
  - [x] GET /machines (list)
  - [x] GET /machines/:id (get one)
  - [x] PUT /machines/:id (update)
  - [x] DELETE /machines/:id (delete)
- [x] Validation: type must be "Pump" or "Fan"
- [x] Machine Repository + Service
- [x] Unit tests for service

### Day 3 (02/03) — Backend: Monitoring Points + Sensors
- [x] CRUD `/monitoring-points`
- [x] CRUD `/sensors`
- [x] Associate sensor with monitoring point
- [x] **Rule:** TcAg and TcAs CANNOT be used on "Pump" machines
- [x] Paginated list (5/page) sortable by any column
- [x] Repository + Service
- [x] Unit tests

### Day 4 (02/04) — Backend: Time-Series + API Finalization
- [x] CRUD `/time-series`:
  - [x] POST (store sensor data)
  - [x] GET (fetch full series)
  - [x] GET /metrics (metrics: min, max, avg)
  - [x] GET /count (record count)
  - [x] DELETE (remove)
- [x] Ensure latency < 350ms
- [x] Complete Swagger documentation
- [x] Integration tests

### Day 5 (02/05) — Frontend: Setup + Authentication
- [x] Configure Material UI 5 (theme)
- [x] Configure Redux Toolkit + Thunk
- [x] Login Screen
- [x] Route Protection (PrivateRoute)
- [x] Logout
- [x] Responsive base layout (sidebar, header)
- [x] Axios interceptors for JWT

### Day 6 (02/06) — Frontend: CRUD Machines + Monitoring Points
- [x] Initial Dashboard
- [x] Machines List (table)
- [x] Create/Edit Machine Modal
- [x] Delete Machine
- [x] Monitoring Points List (paginated, sortable)
- [x] Associate/view sensor
- [x] Complete API integration

### Day 7 (02/07) — Frontend: Time-Series + Polish + Delivery
- [x] Time-series visualization screen
- [x] Chart with Recharts
- [x] Upload/input sensor data
- [x] Frontend unit tests
- [x] Code review
- [x] README with final assumptions
- [x] Organized semantic commits
- [x] Final PR to dynamox-s-a/developer-challenges

### Implemented Bonuses
- [x] Nx Monorepo
- [x] Future Data Prediction
- [x] Load Balancer (Nginx)
- [x] Load Tests (k6)
- [x] Deploy (Docker/Containerization)
- [ ] E2E Tests with Cypress (Configuration started)

---

## Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Material UI 5
- Redux Toolkit
- React Router
- Recharts

**Backend:**
- Fastify
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Linear Regression for Prediction

**Infrastructure:**
- Docker & Docker Compose
- Nginx (Load Balancer & Web Server)
- k6 (Load Testing)

**Monorepo:**
- Nx

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm
- k6 (optional, for load testing)

## Setup

1. Configure environment variables:

```bash
cp .env.example .env
```

> **Attention:** After copying, edit the `.env` file with the following settings:
>
> *   **JWT_SECRET**: Generate a secure random string (e.g., `openssl rand -base64 32`) or use `supersecret` for local testing only.
> *   **DATABASE_URL**:
>     *   If using the database via Docker (`npm run db:up`), change the port to **5433**:
>         `postgresql://dynamox:dynamox123@localhost:5433/dynamox?schema=public`
>     *   If you have a local Postgres running, keep port **5432** and adjust user/password according to your installation.

2. Install dependencies:

```bash
npm install
```

3. Start the database:

```bash
npm run db:up
```

4. Generate Prisma Client and run migrations:

```bash
npm run db:generate
npm run db:migrate
npx prisma db seed
```

5. Run the application (Development Mode):

```bash
npm run dev
```

- Frontend: http://localhost:4200
- Backend: http://localhost:3000

## Full Docker Setup (Bonus: Deploy & Load Balancer)

To simulate a production environment with Load Balancer and multiple API replicas:

> **Note:** If you are using Linux, you might need to use `docker compose` (with space) instead of `docker-compose` (with hyphen), depending on your Docker version.

```bash
docker-compose -f docker-compose.full.yml up --build
```

- **Frontend (Nginx)**: http://localhost:4200
- **API (Load Balanced)**: http://localhost:3000
- **API Replicas**: 3 instances running internally

## Load Tests (Bonus)

With the environment running (dev or docker), execute:

```bash
# Requires k6 installed
k6 run load-test.js
```

### Performance Evidence (Example)

Run the command above to generate the report. The expected result should be similar to:

```
     ✓ logged in successfully
     ✓ machines status is 200

     checks.........................: 100.00% ✓ 836      ✗ 0
     data_received..................: 2.4 MB  23 kB/s
     data_sent......................: 260 kB  2.5 kB/s
     http_req_blocked...............: avg=24.5µs min=1µs    med=4µs    max=1.56ms p(90)=9µs    p(95)=13µs
     http_req_connecting............: avg=7.83µs min=0s     med=0s     max=1.07ms p(90)=0s     p(95)=0s
     http_req_duration..............: avg=7.84ms min=2.08ms med=6.86ms max=56.2ms p(90)=12.4ms p(95)=15.7ms
       { expected_response:true }...: avg=7.84ms min=2.08ms med=6.86ms max=56.2ms p(90)=12.4ms p(95)=15.7ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 836
     http_req_receiving.............: avg=58.6µs min=9µs    med=40µs   max=1.45ms p(90)=101µs  p(95)=135.25µs
     http_req_sending...............: avg=18.4µs min=3µs    med=12µs   max=478µs  p(90)=31µs   p(95)=41µs
     http_req_tls_handshaking.......: avg=0s     min=0s     med=0s     max=0s     p(90)=0s     p(95)=0s
     http_req_waiting...............: avg=7.76ms min=2.01ms med=6.78ms max=56.09ms p(90)=12.33ms p(95)=15.54ms
     http_reqs......................: 836     8.070087/s
     iteration_duration.............: avg=1.01s  min=1s     med=1.01s  max=1.06s  p(90)=1.01s  p(95)=1.02s
     iterations.....................: 418     4.035044/s
     vus............................: 1       min=1      max=20
     vus_max........................: 20      min=20     max=20
```

> **Note:** The latency requirement < 350ms is validated by the `http_req_duration` metric.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Runs frontend and backend |
| `npm run dev:web` | Runs only frontend |
| `npm run dev:api` | Runs only backend |
| `npm run build` | Production build |
| `npm run test` | Runs unit tests |
| `npm run db:up` | Starts PostgreSQL |
| `npm run db:down` | Stops PostgreSQL |
| `npm run db:migrate` | Runs migrations |
| `npm run db:generate` | Generates Prisma Client |
| `npm run db:studio` | Opens Prisma Studio |

## Project Structure

```
├── apps/
│   ├── web/          # Frontend React + Vite
│   └── api/          # Backend Fastify
├── libs/
│   └── shared/       # Shared Types
├── prisma/
│   └── schema.prisma # Database Schema
├── infra/            # Infra Configs (Nginx)
├── docker-compose.yml # DB only (Dev)
├── docker-compose.full.yml # Full Environment (Simulated Prod)
├── load-test.js      # k6 Load Test Script
└── package.json
```

## Reviewer Feedback & Implementation Details

This section details how each point of the review feedback was addressed and how to validate the implementation.

### 1. Authentication & Configuration
- **Feedback:** Missing information about which user to use and how to configure `.env`.
- **Implementation:**
  - Added **Test Credentials** section with default email/password.
  - Added **Attention** section in Setup explaining how to generate `JWT_SECRET` and configure the correct `DATABASE_URL` for Docker (port 5433).
- **Verification:** Follow the [Setup](#setup) steps and try to log in with the provided credentials.

### 2. Pagination (Monitoring Points)
- **Feedback:** Unable to reduce the number of items per page.
- **Implementation:** The table component was updated to allow page size options: `[2, 5, 10, 25]`.
- **Verification:** On the Monitoring Points screen, use the selector at the bottom of the table to change the number of rows.

### 3. Sensor Restrictions (Pump Machines)
- **Feedback:** Ensure TcAg/TcAs are not used on Pump machines.
- **Implementation:**
  - **Frontend:** When selecting a "Pump" machine, the sensor dropdown disables invalid options and automatically selects "HF+".
  - **Backend:** The service validates the machine type before creating/updating and throws a 400 error if the rule is violated.
- **Verification:** Try to create a TcAg sensor for a Pump machine via UI (should be blocked) or via API (should return error).

### 4. Unit Tests
- **Feedback:** "Not all tests are implemented".
- **Implementation:** Comprehensive unit tests were added for Backend (`monitoring-point.service.spec.ts`, etc.) and Frontend (`monitoringPointsSlice.spec.ts`).
- **Verification:** Run `npm run test` and verify that all tests pass.

### 5. Latency & Performance
- **Feedback:** Missing evidence regarding the < 350ms requirement.
- **Implementation:** Configured load test script with k6.
- **Verification:** Run `npm run test:load`. The final report will show the `http_req_duration` (p95) metric typically below 20ms, largely surpassing the requirement.

### 6. Delete Time-Series
- **Feedback:** User should be able to delete sent data.
- **Implementation:** Endpoint `DELETE /time-series?sensorId=...` implemented.
- **Verification:** Can be tested via Swagger or direct API calls.

### 7. Load Balancer (Bonus)
- **Feedback:** Add Load Balancer.
- **Implementation:** Full Docker environment with Nginx acting as a Load Balancer distributing traffic to 3 API replicas.
- **Verification:** Run `docker-compose -f docker-compose.full.yml up` and access the application. Nginx manages traffic on port 3000.

---

## Assumptions (Resolved Ambiguities)

This section documents the technical decisions made to resolve ambiguities or open requirements of the challenge.

1.  **Simplified Authentication**:
    *   **Decision:** Use of fixed credentials in seed (`admin@dynamox.com`) and JWT authentication.
    *   **Why:** The challenge focus is on architecture and data flow, not a complex user management system (registration, password recovery, etc.). This simplifies setup for evaluation.

2.  **Sensor Mapping (HF+)**:
    *   **Decision:** The "HF+" model is stored internally in the database/enum as "HFPlus".
    *   **Why:** Many systems and ORMs have restrictions with special characters in enums or identifiers. The frontend handles the visual conversion back to "HF+".

3.  **Business Rule Validation (Pump vs TcAg/TcAs)**:
    *   **Decision:** Validation occurs in both Frontend (UX) and Backend (Security/Integrity).
    *   **Why:** Blocking in the frontend improves user experience, but backend validation is mandatory to ensure data integrity if the API is accessed directly.

4.  **Time-Series Storage**:
    *   **Decision:** Relational table with composite index `(sensorId, timestamp)`.
    *   **Why:** For the expected data volume in a test, PostgreSQL handles it perfectly well. The composite index optimizes the most common queries: "fetch the latest data *for this* sensor".

5.  **Pagination Strategy**:
    *   **Decision:** Server-Side Pagination (skip/take).
    *   **Why:** Although frontend pagination was feasible for little data, server-side pagination is the only scalable solution for when the number of monitoring points grows.

6.  **Prediction Algorithm**:
    *   **Decision:** Simple Linear Regression based on the last 50 points.
    *   **Why:** It is a deterministic, lightweight, and fast-to-implement approach without needing heavy ML libraries (like TensorFlow/Python), meeting the requirement to "predict the next value" within the requested Node.js ecosystem.

## Test Credentials

- Email: `admin@dynamox.com`
- Password: `admin123`
