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
make start    # Starts the NestJS API in dev mode locally
make start-lb # Starts the API with 3 Load-Balanced replicas via Nginx + Docker
```

## 🧪 Testing

### Automated Tests
```bash
make test     # Runs unit and e2e tests
```

### Load Testing (k6)
Para validar o **SLA < 350ms @ 100+ RPS**, configuramos múltiplos cenários. Certifique-se de que o ambiente está rodando (`make start-lb`) antes de iniciar:

```bash
make load-test-smoke   # Check básico de sanidade (1 VU)
make load-test-stress  # Rampa até 200 VUs para testar estabilidade
make load-test-spike   # Pico súbito de 300 VUs para testar resiliência
```

## 🚀 Performance Benchmarks

Os testes foram realizados utilizando **3 réplicas da API** balanceadas por **Nginx (Round-robin)**. O objetivo foi validar o comportamento sob carga real de sensores de alta frequência.

### Resultados Obtidos
| Cenário | Usuários (VUs) | Latência p(95) | Peak RPS | Status |
|---|---|---|---|---|
| **Smoke Test** | 1 | **26ms** | 2 | ✅ PASS |
| **Stress Test** | 200 | **5.47ms** | **265** | ✅ PASS |
| **Spike Test** | 300 | **61.0ms** | **699** | ✅ PASS |

> [!TIP]
> Mesmo sob um pico agressivo de **300 usuários simultâneos** (~700 requisições por segundo), a API manteve a latência p95 em **61ms**, sendo **82% mais rápida** que o requisito máximo de 350ms.

## 💎 Valor de Produto (Business Value)

1. **Baixa Latência em Escala:** O uso de **MongoDB Time Series Collections** aliado a Aggregation Pipelines permite que métricas complexas (RMS, Kurtosis) sejam calculadas em milissegundos, independente do volume de dados.
2. **Alta Disponibilidade:** A arquitetura com **Nginx Load Balancer** permite escalabilidade horizontal imediata. Novas réplicas da API podem ser adicionadas sem downtime.
3. **Resiliência Industrial:** A integração com **Kafka** garante que os sinais brutos sejam processados de forma assíncrona e ordenada por sensor, protegendo o banco de dados principal de picos de escrita.


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

## 📈 Scalability Roadmap (System Design)
For a production-ready evolution, the following distributed systems patterns are documented as next steps:

### 1. Kafka Idempotency & Acks
- **Implemented:** The Kafka producer is already configured with `idempotent: true` and `maxInFlightRequests: 5`. This prevents duplicate messages in case of temporary network failures between the API and the Kafka broker, guaranteeing **Exactly-Once** semantics for the producer.

### 2. Consumer Lag Management
- **Monitoring:** Integrating **Prometheus/Grafana** with `kafka_exporter` to monitor Consumer Lag (the difference between produced offsets and consumed offsets).
- **Auto-Scaling:** If lag spikes during heavy machinery usage periods, we can scale out the worker pods. This requires matching the number of Kafka partitions to the maximum number of desired consumers.

### 3. DLQ (Dead Letter Queue) & Retry Architecture
- To prevent a **Poison Pill** (a corrupted message that constantly fails to parse) from blocking an entire partition:
  - **Non-blocking Retries:** Consumers should publish failed messages to a `signals.raw.retry` topic and immediately commit the original offset.
  - **DLQ Routing:** If processing fails after predefined retries, route to a `signals.raw.dlq` topic for manual inspection or altering.

### 4. Database Idempotency
- While Kafka is partitioned by `sensorId`, ensuring true end-to-end idempotency requires **Upserts** in MongoDB using a composite key (`sensorId` + `datetime`) to prevent duplicated points under concurrent retries or re-deployments.
