# Signal Processing API

API REST para armazenamento e análise de séries temporais, desenvolvida como solução para o desafio backend da Dynamox.

## Sobre o Projeto

Esta API permite armazenar séries temporais com múltiplos pontos de dados, calcular métricas estatísticas e gerenciar os registros de forma eficiente. Foi construída com foco em performance, mantendo latência média abaixo de 10ms.

## Tecnologias Utilizadas

- Python 3.11
- FastAPI
- SQLAlchemy
- Pydantic
- Pytest

## Requisitos

- Python 3.11 ou superior
- [uv](https://github.com/astral-sh/uv) (gerenciador de pacotes)

## Instalacao

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/developer-challenges.git
cd developer-challenges/backend-solution
```

Instale as dependências:

```bash
uv sync
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

O arquivo `.env` deve conter:

```
DATABASE_URL=sqlite:///./database.db
```

## Executando a Aplicacao

```bash
uv run fastapi dev app/main.py
```

A API estará disponível em `http://localhost:8000`.

A documentação interativa (Swagger) pode ser acessada em `http://localhost:8000/docs`.

## Endpoints

### Criar uma série temporal

```
POST /time-series/
```

Exemplo de requisição:

```bash
curl -X POST http://localhost:8000/time-series/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sensor Temperatura Sala 01",
    "data_points": [
      {"timestamp": "2024-01-15T08:00:00", "value": 22.5},
      {"timestamp": "2024-01-15T08:01:00", "value": 22.7},
      {"timestamp": "2024-01-15T08:02:00", "value": 23.1},
      {"timestamp": "2024-01-15T08:03:00", "value": 22.9},
      {"timestamp": "2024-01-15T08:04:00", "value": 23.4}
    ]
  }'
```

Resposta:

```json
{
  "id": 1,
  "name": "Sensor Temperatura Sala 01",
  "created_at": "2024-01-15T10:30:00",
  "data_points": [
    {"id": 1, "timestamp": "2024-01-15T08:00:00", "value": 22.5},
    {"id": 2, "timestamp": "2024-01-15T08:01:00", "value": 22.7},
    {"id": 3, "timestamp": "2024-01-15T08:02:00", "value": 23.1},
    {"id": 4, "timestamp": "2024-01-15T08:03:00", "value": 22.9},
    {"id": 5, "timestamp": "2024-01-15T08:04:00", "value": 23.4}
  ]
}
```

### Obter uma série temporal

```
GET /time-series/{id}
```

Exemplo:

```bash
curl http://localhost:8000/time-series/1
```

### Obter métricas de uma série

```
GET /time-series/{id}/metrics
```

Exemplo:

```bash
curl http://localhost:8000/time-series/1/metrics
```

Resposta:

```json
{
  "id": 1,
  "name": "Sensor Temperatura Sala 01",
  "count": 5,
  "min_value": 22.5,
  "max_value": 23.4,
  "mean_value": 22.92,
  "std_deviation": 0.35
}
```

### Contar séries temporais

```
GET /time-series/count
```

Exemplo:

```bash
curl http://localhost:8000/time-series/count
```

Resposta:

```json
{
  "total": 1
}
```

### Deletar uma série temporal

```
DELETE /time-series/{id}
```

Exemplo:

```bash
curl -X DELETE http://localhost:8000/time-series/1
```

Resposta:

```json
{
  "message": "Time series deleted successfully"
}
```

### Prever valores futuros de uma série
```
GET /time-series/{id}/predict?steps=5
```

Exemplo:
```bash
curl http://localhost:8000/time-series/1/predict?steps=5
```

Resposta:
```json
{
  "series_id": 1,
  "series_name": "Sensor Temperatura Sala 01",
  "historical_count": 5,
  "steps": 5,
  "predictions": [23.6, 23.8, 24.0, 24.2, 24.4]
}
```

## Executando os Testes

Testes unitários e de integração:

```bash
uv run pytest -v
```

Testes com cobertura de código:

```bash
uv run task test
```

O relatório de cobertura será gerado em `htmlcov/index.html`.

Testes de latência (benchmark):

```bash
uv run pytest -v -m benchmark
```

## Estrutura do Projeto

```
backend-solution/
├── app/
│   ├── __init__.py
│   ├── main.py           # Configuração do FastAPI
│   ├── database.py       # Conexão com banco de dados
│   ├── models.py         # Modelos SQLAlchemy
│   ├── schemas.py        # Schemas Pydantic
│   ├── settings.py       # Configurações da aplicação
│   └── routers/
│       ├── __init__.py
│       └── time_series.py
├── tests/
│   ├── conftest.py       # Fixtures do pytest
│   ├── test_db.py        # Testes dos modelos
│   ├── test_api.py       # Testes dos endpoints
│   └── test_latency.py   # Testes de performance
├── .env.example
├── pyproject.toml
└── README.md
```

## Performance

A API foi testada e apresentou os seguintes resultados de latência:

| Endpoint | Latência Média |
|----------|----------------|
| GET / | ~4ms |
| GET /time-series/count | ~8ms |

Todos os endpoints atendem ao requisito de latência inferior a 350ms.

## Deploy

A API está disponível em produção:

- **API:** https://developer-challenges-production-2932.up.railway.app/docs

## Autor

Ariel Fernandes
