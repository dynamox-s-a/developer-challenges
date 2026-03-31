# Signal Processing API — Dynamox Challenge

Senior-level implementation for the `back-end-challenge-v2.md`.

## 🏗 Architectural Decisions

### Clean Architecture & DDD
The project is structured following Domain-Driven Design principles within NestJS modules:
- **Domain Layer**: Pure logic, entities (`TimeSeries`), and Value Objects (`SensorName`, `Timestamp`). 
- **Application Layer**: Orchestrates use cases (US1-US5) and maps DTOs.
- **Infrastructure Layer**: Framework-specific adapters for **MongoDB Time Series Collections** and **Kafka**.

### Performance & Storage
- **MongoDB 6.0+ Time Series**: Used to take advantage of native columnar storage and the bucket pattern, reducing index size and optimizing I/O for sensor data.
- **Aggregation Pipeline**: Statistical metrics (RMS, Kurtosis, Skewness, Max) are computed using MongoDB's aggregation engine to ensure high performance and low latency.
- **Kafka Strategy**: Partitioning by `sensorId` as the key. This guarantees that all data for a specific sensor is processed in strict chronological order within a single partition.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+

### Setup & Run
Using the provided `Makefile`:

```bash
make setup    # Install deps and starts MongoDB/Kafka containers
make start    # Starts the NestJS API in dev mode
```

## 🧪 Testing

### Automated Tests
```bash
make test     # Runs unit and e2e tests
```

### Load Testing (k6)
To validate the **SLA of < 350ms @ 100 RPS**:
```bash
make load-test
```

## 📊 Domain Metrics Justification
- **RMS (Root Mean Square)**: Essential for vibratory analysis as it represents the overall energy of the signal.
- **Kurtosis**: A key indicator for detecting sudden impacts in mechanical components (like bearing faults).
- **Skewness**: Used to detect signal asymmetry, helping identify sensor clipping or directional bias.
- **Max**: Required by the challenge's JSON contract.

## 📁 Endpoints
- `POST /api/time-series`: Store raw data and publish to Kafka.
- `GET /api/time-series/count`: Total stored signals.
- `GET /api/time-series/:id`: Retrieve full series.
- `GET /api/time-series/:id/metrics`: Statistical analysis (Contract matches `response-challenge-v2.json`).
- `DELETE /api/time-series/:id`: Remove data.
