# Relatório de Defeitos Encontrados

## 1. Texto 'null min' exibido no cabeçalho (Bug de UI/Dados)
- **Descrição:** O último item do cabeçalho superior renderiza a string "null min" em vez de um valor válido.
- **Passos para reproduzir:** Acessar a página inicial.
- **Resultado esperado:** Exibir o valor correto do metadado ou tratar o valor nulo (ex: ocultar o ícone ou exibir 0).

## 2. Falta de Rótulos no Cabeçalho (Inconsistência de Design/UX)
- **Descrição:** Os valores "200" e "16g" estão sem rótulos identificadores, dificultando a compreensão do usuário.
- **Sugestão:** Adicionar labels claras como "Frequência: 200 Hz" e "Range: 16g".