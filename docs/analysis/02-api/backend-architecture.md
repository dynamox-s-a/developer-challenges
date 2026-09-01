# Arquitetura do backend

API NestJS 10 sobre Prisma 5 e PostgreSQL 16, servida sob o prefixo `/api`
([`apps/api/src/main.ts`](../../../apps/api/src/main.ts)). Este documento descreve como as
peças se encaixam e quais políticas valem em toda a superfície HTTP. A lista de rotas não
está aqui de propósito: ela é gerada do próprio código em `/api/docs`
([`openapi.md`](./openapi.md)).

## Módulos

| Módulo | Responsabilidade |
|---|---|
| `AuthModule` | login, `/auth/me`, emissão/validação de JWT e os dois guards globais |
| `HealthModule` | probe público de disponibilidade (API + banco) |
| `MachinesModule` | CRUD de máquinas e a regra de tipo × sensores associados |
| `MonitoringPointsModule` | pontos, associação de sensor e o contrato de listagem |
| `TelemetryModule` | ingestão de ciclos e leitura/exclusão de séries |
| `PrismaModule` | cliente Prisma como serviço, com hooks de shutdown |

Cada módulo tem a mesma anatomia: **controller** (contrato HTTP + documentação OpenAPI),
**parsers de DTO** (funções puras que validam a entrada), **service** (regra e acesso ao
banco). Não há camada de repositório entre service e Prisma: ela só repetiria a API do
Prisma sem acrescentar decisão.

O vocabulário e as regras que precisam valer também no frontend e no sensor twin ficam
fora da API, em `libs/domain` — a API importa, não redefine
([`../03-domain/domain-and-persistence.md`](../03-domain/domain-and-persistence.md)).

## Entrada de uma requisição

```
requisição
  → JwtAuthGuard  (global)   autenticou? senão 401     ← @Public() libera health e login
  → RolesGuard    (global)   pode alterar? senão 403
  → controller               parser de DTO/query: forma inválida → 400
  → service                  regra de negócio e transações → 404 / 409 / 422
  → Prisma / PostgreSQL      unicidade e isolamento
```

Os dois guards são registrados como `APP_GUARD` no `AuthModule`, nessa ordem: o primeiro
popula `request.user`, o segundo decide a permissão. Detalhe em
[`auth-and-rbac.md`](./auth-and-rbac.md) e o porquê em
[ADR-0001](../06-decisions/adr-0001-backend-authority.md).

## Validação e contrato de erro

**Não há `ValidationPipe` com `class-validator`.** Cada entrada é validada por uma função
pura exportada pelo módulo (`parseCreateMachineDto`, `parseAssignSensorDto`,
`parseListMonitoringPointsQuery`, `parseSamplesQuery`, `parseLoginDto`), que recebe
`unknown` e devolve um tipo. A escolha tem duas consequências boas: a validação é testável
sem subir o Nest, e o erro produzido é do vocabulário do domínio, não uma mensagem
genérica de biblioteca.

Três políticas valem em **toda** a API:

1. **Propriedade desconhecida é `400`, nunca silêncio.** Vale para corpo e para query
   string. Ignorar um campo faria o cliente acreditar que ele foi considerado — e um
   filtro ignorado em silêncio é uma resposta errada com aparência de certa.
2. **Malformado (`400`) ≠ inexistente (`404`).** `machineId` que não é UUID é `400` no
   parser; UUID bem formado que não existe é `404` no service. O consumidor precisa
   distinguir "corrigir o pedido" de "o recurso sumiu".
3. **Limites explícitos.** Todo texto tem tamanho máximo e todo inteiro tem faixa
   (`Number.isSafeInteger` inclusive), para que um valor absurdo vire `400` em vez de
   chegar ao banco como `OFFSET` impossível.

O corpo de erro é sempre o mesmo envelope:

```json
{ "code": "MACHINE_NAME_CONFLICT", "message": "Já existe uma máquina com o nome \"P-101\"." }
```

`code` é estável e é o que o cliente deve tratar; `message` é legível e pode mudar de
redação. Alguns erros de ingestão acrescentam contexto opcional (`violations`,
`timeSeriesId`, `conflictingTimestamps`) — nunca no lugar dos dois campos obrigatórios.
O modelo publicado é `ErrorResponse` em
[`apps/api/src/common/api-schemas.ts`](../../../apps/api/src/common/api-schemas.ts).

Não existe filtro global de exceções: os erros são lançados como exceções do Nest
(`BadRequestException`, `ConflictException`, `UnprocessableEntityException`, …) com o
envelope no corpo. Uma camada única traria consistência de formato — que já existe — ao
custo de esconder a origem de cada código.

### Semântica dos status

| Status | Quando |
|---|---|
| `400` | forma inválida: campo desconhecido, tipo errado, fora de faixa, contrato de telemetria violado |
| `401` | não autenticado: sem token, token inválido, expirado ou sem perfil reconhecível |
| `403` | autenticado, mas o perfil não pode alterar estado |
| `404` | recurso bem identificado que não existe |
| `409` | conflito com estado existente: unicidade, regra Pump × TcAg/TcAs, chave de idempotência reusada, instante já ocupado |
| `422` | payload íntegro, mas semanticamente impossível: grandeza escalar com eixo, `resourceId` de outro ponto, sensor sem ponto associado |
| `503` | apenas `GET /api/health`, com o mesmo corpo de saúde e `status: "degraded"` |

## Query contracts

A listagem de pontos (`GET /api/monitoring-points`) resolve **tudo no banco**: paginação,
ordenação, busca e filtros. O porquê está em
[ADR-0007](../06-decisions/adr-0007-server-side-query-contracts.md); o mecanismo é este:

| Parâmetro | Contrato |
|---|---|
| `page` | inteiro ≥ 1 (teto publicado); default 1 |
| `pageSize` | 1–50; default 5 |
| `sortBy` | whitelist: `machineName`, `machineType`, `pointName`, `sensorModel` |
| `sortDir` | `asc` \| `desc`; default `asc` |
| `search` | texto até 120 caracteres |
| `machineType` | `Pump` \| `Fan` |
| `sensorModel` | `TcAg` \| `TcAs` \| `HF+` |
| `hasSensor` | `true` \| `false` |

Quatro decisões dentro disso merecem nome:

**A UI usa 5; a API aceita até 50.** O enunciado fixa cinco itens por página na tela, e a
tela usa cinco. `pageSize` existe porque a API também é consumida por código — o próprio
dashboard varre o inventário completo em páginas de 50
([`apps/web/src/api/client.ts`](../../../apps/web/src/api/client.ts)). O teto impede que a
paginação vire um `SELECT *` disfarçado.

**Ordena-se pelo vocabulário público, não pelo enum do banco.** `HF+ < TcAg < TcAs` é o
que o usuário vê; a ordem interna do enum PostgreSQL (`TC_AG`, `TC_AS`, `HF_PLUS`) daria
outro resultado. Por isso a listagem usa SQL com `CASE` em vez de `orderBy` do Prisma —
com os fragmentos vindos de um mapa fechado (`SORT_EXPRESSIONS`), nunca do request. O
desempate é sempre `mp.name ASC, mp.id ASC`, e `NULLS LAST` põe pontos sem sensor no fim.

**Busca é dado, não SQL.** O termo entra como parâmetro (`Prisma.sql`), com os curingas do
`LIKE` escapados: quem digita `%` procura o caractere `%`. Ela cobre os três campos que a
tabela exibe — nome da máquina, nome do ponto e série do sensor.

**A página e o total saem do mesmo snapshot.** As duas consultas (linhas e `count`)
compartilham o **mesmo** `WHERE` e rodam dentro de uma transação em
`RepeatableRead` — `monitoring-points.service.ts:262-293`. Em `ReadCommitted`, cada
statement enxergaria um instante diferente e o `total` poderia não corresponder aos itens
devolvidos sob escrita concorrente. A mesma técnica protege a paginação de amostras
(`telemetry.service.ts:474-486`), que é o que sustenta a recuperação completa de uma série
por `offset` sem truncamento silencioso.

A resposta ecoa o recorte aplicado (`search`, `machineType`, `sensorModel`, `hasSensor`,
`sortBy`, `sortDir`) e traz `total` e `totalPages` **do recorte**, não da tabela. O eco
existe para o cliente confirmar o que o servidor de fato considerou.

## Concorrência e transações

Três pontos do backend assumem explicitamente que há outra requisição acontecendo:

- **Associação de sensor × troca de tipo da máquina.** `assignSensor` abre transação e
  relê a máquina com `SELECT … FOR UPDATE` antes de decidir a regra Pump ⇒ HF+; o `PATCH`
  de máquina toma o lock da mesma linha ao atualizar e só então verifica os sensores
  associados, desfazendo a alteração se ela criaria uma combinação proibida. Os dois
  fluxos se serializam na linha da máquina — sem isso, um `PATCH` para `Pump` concorrente
  com uma associação de `TcAg` poderia deixar o banco num estado que a regra proíbe.
- **Unicidade por índice.** Nome de máquina, nome de ponto na máquina, série do sensor e
  chaves do ciclo são garantidos pelo PostgreSQL; o service traduz o `P2002` no `409`
  correspondente, desambiguando pelo alvo do índice (o formato de `meta.target` varia
  entre versões do Prisma, e um alvo irreconhecível vira conflito genérico em vez de
  código errado).
- **Ingestão idempotente.** Duas requisições idênticas simultâneas convergem para um único
  ciclo persistido e para a mesma resposta — ver [`telemetry-ingestion.md`](./telemetry-ingestion.md).

## Configuração

`ConfigModule` global lendo `.env` da raiz (ou do diretório do app). A API **recusa subir**
sem `JWT_SECRET` — falhar no boot é melhor do que assinar tokens com um segredo default.
CORS liberado para a origem que chamar (`origin: true`), adequado ao ambiente local do
desafio e não a uma exposição pública. Variáveis, portas e comandos:
[`docs/SETUP.md`](../../SETUP.md).
