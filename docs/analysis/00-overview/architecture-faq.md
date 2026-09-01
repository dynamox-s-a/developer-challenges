# FAQ técnico da arquitetura

Perguntas diretas sobre o sistema, com resposta curta e o caminho para o detalhe. Onde
existe decisão registrada, a resposta linka o ADR em vez de repeti-lo.

## Frontend

**Por que Redux, e por que thunks?**
O enunciado exige Redux com camada assíncrona. Entre Thunk e Saga, o escopo (uma chamada →
uma transição de estado) não justifica o modelo de efeitos de uma saga.
→ [ADR-0003](../06-decisions/adr-0003-redux-toolkit-thunks.md)

**Por que não RTK Query?**
Poucas entidades e nenhuma invalidação cruzada complexa; o peso do produto está no cálculo
derivado do dashboard, não no transporte. A fronteira de rede está isolada em
`api/client.ts`, então migrar depois é possível.
→ [ADR-0003](../06-decisions/adr-0003-redux-toolkit-thunks.md)

**O "estado" que aparece na matriz vem do backend?**
Não. É calculado no cliente, a cada render, a partir de dados reais; nada é persistido, e os
limiares são didáticos. É também por isso que não existe filtro por condição na API.
→ [`../01-dashboard/condition-monitoring.md`](../01-dashboard/condition-monitoring.md)

## Backend

**Por que NestJS?**
O projeto precisava de módulos, injeção de dependência, guards globais e geração de OpenAPI
a partir do próprio código — tudo de fábrica, sem montar um framework à mão. O custo é a
convenção de decorators, que a suíte de contrato mantém honesta.
→ [`../02-api/backend-architecture.md`](../02-api/backend-architecture.md)

**Por que o backend decide autorização, se a UI já esconde o botão?**
Porque a API é chamável sem a UI — o próprio sensor twin faz isso. Esconder botão é
experiência; a barreira é o `403`.
→ [ADR-0001](../06-decisions/adr-0001-backend-authority.md)

**`401` ou `403`?**
`401` = não sei quem você é. `403` = sei quem você é e você não pode. Os dois são testados
separadamente.
→ [`../02-api/auth-and-rbac.md`](../02-api/auth-and-rbac.md)

**Por que PostgreSQL e Prisma, e não Mongo?**
O domínio é uma cadeia de chaves com invariantes fortes (unicidades e atomicidade de
ingestão). Índice único e transação resolvem isso no motor, sem código de aplicação frágil.
→ [ADR-0002](../06-decisions/adr-0002-postgresql-prisma.md)

**Por que a listagem usa SQL cru em vez do `orderBy` do Prisma?**
Porque a ordenação precisa seguir o vocabulário público exibido na tela (`HF+ < TcAg <
TcAs`), e não a ordem interna do enum. Os fragmentos vêm de um mapa fechado; nada do request
entra como SQL.
→ [ADR-0007](../06-decisions/adr-0007-server-side-query-contracts.md)

**Por que um parâmetro desconhecido é erro, e não algo ignorado?**
Filtro ignorado em silêncio devolve a lista inteira com aparência de lista filtrada. Preferimos
`400`.
→ [`../02-api/backend-architecture.md`](../02-api/backend-architecture.md)

## Telemetria

**Como funciona a idempotência?**
Duas identidades: a chave (`Idempotency-Key`, no header) e o fingerprint canônico do
conteúdo. Mesmo conteúdo → `200 duplicate:true`; mesma chave com conteúdo diferente →
`409`; sem header, o próprio fingerprint vira a chave.
→ [`../02-api/telemetry-ingestion.md`](../02-api/telemetry-ingestion.md) ·
[ADR-0004](../06-decisions/adr-0004-idempotent-ingestion.md)

**E se duas requisições idênticas chegarem ao mesmo tempo?**
As duas tentam inserir; o índice único decide. A perdedora relê o ciclo vencedor e devolve
a mesma resposta — há teste com as duas ingestões em paralelo.
→ [`../02-api/telemetry-ingestion.md`](../02-api/telemetry-ingestion.md)

**Por que a chave vai no header e não no corpo?**
Porque `telemetryCycleData` do contrato público declara `additionalProperties: false`:
acrescentar campo violaria o contrato que estamos preservando.
→ [`../04-contracts/telemetry-contract.md`](../04-contracts/telemetry-contract.md)

**Por que o timestamp é tão restrito?**
A coluna é `TIMESTAMPTZ(3)`. Aceitar precisão submilissegundo faria dois instantes distintos
colidirem na mesma amostra depois do truncamento — perda silenciosa de dado.
→ [`../03-domain/domain-and-persistence.md`](../03-domain/domain-and-persistence.md)

## Contratos

**Isto é a API da Dynamox ou um contrato inventado?**
É o corpo do `POST /v1/telemetry-cycles` oficial, **reduzido**, com cada diferença
classificada como PRESERVADO, REDUÇÃO ou ADAPTAÇÃO — e nenhuma linha em que aceitemos algo
que o público recusa.
→ [`../04-contracts/telemetry-contract.md`](../04-contracts/telemetry-contract.md) ·
[ADR-0005](../06-decisions/adr-0005-internal-contract-reduction.md)

**Vocês chamaram a API da Dynamox?**
Não. Só o documento público de especificação foi baixado, uma vez, sem credencial, e está
versionado com hash. Os dois clientes recusam por código domínios da Dynamox.
→ [`../04-contracts/dynamox-upstream.md`](../04-contracts/dynamox-upstream.md) ·
[ADR-0008](../06-decisions/adr-0008-synthetic-isolation.md)

**Como o Swagger se mantém alinhado ao runtime?**
O schema do corpo de telemetria é derivado do mesmo arquivo que o Ajv valida, e uma suíte de
paridade exige veredito idêntico das duas portas. Antes disso havia uma cópia manual — ela
divergiu, e a divergência foi reproduzida em runtime.
→ [`../02-api/openapi.md`](../02-api/openapi.md) ·
[ADR-0006](../06-decisions/adr-0006-single-source-contract.md)

## Simulação e mundo real

**O que existe de ROS?**
Uma ponte de proveniência **offline**: JSONL ⇄ rosbag via `rosbag.Bag`, sem `roscore`, sem
nós, sem publicação ao vivo. Ela prova que uma aquisição vira artefato portátil e volta com
o mesmo fingerprint.
→ [`../05-simulation/ros-integration.md`](../05-simulation/ros-integration.md)

**Existe Gazebo?**
Não. Nenhum `.world`, `.urdf`, `.sdf` ou `.xacro` no repositório. Houve planejamento, foi
cortado por escopo, e o ponto de encaixe (produtor antes da ponte ROS) está descrito.
→ [`../05-simulation/simulation-vs-real.md`](../05-simulation/simulation-vs-real.md)

**Vocês conectaram um sensor físico?**
Não. Toda telemetria é sintética. O caminho de entrada de um sensor real —
sensor → gateway → adapter → **o mesmo contrato** — está descrito, junto com o que faltaria
(credenciais, *Resource Model*, calibração, um valor de `origin` para aquisição física).
→ [`../05-simulation/simulation-vs-real.md`](../05-simulation/simulation-vs-real.md)

**Isso é um digital twin?**
É um **sensor twin determinístico com frota sintética** e uma sombra digital dos estados
simulados persistidos. Não é bidirecional: nada volta do banco para um equipamento.
→ [`../05-simulation/sensor-twin.md`](../05-simulation/sensor-twin.md)

**Como entraria tempo real?**
Como canal de notificação, com REST e PostgreSQL continuando fonte de verdade; a costura é
publicar um evento **após** a transação de ingestão. Hoje não existe WebSocket no
repositório.
→ [ADR-0009](../06-decisions/adr-0009-rest-source-of-truth.md)

## Entrega

**O que mudaria em produção?**
Segredos e credenciais fora do repositório com rotação; CORS restrito por origem;
observabilidade (log estruturado, métricas, tracing); retenção e possivelmente partição das
amostras por tempo; migrações aplicadas por pipeline; o guard de host substituído por
configuração de ambiente controlada; e limiares de condição calibrados de verdade, não
didáticos. Nada disso está implementado, e nenhum documento desta base afirma o contrário.

**Que ambiguidades do enunciado precisaram de decisão?**
As principais: paginação fixa em cinco na tela × parâmetro na API (resolvida com UI=5 e
teto de 50); a regra Pump × TcAg/TcAs valer também na **troca de tipo** da máquina, e não só
na associação (implementada com lock de linha nos dois fluxos); e o significado de
"recuperação completa" de uma série, resolvido como paginação por offset com `total`, sem
truncamento silencioso.

**O que ficou conscientemente de fora?**
Cypress (o fluxo é coberto por Vitest + e2e), filtro global de exceções (os erros já saem
com envelope único), deploy/balanceador/teste de carga, forecast e diagnóstico, realtime, e
qualquer integração com a plataforma real. Cada ausência está registrada com o motivo — em
[`../07-validation/traceability.md`](../07-validation/traceability.md) e em
[`../05-simulation/simulation-vs-real.md`](../05-simulation/simulation-vs-real.md).
