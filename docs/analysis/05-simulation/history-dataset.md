# Histórico sintético de 30 dias (dataset `history`)

**Status:** CURRENT · **Dono:** `simulation/sensor-twin/src/history/` · **Decisão:** [ADR-0010](../06-decisions/adr-0010-history-through-contract.md)

Um mês de telemetria sintética para os 12 sensores da planta, produzido pelo **mesmo
`POST /telemetry-cycles`** que a planta usa — mesmo Ajv, mesma idempotência, mesmos 409/422
do backend — e gravado no **banco normal da aplicação**. Existe para duas coisas: dar à
análise um padrão operacional com degradação lenta, falha de comunicação e falso positivo
rotulados, e **expor, de propósito, as consultas que não escalam** (ver
[bottlenecks](../07-validation/testing-strategy.md#bottlenecks-expostos-pelo-histórico-e-direção-da-próxima-fase)).

Nada aqui é dado real: [`simulation-vs-real.md`](./simulation-vs-real.md) continua valendo
integralmente. Limiares e curvas são **didáticos** (HIPÓTESE_DE_SIMULAÇÃO), declarados em
`history/narrative.ts` e não validados industrialmente.

## Como é gerado

| Etapa | Onde | Evidência |
|---|---|---|
| Grade absoluta de slots + lacunas do regime | `history/schedule.ts` | CONFIRMADO — `schedule.spec.ts` |
| Overrides físicos + verdade-terreno por slot | `history/narrative.ts`, `history/thermal.ts`, `history/seeds.ts` | CONFIRMADO — `narrative.spec.ts`, `seeds-thermal.spec.ts` |
| Ciclo pelo gerador do twin (`buildCycle('normal', overrides, identity, extras)`) | `payload.ts` (extras só nos objetos abertos do contrato) | CONFIRMADO — `payload-extras.spec.ts` |
| Geração em `worker_threads`, POST com concorrência limitada, retry, abort alto | `history/pool.ts`, `history/driver.ts` | CONFIRMADO — `driver.spec.ts`, `test/history.integration.spec.ts` |
| Comando | `npm run twin:history` (`plant history`) | `history/cli-args.ts`, `history/run.ts` |

O comando **não cria** máquinas, pontos nem sensores: resolve os `resourceId` por `GET`
(`bootstrap.ts#resolveResourceIds`) e falha com a dica de `plant bootstrap` se a planta
não existir. Só escreve nas 60 séries que a planta já possui.

## Grade temporal

- **Cadência:** uma aquisição de 60 janelas RMS de 1 s a cada 15 min, por sensor —
  o mesmo formato de um ciclo da planta (5 medições × 60 pontos = 300 amostras, ≈ 18,6 KB).
- **Absoluta:** os instantes são múltiplos UTC de 15 min desde a época Unix, mais a fase
  da máquina. Só o **fim** da faixa depende da âncora de demonstração
  (`demoAnchorMs() − 4 h`); o **início** é a meia-noite UTC de `fim − dias`.
- **Fase por máquina** (ordem do manifest): a máquina *i* acorda em `:(2+i)` de cada quarto.
  Os dois sensores de um ativo compartilham o início; o minuto nunca é 0 nem ≥ 55.

| Máquina | Sensores | Minutos de início |
|---|---|---|
| P-101 | SIM-HF-001, SIM-HF-002 | :02 · :17 · :32 · :47 |
| P-102 | SIM-HF-003, SIM-HF-004 | :03 · :18 · :33 · :48 |
| P-103 | SIM-HF-005, SIM-HF-006 | :04 · :19 · :34 · :49 |
| VE-201 | SIM-TCAG-001, SIM-TCAS-001 | :05 · :20 · :35 · :50 |
| VE-202 | SIM-HF-007, SIM-TCAG-002 | :06 · :21 · :36 · :51 |
| VE-203 | SIM-TCAS-002, SIM-HF-008 | :07 · :22 · :37 · :52 |

### Instantes reservados (o histórico nunca escreve neles)

| Produtor | Instantes | Por quê |
|---|---|---|
| `prisma/seed.ts` | 30 amostras a cada 10 s terminando na âncora (SIM-HF-001 / aceleração-Y) | colisão de instante aborta o ciclo inteiro (`409 SAMPLE_TIMESTAMP_CONFLICT`) |
| fases da planta | âncora −3 h / −2 h / −1 h, 60 s cada, sempre em `HH:00` | testes de integração fixam 60 amostras em cada janela |
| exemplo versionado do contrato | `2026-08-26T12:00:00–:20Z` (SIM-HF-001) | precisa continuar executável |
| janelas canônicas do gerador | `2026-08-30T09:00` e `10:00` (SIM-HF-001) | usadas por `twin:ingest` e pela integração |

`assertOutsideReservedWindows` verifica isso em tempo de execução e nos testes, para
âncoras alinhadas e não alinhadas. O histórico termina em `âncora − 4 h` para que as
três janelas da planta continuem sendo a "cauda ao vivo" que o dashboard avalia.

## Regime operacional

| Dimensão | Regra (constantes em `NARRATIVE`) |
|---|---|
| Carga | `Lnom` (70 % bombas, 55 % ventiladores) × perfil diurno `1 + 0,15·cos(2π(h−14)/24)` × fator do dia (±3 %, determinístico) × 0,95 em fins de semana |
| Vibração ↔ carga | `kLoad = 1 + 0,25·(L/Lnom − 1)` |
| Personalidade | multiplicador de vibração ∈ [0,92; 1,08] e deslocamento térmico ∈ [−1; +1] °C por sensor (LCG da seed) |
| Rotação | bombas 1750 rpm; ventiladores (VFD) `1180·(0,88 + 0,12·L/Lnom)` |
| Temperatura | `ambiente(t) + personalidade + 18·(L/100)·aquecimento + evento`, `ambiente = 24 + 4·cos(2π(h−15)/24)`; cada aquisição sai plana (o transiente de 300 s do gerador é desligado por override) |
| Aquecimento | `1 − e^(−Δ/45 min)` após parada semanal ou trip |
| Parada programada | domingos 02:00–08:00 UTC — sem aquisições na frota |
| Trip não programado | dia 12 da época, 13:15–19:15 UTC — sem aquisições na frota |
| Ruído | seed por aquisição `mixSeed(mixSeed(seedDoSensor, 'HIST'), minutoAbsoluto)` — cada ciclo tem realização própria e reproduzível |

## Eventos e verdade-terreno

RMS radial nominal do cenário normal: `√(0,02²/2 + 0,008²/2 + 0,006²) ≈ 0,0164 g`
(DERIVADO da forma fechada; o gerador reproduz isso dentro da tolerância dos testes).

| Evento | Sensor | Janela (relativa à época) | Física | Verdade-terreno |
|---|---|---|---|---|
| Desbalanceamento progressivo | SIM-HF-002 | dia 0 → 30 | razão `1 + 0,6·s`, `s = (t/30 d)^2,2`; fase Z → π/2·s; +3 °C·s | `physicalEvent=imbalance`, `fault=true`; `degrading` a partir de 1,1×; `observation` + `expectedAlert` (`vibration`) a partir de 1,5× (≈ dia 27) |
| Deriva térmica | SIM-HF-007 | dias 20 → 30 | +8 °C linear; vibração inalterada; o vizinho SIM-TCAG-002 fica plano | `thermal-drift`, `fault=true`; `degrading` ≥ +1 °C; `observation` + `expectedAlert` (`thermal`) ≥ +4 °C |
| Sensor mudo | SIM-TCAS-001 | dias 14, 15, 16 | nenhum ciclo | sem payload — registrado na tabela de lacunas (`expectedAlert: communication`) |
| Pico transiente | SIM-HF-005 | dia 9, 11:04 UTC (um slot) | razão 2,5×, fase π/2, vizinhos normais | `physicalEvent=transient`, **`fault=false`, `expectedAlert=false`** — o falso positivo por desenho |
| Aquecimento | todos | primeiros ~100 min após parada/trip | temperatura sobe com τ = 45 min | `physicalEvent=warmup`, `expectedState=warmup`, sem alerta; `regime.phase = post-stop|post-trip` |

O rótulo `configuration.scenario` fica **`normal`** em todo o histórico: o enum do
contrato é fechado e o `imbalance` que ele conhece é o degrau abrupto k = 4 das fases da
planta. A verdade vive em `metadata.history` — que é o que uma modelagem de alertas
precisa, e não um rótulo de cenário.

### `metadata.history` (objeto aberto do contrato; entra no fingerprint)

```json
{
  "dataset": "history", "narrativeVersion": 1,
  "epoch": "2026-07-31T00:00:00.000Z", "everyMinutes": 15,
  "gridIndex": 1234, "slotStart": "2026-08-12T20:33:00.000Z", "dayIndex": 12,
  "sensorSeed": 44, "slotSeed": 2874116117,
  "regime": { "loadPercent": 71.3, "rpm": 1750, "ambientC": 39.8, "warmupFactor": 0.83, "minutesSinceRestart": 78, "phase": "post-trip" },
  "groundTruth": {
    "physicalEvent": "none|warmup|imbalance|thermal-drift|transient",
    "fault": false, "expectedState": "normal|warmup|degrading|observation",
    "expectedAlert": false, "alertKind": null,
    "radialRatio": 0.97, "eventRatio": 1, "expectedRadialRmsG": 0.01588, "temperatureC": 39.8,
    "events": [{ "type": "imbalance-ramp|thermal-drift|transient-spike", "severity": 0.42, "ratio": 1.25, "deltaC": 3.2 }]
  }
}
```

Nenhum campo é volátil (sem id de execução, sem `generatedAt`): o payload é função pura de
(sensor, instante absoluto, época, `NARRATIVE`). Tag adicional: `dataset:history`.

## Idempotência, época e catch-up

- Reexecutar `npm run twin:history` no mesmo dia → todos os ciclos voltam `200 duplicate:true`; nada é gravado.
- Reexecutar dias depois → a **época é detectada nos dados** (primeira amostra da série
  aceleração-Y do primeiro sensor com o minuto na fase da máquina) e só os slots novos entre o
  fim anterior e o novo `âncora − 4 h` são `201`. `--epoch` sobrepõe; `--no-detect` desliga.
- Mudar cadência, época ou `NARRATIVE` com dados existentes produz payload diferente num
  instante ocupado → a API responde **409** e o comando aborta com a dica de
  `npm run history:purge`. Melhor falhar alto do que misturar duas narrativas.
- `Idempotency-Key = cycleId = sim.<serial>.normal.s<slotSeed>.<início>.<fp8>` — a mesma
  construção das fases da planta (`payload.ts`).

## Como consultar

```sql
-- ciclos e amostras do dataset
select count(*), sum("sampleCount") from ingestion_cycles where 'dataset:history' = any(tags);

-- verdade-terreno por ciclo
select "measuringSystemUid", metadata->'history'->>'slotStart' as slot,
       metadata->'history'->'groundTruth'->>'expectedState' as state,
       metadata->'history'->'groundTruth'->>'expectedAlert' as alert
from ingestion_cycles where 'dataset:history' = any(tags) order by 2;

-- média radial diária de um sensor (rampa visível)
select date_trunc('day', p.timestamp) d, avg(p.value)
from time_series_samples p
join time_series ts on ts.id = p."timeSeriesId" join sensors s on s.id = ts."sensorId"
where s."serialNumber" = 'SIM-HF-002' and ts."physicalQuantity" = 'ACCELERATION' and ts.axis in ('Y','Z')
group by 1 order by 1;
```

## Operação

```bash
npm run twin:history -- --dry-run            # plano, contagens, lacunas, reservadas, bench de geração
npm run twin:history -- --sensors SIM-HF-003 --limit 50   # smoke
npm run twin:history -- --report simulation/sensor-twin/artifacts/history-report.json
npm run history:purge -- --dry-run           # quanto sairia
npm run history:purge -- --yes               # remove só o dataset (séries e planta ficam)
npm run db:reset                             # banco do zero: volume, migrações, seed
```

Rode `npm run twin:integration` **antes** da carga ou depois de um purge: o supervisor
(`assess`/`deliberate`) pagina séries inteiras e, com o mês presente, os testes baseados
nele estouram o timeout — é um dos bottlenecks expostos, não um defeito do dataset.

## Baseline medida da carga

Preenchida ao fim da primeira carga completa (ver seção homônima abaixo, datada). Os
números são **medições** de uma execução específica — não fixam contrato.

## Limites e não-alegações

- Amplitudes, curvas de degradação, limiares e o modelo térmico são pedagógicos; nenhuma
  severidade é ISO 10816, nenhum valor infere banda real de sensor ou diagnóstico físico.
- Não há eventos/alarmes persistidos no domínio: `expectedAlert` é a **expectativa** que a
  modelagem futura deve reencontrar, não um alarme emitido.
- O dataset não representa cliente, planta ou sensor real; nunca toca a API produtiva
  (`assertLocalBaseUrl` continua valendo para o comando de histórico).
