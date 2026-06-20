# API de Telemetria - Backend Challenge

A solução permite armazenar medições de sensores, consultar séries temporais, calcular métricas agregadas e validar requisitos de desempenho por meio de testes automatizados.

## Tecnologias

- Python 3.x
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn
- Pytest
- Pytest-Benchmark

## Arquitetura

O projeto segue uma arquitetura em camadas para separação de responsabilidades:

- **API**: definição dos endpoints REST
- **Service**: regras de negócio
- **Repository**: acesso aos dados
- **Database**: configuração e persistência
- **Schemas**: validação e serialização de dados

## Instalação

1. Navegue até a pasta do projeto:

```bash
cd backend
```

2. Instale as dependências:

```bash
pip install -r requirements.txt
```

## Como executar

Execute o servidor:

```bash
uvicorn main:app --reload
```

A aplicação estará disponível em:

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### Sensores

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /sensores | Criar sensor |
| GET | /sensores | Listar sensores |
| GET | /sensores/{sensor_id} | Buscar sensor por ID |
| DELETE | /sensores/{sensor_id} | Remover sensor |
| GET | /sensores/{sensor_id}/metricas | Consultar métricas do sensor |

### Medições

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /medicoes | Criar medição |
| GET | /medicoes | Listar medições |
| GET | /medicoes/{medicao_id} | Buscar medição por ID |
| DELETE | /medicoes/{medicao_id} | Remover medição |
| GET | /medicoes/sensor/{sensor_id} | Listar medições de um sensor |

## Exemplo de Resposta

Consulta de métricas de um sensor:

**GET /sensores/{sensor_id}/metricas**

```json
{
  "count": 100,
  "min": 10.5,
  "max": 95.3,
  "avg": 52.8
}
```

## Testes

O projeto possui testes unitários, integração e performance utilizando pytest.

### Executar todos os testes

```bash
pytest
```

### Executar testes detalhados

```bash
pytest -v
```

### Executar testes por camada

```bash
pytest tests/repository/
pytest tests/service/
```

### Executar um teste específico

```bash
pytest tests/repository/test_sensor_repository.py::TestSensorRepository::test_create_sensor
```

## Testes de Performance

Validação do requisito de latência inferior a 350ms.

Executar todos os testes de performance:

```bash
pytest tests/performance/ --benchmark-only
```

Executar com informações detalhadas:

```bash
pytest tests/performance/ --benchmark-only --benchmark-detail
```

Executar com histograma:

```bash
pytest tests/performance/ --benchmark-only --benchmark-histogram
```

As medições avaliam operações críticas das camadas Repository e Service para garantir conformidade com o requisito de desempenho.

## Estrutura do Projeto

```text
backend/
├── api/
│   ├── sensor.py
│   └── medicao.py
├── models/
│   ├── base.py
│   ├── sensor.py
│   └── medicao.py
├── schemas/
│   ├── sensor.py
│   └── medicao.py
├── repository/
│   ├── sensor_repository.py
│   └── medicao_repository.py
├── service/
│   ├── sensor_service.py
│   └── medicao_service.py
├── database.py
├── main.py
├── requirements.txt
└── tests/
    ├── conftest.py
    ├── repository/
    ├── service/
    └── performance/
```

## Funcionalidades Implementadas

- Persistência de séries temporais
- Consulta de métricas agregadas
- Consulta de medições por sensor
- Exclusão de registros
- Testes unitários
- Testes de performance
- Documentação automática via Swagger