# Plano de Testes

## Visão Geral do Produto
A aplicação sob teste é o dashboard disponível em https://frontend-test-for-qa.vercel.app/. Ela carrega metadados de `metadata.json` e o conjunto de `data.json` renderiza na interface.

## Requisitos Funcionais
- Exibir um título de página do dashboard e os metadados da máquina.
- Renderizar três seções de gráfico: Aceleração RMS, Temperatura e Velocidade RMS.
- Carregar os dados de séries temporais a partir de `data.json`.
- Carregar os metadados a partir de `metadata.json`.
- Atualizar os dados da interface quando a página for recarregada.
- Exibir tooltips dos gráficos ao passar o mouse, se a implementação do gráfico suportar.


## Matriz de Rastreabilidade
| Requisito | Cobertura de Teste | Suite de Teste |
| --- | --- | --- |
| A página do dashboard é renderizada com sucesso | Verificar que o título da página e a interface principal estão visíveis | `tests/smoke/smoke_dashboard.robot` |
| Metadados do cabeçalho estão visíveis | Verificar que máquina, ponto, rpm, faixa dinâmica e intervalo são renderizados | `tests/header/header_display.robot` |
| Três gráficos estão visíveis | Verificar que os três títulos de gráfico estão presentes | `tests/smoke/smoke_dashboard.robot`, `tests/charts/charts_tooltip.robot` |
| Valores da UI coincidem com o contrato de metadados da API | Comparar valores da UI com `metadata.json` | `tests/header/header_display.robot` |
| Contrato da API para metadados | Validar a estrutura do payload de `metadata.json` | `tests/api/api_metadata.robot` |
| Contrato da API para gráficos | Validar a estrutura do payload de `data.json` | `tests/api/api_data.robot` |
| Comportamento de refresh ao recarregar | Garantir que o reload da página dispare as mesmas requisições novamente | `tests/refresh/refresh_on_access.robot` |
| Interação de hover nos gráficos | Verificar o comportamento do tooltip ao passar o mouse no primeiro gráfico | `tests/charts/charts_tooltip.robot` |


### Cenários positivos
- O dashboard abre com sucesso e mostra o título `Análise de dados`.
- Os cards de metadados exibem os valores `Máquina 1023`, `Ponto 20192`, `200`, `16g` e `null min`(Cenário positivo: valor exato exibido retornado da API) .
- Os três títulos de gráficos estão visíveis no carregamento inicial.
- `metadata.json` retorna HTTP 200 e contém as chaves esperadas.
- `data.json` retorna HTTP 200 e contém ao menos três séries com pontos de timestamp/valor.
- O recarregamento da página dispara novamente as requisições para `metadata.json` e `data.json`.

### Cenários negativos
- `metadata.json` retorna um status diferente de 200 ou estrutura malformada.
- `data.json` retorna um conjunto de dados vazio ou malformado.
- Um dos três títulos de gráfico está ausente.
- Os valores dos metadados na UI não coincidem com o payload da API: `null min`(Cenário negativo: valor null exibido retornado da API, aberto um BUG REPORT para verificação do valor indisponível).
- Tooltips não são exibidos ao passar o mouse sobre a área do gráfico.
- A aplicação não atualiza os dados após o recarregamento.

### Detalhes Notáveis
- `interval` é `null` no payload e a UI deve renderizá-lo de forma segura.
- O backend retorna um conjunto de campos inesperados ou um array vazio de pontos.
- As séries do gráfico contêm um grande número de pontos e são renderizadas sem quebrar a interface.


## Lacunas de Requisitos Identificadas
- O requisito não define em detalhe o conteúdo esperado do tooltip.
- Não existe um critério de aceitação explícito para valores de metadados vazios ou nulos.
- O requisito não define o comportamento de fallback quando um gráfico ou requisição de API falha.
- Acessibilidade, navegação por teclado e comportamento responsivo não estão especificados.


## Defeitos
- Valores do cabeçalho não coincidem com o payload retornado por `metadata.json` / Valores com retorno `null`.
- A UI exibe o intervalo `null` de forma incorreta ou sem tratamento.
- Uma ou mais seções de gráfico não são renderizadas conteúdos.
- O comportamento do tooltip é inconsistente ou está quebrado ao passar o mouse no segundo gráfico.


## Estratégia de Execução
- Iniciar pelos testes de smoke para carregamento da página e presença dos gráficos.
- Validar os dados da API de forma independente.
- Comparar os valores da UI com os payloads do backend.
- Adicionar testes de acesso repetido para garantir o comportamento de refresh.
- Manter testes independentes e de fácil manutenção.


## Resumo da Execução de Testes Automatizados (2026-07-28)
- Total de testes executados: 6
- Passaram: 5
- Falharam: 1 (interação do tooltip do gráfico)
- Relatórios: `reports/report.html`, `reports/log.html`, `reports/output.xml`


## Notas de Manutenção
- Centralizar seletores em `resources/variables/Locators.robot`.
- Manter ações reutilizáveis do navegador em `resources/keywords/BrowserKeywords.robot`.
- Manter asserções reutilizáveis de API em `resources/keywords/ApiKeywords.robot`.
- Manter comportamento específico de páginas em `resources/pages/`.


## Observações sobre o caso que falhou
A interação do tooltip do gráfico não produziu o nó DOM esperado nas execuções automatizadas. O comportamento foi registrado como um defeito do produto: consulte `documentation/BUG_REPORTS/TOOLTIP_MISSING.md` para o relatório formal e ações recomendadas para os desenvolvedores.
