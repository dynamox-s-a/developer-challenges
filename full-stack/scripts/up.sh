#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

docker compose up -d --build

echo ""
echo "Deploy completo!"
echo "Frontend: http://localhost:5173"
echo "Backend:   http://localhost:3001"
echo "Swagger:   http://localhost:3001/docs"
