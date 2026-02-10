#!/bin/bash

echo "Starting E2E tests with consolidated configuration..."

if ! curl -s http://localhost:3001/health &>/dev/null; then
    echo "Backend is not running. Please start with: ./scripts/up.sh"
    exit 1
fi

echo "Backend detected. Checking frontend..."

if ! curl -s http://localhost:5173 &>/dev/null; then
    echo "Frontend is not running. Please start the frontend."
    exit 1
fi

echo "Frontend detected. Starting Cypress tests..."

cd "$(dirname "$0")/../.."

npx cypress run --e2e --config-file cypress.config.ts

echo "E2E tests completed!"
