# Time Series API

REST API built with Node.js, Express, TypeScript, and MongoDB to store time series data and retrieve metrics.

Challenge coverage:

- Store a raw time series
- Retrieve a full stored time series
- Retrieve metrics for a stored time series
- Delete a stored time series
- Retrieve the total number of stored time series
- Bonus: Kafka publishing on create/delete

## Stack

- Node.js 20
- TypeScript
- Express
- MongoDB + Mongoose
- Zod
- Jest + Supertest
- KafkaJS
- Docker Compose

## Project structure

- `src/routes`: routes
- `src/controllers`: HTTP handlers
- `src/services`: business logic and metrics calculation
- `src/repositories`: MongoDB access
- `src/models`: Mongoose models
- `src/schemas`: request validation
- `src/config`: env, database, and Kafka config
- `tests`: unit, integration, and load tests

## Architecture

The API follows a simple layered structure:

- routes define endpoints
- controllers handle HTTP input and responses
- services contain business logic
- repositories isolate database access
- schemas and middlewares centralize validation and error handling

## Environment variables

Use `.env.example` as reference:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/time-series-api
KAFKA_ENABLED=false
KAFKA_CLIENT_ID=time-series-api
KAFKA_BROKERS=localhost:9092
KAFKA_TOPIC_TIME_SERIES_CREATED=time-series.created
KAFKA_TOPIC_TIME_SERIES_DELETED=time-series.deleted
```

## Run locally

Requirements:

- Node.js 20+
- npm
- MongoDB running locally

Commands:

```bash
npm ci
npm run dev
```

App URL:

```text
http://localhost:3000
```

## Run with Docker / Makefile

Start everything:

```bash
make up
```

Useful commands:

```bash
make logs
make logs-api
make ps
make restart
make down
```

This starts MongoDB, Kafka, topic bootstrap, and the API. Kafka topics are created automatically during startup.

## Tests

```bash
npm test
make test-docker
```

Optional:

```bash
npm run test:unit
npm run test:integration
```

## API

### `POST /time-series`

Request:

```json
{
  "name": "sensor-a",
  "samples": [
    { "timestamp": "2026-04-11T10:00:00.000Z", "value": 10 },
    { "timestamp": "2026-04-11T10:00:01.000Z", "value": 20 }
  ]
}
```

Response `201`:

```json
{
  "id": "68001e5a1234567890abcdef",
  "name": "sensor-a",
  "samples": [
    { "timestamp": "2026-04-11T10:00:00.000Z", "value": 10 },
    { "timestamp": "2026-04-11T10:00:01.000Z", "value": 20 }
  ],
  "createdAt": "2026-04-13T18:00:00.000Z",
  "updatedAt": "2026-04-13T18:00:00.000Z"
}
```

### `GET /time-series/:id`

Returns the stored time series.

### `GET /time-series/:id/metrics`

Response `200`:

```json
{
  "count": 2,
  "min": 10,
  "max": 20,
  "average": 15,
  "sum": 30,
  "range": 10,
  "firstTimestamp": "2026-04-11T10:00:00.000Z",
  "lastTimestamp": "2026-04-11T10:00:01.000Z"
}
```

### `GET /time-series/count`

Response:

```json
{
  "count": 1
}
```

### `DELETE /time-series/:id`

Response `204`.

### `GET /health`

Response:

```json
{
  "status": "ok",
  "service": "time-series-api"
}
```

## Validation and errors

- `samples` must contain at least one item
- timestamps must be valid UTC ISO strings
- future timestamps are rejected
- invalid input returns `400`
- missing records return `404`

Example `400`:

```json
{
  "message": "Invalid request data"
}
```

## Kafka

When `KAFKA_ENABLED=true`, create and delete operations publish events to:

- `time-series.created`
- `time-series.deleted`

Example event:

```json
{
  "eventType": "time-series.created",
  "timeSeriesId": "68001e5a1234567890abcdef",
  "name": "sensor-a",
  "sampleCount": 2,
  "createdAt": "2026-04-13T18:00:00.000Z"
}
```

## Performance results

Performance tests were executed on April 13, 2026 with:

- MongoDB running in Docker
- API running locally with `npm run dev`
- load scripts executed locally with the commands below

Commands used:

```bash
npm run test:performance:count
npm run test:performance:get-by-id
npm run test:performance:metrics
```

| Endpoint | Average latency | Min latency | Max latency | Avg req/sec | Errors | Result |
|---|---:|---:|---:|---:|---:|---|
| `GET /time-series/count` | `38.52 ms` | `18.00 ms` | `207.00 ms` | `769.60` | `0` | Below `350 ms` |
| `GET /time-series/:id` | `53.43 ms` | `26.00 ms` | `163.00 ms` | `370.67` | `0` | Below `350 ms` |
| `GET /time-series/:id/metrics` | `33.77 ms` | `16.00 ms` | `138.00 ms` | `585.07` | `0` | Below `350 ms` |

Notes:

- All measured scenarios stayed below `350 ms`, including the worst observed latency in these runs.
- No errors or timeouts were observed during these runs.
- Running the API directly on the host produced lower latency than the earlier full-Docker setup, which is expected due to lower container overhead.
