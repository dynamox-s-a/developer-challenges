# 📊 Dynamox - Séries Temporais API

API REST desenvolvida em Python utilizando FastAPI para armazenamento, processamento e análise de séries temporais.

O projeto foi desenvolvido como solução para o desafio técnico da Dynamox e implementa persistência em PostgreSQL, cálculo de métricas estatísticas, previsão de valores futuros, testes automatizados e testes de carga.

---

# 🚀 Tecnologias Utilizadas

* Python 3.12
* FastAPI
* PostgreSQL
* SQLAlchemy 2.0
* Pydantic V2
* Docker
* Docker Compose
* Pytest
* Pytest-Cov
* Locust
* NumPy

---

# 🎯 Objetivo

A aplicação permite:

* Armazenar séries temporais
* Consultar séries armazenadas
* Consultar métricas estatísticas
* Contabilizar séries cadastradas
* Remover séries temporais
* Realizar previsão de valores futuros
* Validar comportamento através de testes automatizados

---

# 📁 Estrutura do Projeto

```text
app/
├── api/
│   └── timeseries.py
├── core/
│   └── dependencies.py
├── database/
│   ├── base.py
│   ├── engine.py
│   └── session.py
├── models/
│   └── timeseries.py
├── repository/
│   └── timeseries_repository.py
├── schemas/
│   └── timeseries.py
├── services/
│   └── timeseries_service.py
└── main.py

tests/
├── conftest.py
├── test_timeseries.py
└── load/
    └── locustfile.py
```

---

# 🏗 Arquitetura

A aplicação foi construída utilizando uma arquitetura em camadas.

```text
Client
   │
   ▼
FastAPI Router
   │
   ▼
Service Layer
   │
   ▼
Repository Layer
   │
   ▼
PostgreSQL
```

## API Layer

Responsável por:

* Receber requisições HTTP
* Validar entrada e saída
* Delegar processamento para as camadas inferiores

## Service Layer

Responsável por:

* Implementar regras de negócio
* Calcular métricas estatísticas
* Executar previsão de séries temporais

## Repository Layer

Responsável por:

* Acesso ao banco de dados
* Operações CRUD
* Isolar a lógica de persistência

## Database Layer

Responsável por:

* Persistência dos dados
* Gerenciamento de conexões
* Armazenamento utilizando PostgreSQL

---

# ⚙️ Configuração

## Variáveis de Ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/meubanco
```

---

# ▶️ Executando Localmente

## Criar ambiente virtual

```bash
python -m venv venv
```

## Ativar ambiente

Linux / macOS:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

## Instalar dependências

```bash
pip install -r requirements.txt
```

## Executar aplicação

```bash
uvicorn app.main:app --reload
```

## Documentação Swagger

```text
http://localhost:8000/docs
```

---

# 🐳 Executando com Docker

```bash
docker compose up --build
```

A API ficará disponível em:

```text
http://localhost:8000
```

---

# 📦 Endpoints

## Health Check

### GET /health

Verifica se a API está operacional.

Resposta:

```json
{
  "status": "ok"
}
```

---

## Criar Série Temporal

### POST /timeseries

Payload:

```json
{
  "values": [10, 20, 30]
}
```

Resposta:

```http
201 Created
```

```json
{
  "id": "c714d020-a4fa-4277-993b-599622fc2289"
}
```

---

## Listar Todas as Séries

### GET /timeseries

Resposta:

```json
[
  {
    "id": "c714d020-a4fa-4277-993b-599622fc2289",
    "values": [10, 20, 30],
    "created_at": "2026-06-03T12:00:00Z"
  }
]
```

---

## Contar Séries

### GET /timeseries/count

Resposta:

```json
{
  "count": 10
}
```

---

## Buscar Série por ID

### GET /timeseries/{id}

Resposta:

```json
{
  "id": "c714d020-a4fa-4277-993b-599622fc2289",
  "values": [10, 20, 30],
  "created_at": "2026-06-03T12:00:00Z"
}
```

---

## Métricas

### GET /timeseries/{id}/metrics

Resposta:

```json
{
  "count": 3,
  "min": 10,
  "max": 30,
  "mean": 20
}
```

---

## Predição

### GET /timeseries/{id}/predict

Resposta:

```json
{
  "predictions": [40.0, 50.0, 60.0, 70.0, 80.0]
}
```

---

## Remover Série

### DELETE /timeseries/{id}

Resposta:

```http
204 No Content
```

---

# 📊 Persistência

Os valores da série temporal são armazenados utilizando o tipo JSONB do PostgreSQL.

Exemplo:

```json
[10, 20, 30, 40]
```

Motivação da escolha:

* Estrutura simples
* Baixa complexidade
* Sem necessidade de relacionamentos adicionais
* Flexibilidade para armazenamento dos dados

---

# 🔮 Predição de Valores

A previsão é realizada utilizando regressão linear simples através da função `numpy.polyfit`.

Fluxo:

1. Conversão da série em pontos (x, y)
2. Ajuste da reta
3. Cálculo dos próximos valores
4. Retorno das previsões

Exemplo:

```text
Entrada:
[10,20,30,40]

Saída:
[50,60,70,80,90]
```

---

# 🧪 Testes Automatizados

Executar testes:

```bash
pytest -v
```

Executar cobertura:

```bash
pytest --cov=app --cov-report=term-missing
```

Cobertura atual:

```text
11 passed
99%+ coverage
```

Os testes validam:

* Health Check
* Criação de séries
* Consulta de séries
* Consulta de todas as séries
* Contagem de séries
* Métricas
* Predição
* Exclusão
* Validação de payloads
* Tratamento de erros

---

# ⚡ Teste de Carga

Implementado utilizando Locust.

Execução:

```bash
locust -f tests/load/locustfile.py
```

Configuração utilizada:

* 50 usuários simultâneos
* 5 usuários por segundo

Endpoints avaliados:

* POST /timeseries
* GET /timeseries/count
* GET /health

Monitoramento:

* SLA de 350ms definido no desafio
* Identificação de requisições acima do limite

---

# 🧠 Decisões Técnicas

## FastAPI

Escolhido por:

* Alta performance
* Documentação automática
* Dependency Injection nativa
* Excelente integração com Pydantic

## PostgreSQL

Escolhido por:

* Confiabilidade
* Suporte avançado a JSONB
* Excelente suporte a dados estruturados

## SQLAlchemy 2.0

Escolhido por:

* ORM maduro
* Tipagem moderna
* Facilidade de manutenção

## JSONB

Escolhido para armazenar os valores da série temporal sem necessidade de modelagem relacional adicional.

## Arquitetura em Camadas

Objetivos:

* Baixo acoplamento
* Alta coesão
* Facilidade de testes
* Facilidade de evolução

---

# 🔮 Melhorias Futuras

* Paginação em GET /timeseries
* Alembic para migrações
* Cache com Redis
* Deploy em Cloud Provider
* CI/CD com GitHub Actions
* Observabilidade com Prometheus e Grafana
* Autenticação JWT
* Rate Limiting
* Modelagem de sensores e múltiplas séries por sensor

---

# 👨‍💻 Autor

Anderson Lopes

Desenvolvido como solução para o desafio técnico de Back-end da Dynamox.
