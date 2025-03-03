.PHONY: install dev test test-unit test-integration load-test load-test-headless clean

VENV=.venv
PYTHON=$(VENV)/bin/python
PIP=$(VENV)/bin/pip

## Create virtual env and install all dependencies
install:
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt
	@echo "\n✅ Pronto. Ative com: source .venv/bin/activate"

## Run dev server (single instance)
dev:
	$(PYTHON) run.py

## Run all tests with coverage
test:
	$(VENV)/bin/pytest

## Unit tests only
test-unit:
	$(VENV)/bin/pytest tests/unit/ -v

## Integration tests only
test-integration:
	$(VENV)/bin/pytest tests/integration/ -v

## Load test (interactive browser UI at http://localhost:8089)
load-test:
	$(VENV)/bin/locust -f load_tests/locustfile.py --host=http://localhost:80

## Load test headless (CI mode, 100 users, 60s)
load-test-headless:
	$(VENV)/bin/locust -f load_tests/locustfile.py \
		--host=http://localhost:80 \
		--headless -u 100 -r 10 \
		--run-time 60s \
		--html load_tests/report.html \
		--csv  load_tests/results

## Start full stack (nginx + 3 API workers)
up:
	docker-compose up --build -d

## Stop stack
down:
	docker-compose down

## Clean up
clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null; true
	find . -name "*.pyc" -delete
	rm -rf .pytest_cache .coverage htmlcov timeseries.db load_tests/report.html load_tests/results*
