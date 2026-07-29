# Relatório de Bug: Tooltip do Gráfico Não Renderizado ao Passar o Mouse

## Resumo
O tooltip não aparece no DOM ao passar o mouse sobre o segundo gráfico de séries temporais (Highcharts) no dashboard em https://frontend-test-for-qa.vercel.app/. Isso impede que os usuários visualizem detalhes ponto a ponto ao posicionar o cursor e falha no critério de aceitação "ao passar o mouse sobre a série temporal, mostrar um tooltip exibindo os valores dos dados".

## Severidade
Crítica - afeta a principal interação para inspeção de dados no gráfico.

## Ambiente
- URL da aplicação: https://frontend-test-for-qa.vercel.app/
- Navegador usado nos testes: Playwright Chromium (via Robot Framework Browser Library)
- Plataforma: Ambiente de testes local (Windows)
- Data/hora: 2026-07-28

## Passos para Reproduzir (automatizado)
1. Abra a página do dashboard.
2. Aguarde os metadados e os dados serem renderizados.
3. Passe o mouse sobre a área do primeiro gráfico (Aceleração RMS).
4. Observe o DOM em busca do elemento `.highcharts-tooltip`.

Teste automatizado: tests/charts/charts_tooltip.robot

## Resultado Observado
Nenhum elemento `.highcharts-tooltip` está presente no DOM após passar o mouse sobre o gráfico. O teste automatizado falha com a mensagem: "Tooltip was not rendered on chart hover. This behavior should be reported as a product defect.".

## Resultado Esperado
Um elemento de tooltip deve ser renderizado (por exemplo, `.highcharts-tooltip`) contendo os dados do ponto sobre o qual o cursor está posicionado (timestamp e valor) e visível ao usuário.

## Impacto
- Usuários não conseguem inspecionar pontos únicos de dados visualmente via hover.
- Isso limita a capacidade de exploração de dados da aplicação e reduz a confiança na interatividade dos gráficos.
- A verificação automatizada de tooltips falhará até que o comportamento seja corrigido.

## Evidências
- Resumo da execução dos testes: 6 testes executados — 5 passaram, 1 falhou (tooltip do gráfico).
- Relatório do Robot Framework: reports/report.html

## Notas de Depuração / Observações
- Os gráficos são renderizados com Highcharts (Highcharts 12.2.0 referenciado na UI).
- A página renderiza SVGs de gráfico e containers do Highcharts, mas o nó do tooltip no DOM não é criado no hover durante os testes automatizados.
- A inspeção manual em um navegador real pode apresentar comportamento diferente; recomenda-se verificações cross-browser adicionais.

## Próximos Passos Sugeridos para Desenvolvedores
1. Reproduzir o problema localmente e em ambiente de desenvolvimento usando as ferramentas de desenvolvedor do navegador.
2. Verificar a configuração do Highcharts: garantir que `tooltip.enabled` esteja com valor padrão true e que não existam CSS ou JavaScript impedindo a renderização do tooltip.
3. Verificar se os listeners de eventos para mousemove/mouseover estão anexados e recebem eventos quando usados com Playwright / modo headless.
4. Testar em uma sessão não-headless para confirmar se o modo headless afeta a criação do tooltip no DOM.
5. Fornecer um exemplo pequeno e reproduzível ou teste unitário para a configuração do gráfico.

## Prioridade Sugerida
P1 — alta prioridade para que o produto cumpra o critério de aceitação.

## Reportado por
QA Automation

---

Ver também: `documentation/TEST_PLAN.md` e o teste automatizado `tests/charts/charts_tooltip.robot` para contexto.