# Critérios de revisão

Priorize bugs acionáveis introduzidos pelo diff. Cada achado deve indicar severidade, arquivo,
evidência, impacto observável e correção mínima.

## Verificar

- regressões nos requisitos de `/data`, estados ou roteamento;
- requests ausentes ou duplicados, especialmente sob React StrictMode;
- listeners, timers e referências sem cleanup;
- timestamp ou formatação que altere timezone e associação entre séries;
- divergência entre contrato da API, mapper, selectors e gráficos;
- HTML inseguro, credenciais, tokens ou dados sensíveis;
- quebra de semântica, teclado, foco, contraste ou nomes acessíveis;
- overflow, resize ou interação inconsistente nos breakpoints;
- falha sem teste de regressão ou cenário crítico sem cobertura;
- abstrações e dependências com custo maior que o problema resolvido;
- alterações que contornem CI, lint, TypeScript ou testes.

## Evitar

- comentários apenas de estilo cobertos pelo Biome;
- preferências sem impacto funcional ou padrão documentado;
- exigir arquitetura de produção além do escopo do desafio;
- repetir o mesmo problema em vários arquivos sem identificar a causa comum;
- alegar erro sem caminho reproduzível ou evidência no diff.

Classifique como bloqueante apenas quando houver risco concreto de funcionalidade, segurança,
acessibilidade, dados ou deploy.
