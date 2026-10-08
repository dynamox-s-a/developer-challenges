#!/bin/sh
set -e

# Apply pending migrations before the API starts accepting requests.
npx --no-install prisma migrate deploy

exec "$@"
