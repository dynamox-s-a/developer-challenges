# Dependencies Guide

## Overview

This guide covers all dependencies required to run the Dynamox Full-Stack application successfully.

## System Requirements

### Operating Systems
- **macOS**: 10.15+ (Catalina or later)
- **Linux**: Ubuntu 18.04+, CentOS 7+, Debian 9+
- **Windows**: Windows 10/11 with WSL2

### Hardware Requirements
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: Minimum 10GB free space
- **CPU**: 2+ cores recommended

---

## Core Dependencies

### 1. Node.js
**Version**: 20.x LTS or later

#### Installation

**macOS (using Homebrew)**:
```bash
brew install node@20
node --version
```

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

**Windows**:
```bash
# Download from https://nodejs.org
# Or use Chocolatey
choco install nodejs
```

#### Verification
```bash
node --version  # Should be v20.x.x
npm --version   # Should be 9.x.x or later
```

### 2. pnpm
**Version**: 8.x or later

#### Installation
```bash
npm install -g pnpm
pnpm --version
```

#### Why pnpm?
- Faster installation times
- Efficient disk space usage
- Strict dependency management
- Better monorepo support

### 3. Docker
**Version**: 20.x or later

#### Installation

**macOS**:
```bash
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
# Or using Homebrew
brew install --cask docker
```

**Linux (Ubuntu)**:
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install docker.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

**Windows**:
```bash
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
# Enable WSL2 integration
```

#### Verification
```bash
docker --version
docker compose version
```

### 4. Git
**Version**: 2.30 or later

#### Installation

**macOS**:
```bash
# Comes with Xcode Command Line Tools
# Or install via Homebrew
brew install git
```

**Linux**:
```bash
sudo apt-get install git
```

**Windows**:
```bash
# Download from https://git-scm.com
# Or use Chocolatey
choco install git
```

#### Configuration
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Development Tools

### 5. VS Code (Recommended)
**Extensions**:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Docker
- GitLens

### 6. Database Client
**Options**:
- DBeaver (Free)
- TablePlus (Paid)
- pgAdmin (Free)
- Postico (macOS, Paid)

---

## Project Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd developer-challenges/full-stack
```

### 2. Install Dependencies
```bash
# Install root dependencies
pnpm install

# Install backend dependencies
cd apps/backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 3. Environment Setup
```bash
# Copy environment files
cp .env.example .env

# Edit environment variables
nano .env
```

### 4. Database Setup
```bash
# Start PostgreSQL with Docker
docker compose up -d postgres

# Run migrations
cd apps/backend
pnpm prisma migrate dev

# Seed database
pnpm prisma db seed
```

### 5. Start Development Servers
```bash
# Start all services
./scripts/up.sh

# Or start individually
# Backend
cd apps/backend && pnpm dev

# Frontend
cd apps/frontend && pnpm dev
```

---

## Verification Script

### Automated Dependency Check
```bash
# Run the dependency verification script
./scripts/check-deps.sh
```

This script checks:
- Node.js version and installation
- pnpm availability
- Docker daemon status
- Git configuration
- Port availability
- Database connectivity

### Manual Verification
```bash
# Check Node.js
node --version

# Check pnpm
pnpm --version

# Check Docker
docker --version
docker info

# Check Git
git --version
```

---

## Troubleshooting

### Common Issues

#### 1. Node.js Version Mismatch
**Problem**: Project requires Node.js 20.x but you have 18.x

**Solution**:
```bash
# Install correct version using nvm
nvm install 20
nvm use 20
nvm alias default 20
```

#### 2. Docker Permission Denied
**Problem**: Cannot run Docker commands without sudo

**Solution**:
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
# Or restart your session
```

#### 3. Port Already in Use
**Problem**: Required ports (3001, 5173, 5433) are occupied

**Solution**:
```bash
# Find process using the port
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use different ports in .env
```

#### 4. pnpm Command Not Found
**Problem**: pnpm is not installed or not in PATH

**Solution**:
```bash
# Install pnpm globally
npm install -g pnpm

# Or use npx
npx pnpm install
```

#### 5. Docker Daemon Not Running
**Problem**: Docker commands fail with "daemon not running"

**Solution**:
```bash
# Start Docker Desktop (macOS/Windows)
# Or start Docker service (Linux)
sudo systemctl start docker
sudo systemctl enable docker
```

### Performance Issues

#### 1. Slow Package Installation
**Solutions**:
- Use pnpm instead of npm
- Clear package cache: `pnpm store prune`
- Check network connectivity
- Use npm registry mirror

#### 2. Slow Docker Builds
**Solutions**:
- Use Docker build cache
- Optimize Dockerfile
- Increase Docker memory allocation
- Use SSD storage

---

## Advanced Configuration

### Environment Variables
Create `.env` file in project root:

```bash
# Database
DATABASE_URL="postgresql://dynamox:dynamox@localhost:5433/dynamox"

# Backend
PORT=3001
JWT_SECRET="your-secret-key"
NODE_ENV="development"

# Frontend
VITE_API_URL="http://localhost:3001"
VITE_APP_NAME="Dynamox Dashboard"
```

### Docker Configuration
Optimize Docker for development:

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: dynamox
      POSTGRES_PASSWORD: dynamox
      POSTGRES_DB: dynamox
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dynamox"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Support Resources

### Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [pnpm Documentation](https://pnpm.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Git Documentation](https://git-scm.com/doc)

### Community
- [Node.js Community](https://github.com/nodejs/node)
- [Docker Community](https://www.docker.com/community)
- [Stack Overflow](https://stackoverflow.com/)

### Troubleshooting Tools
- Node.js debugging: `node --inspect`
- Docker logs: `docker logs <container>`
- System monitoring: `htop`, `docker stats`
- Network debugging: `netstat`, `curl`

---

**For help**: Run `./scripts/check-deps.sh` for automated dependency verification.
