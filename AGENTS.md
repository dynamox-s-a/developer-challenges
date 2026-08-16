# Orientações do projeto

## Objetivo

Mantenha o dashboard de medições da Dynamox simples de executar, fiel aos requisitos e pronto para
avaliação. Priorize correção funcional, acessibilidade, responsividade, testes e clareza sobre
abstrações ou infraestrutura adicionais.

## Stack

- React 19, TypeScript strict e Vite 8
- Material UI 5
- Redux Toolkit e Redux Saga
- Highcharts
- Vitest, Testing Library, Cypress e Storybook
- Biome, pnpm 9 e Node.js 24

## Arquitetura

- `src/features/measurements`: API, modelo, store e componentes do domínio.
- `src/components`: estados e componentes transversais.
- `src/store`: configuração global e root saga.
- `mock/db.json`: dataset usado pelo `json-server` local.
- `api/measurements.ts`: Function que serve o mesmo contrato na Vercel.
- `.github/workflows`: quality gate, e2e e deploy condicionado ao CI verde.

## Comandos

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm format:check
pnpm lint
pnpm exec tsc -b
pnpm typecheck:e2e
pnpm test
pnpm test:coverage
pnpm build
pnpm build-storybook
pnpm e2e:ci
```

Execute validações proporcionais ao risco e o quality gate completo antes de declarar uma entrega
pronta.

## Restrições

- Não adicione Nx, backend de produção ou dependências sem benefício demonstrável.
- Preserve TypeScript strict; não use `any`, `@ts-ignore` nem desabilite regras para ocultar erros.
- Mantenha tooltip, crosshair e instâncias do Highcharts fora do Redux.
- Preserve o contrato entre `mock/db.json`, a Function e o mapper.
- Não versione credenciais, `.env`, `.vercel` ou artefatos gerados.
- Atualize documentação quando uma decisão arquitetural mudar.
- Não crie commits ou faça push sem solicitação explícita.

A versão do Node está definida em `.nvmrc`.

## Documentação

- [README](README.md): setup, scripts, URLs e visão geral.
- [Blueprint](docs/sketch.md): escopo, premissas e solução consolidada.
- [Arquitetura](docs/architecture.md): dados, estado, gráficos e deploy.
- [Testes](docs/testing-strategy.md): camadas, mocks e CI.
- [IA](docs/ai-assisted-development.md): Rules, Commands, Skills, Bugbot e MCPs.
- [Contribuição](CONTRIBUTING.md): convenções e quality gate.
