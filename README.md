# Dynamox Full-Stack Challenge

Sistema de monitoramento de máquinas e sensores desenvolvido com React, Fastify e PostgreSQL.

---

## Planejamento de 7 Dias

### Dia 1 (01/02) — Setup + Autenticação Backend ✅
- [x] Configurar Git (branch `gabriel-leite-araujo`, remote)
- [x] Limpar arquivos desnecessários do repo
- [x] Corrigir tsconfig.spec.json faltante
- [x] Configurar seed do usuário com bcryptjs
- [x] Estrutura de camadas (repositories, services, routes)
- [x] POST /auth/login com JWT funcionando
- [x] Configurar ts-node-dev para hot reload

### Dia 2 (02/02) — Backend: Auth Middleware + Machines
- [ ] Criar middleware de autenticação JWT
- [ ] Decorator `authenticate` para rotas protegidas
- [ ] CRUD `/machines`:
  - [ ] POST /machines (criar)
  - [ ] GET /machines (listar)
  - [ ] GET /machines/:id (buscar)
  - [ ] PUT /machines/:id (atualizar)
  - [ ] DELETE /machines/:id (deletar)
- [ ] Validação: tipo deve ser "Pump" ou "Fan"
- [ ] Repository + Service de machines
- [ ] Testes unitários do service

### Dia 3 (03/02) — Backend: Monitoring Points + Sensors
- [ ] CRUD `/monitoring-points`
- [ ] CRUD `/sensors`
- [ ] Associar sensor a monitoring point
- [ ] **Regra:** TcAg e TcAs NÃO podem ser usados em máquinas tipo "Pump"
- [ ] Lista paginada (5/página) com ordenação por qualquer coluna
- [ ] Repository + Service
- [ ] Testes unitários

### Dia 4 (04/02) — Backend: Time-Series + Finalização API
- [ ] CRUD `/time-series`:
  - [ ] POST (armazenar dados do sensor)
  - [ ] GET (buscar série completa)
  - [ ] GET /metrics (métricas: min, max, avg)
  - [ ] GET /count (quantidade de registros)
  - [ ] DELETE (remover)
- [ ] Garantir latência < 350ms
- [ ] Swagger documentação completa
- [ ] Testes de integração

### Dia 5 (05/02) — Frontend: Setup + Autenticação
- [ ] Configurar Material UI 5 (tema)
- [ ] Configurar Redux Toolkit + Thunk
- [ ] Tela de Login
- [ ] Proteção de rotas (PrivateRoute)
- [ ] Logout
- [ ] Layout base responsivo (sidebar, header)
- [ ] Axios interceptors para JWT

### Dia 6 (06/02) — Frontend: CRUD Machines + Monitoring Points
- [ ] Dashboard inicial
- [ ] Listagem de Machines (tabela)
- [ ] Modal criar/editar Machine
- [ ] Deletar Machine
- [ ] Listagem de Monitoring Points (paginada, ordenável)
- [ ] Associar/visualizar sensor
- [ ] Integração completa com API

### Dia 7 (07/02) — Frontend: Time-Series + Polimento + Entrega
- [ ] Tela de visualização de time-series
- [ ] Gráfico com Recharts
- [ ] Upload/input de dados de sensores
- [ ] Testes unitários frontend
- [ ] Revisão de código
- [ ] README com assumptions finais
- [ ] Commits semânticos organizados
- [ ] PR final para dynamox-s-a/developer-challenges

### Bônus Implementados
- [x] Nx Monorepo
- [x] Predição Futura de Dados
- [x] Load Balancer (Nginx)
- [x] Load Tests (k6)
- [x] Deploy (Docker/Containerização)
- [ ] Testes E2E com Cypress (Configuração iniciada)

---

## Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Material UI 5
- Redux Toolkit
- React Router
- Recharts

**Backend:**
- Fastify
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Regressão Linear para Predição

**Infraestrutura:**
- Docker & Docker Compose
- Nginx (Load Balancer & Web Server)
- k6 (Load Testing)

**Monorepo:**
- Nx

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm
- k6 (opcional, para testes de carga)

## Setup

1. Configurar variáveis de ambiente:

```bash
cp .env.example .env
```

2. Instalar dependências:

```bash
npm install
```

2. Subir o banco de dados:

```bash
npm run db:up
```

3. Gerar Prisma Client e rodar migrations:

```bash
npm run db:generate
npm run db:migrate
npx prisma db seed
```

4. Rodar a aplicação (Modo Desenvolvimento):

```bash
npm run dev
```

- Frontend: http://localhost:4200
- Backend: http://localhost:3000

## Setup Completo com Docker (Bônus: Deploy & Load Balancer)

Para simular um ambiente de produção com Load Balancer e múltiplas réplicas da API:

> **Nota:** Se você estiver usando Linux, pode ser necessário usar `docker compose` (com espaço) em vez de `docker-compose` (com hífen), dependendo da sua versão do Docker.

```bash
docker-compose -f docker-compose.full.yml up --build
```

- **Frontend (Nginx)**: http://localhost:4200
- **API (Load Balanced)**: http://localhost:3000
- **Réplicas API**: 3 instâncias rodando internamente

## Testes de Carga (Bônus)

Com o ambiente rodando (dev ou docker), execute:

```bash
# Requer k6 instalado
k6 run load-test.js
```

### Evidência de Performance (Exemplo)

Execute o comando acima para gerar o relatório. O resultado esperado deve ser similar a:

```
     ✓ logged in successfully
     ✓ machines status is 200

     checks.........................: 100.00% ✓ 836      ✗ 0
     data_received..................: 2.4 MB  23 kB/s
     data_sent......................: 260 kB  2.5 kB/s
     http_req_blocked...............: avg=24.5µs min=1µs    med=4µs    max=1.56ms p(90)=9µs    p(95)=13µs
     http_req_connecting............: avg=7.83µs min=0s     med=0s     max=1.07ms p(90)=0s     p(95)=0s
     http_req_duration..............: avg=7.84ms min=2.08ms med=6.86ms max=56.2ms p(90)=12.4ms p(95)=15.7ms
       { expected_response:true }...: avg=7.84ms min=2.08ms med=6.86ms max=56.2ms p(90)=12.4ms p(95)=15.7ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 836
     http_req_receiving.............: avg=58.6µs min=9µs    med=40µs   max=1.45ms p(90)=101µs  p(95)=135.25µs
     http_req_sending...............: avg=18.4µs min=3µs    med=12µs   max=478µs  p(90)=31µs   p(95)=41µs
     http_req_tls_handshaking.......: avg=0s     min=0s     med=0s     max=0s     p(90)=0s     p(95)=0s
     http_req_waiting...............: avg=7.76ms min=2.01ms med=6.78ms max=56.09ms p(90)=12.33ms p(95)=15.54ms
     http_reqs......................: 836     8.070087/s
     iteration_duration.............: avg=1.01s  min=1s     med=1.01s  max=1.06s  p(90)=1.01s  p(95)=1.02s
     iterations.....................: 418     4.035044/s
     vus............................: 1       min=1      max=20
     vus_max........................: 20      min=20     max=20
```

> **Nota:** O requisito de latência < 350ms é validado pela métrica `http_req_duration`.


## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Roda frontend e backend |
| `npm run dev:web` | Roda apenas o frontend |
| `npm run dev:api` | Roda apenas o backend |
| `npm run build` | Build de produção |
| `npm run test` | Executa os testes unitários |
| `npm run db:up` | Sobe o PostgreSQL |
| `npm run db:down` | Para o PostgreSQL |
| `npm run db:migrate` | Roda as migrations |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:studio` | Abre o Prisma Studio |

## Estrutura do Projeto

```
├── apps/
│   ├── web/          # Frontend React + Vite
│   └── api/          # Backend Fastify
├── libs/
│   └── shared/       # Types compartilhados
├── prisma/
│   └── schema.prisma # Schema do banco
├── infra/            # Configurações de infra (Nginx)
├── docker-compose.yml # DB apenas (Dev)
├── docker-compose.full.yml # Ambiente completo (Prod Simulado)
├── load-test.js      # Script de teste de carga k6
└── package.json
```

## Assumptions (Ambiguidades Resolvidas)

1. **Autenticação**: Implementada com JWT e credenciais fixas para simplificação do teste.

2. **Sensores HF+**: O modelo "HF+" foi mapeado como "HFPlus" no enum do banco por restrições de caracteres especiais.

3. **Restrição de Sensores**: Sensores TcAg e TcAs não podem ser associados a máquinas do tipo "Pump" - esta validação é feita tanto no frontend quanto no backend.

4. **Time-Series**: Dados são armazenados por sensor individual, com índice composto (sensorId, timestamp) para queries eficientes.

5. **Paginação**: Lista de monitoring points usa paginação server-side com 5 itens por página.

6. **Predição**: Utilizada Regressão Linear Simples baseada nos últimos 50 pontos para prever o próximo valor.

## Credenciais de Teste

- Email: `admin@dynamox.com`
- Senha: `admin123`
