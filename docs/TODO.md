# Roadmap

Este documento acompanha entregas e pendências do projeto em nível de capacidade. O histórico de
commits permanece no Git; decisões e detalhes técnicos ficam no
[`docs/sketch.md`](sketch.md) e em [`docs/architecture.md`](architecture.md).

## Status

- [x] concluído e validado
- [ ] pendente

## Fases concluídas

### Fase 1 — Scaffold e tooling

- [x] Configurar React, TypeScript strict, Vite, Material UI e Biome.
- [x] Definir Node 24, pnpm 9, aliases e execução conjunta de aplicação/API.
- [x] Preparar tema, fonte, favicon e arquivos de ambiente sem credenciais.

### Fase 2 — Camada de dados

- [x] Modelar contrato externo e domínio interno.
- [x] Implementar mapper, Axios, slice, selectors e Redux Saga.
- [x] Cobrir transformação, estado e efeitos com testes.

### Fase 3 — Interface base

- [x] Criar rota `/data`, providers e estados de loading, erro, retry e vazio.
- [x] Implementar resumo da máquina e layout baseado no protótipo.
- [x] Adicionar semântica, Error Boundary e testes de componentes.

### Fase 4 — Gráficos

- [x] Implementar cards de aceleração RMS, temperatura e velocidade RMS.
- [x] Mapear séries, eixos, unidades e opções do Highcharts.
- [x] Sincronizar tooltip e crosshair pelo timestamp mais próximo.
- [x] Garantir cleanup e testes das funções de sincronização.

### Fase 5 — Responsividade e acessibilidade

- [x] Adaptar interface para mobile, tablet e desktop.
- [x] Eliminar overflow horizontal e validar resize dos gráficos.
- [x] Melhorar teclado, foco, semântica, contraste e estados acessíveis.
- [x] Revisar performance e divisão de bundles com base em evidência.

### Fase 6 — Storybook

- [x] Configurar Storybook com tema e addon de acessibilidade.
- [x] Documentar estados transversais, resumo e componentes de gráfico.
- [x] Validar typecheck e build estático.

### Fase 7 — Cypress

- [x] Configurar execução interativa e headless.
- [x] Cobrir carregamento real, falha/retry, responsividade e sincronização.
- [x] Usar abordagem híbrida com `json-server` e interceptações na fronteira.

### Fase 8 — CI

- [x] Criar jobs separados de qualidade e end-to-end.
- [x] Configurar cache, artifacts de falha, concorrência e Dependabot.
- [x] Validar o workflow localmente e no GitHub Actions.

### Fase 9 — Deploy na Vercel

- [x] Publicar aplicação e API mock no mesmo domínio.
- [x] Publicar Storybook em projeto separado.
- [x] Condicionar CD ao CI verde.
- [x] Executar smoke de endpoints e Cypress em produção.

### Fase 10 — Documentação orientada a IA

- [x] Criar `AGENTS.md` e seis Rules escopadas.
- [x] Criar Commands e Skills para auditoria e qualidade.
- [x] Definir critérios do Bugbot.
- [x] Configurar MCPs opcionais e sem credenciais versionadas.

## Fase 11 — Documentação final e pública

- [x] Publicar este roadmap e reescrever `docs/sketch.md` como blueprint final.
- [x] Consolidar o `README.md` para avaliação e execução.
- [x] Criar `docs/architecture.md`.
- [x] Criar `docs/testing-strategy.md`.
- [x] Criar `docs/ai-assisted-development.md`.
- [x] Registrar ADRs de json-server, Redux Saga e Highcharts.
- [x] Criar `CONTRIBUTING.md`.
- [x] Alinhar `AGENTS.md`, Rules e Commands à documentação pública.
- [x] Validar links, segurança, URLs e quality gate completo.

## Fase 12 — Auditoria final

- [ ] Auditar requisitos funcionais, técnicos, bônus e critérios de avaliação.
- [ ] Executar revisão final de segurança, dependências e limpeza.
- [ ] Corrigir gaps documentados sem ampliar o escopo do desafio.
- [ ] Confirmar branch, diff, CI e preparação da pull request.
