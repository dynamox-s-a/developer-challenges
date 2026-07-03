# Signal Processing API

API REST desenvolvida em **Python** com **FastAPI** para armazenamento, consulta, processamento estatístico e previsão de séries temporais associadas a ativos industriais, sensores e sinais coletados ao longo do tempo.

Este projeto foi desenvolvido como solução para o desafio de back-end da **Dynamox**.

---

## Visão geral

A aplicação funciona como um processador de séries temporais.

Ela permite cadastrar uma série temporal relacionada a um ativo ou sensor, armazenar seus pontos em um banco de dados PostgreSQL, recuperar os dados armazenados, calcular métricas estatísticas, excluir séries e gerar uma previsão simples de valores futuros.

Em um cenário real, essa API poderia ser consumida por um script coletor, gateway industrial ou serviço de integração responsável por ler dados de sensores e enviar os valores periodicamente para o servidor.

### Fluxo principal

```text
1. Cadastra uma série temporal para um ativo/sensor.
2. A API retorna um series_id.
3. Um script coletor ou sensor usa esse series_id.
4. Novos pontos são enviados para /time-series/{series_id}/points.
5. A API calcula métricas e previsão futura com base nos pontos armazenados.
```

---

## Tecnologias utilizadas

* Python
* FastAPI
* Uvicorn
* PostgreSQL
* SQLAlchemy
* Pydantic
* Docker
* Docker Compose
* Pytest

---

## Arquitetura do projeto

O projeto foi organizado em camadas para separar responsabilidades e facilitar manutenção, testes e evolução da aplicação.

```text
signal-processing-api/
│
├── app/
│   ├── api/
│   │   └── time_series_routes.py
│   │
│   ├── core/
│   │   └── config.py
│   │
│   ├── database/
│   │   ├── base.py
│   │   └── session.py
│   │
│   ├── models/
│   │   └── time_series.py
│   │
│   ├── repositories/
│   │   └── time_series_repository.py
│   │
│   ├── schemas/
│   │   └── time_series.py
│   │
│   ├── services/
│   │   └── time_series_service.py
│   │
│   └── main.py
│
├── tests/
│   └── test_time_series_routes.py
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── pytest.ini
└── README.md
```

### Responsabilidades das camadas

| Camada         | Responsabilidade                                 |
| -------------- | ------------------------------------------------ |
| `api`          | Define os endpoints HTTP da aplicação            |
| `services`     | Contém as regras de negócio                      |
| `repositories` | Centraliza o acesso ao banco de dados            |
| `models`       | Define as tabelas e relacionamentos              |
| `schemas`      | Define contratos de entrada e saída com Pydantic |
| `database`     | Configura conexão e sessão com o PostgreSQL      |
| `tests`        | Contém os testes automatizados                   |

---

## Modelagem dos dados

A aplicação utiliza duas entidades principais:

```text
TimeSeries
    1 ──── N
TimeSeriesPoint
```

Uma `TimeSeries` representa uma série temporal associada a um ativo, sensor, tipo de sinal e unidade de medida.

Um `TimeSeriesPoint` representa uma medição feita em um instante específico.

### TimeSeries

| Campo         | Descrição                    |
| ------------- | ---------------------------- |
| `id`          | Identificador único da série |
| `asset_name`  | Nome do ativo monitorado     |
| `sensor_name` | Nome do sensor               |
| `signal_type` | Tipo de sinal coletado       |
| `unit`        | Unidade de medida            |
| `created_at`  | Data de criação da série     |

### TimeSeriesPoint

| Campo       | Descrição                        |
| ----------- | -------------------------------- |
| `id`        | Identificador único do ponto     |
| `series_id` | Referência para a série temporal |
| `timestamp` | Momento da medição               |
| `value`     | Valor coletado                   |

---

## Como subir com Docker

Pré-requisitos:

* Docker
* Docker Compose

Na raiz do projeto `signal-processing-api`, execute:

```bash
docker compose up --build
```

A API ficará disponível em:

```text
http://localhost:8000
```

O PostgreSQL será iniciado automaticamente pelo Docker Compose.

---

## Swagger

Com a aplicação em execução, acesse:

```text
http://localhost:8000/docs
```

A documentação interativa do FastAPI permite visualizar e testar todos os endpoints diretamente pelo navegador.

---

## Como rodar os testes

Com os containers em execução, rode:

```bash
docker compose exec api pytest -v
```

Resultado esperado:

```text
8 passed
```

Os testes automatizados validam os principais comportamentos da aplicação:

* Health check
* Criação de série temporal
* Listagem de séries
* Contagem de séries
* Busca por ID
* Cálculo de métricas
* Exclusão de série
* Previsão futura
* Adição contínua de pontos

---

## Endpoints disponíveis

### Health check

```http
GET /health
```

Verifica se a API está disponível.

Resposta:

```json
{
  "status": "healthy"
}
```

---

### Criar série temporal

```http
POST /api/v1/time-series
```

Cria uma nova série temporal associada a um ativo, sensor, tipo de sinal e unidade de medida.

Payload:

```json
{
  "asset_name": "motor-bomba-01",
  "sensor_name": "sensor-vibracao-01",
  "signal_type": "vibration",
  "unit": "mm/s",
  "data": [
    {
      "timestamp": "2026-06-27T12:00:00",
      "value": 2.4
    },
    {
      "timestamp": "2026-06-27T12:00:01",
      "value": 2.7
    },
    {
      "timestamp": "2026-06-27T12:00:02",
      "value": 3.1
    }
  ]
}
```

Resposta:

```json
{
  "id": "uuid-da-serie",
  "message": "Time series created successfully"
}
```

---

### Listar séries temporais

```http
GET /api/v1/time-series
```

Retorna todas as séries temporais armazenadas.

Resposta:

```json
[
  {
    "id": "uuid-da-serie",
    "asset_name": "motor-bomba-01",
    "sensor_name": "sensor-vibracao-01",
    "signal_type": "vibration",
    "unit": "mm/s",
    "created_at": "2026-06-27T12:00:00",
    "points_count": 3
  }
]
```

---

### Contar séries temporais

```http
GET /api/v1/time-series/count
```

Retorna a quantidade total de séries temporais armazenadas.

Resposta:

```json
{
  "count": 1
}
```

---

### Buscar série temporal por ID

```http
GET /api/v1/time-series/{series_id}
```

Retorna uma série temporal completa, incluindo seus pontos armazenados.

Resposta:

```json
{
  "id": "uuid-da-serie",
  "asset_name": "motor-bomba-01",
  "sensor_name": "sensor-vibracao-01",
  "signal_type": "vibration",
  "unit": "mm/s",
  "created_at": "2026-06-27T12:00:00",
  "data": [
    {
      "timestamp": "2026-06-27T12:00:00",
      "value": 2.4
    },
    {
      "timestamp": "2026-06-27T12:00:01",
      "value": 2.7
    }
  ]
}
```

---

### Adicionar novos pontos a uma série temporal

```http
POST /api/v1/time-series/{series_id}/points
```

Adiciona novos pontos a uma série temporal já existente.

Esse endpoint foi pensado para representar um cenário real de coleta contínua, onde um script coletor ou gateway industrial envia novas medições periodicamente para uma série já cadastrada.

Payload:

```json
{
  "data": [
    {
      "timestamp": "2026-06-27T12:00:03",
      "value": 3.4
    },
    {
      "timestamp": "2026-06-27T12:00:04",
      "value": 3.8
    }
  ]
}
```

Resposta:

```json
{
  "series_id": "uuid-da-serie",
  "inserted_points": 2,
  "message": "Points appended successfully"
}
```

---

### Obter métricas da série temporal

```http
GET /api/v1/time-series/{series_id}/metrics
```

Calcula métricas estatísticas com base nos valores armazenados.

Resposta:

```json
{
  "count": 3,
  "min": 2.4,
  "max": 3.1,
  "mean": 2.733333333333333,
  "median": 2.7,
  "std": 0.3511884584284246
}
```

Métricas calculadas:

| Métrica  | Descrição            |
| -------- | -------------------- |
| `count`  | Quantidade de pontos |
| `min`    | Menor valor          |
| `max`    | Maior valor          |
| `mean`   | Média                |
| `median` | Mediana              |
| `std`    | Desvio padrão        |

---

### Forecast como bônus

```http
GET /api/v1/time-series/{series_id}/forecast?steps=5
```

Gera uma previsão simples dos próximos valores da série temporal usando regressão linear simples.

Exemplo:

```http
GET /api/v1/time-series/{series_id}/forecast?steps=2
```

Resposta:

```json
{
  "series_id": "uuid-da-serie",
  "steps": 2,
  "forecast": [
    {
      "step": 1,
      "predicted_value": 40.0
    },
    {
      "step": 2,
      "predicted_value": 50.0
    }
  ]
}
```

Essa funcionalidade foi adicionada como bônus por estar diretamente relacionada ao processamento e análise de séries temporais.

---

### Excluir série temporal

```http
DELETE /api/v1/time-series/{series_id}
```

Remove uma série temporal e todos os seus pontos associados.

Resposta:

```text
204 No Content
```

---

## Exemplo de fluxo completo

### 1. Criar uma série temporal

```http
POST /api/v1/time-series
```

```json
{
  "asset_name": "motor-bomba-01",
  "sensor_name": "sensor-vibracao-01",
  "signal_type": "vibration",
  "unit": "mm/s",
  "data": [
    {
      "timestamp": "2026-06-27T12:00:00",
      "value": 2.4
    }
  ]
}
```

A API retorna o `series_id`.

---

### 2. Enviar novos pontos coletados pelo sensor

```http
POST /api/v1/time-series/{series_id}/points
```

```json
{
  "data": [
    {
      "timestamp": "2026-06-27T12:00:01",
      "value": 2.7
    },
    {
      "timestamp": "2026-06-27T12:00:02",
      "value": 3.1
    }
  ]
}
```

---

### 3. Consultar a série completa

```http
GET /api/v1/time-series/{series_id}
```

---

### 4. Consultar métricas

```http
GET /api/v1/time-series/{series_id}/metrics
```

---

### 5. Consultar previsão futura

```http
GET /api/v1/time-series/{series_id}/forecast?steps=5
```

---

## Exemplo de script coletor

O exemplo abaixo simula um sensor enviando novos pontos para uma série temporal já cadastrada.

```python
import random
import time
from datetime import UTC, datetime

import requests


API_URL = "http://localhost:8000/api/v1/time-series"
SERIES_ID = "cole-aqui-o-series-id"


while True:
    value = round(random.uniform(2.0, 4.0), 2)

    payload = {
        "data": [
            {
                "timestamp": datetime.now(UTC).isoformat(),
                "value": value,
            }
        ]
    }

    response = requests.post(
        f"{API_URL}/{SERIES_ID}/points",
        json=payload,
        timeout=5,
    )

    print(response.status_code, response.json())

    time.sleep(1)
```

Em um cenário real, a linha abaixo:

```python
value = round(random.uniform(2.0, 4.0), 2)
```

seria substituída por uma leitura real de sensor, motor, gateway industrial ou sistema de aquisição de dados.

---

## Decisões técnicas

### FastAPI

O FastAPI foi escolhido por ser um framework moderno, performático, baseado em tipagem e com documentação automática via Swagger.

### PostgreSQL

O PostgreSQL foi utilizado como armazenamento persistente para séries temporais e seus pontos.

### SQLAlchemy

O SQLAlchemy foi utilizado como ORM para mapear as entidades da aplicação para tabelas relacionais.

### Pydantic

O Pydantic foi utilizado para validação dos dados de entrada e padronização dos contratos de resposta da API.

### Docker

A aplicação foi containerizada com Docker para facilitar a execução do projeto em qualquer ambiente.

### Separação em camadas

O projeto foi separado em rotas, serviços, repositórios, schemas e models para melhorar organização, manutenção e testabilidade.

### Endpoint `/points`

O endpoint `/api/v1/time-series/{series_id}/points` foi adicionado para representar melhor um cenário real de coleta contínua de sensores.

### Forecast

A previsão futura foi implementada como bônus usando regressão linear simples, sem adicionar dependências pesadas de machine learning.

---

## Como executar localmente sem Docker

Opcionalmente, é possível executar a aplicação localmente com um ambiente virtual Python, desde que exista um PostgreSQL disponível.

Criar ambiente virtual:

```bash
python -m venv .venv
```

Ativar ambiente virtual no Windows PowerShell:

```bash
.venv\Scripts\Activate.ps1
```

Instalar dependências:

```bash
pip install -r requirements.txt
```

Executar API:

```bash
uvicorn app.main:app --reload
```


## Autor

Desenvolvido por **Gustavo Soares** para o desafio de back-end da Dynamox.
