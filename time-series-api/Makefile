up:
	docker compose up -d --build

down:
	docker compose down

down-v:
	docker compose down -v

logs:
	docker compose logs -f

logs-api:
	docker compose logs -f api

logs-mongo:
	docker compose logs -f mongo

logs-kafka:
	docker compose logs -f kafka

topics:
	@echo "Kafka topics are created automatically during 'make up'."

ps:
	docker compose ps

restart:
	docker compose down
	docker compose up -d --build

test:
	npm test

test-docker:
	docker compose run --rm test

perf-count:
	npm run test:performance:count

perf-get:
	npm run test:performance:get-by-id

perf-metrics:
	npm run test:performance:metrics

dev:
	npm run dev
