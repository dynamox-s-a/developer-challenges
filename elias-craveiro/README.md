# Dynamox Full-Stack Developer Challenge (Nx Monorepo)

Aplicação full-stack com **React + TypeScript (Vite)** no frontend e **Node.js + Express + TypeScript** no backend, usando **PostgreSQL + Prisma** para persistência.

Implementa:
- Autenticação (credenciais fixas via seed)
- CRUD de Machines
- Monitoring Points + associação de Sensor com regra de negócio (Pump)
- Listagem de Monitoring Points paginada + ordenável (server-side)
- Time-series: armazenamento, métricas, contagem, deleção, recuperação e gráfico (Recharts)

---

## Tech Stack

### Frontend
- Vite + React + TypeScript
- Material UI 5
- Redux Toolkit + Thunks
- React Router
- Recharts
- Testes: Vitest + Testing Library

### Backend
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT Auth (Bearer token)
- Validação: Zod
- Testes: Jest + Supertest

---

## Assumptions (Ambiguity Handling)

- A autenticação usa **JWT access token** simples (sem refresh token), para manter o fluxo direto no desafio.
- O token é armazenado em **localStorage** (simplicidade para o challenge).
- O model de sensor `"HF+"` é persistido como **`HF_PLUS`** no banco e exibido como `"HF+"` na UI.
- A listagem de monitoring points é **paginada e ordenada no servidor**.
- `pageSize` é limitado a **5 itens por página** (requisito do enunciado).
- Time-series:
    - limite de inserção: **até 20k pontos por request**
    - limite de leitura: **até 5k pontos por request**
    - métricas calculadas via Prisma aggregate (`min/max/avg/count`)
- Ownership é respeitado no backend:
    - o usuário só acessa Machines/MPs/time-series que pertencem a ele.
- Ambiente de desenvolvimento usa **PostgreSQL local**.

---

## Requirements Coverage

### Authentication
- Implementado: login com credenciais seed
- Implementado: logout
- Implementado: rotas privadas protegidas no frontend e backend

### Machine Management
- Implementado: Create / List / Update / Delete
- Tipos: `Pump` e `Fan`

### Monitoring Points + Sensors
- Implementado: criação de monitoring points por machine
- Implementado: attach sensor (`uid` único, model em `TcAg | TcAs | HF+`)
- Implementado: regra de negócio
    - Machines do tipo **Pump** NÃO aceitam sensores **TcAg** e **TcAs**
- Implementado: listagem paginada (5/page) com:
    - Machine Name, Machine Type, Monitoring Point Name, Sensor Model
- Implementado: sorting por qualquer coluna (asc/desc)

### Time-Series
- Implementado: store raw time-series points
- Implementado: count
- Implementado: metrics
- Implementado: retrieve series
- Implementado: delete series (total ou por range)
- Implementado: gráfico (Recharts)

---

## Project Structure (Nx)

```
apps/
  api/  -> Express + Prisma + PostgreSQL
  web/  -> Vite + React + Redux + MUI
```

---

## Getting Started

### Pré-requisitos
- Node.js (LTS recomendado)
- PostgreSQL rodando localmente
- `DATABASE_URL` configurado

---

## Setup

### 1) Criar o Banco de Dados
Na raiz do repo:

```bash
docker compose up --build -d
```

### 2) Instalar dependências
Na raiz do repo:

```bash
npm install
```

### 3) Configurar env da API
Crie `apps/api/.env`:

```env
PORT=3001

#postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
DATABASE_URL="postgresql://dynamox:dynamox@localhost:5433/dynamox?schema=public"

JWT_SECRET="dev-secret"
JWT_REFRESH_SECRET="dev-refresh-secret"
```

Crie `apps/web/.env`:

```env
VITE_API_URL=/api
```

### 4) Prisma migrate + seed
```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

### 5) Rodar API e WEB
Em dois terminais na raiz do repo:

```bash
npx nx serve api
npx nx serve web
```

Frontend: http://localhost:4200  
Backend: http://localhost:3001

---

## Default Credentials

Usuário seed:
- Email: `admin@dynamox.com`
- Password: `123456`

---

## API Overview

### Auth
- `POST /auth/login` -> retorna `{ accessToken, user }`

### Machines (private)
- `GET /machines`
- `POST /machines`
- `PUT /machines/:id`
- `DELETE /machines/:id`

### Monitoring Points (private)
- `GET /monitoring-points?page=1&pageSize=5&sort=machineName&dir=asc`
- `POST /monitoring-points`
- `PUT /monitoring-points/:id`
- `DELETE /monitoring-points/:id`

### Sensors (private)
- `POST /monitoring-points/:id/sensor`
- `DELETE /monitoring-points/:id/sensor`

### Time-series (private)
- `POST /monitoring-points/:id/timeseries`
- `GET /monitoring-points/:id/timeseries`
- `GET /monitoring-points/:id/timeseries/count`
- `GET /monitoring-points/:id/timeseries/metrics`
- `DELETE /monitoring-points/:id/timeseries`

---

## Testing

### Backend (Jest + Supertest)
Na raiz do repo:

```bash
JEST_DISABLE_WATCHMAN=1 npx nx test api
```

Se bater limite de watches (Linux), rode:

```bash
sudo sysctl -w fs.inotify.max_user_watches=524288
```

(opcional persistente)
```bash
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Frontend (Vitest + Testing Library)
Na raiz do repo:

```bash
npx nx test web
```

---

## Performance Notes (Latency)

- CRUD e listagens são queries leves com filtros por ownership.
- Time-series insert usa `createMany` para batch eficiente.
- Time-series retrieve tem `limit` para evitar payload pesado.
- Métricas calculadas via aggregate no banco (sem pós-processamento pesado).
