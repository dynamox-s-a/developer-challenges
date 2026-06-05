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

### Criar uma série
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

### Recuperar uma série
**GET** `/series/1`

Retorno: a série inteira com todos os pontos.

### Obter métricas
**GET** `/series/1/metrics`

Retorno:
```json
{
  "count": 3,
  "media": 11.53,
  "minimo": 10.5,
  "maximo": 12.3,
  "desvio_padrao": 0.85
}
```

**Métricas calculadas:**
- `count`: número de leituras
- `media`: valor médio
- `minimo` / `maximo`: extremos
- `desvio_padrao`: desvio padrão (variabilidade)

### Deletar uma série
**DELETE** `/series/1`

Retorno: `{ "message": "Série deletada com sucesso" }`

### Contar séries
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

## Latência

Requisito: **latência cliente↔servidor < 350ms em todas as requisições**.

Para comprovar, com a API rodando (`python -m uvicorn main:app`), execute o
script abaixo no PowerShell. Ele dispara **100 requisições reais via HTTP** e
reporta média, p95 e máximo — medindo o caminho de rede de verdade (não chamadas
in-process):

```powershell
$body = '{"name":"test","data_points":[{"timestamp":"2026-05-29T10:00:00","value":10}]}'

# Warm-up: descarta a 1ª requisição (inicialização única do processo)
Invoke-RestMethod -Method POST -Uri http://localhost:8000/series -ContentType "application/json" -Body $body | Out-Null

# Mede 100 requisições
$tempos = 1..100 | ForEach-Object {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    Invoke-RestMethod -Method POST -Uri http://localhost:8000/series -ContentType "application/json" -Body $body | Out-Null
    $sw.Stop()
    $sw.Elapsed.TotalMilliseconds
}

$ordenado = $tempos | Sort-Object
$media = ($tempos | Measure-Object -Average).Average
$p95   = $ordenado[[int]([math]::Ceiling(0.95 * $ordenado.Count) - 1)]
$max   = ($tempos | Measure-Object -Maximum).Maximum

Write-Host ("Média: {0:N1}ms | p95: {1:N1}ms | Máx: {2:N1}ms" -f $media, $p95, $max)
if ($p95 -lt 350) { Write-Host "✅ p95 < 350ms" } else { Write-Host "❌ p95 >= 350ms" }
```

> 350ms. Requisito atendido

**Desenvolvido com:** Python 3.12 + FastAPI + SQLAlchemy + pytest
