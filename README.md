# Desafio Developer Challenges - Dynamox

[![Deploy Status](https://img.shields.io/badge/deploy-live-success)](https://developer-challenges-eight.vercel.app/)
[![Python](https://img.shields.io/badge/python-3.11+-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-18+-61dafb)](https://react.dev/)

Sistema de gestão de ativos industriais com monitoramento de sensores, permitindo cadastro de máquinas, pontos de monitoramento e associação de sensores com validações de compatibilidade.

> **A aplicação está em produção e funcionando!** Os links abaixo estão ativos. O Docker é apenas uma alternativa para rodar localmente caso você prefira ou tenha problemas com o setup manual.

## Deploy

- **Frontend (Vercel):** https://developer-challenges-eight.vercel.app/
- **Backend (Railway):** https://developer-challenges-production.up.railway.app/
- **API Docs (Swagger):** https://developer-challenges-production.up.railway.app/docs

## Arquitetura

    ┌─────────────┐ HTTPS ┌──────────────┐ SQL ┌─────────────┐
    │ React │ ◄───────────────► │ FastAPI │ ◄─────────────► │ PostgreSQL │
    │ (Vercel) │ REST API │ (Railway) │ SQLModel │ (Railway) │
    └─────────────┘ └──────────────┘ └─────────────┘


## Tech Stack

### Frontend
- **Framework:** React + Vite + TypeScript
- **State Management:** Redux Toolkit
- **UI Library:** Material UI v5
- **HTTP Client:** Axios
- **Routing:** React Router v6

### Backend
- **Framework:** FastAPI
- **ORM:** SQLModel (Pydantic + SQLAlchemy)
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt

## Pré-requisitos

### Opção 1: Docker (Recomendado)
- **Docker** 20+
- **Docker Compose** 2+

### Opção 2: Setup Manual
- **Python** 3.11+
- **Node.js** 18+
- **PostgreSQL** 14+

## Setup para rodar Local

### Opção A: Com Docker (Mais Rápido) 🐳

Se você tiver Docker instalado, basta executar:

```bash
# 1. Clone o repositório
git clone <repo-url>
cd developer-challenges

# 2. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do PostgreSQL:
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=postgres
# POSTGRES_DB=dynamox

# 3. Suba todos os serviços
docker-compose up --build

# Aguarde os containers iniciarem...
# ✅ Backend: http://localhost:8000
# ✅ Frontend: http://localhost:5173
# ✅ PostgreSQL: localhost:5432
# ✅ API Docs: http://localhost:8000/docs
```

**Comandos úteis:**
```bash
# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Parar e remover volumes (limpa banco)
docker-compose down -v

# Verificar status
docker-compose ps
```

### Opção B: Setup Manual

#### 1. Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite DATABASE_URL e SECRET_KEY conforme necessário

# Rodar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Backend estará em: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

#### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Rodar desenvolvimento
npm run dev
```

- Frontend estará em: http://localhost:5173

## Variáveis de Ambiente

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key-here-generate-with-openssl
ORIGINS=http://localhost:5173,https://your-frontend-url.vercel.app
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000
```

## Estrutura do projeto

```
developer-challenges/
├── backend/
│   ├── app/
│   │   ├── core/           # Configurações, DB, segurança
│   │   ├── modules/        # Auth, Machines, Sensors, etc
│   │   └── models.py       # Modelos SQLModel
│   ├── tests/              # Testes BDD com pytest
│   └── main.py
├── frontend/
│   └── src/
│       ├── app/            # Store Redux
│       ├── components/     # Componentes reutilizáveis
│       ├── features/       # Slices Redux
│       └── pages/          # Páginas da aplicação
└── README.md
```

## Testes

### Backend

O backend possui testes BDD (Behavior Driven Development) usando pytest e pytest-bdd.

**Rodar todos os testes:**
```bash
cd backend

# Com ambiente virtual ativado
python -m pytest -v

# Ou usando pytest diretamente
pytest -v
```

**Rodar testes específicos:**
```bash
# Testar apenas autenticação
pytest tests/test_auth_bdd.py -v

# Testar apenas máquinas
pytest tests/test_machines_bdd.py -v

# Testar apenas pontos de monitoramento
pytest tests/test_monitoring_points_bdd.py -v

# Testar apenas sensores
pytest tests/test_sensors_bdd.py -v
```

**Com cobertura:**
```bash
# Instalar pytest-cov (se necessário)
pip install pytest-cov

# Rodar com relatório de cobertura
pytest --cov=app --cov-report=html --cov-report=term
```

Os testes cobrem:
- ✅ Autenticação (signup, login, JWT)
- ✅ CRUD de Máquinas
- ✅ CRUD de Pontos de Monitoramento
- ✅ Associação e validação de Sensores
- ✅ Regras de negócio (compatibilidade TcAg/TcAs com Pump)

## Regras de Negócio

### Máquinas
- Tipos: **Pump** ou **Fan**
- Pode ter de 0 a 2 pontos de monitoramento
- Não pode alterar tipo se houver sensores TcAg/TcAs associados

### Pontos de Monitoramento
- Cada máquina pode ter no máximo 2 pontos
- Identificação única por máquina
- Pode ter 0 ou 1 sensor associado

### Sensores
- Modelos disponíveis: **TcAg**, **TcAs**, **HF+**
- Restrição: TcAg e TcAs **NÃO** podem ser associados a máquinas tipo **Pump**
- Cada sensor (ID) pode ser associado a apenas 1 ponto (relação 1:1)

## Funcionalidades Implementadas

- ✅ Autenticação JWT com login/signup
- ✅ CRUD completo de Máquinas
- ✅ Gestão de Pontos de Monitoramento
- ✅ Associação de Sensores com validação de compatibilidade
- ✅ Dashboard com paginação e ordenação
- ✅ Validações Frontend + Backend
- ✅ Feedback visual (Snackbars, Dialogs)
- ✅ Proteção de rotas (ProtectedRoute)

## Principais Endpoints

Documentação completa: https://developer-challenges-production.up.railway.app/docs

## Testando a Aplicação

1. Acesse https://developer-challenges-eight.vercel.app/
2. Crie uma conta ou faça login
3. No Dashboard:
   - Clique em "Nova Máquina" para adicionar ativos
   - Expanda uma máquina para adicionar pontos de monitoramento
   - Use "Associar Sensor" para vincular sensores aos pontos
   - Navegue pela aba "Inventário de Pontos" para visão consolidada

## Decisões Técnicas (Assumptions)

### Autenticação e Segurança
- **Token JWT:** Armazenado no localStorage do navegador
- **Sessão persistente:** Token e dados do usuário persistem entre reloads
- **Logout:** Limpa completamente o localStorage (token + user)
- **Senha mínima:** 8 caracteres (máximo 72 para compatibilidade bcrypt)
- **Proteção de rotas:** Todas as rotas privadas verificam autenticação via ProtectedRoute

### Máquinas
- **Tipos fixos:** Apenas "Pump" e "Fan" (enum no backend)
- **Limite de pontos:** Máximo de 2 pontos por máquina para conformidade operacional
- **Alteração de tipo:** Bloqueada se houver sensores TcAg/TcAs associados (validação frontend)
- **Exclusão em cascata:** Ao deletar máquina, todos os pontos e sensores são removidos automaticamente

### Pontos de Monitoramento
- **Identificação:** Nome único dentro de cada máquina (não globalmente único)
- **Limite por máquina:** Máximo 2 pontos (validação no backend)
- **Relação com sensor:** 0 ou 1 sensor por ponto (1:1)
- **Exclusão em cascata:** Ao deletar ponto, sensor associado é removido

### Sensores
- **Modelos disponíveis:** TcAg, TcAs, HF+ (enum no backend)
- **ID do sensor:** Entrada manual simulando etiqueta patrimonial física
- **Unicidade:** Cada ID de sensor pode ser usado apenas uma vez (unique constraint)
- **Restrição Pump:** TcAg e TcAs NÃO podem ser associados a máquinas tipo Pump
- **Validação:** Feita tanto no frontend (UX) quanto backend (segurança)
- **Relação 1:1:** Um sensor pertence a apenas um ponto de monitoramento

### Interface e Paginação
- **Paginação fixa:** 5 itens por página para foco operacional
- **Ordenação:** Suporta ordenação por qualquer coluna (asc/desc)
- **Duas views:** 
  - "Gestão de Máquinas" - CRUD de máquinas com pontos expandíveis
  - "Inventário de Pontos" - Lista consolidada e paginada de todos os pontos
- **Feedback visual:** Snackbars para sucesso/erro, diálogos de confirmação

### Persistência e Database
- **Hard Delete:** Exclusões são físicas (não soft delete)
- **Cascade Delete:** Integridade referencial mantida por cascade no ORM
- **PostgreSQL em produção:** Railway (com migrations automáticas)
- **SQLite em desenvolvimento:** Banco local para facilitar testes

### Backend Stack (Decisão de Implementação)
- **Python/FastAPI ao invés de Node.js:** Escolhido por expertise e rapidez no desenvolvimento
- **SQLModel:** Combina Pydantic + SQLAlchemy para type safety
- **Pytest-BDD:** Testes em formato Gherkin (Given/When/Then) para legibilidade
