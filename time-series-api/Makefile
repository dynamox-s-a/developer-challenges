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
	docker exec time-series-kafka kafka-topics --create --topic time-series.created --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 || true
	docker exec time-series-kafka kafka-topics --create --topic time-series.deleted --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 || true

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