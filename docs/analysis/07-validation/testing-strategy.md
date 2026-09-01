# Estratégia de verificação

O que cada suíte **prova** — e o que ela não prova. Este documento não traz contagens de
teste: elas mudam a cada suíte nova e apodrecem em silêncio. O número atual vive em um
lugar só, [`docs/SETUP.md`](../../SETUP.md) (seção *Verificações*).

## Camadas

| Suíte | Onde | Roda contra | Prova |
|---|---|---|---|
| Unitários da API | `apps/api/src/**/*.spec.ts` | nada externo | parsers de DTO e query, mapeamento de vocabulário, regras isoladas de service |
| Contrato de telemetria | `apps/api/test/contract.spec.ts` | Ajv real | o exemplo versionado é válido; violações são recusadas; o fingerprint é canônico |
| Paridade de schema | `apps/api/test/telemetry-schema-parity.e2e-spec.ts` | documento OpenAPI final + Ajv | o contrato publicado e o validador executado dão o **mesmo veredito** |
| Contrato OpenAPI | `apps/api/test/openapi-contract.e2e-spec.ts` | documento OpenAPI final | forma do documento servido em `/api/docs-json` |
| e2e da API | `apps/api/test/*.e2e-spec.ts` | **PostgreSQL real** | comportamento HTTP ponta a ponta, incluindo concorrência |
| Frontend | `apps/web/src/**/*.spec.ts(x)` | jsdom + `fetch` stubado | reducers, thunks, agregações puras e comportamento de tela por perfil |
| Sensor twin | `simulation/sensor-twin/src/**/*.spec.ts` | nada externo | determinismo, invariantes do manifest, matemática do supervisor, fronteira |
| Integração do twin | `simulation/sensor-twin/test/` | API viva + banco | a frota inteira ingerida e reingerida como duplicata |
| Round-trip ROS | `simulation/sensor-twin/test-ros/` | API viva + ROS Noetic | JSONL ⇄ rosbag preserva a identidade semântica |

As duas últimas **não** rodam no alvo padrão (`npm run test`): têm comandos dedicados
(`npm run twin:integration`, `npm run twin:ros`), para que a suíte convencional fique verde
em máquinas sem banco e sem ROS.

## O que as e2e provam que um teste unitário não provaria

- **Unicidade é do banco.** Nome duplicado devolve `409` porque o índice único rejeitou a
  segunda inserção — não porque a aplicação consultou antes. Só um banco real demonstra isso.
- **Corrida entre regra e mutação.** Um `PATCH` que torna a máquina `Pump` disparado em
  paralelo com a associação de um sensor `TcAg` termina em um estado válido, qualquer que
  seja a ordem: os dois fluxos se serializam na linha da máquina.
- **Ingestões idênticas concorrentes** produzem um único ciclo e respostas consistentes.
- **Isolamento de leitura.** Página e `total` saem do mesmo snapshot, então a soma continua
  coerente sob escrita concorrente.
- **RBAC de verdade.** VIEWER recebe `403` em toda mutação **e o estado persistido não
  muda**; sem token é `401`. Verificar só o status deixaria passar um efeito colateral.
- **Contrato de consulta composto.** Busca + filtro + ordenação + página funcionam
  **juntos**, com `total` do recorte — um contrato que só vale parâmetro a parâmetro não é
  contrato.

## O que as suítes de contrato protegem

Elas existem por causa de um defeito real: o schema publicado no Swagger era uma segunda
cópia escrita à mão e divergiu do validador
([`../02-api/openapi.md`](../02-api/openapi.md)). Hoje:

- a **paridade** reconverte o schema publicado e exige veredito idêntico ao do Ajv para
  conjuntos válidos e inválidos — reintroduzir a divergência antiga quebra a suíte, o que
  foi verificado reintroduzindo o defeito;
- os **exemplos publicados** são validados pelo Ajv real e checados contra colisão de
  instante entre si, para permanecerem executáveis pelo Swagger;
- o **contrato OpenAPI** varre o documento final: toda resposta com corpo aponta para um
  schema, nenhum primitivo é publicado como `object` em qualquer profundidade, nenhum
  parâmetro é declarado duas vezes, só parâmetro de rota é obrigatório, toda rota privada
  publica `401` e `403` aparece apenas em operação que altera estado.

## Frontend

O helper `renderWithProviders` monta store real, tema e router, e aceita uma sessão
simulada — **inclusive por perfil**, o que permite testar a interface do VIEWER sem falsear
o backend. Os testes consultam a tela pelo que o usuário vê (rótulos e papéis de
acessibilidade) e respondem à rede por stubs de `fetch`.

Cobrem, entre outros: proteção de rota (acesso direto sem sessão, reload com token, login →
rota privada → logout → retorno bloqueado), as duas corridas de `401` no cliente HTTP,
paginação/ordenação/filtros delegados ao servidor, o guard de URL da API e as agregações
puras do dashboard (janelas de aquisição, razão de desvio, frescor, lacuna como `null`).

## Sensor twin

Unitários puros — sem rede, banco ou ROS — cobrem: mesma seed ⇒ mesmo payload (base da
idempotência), pureza das funções de sinal, invariantes do manifest (incluindo a regra
`Pump` ⇒ `HF+`, validada da própria descrição da planta), matemática do supervisor,
transição `SUSPECT → CONFIRMED_ATTENTION` e a **fronteira** supervisor × simulador — um
spec varre o código-fonte e falha se os módulos de decisão voltarem a referenciar a
maquinaria de cenário.

O histórico sintético (`src/history/`) tem specs puros — grade absoluta e instantes reservados para várias âncoras, monotonicidade e alvos da narrativa, validade de todos os overrides no gerador, classificação de respostas e política de retry do driver — e uma fatia de integração opt-in (`test/history.integration.spec.ts`) que prova criação pelo contrato e reexecução 100 % `duplicate`.

## Performance

`npm run perf:latency` mede o requisito do enunciado ("latência abaixo de 350 ms") de forma
reproduzível ([`tools/measure-latency.ts`](../../../tools/measure-latency.ts)):

- estado estacionário local — cliente e servidor na mesma máquina, que é o ambiente
  documentado do desafio; os primeiros disparos de cada rota são descartados como
  aquecimento;
- requisições sequenciais por rota (é medição de **latência**, não teste de carga);
- cada amostra exige `2xx` — resposta de erro invalida a rota inteira;
- o critério é o **máximo** observado abaixo do limite, com p95 e média como apoio;
- rotas privadas usam `Bearer` real; a rota de escrita cria e remove seus próprios dados,
  sem deixar resíduo.

O pior caso é sistematicamente o **login**, e por um motivo desejado: a verificação de senha
paga o custo do `scrypt` — em qualquer resultado, ele fica uma ordem de grandeza abaixo do
limite. Números da última execução: `docs/SETUP.md`.

## Reprodutibilidade da entrega

A bateria foi validada em **clone limpo**: só o conteúdo versionado, um PostgreSQL novo,
migrações aplicadas do zero, seed e a suíte inteira. Duas propriedades saem daí:

- a instalação não depende de nenhum estado local não versionado;
- os **fingerprints do sensor twin são idênticos entre bancos diferentes** — o determinismo
  é do gerador, não do ambiente.

Comandos: [`docs/SETUP.md`](../../SETUP.md).

## Bottlenecks expostos pelo histórico e direção da próxima fase

O dataset [`history`](../05-simulation/history-dataset.md) (≈165 mil amostras por série)
é usado **deliberadamente** para revelar consultas que não escalam. Nada abaixo é
"degradação aceita": é o primeiro alvo da fase de performance, medido antes e depois da
carga (baseline em `history-dataset.md`), e não se esconde reduzindo o dataset.

| # | Onde | O que acontece | Evidência |
|---|---|---|---|
| 1 | `apps/web/src/features/dashboard/dashboardSlice.ts` (`fetchConditionEvidence`) + `api/client.ts` (`getAllSamples`) | baixa as 24 séries radiais inteiras, 5.000 por página, sequencial — centenas de requisições e milhões de amostras no Redux | medido |
| 2 | `dashboardAggregations.ts` (`computeSampleStats`) | `Math.min(...values)`/`Math.max` estouram a pilha acima de ~120 mil valores — o Explorador quebra em séries históricas | observado |
| 3 | `dashboardAggregations.ts` (`buildTrendView`, `buildWeeklyAcquisitionMap`, `groupAcquisitionWindows`) | agregação no browser: modo "por aquisição" desliga acima de 48 janelas; heatmap satura; ordenações O(N log N) por render | observado |
| 4 | `apps/api/src/telemetry/telemetry.service.ts` (`GET /time-series`) | 60 × `COUNT(*)` + 60 últimas amostras por requisição | `perf:latency` antes/depois |
| 5 | `GET /time-series/:id/samples` | `OFFSET` profundo degrada as páginas finais | medido |
| 6 | `simulation/sensor-twin/src/assess.ts` | supervisor pagina séries inteiras; `twin:integration` estoura timeout após a carga | observado |
| 7 | ingestão | `IN (60 instantes)` + `createMany` por série e PK UUID aleatória — throughput ao longo da carga | relatório da carga |

**Direção obrigatória (não implementada nesta etapa; guiada por `EXPLAIN ANALYZE`):**

- **O dashboard não baixa amostras brutas em massa.** Overview → agregações server-side;
  heatmap → buckets por dia/hora (`GROUP BY sensor, day, hour` devolvendo `count`,
  `coverage`, `avg`, `min`, `max` e, quando existir, desvio/baseline); tendência →
  agregação temporal adequada ao período; drill-down → consulta restrita ao intervalo
  selecionado; amostras brutas → só quando explicitamente pedidas para investigação.
- **Drill-down hierárquico:** dashboard → máquina → sensor → dia → hora → aquisição →
  amostra bruta. Cada nível restringe o próximo; nada é pré-carregado "porque poderia ser
  investigado". Clicar em (dia, hora) do heatmap dispara uma requisição só daquela janela.
- **O frontend não é a camada analítica.** Evitar `milhões de amostras → Redux →
  map/filter/reduce → Recharts`; preferir `PostgreSQL → agregação → DTO compacto →
  Redux/query state → Recharts`.
- **Técnicas a considerar, com medição:** índices compostos série + timestamp, keyset
  pagination em vez de `OFFSET` profundo, `GROUP BY`/`date_trunc`/`FILTER`, window
  functions, CTEs e `LATERAL` quando úteis, agregações por bucket e downsampling,
  `min/max/avg/count` no banco; materialized views e cache **somente se as medições
  justificarem**.

## Limites de verificação

- **Sem Cypress / teste de navegador real.** Decisão: o fluxo de ponta a ponta do usuário
  está coberto por Vitest + Testing Library no frontend e pelas e2e da API contra banco
  real. Fica registrado como ausência consciente, não como cobertura.
- **`libs/domain`, `libs/contracts` e `libs/ui` não têm suíte própria**: são exercitadas
  pelos consumidores (API, web) e seus alvos de teste dizem isso explicitamente. É uma
  escolha de custo; um bug de domínio aparece como falha da API, não como falha da lib.
- **Responsividade é verificada manualmente** — não há teste de viewport automatizado.
- **Não há teste de carga**: a medição de latência é sequencial e local, e não substitui
  benchmark de produção.
- **ROS é opcional**: a suíte de round-trip só roda onde há Noetic instalado; em máquinas
  sem ROS, ela não é executada (e não é silenciosamente pulada dentro do alvo padrão).
