# Docker Containers Architecture

## Overview

This document describes the complete Docker containerization strategy for the Dynamox Full-Stack application, including multi-service orchestration, networking, security, and production deployment considerations.

---

## Container Architecture

### Services Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Frontend  │  │   Backend   │  │  PostgreSQL │ │
│  │   (Nginx)   │  │  (Node.js)  │  │             │ │
│  │   Port 5173 │  │  Port 3001  │  │  Port 5433 │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Load Balancer Mode (Optional)

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    Nginx    │  │  Backend-1   │  │ Backend-2   │ │
│  │ Load Balancer│  │  (Node.js)   │  │ (Node.js)   │ │
│  │   Port 8080 │  │  Port 3001   │  │ Port 3001   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                       │
│  ┌─────────────┐                                      │
│  │  PostgreSQL │                                      │
│  │             │                                      │
│  │  Port 5433 │                                      │
│  └─────────────┘                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Container Specifications

### 1. PostgreSQL Database

#### Dockerfile Configuration
```dockerfile
FROM postgres:16-alpine

ENV POSTGRES_USER=dynamox
ENV POSTGRES_PASSWORD=dynamox
ENV POSTGRES_DB=dynamox

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD pg_isready -U dynamox -d dynamox

VOLUME ["/var/lib/postgresql/data"]

EXPOSE 5433
```

#### Docker Compose Service
```yaml
postgres:
  image: postgres:16
  container_name: dynamox-postgres
  environment:
    POSTGRES_USER: dynamox
    POSTGRES_PASSWORD: dynamox
    POSTGRES_DB: dynamox
  ports:
    - "5433:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U dynamox -d dynamox"]
    interval: 10s
    timeout: 5s
    retries: 10
  restart: unless-stopped
```

#### Features
- **Version**: PostgreSQL 16 with Alpine Linux
- **Persistence**: Named volume `postgres_data`
- **Health Checks**: Automatic readiness detection
- **Security**: Environment-based authentication
- **Performance**: Optimized for container workloads

### 2. Backend API

#### Dockerfile Configuration
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

USER backend

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001

CMD ["node", "dist/app.js"]
```

#### Docker Compose Service
```yaml
backend:
  build:
    context: apps/backend
    dockerfile: Dockerfile
  container_name: dynamox-backend
  environment:
    PORT: 3001
    DATABASE_URL: postgresql://dynamox:dynamox@postgres:5432/dynamox?schema=public
    JWT_SECRET: prod_secret_change_me
    SEED_ADMIN_USERNAME: admin
    SEED_ADMIN_PASSWORD: admin
  depends_on:
    postgres:
      condition: service_healthy
  ports:
    - "3001:3001"
  restart: unless-stopped
```

#### Features
- **Multi-stage Build**: Optimized image size
- **Security**: Non-root user execution
- **Health Checks**: Application readiness monitoring
- **Environment**: Production-ready configuration
- **Dependencies**: Prisma ORM and TypeScript

### 3. Frontend Application

#### Dockerfile Configuration
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY .

RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose Service
```yaml
frontend:
  build:
    context: apps/frontend
    dockerfile: Dockerfile
  container_name: dynamox-frontend
  depends_on:
    - backend
  ports:
    - "5173:80"
  restart: unless-stopped
```

#### Features
- **Static Hosting**: Nginx for optimal performance
- **Build Optimization**: Separate build and runtime stages
- **Health Monitoring**: Application availability checks
- **Security**: Minimal attack surface

### 4. Load Balancer (Optional)

#### Nginx Configuration
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend_servers {
        server backend-1:3001;
        server backend-2:3001;
    }

    server {
        listen 80;
        server_name localhost;

        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        location / {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        location /static/ {
            root /usr/share/nginx/html;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Docker Compose Service
```yaml
nginx:
  image: nginx:alpine
  container_name: dynamox-nginx
  ports:
    - "8080:80"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - backend-1
    - backend-2
  restart: unless-stopped
  profiles: [load-balancer]

backend-1:
  build:
    context: apps/backend
    dockerfile: Dockerfile
  container_name: dynamox-backend-1
  environment:
    PORT: 3001
    DATABASE_URL: postgresql://dynamox:dynamox@postgres:5432/dynamox?schema=public
    JWT_SECRET: prod_secret_change_me
    SEED_ADMIN_USERNAME: admin
    SEED_ADMIN_PASSWORD: admin
    NODE_ENV: production
  depends_on:
    postgres:
      condition: service_healthy
  restart: unless-stopped
  profiles: [load-balancer]

backend-2:
  build:
    context: apps/backend
    dockerfile: Dockerfile
  container_name: dynamox-backend-2
  environment:
    PORT: 3001
    DATABASE_URL: postgresql://dynamox:dynamox@postgres:5432/dynamox?schema=public
    JWT_SECRET: prod_secret_change_me
    SEED_ADMIN_USERNAME: admin
    SEED_ADMIN_PASSWORD: admin
    NODE_ENV: production
  depends_on:
    postgres:
      condition: service_healthy
  restart: unless-stopped
  profiles: [load-balancer]
```

---

## Networking

### Docker Network Configuration

```yaml
networks:
  dynamox-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### Service Communication

| Service | Port | Internal Access | External Access |
|----------|-------|----------------|-----------------|
| PostgreSQL | 5433 | postgres:5432 | localhost:5433 |
| Backend | 3001 | backend:3001 | localhost:3001 |
| Frontend | 5173 | frontend:80 | localhost:5173 |
| Load Balancer | 8080 | nginx:80 | localhost:8080 |

### Security Considerations

#### Network Isolation
- Services communicate within isolated Docker network
- Only necessary ports exposed to host
- Internal service discovery via Docker DNS

#### Firewall Rules
```bash
sudo ufw allow from 172.20.0.0/16
sudo ufw allow 5433,3001,5173,8080/tcp
```

---

## Volume Management

### Persistent Data

```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/postgresql/data
```

### Backup Strategy

#### Database Backups
```bash
docker exec dynamox-postgres pg_dump -U dynamox dynamox > backup.sql
docker exec -i dynamox-postgres psql -U dynamox dynamox < backup.sql

#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
docker exec dynamox-postgres pg_dump -U dynamox dynamox > "$BACKUP_DIR/backup_$DATE.sql"
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete
```

---

## Environment Configuration

### Development Environment
```yaml
services:
  postgres:
    environment:
      POSTGRES_USER: dynamox
      POSTGRES_PASSWORD: dynamox
      POSTGRES_DB: dynamox
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    environment:
      NODE_ENV: development
      PORT: 3001
      DATABASE_URL: postgresql://dynamox:dynamox@postgres:5432/dynamox
      JWT_SECRET: dev_secret_change_me
    ports:
      - "3001:3001"
    volumes:
      - ./apps/backend:/app
      - /app/node_modules

  frontend:
    environment:
      VITE_API_URL: http://localhost:3001
    ports:
      - "5173:5173"
    volumes:
      - ./apps/frontend:/app
      - /app/node_modules
```

### Production Environment
```yaml
services:
  postgres:
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}

  frontend:
    environment:
      VITE_API_URL: ${API_URL}
```

---

## Performance Optimization

### Build Optimization

#### Multi-stage Builds
- **Builder Stage**: Includes development dependencies
- **Production Stage**: Only runtime dependencies
- **Image Size**: Reduced by 60-80%

#### Layer Caching
```dockerfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY .
```

### Runtime Optimization

#### Resource Limits
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

  postgres:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '1.0'
          memory: 512M
```

#### Health Checks
```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## Monitoring and Logging

### Application Logs

#### Log Configuration
```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=backend,environment=production"

  postgres:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=postgres,environment=production"
```

#### Log Aggregation
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs --no-color > application.log
```

### Health Monitoring

#### Custom Health Checks
```bash
curl -f http://localhost:3001/health
docker exec dynamox-postgres pg_isready -U dynamox
curl -f http://localhost:5173
```

#### Monitoring Script
```bash
#!/bin/bash

check_service() {
    local service=$1
    local url=$2
    
    if curl -f "$url" > /dev/null 2>&1; then
        echo "$service: HEALTHY"
    else
        echo "$service: UNHEALTHY"
    fi
}

check_service "Backend" "http://localhost:3001/health"
check_service "Frontend" "http://localhost:5173"
check_service "Load Balancer" "http://localhost:8080/health"
```

---

## Deployment Strategies

### Development Deployment
```bash
./scripts/up.sh
./scripts/up.sh --load-balancer
./scripts/down.sh
```

### Production Deployment

#### Single Command Deployment
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale backend=3
```

#### Zero-Downtime Deployment
```bash
#!/bin/bash

docker compose pull
docker compose up -d --no-deps backend
sleep 30
docker compose rm -f backend_old
docker image prune -f
```

---

## Security Considerations

### Container Security

#### Non-Root User
```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001
USER backend
```

#### Minimal Base Images
```dockerfile
FROM node:20-alpine
FROM nginx:alpine
FROM postgres:16-alpine
```

#### Secrets Management
```yaml
services:
  backend:
    environment:
      JWT_SECRET: ${JWT_SECRET}
      DATABASE_URL: ${DATABASE_URL}
```

### Network Security

#### Internal Communication
```yaml
services:
  backend:
```

#### SSL/TLS Configuration
```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    location / {
        proxy_pass http://backend_servers;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Troubleshooting

### Common Issues

#### Container Won't Start
```bash
docker compose logs <service-name>
docker compose ps
docker inspect <container-name>
```

#### Port Conflicts
```bash
lsof -i :3001
kill -9 <PID>
```

#### Database Connection Issues
```bash
docker exec dynamox-postgres pg_isready -U dynamox
docker exec dynamox-backend psql -h postgres -U dynamox -d dynamox
docker network ls
docker network inspect <network-name>
```

#### Performance Issues
```bash
docker stats
docker inspect dynamox-backend | grep -A 10 Resources
docker exec dynamox-postgres psql -U dynamox -d dynamox -c "ANALYZE;"
```

### Debug Commands

#### Container Shell Access
```bash
docker exec -it <container-name> sh
docker exec -u <user> -it <container-name> sh
```

#### File System Inspection
```bash
docker exec <container-name> ls -la /app
docker cp <container-name>:/app/config.yaml ./config.yaml
docker cp ./config.yaml <container-name>:/app/config.yaml
```

---

## Best Practices

### Development Workflow
1. Use version-controlled docker-compose files
2. Implement health checks for all services
3. Use environment-specific configurations
4. Implement proper logging strategies
5. Monitor resource usage regularly

### Production Deployment
1. Use multi-stage builds for optimization
2. Implement proper secrets management
3. Set resource limits and reservations
4. Use load balancer for high availability
5. Implement backup and recovery procedures

### Security Measures
1. Run containers as non-root users
2. Use minimal base images
3. Implement network segmentation
4. Regularly update base images
5. Scan images for vulnerabilities

---

**For more information**: Check the individual Dockerfiles and docker-compose.yml files in the repository.
