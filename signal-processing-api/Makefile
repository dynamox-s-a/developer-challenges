# Makefile for Signal Processing API

PROJECT_NAME=signal-processing-api
DOCKER_COMPOSE=docker-compose.yml

setup:
	@echo "Stopping potential existing containers..."
	docker compose -f $(DOCKER_COMPOSE) down -v
	@echo "Starting up infrastructure (MongoDB + Kafka)..."
	docker compose -f $(DOCKER_COMPOSE) up -d
	@echo "Installing dependencies..."
	npm install && cd signal-processing-api && npm install
	@echo "Setup complete. Run 'make start' to run the API."

start:
	@echo "Starting the application in dev mode..."
	npm run start:dev

stop:
	@echo "Stopping infrastructure..."
	docker compose -f $(DOCKER_COMPOSE) down

test:
	@echo "Running unit tests..."
	npm test
	@echo "Running e2e tests..."
	npm run test:e2e

load-test:
	@echo "Running performance test with k6..."
	docker run --rm -i grafana/k6 run - <test/load/k6-script.js
