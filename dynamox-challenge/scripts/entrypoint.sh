#!/bin/sh
# Docker entrypoint — runs every time the container starts.
# Ensures the database schema is always up to date before the API accepts traffic.
set -e

echo "[entrypoint] Running Alembic migrations..."
alembic upgrade head

echo "[entrypoint] Initialising TimescaleDB hypertable and indexes..."
python scripts/init_db.py

echo "[entrypoint] Starting API..."
exec "$@"
