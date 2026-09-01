# Execução local — estado atual

Já estão operacionais: a fundação do monorepo, o contrato de telemetria (SCP-04), a
**autenticação completa** (login com credencial fixa, JWT, guard global, sessão e logout),
o **CRUD autenticado de máquinas no backend**, a **listagem e o cadastro de máquinas no
frontend** (incluindo **edição e exclusão**, com confirmação que avisa sobre a cascata nos
pontos), a **gestão de pontos de monitoramento e sensores** (criação, associação com a
regra Pump × TcAg/TcAs, tabela paginada de 5 e ordenável por qualquer coluna) e a ingestão
e leitura de séries temporais.

O backend do P0 está completo — incluindo exclusão de séries com recuperação paginada e
documentação viva em Swagger (`/api/docs`). Ver "Pendências" no fim deste documento.

> Os dados deste projeto são **sintéticos e didáticos**. A aplicação nunca chama a API
> produtiva da Dynamox; o frontend recusa qualquer `VITE_API_BASE_URL` apontando para
> domínios `dynamox.solutions` ou `dynamox.net`.

## Pré-requisitos

- Node.js 20 ou superior (validado com 22.23.1)
- Docker com Compose v2
- npm 10

## Passo a passo

```bash
cp .env.example .env          # OBRIGATÓRIO: sem .env a API não sobe (falta JWT_SECRET)
npm install
npm run db:up                 # sobe o PostgreSQL 16 em container
npm run prisma:deploy         # aplica as migrações
npm run seed                  # usuário fixo + dados de demonstração determinísticos
npm run build                 # Nx: libs -> api -> web
```

Em dois terminais:

```bash
npm run dev:api               # http://localhost:3000/api
npm run dev:web               # http://localhost:5173
```

Abra <http://localhost:5173> e faça login com as credenciais da seção seguinte. A
interface segue Material Design com menu lateral: **Visão geral** (dashboard operacional
com estado do sistema, KPIs, matriz de condição por ponto, ranking de prioridade e painel
de tendência da série temporal), **Máquinas** (CRUD completo) e **Pontos e sensores**
(criação, associação e tabela paginada), além do atalho para o Swagger.

### Variáveis de ambiente

Todas vivem no `.env` da raiz, criado a partir do `.env.example`. O `.env` real está no
`.gitignore` e **nunca é versionado**; só o `.env.example` entra no repositório.

| Variável | Obrigatória | Padrão local | Para que serve |
|---|---|---|---|
| `DATABASE_URL` | sim | `postgresql://dynamox:dynamox@localhost:5433/...` | conexão do Prisma |
| `JWT_SECRET` | **sim** | `dev-only-change-me` | assinatura do JWT. **A API recusa iniciar sem ela** (`JWT_SECRET não definido. Configure o .env antes de subir a API.`) |
| `JWT_EXPIRES_IN` | não | `8h` | validade do token; sem refresh token, a sessão dura exatamente isso |
| `API_PORT` | não | `3000` | porta da API |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` / `POSTGRES_PORT` | não | `dynamox` / `dynamox` / `dynamox_challenge` / `5433` | container do Compose. A porta é 5433 para não colidir com um PostgreSQL local em 5432 |
| `VITE_API_BASE_URL` | não | `http://localhost:3000/api` | base da API no frontend; domínios `dynamox.solutions`/`dynamox.net` são recusados por código |
| `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` | não | ver abaixo | credencial fixa criada pelo seed |
| `DEMO_DATA_ANCHOR` | não | bloco de 6 h da execução | fixa o instante de referência dos dados de demonstração (ISO 8601). Sem ela, seed e planta ancoram no início do bloco de 6 h corrente: os dados nascem no passado recente e o painel os classifica como atuais em qualquer dia |
| `ALERTS_EVALUATE_ON_INGEST` | não | `true` | avalia as regras de alerta logo após o commit de cada ciclo ingerido. `false` para carregar um histórico em massa e reconciliar depois com `npm run alerts:backfill` |
| `ALERTS_PRESENCE_SWEEP_MS` | não | `300000` | cadência da varredura de presença (sensor mudo / planta sem telemetria). `0` desliga; sob Jest nunca arma |

O valor `dev-only-change-me` é um placeholder de desenvolvimento — troque em qualquer
ambiente compartilhado.

## Verificações

```bash
npm run contracts:validate    # SCP-04: sintaxe, hash do snapshot, exemplo x schema
npm run lint
npm run typecheck
npm run test                  # 689 na suíte convencional: 353 API (unit + e2e/contrato contra o banco real),
                              # 212 web e 124 do sensor twin (puro — sem API/ROS/banco)
npm run twin:integration      # BON-06: 17 testes contra a API/banco reais (fora do run acima)
npm run twin:ros              # BON-06.F8: 5 testes de proveniência ROS (exige ROS Noetic; opcional)
npm run test:unit -w @dynamox/api   # somente unitários isolados (sem banco, < 2 s)
npm run perf:latency          # latência < 350 ms em 19 rotas, incluindo analytics em 7 e 30 dias (exige a API no ar)
npm run twin:history -- --dry-run   # histórico sintético: plano e instantes reservados, sem escrever
```

## Consulta da listagem de pontos

Paginação, ordenação, busca e filtros são resolvidos **no servidor**: o cliente pede um
recorte e recebe a página junto com os metadados desse recorte. Nada é filtrado sobre a
página já carregada.

| Parâmetro | Valores | Padrão |
|---|---|---|
| `page` | inteiro ≥ 1 | 1 |
| `pageSize` | inteiro de 1 a 50 | 5 |
| `sortBy` | `machineName`, `machineType`, `pointName`, `sensorModel` | `machineName` |
| `sortDir` | `asc`, `desc` | `asc` |
| `search` | texto até 120 caracteres | — |
| `machineType` | `Pump`, `Fan` | — |
| `sensorModel` | `TcAg`, `TcAs`, `HF+` | — |
| `hasSensor` | `true`, `false` | — |

Resposta: `{ items, total, page, pageSize, totalPages, sortBy, sortDir, search, machineType, sensorModel, hasSensor }`.
`total` e `totalPages` já refletem o recorte — não são o tamanho da tabela.

**Decisão sobre `pageSize`.** O enunciado exige exibir **até 5 pontos por página**, e a
tela cumpre isso usando o padrão 5, sem oferecer troca de tamanho. A API, porém, aceita
até 50: o inventário do dashboard e o bootstrap do bônus são clientes legítimos que
precisam varrer a lista em menos requisições. Limitar a API a 5 não tornaria a tela mais
correta e quebraria esses consumidores.

**Notas de contrato.** Parâmetro desconhecido ou valor fora do vocabulário responde `400`
(nunca é ignorado em silêncio, para o cliente não achar que filtrou). `sortBy` é uma
whitelist — nenhum campo chega ao `ORDER BY` sem validação. A busca é por trecho, sem
diferenciar maiúsculas, sobre nome da máquina, nome do ponto e série do sensor; curingas
de `LIKE` digitados pelo usuário são tratados como texto literal. Ao consultar
`sensorModel=HF+`, codifique o valor (`HF%2B`): `+` cru numa query string significa espaço.

## Credenciais de demonstração

O enunciado pede login com e-mail e senha fixos. O seed cria o usuário abaixo (upsert por
e-mail: rodar o seed várias vezes não duplica o registro e **redefine a senha**, garantindo
que a credencial anunciada sempre funcione):

| Perfil | E-mail | Senha | Pode |
|---|---|---|---|
| `ADMIN` | `analista@dynamox.local` | `Dynamox@2026` | consultar e alterar (criar, editar, excluir, ingerir) |
| `VIEWER` | `consulta@dynamox.local` | `Consulta@2026` | somente consultar |

O perfil viaja no JWT e é devolvido em `/auth/login` e `/auth/me`. A autorização é do
**backend**: com credencial `VIEWER`, qualquer `POST`/`PATCH`/`DELETE` responde `403`
(autenticado, sem permissão) — distinto do `401` de sessão ausente ou inválida. A interface
apenas deixa de oferecer ações que o perfil não pode concluir; esconder botão não é
autorização. Ambos os perfis são configuráveis por `SEED_USER_*` e `SEED_VIEWER_*`.

São valores públicos de demonstração, configuráveis por `SEED_USER_EMAIL` e
`SEED_USER_PASSWORD` no `.env`. A senha é gravada como `scrypt$salt$hash` — nunca em texto
puro — e a API jamais devolve o hash em resposta alguma.

## API disponível nesta fase

Rotas **públicas** (sem token):

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Estado da API e do banco (`200` saudável, `503` degradado). Público por ser o probe usado antes do login |
| `POST` | `/api/auth/login` | Recebe `{ email, password }` e devolve `{ token, user }`. `401` genérico para credencial inválida; `400` para payload malformado |

Rotas **privadas** — exigem `Authorization: Bearer <token>`. Um guard global protege tudo
que não esteja explicitamente marcado como público, então o backend é a autoridade da
proteção (o frontend apenas espelha):

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/auth/me` | Usuário da sessão, sem senha nem hash |
| `POST` | `/api/machines` | Cria máquina (`name` + `type` em `Pump`/`Fan`). `409` para nome duplicado |
| `GET` | `/api/machines` | Lista as máquinas, ordenadas por nome |
| `GET` | `/api/machines/:id` | Uma máquina; `404` se não existir |
| `PATCH` | `/api/machines/:id` | Altera `name` e/ou `type`; corpo vazio é `400` |
| `DELETE` | `/api/machines/:id` | Remove a máquina (`204`); `404` se não existir |
| `POST` | `/api/monitoring-points` | Cria ponto de monitoramento (`machineId` + `name`) |
| `GET` | `/api/monitoring-points` | Lista paginada (5 por página), ordenável por qualquer coluna, com busca e filtros — ver "Consulta da listagem" |
| `POST` | `/api/monitoring-points/:id/sensor` | Associa um sensor (`serialNumber` + `model`) ao ponto |
| `POST` | `/api/telemetry-cycles` | Ingestão idempotente de um ciclo de telemetria |
| `GET` | `/api/time-series` | Séries persistidas com máquina, ponto, sensor e contagem |
| `GET` | `/api/time-series/:id/samples` | Amostras paginadas por `?limit=` (padrão 500, máx. 5000) e `?offset=`; resposta `{ items, total, limit, offset }` — a série inteira é recuperável |
| `GET` | `/api/time-series/:id/metrics` | `count`, mínimo, máximo, média, último valor e janela |
| `DELETE` | `/api/time-series/:id` | Exclui a série e todas as amostras em cascata (`204`); `404` se não existir |

Camada **analítica** — toda rota exige a janela `?from=&to=` em ISO 8601 UTC (`to` exclusivo,
máximo de 90 dias). É o que garante que nenhuma consulta volte a varrer o histórico inteiro:

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/analytics/fleet-condition` | Condição de cada ponto na janela, com a aquisição atual e a de referência. `?includeTrend=true` acrescenta até 12 buckets das últimas 24 h; `?condition=` recorta o resultado |
| `GET` | `/api/analytics/heatmap` | Severidade e cobertura por bucket data × hora (`?bucket=hour\|day`): maior desvio radial da frota na hora (contra a baseline aprendida do ponto) e quantos sensores reportaram |
| `GET` | `/api/analytics/time-windows` | Resumo por sensor de uma janela, paginado no servidor |
| `GET` | `/api/analytics/machines` | Listagem operacional: condição (a pior entre os pontos), inventário e maior desvio, com `?condition=`, `?search=`, ordenação e paginação resolvidos no servidor |
| `GET` | `/api/analytics/machines/:machineKey` | Resumo da máquina e dos seus pontos. O identificador é o nome ou a etiqueta (`P-101`), nunca o UUID; `?condition=` recorta a lista de pontos |
| `GET` | `/api/analytics/machines/:machineKey/points/:pointKey` | Resumo do ponto: condição, janela e séries disponíveis |
| `GET` | `/api/analytics/series/:seriesId/points` | Série agregada por bucket (`15m`, `1h`, `4h`, `1d`) |
| `GET` | `/api/analytics/sensors/:serialNumber/acquisitions` | Aquisições do sensor, paginadas; `?includeTotal=true` custa uma contagem |
| `GET` | `/api/analytics/acquisitions/:cycleId` | Detalhe da aquisição com estatística por série |
| `GET` | `/api/analytics/acquisitions/:cycleId/samples` | **Único** ponto do sistema que devolve amostra bruta — recortado por aquisição e paginado por cursor keyset |

Alertas — episódios persistidos pelo motor (ver
[`analysis/03-domain/alert-domain.md`](analysis/03-domain/alert-domain.md)):

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/alerts` | Lista episódios com `?status=open\|acknowledged\|resolved\|active`, `?level=`, `?type=`, `?machine=` (chave natural), `?sensor=`, `?from=&to=` (**interseção** com o período ativo), paginação e ordenação; `counts` descreve o universo antes do recorte por status |
| `GET` | `/api/alerts/:id` | Episódio com a regra aplicada (limiares e versão da política) e a linha do tempo de transições |
| `POST` | `/api/alerts/:id/acknowledge` | Reconhece (`{ note? }`): não resolve nem silencia; idempotente; permitido em episódio resolvido; **ADMIN** (VIEWER recebe `403`) |

A documentação interativa (Swagger UI) fica em <http://localhost:3000/api/docs>, com o
documento OpenAPI 3 em `/api/docs-json`: todas as rotas e códigos de erro, com schemas
dos corpos de requisição; os formatos de resposta estão descritos por texto e detalhados
nestas seções. Use o botão **Authorize** com o token do login.

### Autenticando pelo terminal

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"analista@dynamox.local","password":"Dynamox@2026"}' \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["token"])')

curl -s http://localhost:3000/api/time-series -H "Authorization: Bearer $TOKEN"
```

Sem o header, qualquer rota privada responde `401`.

### Convenções do CRUD de máquinas

- **Nome**: normalizado por `trim`, obrigatório, no máximo 120 caracteres. A unicidade é a
  do índice do PostgreSQL — sensível a maiúsculas, e aplicada pelo banco (não por consulta
  prévia), de modo que duas requisições concorrentes não criam duplicata.
- **Tipo**: aceita exclusivamente `Pump` ou `Fan`; qualquer outro valor é `400`
  (`INVALID_MACHINE_TYPE`). A resposta sempre usa esse vocabulário público, nunca o enum
  interno do banco.
- **Propriedades desconhecidas** no corpo são rejeitadas com `400`, em vez de ignoradas.
- **Ordenação** da listagem: por `name` ascendente, para o resultado ser determinístico.
- **Exclusão**: remover uma máquina apaga em cascata seus pontos de monitoramento
  (política já declarada no schema); sensores associados são apenas desassociados, não
  apagados.

### Convenções de pontos de monitoramento e sensores

- **Ponto**: pertence a uma máquina; o nome (trim, máx. 120) é único **por máquina**
  (`409 MONITORING_POINT_NAME_CONFLICT`); máquina inexistente é `404`.
- **Sensor**: identificador (`serialNumber`) único global (`409 SENSOR_SERIAL_CONFLICT`);
  modelo em `TcAg`/`TcAs`/`HF+` (`400 INVALID_SENSOR_MODEL`); cada ponto aceita no máximo
  um sensor (`409 MONITORING_POINT_SENSOR_CONFLICT`).
- **Regra Pump**: máquinas `Pump` recusam `TcAg`/`TcAs` na associação
  (`409 SENSOR_MODEL_NOT_ALLOWED`) **e** na transição de tipo: um `PATCH /machines/:id`
  que tornaria a máquina `Pump` com sensores proibidos é revertido com
  `409 MACHINE_TYPE_SENSOR_CONFLICT`. Os dois fluxos são serializados por lock na linha
  da máquina, então a regra vale mesmo sob concorrência.
- **Listagem**: `GET /api/monitoring-points?page=1&pageSize=5&sortBy=machineName&sortDir=asc`.
  A **interface usa sempre 5 por página**, como pede o enunciado; na API o `pageSize` é um
  parâmetro opcional (padrão 5, máximo 50) para testes e consumidores programáticos.
  Parâmetros desconhecidos na query são rejeitados com `400`, como no corpo.
  `sortBy` aceita `machineName`, `machineType`, `pointName` e `sensorModel`; a ordenação
  usa o vocabulário público exibido na tabela (ex.: `HF+` < `TcAg` < `TcAs`), com pontos
  sem sensor sempre ao final, e desempate determinístico por nome e id. A resposta traz
  `items`, `total`, `page`, `pageSize`, `sortBy` e `sortDir`.

### Ingestão de um ciclo

A rota é privada: reutilize o `TOKEN` obtido na seção **Autenticando pelo terminal**.

```bash
curl -X POST http://localhost:3000/api/telemetry-cycles \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: minha-chave-001' \
  --data @contracts/dynamox/examples/telemetry-cycle.example.json
```

### Como a idempotência funciona

A chave viaja no header, e não no corpo, porque `telemetryCycleData` declara
`additionalProperties: false`: acrescentar um campo ali invalidaria o payload.

O backend separa **intenção** de **conteúdo**. A `Idempotency-Key` expressa a intenção do
cliente; o `payloadFingerprint` — SHA-256 canônico sobre o ciclo inteiro, incluindo cada
par `timestamp`/`value` — identifica o conteúdo. Ambos têm restrição única.

| Requisição | Resposta |
|---|---|
| Chave conhecida + mesmo fingerprint | `200` `duplicate:true`, resultado original |
| Chave conhecida + fingerprint diferente | `409 IDEMPOTENCY_KEY_REUSED` |
| Chave nova + fingerprint conhecido | `200` `duplicate:true`, sem novo ciclo |
| Conteúdo inédito | `201` |

Sem header, o próprio fingerprint vira a chave: reprocessar o mesmo lote é reconhecido
como repetição sem nenhuma configuração do cliente. Duas requisições idênticas simultâneas
resultam em um único ciclo — a perdedora recupera e devolve o mesmo resultado da vencedora.

### Erros previstos

| Status | Código | Situação |
|---|---|---|
| `400` | `CONTRACT_VIOLATION` | Payload fora do schema interno (com a lista de violações) |
| `400` | `INVALID_IDEMPOTENCY_KEY` | Header fora de 1–128 caracteres do conjunto seguro |
| `400` | `NON_CANONICAL_TIMESTAMP` | Instante fora de `YYYY-MM-DDTHH:mm:ss.SSSZ` |
| `404` | `SENSOR_NOT_FOUND` | `measuringSystemUniqueIdentifier` desconhecido |
| `409` | `IDEMPOTENCY_KEY_REUSED` | Chave já usada para outro conteúdo |
| `409` | `SAMPLE_TIMESTAMP_CONFLICT` | Instante repetido no payload ou já gravado na série |
| `409` | `SERIES_UNIT_CONFLICT` | Unidade divergente da já registrada para a série |
| `422` | `QUANTITY_AXIS_MISMATCH` | Grandeza vetorial sem eixo, ou escalar com eixo |
| `422` | `RESOURCE_ID_MISMATCH` | `resourceId` não é o do ponto monitorado do sensor |
| `422` | `SENSOR_NOT_ASSOCIATED` | Sensor sem ponto de monitoramento |

Conflitos abortam a transação inteira: nenhum ciclo é criado e nenhuma amostra é gravada
pela metade. Amostras nunca são descartadas em silêncio — uma colisão de instante é sempre
um erro explícito, jamais uma gravação parcial.

## Estrutura

```
apps/api     backend NestJS (autenticação, CRUD de máquinas, telemetria, health check)
apps/web     frontend React + Vite + Material UI 5 + Redux Toolkit
libs/domain  vocabulário e regras de domínio (isomórfico, sem dependência de Node)
libs/contracts  validação Ajv do contrato interno e derivação de identificadores
libs/ui      estados reutilizáveis de carregamento, erro e vazio
contracts/dynamox  SCP-04 (snapshot público + contrato interno + exemplo)
prisma       schema, migrações e seed
```

### Decisões de estrutura

- **Nx sobre npm workspaces.** Os projetos são pacotes npm e o Nx orquestra os alvos
  declarados nos `package.json` (`build`, `lint`, `typecheck`, `test`), com o grafo de
  dependências resolvido por `dependsOn: ["^build"]`. Isso evita geradores acoplados a
  plugins e mantém cada projeto executável isoladamente com `npm run -w`.
- **`prisma/` e `contracts/` na raiz.** São compartilhados entre API, seed, ferramentas e
  (na fase do BON-06) o gateway de simulação; deixá-los dentro de `apps/api` criaria uma
  dependência invertida.
- **Aliases de fonte apenas em ferramentas de bundle.** No build, `@dynamox/*` é resolvido
  pelo `node_modules` do workspace a partir do `dist` publicado. O Vite usa alias direto
  para o código-fonte, porque já compila TypeScript e assim dispensa o build das libs em
  desenvolvimento.

## Já implementado

- **Autenticação end-to-end**: login com credencial fixa, JWT emitido e validado pela
  própria API, guard global, `GET /auth/me`, sessão Redux restaurada após reload, logout e
  proteção das rotas privadas no frontend. Detalhes e decisões em
  [`docs/analysis/02-api/auth-and-rbac.md`](./analysis/02-api/auth-and-rbac.md).
- **CRUD autenticado de máquinas no backend**: criação e edição aceitando somente `Pump` e
  `Fan`, listagem determinística (ordenada por nome), exclusão, e os erros `400` (payload
  ou tipo inválido), `404` (máquina inexistente) e `409` (nome duplicado, garantido pelo
  índice único do PostgreSQL via Prisma). Coberto por testes e2e contra o banco real.
- **Listagem e cadastro de máquinas no frontend** (MAC-02): painel em Material UI 5 que
  carrega a lista pela API autenticada, com estados de carregamento, erro e lista vazia, e
  formulário de cadastro com seleção `Pump`/`Fan`, validação de nome antes do envio e
  exibição da mensagem real da API para nome duplicado.
- **Edição e exclusão de máquinas no frontend** (MAC-03): edição de nome e tipo com o
  formulário pré-preenchido e a mensagem real da API em conflito (nome duplicado ou
  bloqueio `MACHINE_TYPE_SENSOR_CONFLICT` ao virar Pump com sensor proibido); exclusão em
  duas etapas com aviso sobre a remoção em cascata dos pontos; após editar ou excluir, a
  tabela de pontos de monitoramento é recarregada para as telas nunca divergirem.
- **Pontos de monitoramento e sensores** (MON-01…06): criação de pontos por máquina,
  associação de sensor com identificador único e modelo `TcAg`/`TcAs`/`HF+`, regra
  `Pump` × (`TcAg`, `TcAs`) aplicada na associação **e** na troca de tipo da máquina
  (com lock de linha contra corridas), tabela paginada de 5 em 5 e ordenável pelas quatro
  colunas do enunciado — tudo no backend e no frontend, coberto por e2e contra o banco
  real e testes de componente.
- Ingestão idempotente de telemetria e leitura de séries com métricas.

## Pendências para fechar o P0

Nenhuma. O P0 convencional está completo: README de entrega na raiz (`docs: add
reproducible challenge delivery guide`), testes unitários isolados de backend, medição
reproduzível de latência (`npm run perf:latency`) e validação integral em clone limpo.
O que resta é da entrega em si (revisão final, PR e e-mail) e os bônus.

## Histórico sintético de 30 dias (opcional)

Popula um mês de telemetria para os 12 sensores da planta **pelo mesmo `POST
/telemetry-cycles`** (Ajv, idempotência e 409/422 reais), no banco normal da aplicação —
uma aquisição de 60 janelas a cada 15 min por sensor, com regime operacional, eventos e
verdade-terreno em `metadata.history`. Especificação em
[`analysis/05-simulation/history-dataset.md`](analysis/05-simulation/history-dataset.md);
decisão em [ADR-0010](analysis/06-decisions/adr-0010-history-through-contract.md).

Pré-requisitos: API no ar e planta criada (`npm run plant -- bootstrap && npm run plant -- baseline && npm run plant -- condition`).

```bash
npm run twin:history -- --dry-run          # plano, contagens, lacunas, instantes reservados, bench
npm run twin:history -- --sensors SIM-HF-003 --limit 50    # smoke: 50 ciclos 201; repetir → 50 × 200
npm run twin:history -- --report simulation/sensor-twin/artifacts/history-report.json
npm run twin:history                       # reexecutar: 0 criados, tudo duplicate (idempotente)
npm run history:purge -- --dry-run         # quanto sairia; --yes remove só o dataset
npm run db:reset                           # banco do zero (volume, migrações, seed)
```

Ordem de grandeza (12 núcleos): ~33 mil ciclos, ~10 milhões de amostras, ~3,5 GB no
Postgres, poucos minutos de carga (geração em `worker_threads`, POSTs com concorrência
limitada). Flags: `--days`, `--every`, `--sensors`, `--workers`, `--concurrency`,
`--since`, `--limit`, `--epoch`, `--to`, `--no-detect`. A grade é absoluta e o fim é
`DEMO_DATA_ANCHOR − 4 h`: reexecutar dias depois acrescenta só os slots novos.

Rode `npm run twin:integration` **antes** da carga (ou após um purge): com o mês presente, o
supervisor do twin e o dashboard degradam — de propósito. Os gargalos expostos e a direção
da próxima fase estão em
[`analysis/07-validation/testing-strategy.md`](analysis/07-validation/testing-strategy.md#bottlenecks-expostos-pelo-histórico-e-direção-da-próxima-fase).

## Preparação da demonstração (caminho recomendado)

Um comando, na ordem que funciona, **com a API parada**:

```bash
npm run demo:prepare                       # tudo: banco, planta, 30 dias, alertas, validação
npm run demo:prepare -- --skip-history     # sem o mês sintético (rápido, para conferir a UI)
npm run demo:prepare -- --skip-reset       # mantém o banco atual e só recarrega/reprocessa
npm run demo:verify                        # invariantes; -- --api inclui as rotas HTTP
```

O script sobe uma **API temporária com `ALERTS_EVALUATE_ON_INGEST=false` e sem varredura de
presença** para a carga, derruba-a e só então roda `alerts:backfill`. Essa é a única ordem
correta, e é a armadilha que ele existe para eliminar: o motor online avalia pelo relógio de
parede, então avaliar trinta dias de histórico ao vivo produziria episódios datados de hoje.
Qualquer passo que falhe interrompe a preparação com o código de saída do comando — nada é
mascarado.

Ao final: `npm run dev:api` e `npm run dev:web`.

## Alertas: motor, backfill e validação

O motor avalia cada ciclo logo depois do commit da ingestão e varre a presença por timer
(ver variáveis acima). Para um banco recém-carregado — ou um histórico ingerido com a API
desligada / `ALERTS_EVALUATE_ON_INGEST=false` — o backfill reexecuta a mesma função de decisão
com relógio replayado, idempotente:

```bash
npm run alerts:backfill -- --dry-run          # ciclos por dia, nada aplicado
npm run alerts:backfill                       # ~3 min para 30 dias; reexecutar → 0 avaliações novas
npm run alerts:seed-history                   # operação anterior (mar–mai): ~195 episódios ENCERRADOS para a listagem; idempotente, nunca toca o período rotulado
npm run alerts:backfill -- --reset --yes      # zera SÓ as tabelas do motor e refaz (amostras/ciclos intactos)
npm run alerts:validate                       # matriz TP/FP/TN/FN contra a verdade-terreno → docs/analysis/07-validation/alert-validation.md
```

Ordem recomendada depois de `npm run db:reset`: planta (`plant bootstrap/baseline/condition`)
→ `npm run twin:history` **com a API desligada** (ou `ALERTS_EVALUATE_ON_INGEST=false`) →
`npm run alerts:backfill` → subir a API. Com a API viva e o motor ligado, ciclos do histórico
chegam fora de ordem temporal e ficam no ledger como `OUT_OF_ORDER` (registrados, não
aplicados); `alerts:backfill --reset --yes` reconcilia. **Não rode o backfill com a API no ar**:
a varredura de presença ao vivo abriria episódios com o relógio de parede no meio do replay.

Fim do dataset é estado honesto: sem aquisição desde 30/08, a presença abre um
`FLEET_SILENT` ("planta sem telemetria") e o mantém enquanto durar. Na interface: `/alerts`
(listagem com recorte na URL), `/alerts/:id` (regra, evidência, linha do tempo,
reconhecimento) e seções de alertas nas páginas de máquina, ponto e sensor; o KPI "Alertas
abertos" da home leva à listagem.

## Estado do bônus BON-06 (concluído; ver `docs/analysis/07-validation/traceability.md`)

O bônus foi entregue como **sensor twin determinístico com frota sintética** (não um
gêmeo digital operacional bidirecional): 6 máquinas / 12 pontos / 12 sensores criados
somente pelas APIs reais, supervisor deliberativo que decide só por séries persistidas
(`OBSERVE → RANK → ACT → RE-OBSERVE → RECOMMEND`) e proveniência ROS **opcional**
(JSONL → rosbag → replay `duplicate:true`). Blender, Xacro e Gazebo foram **cortados**
por decisão (value engineering); o plano antigo está preservado como histórico no cartão
Notion BON-06. Código em `simulation/sensor-twin/` — guia completo em
[`simulation/sensor-twin/README.md`](../simulation/sensor-twin/README.md). O core
full-stack não depende deste bônus.
