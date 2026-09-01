# SCP-05 — Aderência Sensor × API Dynamox e contrato analítico

> **Análise de origem preservada.** Este relatório é o estudo do snapshot público que
> antecedeu a implementação; ele continua correto sobre o snapshot e é a fonte da
> taxonomia de evidência usada nesta base. Duas ressalvas de leitura: o contrato
> analítico `NormalizedMetric` da §5 **não foi construído** — o papel de formato único
> validado ficou com o contrato interno de telemetria — e o simulador descrito como
> "futuro" existe hoje como `simulation/sensor-twin/`. O motor **Fuzzy** citado ao longo
> do texto como evolução também **nunca foi implementado**: não existe inferência,
> forecast ou diagnóstico neste repositório. Estado atual em
> [`telemetry-contract.md`](./telemetry-contract.md) e
> [`../05-simulation/sensor-twin.md`](../05-simulation/sensor-twin.md).

> **Fontes desta análise.** Exclusivamente artefatos **versionados neste repositório**: o
> snapshot `contracts/dynamox/dynamox-public-api.openapi.json` (API 2.4.7, OpenAPI 3.1.0,
> 44 paths, 45 operações, SHA-256
> `cc6e0f07f9a2c16336a30acf09acdf56d97d64a01e0e90fceac9c30c04b225dd`, capturado em
> 26/08/2026), o contrato interno, o exemplo, o schema Prisma, a validação em runtime e os
> testes. **Páginas externas (dynamox.net etc.) não são usadas como evidência**: nada delas
> está preservado no repositório. **Nenhuma chamada foi feita à API produtiva e nenhuma
> credencial foi usada.** Nada aqui promete compatibilidade com um workspace real, que
> dependeria do Resource Model correspondente — dependência confirmada textualmente nas
> respostas de erro de `POST /v1/measuring-systems` (400/403/404 citam
> "Resource Model ... is not instantiable", "permission to use Resource Model",
> "Resource Model ... was not found").

## Classificação de evidência

Toda conclusão técnica deste documento carrega um destes níveis:

| Nível | Significado |
| --- | --- |
| `CONFIRMADO` | Declarado diretamente pelo contrato versionado (com ponteiro para arquivo/campo) |
| `DERIVADO` | Calculado ou inferido a partir de informação confirmada (com a derivação explícita) |
| `HIPÓTESE_DE_SIMULAÇÃO` | Decisão nossa para construir o sensor digital; não vem de fonte |
| `DESCONHECIDO` | Não pode ser concluído com as fontes versionadas disponíveis |

Ponteiros usam JSON Pointer sobre o snapshot (ex.:
`#/paths/~1v1~1telemetry-cycles/post/requestBody`). O inventário
[`dynamox-endpoint-inventory.json`](./dynamox-endpoint-inventory.json) carrega o subtree
completo de cada operação com `$ref` resolvido (`$resolvedFrom`) e **sem truncamento
silencioso** — cortes, se existirem, aparecem como `{truncated: true, reason, sourcePointer}`
e na lista `truncations` da raiz.

## Decisão final

**GO COM RESTRIÇÕES** para o sensor digital determinístico e o futuro contrato analítico.

O caminho da telemetria escalar é rastreável ponta a ponta (CONFIRMADO) e já está
implementado localmente. A capacidade de aquisição por perfil (taxas e tamanhos de janela)
está **confirmada no próprio snapshot** — correção relevante sobre a versão anterior deste
relatório. O que segue desconhecido são domínios de valores (`statisticalProcessing`,
`band`, `evaluator`), banda útil real e qualquer limiar numérico de condição — por isso as
restrições da seção [Condições da decisão](#condições-da-decisão).

## Como reproduzir

```bash
npm run contracts:validate     # integridade do snapshot e do contrato interno
npm run analysis:inventory     # regenera o inventário E as tabelas marcadas como GENERATED neste arquivo
sha256sum contracts/dynamox/dynamox-public-api.openapi.json
```

O gerador é determinístico (sem relógio de parede, ordenação binária): duas execuções
produzem bytes idênticos, inclusive nas tabelas injetadas abaixo.

## 1. Inventário das 18 operações

Todas as 18 operações exigidas pelo cartão existem no snapshot, com método e path exatos
(`{configurationSlotId}`, `{waveformId}` etc. — nomes completos). A tabela abaixo é
**gerada a partir do inventário**; não é mantida à mão.

<!-- BEGIN GENERATED:endpoint-table -->
| Grupo | Operação | Papel local (curadoria) | Confiança (curadoria) |
|---|---|---|---|
| A. Contexto e hierarquia | `GET /v1/assets/:assetId/monitoring-points` | adaptar | ambiguo |
| A. Contexto e hierarquia | `GET /v1/workspaces` | ignorar | confirmado |
| A. Contexto e hierarquia | `GET /v1/workspaces/{workspaceId}/assets` | adaptar | confirmado |
| B. Provisionamento do sensor | `POST /v1/configuration-slots` | investigar | ambiguo |
| B. Provisionamento do sensor | `PATCH /v1/configuration-slots/{configurationSlotId}:associate` | adaptar | confirmado |
| B. Provisionamento do sensor | `POST /v1/measuring-systems` | adaptar | confirmado |
| C. Ingestão | `POST /v1/telemetry-cycles` | usar | confirmado |
| D. Telemetria escalar | `GET /v1/telemetry/data-points/aggregation` | adaptar | confirmado |
| D. Telemetria escalar | `GET /v1/telemetry/metric-descriptor` | usar | ambiguo |
| D. Telemetria escalar | `GET /v1beta/telemetry/data-points/raw` | adaptar | ambiguo |
| E. Waveform e análise vibracional | `GET /v1/waveform/{waveformId}/metrics` | usar | confirmado |
| E. Waveform e análise vibracional | `GET /v1/waveform/{waveformId}/raw` | ignorar | confirmado |
| E. Waveform e análise vibracional | `GET /v1/waveform/{waveformId}/spectrum` | ignorar | confirmado |
| E. Waveform e análise vibracional | `GET /v1/waveforms/` | investigar | ambiguo |
| F. Diagnóstico e alertas | `GET /v1/alert-policies/status` | adaptar | confirmado |
| F. Diagnóstico e alertas | `GET /v1/alert-policies/{policyId}` | adaptar | confirmado |
| F. Diagnóstico e alertas | `GET /v1/alert-policies/{policyId}/history` | investigar | confirmado |
| F. Diagnóstico e alertas | `GET /v1/automatic-diagnostics/{waveformId}` | adaptar | confirmado |
<!-- END GENERATED:endpoint-table -->

### Observações confirmadas que mudam decisões

- **Autenticação não é obtenível do snapshot** — `CONFIRMADO`. 32 operações declaram
  `HTTPBearer`, 11 declaram `bearerAuth`, 2 não declaram bloco `security`, e
  `components.securitySchemes` é `{}`. Os dois nomes são **referências pendentes** (não há
  definição de esquema algum), o que é mais grave que nomenclatura divergente. Sem impacto
  local: não chamamos a API. Censo completo em `security` no inventário.
- **Paginação não é uniforme** — `CONFIRMADO`. `monitoring-points` usa `page`/`limit` e
  devolve `pages`/`items`; `data-points/raw` usa `limit`/`pageToken` e devolve cursor
  `next` anulável; `aggregation` não pagina e exige `metricDescriptorId`/`fromTime`/`toTime`;
  `waveforms` usa `page`/`limit`/`sort`/`direction` e exige `monitoringPointIds`,
  `fromTime`, `toTime`.
- **`GET /v1/waveforms/` diverge de si mesmo** — `CONFIRMADO`. O `summary` promete lista e
  os query params são de listagem paginada, mas o schema `200` é um **objeto único**
  (`_id`, `settings[]`, `spotId`, …). Registrado no drift; operação não consumida.
- **Lado de leitura ≠ lado de escrita** — `CONFIRMADO`. A escrita
  (`POST /v1/telemetry-cycles`) usa `timestamp` e `value: number | boolean`; a leitura
  (`GET /v1beta/telemetry/data-points/raw`) usa **`datetime`** e
  `value: boolean | integer | number`. O normalizador aceita os dois nomes; valores
  booleanos **não entram** no canal numérico — produzem `unsupported` (política congelada
  na seção 5).

## 2. Perfis de sensor — o que o snapshot realmente diz

**Correção central desta revisão:** a versão anterior classificou capacidades por perfil
como não confirmadas citando páginas externas. Errado duas vezes — as páginas não estão
versionadas (não servem de evidência) **e** o snapshot contém, literalmente, a tabela de
validação cruzada `modelo × sampling rate × samples` nas descriptions de
`settings[].samplingRate` e `settings[].samples` de `GET /v1/waveforms/`
(`#/paths/~1v1~1waveforms~1/get/responses/200/content/application~1json/schema/properties/settings/items/properties/samplingRate/description`).

Tabela **gerada** a partir dessa description (coluna Nyquist calculada pelo gerador):

<!-- BEGIN GENERATED:profile-sampling-table -->
| Modelo (snapshot) | Sampling rates (Hz) — CONFIRMADO | Samples — CONFIRMADO | Nyquist máx. fs/2 (Hz) — DERIVADO |
|---|---|---|---|
| TcA | 2048 | 8192 | 1024 |
| TcA+ | 2048 | 1024, 2048, 4096, 8192, 16384, 32768 | 1024 |
| AS | 2048 | 1024, 2048, 4096, 8192, 16384, 32768 | 1024 |
| HF | 200, 400, 800, 1600, 3200, 6400, 12800 | 1024, 2048, 4096, 8192, 16384, 32768 | 6400 |
| RE | 200, 400, 800, 1600, 3200, 6400, 12800 | 1024, 2048, 4096, 8192, 16384, 32768 | 6400 |
| HF+ | 1143, 2629, 5258, 13145, 26290, 52580, 131450 | 2048, 4096, 8192, 16384, 32768, 65536, 98304, 196608 | 65725 |
| TcAs | 2520, 5040 | 2048, 4096, 8192, 16384, 32768, 60800, 65536, 98304, 182400 | 2520 |
| TcAg | 2520, 5040 | 2048, 4096, 8192, 16384, 32768, 60800, 65536, 98304, 182400 | 2520 |
| DynaPortable | 1143, 2629, 5258, 13145, 26290 | 2048, 4096, 8192, 16384, 32768, 65536, 98304, 196608 | 13145 |
<!-- END GENERATED:profile-sampling-table -->

Leitura com níveis de evidência:

- Taxas nominais e opções de amostras por modelo — `CONFIRMADO` (ponteiro acima). Para os
  perfis do desafio: **TcAg e TcAs: 2520 e 5040 Hz**; **HF+: 1143, 2629, 5258, 13145,
  26290, 52580 e 131450 Hz**.
- Frequência máxima analisável ≈ fs/2 (Nyquist) — `DERIVADO`: TcAg/TcAs até **2520 Hz**
  (≈ "2,5 kHz"); HF+ até **65 725 Hz** na taxa máxima. O valor "13 kHz" citado no cartão
  coincide com a taxa literal 13 145 Hz e com o Nyquist da taxa 26 290 Hz — coerente,
  porém a **banda útil real** (filtro anti-aliasing) é `DESCONHECIDO`.
- Duração da janela = samples / fs — `DERIVADO` (ex.: HF+ a 131 450 Hz com 196 608
  amostras ≈ 1,496 s; TcAg/TcAs a 5040 Hz com 182 400 amostras ≈ 36,2 s).
- O snapshot também lista os modelos TcA, TcA+, AS, HF, RE e DynaPortable — `CONFIRMADO`;
  fora do escopo do desafio.
- **`HF+s` não ocorre nenhuma vez no snapshot** — sua existência/diferença é
  `DESCONHECIDO` com as fontes versionadas.
- **Conflito registrado:** a tabela do snapshot lista `TcAg` com taxas de *waveform*
  (2520/5040 Hz), enquanto o cartão descreve TcAg como perfil **sem** análise espectral. Com
  as fontes versionadas, "TcAg não faz waveform" é `DESCONHECIDO`; a escolha do simulador
  (TcAg não gera waveform) fica como `HIPÓTESE_DE_SIMULAÇÃO` conservadora, registrada no
  blueprint.
- **Temperatura não aparece como grandeza no snapshot** — `CONFIRMADO` que
  `physicalQuantity` é string livre (`#/paths/~1v1~1telemetry-cycles/post/...attributes`)
  e que `temperature` **não é declarado como `physicalQuantity`** em lugar algum; suas
  ocorrências estão restritas a campos de technical-reports (flags booleanas de gráfico e
  o comentário textual `temperatureChartComment`). Logo "perfis medem temperatura" é
  `HIPÓTESE_DE_SIMULAÇÃO` (aceita pela API por ser string livre), não fato confirmado.
- Envelope de 35 mm, IP68/IP69K, −10…105 °C, fixação e autonomia: **removidos da base
  factual** — `DESCONHECIDO` (apenas fontes externas não versionadas). O blueprint os usa
  somente como `HIPÓTESE_DE_SIMULAÇÃO` de faixas plausíveis.
- Orientação de eixos por sensor — `CONFIRMADO`: `sensors[].axesOrientation.{x,y,z}` com
  enum `axial | radial | tangential | horizontal | vertical`
  (`GET /v1/assets/:assetId/monitoring-points`). E `spotCharacteristics` traz
  `rpm: number ≥ 0 | null` e `monitoringPositionSlug` com enum que inclui
  **`bearinghousing`** — exatamente o mancal da P-101.

## 3. Matriz Sensor × Endpoint × Campo × Contrato normalizado

Como cada campo do `NormalizedMetric` (seção 5) é abastecido, por origem:

| Campo normalizado | Origem: telemetria | Origem: waveform metrics | Origem: waveform raw/spectrum | Origem: diagnóstico/alerta | Evidência do mapeamento |
| --- | --- | --- | --- | --- | --- |
| `timestamp` | `dataPoints[].timestamp` (escrita) / `datetime` (leitura) | `startedAt` da aquisição (`/v1/waveforms/` · `metadata.startedAt` do raw) | idem | `lastProcessedAt` | CONFIRMADO |
| `machineId` | — (conceito local; público seria Asset) | — | — | — | HIPÓTESE_DE_SIMULAÇÃO |
| `monitoringPointId` | `resourceId` (24 hex) | via `spotId`/monitoring point da aquisição | idem | `alertFunctions[].resourceId` | CONFIRMADO (forma) / decisão local (semântica) |
| `sensorId` | `measuringSystemUniqueIdentifier` | — (não presente na resposta) | — | — | CONFIRMADO na ingestão; DESCONHECIDO na leitura |
| `sensorProfile` | `measuringSystemModel.name` | modelo da tabela de sampling | idem | — | CONFIRMADO (campo) / HIPÓTESE (vínculo perfil→capacidade) |
| `metric` | `telemetry/{metricDescriptorId}` | `{physicalQuantity}/{statisticalProcessing}/{band}` | não vira métrica (denso) | `diagnostic/{fault}` | DERIVADO (convenção nossa sobre campos confirmados) |
| `value` | `value: number \| boolean` (escrita) · `boolean \| integer \| number` (leitura) | `value.{x,y,z}: number \| null` | amostras densas — fora do normalizado | `metricValue: number \| null` | CONFIRMADO |
| `unit` | `unit` (exigido só no contrato interno) | `unit: string \| null` ("adimensionais têm unit null") | enum `g` | — | CONFIRMADO |
| `axis` | `attributes.axis` — **apenas em examples**, não no schema | **inexistente**: explode-se `value.{x,y,z}` | chaves `x/y/z` | — | CONFIRMADO (waveform) / example-only (telemetria) |
| `statisticalProcessing`, `band` | — | `attributes.*` obrigatórios, strings livres | — | — | CONFIRMADO (existência) / DESCONHECIDO (domínio) |
| `samplingRateHz` | — | `settings[].samplingRate` + `metadata.samplingRate` | idem | — | CONFIRMADO |
| `suggestedSeverity` (saída) | — | — | — | `currentStatus: no-alert \| a1 \| a2 \| null` | CONFIRMADO |
| `faultStatus` (saída) | — | — | — | `status: detected \| notDetected \| notEvaluated` | CONFIRMADO |

## 4. Mapeamento de domínio local × API

| Domínio local | API pública | Decisão | Evidência |
| --- | --- | --- | --- |
| `Machine` | Asset | CRUD permanece local; Asset confirma hierarquia | CONFIRMADO (hierarquia) |
| `MonitoringPoint` | Monitoring Point/Spot | Local guarda nome + `externalResourceId`; `rpm`/slug/mechanicalSettings existem no público e não foram trazidos | CONFIRMADO |
| `Sensor` | Measuring System | `serialNumber` como identidade; modelo/versão de `measuringSystemModel` | CONFIRMADO |
| Associação sensor–ponto | Configuration Slot + `:associate` | Público separa configuração de associação; local simplifica com 1:1 | CONFIRMADO |
| `IngestionCycle` | Telemetry Cycle | Lote escalar idempotente | CONFIRMADO |
| `TimeSeries` | Metric Descriptor | Identidade semântica (grandeza+eixo+unidade) antes dos valores | CONFIRMADO (forma) — ver ressalva do axis |
| `TimeSeriesSample` | Data Point | `timestamp`/`datetime` + `value` | CONFIRMADO |
| *(inexistente)* | Waveform (raw/spectrum) | Denso; não forçar na série escalar | CONFIRMADO |
| *(inexistente)* | Waveform Metrics | Features espectrais triaxiais | CONFIRMADO |
| *(inexistente)* | Alert Policies / Diagnostics | Severidade e hipótese de falha, conceitos separados | CONFIRMADO |

`TimeSeries` local representa **apenas** telemetria escalar — correto. Separação
conceitual futura (sem migrar banco): `WaveformAcquisition` (janela densa + settings) e
`DerivedFeature` (feature com processamento/banda) como modelos distintos.

## 5. Contrato analítico — `NormalizedMetric` revisado

Interface de partida (proposta na tarefa) e ajustes justificados contra o snapshot:

```ts
type EvidenceLevel = 'confirmed' | 'derived' | 'simulation-assumption' | 'unknown';

interface NormalizedMetric {
  timestamp: string;                    // ISO 8601 UTC ms (contrato interno)
  machineId: string;                    // local
  monitoringPointId: string;            // local; espelha resourceId 24-hex
  sensorId: string;                     // local; espelha measuringSystemUniqueIdentifier
  sensorProfile: 'TcAg' | 'TcAs' | 'HF+';
  metric: string;                       // convenção da seção 3
  value: number | null;                 // null PRESERVADO (waveform metrics anuláveis)
  unit: string | null;                  // null PRESERVADO (adimensionais)
  axis: 'x' | 'y' | 'z' | null;         // null para escalares
  source: 'telemetry' | 'waveform' | 'spectrum' | 'diagnostic';
  evidenceLevel: EvidenceLevel;

  // Ajustes propostos (opcionais, com justificativa abaixo)
  statisticalProcessing?: string | null;
  band?: string | null;
  samplingRateHz?: number | null;
  window?: { from: string; to: string } | null;
  sourceRef?: { waveformId?: string; metricDescriptorId?: string; policyId?: string } | null;
  status?: 'detected' | 'notDetected' | 'notEvaluated' | null; // só para source='diagnostic'
}
```

Por que os ajustes:

1. **`statisticalProcessing` e `band`** — sem eles, duas métricas espectrais com a mesma
   grandeza e o mesmo eixo colidem (ex.: RMS 10–1000 Hz vs pico 2–13 kHz). São exigidos
   pelo schema público de waveform metrics (`CONFIRMADO`), então o normalizado não pode
   descartá-los.
2. **`samplingRateHz`** — preserva o contexto de aquisição confirmado em
   `settings[].samplingRate`/`metadata.samplingRate`; sem ele, uma feature de HF+ a
   131 450 Hz fica indistinguível de uma a 1143 Hz.
3. **`window`** — a agregação pública devolve buckets `datetime + max/avg/min/count`
   (`CONFIRMADO`); métricas de janela precisam do intervalo, não de um instante.
4. **`sourceRef`** — rastreabilidade exigida pela tarefa ("vínculo com o sensor original").
5. **`status`** — o diagnóstico público não tem valor numérico
   (`fault + status detected|notDetected|notEvaluated`, `CONFIRMADO`); representá-lo com
   `value: null` + `status` evita inventar números.
6. **`evidenceLevel` em dados simulados** é sempre `'simulation-assumption'` para o valor;
   os níveis `confirmed/derived` descrevem a *semântica do campo* quando a origem for um
   export real futuro.

### Telemetria booleana — fronteira congelada do canal analítico

O contrato público aceita `value: number | boolean` na escrita e
`boolean | integer | number` na leitura (`CONFIRMADO`). O `NormalizedMetric` é
**exclusivamente numérico** (`number | null`), e a fronteira é explícita — decisão local
para o futuro Fuzzy (`HIPÓTESE_DE_SIMULAÇÃO`), **não** regra oficial da Dynamox:

```ts
type NormalizationResult =
  | { kind: 'normalized'; metrics: NormalizedMetric[] }
  | {
      kind: 'unsupported';
      reason: 'boolean-telemetry';
      rawValue: boolean;
      sourceRef: { metricDescriptorId?: string };
    };
```

Regras congeladas:

- valores booleanos **nunca** são convertidos silenciosamente para `0`/`1`;
- telemetria booleana produz o resultado explícito `unsupported`, preservando `rawValue`
  e a origem (`sourceRef.metricDescriptorId`) — nada se perde, nada entra disfarçado;
- o canal numérico segue sendo o único que alimenta o Fuzzy.

### Normalização de waveform `{x, y, z}` sem perdas

Uma waveform metric pública tem `value.{x,y,z}` cada um `number | null`, `unit`
`string | null`, e **nenhum atributo `axis`** (`CONFIRMADO`). Regra:

1. Explodir **sempre em três** registros `NormalizedMetric`, um por eixo (`axis: 'x'|'y'|'z'`).
2. **Política de eixo congelada** (`HIPÓTESE_DE_SIMULAÇÃO` — o snapshot confirma os
   booleanos `settings[].axis.{x,y,z}` e a nulabilidade de `value.{x,y,z}` separadamente,
   sem documentar o vínculo causal): eixo **habilitado** produz dados; eixo
   **desabilitado** produz `null`; **nunca** array vazio; o registro normalizado do eixo
   desabilitado **existe** com `value: null` (descartar é proibido); e o futuro Fuzzy
   **ignora métricas nulas explicitamente**, como regra declarada.
3. `unit` copia o valor público, incluindo `null` para adimensionais (ex.: crest factor).
4. `samplingRateHz` vem de `settings[].samplingRate`/`metadata.samplingRate`.
5. `timestamp` vem de `startedAt` da aquisição; `window` opcional com
   `from = startedAt`, `to = startedAt + samples/fs` (`DERIVADO`).
6. `sourceRef.waveformId` liga ao `_id` da aquisição; `sensorId`, `monitoringPointId` e
   `sensorProfile` vêm do registro local da aquisição via **`WaveformAcquisitionContext`**
   (contrato no blueprint, seção 4.4), combinado pelo `waveformId`. **Sem esse contexto, a
   normalização falha explicitamente** — identificadores ausentes nunca são inventados
   (a resposta pública de metrics não traz o sensor — `DESCONHECIDO` no público).
7. Sinal denso (raw/spectrum) **não** vira `NormalizedMetric` — só features derivadas dele.
8. O **conteúdo** dos arrays densos não é tipado pelo schema (`items: {}` em `x/y/z`,
   `time` e `frequency` — `CONFIRMADO`); tratá-los como `number[]` é
   `HIPÓTESE_DE_SIMULAÇÃO` apoiada pelos `examples` do snapshot, não obrigação estrutural.

## 6. Semântica de alertas (corrigida)

Estrutura confirmada em `GET /v1/alert-policies/{policyId}`:

```
policyType: telemetry | spectralMetrics
alertA1 / alertA2 (anuláveis) → conditions[]
conditions[i] = { combinator: 'and' | 'or', alertFunctions[] }
alertFunctions[] = { resourceId, metricName,
                     configuration { evaluator: string|null, threshold: number>0|null, consecutive: int≥1 (default 1) },
                     metricValue: number|null, status: boolean|null }
```

- **`combinator` combina as `alertFunctions` DENTRO de uma condição** — cada elemento de
  `conditions[]` carrega o seu próprio combinador. Como o array `conditions` se compõe
  entre elementos **não é documentado** (`DESCONHECIDO`).
- **`consecutive` é persistência/debounce** — "N avaliações consecutivas satisfeitas antes
  de disparar". Não é histerese: não há limiares distintos de entrada e saída documentados.
- `evaluator` é string livre anulável — o conjunto de operadores é `DESCONHECIDO`.
- Severidade (`no-alert | a1 | a2`, anulável) e hipótese de falha
  (`detected | notDetected | notEvaluated`) são **conceitos separados**, vindos de
  endpoints distintos.

## 7. Perguntas em aberto e riscos

| # | Questão | Nível | Impacto |
| --- | --- | --- | --- |
| Q1 | Domínio de `evaluator` | DESCONHECIDO | Impede replicar a semântica exata de disparo |
| Q2 | Domínios de `statisticalProcessing` e `band` | DESCONHECIDO | O simulador define conjunto próprio rotulado |
| Q3 | Composição entre elementos de `conditions[]` | DESCONHECIDO | Fuzzy local não pode alegar equivalência |
| Q4 | Forma real de `GET /v1/waveforms/` (lista × objeto) | DESCONHECIDO | Operação não consumida |
| Q5 | Autenticação real (`securitySchemes` vazio) | DESCONHECIDO | Sem impacto: não chamamos a API |
| Q6 | Limiares numéricos de condição (qualquer ativo) | DESCONHECIDO | **Nenhuma regra Fuzzy pode ser calibrada com fonte**; limiares locais serão declarados arbitrários |
| Q7 | Banda útil real vs Nyquist por perfil | DESCONHECIDO | Faixas anunciadas comercialmente não são verificáveis aqui |
| Q8 | Existência/spec de `HF+s` | DESCONHECIDO | Fora do simulador |
| Q9 | TcAg produz waveform? (tabela do snapshot × descrição do cartão) | conflito → DESCONHECIDO | Simulador adota HIPÓTESE conservadora (não produz) |
| Q10 | Semântica exata de `resourceId` no ciclo (ponto × métrica) | ambíguo | Decisão local mantida: é o ponto, validado contra o sensor |

## Condições da decisão

**GO COM RESTRIÇÕES**, condicionado a:

1. MVP restrito ao subconjunto rastreável: telemetria escalar + features derivadas do
   sinal sintético, todas com `evidenceLevel` explícito.
2. Features espectrais só entram após a explosão triaxial com preservação de nulos (seção 5).
3. Nenhum limiar numérico apresentado como oficial; enquanto Q6 aberta, limiares locais
   são `HIPÓTESE_DE_SIMULAÇÃO` declarada.
4. Severidade e hipótese de falha permanecem campos separados.
5. Nenhum score sai do ambiente local como telemetria.
6. Fuzzy como adaptador opcional, isolado, depois do P0.
7. Rótulos obrigatórios em todo artefato: *experimental*, *sintético/didático*,
   *não substitui o DynaDetect*.

### Próximos passos mínimos

1. Implementar `NormalizedMetric` em `libs/contracts` (tipo + explosão triaxial + testes de nulabilidade).
2. Definir o conjunto de features do MVP com proveniência (blueprint, seção "streams").
3. Registrar limiares locais como arbitrários e didáticos até haver fonte.
4. Manter o motor fora do caminho crítico da API.

## Limites desta análise

- Nenhum comportamento em runtime da API foi observado; tudo vem do documento.
- Campos `type: string` sem enum são tratados como domínio `DESCONHECIDO` mesmo quando o
  nome sugere conjunto fechado.
- A tabela de sampling é uma description em Markdown dentro do snapshot — confirmada como
  texto do contrato, com parsing determinístico auditável no gerador.
- Nada garante aceitação por workspace produtivo (Resource Model não público).
