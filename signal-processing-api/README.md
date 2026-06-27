# Signal Processing API

Aplicação FastAPI conectada ao Postgres via Docker.

## Subir o ambiente

```bash
docker compose up --build
```

## Endpoints

- `GET /` verifica se a API está no ar.
- `GET /health` valida a conexão com o banco.
