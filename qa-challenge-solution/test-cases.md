# Casos de Teste

## CT01 - Exibição das informações da máquina

### Objetivo

Validar a exibição das informações da máquina no cabeçalho.

### Passos

1. Acessar a aplicação.
2. Observar o cabeçalho.

### Resultado esperado

Devem ser exibidas as informações:

* Máquina 1023
* Ponto 20192
* RPM
* Faixa dinâmica (16g)

### Resultado obtido

PASSOU
---

## CT02 - Exibição dos gráficos

### Objetivo

Validar a exibição dos gráficos da aplicação.

### Passos

1. Acessar a aplicação.

### Resultado esperado

Devem ser exibidos os gráficos:

* Aceleração RMS
* Temperatura
* Velocidade RMS

### Resultado obtido

PASSOU

---

## CT03 - Exibição de tooltip nos gráficos

### Objetivo

Validar a exibição de informações ao posicionar o cursor sobre os gráficos.

### Passos

1. Posicionar o cursor sobre pontos dos gráficos.

### Resultado esperado

O sistema deve exibir tooltip contendo informações da medição.

### Resultado obtido

PASSOU

---

## CT04 - Exibição dos filtros de aceleração

### Objetivo

Validar a exibição dos filtros disponíveis para o gráfico de aceleração.

### Passos

1. Acessar a aplicação.

### Resultado esperado

Devem ser exibidos os filtros:

* Axial
* Horizontal
* Radial

### Resultado obtido

PASSOU

---

## CT05 - Seleção individual dos filtros

### Objetivo

Validar o funcionamento individual dos filtros.

### Passos

1. Selecionar apenas Axial.
2. Selecionar apenas Horizontal.
3. Selecionar apenas Radial.

### Resultado esperado

O gráfico deve exibir apenas a série correspondente ao filtro selecionado.

### Resultado obtido

PASSOU

---

## CT06 - Ocultação de todas as séries

### Objetivo

Validar o comportamento da aplicação quando todas as séries são ocultadas.

### Passos

1. Desmarcar Axial.
2. Desmarcar Horizontal.
3. Desmarcar Radial.

### Resultado esperado

A aplicação deve permanecer funcional.

### Resultado obtido

PASSOU

Observação: o gráfico permanece visível, porém sem dados.

---

## CT07 - Atualização dos dados ao acessar a página

### Objetivo

Validar o carregamento dos dados ao abrir a aplicação.

### Passos

1. Abrir a aplicação.
2. Atualizar a página.

### Resultado esperado

As requisições para os endpoints de dados devem ser realizadas novamente.

### Resultado obtido

PASSOU

---

## CT08 - Responsividade básica

### Objetivo

Validar o comportamento da interface em diferentes larguras de tela.

### Passos

1. Redimensionar a janela do navegador.

### Resultado esperado

Os componentes devem permanecer acessíveis e visíveis.

### Resultado obtido

PASSOU

---

## CT09 - Tratamento de valores nulos

### Objetivo

Validar a exibição correta de informações provenientes da API.

### Passos

1. Acessar a aplicação.
2. Verificar o campo de intervalo.

### Resultado esperado

O sistema não deve exibir valores nulos ao usuário.

### Resultado obtido

FALHOU

O sistema exibe:

```text
null min
```

Detalhes documentados em:

```text
bug-report.md
```
