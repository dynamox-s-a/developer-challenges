# Casos de Teste - Desafio QA Dynamox

## 1. Introdução
Este documento detalha a estratégia de teste para a aplicação de monitoramento de sensores.

## 2. Cenários de Teste (Mapeamento)

## 2.1 Cabeçalho

### CT-01: Validação do cabeçalho (Metadados)
**Objetivo:** Garantir que todos os campos de metadados são exibidos corretamente no cabeçalho.
**Passos:**
  1. Acessar a aplicação.
  2. Validar a presença e o valor de cada campo: `machine`, `spot`, `rpm`, `dynamicRange` e `interval`.
**Resultado Esperado:** Os campos devem estar visíveis com os valores correspondentes ao retorno do endpoint `/metadata`. O campo `interval` deve exibir um valor numérico.

### CT-02: Validação do endpoint /metadata
**Objetivo:** Garantir que os dados retornados pelo endpoint estão corretos.
**Passos:**
  1. Realizar requisição para o endpoint `https://frontend-test-for-qa.vercel.app/metadata.json`.
  2. Validar os dados retornados.
**Resultado Esperado:** Status HTTP 200. Todos os campos (`machine`, `spot`, `rpm`, `dynamicRange`, `interval`) devem estar presentes e retornar com tipos corretos.

## 2.2 Gráficos

### CT-03: Validação do endpoint /data
**Objetivo:** Garantir que os dados retornados pelo endpoint estão corretos.
**Passos:**
  1. Realizar requisição para o endpoint `https://frontend-test-for-qa.vercel.app/data.json`.
  2. Validar os dados retornados.
**Resultado Esperado:** Status HTTP 200. O array `data` deve conter séries com os campos `datetime` e `max` sem valores nulos ou tipados incorretamente.

### CT-04: Validação do schema do endpoint /data
**Objetivo:** Garantir que todas as séries retornadas correspondem ao esperado.
**Passos:**
  1. Realizar requisição para o endpoint `https://frontend-test-for-qa.vercel.app/data.json`.
  2. Validar a presença e nomenclatura de cada série.
**Resultado Esperado:** O array `data` deve conter exatamente as séries: `accelerationRms/x`, `accelerationRms/y`, `accelerationRms/z`, `velocityRms/x`, `velocityRms/y`, `velocityRms/z` e `temperature`. Todos os campos `max` devem ser do tipo numérico.

### CT-05: Visualização dos gráficos
**Objetivo:** Verificar se os 3 gráficos são renderizados com título e séries corretos conforme o Figma.
**Passos:**
  1. Acessar a aplicação.
  2. Verificar a presença e os títulos dos containers de gráficos.
  3. Verificar se as séries de cada gráfico estão visíveis.
**Resultado Esperado:** Os gráficos de RMS Acceleration, RMS Velocity e Temperature devem estar visíveis com títulos e séries correspondentes ao Figma.

### CT-06: Validação do eixo de tempo nos gráficos
**Objetivo:** Garantir que o eixo X dos gráficos exibe as datas corretamente.
**Passos:**
  1. Acessar a aplicação.
  2. Verificar o eixo X de cada gráfico.
**Resultado Esperado:** O eixo X deve exibir valores de data/hora correspondentes ao campo `datetime` das séries retornadas pelo endpoint `/data`.

### CT-07: Interação com Gráficos (Tooltip)
**Objetivo:** Validar o hover e exibição de valores em todos os gráficos.
**Passos:**
  1. Passar o mouse sobre um ponto de dado no gráfico de RMS Acceleration.
  2. Repetir no gráfico de RMS Velocity.
  3. Repetir no gráfico de Temperature.
**Resultado Esperado:** Um tooltip deve aparecer com os valores correspondentes ao ponto focado em todos os gráficos.

### CT-08: Validação do conteúdo do tooltip
**Objetivo:** Garantir que o tooltip exibe os valores corretos correspondentes ao ponto hovado.
**Passos:**
  1. Passar o mouse sobre um ponto específico em cada gráfico.
  2. Comparar o valor exibido no tooltip com o valor correspondente no retorno do endpoint `/data`.
**Resultado Esperado:** O valor exibido no tooltip deve corresponder ao campo `max` da série e ao `datetime` do ponto hovado.

### CT-09: Atualização de dados ao acessar a página
**Objetivo:** Garantir que os dados são carregados a cada acesso.
**Passos:**
  1. Acessar a aplicação.
  2. Monitorar as requisições de rede.
  3. Recarregar a página.
  4. Monitorar novamente as requisições de rede.
**Resultado Esperado:** As requisições para `/data` e `/metadata` devem ser disparadas a cada acesso. O cabeçalho e os 3 gráficos devem ser renderizados com os dados atualizados após cada carregamento.

## 2.3 Conformidade com Figma

### CT-10: Validação do layout do cabeçalho conforme Figma
**Objetivo:** Garantir que o cabeçalho está implementado conforme o protótipo.
**Passos:**
  1. Acessar a aplicação.
  2. Comparar o layout e os elementos do cabeçalho com o Figma.
**Resultado Esperado:** O cabeçalho deve exibir os campos na disposição e formato definidos no protótipo.

### CT-11: Validação do layout dos gráficos conforme Figma
**Objetivo:** Garantir que os gráficos estão implementados conforme o protótipo.
**Passos:**
  1. Acessar a aplicação.
  2. Comparar o layout, títulos e disposição dos gráficos com o Figma.
**Resultado Esperado:** Os gráficos devem estar dispostos conforme o protótipo, com títulos, legendas e eixos no formato definido.