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
