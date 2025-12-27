# Signal Processing API

A REST API for ingesting, storing, and querying time series data with SQLite persistence and automated tests.
The project is designed to be easy to run, reproducible, and simple to evaluate, using Docker as the standard execution environment.

---

## Stack

- **FastAPI** – Web framework for defining API routes, data validation, and automatic OpenAPI/Swagger documentation
- **Uvicorn** – ASGI server responsible for running the FastAPI application
- **SQLAlchemy** – ORM and SQL toolkit for database access
- **SQLite** – File-based database for simplicity and portability
- **Pytest** – Automated testing framework

---

## Why FastAPI + Uvicorn instead of Flask?

FastAPI is built on the modern **ASGI** standard (asynchronous and more scalable), whereas Flask follows the traditional **WSGI** model; Uvicorn is the ASGI server that runs FastAPI and efficiently handles concurrent HTTP requests.

---

## Requirements

- Docker installed (Docker Desktop on Windows, Docker Engine on Linux/macOS)

---

## Running the API with Docker

### 1) Build the image

From the project root:

```bash
docker build -t signal-processing-api .
```

### 2) Run the container (with database persistence)

The SQLite database is stored at `/data/app.db` inside the container.
Mount a local volume to persist data between runs.

#### Windows (PowerShell)

```powershell
docker run --rm -p 8000:8000 `
  -v "${PWD}\data:/data" `
  --name signal-processing-api `
  signal-processing-api
```

#### Linux / macOS

```bash
docker run --rm -p 8000:8000 \
  -v "$(pwd)/data:/data" \
  --name signal-processing-api \
  signal-processing-api
```

---

## Accessing the API

- **Swagger UI (interactive documentation):**
  http://127.0.0.1:8000/docs

- **Health check:**
  http://127.0.0.1:8000/health

---

## Main Endpoints

### Health
`GET /health`

Response:
```json
{ "status": "ok" }
```

---

### Create a time series
`POST /timeseries`

Example body:
```json
{
  "name": "motor_1_vibration",
  "metadata": { "asset_id": "A-123", "unit": "mm/s" },
  "points": [
    { "timestamp": "2025-12-18T10:00:00Z", "value": 1.23 },
    { "timestamp": "2025-12-18T10:00:01Z", "value": 1.30 },
    { "timestamp": "2025-12-18T10:00:02Z", "value": 1.18 }
  ]
}
```

Response:
- HTTP **201**
- Returns a generated `id` (UUID) identifying the time series

Note:
- A configurable upper limit (`MAX_POINTS`) protects the API from excessively large payloads.

---

### Count stored time series
`GET /timeseries/count`

```json
{ "count": 1 }
```

---

### List time series (paginated, optional name filter)
`GET /timeseries?limit=50&offset=0&name=motor`

Returns:
- a list of time series
- aggregated `points_count` per series
- total number of matching series

---

### Retrieve time series data
`GET /timeseries/{id}`

Optional query parameters:
- `from` (ISO datetime)
- `to` (ISO datetime)
- `limit`
- `offset`

Notes:
- Data points are returned ordered by timestamp
- `points_count` represents the total number of points in the selected time window, not just the current page

---

### Aggregated metrics
`GET /timeseries/{id}/metrics`

Optional query parameters:
- `from`
- `to`

Returns:
- `count`, `min`, `max`, `mean`, `std`

Metrics are computed directly in the database using SQL aggregation, avoiding loading large datasets into memory.

---

### Delete a time series
`DELETE /timeseries/{id}`

- **204**: deleted successfully
- **404**: not found

All associated data points are removed automatically (cascade delete).

---

## Manual testing with Swagger

1. Open `/docs`
2. Execute `POST /timeseries`
3. Copy the returned `id`
4. Test:
   - `GET /timeseries/{id}`
   - `GET /timeseries/{id}/metrics`
   - `GET /timeseries`
   - `GET /timeseries/count`
   - `DELETE /timeseries/{id}`

---

## Environment variables

- `DATABASE_URL`
  Default inside the container: `sqlite:////data/app.db`

- `MAX_POINTS`
  Default: `200000`

Example override:

```bash
docker run --rm -p 8000:8000 \
  -e MAX_POINTS=50000 \
  -v "$(pwd)/data:/data" \
  signal-processing-api
```

---

## Running tests with Docker

Tests are executed inside the container using an isolated SQLite database.

```bash
docker run --rm -it \
  -e DATABASE_URL=sqlite:///./test.db \
  signal-processing-api pytest -q
```

Expected output:
```
1 passed
```

---

## Project structure

- `app/main.py` – application entry point, lifespan handling, health endpoint
- `app/api/` – API route definitions
- `app/services/` – business logic and database queries
- `app/models/` – SQLAlchemy ORM models
- `app/schemas/` – Pydantic request/response schemas
- `app/database/` – database engine, sessions, and ORM base
- `tests/` – automated tests with pytest
