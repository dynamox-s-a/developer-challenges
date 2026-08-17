# Dynamox Dashboard

Dashboard de análise de dados de sensores industriais, desenvolvido como solução para o [Dynamox Front-end Challenge](../front-end-challenge-v2.md).

## Stack

| Camada                      | Tecnologia               |
| --------------------------- | ------------------------ |
| Build                       | Vite 8                   |
| UI                          | React 19 + TypeScript 6  |
| Estado global               | Redux + Redux Saga       |
| Componentes                 | Material UI 5            |
| Gráficos                    | Highcharts 13            |
| Testes unitários            | Vitest + Testing Library |
| Testes E2E                  | Cypress 15               |
| Documentação de componentes | Storybook 10             |
| API mock                    | json-server              |

## Pré-requisitos

- Node.js 20+ — use `nvm use` na raiz do projeto para selecionar a versão correta (definida em `.nvmrc`)
- npm 10+

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste se necessário (o padrão já aponta para o json-server local):

```bash
cp .env.example .env   # ou edite o .env existente
```

Variável necessária:

```
VITE_API_URL=http://localhost:3000
```

### 3. Iniciar a API mock (json-server)

Em um terminal separado:

```bash
npm run api
```

Isso sobe o json-server na porta `3000` servindo o arquivo `db.json`. O endpoint utilizado pela aplicação é `GET /metrics`.

### 4. Iniciar a aplicação

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173). A rota padrão redireciona automaticamente para `/data`.

## Scripts disponíveis

```bash
npm run dev            # servidor de desenvolvimento (Vite)
npm run api            # API mock (json-server na porta 3000)
npm run build          # build de produção
npm run preview        # preview do build de produção
npm run test           # testes unitários (Vitest, modo CI)
npm run test:watch     # testes unitários em modo watch
npm run cypress:open   # abre o Cypress em modo interativo
npm run test:e2e       # roda os testes E2E (sobe o dev server automaticamente)
npm run storybook      # inicia o Storybook na porta 6006
npm run lint           # ESLint
npm run format         # Prettier (write)
npm run format:check   # Prettier (check)
```

## Estrutura do projeto

```
app/
├── db.json                        # dados mock servidos pelo json-server
├── cypress/                       # testes end-to-end
│   ├── e2e/                       # specs E2E (app, data page, API)
│   ├── component/                 # specs de componentes isolados
│   ├── fixtures/                  # dados de teste
│   └── support/                   # comandos e configuração global
└── src/
    ├── main.tsx                   # entrypoint — monta Provider, BrowserRouter e App
    ├── App.tsx                    # define as rotas (/ → /data)
    ├── theme.ts                   # tema global do Material UI
    ├── setupTests.ts              # setup global do Vitest (jest-dom matchers)
    ├── types/
    │   └── data.ts                # tipos TypeScript compartilhados (Metric, DataPoint)
    ├── config/
    │   └── env.ts                 # leitura das variáveis de ambiente (VITE_API_URL)
    ├── services/
    │   └── api.ts                 # cliente HTTP — GET /metrics
    ├── parsers/
    │   └── parserSeries.ts        # transforma os dados da API em SeriesOptionsType do Highcharts
    ├── store/
    │   ├── index.ts               # cria a store Redux com o middleware do Saga
    │   ├── rootReducer.ts         # combina os reducers
    │   ├── rootSaga.ts            # registra as sagas
    │   └── data/                  # slice de dados de métricas
    │       ├── types.ts           # tipos do estado e das actions
    │       ├── actions.ts         # action creators (FETCH_REQUEST/SUCCESS/FAILURE)
    │       ├── reducer.ts         # reducer — estados: loading, data, error
    │       ├── sagas.ts           # saga — chama api.getData e despacha success/failure
    │       └── selectors.ts       # selectors tipados para leitura do estado
    ├── hooks/
    │   └── useChartSync.ts        # sincroniza crosshair e tooltip de todos os gráficos Highcharts via mousemove
    ├── pages/
    │   └── Data/                  # página principal acessada em /data
    │       └── index.tsx          # orquestra fetch, loading, error e renderiza MachineInfo + Charts
    └── components/
  ├── Chart/                 # wrapper do HighchartsReact com configuração padrão
  ├── Header/                # barra de título da aplicação
  ├── Info/                  # item atômico de informação (ícone + texto)
  ├── Loading/               # indicador de carregamento
  ├── MachineInfo/           # painel com metadados da máquina (nome, ponto, RPM, etc.)
  └── icons/                 # ícones SVG customizados (Machine, Location, Rpm, Duration, Interval)
```

> Cada componente possui um arquivo `index.stories.tsx` (Storybook) e `*.test.tsx` (Vitest).

## Arquitetura de dados

```
json-server (db.json)
    └── GET /metrics
      └── Redux Saga (sagas.ts)
        ├── FETCH_REQUEST → loading: true
        ├── FETCH_SUCCESS → data: Metric[]
        └── FETCH_FAILURE → error: string
          └── parseSeries(data, indexes[])
            └── Highcharts SeriesOptionsType[]
              └── <Chart /> (3 instâncias)
                └── useChartSync (crosshair sincronizado)
```

## Testes

**Unitários** — 13 arquivos, 40 testes:

```bash
npm run test
```

Cobertura inclui: actions, reducer, sagas, selectors, serviço de API, parser de séries, hook `useChartSync` (10 cenários) e todos os componentes.

**E2E** — Cypress 15, 3 specs (app, data page, API):

```bash
npm run test:e2e    # headless (sobe o dev server automaticamente)
npm run cypress:open  # modo interativo
```

## Storybook

Documentação interativa de todos os componentes:

```bash
npm run storybook
```

Acesse [http://localhost:6006](http://localhost:6006).
