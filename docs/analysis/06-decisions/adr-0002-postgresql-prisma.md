# ADR-0002 — PostgreSQL + Prisma

**Status:** Aceito

## Contexto

O enunciado permite banco relacional ou não relacional. O domínio é pequeno mas cheio de
**invariantes**: nome de máquina único, um sensor por ponto, uma série por (sensor,
grandeza, eixo), uma amostra por (série, instante), e um ciclo de ingestão único por chave
e por conteúdo. Além disso, a ingestão precisa ser atômica: ou o ciclo inteiro entra, ou
nada entra.

## Decisão

PostgreSQL 16 como banco e Prisma 5 como ORM/migrador.

A escolha é pelo **motor**, não pelo modelo de dados: índices únicos e transações com
nível de isolamento configurável resolvem sozinhos problemas que, sem eles, viram código
de aplicação frágil (verificar-antes-de-inserir, que é uma corrida por construção).

## Alternativas consideradas

- **MongoDB + Mongoose.** Rejeitada: as invariantes acima seriam índices únicos parciais e
  validações de aplicação, e a atomicidade multi-documento exigiria transações que só
  existem em replica set. O domínio é relacional — ativo → ponto → sensor → série →
  amostra é uma cadeia de chaves estrangeiras.
- **Query builder (Kysely/Drizzle) ou SQL puro.** Rejeitada: perderíamos migrações
  versionadas e tipos gerados a partir do schema, que são exatamente o que mantém domínio
  e banco alinhados num prazo curto. Onde o Prisma não expressa o que queremos, usamos
  `$queryRaw` parametrizado — não é um caminho fechado.
- **SQLite.** Rejeitada: sem `TIMESTAMPTZ` real, sem isolamento equivalente, e o teste
  deixaria de rodar contra o mesmo motor da execução.

## Consequências

- Testes e2e rodam contra PostgreSQL real (via Docker Compose), não contra um duplo — mais
  lentos, muito mais fiéis.
- As unicidades são do banco: o serviço trata o `P2002` do Prisma e o traduz em `409`,
  desambiguando pelo alvo do índice.
- A ordenação pelo vocabulário público exigiu `$queryRaw` com `CASE`, porque a ordem do
  enum no banco não é a ordem que o usuário vê — aceitável, com fragmentos vindos de um
  mapa fechado.
- Precisão temporal é `TIMESTAMPTZ(3)`, e isso **subiu para o contrato**: só aceitamos
  timestamps com milissegundos exatos, para não truncar em silêncio.
- Um teto de deploy: exige um PostgreSQL disponível, o que é irrelevante localmente e
  seria um item a mais numa hospedagem.

## Evidência

- `prisma/schema.prisma` — unicidades, `onDelete`, `@db.Timestamptz(3)`, enums.
- `prisma/migrations/` — três migrações versionadas, aplicáveis do zero.
- `apps/api/src/monitoring-points/monitoring-points.service.ts:262-293` e
  `apps/api/src/telemetry/telemetry.service.ts:474-486` — transações em `RepeatableRead`.
- `docker-compose.yml` — o banco do ambiente local.
- Documento irmão: [`../03-domain/domain-and-persistence.md`](../03-domain/domain-and-persistence.md).
