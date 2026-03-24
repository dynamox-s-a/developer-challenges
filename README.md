# timeseries-api

REST API for storing and analysing time series data. Built with FastAPI + SQLAlchemy (async).

## Stack

- **FastAPI** — HTTP layer
- **SQLAlchemy 2 (async)** + **aiosqlite** — persistence (swap to postgres by changing `DATABASE_URL`)
- **NumPy / statsmodels** — metrics and forecasting
- **pytest + pytest-asyncio** — tests
- **Locust** — load tests
- **Nginx** — load balancer (docker setup)

## Getting started

```bash
python3 -m venv .venv
source .venv/bin/activate       # windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

Swagger at http://localhost:8000/docs

## Running with docker (nginx + 3 workers)

```bash
docker-compose up --build -d
# api available at http://localhost:80
```

## Tests

```bash
pytest                          # all
pytest tests/unit/              # unit only
pytest tests/integration/       # integration only
```

## Load tests

```bash
# interactive (opens browser UI at :8089)
locust -f load_tests/locustfile.py --host=http://localhost:80

# headless
locust -f load_tests/locustfile.py --host=http://localhost:80 \
  --headless -u 100 -r 10 --run-time 60s --html load_tests/report.html
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/timeseries/` | store a new series |
| GET | `/api/v1/timeseries/` | list (paginated) |
| GET | `/api/v1/timeseries/count` | how many series you have |
| GET | `/api/v1/timeseries/{id}` | full series + data points |
| GET | `/api/v1/timeseries/{id}/metrics` | stats (min/max/mean/rms/p95/p99...) |
| POST | `/api/v1/timeseries/{id}/predict` | forecast future values |
| DELETE | `/api/v1/timeseries/{id}` | delete a series |
| GET | `/health` | health check |

### Prediction methods

`POST /api/v1/timeseries/{id}/predict`

```json
{ "steps": 10, "method": "auto" }
```

- `linear` — OLS regression, good for steady trends
- `holt_winters` — double exponential smoothing, handles trend changes better
- `auto` — trains both on 80% of data, picks lower RMSE on the remaining 20%

Returns predictions + 95% confidence interval bounds.
