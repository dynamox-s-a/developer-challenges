# Sensor API (Kotlin + Spring Boot)

Local REST API for the Dynamox front-end challenge. It serves the same two endpoints as the `json-server` mock (`frontend/mock/db.json`), so it can replace it without touching the frontend.

## Run it

Requirements: JDK 25. Gradle compiles with a Java 25 toolchain and does not download one, so a JDK 25 must be installed.

```sh
cd backend
./gradlew bootRun        # API on http://localhost:3001
./gradlew test           # repository, controller and error-handling tests
```

Use either this API or `bun run api` from `frontend/`. Both listen on port 3001, so run only one.

## Use it with the frontend

```sh
cd backend && ./gradlew bootRun     # terminal 1: API on :3001
cd frontend && bun run dev          # terminal 2: app on :5173 (VITE_API_URL defaults to http://localhost:3001)
```

Open http://localhost:5173. The frontend's Cypress suite (`bun run e2e`, see `frontend/README.md`) also runs against this API.

## Endpoints

| Endpoint       | Returns |
| -------------- | ------- |
| `GET /machine` | `{ name, point, sampleRate, range, interval }` |
| `GET /series`  | 7 series of `{ datetime, max }` points |
| `GET /actuator/health` | liveness check |

Errors use RFC 9457 `application/problem+json` (404, 405, 406 and unexpected 500s). The 500 response never includes internal details.

## Configuration

| Property | Default | Meaning |
| -------- | ------- | ------- |
| `server.port` | `3001` | HTTP port |
| `app.cors.allowed-origins` | `http://localhost:5173,http://localhost:4173` | Origins allowed by CORS (GET only) |

## Data

The series come from `src/main/resources/data/db.json`, loaded once at startup. It is a copy of `frontend/mock/db.json`. To check they are in sync, run this from the repository root (the folder that contains both `frontend/` and `backend/`):

```sh
diff frontend/mock/db.json backend/src/main/resources/data/db.json
```

`datetime` values are passed through as strings, exactly as in the seed. `max` is serialized as a decimal number, so `0` in the seed is served as `0.0`. That is the same value in JSON and in JavaScript.

## Tests

`./gradlew test` covers:

- **Repository:** the seed loads, has the 7 series in order with identical timestamps, every `datetime` is a valid ISO instant, and an invalid seed fails at startup.
- **Controller:** both endpoints return the exact JSON shape the frontend expects. CORS allows the frontend origins and rejects other origins.
- **Error handling:** unknown routes (404), wrong methods (405) and unexpected failures (500) return `application/problem+json` and never include a stack trace.
- **Contract:** with the whole application running, both endpoints serve the seed file unchanged, with no dropped fields or points.

## Structure

```
src/main/kotlin/com/romulofer/backend/
  sensor/            models, repository interface and JSON implementation
  sensor/controller/ REST controller
  config/            CORS and error handling
```
