# Relatório de Defeitos

## BUG-001 - Campo de intervalo exibe valor nulo

### Resumo

O campo responsável por exibir o intervalo de coleta apresenta o valor `null min` para o usuário.

---

### Passos para reproduzir

1. Acessar a aplicação.
2. Observar as informações exibidas no cabeçalho.

---

### Resultado atual

O sistema exibe:

```text
null min
```

---

### Resultado esperado

O sistema deveria:

* Exibir um valor válido de intervalo; ou
* Exibir uma mensagem amigável, como:

```text
Não informado
```

---

### Evidência

Valor retornado pela API `/metadata`:

```json
{
  "machine": "Máquina 1023",
  "spot": "Ponto 20192",
  "rpm": "200",
  "dynamicRange": "16g",
  "interval": null
}
```

---

### Impacto

O usuário visualiza uma informação inconsistente e sem significado funcional.

---

### Severidade

Média

---

### Prioridade

Média

---

## Observação de UX - Diferença de comportamento entre tooltips

### Resumo

Foi observado que os gráficos de "Aceleração RMS" e "Velocidade RMS" apresentam informações mais detalhadas no tooltip quando comparados ao gráfico de "Temperatura".

---

### Comportamento observado

#### Aceleração RMS e Velocidade RMS

Apresentam:

* Data
* Dia da semana
* Horário
* Valores por eixo

#### Temperatura

Apresenta informações mais limitadas.

---

### Dúvida para Produto/Design

O comportamento distinto entre os gráficos é intencional ou deveria existir padronização na exibição dos tooltips?

---

### Classificação

Dúvida de requisito / melhoria de experiência do usuário.
