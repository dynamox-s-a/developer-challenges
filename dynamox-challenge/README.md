# Dynamox Signal Processing API

Time-series REST API for the Dynamox Back-end Developer Challenge. Store raw series, retrieve metrics, delete series, and get count.

## Structure

- `app/` – FastAPI app, config, DB, API routes, services, repositories, models, schemas, utils
- `tests/` – Pytest tests and fixtures
- `scripts/` – DB init script
- `migrations/` – Alembic versions (optional)

## Setup

1. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and adjust if needed.

4. Create DB tables (optional; app creates them on startup in dev):

   ```bash
   python scripts/init_db.py
   ```

## Run

```bash
uvicorn app.main:app --reload
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

## Test

```bash
pytest
# with coverage:
pytest --cov=app
```

## Docker

```bash
docker compose up --build
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST   | `/api/v1/timeseries`       | Store a raw data series |
| GET    | `/api/v1/timeseries/count`  | Number of stored series |
| GET    | `/api/v1/timeseries/{id}`   | Get full series by id |
| GET    | `/api/v1/timeseries/{id}/metrics` | Get metrics (min, max, mean, sum, count) |
| DELETE | `/api/v1/timeseries/{id}`   | Delete a series |
