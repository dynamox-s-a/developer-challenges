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

## #3: Data do tooltip em inglês, resto da UI em PT-BR

- **Onde**: tooltip ao hover em qualquer um dos 3 gráficos.
- **Esperado**: consistência de idioma. Toda a UI está em PT-BR
  ("Análise de dados", "Aceleração RMS", "Máquina", "Ponto"...).
- **Real**: a data formatada pelo Highcharts aparece em inglês, ex.
  `"Tuesday, Nov 7, 11:59:08 PM"`.
- **Por que documentar em vez de confiar só no teste automatizado**: o
  formato de data do Highcharts depende de config de locale que pode mudar
  com a versão da lib ou do browser rodando o CI. O teste em
  `tooltip.spec.ts` cobre o caso hoje, mas o time deve tratar isso como
  achado principal, não só "teste passou/falhou".
- **Sugestão de correção**: configurar `Highcharts.setOptions({ lang: { ... } })`
  com locale PT-BR, ou formatar a data manualmente no `tooltip.formatter`.
- **Severidade sugerida**: baixa (cosmético, mas fica muito visível).

## #4: Tooltip não aparece no gráfico de Temperatura

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
