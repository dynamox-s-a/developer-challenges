# ADR-0012 — Analytics contam aquisições pelo ledger de evidência por ciclo

**Status:** Aceito

## Contexto

O enunciado exige latência abaixo de 350 ms em **todas** as requisições. Uma auditoria sobre
todas as rotas (não só as do benchmark original) mostrou, no dataset de 10 M amostras:

- `GET /analytics/heatmap` em 30 dias: ≈ 1,04 s — a atividade por hora varria ~2 M amostras
  da série âncora para dizer quantos sensores reportaram;
- `GET /analytics/machines/:key` em 30 dias: ≈ 360 ms;
- `GET /analytics/series/:id/points` em 30 dias: ≈ 360 ms.

O custo comum das duas últimas era `count(DISTINCT "ingestionCycleId")` sobre centenas de
milhares de amostras — 355 ms sozinho na série de 30 dias, mais que todo o resto da consulta.

A mesma informação — quantas aquisições houve, de que sensor, começando quando — já existe
em `alert_cycle_evidence`: uma linha por ciclo ingerido, com `startedAt`, `endedAt` e
`sensorSerialNumber`, indexada por `(sensorSerialNumber, startedAt)`. É a evidência que o
motor de alertas calcula uma vez por ciclo (ADR-0011). Contar aquisições ali custa ~4 ms
para um sensor em 30 dias; a atividade da frota por hora, ~35 ms.

## Decisão

As consultas analíticas de série (`seriesPointsSql`, `seriesStatsSql`), de janela
(`timeWindowSql`) e o mapa de atividade (`heatmapSql`) contam aquisições pelo ledger de
evidência. As amostras persistidas por bucket do mapa vêm de `ingestion_cycles.sampleCount`,
atribuídas ao bucket em que a aquisição começou.

A fonte é **explícita e decidida no service** (`AnalyticsService.acquisitionSource`): uma
contagem barata diz se o ledger cobre a janela pedida (para o sensor em questão, quando há
um); se cobre, as consultas usam a variante `ledger`; se não, a variante `samples`
(`count(DISTINCT ciclo)`, varredura por amostras) — correta, apenas mais cara.

O ledger só falta em duas situações: dado carregado com `ALERTS_EVALUATE_ON_INGEST=false` e
ainda sem `alerts:backfill`, ou dado inserido fora da API (é o caso das fixtures dos testes
e2e, que exercitam justamente o caminho `samples`).

## Alternativas consideradas

- **Manter `count(DISTINCT)` sempre.** Rejeitada: viola o limite de latência em janelas de
  30 dias, e o custo cresce linearmente com o histórico.
- **Gravar `startedAt`/`endedAt` em `ingestion_cycles`** e contar ali. Seria a fonte mais
  "natural" (aquisição = ciclo), mas exige migração de schema, mudança no caminho de escrita
  e retropreenchimento de 33 mil linhas — e duplicaria o que a evidência já guarda.
  Registrada como evolução possível.
- **Fallback "preguiçoso" no próprio SQL** (`CASE WHEN ledger > 0 THEN ledger ELSE (SELECT
  count(DISTINCT …))`). Rejeitada após medição: uma subconsulta **não correlacionada** dentro
  de `CASE` vira *InitPlan* no Postgres e é executada de qualquer jeito — o custo voltou
  inteiro (230 ms na estatística da série, 420 ms na janela). A decisão precisa acontecer
  antes de o SQL ser montado.
- **Cache de agregados / tabela materializada.** Rejeitada por escopo: introduz invalidação
  e mais uma fonte de verdade para um ganho que o ledger já entrega.

## Consequências

- Heatmap 30 d: 1,04 s → ~105 ms. Resumo do ativo 30 d: ~360 → ~115 ms. Série 30 d/4 h:
  ~360 → ~165 ms. Nenhuma rota do benchmark acima de 350 ms.
- As contagens de aquisição passam a ser **exatas** onde antes eram aproximadas (o mapa
  dividia amostras por 60): 48 aquisições por hora para 12 sensores a cada 15 min.
- Há um acoplamento declarado entre analytics e a existência da evidência do motor. Ele é
  visível (o service escolhe a fonte), tem fallback correto e é coberto pelos e2e sem ledger.
- Caso de borda: uma janela com evidência para alguns ciclos e não para outros contaria só os
  do ledger. Não ocorre nos fluxos suportados (ingestão com motor ligado ou backfill
  completo); registrado como limitação.
- A descrição publicada dos campos `acquisitionCount`/`sampleCount` diz de onde vêm.

## Evidência

- `apps/api/src/analytics/analytics.sql.ts` — `AcquisitionSource`, `seriesPointsSql`,
  `seriesStatsSql`, `timeWindowSql`, `heatmapSql`, `heatmapSamplesSql`.
- `apps/api/src/analytics/analytics.service.ts` — `acquisitionSource`.
- `apps/api/test/analytics.e2e-spec.ts` — fixtures inseridas fora da API: o caminho
  `samples` continua devolvendo as contagens esperadas.
- `tools/measure-latency.ts` — o benchmark oficial passou a cobrir as rotas analíticas em 7 e
  30 dias; `npm run perf:latency` reprova se qualquer máximo atingir 350 ms.
