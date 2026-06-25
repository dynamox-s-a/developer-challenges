# Plano de Execução — Dynamox Front-end Challenge

## Contexto

O objetivo é entregar o desafio técnico descrito em
[app_dynamox/docs/teste.MD](app_dynamox/docs/teste.MD): um dashboard em
**React + TypeScript** que exibe, na rota `/data`, um cabeçalho com informações
da máquina e **3 gráficos de série temporal** (aceleração, velocidade e
temperatura), com **crosshair vertical sincronizado** e tooltip entre os
gráficos ao passar o mouse.

Estado atual do repositório:

- [app_dynamox/](app_dynamox/) já contém um scaffold **Vite + React 19 +
  TypeScript** recém-criado (o [App.tsx](app_dynamox/src/App.tsx) ainda mostra a
  página padrão do Vite). Não há Redux, Highcharts, MUI, router nem framework de
  testes instalados.
- O mock de dados está em [response-challenge-v2.json](response-challenge-v2.json)
  (raiz do repo): um array de **7 séries** —
  `accelerationRms/{x,y,z}`, `velocityRms/{x,y,z}` e `temperature`. Cada série é
  `{ name, data: [{ datetime, max }] }`.
- O dataset **não traz metadados da máquina** → as informações do cabeçalho
  serão mockadas (assunção documentada no README).

### Decisões de stack (alinhadas ao pedido)

- **Redux Toolkit** para estado global, usando `createAsyncThunk` + slice para o
  fetch assíncrono. **Sem Redux Saga** (requisito opcional do teste, dispensado
  conforme solicitado).
- **Highcharts** (via `highcharts-react-official`) para os gráficos.
- **Material UI** (linha atual de `@mui/material`, compatível com React 19) para
  estilo/layout — atende ao requisito de "MUI 5" mantendo a mesma API de
  componentes. *(Mantemos React 19 já presente no scaffold.)*
- **Vite** (já no scaffold), **react-router-dom** para a rota `/data`,
  **json-server** para a fake REST API e **Vitest + Testing Library** para os
  testes unitários.
- Documentação (README e este plano em `/docs`) em **Português**.

## Estrutura de pastas (arquitetura simples por feature)

```
app_dynamox/
├── db.json                     # base do json-server (machine + telemetry)
├── vite.config.ts              # + proxy /api e bloco de teste (vitest)
├── src/
│   ├── main.tsx                # Provider Redux + Router + ThemeProvider MUI
│   ├── App.tsx                 # definição de rotas
│   ├── app/
│   │   ├── store.ts            # configureStore
│   │   └── hooks.ts            # useAppDispatch / useAppSelector tipados
│   ├── features/telemetry/
│   │   ├── telemetry.types.ts      # Series, DataPoint, Metric, MachineInfo
│   │   ├── telemetry.api.ts        # chamadas fetch ao json-server
│   │   ├── telemetrySlice.ts       # estado + createAsyncThunk(fetchData)
│   │   ├── telemetry.transform.ts  # API -> séries Highcharts (lógica testável)
│   │   └── telemetry.selectors.ts  # selectors memoizados por métrica
│   ├── pages/
│   │   └── DataPage.tsx        # rota /data: dispara fetch + monta a tela
│   ├── components/
│   │   ├── MachineHeader.tsx   # cabeçalho com infos da máquina
│   │   └── charts/
│   │       ├── SyncedCharts.tsx     # container que sincroniza crosshair/tooltip
│   │       └── TimeSeriesChart.tsx  # wrapper Highcharts de 1 métrica
│   ├── theme/theme.ts          # tema MUI
│   └── test/setup.ts           # jest-dom + mock de matchMedia
└── docs/
    └── plano-execucao.md       # cópia deste plano (entrega final)
```

## Dependências a instalar

- Runtime: `@reduxjs/toolkit react-redux react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material highcharts highcharts-react-official`
- Dev: `json-server vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`

## Passo a passo de implementação

### 1. Limpeza do scaffold
Remover conteúdo de demonstração: zerar [App.tsx](app_dynamox/src/App.tsx),
[App.css](app_dynamox/src/App.css) e assets não usados (`react.svg`, `vite.svg`,
`hero.png`). Manter `index.css` com um reset mínimo.

### 2. Mock API (json-server)
Criar `app_dynamox/db.json` no formato que o json-server expõe como recursos:

```jsonc
{
  "machine": { "id": "MX-001", "name": "Motor Bomba 01", "sensor": "DynaLogger",
               "location": "Linha 3", "status": "running" },
  "telemetry": [ /* ...as 7 séries de response-challenge-v2.json... */ ]
}
```

- O array de `telemetry` é copiado de
  [response-challenge-v2.json](response-challenge-v2.json).
- Scripts no `package.json`:
  - `"server": "json-server --watch db.json --port 3000"`
  - `"dev": "vite"`
  - `"test": "vitest"`, `"test:run": "vitest run"`
- Proxy no `vite.config.ts`: `/api` → `http://localhost:3000` (a app chama
  `/api/machine` e `/api/telemetry`, evitando CORS e hardcode de host).

### 3. Tipos e transformação (lógica de negócio testável)
- `telemetry.types.ts`: `RawSeries = { name: string; data: { datetime: string; max: number }[] }`,
  `Metric = 'acceleration' | 'velocity' | 'temperature'`, `MachineInfo`.
- `telemetry.transform.ts`: funções puras
  - `toHighchartsPoints(series)` → `[timestampMs, value][]` (parse de `datetime`).
  - `groupByMetric(rawSeries)` → agrupa as 7 séries nos 3 grupos de gráfico
    (aceleração = x/y/z, velocidade = x/y/z, temperatura = série única).
  - Estas funções são o foco dos testes unitários (regras de mapeamento/agrupamento).

### 4. Store Redux Toolkit
- `app/store.ts`: `configureStore({ reducer: { telemetry } })` + tipos `RootState`/`AppDispatch`.
- `app/hooks.ts`: `useAppDispatch`/`useAppSelector` tipados.
- `telemetry.api.ts`: `fetchMachine()` e `fetchTelemetry()` (fetch + checagem de `res.ok`).
- `telemetrySlice.ts`:
  - `createAsyncThunk('telemetry/fetchData', ...)` busca máquina + telemetria em paralelo (`Promise.all`).
  - Estado: `{ machine, series, status: 'idle'|'loading'|'succeeded'|'failed', error }`.
  - `extraReducers` para `pending/fulfilled/rejected`.
- `telemetry.selectors.ts`: selectors que derivam os grupos por métrica a partir do estado.

### 5. Tema, layout e roteamento
- `theme/theme.ts`: tema MUI (paleta básica, tipografia).
- `main.tsx`: envolve a app em `<Provider store>`, `<BrowserRouter>`, `<ThemeProvider>` + `<CssBaseline>`.
- `App.tsx`: rotas com react-router → `/data` renderiza `DataPage`; `/` redireciona para `/data`.

### 6. Página /data e cabeçalho
- `DataPage.tsx`: `useEffect` dispara `fetchData()` **a cada montagem** (atende
  "dados buscados sempre que acessa /data"). Renderiza estados de
  loading (`<CircularProgress/>`), erro (`<Alert/>`) e sucesso.
- `MachineHeader.tsx`: card MUI com nome/sensor/local/status da máquina.

### 7. Gráficos Highcharts + sincronização
- `TimeSeriesChart.tsx`: wrapper de `HighchartsReact` para uma métrica — eixo X
  `datetime`, eixo Y magnitude, título da métrica, séries x/y/z quando aplicável.
- `SyncedCharts.tsx`: replica o exemplo oficial de
  [synchronized charts](https://www.highcharts.com/demo/highcharts/synchronized-charts):
  - Liga handler de `mousemove`/`touchmove` no container que envolve os 3 gráficos.
  - Para cada `Highcharts.charts`, usa `chart.pointer.normalize`, `series.searchPoint`,
    `point.onMouseOver()`, `chart.tooltip.refresh(point)` e
    `chart.xAxis[0].drawCrosshair(event, point)` → crosshair + tooltip nos mesmos timestamps.
  - `crosshair: true` no `xAxis` de cada gráfico.
- Layout responsivo com `Stack`/`Grid` MUI: 3 gráficos empilhados em largura total
  (ideal para alinhar o crosshair); espaçamento adaptado para mobile/desktop.

### 8. Testes unitários (Vitest + Testing Library)
- `vite.config.ts`: bloco `test` (`globals: true`, `environment: 'jsdom'`, `setupFiles`).
- Cobertura mínima focada em lógica/comportamento:
  - `telemetry.transform.test.ts`: `toHighchartsPoints` e `groupByMetric` (regras puras).
  - `telemetrySlice.test.ts`: transições de estado `pending/fulfilled/rejected`.
  - `DataPage.test.tsx`: com `fetch` mockado, verifica loading → render do header e dos gráficos (mock leve do wrapper Highcharts).

### 9. Documentação (entrega)
- Reescrever [app_dynamox/README.md](app_dynamox/README.md) em PT: descrição,
  pré-requisitos, **como rodar** (`npm install`, `npm start`), como rodar testes,
  e a assunção sobre os dados mockados da máquina.
- Copiar este plano para `app_dynamox/docs/plano-execucao.md`
  *(passo executado após a aprovação — em modo plano só este arquivo pode ser editado)*.

## Mapa requisitos → entrega

| Requisito do teste | Como é atendido |
| --- | --- |
| Rota `/data` com header + gráficos | `App.tsx` + `DataPage.tsx` + `MachineHeader.tsx` |
| 3 séries temporais (acel./vel./temp.) | `groupByMetric` + 3× `TimeSeriesChart` |
| Fetch ao acessar `/data` | `useEffect` → `dispatch(fetchData())` na montagem |
| Mock + REST API (json-server) | `db.json` + script `api` + proxy Vite |
| Crosshair + tooltip sincronizados | `SyncedCharts.tsx` |
| TypeScript / React / Vite | scaffold existente |
| Redux (Toolkit) | `store` + `telemetrySlice` (createAsyncThunk) |
| Material UI | tema + componentes MUI no layout |
| Highcharts | `highcharts-react-official` |
| Testes unitários | Vitest + Testing Library (passo 8) |
| Responsividade | layout com `Stack`/`Grid` MUI |
| Rodar/documentar | README em PT + plano em `/docs` |

> Não implementado por opção: **Redux Saga** (requisito opcional do teste).

## Verificação (end-to-end)

1. `cd app_dynamox && npm install`
2. Em um terminal: `npm run server` → sobe json-server em `:3000`.
3. Em outro terminal: `npm run dev` → sobe o Vite em `:5173`.
3. Abrir `http://localhost:5173/data` e validar:
   - Cabeçalho com infos da máquina é exibido.
   - 3 gráficos (aceleração com x/y/z, velocidade com x/y/z, temperatura).
   - Ao passar o mouse, o crosshair vertical aparece **nos 3 gráficos no mesmo
     timestamp**, com tooltip.
   - Recarregar `/data` dispara novo fetch (ver chamadas na aba Network).
   - Redimensionar a janela → layout permanece legível (responsivo).
4. `npm run test:run` → testes de transformação, slice e página passam.
5. `npm run build` + `npm run lint` sem erros.
