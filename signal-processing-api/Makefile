# Makefile for Signal Processing API

PROJECT_NAME=signal-processing-api
DOCKER_COMPOSE=docker-compose.yml

setup:
	@echo "Stopping potential existing containers..."
	docker compose -f $(DOCKER_COMPOSE) down -v
	@echo "Starting up infrastructure (MongoDB + Kafka)..."
	docker compose -f $(DOCKER_COMPOSE) up -d mongodb zookeeper kafka
	@echo "Installing dependencies..."
	npm install && npm install
	@echo "Setup complete. Run 'make start' to run the API locally, or 'make start-lb' for Load Balanced cluster."

start:
	@echo "Starting the application in dev mode..."
	npm run start:dev

start-lb:
	@echo "Starting Load Balancer with 3 API replicas..."
	docker compose -f $(DOCKER_COMPOSE) up -d --build --scale api=3 api nginx

stop:
	@echo "Stopping infrastructure..."
	docker compose -f $(DOCKER_COMPOSE) down

test:
	@echo "Running unit tests..."
	npm test
	@echo "Running e2e tests..."
	npm run test:e2e

load-test-smoke:
	@echo "Running smoke test with k6..."
	docker run --rm -i --net host grafana/k6 run - <test/load/scenarios/smoke.js

load-test-stress:
	@echo "Running stress test with k6..."
	docker run --rm -i --net host grafana/k6 run - <test/load/scenarios/stress.js

load-test-spike:
	@echo "Running spike test with k6..."
	docker run --rm -i --net host grafana/k6 run - <test/load/scenarios/spike.js
