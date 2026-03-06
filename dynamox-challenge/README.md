# Dynamox Signal Processing API

A performant REST API for storing and analysing time-series data, built for the [Dynamox Back-end Developer Challenge](https://github.com/dynamox-s-a/developer-challenges).

## Stack

| Layer | Technology |
|---|---|
| API framework | FastAPI + Uvicorn |
| Data validation | Pydantic v2 |
| Database | PostgreSQL 16 + TimescaleDB |
| ORM | SQLAlchemy 2 |
| Migrations | Alembic |
| Containerisation | Docker + Docker Compose |
| Testing | Pytest (against real PostgreSQL) |
| Code quality | Ruff + Black + pre-commit |

## Endpoints

| Method | Path | Description | Status |
|--------|------|-------------|--------|
| `POST` | `/api/v1/timeseries` | Store a raw data series | `201` |
| `GET` | `/api/v1/timeseries/count` | Number of stored series | `200` |
| `GET` | `/api/v1/timeseries/{id}` | Full series with pagination (`limit`, `offset`) | `200` |
| `GET` | `/api/v1/timeseries/{id}/metrics` | AVG, STDDEV, MIN, MAX, COUNT via SQL | `200` |
| `DELETE` | `/api/v1/timeseries/{id}` | Delete series and all data points (cascade) | `204` |
| `GET` | `/health` | Health check | `200` |

Interactive docs available at `http://localhost:8000/docs` when the API is running.

---

## Running with Docker (recommended)

The fastest way to get the full stack running:

```bash
# 1. Start both the database and the API
docker-compose up --build

# 2. In a separate terminal, run migrations
docker-compose exec api alembic upgrade head

# 3. Promote timeseries_data to a TimescaleDB hypertable
docker-compose exec api python scripts/init_db.py
```

API is now live at `http://localhost:8000`.

---

## Running locally (development)

### Prerequisites

- Python 3.13
- Docker Desktop (for the TimescaleDB container)

### Steps

```bash
# 1. Start only the database container
docker-compose up -d db

# 2. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install production dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env.development
# Edit .env.development if needed (defaults match the Docker DB)

# 5. Run database migrations
alembic upgrade head

# 6. Promote timeseries_data to a TimescaleDB hypertable
python scripts/init_db.py

# 7. Start the API with hot-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API: `http://localhost:8000`
Docs: `http://localhost:8000/docs`

---

## Running tests

Tests connect to a dedicated `dynamox_timeseries_test` database inside the same Docker container. The database is created automatically.

```bash
# Make sure the DB container is running first
docker-compose up -d db

# Install dev dependencies
pip install -r requirements-dev.txt

# Run the full test suite
pytest tests/ -v
```

Expected output: **23 passed** against real PostgreSQL/TimescaleDB.

---

## Project structure

```
dynamox-challenge/
├── app/
│   ├── api/
│   │   ├── dependencies.py       # FastAPI DB session dependency
│   │   ├── exceptions.py         # Centralised exception hierarchy
│   │   └── v1/
│   │       └── timeseries.py     # Route handlers
│   ├── models/
│   │   └── timeseries.py         # SQLAlchemy ORM models (UUID, JSONB, hypertable)
│   ├── repositories/
│   │   └── timeseries_repository.py  # All SQL queries, bulk insert, SQL aggregation
│   ├── schemas/
│   │   ├── timeseries.py         # Pydantic request/response schemas
│   │   └── errors.py             # Standardised error response schema
│   ├── services/
│   │   └── timeseries_service.py # Business logic, size limits, orchestration
│   ├── utils/
│   │   └── metrics.py            # SQL result → metrics dict formatter
│   ├── config.py                 # pydantic-settings environment config
│   ├── database.py               # SQLAlchemy engine + session factory
│   └── main.py                   # FastAPI app, middleware, exception handlers
├── migrations/                   # Alembic migration versions
├── scripts/
│   └── init_db.py                # TimescaleDB hypertable + index setup
├── tests/
│   ├── conftest.py               # PostgreSQL test DB setup, fixtures
│   ├── fixtures/
│   │   └── sample_data.py        # Reusable test payloads and helpers
│   └── test_timeseries.py        # 23 integration + unit tests
├── .env.example                  # Environment variable template
├── docker-compose.yml            # API + TimescaleDB services
├── Dockerfile                    # Python 3.13 slim image
├── pyproject.toml                # Ruff + Black configuration
├── pytest.ini                    # Pytest configuration
└── requirements.txt              # Production dependencies
```

---

## Architecture decisions

**Two-table schema over a JSON blob** — `timeseries` holds the header (metadata, denormalised counters) and `timeseries_data` holds individual readings with a composite primary key `(timeseries_id, timestamp)`. This allows SQL aggregation and indexing per data point, which a JSON column cannot support.

**SQL-level aggregation** — `AVG`, `STDDEV`, `MIN`, `MAX`, `COUNT` are computed in a single SQL query inside the repository rather than loading all rows into Python. This keeps memory usage constant regardless of series size.

**TimescaleDB hypertable** — `timeseries_data` is promoted to a hypertable partitioned by `timestamp`, enabling chunk-based time-range queries and efficient ingestion at scale.

**Layered architecture** — `Router → Service → Repository → Model`. Each layer has a single responsibility. The router handles HTTP, the service enforces business rules (1M point limit, existence checks), the repository owns all SQL.

**Real PostgreSQL in tests** — tests connect to a dedicated `dynamox_timeseries_test` database so JSONB, UUID, `stddev()` and cascade deletes are tested exactly as they behave in production.
