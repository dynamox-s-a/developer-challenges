# Desafio QA Frontend - Dynamox

## Sobre o projeto

Este repositório contém minha solução para o desafio de QA Frontend da Dynamox.

O objetivo foi analisar a aplicação disponibilizada, identificar possíveis problemas, elaborar cenários de teste e implementar testes automatizados para validar as principais funcionalidades do sistema.

Os testes automatizados foram desenvolvidos utilizando Playwright e TypeScript.

---

## Aplicação testada

URL da aplicação:

https://frontend-test-for-qa.vercel.app/

A aplicação é responsável por exibir dados de monitoramento de vibração e temperatura de um equipamento industrial, apresentando:

* Informações da máquina monitorada;
* Informações do ponto de monitoramento;
* Gráfico de Aceleração RMS;
* Gráfico de Velocidade RMS;
* Gráfico de Temperatura.

---

## Tecnologias utilizadas

* Playwright
* TypeScript
* Node.js

---

## Cenários automatizados

### CT01 - Exibição das informações da máquina

Valida a exibição das informações carregadas no cabeçalho:

* Máquina;
* Ponto de monitoramento;
* RPM;
* Faixa dinâmica.

### CT02 - Exibição dos gráficos

Valida a presença dos gráficos:

* Aceleração RMS;
* Temperatura;
* Velocidade RMS.

### CT03 - Carregamento dos dados da API

Valida que a aplicação realiza a requisição para o endpoint de dados e recebe resposta com sucesso.

Critério validado:

* Status HTTP 200.

### CT04 - Exibição dos filtros

Valida a presença dos filtros:

* Axial;
* Horizontal;
* Radial.

---

## Como executar os testes

### Instalar dependências

```bash
npm install
```

### Executar os testes

```bash
npx playwright test
```

### Abrir o relatório do Playwright

```bash
npx playwright show-report
```

---

## Testes exploratórios

Além da automação, foram realizados testes exploratórios para validar:

* Comportamento geral da aplicação;
* Renderização dos gráficos;
* Exibição dos tooltips;
* Consistência dos dados apresentados;
* Responsividade da interface.

---

## Relatório de defeitos

Os defeitos identificados durante a análise da aplicação estão documentados no arquivo:

```text
bug-report.md
```

---

## Autor

Gustavo Schmitt dos Santos
