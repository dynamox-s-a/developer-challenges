# Backend Deployment Service

Small service that listens to `localhost:8000` and counts the amount of calls received in `/` and `/request`, and returns the value in `/count`.

## O.S. Environment Setup

To run the service locally you need the following:

- poetry
- Python (>=3.14);
- Python libraries:
  - fastapi (>=0.128.0,<0.129.0);
  - uvicorn (>=0.40.0,<0.41.0);

The service may be provided with the command:

```bash
POETRY_DOTENV_LOCATION=.env poetry run uvicorn src.main:app --host 0.0.0.0 --port 8000
```

## Docker Environment Setup

Build the Docker image with:

```bash
docker-compose build
```

After building the image, run the it with the following command:

```bash
docker compose run count-api
```

## Kubernetes Setup

After building the image you may start your `minikube` and then run the service running the following commands:

```bash
minikube image load backend-deployment-count-api:latest
kubectl apply -f k8s.yaml
kubectl port-forward service/backend 8000:8000
```