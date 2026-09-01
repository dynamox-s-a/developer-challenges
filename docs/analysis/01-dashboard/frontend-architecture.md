# Arquitetura do frontend

SPA React 18 + TypeScript sobre Vite 5, Material UI 5 e Redux Toolkit 2. Código em
[`apps/web/src`](../../../apps/web/src). Este documento descreve a estrutura real e as
responsabilidades de cada camada — não é um tutorial de React nem uma proposta de
redesenho.

Por que Redux com thunks, e não RTK Query:
[ADR-0003](../06-decisions/adr-0003-redux-toolkit-thunks.md).

## Camadas

```
pages/ + components/     apresentação — MUI, sem regra de negócio
   ↑ hooks tipados (useAppSelector / useAppDispatch)
features/<domínio>/      slice + thunks + selectors por domínio
   ↑
api/client.ts            única fronteira de rede e de desserialização
   ↑
libs/domain              vocabulário e regras compartilhados com o backend
```

Nenhum componente chama `fetch` diretamente e nenhum slice conhece MUI. O tipo de um
payload de rede só passa a ser conhecido depois de cruzar `api/client.ts` — é lá que
`unknown` vira DTO.

## Rotas e shell

[`App.tsx`](../../../apps/web/src/App.tsx) declara três rotas privadas (dashboard
operacional, máquinas, pontos de monitoramento) e `/login`, com `react-router-dom` 7 no
modo declarativo. As três páginas privadas são carregadas com `lazy()` e um `Suspense` no
shell: a tela de login não baixa o código do dashboard.

`RequireAuth` protege o grupo de rotas privadas: enquanto a sessão está sendo restaurada
mostra carregamento, sem sessão redireciona para `/login` preservando o destino em
`state.from`. `AppShell` é o layout (drawer permanente em telas grandes, temporário em
telas pequenas via `useMediaQuery`, cabeçalho com usuário e "Sair", `<Outlet />` para a
página).

Também no bootstrap (`App.tsx`): registra-se o handler central de `401` do cliente HTTP e
dispara-se `restoreSession()`. É o único lugar em que a aplicação decide o que fazer quando
a sessão morre.

## Estado

Store único, `combineReducers` com cinco slices — `auth`, `dashboard`, `machines`,
`monitoringPoints`, `diagnostics` ([`store/index.ts`](../../../apps/web/src/store/index.ts)).
`createStore(preloadedState?)` é exportada para que os testes montem a árvore inteira com
um estado inicial, sem mocks de store.

| Slice | Responsabilidade |
|---|---|
| `auth` | sessão: `login`, `restoreSession`, `logout`, `sessionExpired`, e `selectCanMutate` |
| `machines` | CRUD de máquinas, com ordenação local por nome idêntica à do servidor |
| `monitoringPoints` | listagem paginada/ordenada/filtrada **no servidor**, criação de ponto e associação de sensor |
| `dashboard` | inventário + séries + métricas + amostras do painel operacional |
| `diagnostics` | estado de saúde da API (`/health`) exibido na barra de status |

Convenções que valem em todos:

- **Thunks** (`createAsyncThunk`), nunca sagas — requisito do desafio e escopo pequeno.
  Onde o thunk precisa do estado, usa-se `createAsyncThunk.withTypes<…>()` para manter o
  tipo de `getState` sem cast.
- **`RequestStatus`** (`idle | loading | succeeded | failed`) é o vocabulário único de
  carregamento ([`store/requestStatus.ts`](../../../apps/web/src/store/requestStatus.ts)),
  o que permite os mesmos componentes de estado (`libs/ui`: `LoadingState`, `ErrorState`,
  `EmptyState`) em todas as telas.
- **O servidor é a fonte da listagem.** `monitoringPointsSlice` guarda página, ordenação e
  filtros no estado e reenvia tudo à API; `filtersChanged`/`filtersCleared` voltam para a
  página 1, porque manter a página 7 depois de filtrar mostraria uma lista vazia que parece
  um bug.
- **Erro exibido é o erro real da API.** O cliente extrai `message` do envelope de erro; a
  UI não inventa texto genérico.

## Dashboard operacional

O painel lê três fontes independentes (máquinas, pontos, séries) com
`Promise.allSettled`: se as séries falharem e o inventário responder, a tela continua útil
e mostra o erro parcial em vez de uma tela de erro inteira.

Todo o cálculo exibido é **derivado no cliente**, em
[`features/dashboard/dashboardAggregations.ts`](../../../apps/web/src/features/dashboard/dashboardAggregations.ts):
funções puras que recebem o estado e devolvem a visão (matriz, KPIs, ranking, sinais,
distribuição, tendências). Os selectors memoizam esse cálculo por instância
(`createSelectDashboardView(nowMs)`), para não refazê-lo a cada render sem mudança de
referência. Semântica e limites desse modelo:
[`condition-monitoring.md`](./condition-monitoring.md).

Componentes do painel, na ordem em que a página responde às perguntas do operador
(atenção → ativo → ponto → sensor → sinal → evidência → histórico): `DashboardHeader`,
`KpiGrid` (três indicadores independentes), `InspectionQueue` (fila de exceções),
`TrendPanel` (Recharts, alvo do drill-down), `SensorConditionMatrix` + `FleetFreshness`
(frota, secundários) e `SeriesExplorer` com `SeriesHierarchyFilters`.

O carregamento é em duas etapas: inventário (máquinas, pontos e séries — três requisições,
com a última leitura já no resumo das séries) e, depois do primeiro render, a avaliação de
condição, que baixa as amostras dos pares radiais avaliáveis. As amostras da série
selecionada são buscadas sob demanda.

## Tema e apresentação

[`theme.ts`](../../../apps/web/src/theme.ts) centraliza paleta, tipografia e defaults dos
componentes MUI; os componentes não repetem estilo cru. `libs/ui` concentra os três estados
reutilizáveis (carregando, erro com repetição, vazio) — compartilhados por todas as
telas, o que evita cada painel inventar o seu.

## Padrão de teste

Vitest + Testing Library, com um único helper:
[`test/renderWithProviders.tsx`](../../../apps/web/src/test/renderWithProviders.tsx), que
monta store real, tema e router e aceita uma sessão simulada — inclusive **por perfil**,
para exercitar a interface do VIEWER. Os testes consultam a tela pelo que o usuário vê
(rótulos, papéis de acessibilidade), não por detalhes de implementação, e a rede é
respondida por stubs de `fetch`. O que cada suíte prova:
[`../07-validation/testing-strategy.md`](../07-validation/testing-strategy.md).

## Fronteira de segurança do cliente

`assertLocalApiBaseUrl()` valida `VITE_API_BASE_URL` **na carga do módulo**: domínios da
Dynamox e URLs inválidas fazem a aplicação falhar imediatamente, em vez de mandar dados
sintéticos para um endereço real. Ver
[`../05-simulation/simulation-vs-real.md`](../05-simulation/simulation-vs-real.md) e
[ADR-0008](../06-decisions/adr-0008-synthetic-isolation.md).
