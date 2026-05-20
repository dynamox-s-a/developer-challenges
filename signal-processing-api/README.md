# Signal Processing API

API REST para armazenamento, consulta, remoção e cálculo de métricas de séries temporais. O projeto foi desenvolvido para o desafio de back-end da Dynamox usando FastAPI, SQLAlchemy, PostgreSQL e testes automatizados com pytest.

## Visão Geral

A aplicação permite que um usuário envie dados brutos de uma série temporal associada a um dispositivo, consulte os dados armazenados, calcule métricas da série, remova registros e conte quantas séries possuem dados ativos.

Nesta implementação, cada série temporal é identificada pelo dispositivo que envia os dados. O `Device` representa a origem da série temporal, enquanto os registros de `RawData` representam os pontos da série ao longo do tempo. Dessa forma, um dispositivo com dados armazenados equivale a uma série temporal ativa no servidor.

Funcionalidades implementadas:

- Armazenar dados brutos de séries temporais.
- Recuperar métricas de uma série temporal.
- Remover os dados de uma série temporal.
- Consultar a quantidade de séries temporais armazenadas, contando dispositivos com dados ativos.
- Recuperar a série temporal completa de um dispositivo.
- Listar as séries temporais completas agrupadas por dispositivo.
- Listar todos os devices cadastrados, mesmo aqueles sem dados associados.
- Validar payloads inválidos, timestamps sem timezone, timestamps futuros e registros duplicados.

## Tecnologias

- Python 3.12
- FastAPI
- SQLAlchemy
- PostgreSQL
- Docker e Docker Compose
- Pytest


## Ambiente de Produção
A Api esta publicada e configurada em um ambiente de produção na Oracle Cloud com alta disponibilidade(Load Balancer Nginx + 3 réplicas de aplicação) e banco de dados PostgreSQL gerenciado. 

- **URL Base da API:** [http://163.176.152.66](http://163.176.152.66)
- **Swagger UI (Documentação Interativa):** [http://163.176.152.66/docs](http://163.176.152.66/docs)



## Como Executar Com Docker

Clonar repositório

```bash
git clone 
```
Acessar a pasta do projeto
```bash

cd  developer-challenges\signal-processing-api
```

Construir e iniciar containers

```bash
docker compose up --build
```

A API ficará disponível em:

- API: `http://localhost`
- Swagger: `http://localhost/docs`
- Health check: `http://localhost/`

Para executar em segundo plano:

```powershell
docker compose up -d --build
```

Para parar os containers sem apagar os dados do banco:

```powershell
docker compose down
```

Para parar os containers e apagar também o volume do PostgreSQL:

```powershell
docker compose down -v
```

> Observação: os dados do PostgreSQL são persistidos no volume Docker `db_data`. Portanto, `docker compose down` mantém os dados, enquanto `docker compose down -v` remove o volume e reinicia o banco vazio.

## Como Executar Localmente

1. Crie e ative um ambiente virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Instale as dependências:

```powershell
pip install -r requirements.txt
```

3. Configure a variável de ambiente `DATABASE_URL`:

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/timeseries_db"
```

4. Inicie a aplicação:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

A API ficará disponível em:

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/`

## Como Rodar os Testes

Localmente:

```powershell
python -m pytest
```

Com Docker:

```powershell
docker compose run --rm api1 python -m pytest
```

Testes de performance/latência:

```powershell
python -m pytest -m performance
```

Esses testes medem os principais endpoints contra o limite de 350ms definido no desafio.

## 🛠️ Como Testar a API

Você pode testar os endpoints e as regras de validação (como bloqueio de registros duplicados ou com datas futuras) de duas formas: através da documentação interativa ou por clientes HTTP externos.

### Definição da URL Base
Escolha o endereço de acordo com o ambiente que deseja testar:
- **Ambiente de Produção (Live):** `http://163.176.152.66`
- **Ambiente Local (Docker):** `http://localhost` (ou `http://localhost:8000` se acessar a API diretamente sem o Nginx)

---

### 1. Pelo Swagger UI (Direto no Navegador)
A documentação interativa do FastAPI permite executar testes rápidos sem instalar nada:
1. Acesse o Swagger adicionando `/docs` ao final da sua URL Base escolhida:
   - Produção: [http://163.176.152.66/docs](http://163.176.152.66/docs)
   - Local: `http://localhost/docs`
2. Clique no endpoint desejado (ex: `POST /api/v1/signals`).
3. Clique no botão **"Try it out"**.
4. Insira o JSON de teste no campo de texto e clique em **"Execute"**.
5. O retorno do servidor e o status HTTP (ex: `201`, `400`) serão exibidos na tela.

### 2. Por Ferramentas Externas (Postman / Insomnia)
Para criar coleções de testes automatizados ou monitorar o desempenho de requisições mais robustas:
1. Crie uma nova requisição configurando o método correspondente (`POST`, `GET`, `DELETE`).
2. Monte o endereço utilizando o formato: `URL_BASE/nome-da-rota`
   - *Exemplo de POST em produção:* `http://163.176.152.66/raw_data`
   - *Exemplo de POST local:* `http://localhost/raw_data`



## Modelo de Dados

A aplicação possui duas entidades principais:

- `Device`: representa o identificador e a origem da série temporal.
- `RawData`: representa cada ponto enviado por esse dispositivo, contendo `timestamp` e `value`.

Na prática, a série temporal é formada pelo conjunto de registros `RawData` associados a um mesmo `Device`.

Regras importantes:

- `serial_device` é normalizado com `strip()` e `upper()`.
- Um dispositivo é criado automaticamente quando recebe sua primeira série, mesmo todos os dados sendo rejeitados por serem duplicados ou inválidos. Isso garante que o histórico de dispositivos seja mantido mesmo sem dados associados. Não será criado o dispositivo se o payload for completamente inválido (ex: `serial_device` vazio ou `data` vazio), pois a validação do Pydantic bloqueia a requisição inteira nesses casos.

- Não é permitido inserir dois dados com o mesmo `timestamp` para o mesmo dispositivo.
- Timestamps futuros são rejeitados.
- Timestamps sem timezone são rejeitados.
- Payloads com `serial_device` vazio ou lista `data` vazia são rejeitados.

## Endpoints

### Health Check

```http
GET /
```

Resposta:

```json
{
  "status": "ok"
}
```

### Criar Dados Brutos

```http
POST /raw_data
```

Exemplo de payload:

```json
{
  "serial_device": "DEV-123",
  "data": [
    {
      "timestamp": "2026-05-18T22:00:00Z",
      "value": 23.5
    },
    {
      "timestamp": "2026-05-18T22:01:00Z",
      "value": 24.0
    }
  ]
}
```

Exemplo de resposta:

```json
{
  "device_id": 1,
  "serial_device": "DEV-123",
  "inserted": 2,
  "rejected": 0,
  "details": []
}
```

Quando o payload contém registros duplicados, futuros ou já existentes, a API mantém os registros válidos e retorna os rejeitados em `details`.
**Nota:** Se o payload contiver erros de formato (como um texto no campo `value` ou um `timestamp` sem fuso horário), a validação inicial do Pydantic irá bloquear a requisição inteira.


### Buscar Métricas de Uma Série

```http
GET /raw_data/{device_id}/metrics
```

Exemplo de resposta:

```json
{
  "device_id": 1,
  "metrics": {
    "total_records": 2,
    "average_value": 23.75,
    "max": {
      "value": 24.0,
      "timestamp": "2026-05-18T22:01:00"
    },
    "min": {
      "value": 23.5,
      "timestamp": "2026-05-18T22:00:00"
    }
  },
  "period": {
    "start_time": "2026-05-18T22:00:00",
    "end_time": "2026-05-18T22:01:00"
  }
}
```

### Remover Dados de Um Dispositivo

```http
DELETE /raw_data/{device_id}
```

Exemplo de resposta:

```json
{
  "success": true,
  "deleted_records": 2
}
```

Nesta implementação, a remoção é feita por dispositivo, ou seja, ao chamar esse endpoint, todos os registros associados ao `device_id` especificado serão removidos do banco de dados. Matnendo o device cadastrado, mas sem registros associados, o que é útil para manter o histórico de dispositivos mesmo após a remoção dos dados.

### Contar Séries Temporais Armazenadas

```http
GET /devices/count/active
```

Nesta implementação, uma série temporal é identificada pelo dispositivo que envia os dados. Por isso, este endpoint conta os dispositivos que possuem ao menos um registro em `RawData`, retornando a quantidade de séries temporais ativas no servidor.

Exemplo de resposta:

```json
{
  "active_devices_count": 1
}
```

### Buscar Série Temporal de Um Dispositivo

```http
GET /devices/{device_id}/raw-data
```

Este endpoint aceita paginação opcional por query params:

- `limit`: quantidade máxima de pontos retornados. Valor mínimo: `1`. Valor máximo: `1000`.
- `offset`: quantidade de pontos ignorados antes de iniciar o retorno. Valor mínimo: `0`.

Exemplo buscando os primeiros 100 pontos da série temporal:

```http
GET /devices/1/raw-data?limit=100&offset=0
```

Exemplo buscando os próximos 100 pontos:

```http
GET /devices/1/raw-data?limit=100&offset=100
```

Nesse caso, `offset=100` significa que a API ignora os 100 primeiros pontos da série e retorna a próxima página de resultados.

Exemplo de resposta:

```json
[
  {
    "timestamp": "2026-05-18T22:00:00",
    "value": 23.5
  },
  {
    "timestamp": "2026-05-18T22:01:00",
    "value": 24.0
  }
]
```

### Listar Todas as Séries Temporais

```http
GET /raw_data/full_time_series
```

Este endpoint também aceita paginação opcional:

- `limit`: quantidade máxima de pontos de dados retornados. Valor mínimo: `1`. Valor máximo: `1000`.
- `offset`: quantidade de pontos ignorados antes de iniciar o retorno. Valor mínimo: `0`.

Exemplo:

```http
GET /raw_data/full_time_series?limit=100&offset=0
```

A paginação é aplicada sobre os pontos de dados antes do agrupamento por dispositivo. Por isso, uma mesma série temporal pode aparecer em páginas diferentes quando houver muitos registros.

Exemplo de resposta:

```json
[
  {
    "device_id": 1,
    "series_data": [
      {
        "id": 1,
        "timestamp": "2026-05-18T22:00:00",
        "value": 23.5
      }
    ]
  }
]
```

### Listar Todas os Devices cadastrados
```http
GET /devices
```
Lista todos os devices cadastrados, mesmo aqueles sem dados associados (ou seja, sem séries temporais ativas). Isso é útil para manter um histórico completo dos dispositivos que já interagiram com a API, mesmo que seus dados tenham sido removidos posteriormente.
```json
[
  {
    "id": 4,
    "name": "device-DEV-TEST-100",
    "serial_device": "DEV-TEST-100",
    "created_at": "2026-05-20T17:48:27.969195Z"
  },
  {
    "id": 3,
    "name": "device-DEV-TEST-50",
    "serial_device": "DEV-TEST-50",
    "created_at": "2026-05-20T17:42:57.775106Z"
  }
]
```

## Padrão de Erros

Erros de domínio, como dispositivo inexistente, seguem o formato:

```json
{
  "success": false,
  "error": "Device not found",
  "error_code": "NotFoundException"
}
```

Erros de validação seguem o formato:

```json
{
  "success": false,
  "error": "Invalid request payload",
  "error_code": "ValidationError",
  "details": []
}
```

## Persistência

O banco principal da aplicação é PostgreSQL. Ao executar com Docker Compose, o serviço `db` usa um volume nomeado chamado `db_data`, garantindo que os dados continuem disponíveis após reiniciar os containers.

Arquivos gerados localmente, como bancos SQLite de teste e arquivos `.pyc`, não devem ser versionados.

## Observações Técnicas

- A criação das tabelas é feita automaticamente na inicialização da aplicação com SQLAlchemy.
- A camada de service concentra as regras de negócio.
- A camada de repossitory concentra as consultas e operações de banco.
- A camada routes define os endpoints e a validação de entrada.
- Os testes cobrem os principais fluxos de criação, consulta, remoção, métricas, validação e contagem de séries.
- O Nginx é configurado como load balancer para distribuir requisições entre múltiplas instâncias da API, simulando um ambiente de produção escalável.
- O endpoint `/instance` permite verificar qual instância da API processou a requisição, facilitando a observação do balanceamento de carga.
- O projeto é estruturado para ser facilmente extensível, permitindo a adição de novas funcionalidades ou endpoints sem impactar a organização atual.
- As credencias do banco de dados foram mantidadas no docker compose para facilitar a execução local, mas em um ambiente de produção real, recomenda-se o uso de variáveis de ambiente ou serviços de gerenciamento de segredos para proteger essas informações sensíveis.


## Status dos Testes

Resultado esperado:

```text
36 passed
```

## Load Balancer (Nginx)
Foi adicionado um Nginx como reverse proxy e load balancer, responsável por distribuir as requisições entre múltiplas instâncias da API (api1, api2 e api3), utilizando estratégia de balanceamento round-robin.

Essa abordagem simula um ambiente de escalabilidade horizontal, onde múltiplas réplicas da aplicação recebem tráfego de forma distribuída.

Rota de teste de instância

Para validar o comportamento do load balancer, foi criada uma rota auxiliar de debug:

```http
GET /instance
```

Essa rota retorna informações da instância da API que processou a requisição, permitindo observar a distribuição de carga entre os containers.

Exemplo de resposta:

```json
{
  "instance": "api1",
  "hostname": "608b869670fd"
}
```