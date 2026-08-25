# QA Challenge, Dynamox

Testes automatizados (Playwright + TypeScript) para o desafio de QA da
Dynamox: aplicação web que exibe dados de vibração e temperatura de uma
máquina monitorada.

- App sob teste: https://frontend-test-for-qa.vercel.app/
- Protótipo Figma: https://www.figma.com/file/QxUZkTUIzQA7cvyiMvVyxK/Front-end---Teste

## Como rodar

```bash
npm install
npx playwright install --with-deps chromium
npm test
```

Outros modos úteis:

```bash
npm run test:ui       # modo interativo (Playwright UI)
npm run test:headed   # roda com browser visível
npm run report        # abre o último relatório HTML
```

## Como ver os resultados dos testes

Depois de rodar `npm test`, o Playwright gera 2 pastas na raiz do projeto
(ambas ignoradas pelo git, ver `.gitignore`):

```
playwright-report/   # relatório HTML final
test-results/        # artefatos brutos de cada teste (screenshot, vídeo, trace)
```

### Relatório HTML (visão geral)

```bash
npm run report
```

Abre uma página no navegador com a lista de todos os testes, status
(passou/falhou), tempo de execução e um resumo por arquivo. É o ponto de
partida para ver o resultado geral da suíte.

### Screenshot e vídeo de um teste específico

Cada teste tem sua própria subpasta dentro de `test-results/`, nomeada a
partir do arquivo e do nome do teste. Dentro dela:

- `test-failed-1.png`: screenshot do momento em que a asserção falhou.
- `video.webm`: gravação da execução inteira daquele teste, do início ao
  fim.
- `error-context.md`: um resumo em texto do estado da página no momento
  do erro.

Dá pra abrir o `.png` e o `.webm` direto num visualizador de imagem/vídeo
qualquer, sem precisar do Playwright.

### Trace (o mais detalhado)

O trace é uma gravação completa da execução: timeline de ações, DOM em
cada passo, requisições de rede, console. Pra abrir:

```bash
npx playwright show-trace test-results/<pasta-do-teste>/trace.zip
```

Isso abre o Trace Viewer no navegador, com um player que permite andar
passo a passo pela execução do teste.

### Modo interativo (ver rodando ao vivo)

```bash
npm run test:ui
```

Abre a interface do Playwright com a lista de testes, permitindo rodar um
por um e ver o navegador em tempo real, sem precisar esperar o relatório
final.

## Estrutura

```
tests/
  api.spec.ts          # contrato de /data.json e /metadata.json
  header.spec.ts        # RN1, header com informações da máquina
  charts.spec.ts        # RN2, 3 gráficos, séries, eixos, refresh de dados
  tooltip.spec.ts        # RN4, tooltip ao hover
  journey.spec.ts        # jornada macro ponta-a-ponta + smoke de console
  support/
    api-fixtures.ts       # fixture que captura as respostas de API por load
    selectors.ts           # seletores centralizados (texto + classes Highcharts)
docs/
  defects.md               # defeitos encontrados, com evidência e severidade
  questions-to-designer.md # requisitos não especificados no Figma/desafio
```

## Estratégia de teste

- **Framework**: Playwright. Escolhido por trace viewer nativo, suporte a
  rede (`waitForResponse`) sem precisar de mocks para validar contrato de
  API, e por ser o padrão de mercado atual para e2e web.
- **Seletores**: o app é React + MUI sem `data-testid`; as classes MUI são
  hashes de build (`css-1f62mcz`) e não são estáveis. Por isso os testes
  usam texto visível (`getByText`) para header/títulos e classes nativas do
  Highcharts (`.highcharts-container`, `.highcharts-legend-item`,
  `.highcharts-tooltip`) para os gráficos: essas vêm da lib, não do
  bundler do app, então são estáveis entre builds.
- **Defeitos conhecidos**: em vez de só listar em texto, cada defeito
  automatizável tem um teste normal (`test(...)`) que afirma o
  comportamento CORRETO esperado. Ele aparece como **FAIL** no relatório
  enquanto o bug existir, com screenshot/vídeo/trace do erro real anexados.
  Deliberadamente **não** usamos `test.fail(...)`: esse helper do Playwright
  inverte o resultado e reporta "passou" quando o teste falha como
  esperado, o que esconderia o defeito atrás de um verde enganoso. Aqui o
  vermelho é o sinal correto. Quando o dev corrigir o bug, o teste passa a
  ficar verde sozinho. Ver `docs/defects.md`.
- **Fora do escopo automatizado**: inconsistência de idioma no tooltip (data
  em inglês) tem teste, mas é sensível a locale/versão de lib, então
  documentada com mais detalhe em texto por ser mais confiável para reportar.
- **Balanceamento robustez x tempo**: suíte roda 1 browser (chromium) por
  padrão; firefox/webkit comentados no `playwright.config.ts` para rodar
  antes de uma entrega final, não em todo CI run.

## Achados relevantes (resumo, detalhe em docs/)

1. Header mostra `"null min"` em vez de um valor de intervalo (API retorna
   `interval: null`, UI não trata).
2. 4 pontos da série `accelerationRms/x` trazem `max: "null"` (string) em
   vez de número/null real.
3. Data do tooltip aparece em inglês; resto da UI está em PT-BR.
4. Doc do desafio descreve endpoints `/data` e `/metadata`; implementação
   real usa `/data.json` e `/metadata.json`.


