# Estratégia de testes

## Objetivo

A estratégia prioriza comportamento observável, regras de domínio e contratos nas fronteiras. Cada
camada cobre um risco diferente; nenhum teste isolado é tratado como garantia suficiente.

## Princípios

- Testar nossa lógica, não detalhes internos das bibliotecas.
- Usar queries acessíveis e interações próximas às ações do usuário.
- Manter fixtures determinísticas.
- Mockar no limite externo mais estreito.
- Cobrir regressões reproduzíveis.
- Evitar snapshots grandes e asserts frágeis de estrutura.
- Separar falha do produto de limitação do ambiente de testes.

## Camadas

### Funções de domínio

Vitest cobre transformações puras:

- parse de métrica e eixo;
- associação de unidade;
- conversão de ISO para timestamp;
- mapeamento de `max` para `value`;
- busca do ponto mais próximo;
- sincronização e ocultação de indicadores.

Esses testes são rápidos e não precisam de DOM ou rede.

### Estado e efeitos

Reducers são exercitados pelas actions públicas e validam transições entre `idle`, `loading`,
`success` e `error`.

Selectors recebem estados representativos e confirmam agrupamento por métrica e estabilidade das
derivações.

Sagas são testadas com efeitos declarativos e `redux-saga-test-plan`, cobrindo:

- chamada ao serviço;
- transformação pelo mapper;
- dispatch de sucesso;
- normalização e dispatch de erro;
- observação com `takeLatest`.

### Componentes

Testing Library renderiza componentes com providers reais quando a integração importa. Os testes
consultam papel, nome e texto acessível em vez de classes ou árvore interna.

Os cenários incluem:

- loading;
- erro e retry;
- ausência de dados;
- resumo completo e parcial;
- composição dos três gráficos;
- fallback do Error Boundary;
- navegação e rotas.

### Highcharts

JSDOM não implementa layout SVG como um navegador. Por isso:

- componentes mockam Highcharts na fronteira;
- `chartOptions` é testado como preparação de configuração;
- sincronização é testada contra a interface `SynchronizableChart`;
- adapters recebem doubles mínimos da API imperativa;
- renderização SVG e eventos reais são validados no Cypress.

Esse limite evita reproduzir internals do Highcharts dentro dos testes.

### Contrato da Function

`tests/api/measurements.test.ts` importa `GET` diretamente e confirma:

- status HTTP 200;
- conteúdo JSON;
- equivalência com `mock/db.json`;
- coleção completa esperada pelo contrato.

O teste protege a paridade entre runtime local e produção sem iniciar um servidor.

### Storybook

Stories documentam componentes e estados isolados:

- loading, erro e vazio;
- resumo completo e parcial;
- cards e gráficos com dados previsíveis.

O addon de acessibilidade executa verificações axe no canvas. Storybook apoia desenvolvimento e
revisão visual, mas não substitui integração ou Cypress.

### Cypress local

A abordagem é híbrida:

- cenários de sucesso usam `json-server` e a aplicação de verdade;
- falhas determinísticas usam `cy.intercept`;
- o build e2e recebe `VITE_API_BASE_URL=http://127.0.0.1:3001`.

Os fluxos cobertos são:

- carregar a página e renderizar resumo e gráficos;
- receber falha da API, exibir erro e recuperar após retry;
- evitar overflow em mobile e tablet;
- mostrar e ocultar tooltip/crosshair nos três gráficos.

O cenário SVG de sincronização admite retries apenas em modo headless, pois eventos e layout do
Electron podem variar. A asserção continua exigindo os indicadores nos três gráficos.

### Smoke de produção

Depois do deploy, o CD:

1. confirma HTTP de `/data`, `/api/measurements` e Storybook;
2. valida com `jq` que a API contém sete séries com `id`, `name` e `data`;
3. executa os specs de carregamento e sincronização contra a URL pública.

O smoke detecta diferenças de ambiente que testes locais não cobrem.

## Acessibilidade

As verificações combinam:

- queries acessíveis da Testing Library;
- helper axe nos testes de componentes;
- addon a11y no Storybook;
- semântica e teclado no Cypress quando fazem parte do fluxo;
- inspeção manual de foco, contraste e leitura.

axe-core detecta classes conhecidas de problema, mas não certifica acessibilidade completa.

## Responsividade

Componentes são validados por comportamento no JSDOM quando possível. Overflow e resize dependem
de layout real e são verificados pelo Cypress em viewports mobile e tablet, além de revisão visual
em desktop.

## Coverage

```bash
pnpm test:coverage
```

O provider V8 gera relatório local. Não existe threshold configurado, e coverage não roda no job
`quality` atual. O percentual é sinal para identificar áreas sem exercício, não meta isolada de
qualidade.

## Comandos

```bash
pnpm test              # suíte Vitest
pnpm test:watch        # Vitest em watch
pnpm test:coverage     # Vitest com coverage
pnpm typecheck:e2e     # tipos do Cypress
pnpm storybook         # revisão isolada
pnpm build-storybook   # build estático
pnpm e2e               # Cypress interativo com serviços temporários
pnpm e2e:ci            # Cypress headless sobre build
```

## CI

O job `quality` executa testes unitários e builds depois de formato, lint e typechecks. O job
`e2e` instala o binário do Cypress e executa `pnpm e2e:ci` em paralelo. Falhas do Cypress enviam
screenshots e vídeos como artifacts com retenção limitada.

Deploy só pode começar quando os dois jobs concluem com sucesso.

## Quando adicionar um teste

- Regra de transformação: teste unitário puro.
- Transição de estado: reducer ou saga.
- Comportamento acessível: teste de componente.
- Estado visual isolado: Storybook.
- Integração navegador/API: Cypress.
- Contrato de produção: teste da Function ou smoke.

Um bug deve receber o teste mais baixo que reproduza a causa com fidelidade. Testes de camadas
superiores são adicionados quando o risco está na integração, não para duplicar toda a pirâmide.

## Critério de conclusão

Uma mudança está testada de forma proporcional quando:

- regras alteradas possuem cobertura comportamental;
- loading, erro, vazio e sucesso permanecem coerentes;
- mocks não escondem a fronteira modificada;
- TypeScript dos testes passa;
- builds da aplicação e Storybook passam;
- Cypress cobre integrações críticas afetadas;
- falhas não são ocultadas por retries, snapshots ou regras desabilitadas.
