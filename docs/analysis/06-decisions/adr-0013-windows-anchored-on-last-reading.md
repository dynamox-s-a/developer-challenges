# ADR-0013 — Janelas analíticas ancoradas na última leitura, não no relógio

**Status:** Aceito

## Contexto

A condição de um ponto é avaliada sobre as últimas 24 h da janela pedida (`lookbackMs` da
política): a aquisição sincronizada mais recente é a atual, a anterior é a referência. Toda
página de investigação e o painel pediam janelas terminando em `Date.now()`.

Numa planta que para de transmitir — e uma demonstração congelada é exatamente isso —, a
referência desliza para fora da janela ~24 h depois da última amostra: primeiro a baseline
some e os 12 pontos viram "sem classificação"; mais 24 h e a própria leitura sai do recorte e
tudo vira "sem dados". Nenhum dado novo justificou a mudança; só o relógio andou. O efeito
foi observado na prática: `/machines`, a página da máquina, a do ponto e a home decaíram em
conjunto, sem erro algum.

## Decisão

Duas âncoras, uma por camada, com a mesma semântica — **"últimas 24 h de dado"**:

1. **Servidor.** `AnalyticsService.evaluationWindow` calcula o início da avaliação como
   `max(from, min(to, última aquisição antes de to) − 24 h)` (`anchoredEvaluationFrom`, função
   pura). A última aquisição é a amostra mais recente **com ciclo de ingestão**, obtida por uma
   sonda por série pelo índice `(série, instante)` — uma amostra avulsa (como as 30 do seed
   mínimo, ancoradas no relógio da execução) não move a âncora.
   Vale para a condição da frota, a lista e o resumo de máquinas, o resumo do ponto e a
   tendência curta.
2. **Painel.** As janelas dos períodos (24 h / 7 d / 30 d) do dashboard ancoram na última
   leitura conhecida no resumo das séries (`anchoredRangeForPeriod`), não em `Date.now()`:
   "últimos 7 dias" significa os últimos 7 dias **de dado**.

A **recência** (atual / desatualizado / relógio divergente) continua sendo calculada contra o
relógio real e continua visível: é ela — e o alerta de perda de telemetria — que dizem "não
chega dado há 22 h". A âncora não esconde a ausência; impede que a ausência reescreva a
classificação do que já foi medido.

## Alternativas consideradas

- **Manter o relógio como âncora.** Rejeitada: transforma toda parada em decadência silenciosa
  da classificação e faz a demonstração morrer por si só um dia depois de preparada.
- **Exigir que o cliente envie o fim do dado como `to`.** Rejeitada: espalha para cada
  página a responsabilidade de descobrir o fim do dado antes de qualquer consulta, e não
  protege consumidores da API que enviem `to = agora` de boa-fé.
- **Fixar o `to` da resposta no fim do dado.** Rejeitada: mudaria o eco da janela pedida e a
  semântica de interseção documentada; a âncora só move o início da **avaliação**, o recorte
  pedido continua sendo respeitado.

## Consequências

- Numa operação viva âncora e relógio coincidem: nada muda.
- Numa planta parada a classificação permanece a do último dado — e a ausência é dita pela
  recência e pelos alertas de telemetria, no lugar certo.
- Uma sonda adicional por consulta de condição (≈ 2–5 ms).
- O e2e de janela fixa continua provando a mesma semântica (para janelas que contêm o dado a
  âncora coincide com o `to`).

## Evidência

- `apps/api/src/analytics/analytics.sql.ts` — `anchoredEvaluationFrom`;
  `apps/api/src/analytics/evaluation-window.spec.ts` — tabela de casos (operação viva,
  ingestão parada, relógio divergente, sem dado, janela curta).
- `apps/api/src/analytics/analytics.service.ts` — `evaluationWindow`, `dataEndBefore`.
- `prisma/seed.ts` — as amostras de demonstração não são inseridas numa série que já tem
  aquisições reais (reexecutar o seed depois do histórico continua seguro).
- `apps/web/src/features/dashboard/dashboardSlice.ts` — `anchoredRangeForPeriod`;
  `apps/web/src/components/dashboard/OperationalDashboard.spec.tsx` — a consulta de condição
  vai ancorada no fim do dado e "24 h" continua mostrando dado.
- `tools/demo-verify.ts` — invariante "condição segue classificada com o relógio além do
  dado" (`unclassified = 0` e `noData = 0` com `to = agora`).
