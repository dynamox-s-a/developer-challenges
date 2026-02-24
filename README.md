# QA Challenge – Cypress Automation

Este repositório contém minha solução para o desafio técnico de QA proposto.

**Aplicação testada:** [https://frontend-test-for-qa.vercel.app/](https://frontend-test-for-qa.vercel.app/)

---

## Instruções do Desafio

1. Realizar fork do repositório original.
2. Criar uma nova branch utilizando nome e sobrenome.  
   Exemplo: `nome-sobrenome`
3. Implementar a solução.
4. Criar um Pull Request para o repositório: [https://github.com/dynamox-sa](https://github.com/dynamox-sa)
5. Aguardar avaliação da solução.

**Branch criada para entrega:** `guilherme-sarkis`

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js 18 ou superior
- npm instalado

### Instalação

```bash
npm install
```

### Executar todos os testes (modo headless)

```bash
npx cypress run
```

Esse comando executa toda a suíte de testes automaticamente.

### Executar em modo interativo

```bash
npx cypress open
```

---

## Estrutura do Projeto

```
cypress/
 └── e2e/
      ├── api/
      │    ├── data.cy.js
      │    └── metadata.cy.js
      ├── ui/
      │    ├── 01-dashboard.cy.js
      │    ├── 02-dashboard-graficos-obrigatorios.cy.js
      │    ├── 03-dashboard-atualizacao-dados.cy.js
      │    ├── 04-interacao-tooltip-series.cy.js
      │    ├── 05-reload.cy.js
      │    ├── 06-tooltip.cy.js
      │    └── 07-smoke.cy.js
      └── negative/
           └── api-error.cy.js

screenshot-bugs/
```

---

## Estratégia de Teste

A estratégia aplicada contempla:

- Validação de contrato de API
- Validação estrutural da interface
- Sincronização frontend ↔ backend
- Atualização dinâmica de dados
- Testes de interação do usuário
- Testes de reload
- Testes negativos
- Identificação de bugs

---

## Testes de API

**Localização:** `cypress/e2e/api/`

| Arquivo | Descrição |
|---|---|
| `data.cy.js` | Validação dos dados retornados pela API |
| `metadata.cy.js` | Validação dos metadados da API |

---

## Testes de UI

**Localização:** `cypress/e2e/ui/`

| Arquivo | Descrição |
|---|---|
| `01-dashboard.cy.js` | Validação estrutural do dashboard |
| `02-dashboard-graficos-obrigatorios.cy.js` | Verificação dos gráficos obrigatórios |
| `03-dashboard-atualizacao-dados.cy.js` | Atualização dinâmica de dados |
| `04-interacao-tooltip-series.cy.js` | Interação com tooltip e séries |
| `05-reload.cy.js` | Comportamento após reload |
| `06-tooltip.cy.js` | Validação dos tooltips |
| `07-smoke.cy.js` | Smoke test geral |

---

## Testes Negativos

**Localização:** `cypress/e2e/negative/`

| Arquivo | Descrição |
|---|---|
| `api-error.cy.js` | Comportamento da interface em cenários de erro de API |

---

## Screenshots e Bugs Identificados

**Localização:** `screenshot-bugs/`

Foi identificado um problema visual na interface relacionado à exibição do campo `interval` quando seu valor é `null`.

A interface exibe:

```
null min
```

Esse comportamento indica ausência de tratamento adequado para valores nulos na camada de apresentação.

---

## Considerações Finais

A suíte cobre cenários positivos e negativos, valida contratos de API, garante integridade da interface e identifica falhas reais de comportamento e apresentação de dados.

Todos os testes podem ser executados via:

```bash
npx cypress run
```