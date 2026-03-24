#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Checking dependencies..."
echo "========================"

if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker first."
  exit 1
fi

required_files=(
  "docker-compose.yml"
  "nginx.conf"
  "apps/backend/Dockerfile"
  "apps/frontend/Dockerfile"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "Required file not found: $file"
    exit 1
  fi
done

check_port() {
  local port=$1
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 | grep -v "com.docke" > /dev/null; then
    echo "Port $port is already in use by another process"
    exit 1
  fi
}

check_port 3001  # Backend
check_port 5173  # Frontend  
check_port 5433  # Database
check_port 8080  # Load Balancer

echo "All dependencies checked successfully!"
echo ""

if [ "${1:-}" = "--load-balancer" ]; then
  echo "Starting with LOAD BALANCER mode..."
  docker compose --profile load-balancer up -d --build
  echo ""
  echo "Services running in LOAD BALANCER mode:"
  echo "   • Load Balancer: http://localhost:8080"
  echo "   • Backend API (proxied): http://localhost:8080"
  echo "   • Frontend: http://localhost:5173"
  echo "   • Database: localhost:5433"
  echo ""
  echo "Load Balancing:"
  echo "   • Algorithm: Round Robin"
  echo "   • Backend Instances: 2"
  echo "   • Health Checks: Enabled"
  echo ""
  echo "To test load balancing:"
  echo "   for i in {1..10}; do curl http://localhost:8080/health; done"
else
  echo "Starting in NORMAL mode..."
  docker compose up -d --build
  echo ""
  echo "Services running in NORMAL mode:"
  echo "   • Frontend: http://localhost:5173"
  echo "   • Backend: http://localhost:3001"
  echo "   • Database: localhost:5433"
fi

echo ""
echo "To stop: docker compose down"
echo "To switch modes:"
echo "   ./scripts/up.sh --load-balancer  # Load balancer mode"
echo "   ./scripts/up.sh                # Normal mode"
