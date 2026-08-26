# Out of scope for this submission

Items noticed during exploration that were not automated nor deeply
verified manually, by scope decision (see the challenge itself: "find a
balance between software robustness and test execution time"). Recorded
here for transparency, not to inflate the suite.

## Coverage that could be added

1. **Responsiveness / mobile**: no test covers a small viewport. The
   challenge does not ask for this explicitly, but it is worth
   considering whether the user journey also needs to work on smaller
   screens.
2. **Multiple consecutive reloads**: the current refresh test (RN3)
   validates 1 reload. Testing 2-3 consecutive reloads would strengthen
   the guarantee.
3. **Performance budget**: no test measures the loading time of the 3
   charts.
4. **Basic accessibility**: no check for `alt`, `aria-label`, contrast,
   or keyboard navigation.
5. **Cache-busting on the endpoint**: we did not verify whether
   `/data.json` is called with any anti-cache parameter.

## Manual checks not done

1. **Zoom / range selection on the chart** (Highcharts' default
   click-and-drag behavior): not tested.
2. **Very small screen** (e.g. 375px): only explored on desktop.
3. **Clicking the legend to hide a series**: default library behavior,
   mentioned in `questions-to-designer.md`, but never actually clicked
   to confirm it works.
4. **API down / timeout**: the UI's behavior in this scenario was not
   observed, only asked about in `questions-to-designer.md`.
5. **Non-fatal console warnings**: test 22 only captures fatal errors
   (`pageerror`), not warnings.

---

# Fora do escopo desta entrega

Itens observados durante a exploração que não foram automatizados nem
verificados manualmente a fundo, por decisão de escopo (ver o próprio
desafio: "find a balance between software robustness and test execution
time"). Registrados aqui para transparência, não para inflar a suíte.

## Cobertura que poderia ser adicionada

1. **Responsividade / mobile**: nenhum teste cobre viewport pequeno. O
   desafio não pede explicitamente, mas vale considerar se a jornada do
   usuário também precisa funcionar em telas menores.
2. **Múltiplos reloads seguidos**: hoje o teste de refresh (RN3) valida
   1 reload. Testar 2-3 reloads seguidos reforçaria a garantia.
3. **Orçamento de performance**: nenhum teste mede tempo de carregamento
   dos 3 gráficos.
4. **Acessibilidade básica**: sem verificação de `alt`, `aria-label`,
   contraste ou navegação por teclado.
5. **Cache-busting no endpoint**: não verificamos se `/data.json` é
   chamado com algum parâmetro anti-cache.

## Verificações manuais não feitas

1. **Zoom/seleção de intervalo no gráfico** (comportamento padrão do
   Highcharts ao arrastar sobre o gráfico): não testado.
2. **Tela muito pequena** (ex. 375px): só explorado em desktop.
3. **Clique na legenda para esconder série**: comportamento padrão da
   lib, mencionado em `questions-to-designer.md`, mas nunca clicado de
   fato pra confirmar se funciona.
4. **API fora do ar / timeout**: comportamento da UI nesse cenário não
   foi observado, só perguntado em `questions-to-designer.md`.
5. **Warnings de console não fatais**: o teste 22 só captura erros
   fatais (`pageerror`), não warnings.
