#!/bin/sh
set -e

echo "Waiting for database..."

until python -c "import socket; s=socket.socket(); s.connect(('db', 5432))"; do
  sleep 1
done

echo "Database ready"

alembic upgrade head

exec uvicorn app.main:app --host 0.0.0.0 --port 8000