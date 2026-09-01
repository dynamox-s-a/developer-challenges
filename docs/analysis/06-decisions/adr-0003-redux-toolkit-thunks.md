# ADR-0003 — Redux Toolkit com thunks, sem RTK Query

**Status:** Aceito

## Contexto

O enunciado exige Redux com camada assíncrona (Thunk ou Saga). Dentro disso ainda há
escolha real: usar `createAsyncThunk` para cada operação, ou adotar RTK Query, que gera
hooks, cache, invalidação e deduplicação automaticamente.

O estado de servidor deste produto é modesto: máquinas, pontos (paginados no servidor),
séries, métricas e amostras. Não há invalidação cruzada complexa, nem múltiplas telas
disputando o mesmo cache com políticas diferentes.

## Decisão

Redux Toolkit com `createAsyncThunk`, um slice por domínio e selectors memoizados para o
que é derivado.

## Alternativas consideradas

- **RTK Query.** Rejeitada para este escopo: traria uma segunda mentalidade de estado
  (cache com tags e invalidação) para um app com poucas entidades, e esconderia
  justamente a parte que o desafio quer ver — o fluxo assíncrono explícito. Também não
  ajudaria no caso mais pesado do produto, o dashboard, cuja complexidade está no cálculo
  derivado e não no transporte.
- **Redux-Saga.** Rejeitada: sagas brilham em orquestração de efeitos (cancelamento,
  concorrência, retentativa coordenada). Aqui, cada operação é uma chamada e uma
  transição de estado; o generator seria cerimônia.
- **Estado local + Context.** Rejeitada: contraria o requisito e espalharia a lógica de
  carregamento por componentes.

## Consequências

- Cada slice declara explicitamente seus estados (`RequestStatus`) e trata `pending`,
  `fulfilled` e `rejected` — mais verboso, e mais legível para quem revisa.
- Não há cache automático: o dashboard recarrega o que precisa quando precisa; para o
  volume atual, isso é adequado e previsível.
- Concorrência é tratada à mão onde importa — a restauração de sessão ignora resultado
  obsoleto quando um login novo já trocou o token.
- Se o produto crescer para muitas entidades com invalidação cruzada, migrar para RTK
  Query é um caminho aberto: a fronteira de rede já está isolada em `api/client.ts`.

## Evidência

- `apps/web/src/features/*/[a-z]*Slice.ts` — slices por domínio com `createAsyncThunk`.
- `apps/web/src/features/monitoringPoints/monitoringPointsSlice.ts` —
  `createAsyncThunk.withTypes<…>()` para ler página/ordenação/filtros do próprio estado.
- `apps/web/src/features/dashboard/dashboardSelectors.ts` — memoização do cálculo derivado.
- `apps/web/src/store/requestStatus.ts` — vocabulário único de carregamento.
- Documento irmão: [`../01-dashboard/frontend-architecture.md`](../01-dashboard/frontend-architecture.md).
