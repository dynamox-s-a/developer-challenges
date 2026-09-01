# Domínio de alertas

O que é um alerta neste sistema, como ele nasce, muda e termina, e o que o banco garante
sozinho. Lido de [`libs/domain/src/alerts.ts`](../../../libs/domain/src/alerts.ts),
[`prisma/schema.prisma`](../../../prisma/schema.prisma) e
[`apps/api/src/alerts/`](../../../apps/api/src/alerts/). Por que foi decidido assim:
[ADR-0011](../06-decisions/adr-0011-condition-policy-and-alert-occurrences.md).

## Do ciclo ao alerta

```
POST /telemetry-cycles ─► IngestionCycle ─► TimeSeriesSample        (telemetria: o fato medido)
                                │
                                ▼
                      AlertCycleEvidence          RMS radial, temperatura, rpm de UM ciclo.
                      (cycleId é a PK)            Imutável: calculada uma vez, nunca de novo.
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
        AlertRuleEvaluation           AlertRuleState             Condition (derivada)
        UNIQUE(cycle, rule,           baseline aprendida,        calculada na consulta
        policyVersion)                streaks, marca d'água      analítica, não persistida
        = exactly-once                       │
                                             ▼
                                    AlertOccurrence  ──►  AlertEvent
                                    (episódio A1/A2)      (opened, escalated,
                                             │             acknowledged, resolved)
                                             ▼
                                     GET /alerts · GET /alerts/:id · POST .../acknowledge
                                             │
                                             ▼
                                   UI: /alerts, /alerts/:id, seções e KPI

metadata.history.groundTruth ──► SOMENTE alerts:validate (mede o motor)
                                 ✗ nunca entra no motor — garantido por leakage.spec.ts
```

## Taxonomia — cinco coisas que não são a mesma

| Conceito | O que é | Onde vive | Muda quando |
|---|---|---|---|
| **Telemetria** | amostra medida (valor, instante, série) | `time_series_samples` | nunca |
| **Condição** | leitura derivada: última aquisição sincronizada vs. a anterior (`normal`, `observation`, `attention`, …) | calculada na consulta (`analytics`), política em `libs/domain/src/condition.ts` | a cada aquisição |
| **Alerta** | episódio persistido: uma regra disparou por leituras consecutivas contra a **baseline aprendida do ponto** | `alert_occurrences` + `alert_events` | abre, escala, é reconhecido, resolve |
| **Notificação** | avisar alguém (e-mail, push) | **não existe** nesta rodada | — |
| **Insight / diagnóstico** | interpretação ("rolamento", "desbalanceamento") | **não existe**; o tipo do alerta descreve a regra, nunca a causa | — |

Consequência prática: um ponto pode ter **condição "normal" e um A1 aberto** ao mesmo tempo.
A condição compara com a aquisição anterior (uma rampa lenta nunca cruza 1,5× entre duas
aquisições); o alerta compara com a baseline de comissionamento (a mudança acumulada). As
duas leituras são verdadeiras, e a interface diz isso.

## Famílias e tipos

| Tipo (`AlertType`) | Família | Escopo | Regra v1 | Medida |
|---|---|---|---|---|
| `vibration-threshold` | `condition` | ponto | `vibration-radial` | RMS radial Y/Z ÷ baseline da hora do dia (razão) |
| `temperature-threshold` | `condition` | ponto | `temperature-delta` | temperatura média − baseline da hora do dia (°C) |
| `sensor-silent` | `data-quality` | ponto | `telemetry-presence` | intervalos esperados (900 s) decorridos sem aquisição |
| `fleet-silent` | `data-quality` | frota | `telemetry-presence` | idem, quando mais da metade dos pontos está muda — a planta, não um sensor |

Ausência de dado é **qualidade do dado/conectividade**, não falha mecânica — a família diz
isso, e a tela também.

## Alert Policy v1 (deste projeto)

Os números são política deste produto, orientada pela literatura industrial e calibrada pelo
comportamento medido do dataset — não prescrição de norma. Estão em `ALERT_POLICY_V1_RULES`
e são garantidos no banco (`alert_rules`) create-only: editar um limiar em produção é uma
`policyVersion` nova.

| Regra | A1 | A2 | Clear | Abrir | Resolver | Baseline | Extras |
|---|---|---|---|---|---|---|---|
| `vibration-radial` | ≥ 1,5× | ≥ 2,0× | < 1,4× | 2 consecutivas | 4 consecutivas | 192 ciclos, mediana por hora UTC, ≥ 4 por bin | — |
| `temperature-delta` | ≥ +5 °C | ≥ +10 °C | < +3 °C | 2 | 4 | idem | 120 min suprimidos após lacuna > 2 intervalos (religamento é frio, não anomalia) |
| `telemetry-presence` | > 4 intervalos (1 h) | ≥ 96 (24 h) | volta a reportar | 1 | 1 | — | colapso de frota quando mais de 50 % dos pontos sem episódio próprio estão mudos (sem exigir simultaneidade) |

Por que assim (curto): o ruído por bin de hora do dia é ~0,7 % (CV), então a zona morta de
7 % entre 1,4 e 1,5 é ≈ 15 σ — não há *chattering*; o ciclo térmico diário é ~11 °C, então
a baseline é por hora do dia, não escalar; duas aquisições isoladas altas existem no mês
(uma rotulada transiente, outra na janela canônica do gerador) e o gatilho consecutivo é o
que torna ambas verdadeiros negativos; a plataforma de referência usa A1/A2 com N medições
consecutivas configuráveis.

## Máquina de estados

```
                 2× ≥ A1                         2× ≥ A2
   (sem episódio) ────────► ACTIVE · A1 ───────────────────► ACTIVE · A2
        ▲                       │                                │
        │  4× < clear           │ 4× < clear                     │ 4× < clear
        └───────────────────────┴────────► RESOLVED (nível preservado) ◄┘
```

- **Nível é *latched***: A2 não volta a A1; só resolve.
- **Reconhecimento é ortogonal** (`acknowledgedAt/By/Level`, nunca um estado): a interface
  deriva `open` (ativo, sem ACK), `acknowledged` (ativo, com ACK) e `resolved`. Um episódio
  resolvido pode ser reconhecido depois ("voltou ao normal, ciente").
- **Escalar limpa o ACK**: mudança de prioridade exige novo reconhecimento (ISA-18.2). O
  evento `escalated` registra a nota "Reconhecimento anterior invalidado pela escalada".
- **Silêncio não reseta streaks** de vibração/temperatura; um ciclo sem evidência é
  `NO_EVIDENCE` no ledger e o episódio fica como está.
- Transições ficam em `alert_events` (`opened`, `escalated`, `acknowledged`, `resolved`),
  com o ciclo, o valor, a medida e o limiar envolvidos.

## O que cada episódio responde

Tudo é coluna de `alert_occurrences` ou de `alert_events` — nada é recalculado para exibir:

| Pergunta | Onde |
|---|---|
| Que regra e que versão | `ruleId`, `type`, `metric`, `unit`, `thresholdMode`, `policyVersion` |
| Sobre quem | `machineId/Name`, `monitoringPointId/Name`, `sensorId/SerialNumber` (FKs anuláveis + snapshots: o histórico sobrevive à exclusão do cadastro; frota tem tudo nulo e `affectedCount`) |
| Com que evidência | `triggerCycleId`, `triggerAt`, `triggerValue`, `triggerBaseline`, `triggerMeasure`, `triggerThreshold`, `consecutiveEvaluations` |
| Quão ruim ficou / como está | `peak*`, `last*`, `lastEvaluatedAt` |
| Quando abriu, escalou, foi reconhecido, resolveu | `openedAt`, evento `escalated`, `acknowledgedAt/By/Level/Note`, `resolvedAt`, `resolutionReason` |

## Idempotência e dedup — garantias do banco

| Tabela | Garantia | Como |
|---|---|---|
| `alert_cycle_evidence` | evidência física de um ciclo é calculada uma vez | PK `cycleId`, `INSERT … ON CONFLICT DO NOTHING`; nunca reavaliada a partir de amostras |
| `alert_rule_evaluations` | exactly-once por (ciclo, regra, versão) | `UNIQUE(cycleId, ruleId, policyVersion)` + `ON CONFLICT DO NOTHING RETURNING` — sem linha de volta, nada é aplicado |
| `alert_rule_states` | um estado por (regra, ponto); duas avaliações do mesmo ponto se serializam | `UNIQUE(ruleId, monitoringPointId)` + `SELECT … FOR UPDATE ORDER BY ruleId` |
| `alert_occurrences` | nunca dois episódios ativos para a mesma (regra, ponto/frota) | `activeKey` única enquanto ativo, `NULL` depois; a constraint é a última defesa — o código não usa P2002 como fluxo |

Ciclo mais antigo que a marca d'água do ponto (`lastEvaluatedAt`) é registrado como
`OUT_OF_ORDER` — evidência gravada, avaliação detectável, streaks intactos. Não é descarte:
`alerts:backfill` reconcilia com a mesma função de decisão.

## Execução

- **Síncrona, depois do commit** de `POST /telemetry-cycles`: evidência lida fora da
  transação, decisão pura, escrita numa transação curta. Um erro do motor é registrado e a
  ingestão responde 201 do mesmo jeito; duplicatas (200) não passam pelo motor.
  `ALERTS_EVALUATE_ON_INGEST=false` desliga.
- **Presença por timer** (`ALERTS_PRESENCE_SWEEP_MS`, padrão 5 min, `0` desliga, nunca sob
  Jest): quem está mudo, há quanto tempo, e se a planta parou junta. O retorno da
  telemetria resolve o `SENSOR_SILENT` no próprio ciclo.
- **Backfill** (`npm run alerts:backfill`) reexecuta tudo com relógio replayado, em blocos
  de 60 min com varredura de presença a cada 15 min; reexecutar produz 0 avaliações novas.
- **Tempo do dado, sempre**: `openedAt`, `resolvedAt`, `occurredAt` e o estado usam o início
  do ciclo, não o relógio da máquina; só o reconhecimento usa o relógio da API.

## O que o motor nunca lê

`metadata.history.groundTruth`, `configuration` e `scenario` do ciclo. Só o CLI de validação
os lê, para medir o motor; `apps/api/src/alerts/leakage.spec.ts` varre o diretório do motor
e falha se qualquer arquivo mencionar essas palavras.

## O gatilho consecutivo, em um caso

SIM-HF-005 tem, em 09/08, **uma** aquisição a 2,49× da baseline — um transiente rotulado pelo
gerador. Ela cruza A1 e A2 com folga e **não abre episódio algum**, porque a leitura seguinte
volta ao normal e a regra exige duas consecutivas. É a evidência mais direta de por que o
gatilho existe: sem ele, cada pico isolado viraria um alarme, e o operador aprenderia a
ignorar a tela. O mesmo mecanismo descarta o pico de 3,59× de SIM-HF-001 em 30/08.

## Validação contra a verdade-terreno

Relatório gerado por `npm run alerts:validate` em
[`../07-validation/alert-validation.md`](../07-validation/alert-validation.md). Em resumo,
no mês sintético: rampa de SIM-HF-002 detectada em A1 13,5 h **antes** do rótulo (54 ciclos
já em degradação, 0 falso positivo em máquina sadia) e escalada a A2 na cauda de demo;
deriva térmica de SIM-HF-007 detectada 7,8 h **depois** do rótulo (31 falsos negativos — o
rótulo usa +4 °C didáticos, a política +5 °C sustentados); transiente de SIM-HF-005 sem
episódio; SIM-TCAS-001 mudo → `SENSOR_SILENT` A1 → A2 → resolvido na volta; cinco paradas
de domingo e o trip → seis `FLEET_SILENT`, zero `SENSOR_SILENT` espúrio; nove sensores
sadios sem alerta de condição.

## Limitações declaradas

- Sem calendário de operação: parada planejada e falha de gateway são o mesmo fato
  observável (`FLEET_SILENT`).
- Baseline de comissionamento presume máquina sadia no aprendizado.
- Fim de dataset vira `FLEET_SILENT` ao vivo — estado honesto, não erro.
- Sem notificação, snooze, assignee, SLA, resolução manual, RPM (adiado por ADR) ou
  alerta espectral (extension point: novo `thresholdMode` na mesma política versionada).
- A cauda de demonstração e as janelas canônicas do gerador não são rotuladas: o motor as
  avalia, a matriz de validação não as conta.
