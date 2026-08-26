# Defects found

Each item below has a corresponding automated test that asserts the
CORRECT expected behavior, and therefore shows up as **FAIL** in the
Playwright report while the bug exists (screenshot/video/trace attached
to the error). We deliberately do not use `test.fail(...)`: that helper
inverts the result and shows "passed" when the failure is the expected
one, which would hide the defect behind a misleading green. #3 is also
sensitive to browser locale, so it is documented here as the main
evidence, in addition to the test.

## #1: Collection interval shown as "null min"

- **Where**: header, last field (clock icon).
- **Expected (Figma)**: a numeric value, e.g. "30 min".
- **Actual**: `metadata.json` returns `"interval": null`, and the UI does
  not handle that case, it concatenates the raw value with "min",
  resulting in `"null min"`.
- **Evidence**: `tests/header.spec.ts` and `tests/api.spec.ts`.
- **Suggested fix**: when `interval` is `null`/missing, hide the field or
  show a placeholder ("-"), never render the raw value.
- **Suggested severity**: low/medium (does not block usage, but is
  visible and gives the end user the impression of a bug).

## #2: Data points with `"max": "null"` (string) instead of number/null

- **Where**: `data.json`, series `accelerationRms/x`, 4 out of 181 points.
- **Expected**: `max` should always be `number`, or real `null` (not the
  string `"null"`), for the client to handle it consistently.
- **Actual**: a mix of `number` and the literal string `"null"` in the
  same series; the other 6 series don't have this problem.
- **Observed impact on the chart**: could not reproduce it visually with
  certainty (Highcharts appears to coerce it to 0 at that point), but it
  is not a guaranteed behavior, it can vary by engine/library version.
- **Evidence**: `tests/api.spec.ts`.
- **Suggested fix**: fix it at the data source (API/mock); on the client
  side, validate/normalize `max` before passing it to Highcharts.

## Context shared by #3 and #4: the API sends no language information at all

We checked `data.json` directly: each point only carries a raw ISO 8601
date, e.g. `"2023-11-07T11:53:38.187Z"`. There is no language field,
spelled-out month, or weekday coming from the API. All formatting
(weekday, month, AM/PM) is done 100% on the client, by Highcharts'
default locale (English), which was not configured for PT-BR. In other
words, this is not a data problem, it is purely a front-end configuration
issue.

## #3: Tooltip weekday shows up in English

- **Where**: tooltip on hover, in any of the 3 charts.
- **Expected**: there is no explicit rule in the Figma prototype or the
  challenge doc about the tooltip's weekday language specifically (the
  prototype has no hover state designed). The expectation here comes only
  from consistency with the rest of the UI, which is 100% PT-BR. See the
  open question in `docs/questions-to-designer.md`.
- **Actual**: the weekday shows up in English, e.g. `"Tuesday, Nov 7,
  11:59:08 PM"`.
- **Evidence**: `tests/tooltip.spec.ts`, test 26.
- **Suggested fix**: configure `Highcharts.setOptions({ lang: { ... } })`
  with a PT-BR locale, or format the date manually in
  `tooltip.formatter`.
- **Suggested severity**: low (cosmetic, and the rule itself is not
  confirmed with the design team).

## #4: Tooltip month shows up in English, contradicting the Figma prototype itself

- **Where**: tooltip on hover, in any of the 3 charts.
- **Expected**: unlike #3, here there is concrete evidence in Figma. The
  X axis of the 3 charts in the prototype shows months abbreviated in
  Portuguese: `"31. Mai"`, `"1. Jun"`, `"2. Jun"`... This confirms the
  intended month format for the application is PT-BR, it is not a UX
  assumption.
- **Actual**: the tooltip shows the month in English. Point used to
  confirm it (a December point, where the abbreviation genuinely differs
  between the two languages): `"Friday, Dec 1, 05:02:42 AM"`. It should
  be `"Dez"`, not `"Dec"`. ("Nov" alone proves nothing, the abbreviation
  is the same in both languages.)
- **Evidence**: `tests/tooltip.spec.ts`, test 27.
- **Suggested fix**: same as #3, configuring a PT-BR locale globally on
  Highcharts fixes both at once.
- **Suggested severity**: medium (unlike #3, this one contradicts an
  explicit definition in the prototype, it's not just a perceived
  inconsistency).

## #5: Tooltip never appears on the Temperatura chart

- **Where**: the "Temperatura" chart (2nd chart on the page).
- **Expected (challenge RN4)**: "as a user, when hovering over the time
  series, I want to see a tooltip displaying the data values."
- **Actual**: the point is highlighted correctly (the marker lights up
  exactly under the cursor, confirmed visually at multiple points in the
  series, including well-defined peaks), but the tooltip box
  (`.highcharts-tooltip`) never renders. The other 2 charts (Aceleração
  RMS and Velocidade RMS) work normally.
- **Evidence**: `tests/tooltip.spec.ts` (shows up as FAIL), also
  reproduced manually via real mouse hover (not just via automation).
- **Hypothesis**: the "Temperatura" series only has 1 data series
  (unlike the others, which have 3: Axial, Horizontal, Radial). It could
  be a `tooltip.shared`/`crosshair` configuration issue specific to that
  chart, or the component rendering that chart uses a different prop by
  mistake.
- **Suggested severity**: medium/high, breaks an explicit product
  requirement (RN4) for 1 of the 3 charts.

## Spec divergence (not a bug, outdated doc)

The challenge describes the endpoints as `GET /data` and `GET /metadata`.
In the actual implementation, the app calls `GET /data.json` and
`GET /metadata.json`. It does not affect functionality, but it is worth
reporting to the team to keep the challenge doc aligned with the
reference app.

---

# Defeitos encontrados

Cada item abaixo tem um teste automatizado correspondente que afirma o
comportamento CORRETO esperado e por isso aparece como **FAIL** no
relatório do Playwright enquanto o bug existir (screenshot/vídeo/trace
anexados ao erro). Não usamos `test.fail(...)` de propósito: esse helper
inverte o resultado e mostra "passou" quando a falha é a esperada, o que
esconderia o defeito atrás de um verde enganoso. O #3 também é sensível a
locale do navegador e por isso é documentado aqui como principal evidência,
além do teste.

## #1: Intervalo de coleta exibido como "null min"

- **Onde**: header, último campo (ícone de relógio).
- **Esperado (Figma)**: um valor numérico, ex. "30 min".
- **Real**: `metadata.json` retorna `"interval": null`, e a UI não trata esse
  caso, concatena o valor bruto com "min", resultando em `"null min"`.
- **Evidência**: `tests/header.spec.ts` e `tests/api.spec.ts`.
- **Sugestão de correção**: quando `interval` for `null`/ausente, esconder o
  campo ou mostrar um placeholder ("-"), nunca renderizar o valor cru.
- **Severidade sugerida**: baixa/média (não bloqueia o uso, mas é visível e
  passa impressão de bug para o usuário final).

## #2: Pontos de dados com `"max": "null"` (string) em vez de número/null

- **Onde**: `data.json`, série `accelerationRms/x`, 4 dos 181 pontos.
- **Esperado**: `max` deveria ser sempre `number`, ou `null` real (não a
  string `"null"`), para o client tratar de forma consistente.
- **Real**: mistura de `number` e da string literal `"null"` na mesma série;
  as outras 6 séries não têm esse problema.
- **Impacto observado no gráfico**: não foi possível reproduzir visualmente
  com certeza (o Highcharts parece coagir para 0 nesse ponto), mas é um
  comportamento não garantido, pode variar por engine/versão da lib.
- **Evidência**: `tests/api.spec.ts`.
- **Sugestão de correção**: corrigir na origem dos dados (API/mock); do lado
  do client, validar/normalizar `max` antes de repassar ao Highcharts.

## Contexto comum aos #3 e #4: a API não manda nenhuma informação de idioma

Verificamos `data.json` diretamente: cada ponto traz só uma data ISO 8601
crua, ex. `"2023-11-07T11:53:38.187Z"`. Não há campo de idioma, mês por
extenso ou dia da semana vindo da API. Toda a formatação (dia da semana,
mês, AM/PM) é feita 100% no client, pelo locale padrão do Highcharts
(inglês), que não foi configurado para PT-BR. Ou seja, isso não é um
problema de dado, é puramente configuração de front-end.

## #3: Dia da semana do tooltip aparece em inglês

- **Onde**: tooltip ao hover em qualquer um dos 3 gráficos.
- **Esperado**: não há uma regra explícita no Figma ou no desafio sobre o
  idioma do dia da semana no tooltip especificamente (o protótipo não tem
  um estado de hover desenhado). A expectativa aqui vem só de consistência
  com o resto da UI, que é 100% PT-BR. Ver pergunta aberta em
  `docs/questions-to-designer.md`.
- **Real**: o dia da semana aparece em inglês, ex. `"Tuesday, Nov 7,
  11:59:08 PM"`.
- **Evidência**: `tests/tooltip.spec.ts`, teste 26.
- **Sugestão de correção**: configurar `Highcharts.setOptions({ lang: { ... } })`
  com locale PT-BR, ou formatar a data manualmente no `tooltip.formatter`.
- **Severidade sugerida**: baixa (cosmético, e a regra em si não está
  confirmada com o time de design).

## #4: Mês do tooltip aparece em inglês, contrariando o próprio protótipo Figma

- **Onde**: tooltip ao hover em qualquer um dos 3 gráficos.
- **Esperado**: diferente do #3, aqui existe evidência concreta no Figma.
  O eixo X dos 3 gráficos no protótipo mostra os meses abreviados em
  português: `"31. Mai"`, `"1. Jun"`, `"2. Jun"`... Isso confirma que o
  formato de mês pretendido para a aplicação é PT-BR, não é suposição de
  UX.
- **Real**: o tooltip mostra o mês em inglês. Ponto usado para confirmar
  (mês de dezembro, onde a abreviação diverge de verdade entre os
  idiomas): `"Friday, Dec 1, 05:02:42 AM"`. Deveria ser `"Dez"`, não
  `"Dec"`. ("Nov" sozinho não prova nada, a abreviação é igual nos dois
  idiomas.)
- **Evidência**: `tests/tooltip.spec.ts`, teste 27.
- **Sugestão de correção**: mesma do #3, configurar locale PT-BR no
  Highcharts globalmente resolve os dois ao mesmo tempo.
- **Severidade sugerida**: média (diferente do #3, este contraria uma
  definição explícita do protótipo, não é só inconsistência percebida).

## #5: Tooltip não aparece no gráfico de Temperatura

- **Onde**: gráfico "Temperatura" (2º gráfico da página).
- **Esperado (RN4 do desafio)**: "ao passar o mouse sobre a série temporal,
  quero ver um tooltip exibindo os valores do dado".
- **Real**: o ponto é destacado corretamente (o marker acende exatamente
  sob o cursor, confirmado visualmente em múltiplos pontos da série,
  inclusive em picos bem definidos), mas a caixa de tooltip
  (`.highcharts-tooltip`) nunca é renderizada. Os outros 2 gráficos
  (Aceleração RMS e Velocidade RMS) funcionam normalmente.
- **Evidência**: `tests/tooltip.spec.ts` (aparece como FAIL), reproduzido também
  manualmente via hover real do mouse (não só via automação).
- **Hipótese**: a série "Temperatura" tem apenas 1 série de dados
  (diferente das outras, que têm 3: Axial, Horizontal, Radial). Pode ser um
  problema de configuração de `tooltip.shared`/`crosshair` específico
  desse chart, ou o componente que renderiza esse gráfico usa uma prop
  diferente por engano.
- **Severidade sugerida**: média/alta, quebra um requisito de produto
  explícito (RN4) para 1 dos 3 gráficos.

## Divergência de especificação (não é bug, é doc desatualizado)

O desafio descreve os endpoints como `GET /data` e `GET /metadata`. Na
implementação real, o app chama `GET /data.json` e `GET /metadata.json`.
Não afeta o funcionamento, mas reportar ao time para manter a doc do
desafio alinhada com o app de referência.
