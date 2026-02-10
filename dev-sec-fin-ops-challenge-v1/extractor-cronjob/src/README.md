# Extractor Service - Local OS Execution Guide

This document provides technical instructions for running the Extractor service directly on your machine. The Extractor is designed to fetch metrics data from the Backend API on a scheduled basis.

## Prerequisites

Before starting, ensure you have the following installed:

- **Runtime**: Python 3.9+
- **Package Manager**: pip
- **Active Backend**: The Backend service must be running (locally or in the cloud) for the Extractor to successfully fetch metrics

## Local Setup & Installation

### 1. Navigate to the Directory

```bash
cd path/to/your/project/extractor-cronjob/src
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

### 4. Configuration (Crucial Step)

The Extractor needs to know where the Backend is located. Unlike the Kubernetes environment (where we use DNS), locally we use environment variables to point to localhost.

| Variable | Description | Local Value Example |
|----------|-------------|-------------------|
| `BACKEND_URL` | The URL of the target Backend API | `http://localhost:5000` |

**Setting the variables in PowerShell:**
```powershell
$env:BACKEND_URL = "http://localhost:5000"
```

**Setting the variables in Bash (Linux/macOS):**
```bash
export BACKEND_URL="http://localhost:5000"
```

## Running the Extractor

Since the Extractor is a script (intended to run as a CronJob in production), you can trigger it manually:

```bash
python cronjob.py
```

Expected output:
```
2026-02-09 10:30:45,123 - INFO - Starting extraction from http://localhost:5000...
2026-02-09 10:30:45,456 - INFO - SUCCESS: Extracted 42 requests.
```

## Verifying Success

To confirm the Extractor is working correctly:

1. **Check the Extractor terminal logs:**
   You should see `SUCCESS: Extracted X requests.` or a confirmation message.

2. **Check the Backend terminal logs:**
   You should see an incoming GET request to `/metrics`.

3. **Manual verification:**
   ```bash
   # In a separate terminal, verify the backend is responding
   curl http://localhost:5000/metrics
   ```
   Expected response:
   ```json
   {
     "successful_requests": 5
   }
   ```

## Troubleshooting Connection Errors

| Error | Cause | Solution |
|-------|-------|----------|
| **ConnectionRefusedError** | Backend is not running | Ensure the Backend service is running on `http://localhost:5000` |
| **BACKEND_URL not set** | Environment variable missing | Set `BACKEND_URL` environment variable correctly |
| **Timeout error** | Backend is slow to respond | Increase timeout or check Backend performance |
| **JSON decode error** | Backend returned invalid response | Verify Backend is returning valid JSON from `/metrics` endpoint |
| **DNS resolution error** | Cannot reach the URL | Check firewall and network connectivity |

**Debugging steps:**
```powershell
# Verify environment variable is set
$env:BACKEND_URL

# Test connectivity to backend
curl http://localhost:5000/metrics

# Check Python requests library
python -c "import requests; print(requests.__version__)"
```

## Simulating Production CronJob Execution

The Extractor is designed to run as a Kubernetes CronJob, which executes it on a schedule (every 15 minutes in production).

### Local Simulation

To simulate the CronJob behavior locally, run the Extractor in a loop:

**PowerShell:**
```powershell
while ($true) {
    python cronjob.py
    Start-Sleep -Seconds 900  # 15 minutes
}
```

**Bash:**
```bash
while true; do
    python cronjob.py
    sleep 900  # 15 minutes
done
```

## Best Practices & Design Patterns

**Statefulness:**
The Extractor is designed to be **stateless**. It performs its task and exits. Running it locally mimics a single execution of the production CronJob.

**Retries:**
In production environments, the Extractor implements:
- Connection error handling
- Timeout management
- Exit codes for CronJob monitoring

**Logging:**
All output is sent to stdout with:
- Timestamps for audit trails
- Log levels (INFO, ERROR, WARNING) for filtering
- Clear success/failure messages

**Error Handling:**
The Extractor gracefully handles failures:
- Connection errors → Logs and exits with error code
- Timeout errors → Logs and exits with error code
- Unexpected errors → Logs details and exits with error code

## Integration with Backend

The Extractor communicates with the Backend via the `/metrics` endpoint:

```python
# Flow
1. Extractor starts
2. Reads BACKEND_URL from environment
3. Sends GET request to {BACKEND_URL}/metrics
4. Receives JSON with successful_requests count
5. Logs the extraction result
6. Exits
```

## Next Steps

- Deploy the Extractor to Docker: See `../README.md`
- Deploy to Kubernetes: See `../../k8s/cronjob.yaml`
- Deploy to Google Cloud: See `../../infrastructure-as-code/production/`
- Configure production CronJob schedule: See `../../infrastructure-as-code/modules/extractor.tf`
