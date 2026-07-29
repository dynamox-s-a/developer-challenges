# Modelo de Relatório de Bug

### 1
### TOOLTIP AUSENTE NO SEGUNDO GRAFICO (Temperatura)
## Resumo
Tooltip ausente ao passar o mouse ou divergência nos valores do cabeçalho.

## Ambiente
- URL da aplicação: https://frontend-test-for-qa.vercel.app/
- Navegador: Chrome
- Ambiente de teste: Local/CI
- Data/hora: 28/07/2026

## Passos para Reproduzir
1. Abra a página do dashboard.
2. Aguarde o carregamento de `metadata.json` e `data.json`.
3. Passe o mouse sobre o segundo gráfico.
4. Observe que o tooltip não aparece.


## Resultado Esperado
O gráfico deve exibir um tooltip com as informações do ponto sobre o qual o mouse está posicionado.

## Resultado Observado
O gráfico não apresenta o resultado esperado de visibilidade do tooltip.

## Impacto
Esta questão afeta a usabilidade e a validação do requisito de interação com o gráfico.

## Capturas / Logs
Anexarei capturas de tela.







### 2
### CAMPO NULL NO CABEÇALHO (NULL MIN)
## Resumo
intervaL:null nos valores do cabeçalho.

## Ambiente
- URL da aplicação: https://frontend-test-for-qa.vercel.app/
- Navegador: Chrome
- Ambiente de teste: Local/CI
- Data/hora: 28/07/2026

## Passos para Reproduzir
1. Abra a página do dashboard.
2. Aguarde o carregamento de `metadata.json` e `data.json`.
3. Observe o valor apresentado no campo INTERVAL = null.

## Resultado Esperado
O campo deve exibir o valor em minutos com as informações vindas do backend.

## Resultado Observado
O valor recebido da API é `null` e o valor não é tratado no front.

## Impacto
Este ponto afeta a usabilidade e a validação do requisito de interação com o cabeçalho.

## Capturas / Logs
Anexarei capturas de tela.

