# Validação do motor de alertas contra a verdade-terreno sintética

Gerado em 2026-08-31 21:10 UTC pelo `npm run alerts:validate` — regras `telemetry-presence` v1, `temperature-delta` v1, `vibration-radial` v1.
Universo rotulado: **33.552 ciclos `dataset:history`** de 12 sensores; ocorrências do período rotulado: **12** (3 ativas).

O motor nunca lê o rótulo; este relatório o lê para medir o motor.

**Como ler as colunas de falso positivo.** Elas medem coisas diferentes e não devem ser somadas:

- **FP-antecipado** — o motor abriu alerta num ciclo que o gerador marca como `fault=true`
  (degradação já em curso), mas cujo rótulo `expectedAlert` ainda é `false`. O defeito existe; o
  que diverge é o instante em que cada um chama aquilo de alerta. **Não é falso alarme** — é
  detecção antecipada, e é o comportamento desejado de uma baseline de comissionamento.
- **FP-sadio** — alerta em ciclo com `fault=false`. Esse sim é falso alarme, e é a coluna que
  precisa ficar em zero.

Os falsos negativos também são declarados, não escondidos: onde o limiar da política v1 é mais
exigente que o limiar didático do gerador, o motor demora mais a abrir e a diferença aparece como FN.
Nenhum limiar foi ajustado para zerar esta matriz — o objetivo é explicar o comportamento, não
fabricar 100 % de acerto.

## Matriz de confusão por sensor (alertas de condição)

| Sensor | Família | TP | FP-antecipado | FP-sadio | TN | FN | 1.º esperado | 1.º previsto | Antecipação |
|---|---|---:|---:|---:|---:|---:|---|---|---|
| SIM-HF-002 | vibração | 285 | 54 | 0 | 2477 | 0 | 2026-08-27T14:47:00Z | 2026-08-27T01:17:00Z | +13.5 h |
| SIM-HF-007 | temperatura | 505 | 0 | 0 | 2280 | 31 | 2026-08-25T00:06:00Z | 2026-08-25T07:51:00Z | −7.8 h |
| **todos** | **vibração** | **285** | **54** | **0** | **33213** | **0** | | | |
| **todos** | **temperatura** | **505** | **0** | **0** | **33016** | **31** | | | |

Sensores sem qualquer alerta de condição esperado nem previsto: SIM-HF-001, SIM-HF-003, SIM-HF-004, SIM-HF-005, SIM-HF-006, SIM-HF-008, SIM-TCAG-001, SIM-TCAG-002, SIM-TCAS-001, SIM-TCAS-002.

## O gatilho consecutivo (SIM-HF-005)

SIM-HF-005 tem um transiente isolado no mês e **nenhum** episódio de vibração persistido: um pico único cruza o limiar e é descartado porque a leitura seguinte volta ao normal. É o gatilho de duas leituras consecutivas fazendo exatamente o que existe para fazer.

## Episódios de condição

| Sensor | Tipo | Aberto (nível) | Escalado | Resolvido | Pico | Último | Gatilho |
|---|---|---|---|---|---|---|---|
| SIM-HF-007 | TEMPERATURE_THRESHOLD | 2026-08-25T07:51:00Z (A1) | — | ativo (A1) | 8.66 °C em 2026-08-30T19:06:00Z | 7.65 °C | 36.8300 vs baseline 31.4720 = 5.36 °C ≥ 5 × 2 |
| SIM-HF-002 | VIBRATION_THRESHOLD | 2026-08-27T01:17:00Z (A1) | 2026-08-30T23:00:00Z → A2 | ativo (A2) | 3.77× em 2026-08-30T23:00:00Z | 3.77× | 0.0226 vs baseline 0.0150 = 1.50× ≥ 1.5 × 2 |

## Qualidade de dado: lacunas do grid × episódios de presença

| Lacuna (UTC) | Duração | Sensores | Esperado | Episódios que a cobrem |
|---|---|---:|---|---|
| 2026-06-01T06:03:00Z → 2026-07-31T00:03:00Z | 1434.0 h | 1 | SENSOR_SILENT (SIM-HF-003) | SENSOR_SILENT A2 SIM-HF-003 2026-06-01T07:03:00Z→2026-07-31T00:03:00Z |
| 2026-08-02T02:02:00Z → 2026-08-02T08:02:00Z | 6.0 h | 12 | FLEET_SILENT | FLEET_SILENT A1 (12 pts) 2026-08-02T03:00:00Z→2026-08-02T08:15:00Z |
| 2026-08-09T02:02:00Z → 2026-08-09T08:02:00Z | 6.0 h | 12 | FLEET_SILENT | FLEET_SILENT A1 (12 pts) 2026-08-09T03:00:00Z→2026-08-09T08:15:00Z |
| 2026-08-12T13:17:00Z → 2026-08-12T19:17:00Z | 6.0 h | 12 | FLEET_SILENT | FLEET_SILENT A1 (12 pts) 2026-08-12T14:15:00Z→2026-08-12T19:15:00Z |
| 2026-08-14T00:05:00Z → 2026-08-17T00:05:00Z | 72.0 h | 1 | SENSOR_SILENT (SIM-TCAS-001) | SENSOR_SILENT A2 SIM-TCAS-001 2026-08-14T01:00:00Z→2026-08-17T00:05:00Z<br>FLEET_SILENT A1 (11 pts) 2026-08-16T03:00:00Z→2026-08-16T08:15:00Z |
| 2026-08-16T02:02:00Z → 2026-08-16T08:02:00Z | 6.0 h | 11 | FLEET_SILENT | FLEET_SILENT A1 (11 pts) 2026-08-16T03:00:00Z→2026-08-16T08:15:00Z |
| 2026-08-23T02:02:00Z → 2026-08-23T08:02:00Z | 6.0 h | 12 | FLEET_SILENT | FLEET_SILENT A1 (12 pts) 2026-08-23T03:00:00Z→2026-08-23T08:15:00Z |
| 2026-08-30T02:02:00Z → 2026-08-30T08:02:00Z | 6.0 h | 12 | FLEET_SILENT | FLEET_SILENT A1 (12 pts) 2026-08-30T03:00:00Z→2026-08-30T08:15:00Z |

Episódios de presença DENTRO do mês sem lacuna correspondente (falso alarme de presença): nenhum

Episódios após o último ciclo rotulado (2026-08-30T19:52:00Z) — fim do histórico, não erro: 
- FLEET_SILENT A1 (12 pontos) 2026-08-30T21:00:00Z → 2026-08-30T21:15:00Z
- FLEET_SILENT A1 (12 pontos) 2026-08-30T23:15:00Z → ativo

## Baselines aprendidas por ponto

| Máquina · ponto | Sensor | Regra | Estado | Ciclos | Janela de aprendizado | Baseline global | Bins (mín–máx) | Observação |
|---|---|---|---|---:|---|---|---|---|
| P-101 · Mancal lado oposto ao acoplamento | SIM-HF-002 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:02:00Z → 2026-08-01T23:47:00Z | 35.8100 °C | 8–8 | — |
| P-101 · Mancal lado acoplamento | SIM-HF-001 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:02:00Z → 2026-08-01T23:47:00Z | 35.8080 °C | 8–8 | — |
| P-101 · Mancal lado oposto ao acoplamento | SIM-HF-002 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:02:00Z → 2026-08-01T23:47:00Z | 0.0156 g | 8–8 | — |
| P-101 · Mancal lado acoplamento | SIM-HF-001 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:02:00Z → 2026-08-01T23:47:00Z | 0.0156 g | 8–8 | — |
| P-102 — Bomba de recirculação · Mancal lado oposto ao acoplamento | SIM-HF-004 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:03:00Z → 2026-08-01T23:48:00Z | 35.8015 °C | 8–8 | — |
| P-102 — Bomba de recirculação · Mancal lado acoplamento | SIM-HF-003 | temperature-delta | ESTABLISHED | 192 | 2026-06-01T00:03:00Z → 2026-08-01T19:48:00Z | 35.5445 °C | 4–12 | **janela degradada**: aprendizado esparso (ciclos fora do mês) |
| P-102 — Bomba de recirculação · Mancal lado acoplamento | SIM-HF-003 | vibration-radial | ESTABLISHED | 192 | 2026-06-01T00:03:00Z → 2026-08-01T17:48:00Z | 0.0155 g | 4–12 | **janela degradada**: aprendizado esparso (ciclos fora do mês) |
| P-102 — Bomba de recirculação · Mancal lado oposto ao acoplamento | SIM-HF-004 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:03:00Z → 2026-08-01T23:48:00Z | 0.0156 g | 8–8 | — |
| P-103 — Bomba de alimentação · Mancal lado acoplamento | SIM-HF-005 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:04:00Z → 2026-08-01T23:49:00Z | 35.7905 °C | 8–8 | — |
| P-103 — Bomba de alimentação · Mancal lado oposto ao acoplamento | SIM-HF-006 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:04:00Z → 2026-08-01T23:49:00Z | 35.7895 °C | 8–8 | — |
| P-103 — Bomba de alimentação · Mancal lado oposto ao acoplamento | SIM-HF-006 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:04:00Z → 2026-08-01T23:49:00Z | 0.0156 g | 8–8 | — |
| P-103 — Bomba de alimentação · Mancal lado acoplamento | SIM-HF-005 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:04:00Z → 2026-08-01T23:49:00Z | 0.0156 g | 8–8 | — |
| VE-201 — Ventilador de tiragem · Mancal lado acoplamento | SIM-TCAG-001 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:05:00Z → 2026-08-01T23:50:00Z | 33.2255 °C | 8–8 | — |
| VE-201 — Ventilador de tiragem · Mancal lado oposto ao acoplamento | SIM-TCAS-001 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:05:00Z → 2026-08-01T23:50:00Z | 33.2245 °C | 8–8 | — |
| VE-201 — Ventilador de tiragem · Mancal lado acoplamento | SIM-TCAG-001 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:05:00Z → 2026-08-01T23:50:00Z | 0.0156 g | 8–8 | — |
| VE-201 — Ventilador de tiragem · Mancal lado oposto ao acoplamento | SIM-TCAS-001 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:05:00Z → 2026-08-01T23:50:00Z | 0.0156 g | 8–8 | — |
| VE-202 — Exaustor de caldeira · Mancal lado acoplamento | SIM-HF-007 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:06:00Z → 2026-08-01T23:51:00Z | 33.2280 °C | 8–8 | — |
| VE-202 — Exaustor de caldeira · Mancal lado oposto ao acoplamento | SIM-TCAG-002 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:06:00Z → 2026-08-01T23:51:00Z | 33.2270 °C | 8–8 | — |
| VE-202 — Exaustor de caldeira · Mancal lado oposto ao acoplamento | SIM-TCAG-002 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:06:00Z → 2026-08-01T23:51:00Z | 0.0156 g | 8–8 | — |
| VE-202 — Exaustor de caldeira · Mancal lado acoplamento | SIM-HF-007 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:06:00Z → 2026-08-01T23:51:00Z | 0.0156 g | 8–8 | — |
| VE-203 — Ventilador de resfriamento · Mancal lado acoplamento | SIM-TCAS-002 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:07:00Z → 2026-08-01T23:52:00Z | 33.2105 °C | 8–8 | — |
| VE-203 — Ventilador de resfriamento · Mancal lado oposto ao acoplamento | SIM-HF-008 | temperature-delta | ESTABLISHED | 192 | 2026-07-31T00:07:00Z → 2026-08-01T23:52:00Z | 33.2095 °C | 8–8 | — |
| VE-203 — Ventilador de resfriamento · Mancal lado oposto ao acoplamento | SIM-HF-008 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:07:00Z → 2026-08-01T23:52:00Z | 0.0156 g | 8–8 | — |
| VE-203 — Ventilador de resfriamento · Mancal lado acoplamento | SIM-TCAS-002 | vibration-radial | ESTABLISHED | 192 | 2026-07-31T00:07:00Z → 2026-08-01T23:52:00Z | 0.0156 g | 8–8 | — |

## Ledger de avaliações

| Regra | Desfecho | Ciclos |
|---|---|---:|
| temperature-delta | EVALUATED | 30.689 |
| temperature-delta | LEARNING | 2.304 |
| temperature-delta | SUPPRESSED | 611 |
| vibration-radial | EVALUATED | 31.300 |
| vibration-radial | LEARNING | 2.304 |

## Ciclos não rotulados (fora da matriz)

| Sensor | Ciclos |
|---|---:|
| SIM-HF-001 | 6 |
| SIM-HF-002 | 6 |
| SIM-HF-003 | 4 |
| SIM-HF-004 | 4 |
| SIM-HF-005 | 4 |
| SIM-HF-006 | 4 |
| SIM-HF-007 | 4 |
| SIM-HF-008 | 4 |
| SIM-TCAG-001 | 4 |
| SIM-TCAG-002 | 4 |
| SIM-TCAS-001 | 4 |
| SIM-TCAS-002 | 4 |

Cauda de demonstração, janelas canônicas e cargas de fumaça: o motor os avalia (são dados), mas o
rótulo do gerador não os cobre — ficam fora de TP/FP/TN/FN.

