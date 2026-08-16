---
name: visual-validation
description: Valida visualmente o dashboard e registra evidências. Use após mudanças de interface, gráficos, tema, responsividade ou acessibilidade visual.
paths:
  - "src/**/*.tsx"
  - "src/theme/**"
  - ".storybook/**"
  - "cypress/**"
---

# Validação visual

## Preparação

1. Reutilize servidores existentes; caso não existam, inicie `pnpm dev`.
2. Abra `/data` e confirme que a API terminou sem erro.
3. Preserve o viewport e o estado ao comparar antes e depois.

## Cenários

Valide:

- desktop, tablet e mobile;
- loading, sucesso, erro e vazio;
- resumo da máquina e os três gráficos;
- overflow horizontal, espaçamento e resize;
- tooltip e crosshair sincronizados;
- foco visível e navegação por teclado;
- console e network sem erros inesperados.

Use o Storybook para estados isolados e a aplicação para integração. Não substitua os testes
Cypress nem atualize snapshots para esconder regressões.

## Evidência

Capture screenshots representativas com nomes descritivos. Relate viewport, rota, estado,
resultado, diferenças observadas e erros de console/network. Separe defeitos objetivos de
preferências visuais e não altere código em uma solicitação apenas de validação.
