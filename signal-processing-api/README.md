# 🏭 Signal Processing API

[![Python](https://img.shields.io/badge/Python-3.13+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.12-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue.svg)](https://www.postgresql.org/)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](https://coverage.readthedocs.io/)
[![Tests](https://img.shields.io/badge/tests-38%20passed-success.svg)](https://pytest.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

RESTful API for time series processing in industrial mechanics signals monitoring. Developed as a solution for the Dynamox technical challenge.

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Technologies](#-technologies)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the API](#-running-the-api)
- [API Documentation](#-api-documentation)
- [Testing and Coverage](#-testing-and-coverage)
- [Project Structure](#-project-structure)
- [Technical Decisions](#-technical-decisions)
- [Future Improvements](#-future-improvements)
- [License](#-license)

## 🎯 About the Project

This API manages time series data for industrial vibration monitoring, enabling:

- **Machines**: Registration, listing, querying, and removal of machines
- **Signals**: Creation and management of signals associated with machines
- **Metrics**: Storage and querying of vibration metrics with pagination
- **Time Series**: Complete series retrieval with all data points

### 📊 Implemented Features

- ✅ Complete CRUD for machines, signals, and metrics
- ✅ Pagination in all listings
- ✅ Date and metric type filters
- ✅ Cascade relationships (machine deletion → signals → metrics)
- ✅ Automated tests with >85% coverage
- ✅ Latency validation <350ms for all requests
- ✅ Interactive documentation with Swagger UI

## 🛠️ Technologies

| Technology | Version | Purpose |
|------------|--------|---------|
| Python | 3.13+ | Main language |
| FastAPI | 0.115.12 | Web framework |
| SQLAlchemy | 2.0.40 | ORM and migrations |
| PostgreSQL | 16+ | Database |
| Pydantic | 2.11.3 | Data validation |
| Pytest | 8.3.5 | Automated testing |
| pytest-cov | 6.0.0 | Test coverage |
| Uvicorn | 0.34.0 | ASGI server |

## 📋 Prerequisites

- Python 3.13 or higher
- PostgreSQL 16 or higher
- Git
- pip (Python package manager)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/signal-processing-api.git
cd signal-processing-api
```

### 2. Create and activate virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure PostgreSQL
```bash
# Access PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE signal_processing;

# (Optional) Create a specific user
CREATE USER signal_user WITH PASSWORD 'signal_pass';
GRANT ALL PRIVILEGES ON DATABASE signal_processing TO signal_user;
```

## ⚙️ Configuration

### 1. Set up environment variables
Create a ```.env``` file in the project root:
```bash
# .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/signal_processing
# Or for a specific user:
# DATABASE_URL=postgresql://signal_user:signal_pass@localhost:5432/signal_processing
```

### 2. Check database connection
```bash
python -c "from app.core.database import engine; engine.connect(); print('✅ Connection OK!')"
```

## 🐳 Docker

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker Compose

#### 1. Configure environment variables
Create a `.env` file in the project root:

```env
# .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=signal_processing
POSTGRES_PORT=5432
API_PORT=8000
```

### 2. Start the containers
```bash
docker-compose up -d
```

This will:

- 🐘 Start a PostgreSQL container on port 5432
- 🚀 Start the FastAPI container on port 8000
- 🔗 Automatically connect the services

### 3. Verify it's working
```bash
# Check running containers
docker-compose ps

# View API logs
docker-compose logs -f api

# Access the database
docker-compose exec db psql -U postgres -d signal_processing
```

### 4. Stop the containers
```bash
docker-compose down
```

### Useful Docker Commands
```bash
# Rebuild images
docker-compose up -d --build

# View real-time logs
docker-compose logs -f

# Run commands in the API container
docker-compose exec api bash

# Run tests inside the container
docker-compose exec api pytest tests/ -v

# Clean everything (containers, volumes, images)
docker-compose down -v --rmi all
```

## Docker Files
### ```Dockerfile``` 
```dockerfile 
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### ```docker-compose.yml```
```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: signal_processing_db
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-signal_processing}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - signal_network

  api:
    build: .
    container_name: signal_processing_api
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - .:/app
    ports:
      - "${API_PORT:-8000}:8000"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-signal_processing}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - signal_network

volumes:
  postgres_data:

networks:
  signal_network:
    driver: bridge
```

## ▶️ Running the API
### Development (with hot-reload)
```bash
uvicorn app.main:app --reload --port 8000
```

### Production
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at: ```http://localhost:8000```

## 📚 API Documentation
Access the interactive documentation:

| **Tool** | **URL** | 
|:-------|:--------|
| Swagger UI   | http://localhost:8000/docs | 
| ReDoc    | http://localhost:8000/redoc | 

## Main Endpoints

### Machines ```(/machines)```
| **Method** | **Endpoint** | **Description** |
|:-------|:--------|:---------|
| POST   | `/machines` | Create a new machine |
| GET    | `/machines` | List machines (paginated) |
| GET    | `/machines/{id}` | Get machine by ID |
| DELETE | `/machines/{id}` | Delete machine and related data |
| GET    | `/machines/{id}/signals` | List machine signals |
| GET    | `/machines/{id}/signals/count` | Count machine signals |
| GET    | `/machines/{id}/metrics` | List machine metrics |

### Signals ```(/signals)```
| **Method** | **Endpoint** | **Description** |
|:-------|:--------|:---------|
| POST   | `/machines/{machine_id}/signals` | Create signal for a machine |
| GET    | `/signals/{id}` | Get signal by ID |
| GET    | `/signals/{id}/full` | Retrieve complete time series |
| DELETE | `/signals/{id}` | Delete signal and related metrics |

### Metrics  ```(/metrics)```
| **Method** | **Endpoint** | **Description** |
|:-------|:--------|:---------|
| POST   | `/signals/{signal_id}/metrics` | Create metric for a signal |
| GET    | `/signals/{signal_id}/metrics` | List signal metrics |
| GET    | `/metrics/{id}` | Get metric by ID |
| DELETE | `/metrics/{id}` | Delete metric |

## Request Examples
### Create a machine
```bash
curl -X POST "http://localhost:8000/machines" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hydraulic Press",
    "location": "Sector A - Line 3"
  }'
```

### Create a signal
```bash
curl -X POST "http://localhost:8000/machines/{machine_id}/signals" \
  -H "Content-Type: application/json" \
  -d '{
    "signal_type": "vibration",
    "value": 10.5,
    "timestamp": "2024-01-01T10:00:00Z"
  }'
```

### Create a metric
```bash
curl -X POST "http://localhost:8000/signals/{signal_id}/metrics" \
  -H "Content-Type: application/json" \
  -d '{
    "metric_type": "rms",
    "value": 3.14,
    "timestamp": "2024-01-01T10:00:00Z"
  }'
```

## 🧪 Testing and Coverage
### Test Coverage

| **Module** | **Coverage** | 
|:-------|:--------|
| app/core   | 66,5% | 
| app/enums    | 100% |
| app/main   | 83% | 
| app/models    | 100% |
| app/routers   | 98% | 
| app/schemas    | 100% |
| app/services   | 91% | 

## 🏃🏿‍♂️ Running Tests

### All tests
```bash
pytest tests/ -v
```

### Tests with coverage
```bash
pytest tests/ --cov=app --cov-report=term-missing --cov-report=html
```

The HTML report will be generated in ```htmlcov/index.html```

### Specific tests
```bash
# Only machines
pytest tests/test_machines/ -v

# Only latency
pytest tests/test_latency/ -v -m latency

# Single specific test
pytest tests/test_machines/test_machine_routes.py::test_create_machine -v
```

### Latency verification (<350ms)
```bash 
pytest tests/test_latency/ -v -m latency
```

## 📁 Project Structure
``` text
signal-processing-api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Application entry point
│   ├── core/
│   │   ├── __init__.py
│   │   ├── database.py         # Database configuration
│   │   └── dependencies.py     # FastAPI dependencies
│   ├── enums/
│   │   ├── __init__.py
│   │   ├── metric_type.py      # Metric type ENUMs
│   │   └── signal_type.py      # Signal type ENUMs
│   ├── models/
│   │   ├── __init__.py
│   │   ├── machine.py          # Machine model
│   │   ├── signal.py           # Signal model
│   │   └── metric.py           # Metric model
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── machine_routes.py   # Machine routes
│   │   ├── signal_routes.py    # Signal routes
│   │   └── metric_routes.py    # Metric routes
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── machine_schema.py   # Pydantic schemas for machines
│   │   ├── signal_schema.py    # Pydantic schemas for signals
│   │   ├── metric_schema.py    # Pydantic schemas for metrics
│   │   └── pagination.py       # Pagination schemas
│   └── services/
│       ├── __init__.py
│       ├── machine_service.py  # Machine business logic
│       ├── signal_service.py   # Signal business logic
│       ├── metric_service.py   # Metric business logic
│       └── pagination_service.py # Generic pagination service
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Shared fixtures
│   ├── test_latency/           # Performance tests
│   ├── test_machines/          # Machine tests
│   ├── test_metrics/           # Metric tests
│   └── test_signals/           # Signal tests
├── .env                         # Environment variables (not versioned)
├── .gitignore                   # Git ignored files
├── pytest.ini                   # pytest configuration
├── requirements.txt             # Project dependencies
└── README.md                    # This file
```

## 🎯 Technical Decisions
### Why FastAPI?
- **Performance**: High-performance async framework
- **Automatic documentation**: Built-in Swagger/OpenAPI generation
- **Validation**: Native Pydantic integration
- **Type safety**: Full type hints support

### Why SQLAlchemy?
- **Mature ORM**: Widely used and battle-tested
- **Migrations**: Alembic support for schema evolution
- **Flexibility**: Support for multiple databases
- **Relationships**: Excellent support for complex relations

### Why PostgreSQL?
- **Reliability**: Robust and mature relational database
- **Performance**: Excellent for complex queries
- **Data types**: UUID, JSON, array support
- **Indexes**: Composite indexes for optimization

### Pagination Strategy
- **Cursor-based**: Using ```limit/offset``` for simplicity
- **Metadata**: Returns ```has_next```, ```next_offset``` for navigation
- **Filters**: Support for date and type filters

## 🚀 Future Improvements
- **Redis Cache**: For frequent queries
- **JWT Authentication**: Access control
- **Websockets**: Real-time data streaming
- **Automatic migrations**: With Alembic
- **CI/CD**: Automated pipeline
- **Rate limiting**: Abuse protection
- **Prediction models**: Predictive data analysis








