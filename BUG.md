# [Bug #01] Campo de tempo exibido como "null min" no cabeçalho

### Descrição
O indicador de tempo localizado no cabeçalho da aplicação está exibindo o valor `null min` ao invés do tempo real.

### Passos para reproduzir
1. Abrir a aplicação.
2. Observe que o tempo como `null min` no cabeçalho do dashboard

### Resultado Atual
A interface apresenta o tempo como `null min`.

### Resultado Esperado
O campo deveria exibir o tempo corretamente.

### Evidências
![Tempo exibido como null](./screenshots-bugs/tempo-null.png)

---

# [Bug #02] Tooltip não exibido no grafico de Temperatura

### Descrição
Ao navegar com o mouse sobre o grafico de temperatura, não é exbido o tooltip com as informações para o usuario como nos demais graficos

### Passos para reproduzir
1. Abrir a aplicação.
2. Observe o segundo grafico de temperatura
3. Repouse o mouse sob o grafico
4. Observe que o tooltip com as informações de temperatura não exibidos

### Resultado Atual
O Grafico de temperatura não apresenta o tooltip com as informações de temperatura

### Resultado Esperado
Ao repousar o mouse sob o grafico é esperado que as informações de temperatura sejam exibidas para o usuario

### Evidências
![Tooltip não exibido no gráfico de temperatura](./screenshots-bugs/grafico-temp.png)
