# Timeseries API

A simple REST API to store and query time series data.  
The API allows users to create time series, insert points, retrieve stored data, compute metrics, and delete series.

---

## Features

The API implements the following operations:

- Create a time series identified by a label
- Insert points into a time series (batch insertion)
- Retrieve stored time series points
- Retrieve metrics about a time series
- Count stored time series
- Delete a time series

---

## Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy (async)
- Alembic (database migrations)
- Pytest (testing)
- Docker / Docker Compose

---

## Running the Application

#### Requirements

- Docker
- Docker Compose

#### Start the services

Generate the `.env` file from `.env.example`

```bash
cp .env.example .env
```

Start the containers

```bash
docker compose up --build -d
```

This will start:
- PostgreSQL database
- API container

The API will be available at:

```
http://localhost:8000
```

Interactive documentation is available at:

```
http://localhost:8000/docs
```

Using the Swagger interface, create a time series first. The returned `id` can then be used in the other endpoints.

### Running Tests

The project includes automated tests using pytest. Tests run against a separate test database container.

Run tests with:

```bash
make test
```

---
### Database Migrations

Database schema changes are managed using Alembic.

When the API container starts, the entrypoint script automatically runs `alembic upgrade head`.

---
### Populate the Database and Test Requests

#### Example Workflow

A typical interaction with the API follows these steps:

1. Create a timeseries
2. Generate points
3. Insert points
4. Query the series

Create a time series:

```bash
curl -X POST http://localhost:8000/timeseries/ \
  -H "Content-Type: application/json" \
  -d '{"label":"timeseries-label"}' \
  -w "\nStatus: %{http_code}\nTotal: %{time_total}s\n"
```

The `-w` flag prints the total request time, which can be used to observe request latency.

Generate the desired number of points

```bash
python3 scripts/generate_points.py --points 5000
```

This will create a file named `points.json.

In the next requests, replace \<id> with the created timeseries id.

Insert the generated points:

```bash
curl -s \
  -X POST http://localhost:8000/timeseries/<id>/points \
  -H "Content-Type: application/json" \
  --data @points.json \
  -w "\nStatus: %{http_code}\nTotal: %{time_total}s\n"
```

Retrieve the stored points (the command below discards the response body to focus only on request latency):

```bash
curl -s -o /dev/null -w "Status: %{http_code}\nTotal: %{time_total}s\n" \
"http://localhost:8000/timeseries/<id>?limit=5000"
```

Retrieve metrics for a time series:

```bash
curl -s "http://localhost:8000/timeseries/<id>/metrics" -w "\nStatus: %{http_code}\nTotal: %{time_total}s\n"
```
---
## Performance Observations

Local tests were executed to observe the response time of the main operations.

In general, requests remain below 350 ms under moderate workloads.

### Points insertion

For batch insertion, requests remain below 350 ms when inserting up to approximately 6,000 points in a single request.  
As the number of points increases, the request time grows proportionally due to the larger payload and database work required.

### Time series retrieval

When retrieving a full time series with its points, responses remain below 350 ms for up to approximately 30,000 points returned in a single request (around 1.6 MB of response data).

As expected, increasing the number of returned points also increases the request latency due to larger data transfer and serialization overhead.

---

## API Structure

The project follows a modular structure:

```
app/
├── api/            # FastAPI routes
├── core/           # configuration and constants
├── db/             # database session and base
├── models/         # SQLAlchemy models
├── schemas/        # Pydantic schemas
└── main.py         # application entrypoint
```

### Main Components

#### Models

SQLAlchemy models represent the database structure:

- `TimeSeries`
- `TimeSeriesPoint`

A time series can contain multiple points.

#### Schemas

Pydantic schemas are used for request validation and response serialization. Examples:

- `TimeSeriesCreate`
- `TimeSeriesPointCreate`
- `TimeSeriesMetricsResponse`

#### Routes

All endpoints are implemented in:

```
app/api/timeseries.py
```

---

## Data Model

Two main tables are used.

**TimeSeries**

```
id (UUID)
label (string)
created_at (timestamp)
```

**TimeSeriesPoint**

```
id (int)
timeseries_id (UUID)
timestamp (timestamp)
value (float)
```

A unique constraint ensures that a timestamp cannot be duplicated within the same time series.

---

## API Design Notes

Some design choices implemented in the API:

- **Chunked batch insertion** to avoid database parameter limits when inserting large numbers of points, the API splits insertions into chunks before executing them. This allows large batches to be inserted safely.
- **Cursor-based pagination** (`after_ts`) for efficient traversal of large time series.
- **Time window queries** (`from_ts`, `to_ts`) for retrieving specific data ranges.
- **Database-level constraints** to prevent duplicate timestamps within a time series.

<!-- ### Batch Insertion

Points are inserted in batches. To avoid database parameter limits and very large SQL statements, the API splits insertions into chunks before executing them. This allows large batches to be inserted safely.

--- -->
---

## Retrieving Time Series

The endpoint supports different retrieval strategies.

### Time Window

Parameters: `from_ts`, `to_ts`

```
GET /timeseries/{id}?from_ts=...&to_ts=...
```

### Cursor Pagination

Parameters: `after_ts`, `limit`

```
GET /timeseries/{id}?after_ts=...&limit=1000
```

The response includes `next_after_ts` when more data is available.

---

## Metrics

The API computes the metrics directly in PostgreSQL. The metrics can also be computed based on values inside a specific time window (`from_ts`, `to_ts`):

- count
- min
- max
- average
- standard deviation
- p50 percentile
- p95 percentile
- start timestamp
- end timestamp

---

## Logging

A simple middleware logs basic request information:

```
METHOD PATH STATUS TIME
```

Example:

```
GET /timeseries/... -> 200 (0.021s)
```

Logs are visible in the API container output.
