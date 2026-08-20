# Testes de Qualidade – Análise de Dados

Projeto desenvolvido como parte de um desafio técnico de QA, com foco na validação funcional da aplicação de análise de dados.

## Objetivo

Validar os principais comportamentos da tela de Análise de Dados, considerando carregamento da aplicação, consumo das APIs, apresentação das informações e componentes gráficos.

## Tecnologias utilizadas

- Cypress 15.21.0
- JavaScript
- Node.js
- Git / GitHub

## Cenários automatizados

Foram implementados 6 cenários de teste:

1. **Carregar a tela de análise de dados**
   - Valida a presença do título principal da funcionalidade.

2. **Carregar os dados através das APIs**
   - Intercepta as requisições para `data.json` e `metadata.json`.
   - Valida o retorno HTTP `200`.

3. **Exibir os três gráficos de séries temporais**
   - Valida a apresentação dos gráficos:
     - Aceleração RMS
     - Temperatura
     - Velocidade RMS

4. **Exibir as informações da máquina no cabeçalho**
   - Valida informações relevantes apresentadas na tela:
     - Máquina 1023
     - Ponto 20192
     - 16g

5. **Carregar os dados novamente ao acessar a página**
   - Executa um novo carregamento da página.
   - Valida novamente as requisições das APIs e seus respectivos status HTTP.

6. **Identificar os elementos do gráfico para interação**
   - Valida a existência dos elementos estruturais utilizados pelos gráficos Highcharts.
   - Permite identificar componentes que podem ser utilizados em futuras interações automatizadas.

## Estratégia de testes

A automação foi estruturada utilizando diferentes níveis de validação:

- **Interface:** validação dos elementos visíveis para o usuário.
- **Integração:** monitoramento das requisições realizadas pela aplicação.
- **API:** validação dos códigos de resposta HTTP.
- **Componentes gráficos:** identificação da estrutura renderizada pelo Highcharts.
- **Recarregamento:** validação do comportamento da aplicação após novo acesso.

Para as requisições de dados foi utilizado `cy.intercept()`, permitindo observar as chamadas realizadas pela aplicação sem substituir o comportamento real da API.

## Execução dos testes

### Instalação das dependências

```bash
npm install