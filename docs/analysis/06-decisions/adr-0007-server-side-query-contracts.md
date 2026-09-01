# ADR-0007 — Paginação, ordenação, busca e filtros no servidor

**Status:** Aceito

## Contexto

O enunciado pede a tabela de pontos de monitoramento paginada de cinco em cinco e ordenável
pelas quatro colunas exibidas. Depois vieram busca textual e filtros.

Com poucos registros, dá para baixar tudo e resolver no cliente — e a tela funciona. O
problema aparece quando a planta cresce: a paginação vira ilusão, a ordenação diverge da
que o servidor entende e o filtro passa a ser uma promessa que só o navegador conhece.

## Decisão

O servidor resolve o recorte inteiro: `page`, `pageSize`, `sortBy`, `sortDir`, `search`,
`machineType`, `sensorModel`, `hasSensor`. A resposta traz os itens, `total`, `totalPages`
e o **eco** do recorte aplicado.

Regras que acompanham:

- **Parâmetro desconhecido ou valor fora do vocabulário é `400`.** Filtro ignorado em
  silêncio faz o cliente acreditar que filtrou.
- **Ordenação por whitelist**, com os fragmentos SQL vindos de um mapa fechado; o texto de
  busca entra como parâmetro, com curingas do `LIKE` escapados.
- **Ordena-se pelo vocabulário público** (`HF+ < TcAg < TcAs`), não pela ordem interna do
  enum, com desempate estável e `NULLS LAST`.
- **Página e `total` saem do mesmo snapshot** (`RepeatableRead`) e do mesmo `WHERE`.
- **A UI usa 5; a API aceita até 50.** O limite maior existe para consumidores
  programáticos — o próprio dashboard varre o inventário em páginas de 50.

## Alternativas consideradas

- **Baixar tudo e filtrar no cliente.** Rejeitada: não escala, e faria `total`/`totalPages`
  mentirem sobre o que existe.
- **Ignorar parâmetro inválido** (comportamento comum em APIs permissivas). Rejeitada: é
  uma resposta errada com aparência de certa.
- **Ordenar pelo enum do banco.** Rejeitada: a ordem visível na tela é a do rótulo público;
  qualquer outra confunde quem lê.
- **`pageSize` fixo em 5.** Rejeitada: engessaria consumidores legítimos que não são a tela.
- **`ReadCommitted`** nas duas consultas. Rejeitada: cada statement veria um instante
  diferente e o total poderia não corresponder à página sob escrita concorrente.

## Consequências

- O frontend fica sem lógica de filtragem: o slice guarda o recorte e reenvia à API; mudar
  filtro volta para a página 1.
- Filtrar por "condição" **não** é possível hoje, porque a condição é derivada no cliente —
  limite registrado em
  [`../01-dashboard/condition-monitoring.md`](../01-dashboard/condition-monitoring.md).
- A listagem usa `$queryRaw` em vez do `orderBy` do Prisma, com o custo de manter o SQL à
  mão e o cuidado de nunca concatenar entrada do usuário.
- Cada parâmetro precisa de teste — inclusive **combinado**, porque um contrato que só vale
  parâmetro a parâmetro não é contrato.

## Evidência

- `apps/api/src/monitoring-points/monitoring-points.dto.ts` — parsers, whitelist, limites.
- `apps/api/src/monitoring-points/monitoring-points.service.ts` — `buildListFilter`,
  `SORT_EXPRESSIONS`, transação em `RepeatableRead`, `totalPages`.
- `apps/api/test/rbac-and-query.e2e-spec.ts` — paginação, ordenação nas quatro colunas nos
  dois sentidos, busca (incluindo curingas literais), filtros, eco do recorte e composição
  busca + filtro + ordenação + página.
- `apps/web/src/features/monitoringPoints/monitoringPointsSlice.ts` — o cliente do contrato.
- Documento irmão: [`../02-api/backend-architecture.md`](../02-api/backend-architecture.md).
