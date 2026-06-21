# Desafio de QA Dynamox - Cypress

Solução de testes automatizados e análise exploratória para a aplicação de monitoramento de sensores da Dynamox.

## Aplicação testada

- [Aplicação web](https://frontend-test-for-qa.vercel.app/)
- [Protótipo no Figma](https://www.figma.com/file/QxUZkTUIzQA7cvyiMvVyxK/Front-end---Teste?type=design&node-id=1001%3A3&mode=design)

## Objetivo

Validar os quatro requisitos funcionais apresentados no desafio:

1. Exibir um header com informações da máquina.
2. Exibir gráficos de Aceleração RMS, Velocidade RMS e Temperatura.
3. Atualizar os dados sempre que a página for acessada.
4. Apresentar valores em um tooltip ao passar o cursor sobre as séries.

Também foram analisados os contratos das APIs, diferenças em relação ao Figma e comportamentos encontrados durante os testes exploratórios.

## Ferramentas utilizadas

- Cypress 15;
- JavaScript;
- `cypress-real-events`;
- Chrome DevTools;
- Postman;
- Git e GitHub.

O Cypress foi escolhido por oferecer suporte a testes end-to-end, interceptação de requisições, validação de APIs e interação com elementos da interface.

O `cypress-real-events` foi utilizado para reproduzir movimentos reais do cursor nos gráficos SVG do Highcharts.

## Estrutura do projeto

```text
qa-cypress-tests/
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── data.cy.js
│   │   │   └── metadata.cy.js
│   │   └── ui/
│   │       ├── app.cy.js
│   │       ├── charts.cy.js
│   │       ├── header.cy.js
│   │       ├── header-interval.cy.js
│   │       └── tooltip.cy.js
│   └── support/
├── docs/
│   ├── bug-reports/
│   ├── evidence/
│   ├── product-design-review.md
│   └── test-cases.md
├── .gitignore
├── cypress.config.js
├── package.json
└── README.md
```

## Pré-requisitos

- Node.js;
- npm;
- acesso à aplicação testada.

## Instalação

Na pasta `qa-cypress-tests`, execute:

```bash
npm ci
```

Também é possível utilizar:

```bash
npm install
```

## Execução

### Modo interativo

```bash
npm run cy:open
```

### Modo headless

```bash
npm test
```

ou:

```bash
npm run cy:run
```

## Cobertura dos requisitos

| Requisito | Cobertura | Resultado |
|---|---|---|
| Header com informações da máquina | UI e contrato de `/metadata.json` | Parcial: intervalo inválido |
| Três gráficos de séries temporais | Títulos, containers, séries e legendas | Atendido |
| Atualização a cada acesso | Requisições iniciais e após reload | Atendido |
| Tooltip com valores | Interação real nos três gráficos | Parcial: Temperatura sem tooltip |

A suíte possui 22 testes automatizados.

## Testes de API

### `/metadata.json`

São validados:

- status da resposta;
- lista explícita de campos obrigatórios;
- tipos dos metadados;
- valores utilizados no header;
- intervalo de monitoramento.

### `/data.json`

São validados:

- status da resposta;
- presença das sete séries esperadas;
- existência de medições em todas as séries;
- campos obrigatórios de cada medição;
- datas válidas;
- consistência do tipo do campo `max`.

## Falhas esperadas

O enunciado informa que os testes devem passar quando os critérios forem atendidos e falhar quando não forem.

Por isso, quatro testes falham enquanto os defeitos permanecerem na aplicação:

1. O header apresenta `null min`.
2. A API de metadados retorna `interval: null`.
3. O gráfico de Temperatura não apresenta tooltip.
4. A API de dados retorna `"null"` como string no campo `max`.

Essas falhas são intencionais e estão associadas aos relatórios de defeito.

## Defeitos encontrados

| ID | Defeito | Severidade | Prioridade |
|---|---|---|---|
| [BUG-001](docs/bug-reports/BUG-001-null-interval.md) | Header apresenta `null min` | Média | Alta |
| [BUG-002](docs/bug-reports/BUG-002-temperature-tooltip.md) | Tooltip ausente no gráfico de Temperatura | Média | Alta |
| [BUG-003](docs/bug-reports/BUG-003-invalid-measurement-type.md) | API retorna `"null"` como texto | Média | Alta |

Cada relatório contém passos para reprodução, resultado obtido, resultado esperado, impacto, evidências, observações técnicas e sugestão de correção.

## Documentação complementar

- [Casos de teste](docs/test-cases.md)
- [Revisão de Produto e Design](docs/product-design-review.md)
- [Evidências](docs/evidence/)
- [Relatórios de defeitos](docs/bug-reports/)

## Observações de Produto e Design

A comparação com o Figma identificou pontos que precisam de confirmação antes de serem classificados como defeitos:

- unidade do gráfico de Velocidade RMS;
- comportamento esperado em dispositivos móveis;
- largura da área dos gráficos;
- presença do crédito externo do Highcharts;
- capitalização do título da página.

Esses itens estão detalhados na [Revisão de Produto e Design](docs/product-design-review.md).

## Decisões técnicas

- As interceptações são registradas antes de `cy.visit()` para capturar o carregamento inicial.
- As respostas das APIs são compartilhadas entre testes de contrato para evitar requisições repetidas.
- Os campos obrigatórios são declarados explicitamente para detectar propriedades ausentes.
- Cada gráfico é validado individualmente.
- Os tooltips são acionados com eventos reais de mouse.
- Os testes de tooltip verificam horário, série e valor numérico.
- Valores ausentes em medições podem ser `null` JSON, mas não a string `"null"`.

## Limitações conhecidas

A aplicação não fornece atributos como `data-testid`. Por isso, alguns testes utilizam classes estáveis disponibilizadas pelo Highcharts.

A interação com os gráficos percorre diferentes coordenadas da área visível para localizar pontos das séries. Essa abordagem foi necessária porque os pontos são renderizados dinamicamente em SVG.

Não foram implementadas comparações visuais pixel a pixel, pois diferenças de resolução e escala poderiam gerar falsos positivos. As divergências visuais relevantes foram documentadas com evidências.