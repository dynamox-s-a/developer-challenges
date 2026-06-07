# QA Solution - Dynamox Challenge 🚀

Este repositório contém a solução para o desafio de QA da Dynamox. O objetivo é validar uma aplicação de monitoramento de sensores que exibe dados de vibração e temperatura.

## 📋 Estratégia de Teste

A estratégia foi dividida em três pilares principais para garantir a robustez e a manutenibilidade:

1.  **Testes de API:** Validação de contrato e integridade dos dados (JSON Schema e valores nulos).
2.  **Testes E2E (Playwright):** Validação da jornada do usuário, renderização de componentes e interações.
3.  **Documentação de Bugs:** Reporte detalhado de falhas encontradas durante a exploração manual e automação.

## 🛠️ Tecnologias Utilizadas

*   **Playwright:** Framework de automação E2E e API.
*   **TypeScript:** Linguagem para maior segurança e tipagem dos testes.
*   **Markdown:** Para documentação de casos de teste e bug reports.

## 📂 Estrutura do Projeto

```text
qa-solution/
├── docs/
│   ├── bug-reports/        # Relatórios de bugs encontrados
│   │   └── evidence/       # Evidências organizadas por ID do Bug
│   ├── test-cases.md       # Mapeamento detalhado dos cenários
│   └── feedback-product.md # Sugestões de melhoria de UX/UI
├── tests/
│   ├── e2e/                # Testes de interface (Frontend)
│   └── api/                # Testes de integração (Backend/JSON)
└── playwright.config.ts    # Configurações do framework
```

## 🚀 Como Executar os Testes

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute todos os testes:
   ```bash
   npx playwright test
   ```

3. Para visualizar o relatório detalhado:
   ```bash
   npx playwright show-report
   ```

## 🐞 Bugs Identificados

Durante o desenvolvimento, foram identificados 3 bugs críticos que fazem com que a suíte de testes falhe (conforme esperado pelo desafio):

*   **BUG-001 (API):** Campo `interval` retornando `null` no endpoint de metadados.
*   **BUG-002 (E2E):** Ausência de tooltip no gráfico de Temperatura (quebra de paridade com os outros gráficos).
*   **BUG-003 (API):** Campo `max` retornando a string `"null"` em vez de valor numérico em registros da série `accelerationRms/x`.

*Os detalhes técnicos, passos para reproduzir e evidências estão disponíveis em `/docs/bug-reports/`.*

## 🧠 Observações Técnicas

*   **Tooltips (Highcharts):** A validação dos tooltips foi mantida como teste manual devido ao comportamento interno do Highcharts, que compartilha um único elemento tooltip entre todos os gráficos no DOM, tornando o isolamento por gráfico não confiável via automação.
*   **Dados Dinâmicos:** Os testes de API garantem que, mesmo que os dados mudem, o contrato (tipagem e obrigatoriedade) permaneça íntegro.

---
Desenvolvido por **Caleb Fernandes**
