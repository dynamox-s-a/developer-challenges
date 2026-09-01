# BON-06 v2 — Plano executável do gêmeo digital (pós-freeze do P0)

> **HISTÓRICO — este documento descreve uma etapa anterior do projeto e não
> representa a arquitetura atual.** É o plano de execução do bônus; o resultado entregue está
> descrito em [`../../05-simulation/sensor-twin.md`](../../05-simulation/sensor-twin.md).
> Para o sistema como ele é hoje, comece por
> [`../../00-overview/architecture-map.md`](../../00-overview/architecture-map.md).

> Substitui as partes operacionais de `BON-06_SENSOR_TWIN_IMPLEMENTATION_PLAN.md` (v1).
> O v1 permanece como registro histórico das decisões de contrato e de PI, que continuam
> válidas. Este documento é o plano de execução real, auditado contra o código em
> `HEAD 65d6fa6` (P0 completo: 234 testes verdes, Swagger, latência comprovada).

## 0. Veredito

**GO — com escopo reduzido.** Núcleo obrigatório 100% TypeScript, sem nenhuma
dependência de ROS/Gazebo/Blender; camada ROS/rosbag como prova opcional de
proveniência. O P0 não é tocado: nenhuma linha de `apps/`, `libs/`, `prisma/` ou
`contracts/` muda.

## 1. Auditoria: plano v1 × estado real

| Plano v1 | Estado real (verificado) | Decisão | Motivo |
|---|---|---|---|
| Gate bloqueado: P0 e SCP-04 ausentes | P0 completo; SCP-04 congelado e validado | REMOVER | gate aberto |
| BON-06.1 "materializar contrato" (2 h) | `contracts/dynamox/` completo; exemplo oficial já é um ciclo do sensor virtual (SIM-HF-001, RMS por eixo, rpm/seed/scenario na configuração) | REMOVER | custo 0: já existe |
| Q1: endpoint TS-06 indefinido | `POST /api/telemetry-cycles` completo, idempotência em 2 camadas, e2e | REMOVER | resolvido |
| Q4: alinhar IDs com o seed | seed cria P-101 + "Mancal lado acoplamento" + SIM-HF-001 (HF+) com `resourceId 42d726ba…` idêntico ao exemplo | MANTER (reusar) | zero setup na demo |
| Gateway valida com `python3-jsonschema` | `@dynamox/contracts` exporta `validateTelemetryCycle` (Ajv), `computePayloadFingerprint`, `canonicalJson`, `isValidIdempotencyKey` | ALTERAR | mesma fonte de verdade do backend; zero drift e zero dependência Python extra |
| Blender mesh + URDF/Xacro + Gazebo P-101 (06.2/06.3/06.5, ~7 h) | irrelevantes para a prova do pipeline; alto risco/tempo | REMOVER (P2) | o próprio v1 definia o "menor MVP convincente" sem eles |
| fs 4096 Hz, Imu 256 Hz | sem Gazebo, o 256 Hz perdeu o propósito; conteúdo máximo sintetizado = 2×f_rot ≈ 58,3 Hz | ALTERAR: síntese 1024 Hz, stream 128 Hz (decimação ÷8), ruído ≤ 50 Hz | margem de Nyquist folgada, fixtures menores, claim mais honesto |
| Métricas rms/peak/crest/amp1x como séries | **restrição real do banco**: série única por (sensor, grandeza, eixo) — múltiplas métricas de aceleração por eixo colidiriam no índice | ALTERAR: **uma métrica por série** (RMS 1 s, 6 casas); 1×/2×/crest viram relatório de análise do gerador | descoberto na auditoria; invalida o desenho v1 |
| Cenário extra (misalignment) opcional | `configuration.scenario` do schema congelado só aceita `normal`/`imbalance` | REMOVER | mexer no schema por um cenário = custo > valor |
| Bags sem `/clock` + `use_sim_time` + `rosbag play --clock` no replay | o gateway é orientado a dados: lê `header.stamp` das mensagens, não relógio de parede; `rosbag.Bag` lê o arquivo direto, sem roscore | MANTER "sem /clock"; SIMPLIFICAR: round-trip sem `play`, sem roscore, sem `use_sim_time` | menos partes móveis, determinismo maior |
| `ConditionTelemetry.msg` custom (P1) | sem consumidor ROS nativo | REMOVER | continua sem justificativa |
| Idempotency-Key = sha256(…) | backend aceita `[A-Za-z0-9._~:-]{1,128}` | ALTERAR: chave legível `sim.<serial>.<scenario>.s<seed>.<inicioJanela>` | audível no Swagger/logs |
| Estimativa 23 h / 11 tarefas | maior parte do trabalho já existe no P0 | REMOVER: nova estimativa ~5,5 h MUST + ~2 h SHOULD | ver §8 |
| Guarda anti-produção, PI/disclaimers, tags `simulated` | continuam corretos | MANTER | — |

## 2. Arquitetura escolhida (opção C-lite = A obrigatória + ROS opcional)

```
[scenarios.ts: parâmetros determinísticos]
        │
  signal.ts ── síntese 1024 Hz (1×, 2×, ruído ≤50 Hz) ── decimação exata ÷8 ──► stream 128 Hz
        │                                                                        │
        │                                              (opcional ROS) samples ──► rosbag.Bag write ──► .bag
        │                                                                        │
        │                                                       bag_to_samples ◄─┘  (leitura direta, sem roscore)
        ▼                                                                        │
  windows.ts ── janelas 1 s → RMS por eixo (6 casas) + T(t) + rpm ◄──────────────┘
        ▼
  payload.ts ── telemetry-cycle + Idempotency-Key determinística ── validateTelemetryCycle (Ajv de @dynamox/contracts)
        ▼
  ingest.ts ── login (credencial do .env) ── guarda anti-produção ── POST /api/telemetry-cycles
        ▼
  idempotência existente ── TimeSeries/Samples existentes ── frontend existente (gráfico)
```

**Prova de proveniência do bag**: o replay reconstrói um payload **byte-idêntico**
(mesmo `payloadFingerprint`); o segundo POST devolve `200 duplicate:true`. Nenhum campo
difere (usar `origin: rosbag-replay` mudaria o fingerprint e colidiria timestamps → a
prova forte é exatamente o `duplicate:true`).

Comparativo (impacto × risco × tempo): A = alto/baixo/curto, mas sem o diferencial ROS;
B = exige ROS ao vivo (frágil); C-lite = A + evidência ROS auditável offline;
D/E (Gazebo/Blender) = semanas de risco para evidência marginal. **C-lite vence.**

## 3. Contrato do sensor virtual

| Item | Valor | Observação |
|---|---|---|
| Ativo | P-101 (`Pump`) | seed existente |
| Ponto | Mancal lado acoplamento | `resourceId 42d726ba50f8645df08dba9f` |
| Sensor | `SIM-HF-001` (HF+) | identificador claramente sintético; já no seed |
| Cenários | `normal`, `imbalance` | vocabulário do schema congelado |
| RPM | 1750 (f_rot = 29,1667 Hz) | `configuration.rpm` |
| Carga | 70 % | `configuration.loadPercent` |
| Seed | 42 | LCG próprio; **nunca** `Math.random` |
| Duração | 60 s por ciclo | 60 janelas de 1 s |
| Síntese | 1024 Hz → stream 128 Hz (÷8 exata) | conteúdo ≤ 58,3 Hz ≪ Nyquist 64 Hz |
| Amostras enviadas | RMS 1 s por eixo (60 pts × 3) + temperatura 1 Hz (60) + rotationalSpeed 1 Hz (60) | ~300 dataPoints/ciclo (~40 KB) |
| Unidades | g, degC, rpm | acc/temp reusam séries existentes (unidade preservada → sem `SERIES_UNIT_CONFLICT`); rpm cria série nova |
| Timestamps | normal: base `2026-08-30T09:00:00.000Z`; imbalance: `…T10:00:00.000Z`; passo 1 s | disjuntos dos dados existentes (26/08 12:00–12:15) |
| Arredondamento | valores com **6 casas decimais na fonte** | torna o round-trip g↔m/s² do ROS bit-estável |
| Idempotency-Key | `sim.SIM-HF-001.<scenario>.s42.20260830T090000Z` | conforme `[A-Za-z0-9._~:-]{1,128}` |
| Hash semântico | `computePayloadFingerprint(payload)` | o MESMO fingerprint do backend |

## 4. Modelo matemático (sintético e declarado como tal)

Eixos: X axial; Y, Z radiais. f_rot = RPM/60.

Radiais (r ∈ {Y, Z}):
`a_r(t) = k·A1·sin(2π f_rot t + φ_r) + A2·sin(4π f_rot t + φ₂) + n_r(t)`

- NORMAL: k = 1, A1 = 0,020 g; A2 = 0,008 g; ruído σ = 0,006 g.
- IMBALANCE: k = 4 (A1→0,080 g) com **φ_Y = 0, φ_Z = π/2** — o desbalanceamento é uma
  força centrífuga rotativa, então as radiais ficam defasadas 90° (vetor girante);
  temperatura +3 °C assintótico.

Axial: `a_x(t) = 0,4·A1·sin(2π f_rot t) + n_x(t)` — insensível ao desbalanceamento puro
(simplificação declarada; desalinhamento, que excitaria o axial, está fora do escopo).

Ruído `n(t)`: soma de 16 senóides com frequências determinísticas em [2, 50] Hz e fases
do LCG, normalizada para σ alvo — banda limitada **por construção** (decimação ÷8 sem
aliasing, replay determinístico, sem filtro numérico).

Temperatura: `T(t) = 25 + 18·(load/100)·(1 − e^(−t/300)) [+3 no imbalance]` °C.

RMS por janela: `sqrt(mean(a²))` sobre 128 amostras. Valores esperados:
normal ≈ 0,016 g radial; imbalance ≈ 0,057 g → **razão ≈ 3,5×**, visível a olho nu no
gráfico. Relatório de análise (fora da API): amplitude 1× e 2× por DFT de janela única,
provando que a energia dominante do imbalance está em 1×f_rot.

**Honestidade**: amplitudes pedagógicas; nada aqui infere severidade (ISO 10816),
banda real do HF+ (~kHz), envelope de rolamento ou diagnóstico físico. O que se
demonstra é o pipeline industrial completo: ativo → sensor → aquisição → contrato →
idempotência → série → visualização, com assinatura mensurável e reprodutível.

## 5. Payload real (excerto; o gerador produz o completo com 60 pts/medição)

Idêntico em forma ao `contracts/dynamox/examples/telemetry-cycle.example.json`
(que já valida e ingere hoje), com: `measuringSystemUniqueIdentifier: "SIM-HF-001"`,
5 measurements (acc x/y/z em g, temperature degC, rotationalSpeed rpm — série nova),
`metadata: { origin: "simulation", generator: {name: "industrial-condition-sensor-sim",
version: "0.2.0"}, profile: "HF+", seed: 42, synthetic: true, cycleId: <det.> }`,
`tags: ["simulated","pump-p101","hf-plus","scenario:<cenário>"]`,
`configuration: { monitoringLocationMap: [{mapLabel: "P-101 / Mancal lado acoplamento",
mapValue: "42d726ba50f8645df08dba9f"}], rpm: 1750, loadPercent: 70, scenario, seed: 42,
durationSeconds: 60, publishRateHz: 1 }`.

Autenticação do gateway: lê `SEED_USER_EMAIL/SEED_USER_PASSWORD` (e a base da API) do
`.env` da raiz via parser mínimo próprio, faz `POST /auth/login`, usa o Bearer; recusa
fatalmente qualquer host fora de `localhost/127.0.0.1`.

## 6. Camada ROS (opcional, prova de proveniência)

Tópicos/tipos (frame `sim_hf_001`; `header.stamp` = tempo sintético determinístico):
`/sim_hf_001/imu` `sensor_msgs/Imu` 128 Hz (aceleração em m/s²; orientação e giro com
covariância[0] = −1); `/sim_hf_001/temperature` `sensor_msgs/Temperature` 1 Hz;
`/sim_hf_001/rpm` `std_msgs/Float64` 1 Hz; `/sim_hf_001/scenario` `std_msgs/String`
latched. Bags **sem `/clock`**, escritos programaticamente (`rosbag.Bag`) a partir do
stream — e lidos de volta direto do arquivo (**sem roscore, sem `rosbag play`, sem
`use_sim_time`** no caminho de prova). `publish_live.py` (rqt_plot) apenas se sobrar
tempo, para a demo visual.

## 7. Árvore exata

```
simulation/sensor-twin/
  package.json            @dynamox/sensor-twin; deps: @dynamox/contracts, @dynamox/domain
  tsconfig.json           espelho de libs/contracts (com "paths": {})
  jest.config.js          espelho de apps/api
  README.md               execução com/sem ROS, disclaimers, roteiro da demo
  src/scenarios.ts        TS   parâmetros/tipos       in: —            out: config     teste: scenarios.spec
  src/rng.ts              TS   LCG + ruído banda-lim. in: seed         out: f(t)       teste: signal.spec
  src/signal.ts           TS   síntese + decimação    in: config       out: stream128  teste: signal.spec
  src/windows.ts          TS   RMS 1 s + análise 1×   in: stream128    out: janelas    teste: windows.spec
  src/payload.ts          TS   ciclo + chave + Ajv    in: janelas      out: payload    teste: payload.spec
  src/ingest.ts           TS   .env, login, guarda    in: payload      out: HTTP       teste: integration
  src/cli.ts              TS   generate|ingest|roundtrip-verify        —               (fino, sem lógica)
  src/*.spec.ts           unit (sem rede, sem banco, sem ROS) — entram na suíte global
  test/integration.spec.ts   contra API viva; SÓ via `npm run twin:integration`
  fixtures/normal.cycle.json      payload canônico commitado (regressão de fingerprint)
  fixtures/imbalance.cycle.json
  ros/README.md
  ros/samples_to_bag.py   PY   jsonl → .bag (rosbag.Bag write; sem roscore)
  ros/bag_to_samples.py   PY   .bag → jsonl (leitura direta; g com 6 casas)
  ros/publish_live.py     PY   ONLY IF TIME (demo rqt_plot)
```
Raiz: `package.json` ganha `"simulation/*"` em `workspaces` + scripts `twin:cycle`,
`twin:ingest`, `twin:integration` (aditivo, 4 linhas). **Rollback total** =
`rm -rf simulation/` + reverter essas linhas.

## 8. Blocos de execução (amanhã)

| ID | Objetivo | Est. | Classe | Critério de pronto |
|---|---|---|---|---|
| B1 | Scaffold do workspace + baseline de freeze | 30–45 min | MUST | `nx run-many -t build,lint,typecheck,test` verde COM o twin; P0 inalterado |
| B2 | rng+signal+scenarios + specs determinismo/diferenciação | 60–90 min | MUST | mesma seed ⇒ hash igual; RMS imb ≥ 2× normal |
| B3 | windows+payload + fixtures + spec de contrato | 60 min | MUST | `validateTelemetryCycle` ok; fingerprint das fixtures estável |
| B4 | ingest+cli + integração real (2 ciclos no banco, gráfico) | 45–60 min | MUST | 201 no 1º POST, `duplicate:true` no 2º; série rpm visível no frontend |
| B5 | ROS: jsonl→bag→jsonl + `roundtrip-verify` | 60–90 min | SHOULD | fingerprint(replay) == fingerprint(direto); POST do replay ⇒ duplicate:true |
| B6 | READMEs (twin + seção curta no raiz) + roteiro demo + contagens | 45 min | MUST | comandos copiáveis smoked |
| B7 | Review Codex focada + correções + Notion BON-06.* | 30–45 min | MUST | veredito tratado; cards com hash |
| B8 | `publish_live.py` + rqt_plot na demo | 45 min | ONLY IF TIME | tópicos visíveis ao vivo |

Total: **MUST ≈ 4,5–5,5 h · SHOULD +1,5 h**. (Estimativa v1 de 23 h descartada: contrato,
ingestão, idempotência, seed, frontend e validação já existem no P0.)

Commits, nesta ordem:
1. `feat(sim): scaffold deterministic sensor twin workspace`
2. `feat(sim): add deterministic hf+ signal synthesis with scenario separation`
3. `feat(sim): map sensor windows to telemetry contract with stable idempotency`
4. `feat(sim): add authenticated ingestion cli with integration proof`
5. `feat(sim): add rosbag round-trip provenance with identical fingerprints`
6. `docs(sim): add sensor twin guide and three-minute demo script`

## 9. Testes do bônus (mapa)

1 determinismo → `signal.spec` (hash de stream) e `payload.spec` (fingerprint);
2 diferenciação → `windows.spec` (RMS imb/normal ≥ 2, pico 1×);
3 contrato → `payload.spec` via Ajv real; 4–6 integração/persistência/idempotência →
`test/integration.spec.ts` (fora do default); 7 visualização → frontend existente
consome a série (screenshot na demo; nenhum código novo); 8 round-trip ROS →
`cli roundtrip-verify` (fora do npm test). A ausência de ROS **nunca** afeta
`npm run test`.

## 10. Demo de 3 minutos (roteiro)

- 00:00–00:20 — Visão geral logada: P-101 (Pump), pontos com HF+; "isto é o produto".
- 00:20–00:50 — `npm run twin:cycle -- --scenario normal` → mostra RMS/1× do relatório
  e o payload validado; `npm run twin:ingest` → `201`, fingerprint no terminal.
- 00:50–01:20 — Frontend: série de aceleração ganha a janela nova (~0,016 g); série
  `rotationalSpeed` nova no seletor.
- 01:20–01:50 — `--scenario imbalance` → ingest → gráfico salta para ~0,057 g (3,5×);
  narrar: "assinatura 1× de desbalanceamento, defasagem 90° entre radiais".
- 01:50–02:20 — Reprodutibilidade: repetir o ingest → `200 duplicate:true` (idempotência
  de produção, não truque de demo).
- 02:20–03:00 — (se B5 feito) `roundtrip-verify`: jsonl → rosbag → jsonl → payload com
  **o mesmo fingerprint** → `duplicate:true`. Fechar: "o caminho ativo → sensor →
  aquisição → contrato → série → análise, determinístico de ponta a ponta".

## 11. Red team (achados já incorporados)

- BLOCKER corrigidos no plano: colisão de séries por (sensor, grandeza, eixo) → uma
  métrica por série; `origin: rosbag-replay` quebraria o fingerprint/colidiria
  timestamps → replay byte-idêntico com prova via `duplicate:true`; g↔m/s² instável em
  float → arredondamento de 6 casas na fonte; cenário extra exigiria alterar schema
  congelado → cortado.
- IMPORTANT: payload limitado a ~300 pts (sem série de 184k amostras); timestamps
  verificados como disjuntos no banco real; workspaces = mudança de 2 linhas removível;
  jest do twin nasce com specs (nunca "no tests found" quebrando a suíte global).
- MINOR: fixtures ~40 KB de texto versionado (aceitável, servem de regressão); Python
  usa apenas stdlib do ROS já instalado.

## 12. Top 10 riscos

1. Contaminar o P0 → mudanças fora de `simulation/` limitadas a 4 linhas na raiz; checklist de freeze antes/depois de cada bloco.
2. Colisão de timestamp com dados reais criados à mão no dev → janelas em 30/08 + `SAMPLE_TIMESTAMP_CONFLICT` é erro explícito, não corrupção.
3. Round-trip não bit-idêntico → arredondamento na fonte + teste dedicado; fallback: comparar pós-janela (documentado como degradação).
4. `rosbag` Python indisponível na máquina do avaliador → camada ROS é opcional e autocontida; núcleo roda sem ela (dito no README).
5. Deriva entre fixture e gerador após ajuste de parâmetro → teste de regressão de fingerprint falha barulhento; atualizar fixture é ato consciente.
6. Sessão/rede instável de novo → blocos pequenos, commit por bloco, nada em memória de longa duração.
7. Suíte global muda de contagem e docs desatualizam → atualização de contagem é critério de pronto do B6.
8. `nx` cache mascarando teste novo → `nx reset` no B1 e no B7.
9. Reviewer achar "ciência falsa" → disclaimers em README/metadata/tags + §4 honesto.
10. Estouro de tempo → ordem MUST primeiro; B5/B8 caem sem afetar a história principal (a demo funciona só com o núcleo).

## 13. Checklist de freeze do P0 (antes de começar e após cada bloco)

```bash
git status --short                     # limpo fora de simulation/ e das 4 linhas da raiz
npm run test -w @dynamox/api           # 152 verdes
npm run test -w @dynamox/web           # 82 verdes
npm run lint && npm run typecheck      # verdes
npm run perf:latency                   # PASSA
git log --oneline -3                   # apenas commits feat(sim)/docs(sim) novos
```

## 14. Checklist final do BON-06

- [ ] `npm run test` global verde (P0 + twin) sem ROS instalado no PATH
- [ ] fixtures commitadas com fingerprint estável
- [ ] 2 ciclos ingeridos no dev com `201` e replay `duplicate:true`
- [ ] série `rotationalSpeed` visível no frontend
- [ ] (SHOULD) `roundtrip-verify` com fingerprints idênticos
- [ ] README twin + seção no README raiz + roteiro da demo
- [ ] Review Codex do delta `feat(sim)` tratada
- [ ] Notion BON-06/BON-06.3/06.4/06.5 atualizados com hashes (06.1/06.2 marcados como substituídos pelo v2)
- [ ] Checklist de freeze do P0 verde no fim
```
