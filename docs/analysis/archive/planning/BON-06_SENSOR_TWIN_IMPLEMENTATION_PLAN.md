# BON-06 — Plano de implementação do gêmeo digital de sensor industrial

> **HISTÓRICO — este documento descreve uma etapa anterior do projeto e não
> representa a arquitetura atual.** É o plano original do bônus, com ROS 1 + Gazebo 11 — **Gazebo,
> Blender e Xacro foram cortados e nunca implementados**.
> Para o sistema como ele é hoje, comece por
> [`../../00-overview/architecture-map.md`](../../00-overview/architecture-map.md).

> **Status**: planejamento aprovado, aguardando execução.
> **Gate**: a implementação permanece bloqueada enquanto a fundação P0 da aplicação e os artefatos do SCP-04 não estiverem disponíveis no repositório.
> **Posicionamento**: gêmeo digital experimental inspirado na categoria de sensores industriais de condição, **sem afiliação oficial e sem reprodução de firmware ou protocolo proprietário**.
> **Data do plano**: 26/08/2026 · **Prazo do desafio**: 31/08/2026 · **Prioridade**: P2 (bônus — não pode ameaçar o fluxo P0).

---

## 1. Resumo executivo

MVP em ROS 1 Noetic + Gazebo 11 (Ubuntu 20.04) com camadas estritamente separadas:

| Camada | Artefato | Natureza |
|---|---|---|
| Modelo visual | Blender → DAE | asset gráfico, sem código |
| Descrição robótica | URDF/Xacro | declarativa |
| Geração de sinal | nó `rospy` determinístico | executável **sem Gazebo** |
| Integração física | bomba P-101 simulada (primitivas) | cena Gazebo |
| Gateway | tópicos tipados → JSON validado → API local → PostgreSQL | ponte ROS↔REST |

Evidência portátil por ROS bag LZ4 com replay sem Gazebo. Contrato interno = JSON Schema reduzido derivado do `POST /v1/telemetry-cycles` público (SCP-04). Plugin Gazebo compilado (C++) e migração ROS 2 Jazzy + Gazebo Harmonic são evoluções futuras registradas, não implementadas — o conjunto do MVP **não** é um plugin. O produto full-stack principal executa **sem ROS ou Gazebo**.

## 2. Estado do repositório e ambiente

Diagnóstico de 26/08/2026 (somente leitura):

- Branch `diogo-fragoso`, working tree limpo; `origin` = fork `diogon01/Dynamox-Desafio-Engenharia-de-Software`; `upstream` = `dynamox-s-a/developer-challenges`.
- O repositório contém apenas os enunciados herdados do fork. **Não existem ainda**: frontend, backend, Nx, Prisma, Docker Compose, `contracts/`, workspace ROS. A fundação P0 não foi iniciada — o gate do BON-06 está integralmente à frente.
- Artefatos do SCP-04 **ausentes** (dependência bloqueante; conteúdo não deve ser inventado):
  `contracts/dynamox/README.md`, `contracts/dynamox/dynamox-public-api.openapi.json`, `contracts/dynamox/telemetry-cycle.schema.json`, `contracts/dynamox/examples/telemetry-cycle.example.json`.

Ambiente verificado (sem instalar nada):

| Item | Estado |
|---|---|
| Ubuntu | 20.04.6 LTS ✅ |
| ROS | Noetic ✅ (`rospy`, `gazebo_ros`, `gazebo_ros_control`, `xacro`, `robot_state_publisher`, `rviz`) |
| Gazebo | 11.15.1 ✅ |
| Blender | 5.2.0 LTS ✅ — exportador Collada presente (verificado headless) |
| Python | 3.8.10; `numpy` 1.24.4 ✅; `requests` 2.32.4 ✅ |
| `rosbag`, `catkin_make` | ✅ |
| `check_urdf` | ❌ ausente (`liburdfdom-tools`) — instalar na rodada de implementação |
| `jsonschema` (Python) | ❌ ausente — instalar na rodada de implementação |
| Node 22 / Docker 28 / Compose v2 | ✅ (contexto full-stack) |

Fatos do OpenAPI público 2.4.7 (44 rotas), verificados na fonte:

- `POST /v1/telemetry-cycles`: corpo `{telemetryCycleData*, configuration*}`; `telemetryCycleData` com **`additionalProperties: false`** e required `measuringSystemUniqueIdentifier`, `measuringSystemModel {name*, version*: number}`, `tags*[]`, `measurements*[]`, `metadata*{}`; cada measurement exige `resourceId` (padrão `^[0-9a-fA-F]{24}$`), `attributes {physicalQuantity*, additionalProperties: true}` e `dataPoints[≥1] {timestamp*: date-time, value*: number|boolean}`.
- `GET /v1/telemetry/metric-descriptor`: resposta com `metricDescriptorId`, `resourceId`, `displayName` multilíngue, `attributes {axis, physicalQuantity}`, `unit` — todos required.
- `GET /v1beta/telemetry/data-points/raw`: `metricDescriptorId, resourceId, fromTime, toTime, insertedFromTime, insertedToTime, limit, pageToken` (opcionais); `GET /v1/telemetry/data-points/aggregation`: `metricDescriptorId*, fromTime*, toTime*`.
- `POST /v1/measuring-systems`: `resourcesAttributes*[] {model{name*, version*: int}, tree{parentId*: 24-hex|null}}`.
- `POST /v1/configuration-slots`: o array `required` exige `monitoringLocationMap`, mas a única propriedade declarada é `monitoringLocationMapSchema` — inconsistência da spec, tratada na seção 12.

## 3. Escopo e fora de escopo

**MVP**
- Mesh trapezoidal original ~35 mm, variantes azul e laranja, eixos X/Y/Z indicados por geometria.
- Exportação DAE compatível com Gazebo 11; colisão por box.
- Macro Xacro reutilizável e multi-instância.
- Bancada P-101 por primitivas com RPM controlável; sensor fixado ao mancal não rotativo.
- Gerador determinístico de sinal (normal + desbalanceamento 1× RPM).
- Dois ROS bags LZ4 de 45 s com replay sem Gazebo.
- Gateway com validação de schema e persistência idempotente na API local/PostgreSQL.
- Documentação com limitações declaradas e evidências.

**Fora do MVP**
- Banda integral do HF+ (simulação de banda completa exigiria fs ≥ 32768 Hz).
- Plugin Gazebo compilado (C++).
- BLE, firmware, protocolos privados, credenciais.
- Chamadas à API produtiva da Dynamox.
- Compatibilidade com workspace produtivo (exige Resource Model).
- ROS 2 / Gazebo Harmonic.
- `ConditionTelemetry.msg` customizada (registrada como melhoria P1).
- Logotipo, marca, textura ou desenho industrial da Dynamox.

## 4. Decisões confirmadas

1. Stack congelada: Noetic + Gazebo 11 + Blender/DAE + rospy + rosbag LZ4.
2. Duas camadas de contrato (SCP-04): snapshot OpenAPI somente leitura + JSON Schema interno como fronteira compartilhada entre simulador, backend e testes.
3. Contrato ROS canônico por **mensagens tipadas**; JSON existe apenas na borda REST, construído e validado pelo gateway.
4. Colisão por box; dois DAEs (azul/laranja); sem texturas de imagem.
5. Bags canônicos por escrita programática offline (`rosbag.Bag`), com reprodutibilidade **semântica** garantida e hash de arquivo apenas como proveniência.
6. Fonte única de relógio: bags não armazenam `/clock`; no replay, `use_sim_time` + `rosbag play --clock`.
7. Gateway restrito a `localhost/127.0.0.1`; recusa fatal a `*.dynamox.solutions`; zero credenciais.
8. Sinais rotulados como sintéticos/didáticos; posicionamento de propriedade intelectual do cabeçalho; nome interno neutro `industrial_condition_sensor`.
9. Sensor no mancal **não rotativo**; perfil HF+ coerente com máquina `Pump` (regra TcAg/TcAs do desafio).
10. Somente Diogo executa staging, commit, push e abertura de PR.

## 5. Questões em aberto (com recomendação)

| # | Questão | Recomendação |
|---|---|---|
| Q1 | Endpoint de ingestão local (TS-06 ainda indefinido) | `POST /api/telemetry-cycles` aceitando o contrato interno verbatim + suporte a `Idempotency-Key`; revisar quando TS-06 existir |
| Q2 | Bags no PR? | Não versionar bags inicialmente; só metadados + script determinístico de regeneração; sem Git LFS |
| Q3 | Faixa de RPM do MVP | 900–3600 rpm; com Imu a 256 Hz, o 2× a 3600 rpm (120 Hz) fica sob Nyquist (128 Hz) |
| Q4 | IDs 24-hex ↔ seed do app | Seed Prisma e `gateway.yaml` derivam os mesmos IDs (SHA-256 truncado) das mesmas entradas |
| Q5 | `simulation/` no grafo Nx? | Fora do Nx; opcional: scripts npm na raiz com shell-out |

## 6. Arquitetura proposta

```
[scenarios.yaml + sensor_profiles.yaml + rosparams(seed, rpm, load)]
        │
        ▼
  Gazebo 11 ── pump_p101 (primitivas; JointVelocityController p/ RPM)
        │  /joint_states  /tf(/tf_static)  /clock
        ▼
  telemetry_node.py  ─ nó rospy determinístico; TAMBÉM roda standalone sem Gazebo
        │  /sensors/hf_001/imu (Imu, 256 Hz)   /sensors/hf_001/temperature (1 Hz)
        │  /sensors/hf_001/scenario (String: nome simples)   /pump_p101/rpm (Float64)
        ├──────────────► rosbag (canônico: escrita offline, sem /clock; demo: record ao vivo)
        ▼                                    │ use_sim_time=true + rosbag play --clock (sem Gazebo)
  ros_to_rest_gateway.py ◄──────────────────┘
        │  janela 10 s → métricas por eixo → JSON do contrato interno
        │  validação jsonschema ↔ contracts/dynamox/telemetry-cycle.schema.json
        ▼  POST + Idempotency-Key (somente API local)
  API local (Node) ──► PostgreSQL (unique/upsert) ──► frontend (gráfico)
```

Fronteiras: modelo visual, descrição robótica, geração de sinal, integração física e gateway são artefatos independentes; o único ponto de contato entre ROS e o backend é HTTP no gateway. O produto principal não depende de nenhum componente ROS.

## 7. Árvore de artefatos

```
contracts/dynamox/                        # DEPENDÊNCIA (SCP-04) — ausente; não inventar
├── README.md                             # fonte/data/hash do snapshot + registro da decisão
│                                         #   monitoringLocationMap (canônico) vs …MapSchema (alias/inconsistência)
├── dynamox-public-api.openapi.json
├── telemetry-cycle.schema.json
└── examples/telemetry-cycle.example.json
docs/planning/BON-06_SENSOR_TWIN_IMPLEMENTATION_PLAN.md    # (este documento)
simulation/
├── ros1_ws/src/
│   ├── industrial_condition_sensor_description/   # meshes/ urdf/ launch/ worlds/ config/ rviz/
│   ├── industrial_condition_sensor_sim/           # scripts/(telemetry_node.py, write_reference_bags.py)
│   │                                              # src/(signal_generator.py — módulo puro) test/
│   └── industrial_condition_sensor_gateway/       # scripts/(ros_to_rest_gateway.py)
│                                                  # src/(window_aggregator.py, payload_builder.py, api_client.py — puros)
│                                                  # config/(gateway.yaml) test/
├── bags/metadata/*.yaml  +  bags/README.md        # params, seed, contagens, content-hash, sha256, rosbag info
├── docs/ (ARCHITECTURE, BLENDER_BRIEF, ROS_TOPIC_CONTRACT, API_METADATA_MAPPING, ROSBAG_EVIDENCE_PLAN)
├── out/                                           # .gitignore: bags gerados, ciclos spooled
└── Makefile                                       # build|demo|bags|replay|validate|clean
```

Racional: três pacotes catkin — descrição sem dependência de código; sim depende só de `rospy`+`numpy`; gateway depende de `requests`+`jsonschema` e de rede. Menor acoplamento e replay bag→gateway sem o pacote de simulação.

## 8. Pipeline Blender → DAE → Xacro → Gazebo

- Cena em **metros** (unit scale 1.0); envelope 0,035 m; tronco de pirâmide + base de fixação; bevel discreto; orçamento **≤ 2.000 triângulos** (esperado < 600).
- Origem no **centro da base de fixação** (plano Z=0); +Z = normal de montagem; +X = eixo axial do sensor. Blender e ROS são Z-up destros e o Collada grava `Z_UP` ⇒ sem rotação de correção no Xacro (validar na primeira carga).
- Materiais sólidos azul e laranja (Principled BSDF difuso), **sem texturas de imagem** — elimina por construção o risco de textura ausente. Eixos X/Y/Z indicados por geometria extrudada. **Sem logotipo, sem cópia de textura ou desenho industrial.**
- Objetos nomeados (`sensor_body`, `sensor_base`, `axis_marker_x|y|z`), unidos num único mesh `industrial_condition_sensor` para exportação.
- Antes de exportar: aplicar transforms, recalcular normais, remover doubles.
- Exportar `industrial_sensor_blue.dae` e `industrial_sensor_orange.dae` (Collada presente no Blender 5.2 — verificado; fallback documentado: OBJ+MTL, suportado pelo Gazebo 11).
- Validação: reimportação headless no Blender; carga em `gzserver --verbose` exigindo zero warnings de material/mesh; escala conferida contra um box de 35 mm.
- Capturas: frontal, lateral, inferior (base + origem) e instalada na bomba.
- Cadeia de descrição: `xacro` → URDF → `check_urdf` → spawn no Gazebo 11 → RViz.

Contrato da macro Xacro — parâmetros mínimos: `name`, `parent`, `xyz`, `rpy`, `color` (blue|orange → seleciona o DAE), `sensor_profile` (hf_plus|tcag|tcas — afeta apenas metadados/tópicos), `topic_namespace` (default `sensors/${name}`). Gera: link `${name}_link` com visual (DAE), colisão box 0,035³ m, inércia válida (m = 0,030 kg; diagonal de box ≈ 6,1e-6 kg·m²), fixed joint `${name}_mount_joint` ao `parent`, frame próprio, nomes totalmente prefixados por `${name}` (multi-instância segura).

## 9. Cena da bomba P-101

```
world ─(fixed)─ base_plate ─(fixed)─ motor_housing ─(continuous, eixo +X)─ shaft ─(fixed)─ coupling
   base_plate ─(fixed)─ pump_casing ─(fixed)─ bearing_housing ─(fixed: macro do sensor)─ hf_001_link
```

- Rotação em +X; Z para cima. Único mesh detalhado é o sensor; todo o resto por primitivas.
- RPM via `gazebo_ros_control` + `velocity_controllers/JointVelocityController`; nó utilitário converte `/pump_p101/rpm` (rpm) → comando em rad/s (ω = 2π·rpm/60). RPM inicial 1750; faixa 900–3600; junta contínua sem limites de posição.
- Sensor no topo do `bearing_housing` (`xyz ≈ [0, 0, +r]`, `rpy = [0, 0, 0]`; Z do sensor = radial vertical; X = axial ao eixo).
- Parâmetros ajustáveis por args de launch/xacro: rpm inicial, cor do sensor, pose do sensor, dimensões do mancal.

**Teste de montagem**: com o eixo a 1750 rpm,
1. o rotor apresenta **transformação variável** — posição do `shaft_joint` crescendo em `/joint_states` e TF do link rotativo mudando entre amostras;
2. a **transformação completa** `world → hf_001_link` — **posição e orientação** — permanece constante dentro de tolerância definida (‖Δtranslação‖ ≤ 1e-4 m e Δângulo ≤ 1e-3 rad ao longo da janela de amostragem), verificada por script com `tf2`;
3. inspeção visual no Gazebo/RViz confirma que o frame do sensor não acompanha a rotação do eixo.

## 10. Contrato ROS (canônico tipado)

| Tópico | Tipo | Taxa | Unidade / Frame / Observação |
|---|---|---|---|
| `/clock` | `rosgraph_msgs/Clock` | 50 Hz | produtor: Gazebo (ao vivo) **ou** `rosbag play --clock` (replay); **nunca gravado nos bags** |
| `/tf` | `tf2_msgs/TFMessage` | 10 Hz | — |
| `/tf_static` | `tf2_msgs/TFMessage` | latched | — |
| `/joint_states` | `sensor_msgs/JointState` | 50 Hz | rad, rad/s |
| `/pump_p101/rpm` | `std_msgs/Float64` | 1 Hz | rpm |
| `/sensors/hf_001/imu` | `sensor_msgs/Imu` | 256 Hz | **m/s²** (REP-103), frame `hf_001_link` |
| `/sensors/hf_001/temperature` | `sensor_msgs/Temperature` | 1 Hz | °C, frame `hf_001_link` |
| `/sensors/hf_001/scenario` | `std_msgs/String` (latched) | on-change | **nome simples**: `normal` \| `imbalance` |

Preenchimento do `Imu`:
- orientação = quaternion identidade com `orientation_covariance[0] = -1` (orientação não produzida);
- velocidade angular zerada com `angular_velocity_covariance[0] = -1` (não medida);
- `linear_acceleration` = sinal sintetizado com `linear_acceleration_covariance` = diagonal σ² do ruído do gerador (valor conhecido) — a aceleração linear é a grandeza simulada e **não** é marcada como inexistente;
- unidade ROS: m/s²; conversão para g **somente** no gateway/agregador.

Parâmetros de execução (seed, load, duration, profile): rosparams do launch, espelhados em `gateway.yaml` e nos metadados do bag; no replay, o launch de ingestão carrega o YAML de metadados do bag para restaurar o mesmo contexto.

`ConditionTelemetry.msg` — melhoria **P1**, não requisito do primeiro fluxo. Schema candidato registrado: `Header header; string sensor_id; string profile; string scenario; uint32 seed; float64 rpm; float64 window_start; float64 window_end; float64[3] accel_rms_g; float64[3] accel_peak_g; float64[3] accel_crest; float64[3] amp_1x_g; float64 temperature_c`. Só entra se surgir consumidor ROS nativo que exija introspecção tipada; o custo é geração catkin, acoplamento dos consumidores de bag ao pacote e porte futuro a ROS 2.

## 11. Geração determinística de sinais

Parâmetros: `sensor_id, sensor_profile, rpm, load_percent, scenario, seed, duration, publish_rate, t0`. RNG: `numpy.random.default_rng(hash64(sensor_id, scenario, seed))`.

**Banda simulada** — síntese interna a fs = 4096 Hz (Nyquist 2048 Hz), janelas de 1 s, representando **somente** componentes de baixa frequência: 1× RPM, 2× RPM, ruído e tendência térmica.

> **Limitação declarada**: o simulador **não representa a banda integral** do sensor HF+ (~13 kHz) **nem substitui o comportamento físico do sensor real**. Trata-se de telemetria sintética/didática para validar contrato, reprodução e integração. Simulação de banda completa (fs ≥ 32768 Hz) está fora do MVP.

Publicação Imu por decimação exata 4096→256 Hz (÷16); ruído sintetizado **band-limited < 100 Hz** para não haver aliasing na decimação.

**Cenário normal** (aceleração em g; f0 = rpm/60; ω = 2πf0):
- eixos radiais (Y tangencial, Z radial): `a(t) = 0.02·sin(ωt+φ) + 0.01·sin(2ωt) + n(t)`, ruído σ = 0.006 g;
- eixo axial (X): mesmo formato com amplitudes ×0.4;
- temperatura: `T(t) = 25 + 18·(load/100)·(1 − e^(−t/300))` °C (τ = 300 s; faixa pública −10…105 °C).

**Cenário desbalanceamento (1× RPM)**:
- força de desbalanceamento ∝ ω² ⇒ `A1x(rpm) = 0.25·(rpm/1750)²` g nos eixos radiais, defasagem de 90° entre Y e Z (vetor girante); axial ~0.03 g;
- progressão opcional na janela: `A(t) = A1x·(1 + 0.3·t/T)`;
- temperatura: normal + `3·(1 − e^(−t/300))` °C.

**Métricas por janela/eixo** (computadas no **gateway** a partir do stream de 256 Hz): `rms = sqrt(mean(a²))`, `peak = max|a|`, `crest = peak/rms`, `amp_1x = 2·|FFT[k0]|/N` (FFT com resolução 0,1 Hz na janela de 10 s). Separação exigida: `rms_imbalance ≥ 2×rms_normal` nos radiais e pico espectral em f0.

## 12. Metadados e mapeamento com a API

| Entidade pública | No gêmeo | No app local |
|---|---|---|
| Measuring System | sensor virtual `SIM-HF-001` (`measuringSystemUniqueIdentifier`) | registro Sensor (id único, modelo HF+) |
| Measuring System Model | `{name: "industrial-condition-sensor-sim", version: 1}` | metadado do gerador |
| Configuration Slot | `gateway.yaml` + `scenarios.yaml` (rpm, taxa, eixos, cenário, seed, associação) | configuração do ponto |
| Monitoring Location | `bearing_housing` da P-101 | MonitoringPoint "Mancal LA — P-101" |
| Metric Descriptor | por métrica: `displayName {pt,en}`, `attributes {axis, physicalQuantity}`, `unit` (g, °C) | catálogo de métricas |
| Telemetry Cycle | lote de janelas (simulação ou replay) | ingestão em lote |
| Data Point | `{timestamp ISO-8601 UTC, value}` | linha da série temporal |

**IDs determinísticos**: `resourceId` = `sha256(namespace|entidade|seed)` truncado a **24 caracteres hexadecimais minúsculos** — identificador **interno** determinístico compatível com o padrão `^[0-9a-fA-F]{24}$`, **não** um ObjectId oficial fornecido pela Dynamox. Mesma entrada ⇒ mesmo identificador; usado igualmente no seed Prisma e no `gateway.yaml`.

**Configuration Slot — decisão de contrato**: o campo canônico do domínio interno é **`monitoringLocationMap`** (array `{mapLabel, mapValue: 24-hex|null}`). O OpenAPI 2.4.7 declara a propriedade como `monitoringLocationMapSchema` embora o `required` exija `monitoringLocationMap` — registrado como **inconsistência/alias da spec pública**, não como fonte de verdade do nosso domínio. A decisão fica documentada em `contracts/dynamox/README.md` e `simulation/docs/API_METADATA_MAPPING.md`, e coberta pelos testes de contrato (pytest/jsonschema e ajv). Sem promessa de compatibilidade produtiva (exigiria o Resource Model correspondente).

**Payload**: uma medição escalar por (eixo × grandeza) com `attributes.axis`/`attributes.physicalQuantity`; `configuration` = `{rpm, load_percent, scenario, seed, duration, publish_rate}`; `metadata` = `{origin: simulation|rosbag-replay, generator, profile, cycleId}` (cópia de rastreabilidade da chave de idempotência); `tags` = `["simulated", "pump-p101", "hf-plus", "scenario:<id>"]`.

Endpoints públicos usados **somente como referência de leitura**: `POST /v1/measuring-systems`, `POST /v1/configuration-slots`, `POST /v1/telemetry-cycles`, `GET /v1/telemetry/metric-descriptor`, `GET /v1beta/telemetry/data-points/raw`, `GET /v1/telemetry/data-points/aggregation`.

## 13. Plano de ROS bag

- `pump_p101_normal.bag` e `pump_p101_imbalance.bag`; 45 s cada; compressão LZ4; tópicos explícitos = os **7** da tabela da seção 10 **exceto `/clock`**.
- **Fonte única de relógio**: os bags canônicos não armazenam `/clock`; durante o replay ele é produzido pelo próprio `rosbag play --clock` (com `use_sim_time=true`). É **proibido** combinar `/clock` gravado no bag com `rosbag play --clock` (duas fontes de relógio simultâneas).
- **Reprodutibilidade em dois níveis**:
  1. **Determinismo semântico (obrigatório)** — mesmos timestamps, mensagens decodificadas, amostras e métricas; verificado por script que extrai (tópico, stamp, campos) → JSON canônico → **content-hash normalizado**, registrado no metadado.
  2. **SHA-256 do arquivo `.bag`** — apenas proveniência quando gerado no ambiente fixado; pode variar entre versões de ROS, bibliotecas ou compressão.
- Bags canônicos por escrita programática offline (`write_reference_bags.py`, API `rosbag.Bag`, sem roscore); `rosbag record` ao vivo somente para evidência visual com Gazebo.
- **Volumetria prevista (45 s, sem `/clock` gravado)**: imu 11 520; joint_states 2 250; tf ~450 + tf_static 1; temperatura 45; rpm 45; scenario 1–2 ⇒ **~14,3 mil mensagens**, **~1–3 MB com LZ4**. Teto: **25 MB/bag**.
- Metadados versionados por bag (`bags/metadata/*.yaml`): parâmetros, seed, duração, contagem por tópico, content-hash, sha256 do arquivo, comando gerador, saída de `rosbag info`, e registro explícito de que `/clock` **não** está no bag e o replay exige `use_sim_time=true`.
- Política Git: bags **não versionados inicialmente**; regeneração determinística via `make bags`; sem Git LFS. Alternativa registrada: um bag demo ≤ 5 MB pode ser anexado a uma release do fork (não ao PR).
- Comandos:
  ```bash
  # gravação de evidência (ao vivo, com Gazebo):
  rosbag record -O out/pump_p101_normal.bag --lz4 \
    /tf /tf_static /joint_states /pump_p101/rpm \
    /sensors/hf_001/imu /sensors/hf_001/temperature /sensors/hf_001/scenario
  # inspeção:
  rosbag info out/pump_p101_normal.bag
  # replay (sem Gazebo; /clock produzido pelo próprio play):
  rosparam set /use_sim_time true && rosbag play --clock out/pump_p101_imbalance.bag
  ```

## 14. Integração full-stack e persistência no PostgreSQL

Fluxo do gateway: assina os tópicos **tipados** (Imu, Temperature, Float64, String-cenário) → agrega janelas de 10 s → converte m/s² → g → computa métricas por eixo → monta o JSON do contrato interno → **valida com `jsonschema` antes de qualquer rede** → POST somente à API local → persistência idempotente no PostgreSQL → série recuperada pelos endpoints do app → gráfico no frontend.

- **Fronteira**: ROS termina no gateway; o backend não conhece ROS.
- **Idempotência**: header **`Idempotency-Key: sha256(sensor_id|scenario|seed|window_start|window_end)`**; cópia opcional em `telemetryCycleData.metadata.cycleId`; **nenhum campo novo no topo do payload** (o schema público usa `additionalProperties: false`). Backend local: constraint única sobre a chave (ou upsert) ⇒ replay do mesmo ciclo **não duplica** dados (verificado por teste que reproduz o mesmo bag duas vezes e confere a contagem).
- **Retry**: backoff exponencial 1/2/4 s (3 tentativas); falha ⇒ spool em `simulation/out/failed-cycles/*.json` + log estruturado; reenvio manual documentado.
- **Timestamps**: header/bag time → ISO 8601 UTC com milissegundos (o replay preserva os tempos originais do bag).
- **Anti-produção**: URL base somente de `gateway.yaml`/env; allowlist `{localhost, 127.0.0.1}`; recusa fatal a `*.dynamox.solutions` antes de qualquer chamada; zero credenciais.
- **Logs**: linhas estruturadas (ciclo, janelas, resultado da validação, status HTTP, latência).

## 15. Matriz de testes

| Camada | Teste | Critério |
|---|---|---|
| Unidade | determinismo do gerador (módulo puro, sem ROS) | mesma seed ⇒ arrays idênticos |
| Unidade | unidades/faixas | m/s²↔g corretos; T ∈ −10…105 °C; covariâncias conforme seção 10 |
| Unidade | separação de cenários | rms_imb ≥ 2×rms_norm; pico FFT em f0 |
| Unidade | window_aggregator/payload_builder | campos obrigatórios; 24-hex; ISO-8601; Idempotency-Key estável |
| Contrato | payload × schema (pytest/jsonschema **e** ajv) | exemplo e payloads gerados validam nas duas stacks; mapeamento `monitoringLocationMap` coberto |
| Contrato | guarda de URL | host produtivo ⇒ exceção antes da rede |
| Descrição | `xacro` + `check_urdf` | expande sem erro; URDF válido; sem link órfão |
| Gazebo | smoke headless (gzserver) | spawn ok; `rostopic hz` dentro de ±10% |
| Gazebo | montagem | rotor com transformação variável; transformação **completa** `world→hf_001_link` (posição e orientação) constante dentro de ‖Δt‖ ≤ 1e-4 m e Δθ ≤ 1e-3 rad |
| Bag | conteúdo + determinismo semântico | tópicos/contagens/duração; content-hash idêntico ao metadado |
| Replay e2e | bag→gateway→API→PG→frontend, sem Gazebo | ciclo persistido; gráfico exibe a série |
| Idempotência | replay duplo do mesmo bag | contagem no PostgreSQL inalterada na 2ª passada |

## 16. Ordem das tarefas, estimativas e caminho crítico

| Tarefa | Descrição | Dependências | Est. | Critério de aceite |
|---|---|---|---|---|
| BON-06.1 | Congelar contrato e mapeamento ROS→REST | SCP-04 no repo | 2 h | tabela de mapeamento + YAMLs de perfis/cenários + decisão `monitoringLocationMap` registrada |
| BON-06.2 | Modelar mesh trapezoidal no Blender | 06.1 (naming) | 2 h | .blend + 2 DAEs ≤ 2k tris, sem warnings no gzserver; capturas |
| BON-06.3 | URDF/Xacro e variantes azul/laranja | 06.2 | 2 h | macro parametrizada; `check_urdf` ok; spawn ok; multi-instância |
| BON-06.4 | Gerador determinístico de sinal | 06.1 | 3 h | testes de determinismo/unidades passam; roda standalone |
| BON-06.5 | Bomba P-101 + montagem do sensor no mancal | 06.3 | 3 h | launch sobe Gazebo+RViz; RPM controlável; teste de montagem passa |
| BON-06.6 | Cenários normal e desbalanceamento | 06.4 | 1 h | separação mensurável (rms ≥ 2×; pico em f0) |
| BON-06.7 | Gerar e validar ROS bags | 06.6 | 2 h | 2 bags 45 s LZ4 sem `/clock`; metadados + content-hash; replay ok |
| BON-06.8 | Gateway ROS→REST local | 06.1, 06.6 | 3 h | payload valida no schema; guarda anti-produção testada |
| BON-06.9 | Persistência idempotente no PostgreSQL | 06.8, TS-06 | 2 h | Idempotency-Key + unique/upsert; replay duplo sem duplicar |
| BON-06.10 | Replay ponta a ponta | 06.7, 06.9 | 1 h | bag→gateway→API→PG→gráfico, sem Gazebo |
| BON-06.11 | Documentar execução, limitações e evidências | tudo | 2 h | README + disclaimers + capturas + comandos reproduzíveis |

- **Total: 23 h** (acima das 16 h nominais do board; a diferença vem do detalhamento e dos testes de idempotência/montagem).
- **Caminho crítico**: SCP-04 → 06.1 → 06.4 → 06.6 → 06.7/06.8 → 06.9 → 06.10. O ramo visual (06.2 → 06.3 → 06.5) é paralelizável.
- **Menor MVP convincente** (se o prazo apertar): 06.1 + 06.4 + 06.6 + 06.7 + 06.8 + 06.9 + 06.10 = **14 h, sem Blender/Gazebo** — nó standalone + bags + gateway + gráfico. A cena 3D é camada de apresentação, não o núcleo da evidência.
- **Gate**: implementação bloqueada enquanto a fundação P0 da aplicação e os artefatos SCP-04 não existirem no repositório (hoje, ambos ausentes).

## 17. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Fidelidade física questionada | disclaimer de banda (seção 11) + rótulo sintético/didático em README, metadata e tags |
| Stack Noetic/Gazebo 11 fora de suporte | ambiente congelado; interfaces finas (YAML/JSON) para porte ROS 2 futuro |
| Collada removido em Blender futuro | presente no 5.2 (verificado); fallback OBJ+MTL |
| Duplicação de dados no replay | Idempotency-Key + unique/upsert + teste de replay duplo |
| Bags incham o PR | política sem bags no git + regeneração determinística; sem LFS |
| TS-06 inexistente | gateway com modo validate+spool funciona sem API |
| Envio acidental à produção | allowlist + recusa fatal por código + zero credenciais |
| Desvio de escopo P2 vs P0 | gate explícito + timebox de 2 dias + menor MVP definido |
| Questões de propriedade intelectual | posicionamento do cabeçalho; geometria aproximada; sem logotipo/textura copiada |

## 18. Critérios de aceite, comandos de validação, rollback e checklist

**Verificáveis do planejamento**: reprodução determinística por seed; diferença mensurável normal×desbalanceamento; montagem rígida comprovada (transformação completa com tolerância); replay sem Gazebo; JSON validado pelo schema interno; nenhuma chamada produtiva; persistência sem duplicação; aplicação principal executável sem ROS/Gazebo; limitações físicas declaradas honestamente; rollback documentado.

**Comandos previstos** (rodada de implementação, após aprovação para instalar `liburdfdom-tools` e `python3-jsonschema`):

```bash
cd simulation/ros1_ws && catkin_make && source devel/setup.bash
xacro src/industrial_condition_sensor_description/urdf/pump_p101.xacro > /tmp/p101.urdf && check_urdf /tmp/p101.urdf
roslaunch industrial_condition_sensor_description pump_p101_sensor_demo.launch
rostopic hz /sensors/hf_001/imu
python3 -m pytest simulation/ros1_ws/src/*/test/
rosrun industrial_condition_sensor_sim write_reference_bags.py && rosbag info simulation/out/*.bag
rosparam set /use_sim_time true && rosbag play --clock simulation/out/pump_p101_imbalance.bag   # + launch do gateway (sem Gazebo)
```

**Rollback/limpeza (restrito a artefatos do BON-06)**:
- `make clean` remove apenas `simulation/out/`, `simulation/ros1_ws/devel/`, `simulation/ros1_ws/build/`.
- Dados simulados no PostgreSQL removidos por script que filtra **exclusivamente** por `tags:"simulated"` e pelos IDs determinísticos (SHA-256/24-hex) do gêmeo.
- Reversão total do BON-06 = remover somente `simulation/` e `docs/planning/BON-06_SENSOR_TWIN_IMPLEMENTATION_PLAN.md`.
- **Nunca remover** `contracts/dynamox/` (pertence ao SCP-04, dependência compartilhada com backend/testes), arquivos do upstream ou quaisquer dados que não pertençam à simulação.

**Checklist de início da implementação**:
- [ ] Plano aprovado e documento commitado por Diogo.
- [ ] Fundação P0 da aplicação estável (hoje: não iniciada).
- [ ] SCP-04 executado: os 4 artefatos presentes em `contracts/dynamox/`.
- [ ] TS-06 definiu o endpoint local de ingestão com suporte a `Idempotency-Key`.
- [ ] `liburdfdom-tools` e `python3-jsonschema` instalados (com aprovação prévia).
- [ ] Board Notion ajustado por Diogo (prioridades/status; tarefas 06.1–06.11).

## 19. User Story pronta para o Notion

> **Título**: BON-06 — Gêmeo digital experimental de sensor de condição (ROS Noetic + Gazebo 11)
>
> **História**: Como analista de manutenção industrial, quero acoplar um sensor virtual de condição a uma bomba centrífuga simulada e reproduzir seus dados por ROS bag, para validar a cadeia máquina → ponto → sensor → telemetria → API → PostgreSQL sem hardware físico.
>
> **Problema**: o fluxo de séries temporais do desafio carece de uma fonte de dados realista, reproduzível e auditável; dados manuais não demonstram o domínio industrial nem permitem replay determinístico.
>
> **Valor**: para a Dynamox, demonstra compreensão do domínio (condição de ativos, telemetria, contratos públicos) além do CRUD; para a 42 Robotics, cria um ativo reutilizável de simulação e integração ROS→REST.
>
> **Escopo MVP**: mesh original ~35 mm (azul/laranja); Xacro reutilizável; bancada P-101 por primitivas com RPM controlável; gerador determinístico (fs interna 4096 Hz — apenas baixa frequência: 1×, 2×, ruído, tendência); cenários normal e desbalanceamento; 2 bags LZ4 de 45 s sem `/clock` com replay sem Gazebo; gateway tipado→JSON validado→API local→PostgreSQL idempotente.
>
> **Fora de escopo**: banda integral do HF+ (fs ≥ 32768 Hz); plugin Gazebo C++; BLE/firmware/protocolo privado; API produtiva; compatibilidade com workspace real; ROS 2.
>
> **Dependências**: P0 estável; SCP-04 versionado em `contracts/dynamox/`; TS-06 (endpoint de ingestão local).
>
> **Critérios de aceite (Given/When/Then)**:
> - Dado o gerador com a mesma seed e parâmetros, quando executado duas vezes, então as amostras e métricas são idênticas.
> - Dado o cenário desbalanceamento à mesma RPM/seed, quando comparado ao normal, então o RMS radial é ≥ 2× e o pico espectral está em 1× RPM.
> - Dado o eixo girando a 1750 rpm, quando observo as transformações via TF, então o rotor apresenta transformação variável e a transformação completa `world→sensor` (posição e orientação) permanece constante dentro da tolerância definida (montagem rígida no mancal).
> - Dado um bag gravado (sem `/clock`), quando reproduzido com `use_sim_time=true` e `rosbag play --clock` sem Gazebo, então o gateway gera payloads válidos contra o schema interno.
> - Dado o mesmo bag reproduzido duas vezes, quando os ciclos chegam à API local, então nenhum dado é duplicado no PostgreSQL (Idempotency-Key).
> - Dado o gateway configurado, quando a URL de destino não é local, então a execução falha antes de qualquer chamada de rede.
>
> **Definition of Done**: tarefas 06.1–06.11 concluídas; testes da matriz verdes; evidências capturadas (Gazebo, RViz, gráfico via replay); README com limitações e disclaimer de banda; nenhum bag versionado; board atualizado por Diogo.
>
> **Riscos**: fidelidade física (mitigada por disclaimer), stack EOL (interfaces finas p/ ROS 2), duplicação no replay (idempotência testada), propriedade intelectual (geometria aproximada, sem logotipo), desvio de escopo (gate P0 + menor MVP de 14 h).
>
> **Evidências esperadas**: capturas do sensor (frontal/lateral/inferior/instalado), `rosbag info` + metadados com content-hash, log de validação do schema, consulta SQL do ciclo persistido, gráfico no frontend, vídeo curto do replay ponta a ponta.
>
> **Tarefas**: BON-06.1 contrato/mapeamento · 06.2 mesh Blender · 06.3 URDF/Xacro · 06.4 gerador determinístico · 06.5 bomba P-101 + montagem · 06.6 cenários · 06.7 bags · 06.8 gateway · 06.9 persistência idempotente · 06.10 replay e2e · 06.11 documentação/evidências.
