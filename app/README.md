# DynaSense — Front-end Challenge

Dashboard de monitoramento de condição para análise de aceleração, velocidade e
temperatura de um ativo industrial. A implementação atende ao desafio front-end
da Dynamox e prioriza legibilidade, acessibilidade, estados de interface e
manutenibilidade.

## Como executar

Pré-requisito: Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173/data`. O comando inicia tanto a aplicação quanto
a API REST mock. A rota `/` redireciona para `/data`.

Comandos úteis:

```bash
npm test                 # testes unitários
npm run test:coverage    # cobertura dos testes
npm run test:e2e         # inicia a aplicação e executa Cypress headless
npm run cypress:open     # inicia app/API e abre a interface do Cypress
npm run build            # build de produção com Vite
npm run storybook        # documentação de componentes
npm run build-storybook  # valida o Storybook
npm run api:mock         # API alternativa com json-server na porta 3001
```

`cypress:open` sobe automaticamente o Vite e o json-server. Caso a aplicação já
esteja rodando em outro terminal, use `npm run cypress:ui` para abrir somente o
runner e evitar conflito nas portas 5173 e 3001.

## O que foi implementado

- React + TypeScript, compilados diretamente com Vite;
- Material UI 5 e layout responsivo;
- Redux Toolkit para estado global;
- Redux Saga para consulta assíncrona e tratamento de falhas;
- endpoint REST `GET /measurements` via json-server, usando o mock oficial;
- três gráficos Highcharts com a integração atual `@highcharts/react`:
  aceleração RMS, velocidade RMS e temperatura;
- séries X, Y e Z diferenciadas por cor;
- crosshair e tooltips sincronizados entre todos os gráficos;
- filtro de 7, 14 e 30 dias ou histórico completo;
- estados de carregamento, erro, vazio e nova tentativa;
- zoom horizontal nativo nos gráficos;
- testes unitários com Vitest;
- testes E2E com Cypress para carregamento, rota, filtro, sincronização e refresh;
- documentação de componente e auditoria de acessibilidade com Storybook;
- idioma, navegação estrutural e rótulos acessíveis.

## Decisões técnicas

`dashboardSlice.ts` mantém apenas estado de domínio compartilhado. A consulta
fica isolada em `dashboardSaga.ts`; a transformação de período e agrupamento de
métricas ocorre em seletores puros e testáveis. O timestamp em hover é estado
efêmero da tela e, por isso, não foi levado ao Redux.

A aplicação consulta `/api/measurements`; durante o desenvolvimento, o proxy do
Vite encaminha essa chamada ao json-server em `http://localhost:3001`. Dessa
forma, o front-end não conhece detalhes de host da API e o mock segue a sugestão
do enunciado.

Para dados reais, eu adicionaria validação de contrato na fronteira da API,
telemetria, paginação ou downsampling no servidor e testes de contrato. O mock
fornecido foi mantido sem alterações.

## Estrutura principal

```text
src/
  App.tsx                 # rotas da SPA
  features/dashboard/
    Dashboard.tsx         # composição da tela
    SensorChart.tsx       # gráfico sincronizado
    dashboardSlice.ts     # estado e ações
    dashboardSaga.ts      # efeitos assíncronos
    selectors.ts          # regras de seleção e período
    store.ts              # configuração Redux/Saga
tests/                    # testes unitários
.storybook/               # documentação de componentes
db.json                   # dados oficiais expostos pelo json-server
```
