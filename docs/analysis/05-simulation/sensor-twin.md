# Sensor twin — o produtor sintético

`simulation/sensor-twin/` é uma **frota sintética de sensores de condição** que opera como
*cliente* da aplicação: cria a planta pelas APIs reais, gera telemetria determinística,
ingere pelo endpoint público de telemetria e depois **observa apenas o que ficou
persistido** para priorizar inspeção.

Ele é opcional. O desafio principal roda sem nada disso; o bônus apenas consome a
aplicação — nenhuma linha de `apps/`, `libs/`, `prisma/` ou `contracts/` existe por causa
dele.

> **Vocabulário honesto.** O que existe é um **sensor twin determinístico com frota
> sintética** e uma **sombra digital dos estados simulados persistidos**. Não é um gêmeo
> digital operacional bidirecional: nada volta do banco para um equipamento, porque não há
> equipamento. Os limites completos estão em
> [`simulation-vs-real.md`](./simulation-vs-real.md).

Este documento é a visão de arquitetura. O guia de operação (comandos, saídas esperadas,
demo) é o [`README` do próprio pacote](../../../simulation/sensor-twin/README.md).

## Papéis

```
manifest (plant.ts) ──► bootstrap ──► POST /machines, /monitoring-points, /:id/sensor
        │
        ├──► engine (rng → signal → windows → payload) ──► POST /telemetry-cycles
        │
        ├──► supervisor (assess → deliberate) ◄── GET /time-series, /samples, /metrics
        │
        └──► proveniência (provenance → rosbridge) ──► JSONL ⇄ rosbag ──► replay
```

**Manifest** ([`src/plant.ts`](../../../simulation/sensor-twin/src/plant.ts)) — fonte única
da identidade da planta: 6 ativos rotativos, 12 pontos (dois mancais por máquina), 12
sensores, seeds fixas e as três janelas canônicas de aquisição (baseline, condition,
confirm). A regra do produto (`Pump` só aceita `HF+`) é invariante **validada do próprio
manifest**, com teste — a frota não consegue descrever uma planta que a API recusaria.

**Bootstrap** — cria ou reconcilia a planta pelas rotas reais, autenticado, respeitando os
mesmos `409` que qualquer cliente receberia. Reexecutar não duplica nada.

**Engine** — LCG próprio (reprodutível entre plataformas), síntese a 1024 Hz decimada para
128 Hz, componentes 1× e 2× da rotação nos eixos radiais, ruído banda-limitada e
temperatura de primeira ordem; janelas RMS de 1 s viram os datapoints do ciclo. **Mesma
seed ⇒ mesmo payload ⇒ mesmo `payloadFingerprint`** — a propriedade que faz a idempotência
do backend ser demonstrável em vez de teórica
([`../02-api/telemetry-ingestion.md`](../02-api/telemetry-ingestion.md)).

Cenários: `normal` e `imbalance`. O desbalanceamento é modelado como força radial girante
(reforço no 1×, radiais em quadratura); o eixo axial **não** acompanha o cenário — por
construção e por teste.

**Supervisor** ([`src/assess.ts`](../../../simulation/sensor-twin/src/assess.ts),
[`src/deliberate.ts`](../../../simulation/sensor-twin/src/deliberate.ts)) — estritamente
observacional: login + `GET`. Lê as séries da frota, pareia Y/Z por timestamp, calcula
`radialRms = sqrt((y² + z²)/2)` por janela e ranqueia pela razão
`média(condition) / média(baseline)`. O alvo **emerge dos dados**: o tipo de entrada do
núcleo de decisão nem possui campo de cenário.

## A fronteira que sustenta a demonstração

Um simulador que "descobre" o sensor que ele mesmo alterou não prova nada. Por isso existe
uma separação estanque entre quem **gera** a realidade sintética e quem **observa** o
banco:

- `assess.ts` e `deliberate.ts` não importam nem mencionam a maquinaria de cenário
  (`scenarioForSensor`, `CONFIRM_SEED_OFFSET`, `conditionTarget`, `buildCycle`, o literal
  `imbalance`);
- `boundary.spec.ts` varre o código-fonte desses módulos e falha se qualquer um desses
  termos reaparecer;
- a porta de aquisição confirmatória (`requestConfirmatoryAcquisition`) vive do lado do
  simulador — o supervisor entrega apenas o número de série escolhido.

## Deliberação

`OBSERVE → RANK → DECIDE → ACT → RE-OBSERVE → RECOMMEND`. Acima do limiar, o supervisor não
conclui: ele pede uma **aquisição nova** (janela distinta, realização de ruído
independente, fingerprint próprio — portanto `201`, não repetição), **relê o banco** e só
então transiciona `SUSPECT → CONFIRMED_ATTENTION`.

Duas restrições explícitas, ambas cobertas por teste:

- **`duplicate` é transporte, nunca evidência** — o status HTTP de uma ingestão não pode
  virar argumento sobre a condição da máquina;
- **a recomendação prioriza inspeção e jamais diagnostica falha** — o vocabulário de saída
  é limitado por teste.

O limiar `SYNTHETIC_ATTENTION_RATIO = 2.0` é **didático**, calibrado contra o próprio
gerador para separar os dois cenários sintéticos. Não é threshold industrial.

## Histórico sintético

Além das três fases da demonstração, o twin popula um mês de aquisições para a mesma
frota — `npm run twin:history` — pelo mesmo `POST /telemetry-cycles`, com regime
operacional, eventos rotulados e verdade-terreno em `metadata.history`. A grade é
absoluta e termina antes das janelas da planta, de modo que a demonstração ao vivo e os
testes de integração continuam válidos. Especificação em
[`history-dataset.md`](./history-dataset.md); decisão em
[ADR-0010](../06-decisions/adr-0010-history-through-contract.md).

## O que ele não é

Nunca afirma ser: reprodução do sensor Dynamox real ou da banda completa do HF+;
diagnóstico de rolamento; predição de falha; vida útil remanescente (RUL); threshold
industrial; modelo validado em hardware; gêmeo digital físico completo; caso real de
cliente. Ranking é priorização de inspeção, não diagnóstico.

Registrado como evolução futura, **não implementada**: análise ou forecast clássico de
séries temporais sobre os RMS persistidos. Não existe Fuzzy neste repositório.

## O que as suítes provam aqui

Unitários puros (sem rede, banco ou ROS) cobrem determinismo do gerador (mesma seed, mesmo
payload), pureza das funções de sinal, invariantes do manifest (incluindo a regra Pump ⇒
HF+), matemática do supervisor, transição de estado, formato do payload e a fronteira
supervisor × simulador. Duas suítes dedicadas rodam fora do alvo padrão: integração contra
a API viva (idempotência da frota inteira) e o round-trip ROS
([`ros-integration.md`](./ros-integration.md)). Detalhe em
[`../07-validation/testing-strategy.md`](../07-validation/testing-strategy.md).
