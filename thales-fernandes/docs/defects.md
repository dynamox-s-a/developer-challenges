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
