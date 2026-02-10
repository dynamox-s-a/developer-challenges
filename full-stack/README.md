# Dynamox Full Stack Challenge

Sistema completo de monitoramento industrial com gestão de máquinas, pontos de monitoramento e sensores, construído com React, Node.js e PostgreSQL.

## Contexto do Projeto

Solução full-stack para monitoramento industrial que permite:
- Gestão completa de máquinas e sensores
- Coleta e visualização de dados em tempo real
- Regras de negócio específicas (Pump vs Fan sensors)
- Performance otimizada (P95 < 350ms)
- Interface moderna e responsiva

## Início Rápido

### Pré-requisitos
```bash
# Verificar e instalar dependências automaticamente
./scripts/check-deps.sh
```

### Subir o Sistema Completo
```bash
# Iniciar todos os serviços (frontend + backend + database)
./scripts/up.sh
```

### Acessar o Sistema
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Documentação API**: http://localhost:3001/docs
- **Banco de Dados**: localhost:5433

**Credenciais padrão**: `admin/admin`

## Scripts Disponíveis

### Gerenciamento do Sistema
```bash
./scripts/up.sh          # Iniciar todos os serviços
./scripts/down.sh        # Parar todos os serviços
./scripts/check-deps.sh   # Verificar dependências
```

### Testes e Validação
```bash
./scripts/smoke-test.sh  # Teste de integração completo
./scripts/get-token.sh   # Obter token JWT para testes
```

### Desenvolvimento
```bash
# Apenas banco de dados (para desenvolvimento local)
docker compose up -d postgres

# Backend local
pnpm --filter backend dev

# Frontend local
pnpm --filter frontend dev
```

## Arquitetura

### Stack Tecnológico
- **Frontend**: React 18 + TypeScript + Material-UI + Redux Toolkit
- **Backend**: Node.js + Fastify + TypeScript + Prisma ORM
- **Banco**: PostgreSQL 16 com índices otimizados
- **Containerização**: Docker + Docker Compose
- **Autenticação**: JWT tokens com 8h de expiração

### Estrutura do Projeto
```
full-stack/
├── apps/
│   ├── backend/      # API Fastify + Prisma
│   └── frontend/     # React + MUI
├── scripts/          # Scripts de automação
├── docs/            # Documentação detalhada
├── docker-compose.yml # Orquestração de containers
└── README.md        # Este arquivo
```

## Funcionalidades Principais

### Gestão de Ativos
- CRUD de máquinas (Pump/Fan)
- Pontos de monitoramento associados
- Sensores com regras de compatibilidade
- Paginação e ordenação otimizadas

### Coleta de Dados
- Séries temporais (15min interval)
- Métricas automáticas (min/max/avg/count)
- Filtros por período (24h/7d/30d)
- Visualização interativa com gráficos

### Performance
- P95 < 350ms (endpoint monitoring-points)
- Índices otimizados no PostgreSQL
- Lazy loading e caching no frontend
- Connection pooling no backend

## Documentação Completa

### Guia de Dependências
Instalação e configuração de todas as dependências necessárias.
**Ver**: `docs/dependencies.md`

### Containers Docker
Configuração detalhada dos containers, volumes e networking.
**Ver**: `docs/docker-containers.md`

### Banco de Dados
Schema, migrations, seeds e otimizações do PostgreSQL.
**Ver**: `docs/database.md`

### Funcionalidades
Descrição completa de todas as features implementadas.
**Ver**: `docs/features.md`

## Especificações Técnicas

### Performance
- **Response time**: P95 < 350ms (monitoring-points)
- **Throughput**: 100+ requests/segundo
- **Database**: Índices otimizados para queries complexas
- **Frontend**: Code splitting e lazy loading

### Segurança
- **Autenticação**: JWT com HMAC-SHA256
- **Autorização**: Middleware global de validação
- **Input validation**: Zod schemas em todos os endpoints
- **CORS**: Configuração específica para frontend

### Escalabilidade
- **Horizontal**: Suporte para múltiplas instâncias
- **Database**: Connection pooling e índices otimizados
- **Frontend**: Virtual scrolling para grandes listas
- **API**: Paginação server-side em todos os endpoints

## Desenvolvimento

### Ambiente Local
```bash
# 1. Instalar dependências
./scripts/check-deps.sh

# 2. Iniciar banco de dados
docker compose up -d postgres

# 3. Configurar backend
cp apps/backend/.env.example apps/backend/.env

# 4. Rodar migrations e seed
pnpm --filter backend prisma:migrate
pnpm --filter backend prisma:seed

# 5. Iniciar serviços
pnpm --filter backend dev
pnpm --filter frontend dev
```

### Testes
```bash
# Testes E2E (Cypress)
pnpm --filter frontend test:e2e

# Testes de performance
pnpm --filter backend benchmark

# Teste de integração
./scripts/smoke-test.sh
```

## Deploy

### Produção (Docker)
```bash
# Build e deploy completo
./scripts/up.sh

# Verificar status
docker compose ps

# Logs
docker compose logs -f
```

### Cloud (Render)
Configuração para deploy automático via GitHub Actions. Veja `.github/workflows/deploy-render.yml`.

## Troubleshooting

### Problemas Comuns

#### Docker não inicia
```bash
# Verificar status
docker info

# macOS/Windows: Iniciar Docker Desktop
# Linux: sudo systemctl start docker
```

#### Portas em uso
```bash
# Verificar ports
lsof -i :3001
lsof -i :5173
lsof -i :5433
```

#### Backend não responde
```bash
# Verificar logs
docker compose logs backend

# Testar health endpoint
curl http://localhost:3001/health
```

#### Frontend não conecta no backend
```bash
# Verificar se ambos estão rodando
docker compose ps

# Verificar configuração de rede
docker network ls
```

### Limpeza Completa
```bash
# Parar e remover tudo
docker compose down -v

# Limpar imagens e cache
docker system prune -f

# Reconstruir do zero
./scripts/up.sh
```

## Contribuição

### Fluxo de Trabalho
1. Fork do projeto
2. Branch feature/nome-da-feature
3. Commits semânticos
4. Pull request com testes

### Padrões
- **TypeScript**: Tipagem estrita em todo o código
- **Convenções**: ESLint + Prettier configurados
- **Testes**: Cobertura obrigatória para novas features
- **Docs**: Atualizar documentação relevante

## Licença

MIT License - Ver arquivo LICENSE para detalhes.

---

**Desenvolvido para o Desafio Técnico Dynamox**

Para suporte ou dúvidas, consulte a documentação em `docs/` ou abra uma issue.
