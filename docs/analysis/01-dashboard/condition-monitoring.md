# Monitoramento de condição no dashboard

O painel operacional mostra, por ponto de monitoramento, um "estado". Este documento
explica de onde esse estado vem, o que ele significa e — principalmente — o que ele **não**
significa.

**Resposta curta:** toda a classificação é calculada **no cliente, em tempo de
renderização**, a partir de dados reais lidos da API. Não há lógica de condição no backend
e nada é persistido. Uma busca por `condition|attention|severity|classification` em
`apps/api` não retorna nenhuma ocorrência.

- Cálculo: [`apps/web/src/features/dashboard/dashboardAggregations.ts`](../../../apps/web/src/features/dashboard/dashboardAggregations.ts)
- Exibição: [`apps/web/src/components/dashboard/SensorConditionMatrix.tsx`](../../../apps/web/src/components/dashboard/SensorConditionMatrix.tsx)

Os rótulos terminam em "demonstrativo" de propósito: são uma leitura didática de dados
sintéticos, não um diagnóstico de condição de máquina.

## Dois eixos ortogonais

O que a tela chama de "estado" é, no código, **duas dimensões independentes** exibidas
juntas.

### 1. `condition` — o que a medição sugere

| Estado exibido | Regra no código | Depende de |
|---|---|---|
| Sem sensor | ponto sem sensor associado | inventário |
| Sem dados | sensor sem nenhuma amostra | série |
| Sem classificação | há amostras, mas não foi possível calcular baseline | amostras |
| Normal demonstrativo | `deviationRatio < 1,5` | amostras |
| Observação demonstrativa | `deviationRatio ≥ 1,5` (`SYNTHETIC_OBSERVATION_RATIO`) | amostras |
| Atenção demonstrativa | `deviationRatio ≥ 2,0` (`SYNTHETIC_ATTENTION_RATIO`) | amostras |

`deviationRatio` compara a leitura recente com uma baseline calculada da própria série. O
cálculo espelha o supervisor do sensor twin: pareia os eixos Y e Z pelo timestamp, obtém
`radialRms = sqrt((y² + z²)/2)`, agrupa as amostras em **janelas de aquisição** (separadas
por mais de cinco minutos) e divide a média da segunda janela pela da primeira. A diferença
é onde isso roda: lá, no supervisor; aqui, no navegador.

Duas salvaguardas do cálculo: só sensores com série `SIM-` entram (o restante fica "Sem
classificação" em vez de receber número inventado) e, quando há mais de um sensor, as duas
janelas usadas precisam ser **compartilhadas pela frota** — assim, um ciclo isolado de
desenvolvimento não vira baseline de todo mundo.

### 2. `freshness` — quão recente é a leitura

| Estado | Regra |
|---|---|
| Atual | última amostra dentro de 24 h (`STALE_AFTER_MS`) |
| Desatualizado | última amostra com mais de 24 h |
| Relógio divergente | timestamp no futuro além de 5 min de tolerância (`FUTURE_TOLERANCE_MS`) |
| Sem leitura | nenhuma amostra ou timestamp inválido |

Os dois eixos não se misturam no cálculo: um sensor pode estar "Normal demonstrativo" e
"Desatualizado" ao mesmo tempo, e isso é informação, não contradição.

## A evidência da condição

Cada célula e cada linha da fila de inspeção mostram **a medição que produziu o estado**,
não uma leitura qualquer do sensor:

| Situação | O que é exibido |
|---|---|
| Há avaliação demonstrativa | `Aceleração radial (Y/Z)` com o RMS da aquisição mais recente, o índice (`3,49× baseline`) e o próprio baseline |
| Não há avaliação | a leitura mais recente, sempre nomeada com grandeza e eixo (`Aceleração · eixo Y`) |

Isto corrigiu um defeito real: o valor da célula vinha da série de maior `lastTimestamp` e,
no empate, caía no **eixo X** — a célula em "Atenção demonstrativa" exibia `0,008 g` (eixo X)
enquanto a classificação vinha do radial Y/Z, `0,057 g`. O número na tela não tinha relação
com o rótulo ao lado dele.

## Indicadores: um KPI, um conceito

Os três eixos do modelo aparecem separados, e nenhum deles agrega os outros:

| Indicador | Conta |
|---|---|
| **Em atenção** | pontos com `attention` ou `observation` — o que a medição diz |
| **Sem leitura recente** | pontos com leitura `stale` ou `future` — recência |
| **Cobertura** | pontos `no-sensor` ou `no-data` — o que sequer é medido |

O indicador único anterior somava os três e, por construção, tendia ao total de pontos.

## Visualização

- **`SensorConditionMatrix`** — máquinas nas linhas, pontos (DE/NDE) nas células, com
  condição, frescor, último valor e unidade.
- **`InspectionQueue`** — fila de exceções ordenada por severidade, uma linha por ponto,
  com a evidência completa (grandeza, valor, unidade, índice, idade) e a ação de
  investigar. Declara quantas linhas estão visíveis do total.
- **`FleetFreshness`** — distribuição de recência das leituras, ao lado da matriz.
- **`TrendPanel`** (Recharts) — série ao longo de 24 h / 7 d / 30 d / tudo, alvo do
  drill-down. Plota amostra a amostra quando cabe, uma média por aquisição quando o dado é
  em rajadas e uma média por bucket quando o volume exige. Quando o período escolhido não
  alcança o histórico, informa o intervalo disponível e oferece ir até ele.
- **`SeriesExplorer`** — série individual, com agregação temporal quando o volume exige.

**Lacuna não é zero.** Quando duas aquisições estão separadas por um intervalo maior que o
típico, é inserido um ponto com `value: null` — o gráfico interrompe a linha em vez de
ligar dois instantes distantes ou desenhar um vale artificial em zero. Nas visões
agregadas, bucket sem amostra permanece `null` pelo mesmo motivo.

## Consequências práticas (gaps)

- **Filtro de classificação não pode ser server-side hoje.** O servidor não conhece
  "Atenção demonstrativa": para filtrar por isso na API seria preciso mover o cálculo (ou
  materializá-lo) para o backend. Por isso os filtros server-side implementados são os que
  o domínio já sustenta — tipo de máquina, modelo de sensor, presença de sensor e busca
  textual ([`../02-api/backend-architecture.md`](../02-api/backend-architecture.md)).
- **Custo de leitura.** O inventário e a última leitura de todas as séries chegam em três
  requisições (`GET /time-series` traz `lastValue`/`lastTimestamp` no resumo). O índice
  demonstrativo, porém, compara duas aquisições e exige as amostras: isso roda como
  **segunda etapa**, depois do primeiro render, e só para os pares radiais avaliáveis.
  Continua proporcional ao número de sensores sintéticos — não escala para uma planta
  grande sem mover o cálculo para o servidor.
- **Sem histórico.** Como nada é persistido, não existe "estava em atenção ontem".
- **A fila de inspeção agrupa motivos por ponto.** Um ponto com desvio *e* leitura antiga
  aparece uma vez, com a severidade mais alta e os dois motivos no texto; antes gerava duas
  linhas e inflava a contagem.
- **Rajadas, não fluxo contínuo.** Cada aquisição são 60 amostras em 60 s, repetidas de
  hora em hora. No eixo de horas, o traçado cru vira um risco vertical por aquisição, então
  a tendência exibe **uma média medida por aquisição** (nunca interpolação) quando esse é o
  formato do dado.
- **Os limiares 1,5 e 2,0 são didáticos**, calibrados contra o gerador sintético. Não são
  limites industriais nem derivados de norma — ver
  [`../05-simulation/simulation-vs-real.md`](../05-simulation/simulation-vs-real.md).

## Decisão tomada (ADR-0011)

A pergunta que esta página manteve aberta — condição vira conceito persistido ou continua
derivada? — foi decidida no
[ADR-0011](../06-decisions/adr-0011-condition-policy-and-alert-occurrences.md):

- **Condição continua derivada e recalculável**, agora com uma única política versionada em
  `libs/domain/src/condition.ts` (`DEFAULT_CONDITION_POLICY`, v1). API e cliente classificam
  pela mesma função, e o cliente passa a confiar em `condition`/`freshness` do servidor.
  `ConditionTag` continua sendo a etiqueta de condição.
- **Alerta nasceu como conceito próprio**: episódio persistido com nível A1/A2, estado,
  reconhecimento ortogonal e linha do tempo, comparado a uma **baseline aprendida por ponto**
  (não à aquisição anterior). Descrito em
  [`../03-domain/alert-domain.md`](../03-domain/alert-domain.md).

O que isso muda nesta página: nada no cálculo da condição — a semântica, os limiares e a
referência (aquisição sincronizada anterior) são os mesmos, agora centralizados. O painel
passa a mostrar os dois conceitos lado a lado ("Ativos em atenção" e "Alertas abertos"), e
um ponto pode ter alerta aberto com condição "normal": referências diferentes, ambas
verdadeiras.
