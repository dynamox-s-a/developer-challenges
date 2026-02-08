#!/usr/bin/env bash
set -euo pipefail

TOKEN="$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | python3 -c 'import sys,json; print(json.load(sys.stdin)["token"])')"

echo "$TOKEN"
