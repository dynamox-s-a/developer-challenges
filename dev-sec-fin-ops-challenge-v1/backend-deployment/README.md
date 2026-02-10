# Backend Deployment Service

## O.S. Environment Setup

See [`src/README.md`](./src/README.md) for local OS execution instructions.

### Prerequisites

* [Python 3.9+](https://www.python.org/downloads/)
* [pip](https://pip.pypa.io/en/latest/installation/) (usually included with Python)

## Docker Environment Setup

This section provides instructions for running the Backend service using Docker.

### Prerequisites

Before starting, ensure you have the following installed:

- **Docker**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Port Availability**: Port 5000 must be available on your machine

### Option 1: Running with Docker Compose (Recommended)

Docker Compose allows you to run both the Backend and Extractor services together.

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
- Start the Backend service on port 5000
- Configure health checks
- Build and start the Extractor service

#### 3. Expected Output

```
backend    | [2026-02-09 10:30:45 +0000] [1] [INFO] Starting gunicorn 21.2.0
backend    | [2026-02-09 10:30:45 +0000] [1] [INFO] Listening at: http://0.0.0.0:5000 (1)
backend    | [2026-02-09 10:30:45 +0000] [7] [INFO] Booting worker with pid: 7
```

#### 4. Test the Backend

In a separate terminal:

```bash
# Test home endpoint
curl http://localhost:5000/

# Test metrics endpoint
curl http://localhost:5000/metrics

# Test health check
curl http://localhost:5000/health
```

#### 5. Stop Services

```bash
docker-compose down
```

### Option 2: Running with Standalone Docker

Build and run the Backend container independently.

#### 1. Build the Backend Image

Navigate to the backend directory:

```bash
cd path/to/backend-deployment
```

Build the Docker image:

```bash
docker build -t backend:latest .
```

#### 2. Run the Backend Container

**Basic execution (port 5000):**

```bash
docker run -d \
  -p 5000:5000 \
  --name backend \
  backend:latest
```

**With environment variables and resource limits:**

```bash
docker run -d \
  -p 5000:5000 \
  --name backend \
  --memory=1g \
  --cpus=1 \
  -e FLASK_ENV=production \
  backend:latest
```

**Interactive mode (for debugging):**

```bash
docker run -it \
  -p 5000:5000 \
  backend:latest
```

#### 3. Verify the Container

```bash
# Check if container is running
docker ps

# View container logs
docker logs backend

# Test the API
curl http://localhost:5000/health
```

### Running Backend and Extractor Together (Standalone)

If you want to run them separately but connected:

#### 1. Create a Docker Network

```bash
docker network create backend-network
```

#### 2. Run Backend Container on the Network

```bash
docker run -d \
  --name backend \
  --network backend-network \
  -p 5000:5000 \
  backend:latest
```

#### 3. Run Extractor Container on the Same Network

```bash
docker run --rm \
  --network backend-network \
  -e BACKEND_URL=http://backend:5000 \
  extractor:latest
```

### Image Details

**Backend Docker Image Specifications:**
- **Base Image**: `python:3.11-slim`
- **Working Directory**: `/src`
- **Entry Point**: `gunicorn` with 4 workers
- **Port**: 5000 (exposed)
- **Server**: Gunicorn (production-ready WSGI server)

**Image Size**: ~200 MB (slim variant with Gunicorn)

### API Endpoints in Docker

Once running, the Backend API is accessible at:

- **Home**: `http://localhost:5000/`
- **Metrics**: `http://localhost:5000/metrics`
- **Health**: `http://localhost:5000/health`

### Health Check Configuration

The docker-compose includes a health check:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

This ensures the Backend is ready before the Extractor starts.

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Port already in use** | Port 5000 occupied | Map to different port: `docker run -p 5001:5000` or stop conflicting service |
| **Connection refused** | Backend not running | Ensure container is running: `docker ps` |
| **Image not found** | Docker image not built | Run `docker build -t backend:latest .` |
| **Out of memory** | Insufficient Docker resources | Allocate more memory in Docker settings or use resource limits |
| **Permission denied** | Docker permissions issue | Ensure Docker daemon is running and user has permissions |
| **Module not found** | Dependency missing | Rebuild image: `docker build --no-cache -t backend:latest .` |
| **Gunicorn errors** | Worker process failed | Check logs: `docker logs backend` |

### Useful Docker Commands

```bash
# Build image with custom tag
docker build -t backend:v1.0 .

# List all images
docker images

# List all containers (running and stopped)
docker ps -a

# View container logs with tail
docker logs -f backend

# Execute command in running container
docker exec -it backend curl http://localhost:5000/metrics

# Remove image (after stopping container)
docker rmi backend:latest

# Stop container
docker stop backend

# Remove container
docker rm backend

# Remove all stopped containers
docker container prune

# View container resource usage
docker stats backend
```

### Docker Compose Commands

```bash
# Start services in background
docker-compose up -d --build

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend

# Stop services
docker-compose stop

# Stop and remove services
docker-compose down

# Remove volumes as well
docker-compose down -v

# Restart services
docker-compose restart
```

### Performance Considerations

1. **Worker Count**: Currently set to 4 workers in Gunicorn
   - Adjust based on CPU cores: `--workers <2 * CPU_CORES + 1>`

2. **Resource Limits**: Recommendation for production:
   ```bash
   docker run -d \
     --memory=2g \
     --cpus=2 \
     --memory-reservation=1g \
     -p 5000:5000 \
     backend:latest
   ```

3. **Logging**: Access logs are written to stdout for container log aggregation

### Best Practices

1. **Use Specific Image Tags**: Instead of `latest`, use version tags: `backend:v1.0.0`
2. **Non-Root User**: Consider adding a non-root user in Dockerfile for security
3. **Health Checks**: Always include health checks in docker-compose
4. **Environment Variables**: Use `.env` file for sensitive configuration
5. **Image Scanning**: Scan images for vulnerabilities:
   ```bash
   docker scan backend:latest
   ```
6. **Multi-Stage Builds**: Use multi-stage builds to reduce final image size
7. **Resource Limits**: Always set memory and CPU limits to prevent resource exhaustion

### Next Steps

- Deploy to Kubernetes: See `../k8s/backend.yaml`
- Deploy to Google Cloud: See `../infrastructure-as-code/production/`
- View Dockerfile details: See `./Dockerfile`
- Docker Compose configuration: See `../docker-compose.yml`
- Local OS execution: See `./src/README.md`
