# QA Challenge, Dynamox

Automated tests (Playwright + TypeScript) for the Dynamox QA challenge: a
web app that displays vibration and temperature sensor data for a
monitored machine.

- App under test: https://frontend-test-for-qa.vercel.app/
- Figma prototype: https://www.figma.com/file/QxUZkTUIzQA7cvyiMvVyxK/Front-end---Teste

## How to run

```bash
npm install
npx playwright install --with-deps chromium
npm test
```

Other useful modes:

```bash
npm run test:ui       # interactive mode (Playwright UI)
npm run test:headed   # runs with a visible browser
npm run report        # opens the last HTML report
```

## How to view test results

After running `npm test`, Playwright generates 2 folders at the project
root:

```
playwright-report/   # final HTML report
test-results/        # raw artifacts per test (screenshot, video, trace)
```

### HTML report (overview)

```bash
npm run report
```

Opens a page in the browser with the list of all tests, status
(passed/failed), execution time and a per-file summary. This is the
starting point for the overall result of the suite.

### Screenshot and video for a specific test

Each test has its own subfolder inside `test-results/`, named after the
file and the test name. Inside it:

- `test-failed-1.png`: screenshot of the moment the assertion failed.
- `video.webm`: recording of the entire test run, start to finish.
- `error-context.md`: a text summary of the page state at the time of
  the error.

The `.png` and `.webm` can be opened directly in any image/video viewer,
no Playwright needed.

### Trace (most detailed)

The trace is a full recording of the run: action timeline, DOM at each
step, network requests, console. To open it:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

This opens the Trace Viewer in the browser, with a player that lets you
step through the test run.

### Interactive mode (watch it run live)

```bash
npm run test:ui
```

Opens the Playwright interface with the list of tests, letting you run
them one by one and watch the browser in real time, without waiting for
the final report.

## Structure

```
tests/
  api.spec.ts          # /data.json and /metadata.json contract
  header.spec.ts        # RN1, header with machine information
  charts.spec.ts        # RN2, 3 charts, series, axes, data refresh
  tooltip.spec.ts        # RN4, tooltip on hover
  journey.spec.ts        # macro end-to-end journey + console smoke test
  support/
    api-fixtures.ts       # fixture that captures API responses per load
    selectors.ts           # centralized selectors (text + Highcharts classes)
docs/
  defects.md               # defects found, with evidence and severity
  questions-to-designer.md # requirements not specified in Figma/challenge
```

## Test strategy

- **Framework**: Playwright. Chosen for its native trace viewer, network
  support (`waitForResponse`) without needing mocks to validate the API
  contract, and for being the current market standard for e2e web
  testing.
- **Selectors**: the app is React + MUI with no `data-testid`; the MUI
  classes are build hashes (`css-1f62mcz`) and not stable. So the tests
  use visible text (`getByText`) for header/titles and native Highcharts
  classes (`.highcharts-container`, `.highcharts-legend-item`,
  `.highcharts-tooltip`) for the charts: those come from the library, not
  the app's bundler, so they stay stable across builds.
- **Known defects**: instead of only listing them in text, each
  automatable defect has a normal test (`test(...)`) that asserts the
  CORRECT expected behavior. It shows up as **FAIL** in the report while
  the bug exists, with a real screenshot/video/trace of the error
  attached. We deliberately do **not** use `test.fail(...)`: that
  Playwright helper inverts the result and reports "passed" when the test
  fails as expected, which would hide the defect behind a misleading
  green. Here red is the correct signal. Once the dev fixes the bug, the
  test turns green on its own. See `docs/defects.md`.
- **Out of automated scope**: the tooltip language inconsistency (English
  date) has a test, but it is sensitive to locale/library version, so it
  is documented in more detail in text as a more reliable way to report
  it.
- **Robustness vs. time trade-off**: the suite runs 1 browser (chromium)
  by default; firefox/webkit are commented out in `playwright.config.ts`
  to run before a final delivery, not on every CI run.

## Relevant findings (summary, detail in docs/)

1. Header shows `"null min"` instead of an interval value (API returns
   `interval: null`, UI does not handle it).
2. 4 points in the `accelerationRms/x` series carry `max: "null"` (string)
   instead of a real number/null.
3. The tooltip date shows up in English; the rest of the UI is in PT-BR.
4. The challenge doc describes the endpoints as `/data` and `/metadata`;
   the actual implementation uses `/data.json` and `/metadata.json`.

---

# QA Challenge, Dynamox (Português)

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

Depois de rodar `npm test`, o Playwright gera 2 pastas na raiz do projeto:

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
