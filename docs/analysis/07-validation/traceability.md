# Rastreabilidade — requisito × código × verificação

A matriz canônica **requisito do enunciado → implementação → teste → evidência → rota** vive
em um lugar só, em inglês, para a avaliação: [`docs/REQUIREMENTS.md`](../../REQUIREMENTS.md).
Este documento não a duplica — mantém apenas a rastreabilidade das **capacidades além do
enunciado**, que não têm linha na matriz do desafio.

Comandos citados estão documentados em [`docs/SETUP.md`](../../SETUP.md); a visão
arquitetural, em [`docs/ARCHITECTURE.md`](../../ARCHITECTURE.md).

## Alertas

| Capacidade | Implementação | Testes | Evidência | Limitações |
|---|---|---|---|---|
| Política de condição única e versionada | `libs/domain/src/condition.ts` (`DEFAULT_CONDITION_POLICY` v1); API e web delegam | `apps/api/src/analytics/condition.spec.ts`, `dashboardAggregations.spec.ts` (fronteiras 1,4999/1,5/1,9999/2,0) | mesmo `3,49×` no painel e na API | condição continua derivada, por decisão ([ADR-0011](../06-decisions/adr-0011-condition-policy-and-alert-occurrences.md)) |
| Janelas analíticas ancoradas na última leitura | `analytics.service.ts` (`evaluationWindow`), `dashboardSlice.ts` (`anchoredRangeForPeriod`) | `evaluation-window.spec.ts`, `OperationalDashboard.spec.tsx` | `npm run demo:verify -- --api` → "condição segue classificada com o relógio além do dado" | recência continua contra o relógio real ([ADR-0013](../06-decisions/adr-0013-windows-anchored-on-last-reading.md)) |
| Contagem de aquisições pelo ledger de evidência | `analytics.sql.ts` (`AcquisitionSource`), `analytics.service.ts` (`acquisitionSource`) | `analytics.e2e-spec.ts` (caminho sem ledger), `npm run perf:latency` | heatmap 30 d ≈ 105 ms | acoplamento declarado à evidência do motor, com fallback ([ADR-0012](../06-decisions/adr-0012-analytics-on-the-cycle-ledger.md)) |
| Alerta como episódio persistido (A1/A2, ciclo de vida, ACK ortogonal) | `prisma/schema.prisma` (`alert_*`), `libs/domain/src/alerts.ts`, `apps/api/src/alerts/core/` | tabelas de casos em `core/*.spec.ts`; `test/alerts.e2e-spec.ts` (abre, escala o MESMO episódio, resolve, ACK, escalada limpa ACK) | `GET /api/alerts/:id` responde regra, evidência, transições | tipo descreve a regra, nunca a causa |
| Baseline aprendida por ponto (192 ciclos, mediana por hora UTC) | `core/baseline.ts`, `alert-engine.ts` (`establishBaseline`) | `baseline.spec.ts`, e2e (`learningCount`) | tabela de baselines em [`alert-validation.md`](./alert-validation.md) | presume máquina sadia no comissionamento; SIM-HF-003 tem janela degradada (fumaça de junho) |
| Idempotência exactly-once e dedup pelo banco | `alert_cycle_evidence` (PK ciclo), `alert_rule_evaluations` (`UNIQUE(cycleId, ruleId, policyVersion)`), `activeKey` única | e2e (reenvio → 0 avaliações; ciclo atrasado → `OUT_OF_ORDER`) | `npm run alerts:backfill` duas vezes → "avaliações novas: 0" | sem P2002 como fluxo de controle |
| Presença: sensor mudo e colapso de frota | `core/presence.ts`, `alert-engine.ts` (`sweepPresence`), timer em `alerts.service.ts` | `presence.spec.ts` (12/12, 1/12, 7/12 escalonados, sensor antigo preservado), e2e com relógio replayado | `FLEET_SILENT` nas paradas de domingo e no trip; `SENSOR_SILENT` em SIM-TCAS-001 | não distingue parada planejada de falha; timer nunca arma sob Jest |
| Motor não lê a verdade-terreno | `apps/api/src/alerts/leakage.spec.ts` (grep de `metadata\|configuration\|groundTruth\|scenario`) | o próprio teste | só `validate.cli.ts` lê o rótulo | — |
| Backfill e validação | `apps/api/src/alerts/backfill.cli.ts`, `validate.cli.ts` | — | `npm run alerts:backfill`, `npm run alerts:validate` → [`alert-validation.md`](./alert-validation.md) | validação depende do rótulo sintético; rodar com a API parada |
| Histórico operacional de alertas para a listagem | `prisma/operational-history.ts` (`npm run alerts:seed-history`) | `tools/demo-verify.ts` (≥ 100 episódios encerrados antes do período rotulado; nenhum ativo) | 195 episódios determinísticos, todos resolvidos | nunca toca o período rotulado; sem ciclo de ingestão associado |
| API de alertas | `apps/api/src/alerts/alerts.controller.ts`, `alerts-query.service.ts` | `test/alerts.e2e-spec.ts` (filtros, busca, interseção `from/to`, 401/403/404/400), `openapi-contract.e2e-spec.ts` | `/api/docs` → tag `alerts` | `from/to` é interseção com o período ativo, documentado |
| UI de alertas | `apps/web/src/pages/alerts/`, `components/alerts/`, seções em máquina/ponto/sensor, KPI e feed da home | `pages/alerts/alerts.spec.tsx`, `OperationalDashboard.spec.tsx` | `/alerts?status=active`, `/alerts/:id`, reconhecer como ADMIN | VIEWER não vê o botão de reconhecer (e a API responde 403) |

## Simulação e demonstração

| Capacidade | Implementação | Testes | Evidência | Limitações |
|---|---|---|---|---|
| Frota sintética / sensor twin | `simulation/sensor-twin/` | unitários + integração + round-trip ROS | `npm run plant -- baseline` | sombra digital de estados simulados; não é gêmeo operacional |
| Histórico sintético de 30 dias pelo contrato | `simulation/sensor-twin/src/history/`, `tools/purge-history.ts` | `src/history/*.spec.ts`, `test/history.integration.spec.ts` | `npm run twin:history -- --dry-run`; reexecução → `duplicate` | dados e limiares didáticos |
| Proveniência ROS | `ros/rosbag_bridge.py`, `src/provenance.ts`, `src/rosbridge.ts` | `test-ros/ros.roundtrip.spec.ts` | `npm run plant -- rosbag` | exige ROS Noetic; opcional; sem Gazebo |
| Demonstração reproduzível | `tools/demo-prepare.ts`, `tools/demo-verify.ts` | os próprios invariantes | `npm run demo:prepare` → `npm run demo:verify -- --api` (29 invariantes) | exige Docker e ~10 min |
| Deploy, balanceamento, teste de carga, previsão, Cypress | **não implementados** | — | — | ver [`docs/REQUIREMENTS.md`](../../REQUIREMENTS.md) → Bonus |
