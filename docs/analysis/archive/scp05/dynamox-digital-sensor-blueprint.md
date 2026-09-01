# Blueprint — Sensor digital determinístico (TcAg · TcAs · HF+)

> **HISTÓRICO — este documento descreve uma etapa anterior do projeto e não
> representa a arquitetura atual.** O simulador real é `simulation/sensor-twin/`; `NormalizedMetric`,
> `libs/sensor-sim` e o motor Fuzzy descritos aqui **nunca foram construídos**.
> Para o sistema como ele é hoje, comece por
> [`../../00-overview/architecture-map.md`](../../00-overview/architecture-map.md).

> **⚠️ SUPERADO (29/08/2026).** Este blueprint é o plano da era SCP-05 e foi substituído
> pela implementação real do BON-06 v3.1: o simulador vivo é `simulation/sensor-twin/`
> (engine determinística, frota de 12 sensores, supervisor deliberativo e proveniência
> ROS opcional). `NormalizedMetric`/`libs/sensor-sim` e o motor Fuzzy **não foram
> construídos**. Estado atual: [matriz de evidências](../../07-validation/traceability.md) e
> [README do sensor twin](../../../../simulation/sensor-twin/README.md). O texto abaixo
> permanece como registro histórico da análise.

> **Status:** blueprint. Nada daqui está implementado. Este documento congela o contrato do
> futuro simulador para que ele seja construído sobre fatos rastreáveis, e não sobre campos
> inventados.
>
> **Posicionamento obrigatório:** gêmeo digital **experimental**, com dados
> **sintéticos/didáticos**, sem afiliação oficial, sem reprodução de firmware, BLE ou
> protocolo proprietário, sem compatibilidade com workspace produtivo e **sem substituir o
> DynaDetect**.

Níveis de evidência: `CONFIRMADO` · `DERIVADO` · `HIPÓTESE_DE_SIMULAÇÃO` · `DESCONHECIDO`
(definidos em [`dynamox-sensor-api-mapping.md`](../../04-contracts/dynamox-sensor-api-mapping.md)).

## 1. Objetivo e não objetivos

**Objetivo:** um gerador determinístico que reproduza o **formato** e o **comportamento
observável** do domínio Dynamox — perfis, associação máquina→ponto→sensor, ciclos de
telemetria, waveforms triaxiais, métricas espectrais, timestamps, unidades e nulos — para
alimentar a aplicação local e, depois, um motor Fuzzy.

**Não objetivos:** chamar a API produtiva; emular rádio/firmware; fidelidade física
certificável; compatibilidade com Resource Model real (as respostas 400/403/404 de
`POST /v1/measuring-systems` confirmam essa dependência — `CONFIRMADO`).

## 2. Arquitetura proposta

```
libs/sensor-sim (TypeScript puro, sem I/O)          ← núcleo determinístico
  ├─ profiles.ts       capacidades por perfil (deste blueprint)
  ├─ scenarios.ts      normal | degraded | anomalous | incomplete
  ├─ signal.ts         séries e janelas sintéticas (seed → bytes idênticos)
  ├─ cycles.ts         montagem de TelemetryCyclePayload (contrato SCP-04)
  ├─ waveform.ts       aquisições {x,y,z}, settings confirmados
  └─ normalize.ts      NormalizedMetric (explosão triaxial, nulos preservados)

apps/... (adaptadores, fase futura)
  ├─ CLI: gera ciclos e POSTa em /api/telemetry-cycles (Idempotency-Key; guarda anti-produção)
  └─ BON-06: nó ROS reutiliza o mesmo núcleo via JSON (fora deste blueprint)
```

O núcleo não conhece HTTP nem banco: recebe `(config, seed, janela)` e devolve estruturas.
Isso mantém o P0 intocado e o Fuzzy como consumidor opcional.

## 3. Perfis

Tabela de capacidade de aquisição — **gerada do snapshot** pelo mesmo comando do
inventário (`npm run analysis:inventory`):

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

### O que cada perfil produz no simulador

| Capacidade | TcAg | TcAs | HF+ | Evidência |
| --- | --- | --- | --- | --- |
| Telemetria escalar (ciclos) | ✔ | ✔ | ✔ | API aceita qualquer `physicalQuantity` (string livre) — CONFIRMADO; vínculo perfil→métrica — HIPÓTESE_DE_SIMULAÇÃO |
| Temperatura | ✔ | ✔ | ✔ | HIPÓTESE_DE_SIMULAÇÃO — `temperature` **não** existe como grandeza no snapshot |
| Waveform triaxial + espectro | ✖ | ✔ | ✔ | Conflito: a tabela do snapshot lista TcAg com taxas de waveform (CONFIRMADO), mas o cartão o descreve sem análise espectral; adotamos a hipótese conservadora (TcAg não gera) — HIPÓTESE_DE_SIMULAÇÃO, registrada como Q9 |
| Métricas espectrais | ✖ | ✔ | ✔ | idem |
| Taxas/samples válidos | — | 2520·5040 Hz / 2048…182400 | 1143…131450 Hz / 2048…196608 | CONFIRMADO (tabela acima) |
| Banda útil real | — | DESCONHECIDO | DESCONHECIDO | Nyquist é teto DERIVADO; filtro anti-aliasing não documentado |

Identidade do sensor simulado (compatível com o contrato de ingestão — CONFIRMADO):
`measuringSystemUniqueIdentifier` = serial local (ex.: `SIM-HF-001`);
`measuringSystemModel = { name: 'TcAg' | 'TcAs' | 'HF+', version: 1 }`.
`HF+s` fica fora (0 ocorrências no snapshot — DESCONHECIDO).

### Presets do MVP (congelados)

Para evitar geração acidental de waveforms gigantes, o MVP usa **presets leves**. Os
presets em si são `HIPÓTESE_DE_SIMULAÇÃO`; as taxas e opções permitidas continuam
`CONFIRMADO` (tabela acima); Nyquist e duração continuam `DERIVADO`.

| Perfil | Preset do MVP | Nyquist (DERIVADO) | Duração da janela (DERIVADO) | Waveform/espectrais |
| --- | --- | --- | --- | --- |
| TcAg | somente telemetria escalar | — | — | ✖ (decisão conservadora, Q9) |
| TcAs | `samplingRateHz: 5040` · `samples: 4096` | 2520 Hz | 4096/5040 ≈ 0,813 s | ✔ |
| HF+ | `samplingRateHz: 26290` · `samples: 8192` | 13 145 Hz | 8192/26290 ≈ 0,312 s | ✔ — perfil da bomba P-101 |

As demais combinações confirmadas pelo snapshot continuam documentadas e válidas, mas
**não são padrão**: configurações máximas como `131450 Hz × 196608 samples` só podem ser
usadas mediante configuração explícita, nunca como default.

### Contexto mecânico do ponto (para cenários realistas)

`CONFIRMADO` em `GET /v1/assets/:assetId/monitoring-points`:
`spotCharacteristics.rpm: number ≥ 0 | null`, `monitoringPositionSlug` com enum que inclui
`bearinghousing` (o mancal da P-101), e `sensors[].axesOrientation.{x,y,z}` em
`axial | radial | tangential | horizontal | vertical`. O simulador adota por padrão
(HIPÓTESE_DE_SIMULAÇÃO): P-101 `Pump`, ponto `bearinghousing`, rpm 1750,
orientação `x: axial, y: tangential, z: radial`. A regra do desafio permanece:
`Pump → apenas HF+`.

## 4. Streams produzidos

### 4.1 Ciclos de telemetria (todos os perfis)

Formato: o contrato interno do SCP-04 (validado por Ajv; `additionalProperties: false`
preservado — CONFIRMADO). Métricas do MVP (HIPÓTESE_DE_SIMULAÇÃO, rotuladas):

| `metric` | grandeza | eixo | unidade |
| --- | --- | --- | --- |
| aceleração RMS por eixo | `acceleration` | x·y·z | `g` |
| temperatura do ponto | `temperature` | — (`Axis.NONE`) | `degC` |

Cadência padrão: 1 amostra/min por métrica, configurável (`DESCONHECIDO` no público — não
há cadência declarada; escolha local explícita). Timestamps: UTC canônico com ms
(`YYYY-MM-DDTHH:mm:ss.SSSZ`), regra já testada no backend. O normalizador aceita
`timestamp` (escrita) e `datetime` (leitura) como sinônimos — CONFIRMADO no snapshot.

### 4.2 Waveforms (TcAs e HF+)

Estrutura-alvo espelha o canal público (`CONFIRMADO`):

- aquisição: `settings { samplingRate, samples, duration, axis {x,y,z}: boolean, autoRange }`,
  com `samplingRate`/`samples` **somente** dos conjuntos confirmados por perfil;
  `duration = samples / samplingRate` (DERIVADO);
- sinal: `{ x|y|z, time, physicalQuantity: 'acceleration', unit: 'g' }` — os enums de
  grandeza/unidade e a forma `array | null` são CONFIRMADO, mas o **conteúdo** dos arrays
  não é tipado (`items: {}`): usar `number[]` é HIPÓTESE_DE_SIMULAÇÃO apoiada pelos
  `examples`; eixo desabilitado ⇒ `null`, não array vazio (regra local, ver seção 5);
- espectro: `{ x|y|z: array | null, frequency: array }` com conteúdo numérico pela mesma
  hipótese, coerente com `df = fs / N` (DERIVADO).

Conteúdo do sinal (HIPÓTESE_DE_SIMULAÇÃO, herdado do plano BON-06): componentes 1×/2× RPM,
ruído band-limited, progressão de defeito por cenário.

### 4.3 Métricas espectrais (TcAs e HF+)

Formato público (`CONFIRMADO`): `attributes { physicalQuantity, statisticalProcessing, band }`,
`unit: string | null`, `value { x, y, z }` cada um `number | null`, **sem** atributo `axis`.

Como os domínios de `statisticalProcessing`/`band` são `DESCONHECIDO` (Q2), o simulador usa
um conjunto próprio, rotulado:

| statisticalProcessing | band | unit | nota |
| --- | --- | --- | --- |
| `rms` | `10-1000Hz` | `g` | HIPÓTESE_DE_SIMULAÇÃO |
| `peak` | `10-1000Hz` | `g` | idem |
| `crestFactor` | `10-1000Hz` | `null` | adimensional ⇒ `unit: null` (regra pública CONFIRMADO) |
| `rms` | `1000-{nyquist}Hz` | `g` | banda alta limitada ao Nyquist do perfil (DERIVADO) |

### 4.4 Contexto de aquisição — join obrigatório da normalização

A resposta pública de métricas espectrais **não traz sozinha** tudo o que o
`NormalizedMetric` exige (sensor, ponto, perfil, taxa, instante). O elo é o registro local
da aquisição, combinado pelo `waveformId`:

```ts
interface WaveformAcquisitionContext {
  waveformId: string;          // _id da aquisição (CONFIRMADO no formato público)
  startedAt: string;           // preenche timestamp e a janela from/to (from = startedAt,
                               // to = startedAt + samples/samplingRateHz — DERIVADO)
  samplingRateHz: number;      // preserva o contexto de aquisição (CONFIRMADO em settings/metadata)
  samples: number;
  monitoringPointId: string;   // do registro LOCAL da aquisição
  sensorId: string;            // idem
  sensorProfile: 'TcAg' | 'TcAs' | 'HF+';
}
```

Regras congeladas:

- métricas espectrais só são normalizadas **combinadas** a um contexto pelo `waveformId`;
- **sem contexto, a normalização falha explicitamente** (erro, nunca registro parcial);
- identificadores ausentes **nunca são inventados** — se o vínculo sensor↔aquisição não
  existe localmente, o dado fica fora do canal analítico até existir.

### 4.5 Diagnóstico e severidade (somente local)

Saída `ConditionAssessment` local com vocabulário público (`CONFIRMADO`):
`suggestedSeverity: no-alert | a1 | a2` e `faultStatus: detected | notDetected | notEvaluated`,
conceitos separados. Persistência de disparo imita `consecutive` (debounce ≥ 1 — não é
histerese). Nunca publicado como telemetria.

## 5. Nulabilidade — regras do simulador

A **nulabilidade em si** é herdada do público (`CONFIRMADO` no drift, seção 3: `x/y/z`
anuláveis no sinal, `value.{x,y,z}` e `unit` anuláveis nas métricas, `rpm` anulável). Os
**vínculos causais** abaixo são regras locais:

1. **Regra determinística de eixo (congelada)** — `HIPÓTESE_DE_SIMULAÇÃO`: o snapshot
   confirma os booleanos `settings[].axis.{x,y,z}` e a nulabilidade separadamente, sem
   documentar que um causa o outro; o vínculo abaixo é decisão nossa:
   - eixo **habilitado** produz dados;
   - eixo **desabilitado** produz `null` (no sinal e em `value.{eixo}` das métricas);
   - **nunca** usar array vazio para representar eixo desabilitado;
   - na normalização, o registro do eixo desabilitado **existe** com `value: null` —
     descartar é proibido;
   - o futuro Fuzzy deve **ignorar métricas nulas explicitamente** (regra declarada, não
     filtro silencioso).
2. Métrica adimensional ⇒ `unit: null`.
3. `rpm` do ponto pode ser `null` (cenário "contexto incompleto").
4. Ingestão local permanece `value: number` (estreitamento deliberado): o canal ciclo →
   PostgreSQL não transporta nulos; nulos vivem no canal analítico (`NormalizedMetric`).

## 6. Cenários

| Cenário | O que muda | Campos afetados |
| --- | --- | --- |
| `normal` | linha de base estável, ruído pequeno | valores |
| `degraded` | tendência crescente 1×RPM + temperatura subindo | valores, progressão entre janelas |
| `anomalous` | picos esparsos, crest factor alto, possível `a2` local | valores, features, severidade local |
| `incomplete` | eixo desligado (`null`), `unit: null` adimensional, `rpm: null`, janelas faltando, ciclo parcial | estrutura e nulos |

Todos os cenários produzem payloads **válidos** contra o contrato interno — "incompleto"
significa nulos e lacunas permitidos, nunca contrato quebrado.

**Mapeamento para o enum do contrato** (`configuration.scenario ∈ {normal, imbalance}` no
SCP-04) — regra local, `HIPÓTESE_DE_SIMULAÇÃO`: `normal → normal`; `degraded → imbalance`
(desbalanceamento progressivo é o mecanismo do cenário); `anomalous → imbalance`;
`incomplete` usa o cenário-base ativo. O nome do cenário do simulador viaja sempre em
`tags` (`scenario:<nome>`), preservando a rastreabilidade sem alargar o enum congelado.

## 7. Determinismo e seed

- RNG derivado por SHA-256 de `(serialNumber | profile | scenario | seed | windowIndex)` —
  mesma técnica já usada em `libs/contracts` para ids determinísticos.
- Proibido `Date.now()`/`Math.random()`: o tempo entra por parâmetro `t0` + índice da janela.
- Garantia: mesma tupla ⇒ **bytes idênticos** de saída (testável por hash, como o
  inventário).
- Idempotência de ingestão já garantida pelo backend (fingerprint + `Idempotency-Key`):
  reprocessar a mesma janela não duplica nada.

## 8. Entradas futuras do Fuzzy

Somente via `NormalizedMetric` (contrato na seção 5 do mapping):

- aceleração RMS por eixo (telemetria) — variável primária;
- temperatura (escalar, `axis: null`);
- features espectrais explodidas por eixo, com `statisticalProcessing`/`band`/`samplingRateHz`;
- saída mapeada para `no-alert | a1 | a2` + `faultStatus` separado.

Restrições herdadas do GO COM RESTRIÇÕES: limiares locais declarados arbitrários (Q6),
`evidenceLevel: 'simulation-assumption'` em todo valor sintético, motor isolado após o P0.

## 9. Limitações conhecidas

- Banda útil real por perfil: `DESCONHECIDO` (Nyquist é teto teórico).
- Domínios de `statisticalProcessing`, `band`, `evaluator`: `DESCONHECIDO`.
- Capacidades térmicas e ambientais dos perfis físicos: não versionadas — o simulador usa
  faixas plausíveis como `HIPÓTESE_DE_SIMULAÇÃO` (ex.: temperatura 20–90 °C).
- TcAg × waveform: conflito registrado (Q9); hipótese conservadora.
- Nenhuma equivalência com dispositivo real é alegada; nenhum dado sai para
  `*.dynamox.solutions`.
