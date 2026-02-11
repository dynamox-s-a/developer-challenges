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
- [x] Criar middleware de autenticação JWT
- [x] Decorator `authenticate` para rotas protegidas
- [x] CRUD `/machines`:
  - [x] POST /machines (criar)
  - [x] GET /machines (listar)
  - [x] GET /machines/:id (buscar)
  - [x] PUT /machines/:id (atualizar)
  - [x] DELETE /machines/:id (deletar)
- [x] Validação: tipo deve ser "Pump" ou "Fan"
- [x] Repository + Service de machines
- [x] Testes unitários do service

### Dia 3 (03/02) — Backend: Monitoring Points + Sensors
- [x] CRUD `/monitoring-points`
- [x] CRUD `/sensors`
- [x] Associar sensor a monitoring point
- [x] **Regra:** TcAg e TcAs NÃO podem ser usados em máquinas tipo "Pump"
- [x] Lista paginada (5/página) com ordenação por qualquer coluna
- [x] Repository + Service
- [x] Testes unitários

### Dia 4 (04/02) — Backend: Time-Series + Finalização API
- [x] CRUD `/time-series`:
  - [x] POST (armazenar dados do sensor)
  - [x] GET (buscar série completa)
  - [x] GET /metrics (métricas: min, max, avg)
  - [x] GET /count (quantidade de registros)
  - [x] DELETE (remover)
- [x] Garantir latência < 350ms
- [x] Swagger documentação completa
- [x] Testes de integração

### Dia 5 (05/02) — Frontend: Setup + Autenticação
- [x] Configurar Material UI 5 (tema)
- [x] Configurar Redux Toolkit + Thunk
- [x] Tela de Login
- [x] Proteção de rotas (PrivateRoute)
- [x] Logout
- [x] Layout base responsivo (sidebar, header)
- [x] Axios interceptors para JWT

### Dia 6 (06/02) — Frontend: CRUD Machines + Monitoring Points
- [x] Dashboard inicial
- [x] Listagem de Machines (tabela)
- [x] Modal criar/editar Machine
- [x] Deletar Machine
- [x] Listagem de Monitoring Points (paginada, ordenável)
- [x] Associar/visualizar sensor
- [x] Integração completa com API

### Dia 7 (07/02) — Frontend: Time-Series + Polimento + Entrega
- [x] Tela de visualização de time-series
- [x] Gráfico com Recharts
- [x] Upload/input de dados de sensores
- [x] Testes unitários frontend
- [x] Revisão de código
- [x] README com assumptions finais
- [x] Commits semânticos organizados
- [x] PR final para dynamox-s-a/developer-challenges

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

> **Atenção:** Após copiar, edite o arquivo `.env` com as seguintes configurações:
>
> *   **JWT_SECRET**: Gere uma string aleatória segura (ex: `openssl rand -base64 32`) ou use `supersecret` apenas para testes locais.
> *   **DATABASE_URL**:
>     *   Se for usar o banco via Docker (`npm run db:up`), altere a porta para **5433**:
>         `postgresql://dynamox:dynamox123@localhost:5433/dynamox?schema=public`
>     *   Se tiver um Postgres local rodando, mantenha a porta **5432** e ajuste usuário/senha conforme sua instalação.

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

## Reviewer Feedback & Implementation Details

Esta seção detalha como cada ponto do feedback da revisão foi endereçado e como validar a implementação.

### 1. Autenticação e Configuração
- **Feedback:** Faltava informação sobre qual usuário usar e como configurar o `.env`.
- **Implementação:**
  - Adicionada seção **Credenciais de Teste** com email/senha padrão.
  - Adicionada seção de **Atenção** no Setup explicando como gerar o `JWT_SECRET` e configurar a `DATABASE_URL` correta para Docker (porta 5433).
- **Verificação:** Siga os passos de [Setup](#setup) e tente logar com as credenciais fornecidas.

### 2. Paginação (Monitoring Points)
- **Feedback:** Não era possível reduzir o número de itens por página.
- **Implementação:** O componente de tabela foi atualizado para permitir opções de tamanho de página: `[2, 5, 10, 25]`.
- **Verificação:** Na tela de Monitoring Points, use o seletor no rodapé da tabela para alterar a quantidade de linhas.

### 3. Restrição de Sensores (Máquinas Pump)
- **Feedback:** Garantir que TcAg/TcAs não sejam usados em Pump.
- **Implementação:**
  - **Frontend:** Ao selecionar uma máquina "Pump", o dropdown de sensores desabilita as opções inválidas e seleciona "HF+" automaticamente.
  - **Backend:** O serviço valida o tipo da máquina antes de criar/atualizar e lança erro 400 se a regra for violada.
- **Verificação:** Tente criar um sensor TcAg para uma máquina Pump via UI (deve estar bloqueado) ou via API (deve retornar erro).

### 4. Testes Unitários
- **Feedback:** "Not all tests are implemented".
- **Implementação:** Foram adicionados testes unitários abrangentes para o Backend (`monitoring-point.service.spec.ts`, etc.) e Frontend (`monitoringPointsSlice.spec.ts`).
- **Verificação:** Execute `npm run test` e verifique se todos os testes passam.

### 5. Latência e Performance
- **Feedback:** Falta de evidência sobre o requisito de < 350ms.
- **Implementação:** Configurado script de teste de carga com k6.
- **Verificação:** Execute `npm run test:load`. O relatório final mostrará a métrica `http_req_duration` (p95) tipicamente abaixo de 20ms, superando largamente o requisito.

### 6. Delete Time-Series
- **Feedback:** Usuário deve poder deletar dados enviados.
- **Implementação:** Endpoint `DELETE /time-series?sensorId=...` implementado.
- **Verificação:** Pode ser testado via Swagger ou chamadas API diretas.

### 7. Load Balancer (Bônus)
- **Feedback:** Adicionar Load Balancer.
- **Implementação:** Ambiente Docker completo com Nginx atuando como Load Balancer distribuindo tráfego para 3 réplicas da API.
- **Verificação:** Rode `docker-compose -f docker-compose.full.yml up` e acesse a aplicação. O Nginx gerencia o tráfego na porta 3000.

---

## Assumptions (Ambiguidades Resolvidas)

Esta seção documenta as decisões técnicas tomadas para resolver ambiguidades ou requisitos abertos do desafio.

1.  **Autenticação Simplificada**:
    *   **Decisão:** Uso de credenciais fixas no seed (`admin@dynamox.com`) e autenticação via JWT.
    *   **Porquê:** O foco do desafio é a arquitetura e o fluxo de dados, não um sistema complexo de gestão de usuários (cadastro, recuperação de senha, etc.). Isso simplifica o setup para avaliação.

2.  **Mapeamento de Sensores (HF+)**:
    *   **Decisão:** O modelo "HF+" é armazenado internamente no banco/enum como "HFPlus".
    *   **Porquê:** Muitos sistemas e ORMs têm restrições com caracteres especiais em enums ou identificadores. O frontend faz a conversão visual de volta para "HF+".

3.  **Validação de Regra de Negócio (Pump vs TcAg/TcAs)**:
    *   **Decisão:** A validação ocorre tanto no Frontend (UX) quanto no Backend (Segurança/Integridade).
    *   **Porquê:** Bloquear no frontend melhora a experiência do usuário, mas a validação no backend é obrigatória para garantir a integridade dos dados caso a API seja acessada diretamente.

4.  **Armazenamento de Time-Series**:
    *   **Decisão:** Tabela relacional com índice composto `(sensorId, timestamp)`.
    *   **Porquê:** Para o volume de dados esperado em um teste, o PostgreSQL lida perfeitamente bem. O índice composto otimiza as queries mais comuns: "busque os últimos dados *deste* sensor".

5.  **Estratégia de Paginação**:
    *   **Decisão:** Paginação Server-Side (skip/take).
    *   **Porquê:** Embora a paginação no frontend fosse viável para poucos dados, a paginação no servidor é a única solução escalável para quando o número de pontos de monitoramento crescer.

6.  **Algoritmo de Predição**:
    *   **Decisão:** Regressão Linear Simples baseada nos últimos 50 pontos.
    *   **Porquê:** É uma abordagem determinística, leve e rápida de implementar sem necessidade de bibliotecas pesadas de ML (como TensorFlow/Python), atendendo ao requisito de "prever o próximo valor" dentro do ecossistema Node.js solicitado.

## Credenciais de Teste

- Email: `admin@dynamox.com`
- Senha: `admin123`
