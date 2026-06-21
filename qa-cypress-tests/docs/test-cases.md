# Casos de Teste

## Escopo

Estes casos de teste validam os requisitos funcionais da aplicação de monitoramento de sensores da Dynamox.

Aplicação testada: https://frontend-test-for-qa.vercel.app/

## Pré-condições

- Node.js e npm instalados.
- Dependências instaladas com `npm install`.
- Aplicação disponível para acesso.
- Cypress executado em um navegador compatível.

## Resumo dos Casos de Teste

| ID | Cenário | Requisito | Teste automatizado | Resultado atual |
|---|---|---|---|---|
| CT-001 | Carregar a aplicação | Requisito 1 | `ui/app.cy.js` | Passou |
| CT-002 | Solicitar dados e metadados no acesso | Requisito 3 | `ui/app.cy.js` | Passou |
| CT-003 | Solicitar dados e metadados após recarregar | Requisito 3 | `ui/app.cy.js` | Passou |
| CT-004 | Exibir máquina e ponto de monitoramento | Requisito 1 | `ui/header.cy.js` | Passou |
| CT-005 | Exibir RPM e metadado de aceleração | Requisito 1 | `ui/header.cy.js` | Passou |
| CT-006 | Exibir os três gráficos obrigatórios | Requisito 2 | `ui/charts.cy.js` | Passou |
| CT-007 | Renderizar séries de dados nos gráficos | Requisito 2 | `ui/charts.cy.js` | Passou |
| CT-008 | Exibir as legendas esperadas | Requisito 2 | `ui/charts.cy.js` | Passou |
| CT-009 | Exibir um intervalo de monitoramento válido | Requisito 1 | `ui/header-interval.cy.js` | Falhou - defeito conhecido |
| CT-010 | Exibir tooltip em Aceleração RMS | Requisito 4 | `ui/tooltip.cy.js` | Passou |
| CT-011 | Exibir tooltip em Temperatura | Requisito 4 | `ui/tooltip.cy.js` | Falhou - defeito conhecido |
| CT-012 | Exibir tooltip em Velocidade RMS | Requisito 4 | `ui/tooltip.cy.js` | Passou |
| CT-013 | Validar a estrutura dos metadados | API `/metadata.json` | `api/metadata.cy.js` | Passou |
| CT-014 | Validar os metadados exibidos no header | API `/metadata.json` | `api/metadata.cy.js` | Passou |
| CT-015 | Retornar um intervalo de monitoramento válido | API `/metadata.json` | `api/metadata.cy.js` | Falhou - BUG-001 |
| CT-016 | Retornar todas as séries de sensores | API `/data.json` | `api/data.cy.js` | Passou |
| CT-017 | Retornar medições com campos e datas válidos | API `/data.json` | `api/data.cy.js` | Passou |
| CT-018 | Retornar valores numéricos ou nulos | API `/data.json` | `api/data.cy.js` | Falhou - BUG-003 |

## Casos de Teste Detalhados

### CT-001 - Carregar a aplicação

**Objetivo:**  
Verificar se a aplicação carrega e apresenta seu título principal.

**Passos:**

1. Acessar a aplicação.
2. Aguardar o carregamento do conteúdo principal.
3. Localizar o título da página.

**Resultado esperado:**  
O título `Análise de dados` deve estar visível.

---

### CT-002 - Solicitar dados e metadados no acesso

**Objetivo:**  
Verificar se os dados do sensor e os metadados são solicitados ao acessar a página.

**Passos:**

1. Registrar interceptações para `/data` e `/metadata`.
2. Acessar a aplicação.
3. Aguardar as duas requisições.

**Resultado esperado:**  
As duas requisições devem ser realizadas e retornar uma resposta bem-sucedida.

---

### CT-003 - Solicitar dados e metadados após recarregar

**Objetivo:**  
Verificar se a aplicação solicita os recursos novamente após recarregar a página.

**Passos:**

1. Acessar a aplicação.
2. Aguardar as requisições iniciais para `/data` e `/metadata`.
3. Recarregar a página.
4. Aguardar novamente as duas requisições.

**Resultado esperado:**  
Novas requisições devem ser realizadas para os dois endpoints após o recarregamento.

---

### CT-004 - Exibir máquina e ponto de monitoramento

**Objetivo:**  
Verificar se o header apresenta a identificação da máquina e do ponto de monitoramento.

**Passos:**

1. Acessar a aplicação.
2. Localizar o header com as informações da máquina.

**Resultado esperado:**  
Os textos `Máquina 1023` e `Ponto 20192` devem estar visíveis.

---

### CT-005 - Exibir RPM e metadado de aceleração

**Objetivo:**  
Verificar se os metadados esperados estão visíveis no header.

**Passos:**

1. Acessar a aplicação.
2. Analisar as informações apresentadas no header.

**Resultado esperado:**  
Os valores `200` e `16g` devem estar visíveis.

---

### CT-006 - Exibir os três gráficos obrigatórios

**Objetivo:**  
Verificar se todas as seções de gráficos exigidas são apresentadas.

**Passos:**

1. Acessar a aplicação.
2. Localizar os títulos dos gráficos.

**Resultado esperado:**  
Os seguintes gráficos devem estar visíveis:

- Aceleração RMS;
- Temperatura;
- Velocidade RMS.

---

### CT-007 - Renderizar séries de dados nos gráficos

**Objetivo:**  
Verificar se os containers dos gráficos e suas séries de dados são renderizados.

**Passos:**

1. Acessar a aplicação.
2. Localizar os containers do Highcharts.
3. Analisar as séries SVG renderizadas.

**Resultado esperado:**  
Devem existir três containers de gráficos com séries de dados renderizadas.

---

### CT-008 - Exibir as legendas esperadas

**Objetivo:**  
Verificar se as legendas identificam as séries apresentadas nos gráficos.

**Passos:**

1. Acessar a aplicação.
2. Analisar as legendas dos gráficos.

**Resultado esperado:**  
As legendas `Axial`, `Horizontal`, `Radial` e `Temperatura` devem estar visíveis.

---

### CT-009 - Exibir um intervalo de monitoramento válido

**Objetivo:**  
Verificar se o header apresenta um intervalo de monitoramento válido.

**Passos:**

1. Acessar a aplicação.
2. Analisar o campo de intervalo no header.

**Resultado esperado:**  
O intervalo deve apresentar `20 min` e não deve conter um valor nulo.

**Resultado obtido:**  
A aplicação apresenta `null min`.

**Status:**  
Falhou - documentado como BUG-001.

---

### CT-010 - Exibir tooltip em Aceleração RMS

**Objetivo:**  
Verificar se passar o cursor sobre a série de Aceleração RMS apresenta os valores em um tooltip.

**Passos:**

1. Acessar a aplicação.
2. Mover o cursor sobre diferentes pontos do gráfico de Aceleração RMS.
3. Analisar o tooltip apresentado.

**Resultado esperado:**  
Um tooltip não vazio contendo dados do gráfico deve ser apresentado.

---

### CT-011 - Exibir tooltip em Temperatura

**Objetivo:**  
Verificar se passar o cursor sobre a série de Temperatura apresenta os valores em um tooltip.

**Passos:**

1. Acessar a aplicação.
2. Mover o cursor sobre diferentes pontos do gráfico de Temperatura.
3. Analisar o tooltip apresentado.

**Resultado esperado:**  
Um tooltip não vazio contendo os dados de temperatura deve ser apresentado.

**Resultado obtido:**  
O ponto do gráfico reage ao cursor, mas nenhum tooltip é apresentado.

**Status:**  
Falhou - documentado como BUG-002.

---

### CT-012 - Exibir tooltip em Velocidade RMS

**Objetivo:**  
Verificar se passar o cursor sobre a série de Velocidade RMS apresenta os valores em um tooltip.

**Passos:**

1. Acessar a aplicação.
2. Mover o cursor sobre diferentes pontos do gráfico de Velocidade RMS.
3. Analisar o tooltip apresentado.

**Resultado esperado:**  
Um tooltip não vazio contendo dados do gráfico deve ser apresentado.

---

### CT-013 - Validar a estrutura dos metadados

**Objetivo:**  
Verificar se `/metadata.json` retorna todos os campos obrigatórios.

**Passos:**

1. Realizar uma requisição para `/metadata.json`.
2. Validar o status da resposta.
3. Analisar os campos retornados.

**Resultado esperado:**  
A resposta deve possuir status `200` e conter exatamente:

- `machine`;
- `spot`;
- `rpm`;
- `dynamicRange`;
- `interval`.

**Status:**  
Passou.

---

### CT-014 - Validar os metadados exibidos no header

**Objetivo:**  
Verificar se os dados retornados pela API correspondem às informações esperadas no header.

**Passos:**

1. Realizar uma requisição para `/metadata.json`.
2. Analisar os valores retornados.
3. Comparar os valores com as informações esperadas na interface.

**Resultado esperado:**

- `machine`: `Máquina 1023`;
- `spot`: `Ponto 20192`;
- `rpm`: `200`;
- `dynamicRange`: `16g`.

**Status:**  
Passou.

---

### CT-015 - Retornar um intervalo de monitoramento válido

**Objetivo:**  
Verificar se a API retorna um intervalo numérico válido.

**Passos:**

1. Realizar uma requisição para `/metadata.json`.
2. Localizar o campo `interval`.
3. Validar seu tipo e valor.

**Resultado esperado:**  
O campo `interval` deve ser numérico e apresentar o valor `20`.

**Resultado obtido:**  
O campo retorna `null`.

**Status:**  
Falhou - documentado como BUG-001.

---

### CT-016 - Retornar todas as séries de sensores

**Objetivo:**  
Verificar se `/data.json` retorna todas as séries necessárias para os gráficos.

**Passos:**

1. Realizar uma requisição para `/data.json`.
2. Localizar o array `data`.
3. Comparar os nomes das séries com a lista esperada.

**Resultado esperado:**  
A API deve retornar sete séries:

- `accelerationRms/x`;
- `accelerationRms/y`;
- `accelerationRms/z`;
- `velocityRms/x`;
- `velocityRms/y`;
- `velocityRms/z`;
- `temperature`.

**Status:**  
Passou.

---

### CT-017 - Retornar medições com campos e datas válidos

**Objetivo:**  
Verificar a estrutura dos registros de todas as séries.

**Passos:**

1. Realizar uma requisição para `/data.json`.
2. Percorrer todas as séries.
3. Percorrer suas medições.
4. Validar os campos e as datas.

**Resultado esperado:**  
Cada série deve possuir uma lista não vazia de medições. Cada medição deve conter os campos `datetime` e `max`, com uma data válida em `datetime`.

**Status:**  
Passou.

---

### CT-018 - Retornar valores numéricos ou nulos

**Objetivo:**  
Verificar a consistência do tipo utilizado no campo `max`.

**Passos:**

1. Realizar uma requisição para `/data.json`.
2. Percorrer todas as medições.
3. Validar o tipo do campo `max`.

**Resultado esperado:**  
O campo `max` deve conter um número ou `null` JSON quando a medição estiver ausente.

**Resultado obtido:**  
Algumas medições apresentam a string `"null"`.

**Status:**  
Falhou - documentado como BUG-003.