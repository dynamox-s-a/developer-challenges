---
name: frontend-quality-gate
description: Executa e consolida todas as validações do front-end. Use ao finalizar uma entrega, preparar revisão ou confirmar que a branch está pronta para PR.
---

# Front-end quality gate

## Execução

Execute na raiz, em ordem:

1. `pnpm format:check`
2. `pnpm lint`
3. `pnpm exec tsc -b`
4. `pnpm typecheck:e2e`
5. `pnpm test:coverage`
6. `pnpm build`
7. `pnpm build-storybook`
8. `pnpm e2e:ci`

Use `pnpm install --frozen-lockfile` antes quando dependências estiverem ausentes ou o lockfile
tiver mudado.

## Regras

- Pare na primeira falha que invalide etapas seguintes.
- Preserve logs suficientes para identificar comando, arquivo e causa.
- Não desabilite testes, lint ou TypeScript para obter resultado verde.
- Não altere código durante uma solicitação apenas de validação.
- Se e2e depender de binário local ausente, execute `pnpm exec cypress install` e repita uma vez.
- Diferencie falha do projeto, limitação local e etapa não executada.

## Relatório

Liste cada etapa como passou, falhou ou não executada. Inclua duração quando útil, causa raiz das
falhas e o menor próximo passo. Só declare o quality gate verde quando todas as etapas passarem.
