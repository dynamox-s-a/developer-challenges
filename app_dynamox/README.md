# Dynamox Front-end Challenge

Dashboard de análise de dados de sensores de vibração, desenvolvido como parte do desafio técnico da Dynamox.

## Tecnologias

- React 19 + TypeScript + Vite
- Redux Toolkit
- Material UI
- Highcharts
- json-server

## Pré-requisitos

- Node.js 18+
- npm

## Instalação

```bash
npm install
```

## Como rodar

A aplicação depende de dois processos rodando simultaneamente — o servidor de dados e o app.

**1. Servidor de dados (json-server):**
```bash
npm run server
```
Disponível em `http://localhost:3000`, com os endpoints `/machines` e `/telemetry`.

**2. Aplicação:**
```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

## Testes

```bash
npm test
```

## Arquitetura

O projeto segue uma arquitetura simples orientada a features:

```
src/
├── app/                  # Configuração do store Redux
├── assets/               # Ícones e imagens
├── components/charts/    # Componentes de gráficos (Highcharts)
├── features/telemetry/   # Lógica de negócio da telemetria
│   ├── api.ts            # Chamadas à REST API
│   ├── groupByMetric.ts  # Agrupamento das séries por métrica
│   ├── slice.ts          # Estado global e async thunk
│   ├── types.ts          # Tipos TypeScript
│   └── tests/            # Testes unitários
├── pages/                # Páginas da aplicação
├── routes/               # Definição de rotas
└── theme/                # Tema Material UI
```

## Como os dados dos gráficos são carregados

O `db.json` é estruturado como um objeto com as chaves `machines` e `telemetry`, o que permite ao `json-server` expor os endpoints `/machines` e `/telemetry` diretamente.

Ao acessar `/`, a lista de máquinas é buscada em `/machines` e exibida. Ao selecionar uma máquina e navegar para `/data`, os dados de telemetria são buscados em `/telemetry` em uma única requisição e armazenados no Redux. A função `groupByMetric` então os agrupa em 3 conjuntos a partir das 7 séries temporais disponíveis:

- `accelerationRms/x`, `accelerationRms/y`, `accelerationRms/z` — aceleração nos 3 eixos
- `velocityRms/x`, `velocityRms/y`, `velocityRms/z` — velocidade nos 3 eixos
- `temperature` — temperatura

Cada grupo é passado individualmente a um gráfico Highcharts.
