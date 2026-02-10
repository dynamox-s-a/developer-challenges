# Backend Service - Local OS Execution Guide

This document provides technical instructions for running the Backend service directly on your machine. The Backend is a Flask API that tracks successful requests and exposes metrics for the Extractor service.

## Prerequisites

Before starting, ensure you have the following installed:

- **Runtime**: Python 3.9+
- **Package Manager**: pip
- **Port Availability**: Port 5000 must be available on your machine

## Local Setup & Installation

### 1. Navigate to the Directory

```bash
cd path/to/your/project/backend-deployment/src
```

### 2. Set Up a Virtual Environment

**PowerShell (Windows):**
```powershell
# Create the environment
python -m venv venv

# Activate on Windows (PowerShell)
.\venv\Scripts\Activate.ps1
```

**Bash (Linux/macOS):**
```bash
# Create the environment
python -m venv venv

# Activate on Linux/macOS
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configuration

The Backend service runs on `localhost:5000` by default. No additional configuration is required for local development.

| Variable | Description | Local Value |
|----------|-------------|------------|
| `FLASK_ENV` | Execution environment | `development` |
| `FLASK_APP` | Application entry point | `backend.py` |
| `FLASK_DEBUG` | Debug mode | `1` (optional) |

**Setting environment variables in PowerShell (optional):**
```powershell
$env:FLASK_ENV = "development"
$env:FLASK_DEBUG = "1"
```

## Running the Backend

Execute the Flask application:

```bash
python backend.py
```

You should see output similar to:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

## API Endpoints

### 1. Home Endpoint (`GET /`)

Increments the successful request counter.

**Request:**
```bash
curl http://localhost:5000/
```

**Response:**
```
Request successful!
```

**Status Code:** `200 OK`

### 2. Metrics Endpoint (`GET /metrics`)

Returns the current count of successful requests. This endpoint is used by the Extractor service.

**Request:**
```bash
curl http://localhost:5000/metrics
```

**Response:**
```json
{
  "successful_requests": 5
}
```

**Status Code:** `200 OK`

### 3. Health Check Endpoint (`GET /health`)

Health check endpoint for Kubernetes liveness/readiness probes.

**Request:**
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "healthy"
}
```

**Status Code:** `200 OK`

### 4. Not Found (404)

Any undefined endpoint returns a 404 error.

**Request:**
```bash
curl http://localhost:5000/undefined
```

**Response:**
```json
{
  "error": "Endpoint not found"
}
```

**Status Code:** `404 Not Found`

## Verifying Success

To confirm the Backend is working correctly:

1. **Make a request to the home endpoint:**
   ```bash
   curl http://localhost:5000/
   ```
   Expected response: `Request successful!`

2. **Check the metrics:**
   ```bash
   curl http://localhost:5000/metrics
   ```
   Expected response: `{"successful_requests": 1}`

3. **Verify health status:**
   ```bash
   curl http://localhost:5000/health
   ```
   Expected response: `{"status": "healthy"}`

4. **Check the console logs:**
   You should see structured logs with timestamps and log levels (INFO, ERROR, WARNING).

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 5000 already in use** | Kill the process using port 5000 or specify a different port by modifying `backend.py` |
| **Module not found error** | Ensure virtual environment is activated and `pip install -r requirements.txt` was executed |
| **Connection refused** | Verify the application is running and listening on `localhost:5000` |
| **Import errors** | Check Python version is 3.9+ and all dependencies are installed |

## Best Practices & Design Patterns

**Statefulness:**
The Backend maintains an in-memory counter for successful requests. This counter resets when the application restarts.

**Logging:**
All requests and errors are logged with timestamps and severity levels, making debugging easier and enabling integration with log aggregation systems.

**Error Handling:**
The application gracefully handles errors and returns appropriate HTTP status codes and error messages.

**Scalability Considerations:**
For production deployments with multiple replicas, consider implementing:
- Persistent storage (database) instead of in-memory counters
- Distributed state management
- Load balancer sticky sessions (if needed)

## Next Steps

- Deploy the Backend to Docker: See `../README.md`
- Deploy to Kubernetes: See `../../k8s/backend.yaml`
- Deploy to Google Cloud: See `../../infrastructure-as-code/production/`
