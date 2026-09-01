# SCP-05 — Auditoria de drift entre artefatos de contrato

> **Anexo de contrato.** Catálogo das inconsistências internas da especificação pública
> e das divergências deliberadas do contrato interno. Entrada pela
> [visão do upstream](./dynamox-upstream.md); o contrato interno campo a campo está em
> [`telemetry-contract.md`](./telemetry-contract.md).

Confronto entre o snapshot público, o contrato interno, o exemplo, o schema Prisma, a
validação em runtime e os testes. O snapshot oficial permanece byte a byte idêntico
(`sha256 cc6e0f07f9a2c16336a30acf09acdf56d97d64a01e0e90fceac9c30c04b225dd`) e **nenhuma
inconsistência foi corrigida silenciosamente na fonte** — o snapshot é preservado como
recebido e a decisão interna fica registrada aqui.

Classificação: **bloqueadora** (impede implementar sem decisão), **relevante** (exige
decisão registrada e teste) ou **documental** (não afeta código, mas precisa constar).
Níveis de evidência: `CONFIRMADO` / `DERIVADO` / `HIPÓTESE_DE_SIMULAÇÃO` / `DESCONHECIDO`.

## 1. Inconsistências internas da especificação pública

### 1.1 `monitoringLocationMap` vs `monitoringLocationMapSchema` — relevante

Em `POST /v1/configuration-slots`, o `required` do corpo exige **`monitoringLocationMap`**,
mas a única propriedade declarada é **`monitoringLocationMapSchema`** (array de
`{mapLabel, mapValue: 24-hex | null}`). A spec exige um campo que não declara — `CONFIRMADO`.

**Decisão interna:** campo canônico = `monitoringLocationMap`; o outro nome é alias da
fonte. Implementado no contrato interno e coberto por teste que garante que o alias não
vaza.

### 1.2 `GET /v1/waveforms/` promete lista e declara objeto — relevante

`summary` = "Get waveforms list from monitoring points"; query params de listagem paginada
(`monitoringPointIds` obrigatório, `fromTime`/`toTime` obrigatórios, `page`/`limit`/`sort`/
`direction`); mas o schema `200` é um **objeto único** (`_id`, `simultaneous`, `startedAt`,
`finishedAt`, `settings[]`, `spotId`, …) sem array nem envelope — `CONFIRMADO`. Os
parâmetros reforçam a intenção de lista; a forma real da resposta é `DESCONHECIDO`.
**Decisão:** não consumir a operação nesta fase.

### 1.3 Security schemes referenciados mas nunca definidos — bloqueadora para uso real

- 32 operações declaram `HTTPBearer`; 11 declaram `bearerAuth`; 2 não declaram `security`;
- **`components.securitySchemes` é `{}`** — os dois nomes são referências pendentes, não
  apenas nomenclatura divergente. `CONFIRMADO` (censo no inventário).

Irrelevante para este projeto (não chamamos a API); bloqueador para quem gerar cliente.

### 1.4 Path `:assetId` em estilo Express — documental

`GET /v1/assets/:assetId/monitoring-points` usa `:assetId` no literal do path e ainda assim
declara o parâmetro de path `assetId` obrigatório — `CONFIRMADO`. Geradores de cliente
podem falhar; sem impacto local.

### 1.5 Descrição de `measurements` incompatível com o schema — documental

Em `POST /v1/telemetry-cycles`, `measurements` é array de **objetos** (`resourceId`,
`attributes`, `dataPoints`), mas a description fala em "an array of unique identifiers…" —
resíduo de copy-paste, `CONFIRMADO`. O schema foi seguido, não a description.

### 1.6 `attributes` do Metric Descriptor sem estrutura; `axis` só em exemplo — relevante

*(Correção sobre a versão anterior deste relatório, que apresentou `attributes.axis` como
parte estrutural do contrato.)*

Em `GET /v1/telemetry/metric-descriptor` (e no item de `data-points/raw`), `attributes` é
apenas `type: object`, **sem `properties` nem `required`**; `axis: "x"` e
`physicalQuantity: "acceleration"` aparecem **somente em `examples`** — `CONFIRMADO`.

O contraste com waveform metrics permanece real, mas assimétrico: lá `attributes` **exige**
`physicalQuantity`, `statisticalProcessing` e `band` e não declara `axis` (o valor é
triaxial). **Decisão:** o contrato interno pode continuar exigindo `axis`/`unit` como
estreitamento deliberado; a fundamentação é convenção observada em exemplo + necessidade
local, nunca "o schema público exige".

### 1.7 Escrita × leitura de telemetria divergem em nome e tipo — relevante

- Escrita (`POST /v1/telemetry-cycles`): ponto de dado `{ timestamp, value: number | boolean }`.
- Leitura (`GET /v1beta/telemetry/data-points/raw`): ponto de dado
  `{ datetime, value: boolean | integer | number }`.

`CONFIRMADO`. **Decisão:** o normalizador aceita `timestamp` e `datetime` como sinônimos
de instante e trata `integer` como `number`. Valores **booleanos** não são convertidos
silenciosamente para `0`/`1`: produzem o resultado explícito
`{ kind: 'unsupported', reason: 'boolean-telemetry', rawValue, sourceRef }`, preservando o
valor original e a origem — política local congelada no mapping (seção 5),
`HIPÓTESE_DE_SIMULAÇÃO`, não regra oficial.

### 1.8 Arrays de waveform sem tipo de item — documental

Em `GET /v1/waveform/{waveformId}/raw` e `/spectrum`, os arrays `x`, `y`, `z`, `time` e
`frequency` declaram `items: {}` (schema vazio = qualquer valor) — `CONFIRMADO`. O schema
garante apenas "array ou nulo"; os `examples` mostram números e a semântica do domínio
sugere valores numéricos. **`number[]` não é obrigação estrutural do schema**: no
simulador, usar `number[]` é `HIPÓTESE_DE_SIMULAÇÃO` apoiada pelos exemplos.

## 2. Divergências deliberadas do contrato interno (não são drift acidental)

| Campo | Público 2.4.7 | Interno | Classificação |
| --- | --- | --- | --- |
| `dataPoints[].value` | `number \| boolean` | `number` | documental |
| `dataPoints[].timestamp` | `date-time` fração livre | `YYYY-MM-DDTHH:mm:ss.SSSZ` | relevante (evita colapso no `TIMESTAMPTZ(3)`) |
| `attributes.unit` | não exigido | exigido | relevante |
| `attributes.axis` | ausente do schema (só exemplo) | exigido p/ grandezas vetoriais | relevante — estreitamento local |
| `attributes.physicalQuantity` | string livre | enum `acceleration \| velocity \| temperature \| rotationalSpeed` | relevante — **extensão local**: `temperature` não é declarado como grandeza no snapshot (ocorre apenas em campos de technical-reports: flags booleanas de gráfico e o comentário textual `temperatureChartComment`); `velocity` só em texto de tag; `rotationalSpeed` tem 0 ocorrências |
| `configuration` | objeto livre | exige `monitoringLocationMap` | relevante |
| `telemetryCycleData` | `additionalProperties: false` | idem, preservado | — |

## 3. Registro de nulabilidade (o contrato público é mais anulável que o interno)

`CONFIRMADO` no snapshot:

| Onde | Campo anulável |
| --- | --- |
| Waveform metrics | `unit: string \| null` ("adimensional metrics have null unit"); `value.x/y/z: number \| null` (obrigatórios e anuláveis) |
| Waveform raw/spectrum | `x`, `y`, `z`: `array \| null`; `time`/`frequency` obrigatórios (conteúdo dos arrays não tipado: `items: {}` — ver 1.8) |
| Monitoring points | `spotCharacteristics.rpm: number ≥ 0 \| null` |
| Alert policies | `currentStatus \| null`, `lastProcessedAt \| null`, `evaluator \| null`, `threshold \| null`, `metricValue \| null`, `status \| null`, `alertA1/alertA2 \| null` |
| Configuration slots | `measuringSystemUniqueIdentifier \| null`, `mapValue \| null` |
| Data points raw | cursor `next \| null` |

O contrato interno de ingestão continua exigindo `value: number` (estreitamento
deliberado). O **contrato analítico** (`NormalizedMetric`) preserva `value: number | null`
e `unit: string | null` para não perder informação de waveform.

**Política local congelada de eixo desabilitado** (`HIPÓTESE_DE_SIMULAÇÃO` — o vínculo
causal não é documentado pelo contrato): eixo habilitado produz dados; desabilitado produz
`null`; nunca array vazio; o registro normalizado existe com `value: null`; o futuro Fuzzy
ignora nulos explicitamente. Texto integral no blueprint (seção 5) e no mapping (seção 5).

## 4. Constantes travadas por enum no público — relevante para o simulador

`CONFIRMADO`: em waveform **raw** e **spectrum**, `physicalQuantity` tem enum
`["acceleration"]` e `unit` tem enum `["g"]`. Ou seja, o canal denso público só existe para
aceleração em g. O simulador não deve emitir waveform de outra grandeza como se fosse
compatível.

## 5. Coerência entre os artefatos locais

| Par comparado | Resultado |
| --- | --- |
| Schema interno ↔ exemplo versionado | **coerente** — `npm run contracts:validate` |
| Schema interno ↔ enum Prisma `PhysicalQuantity` | **coerente** (4 valores ↔ 4 valores) |
| Schema interno ↔ validação em runtime | **fonte única** — sem DTO paralelo; NestJS valida com Ajv contra o próprio arquivo |
| Schema interno ↔ testes | **coberto** — additionalProperties, padrão 24-hex, alias, timestamps canônicos |
| README do SCP-04 ↔ arquivos efetivos | **coerente** |

Nenhum drift acidental entre artefatos locais.

## 6. Ferramenta de extração — fim do truncamento silencioso

A versão anterior do gerador resumia estruturas (ex.: `alertA1` virava
`anyOf: ["object","null"]`, apagando `conditions`/`combinator`/`alertFunctions`) sem
sinalizar. Corrigido: o inventário agora copia o subtree completo com `$ref` resolvido por
JSON Pointer (escapes `~0`/`~1`, ciclo detectado) e qualquer corte vira
`{truncated: true, reason, sourcePointer, ref?}`, listado também em `truncations` na raiz.
As tabelas dos relatórios (endpoints e sampling por modelo) são geradas pelo mesmo
comando e injetadas entre marcadores `GENERATED` — não existem mais tabelas manuais
paralelas para divergir.

## 7. Fonte canônica por assunto

| Assunto | Fonte canônica |
| --- | --- |
| Forma das operações públicas | snapshot `dynamox-public-api.openapi.json`, imutável |
| Payload aceito pela API local | `contracts/dynamox/telemetry-cycle.schema.json` |
| Vocabulário e regras de negócio | `libs/domain` |
| Persistência e cardinalidades | `prisma/schema.prisma` |
| Capacidade de aquisição por perfil | tabela em `settings[].samplingRate` do snapshot (+ derivações no inventário) |
| Decisões e divergências | `contracts/dynamox/README.md` + este documento |

Regra: divergência entre snapshot e artefato local resolve-se **a favor do artefato
local**, com registro aqui. O snapshot nunca é editado.
