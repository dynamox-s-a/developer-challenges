# Back-end Challenge V2 Solution

Implementation of `back-end-challenge-v2.md` using Node.js, Express, MongoDB, and Jest.

## Overview

This API allows clients to:

- create a time series
- retrieve a full time series
- retrieve time series metrics
- delete a time series
- count how many time series are stored

The public API contract is standardized in `snake_case`.

## Stack

- Node.js
- TypeScript
- Express
- MongoDB with Mongoose
- Zod for validation
- Jest + Supertest for tests
- Docker for local MongoDB

## Prerequisites

Make sure the following tools are installed on your machine:

- `nvm` or another Node.js version manager
- Node.js
- npm
- Docker
- Docker Compose

This repository includes a [.nvmrc](.nvmrc) file. If you use `nvm`, run:

```bash
nvm use
```

If the required Node.js version is not installed yet, run:

```bash
nvm install
nvm use
```

## Implemented User Stories

- store a raw time series
- retrieve a full time series
- retrieve metrics for a time series
- delete a time series
- retrieve the total number of stored time series

## Endpoints

### `POST /api/series`

Creates a new time series.

Example payload:

```json
{
  "series_id": "S1",
  "unit": "C",
  "points": [
    {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "value": 10
    }
  ]
}
```

Example response:

```json
{
  "series_id": "S1",
  "created_at": "2026-04-04T16:16:11.845Z"
}
```

### `GET /api/series/:series_id`

Returns the full time series.

### `GET /api/series/:series_id/metrics`

Returns metrics for the time series.

Example response:

```json
{
  "series_id": "S1",
  "unit": "C",
  "total_points": 3,
  "min_value": 10,
  "max_value": 30,
  "average_value": 20,
  "first_timestamp": "2024-01-01T00:00:00.000Z",
  "last_timestamp": "2024-01-03T00:00:00.000Z"
}
```

### `DELETE /api/series/:series_id`

Deletes a time series.

Expected response:

- `204 No Content`

### `GET /api/series/count`

Returns the total number of stored time series.

Example response:

```json
{
  "total_series": 5
}
```

### `GET /health`

Returns the basic application and MongoDB connection status.

## Validation Rules

- `series_id` must be a non-empty string
- `unit` must be a non-empty string
- `points` must contain at least one item
- `points` must contain at most `2000` items
- `timestamp` must use ISO 8601 format
- timestamps must be unique within the same time series
- `series_id` must be unique per series
- JSON request payloads above `512kb` are rejected with `413 Payload Too Large`

Notes:

- series uniqueness is enforced by `seriesId`

## How to Run

### 1. Install the correct Node.js version

If you use `nvm`:

```bash
nvm install
nvm use
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Copy `.env.example` to `.env` and adjust values if needed.

Available variables:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=dynamox
PORT=3000
```

### 4. Start MongoDB

```bash
npm run db:start
```

### 5. Start the application in development mode

```bash
npm run dev
```

By default, the API will be available at:

```text
http://localhost:3000
```

### 6. Build and start the application

Compile the project:

```bash
npm run build
```

Start the compiled server:

```bash
npm start
```

## Running Tests

```bash
npm test
```

Or in watch mode:

```bash
npm run test:watch
```

## Project Structure

```text
src/
  config/
  controllers/
  dto/
  errors/
  middlewares/
  models/
  routes/
  services/
```

## Implementation Decisions

- the HTTP contract uses `snake_case`
- the internal domain and model representation use `camelCase`
- response serialization is handled in the DTO layer
- `seriesId` has a unique index in MongoDB
- metrics are calculated in memory after retrieving the full series
- request size and number of points are bounded to keep ingestion latency under control

## Test Coverage

- invalid payload validation
- duplicate timestamp validation within the same time series
- maximum points validation for time series creation
- time series creation
- time series count
- full time series retrieval by `series_id`
- time series metrics retrieval
- time series deletion
- `400`, `404`, and `413` scenarios
- service tests and HTTP tests with Supertest
