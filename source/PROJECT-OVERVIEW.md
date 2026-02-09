# 🏗️ Project Pre-Planning: Industrial Monitoring System

## Project Overview

* **Goals:** Develop a robust back-end with JWT authentication, an asynchronous messaging pipeline, and a real-time dashboard powered by simulated sensor data.
* **Target Audience:** Industrial facilities requiring real-time monitoring of critical equipment (Pumps and Fans).
* **Success Metrics:** System stability, high data integrity, target latency of **< 350ms**, and intuitive data visualization.

---

## I. Setup & Schema

### 1. Project Requirements Summary

#### A. Business Requirements

* **Domain Logic:** Management of industrial equipment categorized as `Pump` or `Fan`.
* **Operational Constraints:** * **Strict Prohibition:** `Pump` type machines cannot be associated with `TcAg` or `TcAs` sensors.
* **Redundancy:** Each machine must support a minimum of two monitoring points.


* **Performance Standards:** Maximum allowable latency of **350ms** for all API requests.
* **Transparency:** All architectural assumptions and ambiguity resolutions must be documented in the `README.md`.
* **Data Integrity:** Mandatory unique IDs for sensors and strict adherence to the model list: `TcAg`, `TcAs`, and `HF+`.

#### B. User Requirements

* **Access Control:** 
  * Authentication via fixed credentials (email/password).
  * Secure session termination (Logout) 
  * Full protection of private routes.


* **Asset Management:** 
  * Full CRUD functionality for Machines (Name/Type).
  * Define Monitoring Points and associate specific Sensors to them.


* **Data Interaction:**
  * Paginated list (5 items/page) of monitoring points with multi-column sorting.
  * Storage and deletion of raw time-series sensor data.
  * Retrieval of total telemetry counts and historical datasets.


* **Visualization:** 
  * Real-time visualization of sensor performance and historical metrics through charts/graphs.

#### C. System Requirements

* **Frontend (Next.js):** React, TypeScript, Material UI 5, Redux Thunks for state management and NextAuth for authentication.
* **Backend (NestJS):** 
  * **API Gateway:** Handles REST endpoints, Auth, and Machine CRUD.
  * **Worker:** Consumes RabbitMQ messages and manages time-series persistence.
* **Persistence:** PostgreSQL (via Prisma) for relational data; Redis for high-speed telemetry caching.
* **DevOps:** Nx Monorepo, automated unit tests, and Docker orchestration.

### 2. Data Modeling

* **Entities:** Users, Machines, Monitoring Points, Sensors, Telemetry.
* **Relationships:**
  * `User (1) <---> (N) Machines`
  * `Machine (1) <---> (N) Monitoring Points`
  * `Monitoring Point (1) <---> (1) Sensor`
  * `Sensor (1) <---> (N) Telemetry` (Time-series)



---

## II. Back-End Architecture

### 1. Service: `apps/api` (REST Gateway)

Handles user requests and relational data persistence. All routes except `/login` require JWT authentication.

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Authenticate with fixed credentials. | No |
| POST | `/api/auth/logout` | Terminate the current session. | Yes |
| GET | `/api/machines` | List all registered machines. | Yes |
| POST | `/api/machines` | Create a new machine (Pump/Fan). | Yes |
| PATCH | `/api/machines/:id` | Update machine name or type. | Yes |
| DELETE | `/api/machines/:id` | Remove a machine from the system. | Yes |
| GET | `/api/monitoring-points` | Paginated list (5 items) with sorting. | Yes |
| POST | `/api/sensors` | Associate a sensor with a monitoring point. | Yes |
| GET | `/api/telemetry/metrics` | Retrieve total count of telemetry records. | Yes |
| GET | `/api/telemetry/:id` | Fetch historical time-series data. | Yes |

### 2. Service: `apps/worker` (Data Ingestion)

An event-driven microservice consuming RabbitMQ messages. No public HTTP routes.

| Pattern / Topic | Protocol | Description |
| --- | --- | --- |
| `telemetry_data` | AMQP | Process raw sensor readings and save to DB/Cache. |
| `sensor_update` | AMQP | Synchronize sensor metadata for cache validation. |

### 3. Database Schemas

#### PostgreSQL (DBML Model)

```dbml
Enum machine_type { Pump; Fan }
Enum sensor_model { TcAg; TcAs; HF_Plus; }

Table users {
  id Int [pk, increment]
  email String [unique]
  password String
  created_at Timestamp
  updated_at Timestamp
}

Table machines {
  id Int [pk, increment]
  name String
  type machine_type
  created_at Timestamp
  updated_at Timestamp
}

Table monitoring_points {
  id Int [pk, increment]
  name String
  machine_id Int [ref: > machines.id]
}

Table sensors {
  id String [pk]
  model sensor_model
  monitoring_point_id Int [ref: - monitoring_points.id, unique]
}

Table telemetry {
  id BigInt [pk, increment]
  sensor_id String [ref: > sensors.id]
  value Float
  timestamp Timestamp [default: `now()`]
}

```

#### Redis (Real-Time Metrics)

* **Global Counter:** `telemetry:global:total_count` (String) — Fast retrieval of total records.
* **Latest State:** `telemetry:sensor:{id}:latest` (Hash) — Stores the most recent reading for the dashboard.
* **Buffer:** `telemetry:sensor:{id}:stream` (Stream) — Stores the last 1,000 points for real-time charting.
* **Validation Cache:** `cache:machine:{id}` (Hash) — Cached machine type for instant Worker validation.

---

## III. Front-End Specification

### 1. UI/UX Design

* **Tech Stack:** Next.js, Material UI 5.
* **Typography:** Inter (Body, Headings), IBM Plex Mono (Data/Metrics).
* **Color Palette:**
  * **Primary:** `#F2F2F2` (Light Grey)
  * **Secondary:** `#692746` (Deep Plum)
  * **Accent:** `#ECB340` (Industrial Amber)



### 2. Pages & Views

* **`/` (Root):** Auth guard; redirects to `/dashboard` if authenticated, otherwise to `/login`.
* **`/login`:** Public page for fixed-credential authentication.
* **`/dashboard`:** Real-time overview with metric cards (Total Telemetry, Machine Health).
* **`/machines`:** CRUD interface for asset management.
* **`/monitoring`:** Main control center with a paginated, sortable table (Machine, Type, Point, Sensor).
* **`/monitoring/:id`:** Detailed view for a specific point featuring Time-Series line charts.
* **`/analytics`:** Global performance metrics and **Future Prediction** bonus features.

---

## IV. Project Structure (Nx Monorepo)

```text
/ (monorepo root)
├── apps/
│   ├── api/                # NestJS: REST Gateway & Socket.io
│   ├── worker/             # NestJS: RabbitMQ Consumer (Ingestion)
│   ├── client/             # Next.js: React Dashboard
│   └── simulator/          # Node.js: Sensor Data Producer
├── libs/
│   ├── shared/
│   │   ├── persistence/    # Prisma Client & Redis instances
│   │   ├── types/          # Shared TS Interfaces
│   │   └── utils/          # Shared Business Logic (Validation)
├── docker/
│   └── docker-compose.yml  # Postgres, Redis, RabbitMQ orchestration
├── nx.json                 # Configuração do Workspace Nx
└── tsconfig.base.json

```