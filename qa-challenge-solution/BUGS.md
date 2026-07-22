# Relatório de Defeitos e Qualidade (Bug Report)

## [BUG-01] Ausência de Tooltip no Gráfico de Temperatura

* User Story Afetada: US04 - Interatividade e Tooltip nos Gráficos
* Componente: Temperatura (°C)
* Arquivo de Teste: cypress/e2e/04-interatividade-tooltip.cy.js
* Status da Automação: Falhando

### Descrição
Ao realizar a ação de hover (mouseover) sobre a série temporal do gráfico de Temperatura, identifiquei que a interface destaca visualmente o ponto ativo (marcador circular/halo), porém não renderiza a caixa explicativa de tooltip com a data e o valor da medição. 

Nos gráficos de Aceleração RMS e Velocidade RMS, o recurso está funcional.

---

### Análise de Causa Raiz e Investigação Técnica (DevTools)
Durante a fase de testes exploratórios e diagnóstico da automação, fiz a inspeção direta do DOM congelando o estado do navegador via debugger (executando um setTimeout no Console):

1. Validação do DOM/SVG: Verifiquei que o elemento do tooltip no Highcharts é injetado como um grupo SVG dinamicamente (<g class="highcharts-label highcharts-tooltip">).
2. Gráfico de Temperatura (Com Defeito): Ao congelar a tela sobre a linha de Temperatura, notei que o Highcharts ativa a classe do ponto (path.highcharts-point), mas não insere a tag SVG do tooltip no DOM, confirmando uma falha de configuração/implementação no código de frontend.
3. Gráficos de Aceleração RMS e Velocidade RMS: Inspecionei ambos e confirmei que possuem a tag do tooltip configurada e funcional no DOM.

---

### Minhas Considerações sobre a Automação (Cypress)
* Comportamento Esperado: O teste do gráfico de Temperatura falha para expor a ausência do requisito (BUG-01), enquanto Aceleração e Velocidade passam.
* Limitação de Disparo Sintético: Por se tratar de uma biblioteca de terceiros (Highcharts) rodando em contexto privado e renderizada em SVG com a propriedade pointer-events: none, o disparo de eventos sintéticos (.trigger('mouseover')) esbarra em limitações de coordenadas.
* Minha Decisão de Automação: Decidi manter a estrutura de teste padrão e transparente cobrindo todos os gráficos no arquivo 04-interatividade-tooltip.cy.js. A falha no gráfico de Temperatura reflete diretamente o defeito funcional encontrado e comprovado no DevTools.

---

### Processo de Reporte ao Time (Dev & Product/Design)
Caso estivesse em um ciclo real de sprint, reportaria este defeito ao time através do seguinte fluxo:
* Ao Desenvolvedor: Abriria uma issue detalhando o ambiente, o passo a passo de reprodução, os prints do DevTools provando a ausência do nó `<g class="highcharts-tooltip">` no SVG e a evidência da falha do teste Cypress em headless.
* Ao Product Owner / Designer: Questionaria via canal oficial se a ausência de tooltip no gráfico de linha única (Temperatura) foi uma decisão deliberada de UX/regra de negócio ou um esquecimento na passagem de props do componente no frontend.

---

### Passos para Reprodução
1. Acessar a aplicação https://frontend-test-for-qa.vercel.app.
2. Posicionar o cursor do mouse sobre a linha verde do gráfico de Temperatura.
3. Observar a ausência da caixa com as informações da medição.

### Resultado Esperado
Exibição da tag SVG g.highcharts-tooltip visível, contendo a data e a medição em °C.

### Resultado Atual
O nó g.highcharts-tooltip não é gerado na árvore DOM do container de Temperatura, resultando em falha por timeout no teste automatizado.