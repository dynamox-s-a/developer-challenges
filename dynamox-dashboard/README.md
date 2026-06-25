# Dynamox Dashboard

Dashboard desenvolvido para o desafio front-end da Dynamox. A aplicação exibe a rota `/data` com informações da máquina monitorada e gráficos de séries temporais para aceleração, temperatura e velocidade.

## Funcionalidades

- Tela `/data` com cabeçalho e metadados da máquina.
- Consumo de dados por uma API REST mockada com `json-server`.
- Três gráficos de séries temporais usando Highcharts:
  - Aceleração RMS
  - Temperatura
  - Velocidade RMS
- Tooltip e crosshair nos gráficos ao passar o mouse sobre os pontos.
- Gerenciamento de estado com Redux Toolkit.
- Efeitos assíncronos com Redux Saga.
- Testes unitários, testes de componentes e testes e2e com Cypress.
- Storybook para documentação visual dos componentes.

## Tecnologias

- React
- TypeScript
- Vite
- Material UI 5
- Redux Toolkit
- Redux Saga
- Highcharts
- Vitest
- Cypress
- Storybook
- json-server

## Requisitos

- Node.js
- npm

## Como executar

Instale as dependências:

```bash
npm install
```

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env.development
```

Em um terminal, inicie a API mockada:

```bash
npm run api
```

Em outro terminal, inicie a aplicação:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:5173/data
```

A API mockada roda em:

```text
http://localhost:3001
```

## Hospedagem

A aplicação foi hospedada usando AWS Amplify:

```text
https://maria-betman.dredu640vdttu.amplifyapp.com/data
```

A API mockada foi disponibilizada com AWS API Gateway e AWS Lambda para servir os dados consumidos pelo dashboard.

## Endpoints mockados

- `GET /machine`: retorna os dados da máquina.
- `GET /measurements`: retorna as séries temporais usadas nos gráficos.

## Scripts

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run api
```

Inicia a API mockada com `json-server`.

```bash
npm run build
```

Gera a versão de produção.

```bash
npm run preview
```

Executa o preview do build.

```bash
npm run lint
```

Executa a validação com ESLint.

```bash
npm run test
```

Executa os testes com Vitest.

```bash
npm run e2e
```

Executa os testes end-to-end com Cypress.

```bash
npm run storybook
```

Inicia o Storybook em `http://localhost:6006`.

## Estrutura principal

```text
src/
  modules/
    machine/        # estado, saga e serviço dos dados da máquina
    measurements/   # estado, saga e serviço das medições
  pages/
    data/           # tela principal e componentes do dashboard
  store/            # configuração do Redux e sagas
mock/
  db.json           # base usada pelo json-server
```
