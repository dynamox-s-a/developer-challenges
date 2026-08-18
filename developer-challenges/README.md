# Dynamox Front-end Challenge

# React + TypeScript + Vite

Projeto criado usando o scaffold oficial do vite para react + typescript

## Stack
Construído com React, TypeScript, Redux Toolkit + Redux-Saga, Material UI 5 e Highcharts, Vitest para testes e Storybooks para visualização de componentes


Como o objetivo desse projeto é mostrar alguns conhecimentos de otimização de performance optei por não selecionar o react compiler, que faz de forma automatica a memoização dos arquivos .tsx

## Scripts

`npm run dev` Sobe só o front-end (Vite dev server), em `http://localhost:5173`. Precisa do mock da API rodando à parte para os dados carregarem. |
`npm run mock-api` Sobe o `json-server` servindo `db.json` em `http://localhost:4000` (`/machine` e `/readings`). |
`npm run dev:all` Sobe front-end e mock da API juntos (via `concurrently`), com logs prefixados/coloridos por processo (`vite` / `api`). Jeito mais rápido de rodar o projeto localmente. |
`npm run build` Type-check (`tsc -b`) + build de produção do front-end. |
`npm run preview` Serve o build de produção localmente. |
`npm run lint` ESLint no projeto todo. |
`npm run test` Roda a suíte de testes (Vitest) uma vez. |
`npm run test:watch` Vitest em modo watch. |
`npm run storybook` Sobe o Storybook em `http://localhost:6006`, catálogo dos componentes isolados. |
`npm run build-storybook` Build estático do Storybook. |
`npm run cypress:open` Abre o Cypress no modo interativo (precisa do `npm run dev:all` rodando à parte). |
`npm run e2e` Sobe front-end + mock da API (`dev:all`), espera ficar no ar e roda os testes do Cypress em modo headless (`cypress run`), derrubando tudo no final. |

## Testes E2E (Cypress)

Cobrem a rota `/data`: header da máquina + os 3 gráficos renderizando, hover num gráfico mostrando tooltip com dado, e uma rota desconhecida caindo na página 404. Ficam em `cypress/e2e/`.

```bash
npm run e2e
```

## Variáveis de ambiente

O front-end lê a URL da API mockada de `VITE_API_URL`. Crie um arquivo `.env` na raiz do projeto (ronomeie .env.example) com:

```
VITE_API_URL=http://localhost:4000
```

Precisa bater com a porta que o `json-server` sobe (`npm run mock-api`, configurada em `--port 4000` no script).

## Rodando o projeto

```bash
npm install
npm run dev:all
```

Depois é só acessar `http://localhost:5173/data`.

