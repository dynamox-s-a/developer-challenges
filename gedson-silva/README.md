# Dynamox Time-Series API

API REST para armazenamento e processamento de séries temporais, desenvolvida com FastAPI, PostgreSQL e Docker.

## Pré-requisitos

- Python 3.11+
- Docker e Docker Compose
- Git

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/developer-challenges.git
cd developer-challenges/gedson-silva
```

### 2. Local (SQLite)

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`.

### 3. Docker (PostgreSQL + Nginx + 3 réplicas)

```bash
docker compose up --build
```

Sobe automaticamente:
- 3 instâncias da API
- PostgreSQL 16
- Nginx como load balancer na porta 8000

A API estará disponível em `http://localhost:8000`.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/series/ | Criar série |
| GET | /api/v1/series/count | Contar séries |
| GET | /api/v1/series/{id} | Buscar série completa |
| GET | /api/v1/series/{id}/metrics | Métricas estatísticas |
| GET | /api/v1/series/{id}/predict?steps=N | Predição futura (padrão: 10 passos) |
| DELETE | /api/v1/series/{id} | Deletar série |

## Documentação interativa

Acesse `http://localhost:8000/docs` após subir a API.

## Testes

```bash
pip install -r requirements.txt
pytest tests/ -v
```

13 testes cobrindo happy path e casos de borda (404, 422, validações).

## Load Tests

Testes de carga realizados com [Locust](https://locust.io/) com 50 usuários simultâneos.

### Rodar load tests

```bash
pip install locust
locust -f locustfile.py --host=http://localhost:8000
```

Acesse `http://localhost:8089` para configurar e monitorar.

### Resultados

| Endpoint | Mediana (ms) | Percentil 95 (ms) | Falhas |
|---|---|---|---|
| GET /series/{id} | 9 | ~310 | 0% |
| GET /series/{id}/metrics | 10–12 | ~20 | 0% |
| POST /series/ | 5900 | 7200 | 0% |

> Todos os endpoints GET responderam bem abaixo do requisito de 350ms.  
> A latência do POST reflete a criação simultânea de 50 séries no startup do teste, não o uso típico.