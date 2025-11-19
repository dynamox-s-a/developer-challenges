# API de Séries Temporais - Dynamox

API REST desenvolvida em FastAPI para gerenciamento de séries, dispositivos, clientes e usuários. 
O sistema permite armazenar dados brutos de sensores, calcular métricas estatísticas e gerenciar dispositivos.

## 🚀 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para Python
- **PostgreSQL** - Banco de dados relacional
- **Pydantic** - Validação de dados
- **JWT** - Autenticação via tokens
- **Docker** - Containerização do banco de dados
- **Uvicorn** - Servidor ASGI

## 📋 Pré-requisitos

- Python 3.8+
- Docker e Docker Compose (para o banco de dados)
- pip (gerenciador de pacotes Python)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/ricardojunior32/python-back-end-test.git
cd python-back-end-test
```

### 2. Crie um ambiente virtual

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente

**Para desenvolvimento local:**

Copie o arquivo de exemplo e configure:
```bash
cp env.example .env
```

Edite o arquivo `.env` e configure a URL do banco de dados:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dynamox
```

**Importante:** O arquivo `.env` não é versionado (está no `.gitignore`). Nunca commite credenciais!

### 5. Inicie o banco de dados

```bash
docker-compose up -d
```

Isso irá iniciar um container PostgreSQL na porta 5432.

### 6. Execute a aplicação

```bash
uvicorn main:app --reload
```

A API estará disponível em: `http://127.0.0.1:8000`

### 7. Documentação interativa

Acesse a documentação automática do FastAPI:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

## 🔐 Autenticação

Todas as rotas necessitam de autenticação via JWT. Para obter um token:

1. Faça login em `POST /auth/login`
2. Use o token retornado no Auth/Bearer token das requisições. O Token tem duração de 1hora:
   ```
   Auth -> Bearer Token -> Copiar e colar o access_token da rota de login
   ```

## 📚 Rotas da API
### 🔑 Autenticação (`/auth`)

#### `POST /auth/login`
Realiza login e retorna um token JWT.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### 📊 Séries Temporais (`/series`)
#### `POST /series`
Cria uma nova série temporal com dados brutos.

**Body:**
```json
{
  "device_uid": "204262e6-c240-4207-ab61-c054f0174436",
  "values": [
    {
      "value": 1.5,
      "timestamp": "2025-11-18T10:30:00",
      "quality": "good",
      "unit": "g-force"
    },
    {
      "value": 2.3,
      "timestamp": "2025-11-18T10:31:00",
      "quality": "good",
      "unit": "g-force"
    }
  ]
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "device_uid": "204262e6-c240-4207-ab61-c054f0174436",
  "values": [
    {
      "value": 1.5,
      "timestamp": "2025-11-18T10:30:00",
      "quality": "good",
      "unit": "g-force"
    }
  ],
  "created_at": "2025-11-18T10:30:00",
  "updated_at": "2025-11-18T10:30:00"
}
```
---

#### `GET /series/{series_id}`
Recupera uma série temporal completa pelo ID.
**Parâmetros:**
- `series_id` (int): ID da série temporal

**Resposta (200):**
```json
{
  "id": 1,
  "device_uid": "204262e6-c240-4207-ab61-c054f0174436",
  "values": [...],
  "created_at": "2025-11-18T10:30:00",
  "updated_at": "2025-11-18T10:30:00"
}
```
---

#### `GET /series/{series_id}/metrics`
Recupera métricas de uma série temporal .

**Parâmetros:**
- `series_id` (int): ID da série temporal

**Resposta (200):**
```json
{
  "mean": 1.9,
  "min": 1.5,
  "max": 2.3,
  "std": 0.4,
  "count": 2
}
```
---

#### `GET /series/count/{client_id}`
Retorna o número total de séries temporais de um cliente.
**Parâmetros:**
- `client_id` (int): ID do cliente

**Resposta (200):**
```json
{
  "count": 15
}
```

---

#### `GET /series/client/{client_id}`
Lista todas as séries temporais de um cliente.
**Parâmetros:**
- `client_id` (int): ID do cliente

**Resposta (200):**
```json
[
  {
    "id": 1,
    "device_uid": "204262e6-c240-4207-ab61-c054f0174436",
    "values": [...],
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```
---

#### `GET /series/device/{device_uid}/list`
Lista todas as séries temporais de um dispositivo.

**Parâmetros:**
- `device_uid` (string): UID único do dispositivo

**Resposta (200):**
```json
[
  {
    "id": 1,
    "device_uid": "204262e6-c240-4207-ab61-c054f0174436",
    "values": [...],
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

---

#### `DELETE /series/{series_id}`
Deleta uma série temporal (soft delete - marca como inativa).

**Parâmetros:**
- `series_id` (int): ID da série temporal
- `deleted_by` (query, opcional): Quem deletou (padrão: "system")

**Resposta (200):**
```json
{
  "message": "Series deleted successfully",
  "status": true
}
```
---

### 📱 Dispositivos (`/devices`)
#### `POST /devices`
Cria um novo dispositivo.

**Body:**
```json
{
  "name": "Sensor TCAG",
  "client_id": 1,
  "sensor_type": "tcag"
}
```

**Tipos de sensor disponíveis:**
- `tcag`
- `tcas`
- `hfplus`

**Resposta (200):**
```json
{
  "id": 1,
  "uid": "204262e6-c240-4207-ab61-c054f0174436",
  "name": "Sensor TCAG",
  "client_id": 1,
  "sensor_type": "tcag"
}
```

---

#### `GET /devices/{device_id}`
Recupera um dispositivo pelo ID.

**Parâmetros:**
- `device_id` (int): ID do dispositivo

**Resposta (200):**
```json
{
  "id": 1,
  "uid": "204262e6-c240-4207-ab61-c054f0174436",
  "name": "Sensor TCAG",
  "client_id": 1,
  "sensor_type": "tcag"
}
```
---

#### `GET /devices/{client_id}`
Lista todos os dispositivos de um cliente.

**Parâmetros:**
- `client_id` (string): ID do cliente

**Resposta (200):**
```json
[
  {
    "id": 1,
    "uid": "204262e6-c240-4207-ab61-c054f0174436",
    "name": "Sensor TCAG",
    "sensor_type": "tcag",
    "client_id": 1
  }
]
```
---

### 👥 Clientes (`/clients`)
#### `POST /clients`
Cria um novo cliente.

**Body:**
```json
{
  "name": "Empresa ABC",
  "email": "contato@empresa.com",
  "document": "12345678000190"
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "name": "Empresa ABC",
  "email": "contato@empresa.com",
  "document": "12345678000190"
}
```

---

#### `GET /clients/{client_id}`
Recupera um cliente pelo ID.

**Parâmetros:**
- `client_id` (int): ID do cliente

**Resposta (200):**
```json
{
  "id": 1,
  "name": "Empresa ABC",
  "email": "contato@empresa.com",
  "document": "12345678000190"
}
```

---

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas:

- **users**: Usuários do sistema
- **clients**: Clientes
- **devices**: Dispositivos/sensores
- **timeseries**: Séries temporais de dados

## 🚀 Deploy no Railway
O projeto está configurado para deploy no Railway. Assim que as alterações são efetuadas e enviadas para a main o deploy é feito automático.

### Link para API publica`
```
https://python-back-end-test-production.up.railway.app
```

## 🧪 Testes

O projeto inclui testes automatizados usando pytest. Os testes cobrem todas as rotas principais da API.

### Executando os Testes

**Executar todos os testes:**
```bash
pytest
```

**Executar com output detalhado:**
```bash
pytest -v
```

**Executar um arquivo específico:**
```bash
pytest tests/test_series.py
```

**Executar um teste específico:**
```bash
pytest tests/test_series.py::test_create_series_success
```

**Executar com cobertura:**
```bash
pytest --cov=app --cov-report=html
```

### Estrutura de Testes

Os testes estão organizados em:
- `tests/conftest.py` - Features compartilhadas (banco de dados de teste, clientes, etc.)
- `tests/test_auth.py` - Testes de autenticação
- `tests/test_series.py` - Testes de séries temporais
- `tests/test_devices.py` - Testes de dispositivos
- `tests/test_clients.py` - Testes de clientes

### Configuração dos Testes

Os testes utilizam um banco de dados SQLite em memória, isolado para cada teste. Isso garante que:
- Cada teste começa com um banco limpo
- Os testes não interferem uns nos outros
- Não é necessário configurar um banco de dados separado para testes

### Features Disponíveis

- `db` - Sessão do banco de dados de teste
- `client` - Cliente HTTP de teste (não autenticado)
- `test_user` - Usuário de teste criado automaticamente
- `auth_token` - Token JWT para autenticação
- `authenticated_client` - Cliente HTTP autenticado
- `test_client` - Cliente de teste criado automaticamente
- `test_device` - Dispositivo de teste criado automaticamente
- `test_series` - Série temporal de teste criada automaticamente
