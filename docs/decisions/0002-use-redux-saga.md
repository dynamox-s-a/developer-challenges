# ADR 0002 — Usar Redux Saga para efeitos assíncronos

## Status

Aceita.

## Contexto

Redux e Redux Saga são requisitos explícitos do desafio. O carregamento precisa representar
loading, sucesso, erro e retry sem misturar acesso HTTP com componentes de apresentação.

## Decisão

Centralizar o carregamento em `measurementsSaga`.

`DataPage` dispara `measurementsRequested`; a saga usa `takeLatest`, chama
`measurementsService.getAll`, aplica `mapMeasurements` e publica sucesso ou falha. O slice mantém
somente estado serializável, e selectors derivam séries por métrica.

## Alternativas consideradas

### Request direto no componente

Seria menor, mas violaria a separação pedida, duplicaria tratamento assíncrono e dificultaria
testes dos efeitos.

### `createAsyncThunk`

É adequado para fluxos simples, porém não atende ao requisito explícito de Redux Saga.

### Armazenar toda interação no Redux

Tooltip, crosshair e instâncias de gráfico não são estado de negócio. Colocá-los no store causaria
updates em alta frequência e adicionaria valores não serializáveis.

## Consequências

Positivas:

- efeitos isolados e testáveis;
- componentes focados em dispatch e renderização;
- transições de estado explícitas;
- `takeLatest` evita publicar uma resposta obsoleta após novo retry;
- mapper permanece na fronteira do domínio.

Negativas:

- adiciona conceitos e uma dependência para um único fluxo;
- exige testes específicos de generators;
- demanda disciplina para não mover estado local ou imperativo para o Redux.
