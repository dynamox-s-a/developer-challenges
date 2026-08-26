# Points to align with Product/Design

Requirements observed in the implementation that are not specified in the
Figma prototype nor in the challenge statement:

1. **API error behavior**: what should the UI show if `/data.json` or
   `/metadata.json` fails (timeout, 500, malformed JSON)? Today there is
   no visible error state specified in either document.
2. **Empty state**: if a series comes back with no points, should the
   chart disappear, show "no data", or render empty?
3. **Legend series toggle**: Highcharts lets you click the legend to
   hide/show a series (default library behavior). Is this intentional as
   part of the product, or is it just a side effect of the library that
   design never thought about? If it's intentional, it should be
   documented in Figma.
4. **Field `interval: null`**: is it expected that the API sends `null`
   in some real scenario (e.g. a newly registered machine, no readings
   yet)? If so, Figma should have that state specified, today it only
   shows the happy path ("30 min").
5. **Tooltip weekday language**: there is no explicit rule anywhere
   (Figma or the challenge) about the tooltip's weekday specifically.
   Unlike the month (which Figma defines as PT-BR on the X axis: "31.
   Mai", "1. Jun"), the tooltip itself has no hover state designed in the
   prototype. The expectation that the weekday should also be PT-BR comes
   only from consistency with the rest of the UI, it is not a confirmed
   requirement. Worth confirming with the team whether this is expected.
6. **Decimal places in the tooltip**: today the tooltip shows the raw
   value with no rounding at all, and this varies a lot depending on the
   metric:
   - Aceleração RMS: `"Radial: 0.03125 g"` (5 decimal places, the raw
     `data.json` value is a "clean" fraction, a power of 2).
   - Velocidade RMS: `"Radial: 4.810673076923077 mm/s"` (**15 decimal
     places**), because the raw `data.json` value already comes like that
     (`0.2829807692307692` at another point in the same series, for
     example).
   This is clearly unintentional, no design would define 15 decimal
   places on purpose. There is no fixed pattern today. What is the
   expected number of decimal places for each metric (acceleration,
   velocity, temperature)? Suggestion: normalize it on the client before
   passing it to Highcharts (e.g. `Number(value.toFixed(2))`), since the
   data source (mock/API) doesn't seem to control this.

---

# Pontos para alinhar com Produto/Design

Requisitos observados na implementação que não estão especificados no
protótipo Figma nem no enunciado do desafio:

1. **Comportamento de erro de API**: o que a UI deve mostrar se `/data.json`
   ou `/metadata.json` falhar (timeout, 500, JSON malformado)? Hoje não há
   estado de erro visível especificado em nenhum dos dois documentos.
2. **Estado vazio**: se uma série vier sem pontos, o gráfico deve
   desaparecer, mostrar "sem dados" ou renderizar vazio?
3. **Toggle de série na legenda**: o Highcharts permite clicar na legenda
   para esconder/mostrar uma série (comportamento padrão da lib). Isso é
   intencional como parte do produto ou é só um efeito colateral da lib que
   não foi pensado pelo design? Se for intencional, vale documentar no
   Figma.
4. **Campo `interval: null`**: é esperado que a API mande `null` em algum
   cenário real (ex.: máquina recém-cadastrada, sem coletas ainda)? Se sim,
   o Figma deveria ter esse estado especificado, hoje só mostra o caminho
   feliz ("30 min").
5. **Idioma do dia da semana no tooltip**: não há uma regra explícita em
   nenhum lugar (Figma ou desafio) sobre o dia da semana no tooltip
   especificamente. Diferente do mês (que o Figma define como PT-BR no
   eixo X: "31. Mai", "1. Jun"), o tooltip em si não tem um estado de hover
   desenhado no protótipo. A expectativa de que o dia da semana também
   deveria estar em PT-BR vem só de consistência com o resto da UI, não é
   um requisito confirmado. Vale confirmar com o time se isso é esperado.
6. **Casas decimais no tooltip**: hoje o tooltip mostra o valor bruto sem
   nenhum arredondamento, e isso varia muito dependendo da grandeza:
   - Aceleração RMS: `"Radial: 0.03125 g"` (5 casas, o dado bruto no
     `data.json` é uma fração "limpa" tipo potência de 2).
   - Velocidade RMS: `"Radial: 4.810673076923077 mm/s"` (**15 casas
     decimais**), porque o dado bruto no `data.json` já vem assim
     (`0.2829807692307692` em outro ponto da mesma série, por exemplo).
   Isso claramente não é intencional, nenhum design definiria 15 casas
   decimais de propósito. Não há padrão fixo hoje. Qual é o número de
   casas decimais esperado para cada grandeza (aceleração, velocidade,
   temperatura)? Sugestão: normalizar no client antes de passar ao
   Highcharts (ex.: `Number(valor.toFixed(2))`), já que a origem dos dados
   (mock/API) parece não controlar isso.
