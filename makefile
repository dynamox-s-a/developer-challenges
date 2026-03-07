.PHONY: up db down api test

up:
	docker compose up --build -d

db:
	docker compose up -d db

down:
	docker compose down

api:
	docker compose up api --build -d 

test:
	docker compose up test-db -d
	pytest
	docker compose rm -f -s test-db