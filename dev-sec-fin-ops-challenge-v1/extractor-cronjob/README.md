# Extractor Cronjob Service

## O.S. Environment Setup

See [`src/README.md`](./src/README.md) for local OS execution instructions.

### Prerequisites

* [Python 3.9+](https://www.python.org/downloads/)
* [pip](https://pip.pypa.io/en/latest/installation/) (usually included with Python)

## Docker Environment Setup

This section provides instructions for running the Extractor service using Docker.

### Prerequisites

Before starting, ensure you have the following installed:

- **Docker**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Backend Service**: The Backend must be running (either locally or in Docker)
- **Port Availability**: Port 5000 for Backend (if running locally)

### Option 1: Running with Docker Compose (Recommended)

Docker Compose allows you to run both the Backend and Extractor services together with automatic networking.

#### 1. Navigate to the Project Root

```bash
cd path/to/dev-sec-fin-ops-challenge-v1
```

#### 2. Build and Start Services

```bash
docker-compose up --build
```

This command will:
- Build the Backend Docker image
- Build the Extractor Docker image
- Start the Backend service on port 5000
- Start the Extractor service (runs once and exits)
- Automatically wait for the Backend health check before starting the Extractor

#### 3. Expected Output

```
backend        | * Running on http://0.0.0.0:5000
extractor      | 2026-02-09 10:30:45,123 - INFO - Starting extraction from http://backend:5000...
extractor      | 2026-02-09 10:30:45,456 - INFO - SUCCESS: Extracted 42 requests.
```

#### 4. Verify the Execution

In a separate terminal:

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### 5. Running Extractor on Schedule

To simulate the CronJob behavior and run the Extractor every 15 minutes:

**PowerShell:**
```powershell
while ($true) {
    docker-compose run --rm extractor
    Start-Sleep -Seconds 900  # 15 minutes
}
```

**Bash:**
```bash
while true; do
    docker-compose run --rm extractor
    sleep 900  # 15 minutes
done
```

### Option 2: Running with Standalone Docker (Manual Backend)

If your Backend is running separately (locally or in the cloud), you can run only the Extractor.

#### 1. Build the Extractor Image

Navigate to the extractor directory:

```bash
cd path/to/extractor-cronjob
```

Build the Docker image:

```bash
docker build -t extractor:latest .
```

#### 2. Run the Extractor Container

**For local Backend on localhost:5000:**

```bash
docker run --rm \
  -e BACKEND_URL=http://host.docker.internal:5000 \
  extractor:latest
```

**For Backend on a remote server:**

```bash
docker run --rm \
  -e BACKEND_URL=http://your-backend-url.com:5000 \
  extractor:latest
```

**For Backend running in another Docker container:**

First, create a Docker network:
```bash
docker network create backend-network
```

Run Backend container on the network:
```bash
docker run -d \
  --name backend \
  --network backend-network \
  -p 5000:5000 \
  backend:latest
```

Run Extractor on the same network:
```bash
docker run --rm \
  --network backend-network \
  -e BACKEND_URL=http://backend:5000 \
  extractor:latest
```

### Image Details

**Extractor Docker Image Specifications:**
- **Base Image**: `python:3.11-slim`
- **Working Directory**: `/src`
- **Entry Point**: `python src/cronjob.py`
- **Environment Variables**: `BACKEND_URL` (required)

**Image Size**: ~150 MB (slim variant)

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Connection refused** | Backend not accessible | Ensure Backend is running and `BACKEND_URL` is correct |
| **Host not found** | DNS resolution failed | Use `host.docker.internal` for local Backend, or verify network connectivity |
| **Port already in use** | Port 5000 is occupied | Change port mapping: `docker run -p 5001:5000` |
| **Image not found** | Docker image not built | Run `docker build -t extractor:latest .` |
| **Permission denied** | Docker permissions issue | Ensure Docker daemon is running and user has permissions |
| **Out of memory** | Insufficient resources | Allocate more memory to Docker |

### Useful Docker Commands

```bash
# Build image with custom name
docker build -t my-extractor:v1.0 .

# List all images
docker images

# Run container interactively
docker run -it --rm extractor:latest /bin/bash

# View container logs
docker logs <container_id>

# Remove unused images
docker image prune

# Stop all running containers
docker stop $(docker ps -q)

# Remove all stopped containers
docker container prune
```

### Best Practices

1. **Use Environment Variables**: Never hardcode the Backend URL
2. **Health Checks**: The Docker Compose setup includes health checks for the Backend
3. **Statelessness**: Each Extractor container execution is independent
4. **Resource Limits**: For production, set memory and CPU limits:
   ```bash
   docker run --memory=512m --cpus=0.5 extractor:latest
   ```
5. **Logging**: Container logs are accessible via `docker logs` and can be integrated with logging services
6. **Image Scanning**: Scan images for vulnerabilities:
   ```bash
   docker scan extractor:latest
   ```

### Next Steps

- Deploy to Kubernetes: See `../k8s/cronjob.yaml`
- Deploy to Google Cloud: See `../infrastructure-as-code/production/`
- View Dockerfile details: See `./Dockerfile`
- Docker Compose configuration: See `../docker-compose.yml`
