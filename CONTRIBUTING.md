# Como contribuir

## Antes de começar

Leia:

- [`README.md`](README.md) para execução;
- [`docs/sketch.md`](docs/sketch.md) para escopo;
- [`docs/architecture.md`](docs/architecture.md) para fronteiras;
- [`docs/testing-strategy.md`](docs/testing-strategy.md) para escolher testes;
- [`docs/TODO.md`](docs/TODO.md) para o roadmap.

Priorize requisitos do desafio, correção, acessibilidade e mudanças proporcionais. Não adicione
infraestrutura, dependências ou abstrações sem benefício demonstrável.

## Ambiente

- Node.js 24
- pnpm 9.15.4

```bash
corepack enable
cp .env.example .env
pnpm install --frozen-lockfile
pnpm dev
```

Não versione `.env`, `.vercel`, credenciais ou artifacts gerados.

## Organização do trabalho

1. Relacione a mudança a um requisito, bug ou decisão documentada.
2. Identifique a menor fronteira que resolve o problema completamente.
3. Preserve alterações existentes fora do escopo.
4. Implemente com TypeScript strict.
5. Adicione ou ajuste testes proporcionais.
6. Atualize documentação quando contrato, arquitetura ou operação mudar.
7. Revise o diff completo.
8. Execute as validações adequadas.

## Código

- Use componentes funcionais e composição.
- Separe apresentação, transformação, acesso HTTP e efeitos.
- Prefira aliases `@/` entre módulos de `src`.
- Não use `any`, `@ts-ignore` ou regras desabilitadas para ocultar erros.
- Mantenha estado global serializável e compartilhado.
- Mantenha interação transitória e instâncias de bibliotecas fora do Redux.
- Extraia abstrações quando houver reutilização, isolamento ou ganho claro.
- Siga a formatação e o lint do Biome.

## Mudanças no contrato de medições

O contrato atravessa runtimes e camadas. Ao alterá-lo, revise:

- [`mock/db.json`](mock/db.json);
- [`api/measurements.ts`](api/measurements.ts);
- `src/features/measurements/api`;
- `src/features/measurements/model`;
- slice e selectors;
- testes unitários e da Function;
- Cypress e documentação.

O `json-server` local e a Function precisam continuar equivalentes.

## Gráficos

- Mantenha timestamp no modelo e formatação na apresentação.
- Preserve unidades e associação entre métrica/eixo.
- Não coloque tooltip, crosshair ou `Highcharts.Chart` no Redux.
- Remova listeners e refs no cleanup.
- Teste preparação e sincronização fora dos internals da biblioteca.
- Valide interação real no Cypress.

## Acessibilidade e responsividade

- Use HTML semântico e nomes acessíveis.
- Preserve foco visível e teclado.
- Não dependa somente de cor, ícone ou tooltip.
- Valide loading, erro, vazio e sucesso.
- Confira overflow e resize em mobile, tablet e desktop.
- Use axe-core como apoio, não como substituto de revisão manual.

## Testes proporcionais

- Transformação pura: Vitest.
- Estado ou efeito: reducer, selector ou Saga.
- Comportamento acessível: Testing Library.
- Estado visual isolado: Storybook.
- Integração navegador/API: Cypress.
- Contrato de produção: teste da Function ou smoke.

Todo bug deve receber um teste de regressão quando houver reprodução determinística.

## Quality gate

Para entrega completa:

```bash
pnpm format:check
pnpm lint
pnpm exec tsc -b
pnpm typecheck:e2e
pnpm test:coverage
pnpm build
pnpm build-storybook
pnpm e2e:ci
```

Use `pnpm install --frozen-lockfile` antes quando dependências estiverem ausentes ou o lockfile
tiver mudado. Não declare a entrega pronta com etapa falha ou não executada sem explicar o motivo.

## Commits

- Use mensagens em inglês no formato Conventional Commits.
- Mantenha cada commit revisável e funcional.
- Separe documentação, refatoração, testes e comportamento quando forem mudanças independentes.
- Não inclua arquivos pessoais, generated artifacts ou mudanças adjacentes.

Exemplos:

```text
feat: add synchronized chart indicators
fix: prevent duplicate chart listeners
test: cover measurement retry flow
docs: document testing strategy
```

Agentes não devem criar commits ou fazer push sem solicitação explícita.

## Pull request

Antes de abrir:

- sincronize a branch sem reescrever histórico compartilhado;
- revise commits e diff contra a base;
- confirme que documentação e testes refletem a mudança;
- procure segredos e artifacts;
- execute o quality gate;
- descreva resumo, riscos e plano de testes.

O fork preserva arquivos oficiais em `main`; a solução vive em `leonardo-jacomussi` e a pull
request de avaliação aponta para `dynamox-s-a/developer-challenges:main`.

## Ferramentas assistidas

Cursor Rules, Commands, Skills, Bugbot e MCPs são opcionais. `/pr-ready` e a skill
`frontend-quality-gate` podem apoiar a revisão, mas não substituem os comandos nem a decisão
humana. Consulte [`docs/ai-assisted-development.md`](docs/ai-assisted-development.md).
