# @dynamox/sensor-twin — Synthetic Industrial Condition Monitoring Plant (BON-06)

Frota sintética de sensores de condição operando como **cliente** da aplicação
full-stack do desafio: uma pequena instalação com **6 ativos rotativos e 12 pontos
monitorados**, um gerador determinístico de telemetria e um supervisor que prioriza
inspeção **observando apenas as séries persistidas pela API real**.

> **Tudo aqui é sintético e didático.** As amplitudes são pedagógicas; nada infere
> severidade real (ISO 10816), banda real do HF+, diagnóstico físico ou economia real.
> A planta não representa cliente, layout ou dado real; o código **recusa** qualquer
> URL que não seja localhost e os domínios da Dynamox explicitamente.

## 1. Por que isto existe

O desafio pede CRUD + telemetria. Este bônus demonstra o **domínio industrial em volta
do contrato**: ativo → ponto → sensor → aquisição → idempotência → série → decisão —
tudo pelo mesmo caminho que um cliente real usaria (auth, CRUDs, regra Pump⇒HF+,
paginação, ingestão, leitura), sem tocar o core congelado (`apps/`, `libs/`, `prisma/`,
`contracts/` permanecem intactos desde o freeze do P0).

## 2. A planta sintética

`src/plant.ts` é a fonte única de verdade — "Planta Sintética de Bioenergia" (`sbe-01`):

| Ativo | Tipo | rpm | Pontos (DE/NDE) | Sensores |
|---|---|---|---|---|
| P-101 (seed) | Pump | 1750 | 2 | SIM-HF-001/002 (HF+) |
| P-102, P-103 | Pump | 1750 | 2+2 | SIM-HF-003…006 (HF+) |
| VE-201…203 | Fan | 1180 | 2+2+2 | TcAg×2, TcAs×2, HF+×2 |

12 sensores, seeds 42–53, janelas canônicas de 60 s em 2026-08-31 08:00/09:00/10:00 UTC
(baseline/condition/confirm). A regra do produto (Pump só aceita HF+) é invariante
validada do manifest. 12 pontos ⇒ **3 páginas (5+5+2)** na UI no estado da demo.

## 3. Arquitetura

```
manifest (plant.ts)
   ├─ bootstrap (F2) ──── APIs reais ────► machines / points / sensors
   ├─ engine (F3) ─── ciclos determinísticos ─► POST /telemetry-cycles (Idempotency-Key)
   ├─ snapshots (F4) ── baseline + condition ─► PostgreSQL (séries/amostras)
   ├─ supervisor (F5/F6) ◄── GET séries/amostras ── decide SÓ pelo que está persistido
   └─ proveniência ROS (F8) ── JSONL ⇄ rosbag ── replay duplicate:true
```

Fronteira estanque: o supervisor (`assess.ts`, `deliberate.ts`) **não importa nenhuma
maquinaria de cenário** do simulador — ele entrega apenas o serial selecionado à porta
`requestConfirmatoryAcquisition`, e `boundary.spec.ts` varre os fontes para impedir
regressão.

## 4. Modelo determinístico do sensor (núcleo reativo)

LCG próprio (reprodutível entre plataformas), síntese a 1024 Hz decimada para o stream
de 128 Hz, 1× e 2× da rotação nos eixos radiais, ruído banda-limitado [2, 50] Hz,
temperatura de primeira ordem. Janelas RMS de 1 s → 60 datapoints por métrica →
5 métricas (acc x/y/z em g, temperatura, rotação) = **300 datapoints por ciclo**.
Mesmo seed ⇒ mesmo payload ⇒ mesmo `payloadFingerprint` (o fingerprint da aplicação).

Cenários (vocabulário do contrato congelado): `normal` e `imbalance` — o
desbalanceamento é força radial girante (k=4 no 1×, radiais em quadratura); o eixo
axial **não** acompanha o cenário, por construção e por teste.

## 5. Cenário multi-sensor

`plant baseline` ingere os 12 sensores em operação normal; `plant condition` re-ingere
a mesma frota com **exatamente um** sensor (P-101/NDE, `SIM-HF-002`) em `imbalance`.
Cada fase: 12 ciclos × 300 datapoints = 3.600; re-execução ⇒ 100% `duplicate:true`
(a chave `intent.fp8` viaja como Idempotency-Key e como `metadata.cycleId`).

## 6. Supervisor da frota

`plant assess` é **estritamente observacional**: login + GET. Lê as 60 séries da
frota, pareia Y/Z de forma estanque (60/60 amostras, timestamps únicos e idênticos),
calcula `radialRms = sqrt((y²+z²)/2)` por janela e ranqueia por
`ratio = média(condition)/média(baseline)`. O alvo emerge **dos dados** — o tipo de
entrada do núcleo de decisão nem possui campo de cenário.

Limiar `SYNTHETIC_ATTENTION_RATIO = 2.0`: **didático**, calibrado contra o próprio
gerador para separar os dois cenários sintéticos. Não é threshold industrial.

## 7. Aquisição confirmatória (deliberação)

`plant deliberate` fecha o loop OBSERVE → RANK → DECIDE → ACT → RE-OBSERVE →
RECOMMEND: acima do limiar, o supervisor pede ao simulador **uma aquisição NOVA**
(janela 10:00, seed do sensor + 1000 ⇒ realização de ruído independente, fingerprint
próprio, HTTP 201 na primeira execução), **re-lê o banco** e só então transiciona
SUSPECT → CONFIRMED_ATTENTION. `duplicate` é transporte, nunca evidência. A
recomendação é limitada por teste: prioriza inspeção, jamais diagnostica falha.

## 8. Proveniência ROS (opcional)

**ROS é OPCIONAL — a aplicação full-stack não depende dele.** F8 não é outro simulador:
pega a aquisição confirmatória escolhida pelo supervisor e prova que ela vira um
artefato ROS portátil reconstruível **sem mudar de identidade semântica**:

```
aquisição canônica → JSONL (306 registros) → rosbag → JSONL reconstruído
   → payload → Ajv real → computePayloadFingerprint IDÊNTICO
   → POST na API → duplicate:true → zero amostras novas
```

- Distinção arquitetural: a **confirmação** (F6) foi `201` (aquisição nova); o
  **replay ROS** é `duplicate:true` com o mesmo fingerprint (reprodução).
- Identidade = fingerprint recomputado do payload reconstruído. Bytes do `.bag` nunca
  são a identidade (metadados de container variam); a byte-identidade do JSONL
  canônico re-serializado é registrada como evidência **secundária**.
- Tópicos mínimos: `/sensors/<id>/imu` (aceleração RMS janelada em g — mapeamento
  didático declarado), `/sensors/<id>/temperature`, `/pump_p101/rpm`,
  `/sensors/<id>/provenance` (envelope com `origin: simulation`). Sem `/clock`, `/tf`,
  `/joint_states` — pertenciam à visão Gazebo antiga, cortada.
- `origin = simulation` é obrigatório nas duas camadas e verificado na reconstrução:
  replay ROS jamais aparenta aquisição física. Nenhum segredo entra no artefato.
- Geração offline via `rosbag.Bag` (Python): sem roscore, Gazebo, RViz ou nós.

**Requisitos (só para F8):** ROS 1 Noetic em Ubuntu 20.04 (Python 3.8) com
`rosbag`/`sensor_msgs` — instalação padrão em `/opt/ros/noetic` (sobrescreva com
`TWIN_ROS_ROOT`). A ponte monta `PYTHONPATH`/`LD_LIBRARY_PATH` sozinha, sem `source`.

## 9. Comandos

```bash
# núcleo single-sensor
npm run twin:cycle -- --scenario normal        # gera e valida um ciclo local
npm run twin:ingest -- --scenario imbalance    # gera, autentica e envia à API local

# planta (exige db:up + dev:api + seed)
npm run plant -- bootstrap    # cria/reconcilia 6 máquinas, 12 pontos, 12 sensores
npm run plant -- baseline     # snapshot normal da frota (12 ciclos)
npm run plant -- condition    # snapshot com 1 sensor em condição sintética
npm run plant -- assess       # observacional: ranking + estados pelos dados do banco
npm run plant -- deliberate   # loop completo com aquisição confirmatória
npm run plant -- rosbag       # F8: JSONL → bag → reconstrução → replay (exige ROS)

# histórico sintético de 30 dias (mesmo contrato; ver docs/analysis/05-simulation/history-dataset.md)
npm run twin:history -- --dry-run          # plano, lacunas, instantes reservados, bench
npm run twin:history                       # carga idempotente (reexecutar → duplicate)
npm run history:purge -- --yes             # remove só o dataset
```

## 10. Testes

```bash
npm run test -w @dynamox/sensor-twin   # 89 unitários puros (sem rede, banco ou ROS)
npm run twin:integration               # 17 testes contra a API viva (db:up + dev:api)
npm run twin:ros                       # 5 testes do round-trip ROS (API viva + Noetic)
```

Os unitários entram na suíte global (`npm run test`); as duas integrações têm
comandos dedicados e **nunca** rodam no target padrão — a suíte convencional fica
verde em máquinas sem banco e sem ROS.

## 11. Claims e limitações

O que este bônus **é**: gêmeo digital determinístico de sensor; frota multi-sensor
sintética; evento de condição sintético; ranking determinístico por variação relativa
contra baseline sintético; aquisição confirmatória; decisão supervisória explicável;
artefato ROS reproduzível; persistência real via API local + PostgreSQL.

O que ele **não é** (e nunca afirma ser): reprodução do sensor Dynamox real ou da
banda completa do HF+; diagnóstico de rolamento; predição de falha; vida útil
remanescente (RUL); threshold industrial; modelo validado em hardware; digital twin
físico completo; caso real de cliente ou economia/downtime real.

Evolução futura registrada (não implementada): análise/forecast clássico de séries
temporais sobre os RMS persistidos.

## 12. Demo (≈4 min)

1. **00:00–00:30 — Produto:** 6 máquinas, 12 pontos, 12 sensores; paginação 5+5+2 e
   regra Pump⇒HF+ na UI.
2. **00:30–01:00 — Arquitetura:** sensor twin → API → PostgreSQL → frontend (diagrama
   da seção 3).
3. **01:00–01:30 — Baseline:** `plant baseline` — 12 sensores estáveis
   (re-execução: 12× duplicate).
4. **01:30–02:00 — Condition:** `plant condition` — um sensor muda de condição;
   gráfico da série no frontend.
5. **02:00–02:30 — Assessment:** `plant assess` — P-101/NDE rank #1 ≈3,49×; 11 demais
   ≈1,00×.
6. **02:30–03:00 — Deliberação:** `plant deliberate` — SUSPECT → aquisição nova (201)
   → re-observação → CONFIRMED_ATTENTION → "Prioritize inspection".
7. **03:00–03:30 — ROS:** `plant rosbag` — bag de 181 mensagens → mesmo fingerprint →
   replay duplicate:true.
8. **03:30–04:00 — Fechamento:** o challenge principal roda sem nada disso — o bônus
   apenas o consome.
