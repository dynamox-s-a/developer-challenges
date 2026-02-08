#!/usr/bin/env bash
set -euo pipefail

TOKEN="$(./scripts/get-token.sh)"

curl -s http://localhost:3001/health | python3 -m json.tool

curl -s "http://localhost:3001/monitoring-points?take=5&skip=0&sortBy=machineName&sortOrder=asc" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
