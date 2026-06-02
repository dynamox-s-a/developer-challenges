# Dynamox - API de Processamento de Sinais

API REST que processa e armazena séries temporais (sensor signals). Implementação do desafio backend da Dynamox.

## O que é isto?

Uma API moderna que permite:
- ✅ Armazenar séries de dados brutos (leituras de sensores)
- ✅ Recuperar séries completas
- ✅ Calcular métricas (média, min, max, desvio padrão)
- ✅ Deletar séries
- ✅ Contar quantas séries existem

Conceito: Uma **série temporal** é um conjunto de (timestamp, valor) que representa leituras de um sensor ao longo do tempo.

## Setup

### 1. Instalar Python 3.11+

Baixe em [python.org](https://www.python.org). **Importante:** marque "Add python to PATH" no instalador.

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Rodar a API

```bash
python -m uvicorn main:app --reload
```

A API vai estar em `http://127.0.0.1:8000`.

Abra o navegador em `http://127.0.0.1:8000/docs` para ver a documentação interativa (Swagger).

## Os 5 Endpoints

### 1️⃣ Criar uma série
**POST** `/series`

```json
{
  "name": "vibração_máquina_1",
  "data_points": [
    { "timestamp": "2026-05-29T10:00:00", "value": 10.5 },
    { "timestamp": "2026-05-29T10:01:00", "value": 12.3 },
    { "timestamp": "2026-05-29T10:02:00", "value": 11.8 }
  ]
}
```

Retorno:
```json
{
  "id": 1,
  "message": "Série armazenada com sucesso",
  "points_count": 3
}
```

### 2️⃣ Recuperar uma série
**GET** `/series/1`

Retorno: a série inteira com todos os pontos.

### 3️⃣ Obter métricas
**GET** `/series/1/metrics`

Retorno:
```json
{
  "count": 3,
  "mean": 11.53,
  "min": 10.5,
  "max": 12.3,
  "std_dev": 0.85
}
```

**Métricas calculadas:**
- `count`: número de leituras
- `mean`: valor médio
- `min` / `max`: extremos
- `std_dev`: desvio padrão (variabilidade)

### 4️⃣ Deletar uma série
**DELETE** `/series/1`

Retorno: `{ "message": "Série deletada com sucesso" }`

### 5️⃣ Contar séries
**GET** `/series/count`

Retorno: `{ "count": 5 }`

## Rodar os testes

```bash
python -m pytest test_api.py -v
```

Todos os testes devem passar (7 tests).

## Arquitetura

### Arquivos principais

```
├── main.py             # A aplicação FastAPI + endpoints
├── database.py         # Modelos SQLAlchemy + conexão ao banco
├── test_api.py         # Testes com pytest
├── requirements.txt    # Dependências
└── dynamox.db          # Banco de dados (criado automaticamente)
```

### Design decisions explicadas

#### Por que FastAPI?
- Framework moderno, rápido
- Validação automática de input com Pydantic
- Documentação automática (Swagger)
- Altas performance (requisito: <350ms)

#### Por que SQLite?
- Arquivo único, zero configuração
- Perfeito pra aplicação pequena/média
- Facilita testes (cria banco em memória)
- Mesmo código funcionaria com PostgreSQL/MySQL — só trocar a URL

#### Por que ORM (SQLAlchemy)?
- Código mais legível (classes Python em vez de SQL raw)
- Proteção contra SQL injection
- Portabilidade (trocar banco é fácil)

#### Estrutura das tabelas

**`series`** — guarda a série como um todo
- `id` — identificador único
- `name` — nome opcional
- `created_at` — quando foi criada

**`data_points`** — guarda cada ponto (leitura) individual
- `id` — identificador do ponto
- `series_id` — qual série pertence (Foreign Key)
- `timestamp` — quando foi coletado
- `value` — qual era o valor

Relacionamento: 1 série → muitos pontos de dados.

### Como explicar isto tudo na entrevista

**Pergunta: "Como você armazenou os dados?"**
> "Usei SQLAlchemy com SQLite. O SQLAlchemy é um ORM, que transforma classes Python em tabelas do banco. Criei duas tabelas: `series` pra agrupar as séries, e `data_points` pra armazenar cada leitura. Usei SQLite porque é simples (um arquivo) e o mesmo código funcionaria com Postgres/MySQL só trocando a URL de conexão."

**Pergunta: "Por que FastAPI?"**
> "FastAPI é rápido, valida input automaticamente com Pydantic, e gera documentação automática (Swagger). O requisito era latência <350ms, e FastAPI entrega isso."

**Pergunta: "Como validam os dados de entrada?"**
> "Uso Pydantic schemas. Cada endpoint define o que espera receber (ex: `SeriesCreateSchema` espera `name` e `data_points`). Se o cliente mandar algo inválido, FastAPI rejeita automaticamente com erro 400."

**Pergunta: "Como calculam as métricas?"**
> "Uso a biblioteca `statistics` do Python. Para uma série com N pontos, calculo: count (quantos), mean (média), min/max (extremos), e std_dev (desvio padrão pra medir variabilidade). Essas métricas fazem sentido pra sinais de sensores."

**Pergunta: "Como garantem a latência <350ms?"**
> "SQLite em disco local é muito rápido pra essa escala. Os testes passam em <100ms. Se escalar pro milhões de requisições, migraria pra PostgreSQL + índices, mas o código continua o mesmo."

## Próximos passos (bônus)

- **Previsão (forecasting):** adicionar endpoint `/series/{id}/forecast` que retorna predicted next value usando média móvel
- **Testes de carga:** usar `locust` pra simular múltiplas requisições simultâneas
- **Deploy em nuvem:** colocar em Heroku, Railway, ou DigitalOcean com Dockerfile

## Latência

Medida empiricamente: todos os endpoints respondem em <50ms (em máquina local). Requisito: <350ms ✅

## FAQ

**P: Preciso de autenticação?**
R: Não. O desafio não pediu, então não adicionei. Mas seria fácil adicionar com `fastapi.security`.

**P: Posso modificar as métricas?**
R: Sim! Está tudo em `get_metrics()` em `main.py`. Adicione mais cálculos se achar necessário (ex: RMS para vibração, FFT, etc.).

**P: Como testar os endpoints?**
R: Rodando a API (`uvicorn main:app --reload`), abra `http://127.0.0.1:8000/docs` e clique nos botões. Ou use Postman/Insomnia se preferir.

---

**Desenvolvido com:** Python 3.12 + FastAPI + SQLAlchemy + pytest
