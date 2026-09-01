# ADR-0010 — Histórico sintético pelo mesmo contrato de ingestão, no banco da aplicação

**Status:** Aceito

## Contexto

A próxima fase do produto — analisar dados e modelar tabelas de alertas — precisa de um
mês de telemetria com padrão operacional, degradação lenta, falha de comunicação e falso
positivo rotulados. O banco de demonstração tinha apenas as horas da seed e das fases da
planta. Havia dois caminhos para um volume de ~10 milhões de amostras: injetar por Prisma
(rápido, fora do contrato) ou passar tudo por `POST /telemetry-cycles`. E uma tentação:
isolar o volume num banco à parte para "proteger" o dashboard.

## Decisão

1. **Cada registro do histórico nasce de um `POST /telemetry-cycles` válido** — mesmo Ajv,
   mesma idempotência (chave + fingerprint), mesmos 409/422. O gerador é o próprio sensor
   twin (`buildCycle`) com `baseTimestamp` livre; os extras de proveniência entram só nos
   objetos que o contrato declara abertos (`metadata`, `configuration`, `tags`).
2. **O histórico vive no banco normal da aplicação.** A premissa passa a ser: o sistema
   escala suas consultas para o volume de dados; não se reduz o dataset para compensar
   consultas ineficientes. O dataset grande é usado deliberadamente para expor o que não
   escala, e essa lista vira o backlog imediato da fase seguinte.
3. **Grade temporal absoluta** (múltiplos UTC de 15 min + fase por máquina), com o fim em
   `âncora − 4 h` e o início numa meia-noite UTC; a narrativa é relativa a essa época,
   que é detectada nos dados em reexecuções.
4. **`configuration.scenario` permanece `normal`**; a verdade-terreno (`physicalEvent`,
   `fault`, `expectedState`, `expectedAlert`) vai em `metadata.history`.
5. Nenhuma alteração em contratos, migrações, endpoints, dashboard ou limite de corpo
   nesta etapa; nenhuma otimização prematura.

## Alternativas consideradas

- **Inserção direta por Prisma/COPY.** Rejeitada: pula o contrato, a idempotência e o
  registro em `ingestion_cycles`; o histórico deixaria de ser prova de que a cadeia de
  ingestão suporta o volume. O custo em tempo (minutos, com geração paralela) não justifica.
- **Banco `dynamox_history` separado como mitigação.** Rejeitada como arquitetura: esconde
  os bottlenecks em vez de expô-los e cria dois estados de verdade. Permanece documentado
  apenas como ferramenta opcional de laboratório (comparar consultas A/B).
- **Grade ancorada no bloco de 6 h da demonstração.** Rejeitada: reexecutar em outro bloco
  deslocaria todos os instantes e dobraria o dataset sem colisão alguma.
- **Cenário novo no enum (`degradation`).** Rejeitada: o enum é fechado no contrato e
  fixado por teste; um rótulo não carrega severidade nem expectativa de alerta.
- **Ciclos maiores (várias aquisições por POST).** Rejeitada: o corpo padrão do Express é
  100 KB e o formato de 60 janelas é o mesmo das fases da planta — uma só forma de dado.
- **Corrigir dashboard/backend na mesma entrega.** Adiada por decisão explícita: a tarefa é
  popular corretamente; as otimizações serão guiadas por medições (`EXPLAIN ANALYZE`)
  sobre este dataset.

## Consequências

- Reexecutar o comando é seguro (100 % `duplicate`) e incremental (catch-up de slots novos);
  mudar a narrativa exige purge, e a API avisa com 409.
- O dashboard atual, que baixa amostras brutas em massa, degrada com o mês presente — e
  isso passa a ser **medido e registrado** como baseline, não aceito como estado final.
  Direção obrigatória da próxima fase: agregações server-side, drill-down hierárquico,
  amostras brutas só sob demanda (ver `07-validation/testing-strategy.md`).
- `twin:integration` deve rodar antes da carga ou após purge (o supervisor pagina séries
  inteiras — outro bottleneck exposto).

## Evidência

- `simulation/sensor-twin/src/history/` (`schedule.ts`, `narrative.ts`, `thermal.ts`,
  `seeds.ts`, `driver.ts`, `pool.ts`, `run.ts`) e specs correspondentes.
- `simulation/sensor-twin/src/payload.ts` (`CycleExtras`, `assertExtrasAreAdditive`).
- `simulation/sensor-twin/test/history.integration.spec.ts`.
- `tools/purge-history.ts`; scripts `twin:history`, `history:purge`, `db:reset` em `package.json`.
- `docs/analysis/05-simulation/history-dataset.md` (especificação e baseline medida).
