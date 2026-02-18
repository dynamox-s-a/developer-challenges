## Desafio QA – Testes automatizados com Cypress

Este diretório contém a implementação do desafio de QA utilizando testes end‑to‑end com Cypress para validar o dashboard disponível em:

- `https://frontend-test-for-qa.vercel.app`

Os testes cobrem cenários de renderização dos gráficos, comportamento de tooltips, validação de metadados, recarregamento da página e tratamento de erro 500 na API de dados.

---

## Stack utilizada

- Node.js (LTS recomendado – ex.: 18+)
- npm
- Cypress `^15.10.0`
- Plugin `@cypress/grep` para filtragem de testes por tags

---

## Estrutura relevante do projeto

- `package.json`: scripts npm e dependências
- `cypress.config.js`: configuração do Cypress (baseUrl e plugin de grep)
- `cypress/e2e/dashboards.cy.js`: cenários de teste automatizados
- `cypress/pages/dashboards.page.js`: Page Object com seletores e ações do dashboard
- `REPORT.md`: análise de usabilidade e sugestões de melhorias para o produto

---

## Pré‑requisitos

- Node.js instalado (versão LTS recomendada)
- npm instalado
- Acesso à internet (a aplicação sob teste está hospedada remotamente)

---

## Como instalar as dependências

No diretório `developer-challenges`:

```bash
npm install
```

---

## Como rodar os testes Cypress

- Abrir o Cypress com interface gráfica:

```bash
npm run cy:open
```

- Rodar todos os testes em modo headless (Chrome):

```bash
npm run cy:run
```

O script `cy:run` está configurado em `package.json` como:

```json
"cy:run": "cypress run --browser chrome"
```

---

## Uso de tags com @cypress/grep (grepTags)

O projeto utiliza o plugin `@cypress/grep`, configurado em `cypress.config.js`:

```js
setupNodeEvents(on, config) {
  require('@cypress/grep/src/plugin')(config);
  return config;
}
```

Nos testes, as tags são declaradas via propriedade `grepTags`:

```js
it('Deve renderizar os 3 gráficos', { grepTags: ['@smoke', '@graphs'] }, () => {
  // ...
});
```

Para filtrar os testes por tag na linha de comando, utilize a opção `--env grepTags` após o script npm:

```bash
npm run cy:run -- --env grepTags=@smoke
```

---

## Tags disponíveis e cenários cobertos

Atualmente o arquivo `cypress/e2e/dashboards.cy.js` define os seguintes cenários com `grepTags`:

- `@smoke`: marca todos os cenários principais do dashboard (sanity check da aplicação).
- `@graphs`: valida que os 3 gráficos são renderizados corretamente.
- `@tooltip`: valida que a tooltip é exibida ao passar o mouse sobre o gráfico.
- `@header`: compara os dados do cabeçalho com o retorno da API `metadata`.
- `@reload`: garante que, ao recarregar a página, os dados são buscados novamente com sucesso.
- `@error`: garante que um erro 500 na API de `data` é tratado sem quebrar a tela.

---

## Feedbacks

- Dentro do arquivo REPORT.md está um pequeno feedback encontrados durante os testes da aplicação.