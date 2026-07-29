# Template de Feedback de Design

## Resumo
O dashboard é de fácil uso, mas alguns critérios de aceitação permanecem implícitos e devem ser esclarecidos para futuras implementações.

## Pontos Positivos
- A página separa claramente os metadados da máquina e o conteúdo dos gráficos.
- Os endpoints da API são simples e fáceis de validar.
- Protótipo claro com fácil identificação do itens principais.

## Observações
- Os requisitos não definem o conteúdo exato do tooltip nem o comportamento de hover esperado pelo usuário.
- Não há comportamento de fallback especificado para requisições de API falhas ou dados de séries ausentes.

## Recomendações
- Documentar a estrutura e o texto esperado do tooltip.
- Definir o comportamento para valores de metadados nulos/vazios.
- Esclarecer se os gráficos devem suportar navegação por teclado e rótulos para leitores de tela.

## Questionamentos de exemplo para o Designer
- O que o tooltip deve mostrar para um ponto em hover: valor, tempo e unidade?
- Um valor ausente ou nulo deve ser renderizado como `N/A` em vez de `null`?
- Qual é o comportamento esperado quando `metadata.json` ou `data.json` falha ao carregar?

## Áreas de Risco
- A interpretação do comportamento do tooltip pode variar entre desenvolvedores e testadores.
- Valores nulos podem ser renderizados de forma inconsistente entre navegadores.
- O comportamento de atualização de dados deve ser explicitamente documentado para recarregamentos repetidos.
