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

**2. Aplicação:**
```bash
npm run dev
```

Acesse [http://localhost:5173/data](http://localhost:5173/data).

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

Os dados são buscados via `json-server` ao acessar a rota `/data`, armazenados no Redux e transformados em 3 grupos (aceleração, velocidade e temperatura) antes de serem passados aos gráficos Highcharts.

## Como os dados dos gráficos são carregados

O dataset é composto por 7 séries temporais:

- `accelerationRms/x`, `accelerationRms/y`, `accelerationRms/z` — aceleração nos 3 eixos
- `velocityRms/x`, `velocityRms/y`, `velocityRms/z` — velocidade nos 3 eixos
- `temperature` — temperatura

Como o `db.json` é um array, o `json-server` expõe cada série por índice numérico (`/0` a `/6`) em vez de por nome. Para contornar isso, as 7 requisições são feitas em paralelo com `Promise.all`, o que garante que todas as séries sejam carregadas ao mesmo tempo sem depender de chamadas sequenciais.

Após o carregamento, os dados são salvos no estado global do Redux. A função `groupByMetric` então os agrupa em 3 conjuntos — aceleração, velocidade e temperatura — que são passados individualmente a cada gráfico. Cada vez que o usuário acessa a rota `/data`, um novo fetch é disparado para garantir que os dados estejam sempre atualizados.
