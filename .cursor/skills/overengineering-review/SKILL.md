---
name: overengineering-review
description: Revisa mudanças em busca de complexidade desproporcional ao desafio. Use em refatorações, revisões arquiteturais ou quando uma solução parece maior que o problema.
paths:
  - "src/**"
  - "api/**"
  - "package.json"
  - "vite.config.ts"
---

# Revisão de overengineering

Analise o diff e o contexto antes de concluir. Não trate quantidade de linhas como evidência
isolada.

## Procurar

- abstrações com um único consumidor sem isolamento relevante;
- wrappers triviais e hooks que apenas renomeiam chamadas;
- estado global para interação local ou dados derivados duplicados;
- memoização, cache, throttle ou virtualização sem medição;
- genéricos e tipos mais complexos que o domínio;
- design system paralelo ao Material UI;
- dependências para problemas triviais;
- infraestrutura, padrões ou camadas não exigidos pelo desafio.

## Classificar

- **Remover agora**: aumenta risco ou manutenção sem benefício atual.
- **Simplificar depois**: válido, mas não bloqueia a entrega.
- **Complexidade justificada**: resolve reutilização, teste, fronteira externa ou requisito real.

Para cada achado, cite evidência, custo e alternativa mínima. Não proponha simplificação que
reduza acessibilidade, testes, segurança ou clareza. Faça revisão somente leitura, salvo pedido
explícito de correção.
