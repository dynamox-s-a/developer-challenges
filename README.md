# Dynamox Full-Stack Challenge

Machine and sensor monitoring system developed with React, Fastify, and PostgreSQL.

This project uses **Nx** as a monorepo tool to manage both the Frontend (`apps/web`) and Backend (`apps/api`).

---

## 7-Day Plan (Development Log)

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

Before starting, ensure you have the following installed:

- **Node.js**: Version 18 or higher.
- **Docker & Docker Compose**: Essential for running the database and the full production simulation.
- **Git**: To clone the repository.
- **npm**: (Usually comes with Node.js).
- **k6** (Optional): Only if you want to run load tests manually outside of Docker.

## Step-by-Step Setup

Follow these steps to get the application running in **Development Mode**.

### 1. Environment Configuration

First, create the `.env` file from the example.

```bash
cp .env.example .env
```

**CRITICAL STEP:** Open the `.env` file and configure it as follows:

*   **JWT_SECRET**: Set this to any secure string.
    *   *Example:* `JWT_SECRET="my-super-secure-secret-key-123"`
*   **DATABASE_URL**:
    *   **Option A (Recommended - Docker DB):** If you will use `npm run db:up` to start the database via Docker, set the port to **5433**.
        *   `postgresql://dynamox:dynamox123@localhost:5433/dynamox?schema=public`
    *   **Option B (Local Postgres):** If you already have Postgres running locally on port 5432, keep the default port and update the username/password.

### 2. Install Dependencies

This command installs all dependencies for both Frontend and Backend (Nx handles the workspace).

```bash
npm install
```

### 3. Start Database

This command spins up a PostgreSQL container on port **5433** (to avoid conflicts with local Postgres instances).

```bash
npm run db:up
```

> *Tip: If you see an error about port conflict, ensure nothing is running on port 5433.*

### 4. Database Setup (Migrations & Seed)

This step creates the tables and populates the database with the initial **Admin User**.

```bash
# Generate Prisma Client types
npm run db:generate

# Run migrations to create tables
npm run db:migrate

# Seed the database with the admin user
npx prisma db seed
```

### 5. Run Application

This starts both the Frontend (Vite) and Backend (Fastify) in watch mode.

```bash
npm run dev
```

**Access the Application:**
- **Frontend:** [http://localhost:4200](http://localhost:4200)
- **Backend API:** [http://localhost:3000](http://localhost:3000)

---

## Full Docker Setup (Bonus: Deploy & Load Balancer)

This mode simulates a **Real Production Environment**. It spins up:
1.  **PostgreSQL** Database.
2.  **3 Replicas** of the API (Backend).
3.  **Nginx Load Balancer** (distributing traffic among the 3 APIs).
4.  **Nginx Web Server** (serving the Frontend static build).

**How to Run:**

```bash
# Stop any running dev containers first
npm run db:down

# Start the full environment
docker-compose -f docker-compose.full.yml up --build
```

> **Note for Linux Users:** You might need to use `docker compose` (with a space) instead of `docker-compose`.

**Access:**
- **Application:** [http://localhost:4200](http://localhost:4200) (Served by Nginx)
- **API:** [http://localhost:3000](http://localhost:3000) (Load Balanced)

---

## Load Tests (Bonus)

We use **k6** to verify the performance requirement (Latency < 350ms).

**How to Run:**
With the application running (either Dev or Docker mode):

```bash
# Run using the k6 Docker image (no installation required)
npm run test:load
```

**Expected Output:**
Look for the `http_req_duration` metric. The `p(95)` value should be significantly lower than 350ms (typically around 10-20ms).

---

## Reviewer Feedback & Implementation Details

This section details exactly how each point of the review feedback was addressed and how you can verify it.

### 1. Authentication & Configuration
- **Feedback:** Missing info on which user to use and `.env` config.
- **Implementation:** Added explicit instructions in the [Setup](#step-by-step-setup) section and the [Test Credentials](#test-credentials) section below.
- **Verification:** Use the credentials below to log in.

### 2. Pagination (Monitoring Points)
- **Feedback:** Unable to reduce items per page.
- **Implementation:** Updated the table component to support page sizes of `[2, 5, 10, 25]`.
- **Verification:** Go to "Monitoring Points", scroll to the bottom of the table, and change "Rows per page".

### 3. Sensor Restrictions (Pump Machines)
- **Feedback:** Prevent TcAg/TcAs on Pump machines.
- **Implementation:**
  - **Frontend:** Dropdown automatically disables invalid options for Pump machines.
  - **Backend:** API throws `400 Bad Request` if you try to bypass the UI.
- **Verification:** Create a Machine with type "Pump", then try to add a Sensor. Only "HF+" will be available.

### 4. Unit Tests
- **Feedback:** "Not all tests are implemented".
- **Implementation:** Added unit tests for Services (Backend) and Redux Slices (Frontend).
- **Verification:** Run `npm run test` to see all tests passing.

### 5. Latency & Performance
- **Feedback:** Missing evidence of < 350ms latency.
- **Implementation:** Added `load-test.js` and a script to run it.
- **Verification:** Run `npm run test:load` and check the report.

### 6. Delete Time-Series
- **Feedback:** User wants to delete sent data.
- **Implementation:** Added `DELETE /time-series` endpoint.
- **Verification:** This can be tested via API calls or Swagger.

### 7. Load Balancer (Bonus)
- **Feedback:** Add Load Balancer.
- **Implementation:** Implemented via Nginx in `docker-compose.full.yml`.
- **Verification:** Run the "Full Docker Setup" and observe the logs; requests will be distributed across `api-1`, `api-2`, and `api-3`.

---

## Assumptions (Resolved Ambiguities)

1.  **Simplified Authentication**: Used fixed seed credentials (`admin@dynamox.com`) and standard JWT for simplicity.
2.  **Sensor Mapping**: "HF+" is stored as "HFPlus" in the DB to avoid special character issues in Enums.
3.  **Validation**: Business rules (Pump vs TcAg) are enforced on both Frontend (UX) and Backend (Security).
4.  **Time-Series Storage**: Relational table with composite index `(sensorId, timestamp)` for efficient querying.
5.  **Pagination**: Server-side pagination was chosen to ensure scalability.
6.  **Prediction**: Used Simple Linear Regression (last 50 points) as a lightweight, deterministic solution for the "predict next value" requirement.

## Test Credentials

Use these credentials to log in to the application:

- **Email:** `admin@dynamox.com`
- **Password:** `admin123`

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Runs Frontend + Backend (Watch Mode) |
| `npm run build` | Builds both apps for production |
| `npm run test` | Runs all unit tests |
| `npm run test:load` | Runs k6 load tests via Docker |
| `npm run lint` | Runs linting checks |
| `npm run db:up` | Starts DB container |
| `npm run db:migrate` | Runs DB migrations |
| `npm run db:seed` | Seeds DB with admin user |
