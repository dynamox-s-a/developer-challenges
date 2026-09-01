# Ingestão de telemetria

`POST /api/telemetry-cycles` é o endpoint mais denso do backend: um corpo validado contra
o contrato interno vira séries e amostras persistidas, **uma vez**, mesmo que a mesma
requisição chegue várias vezes. Implementação em
[`apps/api/src/telemetry/telemetry.service.ts`](../../../apps/api/src/telemetry/telemetry.service.ts)
e [`libs/contracts/src/index.ts`](../../../libs/contracts/src/index.ts).

Por que idempotência foi tratada como requisito de projeto, e não como detalhe:
[ADR-0004](../06-decisions/adr-0004-idempotent-ingestion.md).

## O pipeline

```
1. contrato       validateTelemetryCycle (Ajv)      → 400 CONTRACT_VIOLATION (+ violations)
2. chave          formato do Idempotency-Key        → 400 INVALID_IDEMPOTENCY_KEY
3. tempo          timestamp canônico em ms          → 400 NON_CANONICAL_TIMESTAMP
4. identidade     fingerprint do conteúdo
5. idempotência   fingerprint conhecido?            → 200 duplicate:true
                  chave conhecida com outro corpo?  → 409 IDEMPOTENCY_KEY_REUSED
6. agrupamento    medições → séries (grandeza+eixo) → 409 SERIES_UNIT_CONFLICT
                                                    → 409 SAMPLE_TIMESTAMP_CONFLICT (no próprio payload)
                                                    → 422 QUANTITY_AXIS_MISMATCH
7. transação      sensor → ponto → ciclo → séries → amostras
                                                    → 404 SENSOR_NOT_FOUND
                                                    → 422 SENSOR_NOT_ASSOCIATED | RESOURCE_ID_MISMATCH
                                                    → 409 SAMPLE_TIMESTAMP_CONFLICT (histórico existente)
8. resposta       201 (novo) — com header Idempotency-Key ecoado
```

Os passos 1–6 acontecem **antes** de abrir transação: rejeitar cedo o que já se sabe
inválido evita segurar conexão e lock à toa.

## Idempotência: chave × conteúdo

Duas identidades diferentes, ambas únicas no banco:

- **`Idempotency-Key`** (header HTTP, 1–128 caracteres em `[A-Za-z0-9._~:-]`) — a
  *intenção* do cliente: "esta é a mesma operação de antes".
- **`payloadFingerprint`** — SHA-256 do *conteúdo*: identificador e modelo do sistema de
  medição, cada medição com atributos, cada par `timestamp`/`value`, `metadata`, `tags` e
  `configuration`.

O fingerprint é calculado sobre uma **serialização canônica**: chaves de objeto ordenadas
recursivamente, medições e amostras ordenadas por identidade, `tags` tratadas como
conjunto. Reordenar o JSON não muda o hash; alterar qualquer valor muda. A serialização é
JSON puro — nada de concatenar campos com `|` ou `:`, separadores que podem aparecer
dentro dos próprios valores e tornar duas entradas diferentes indistinguíveis para o hash
(`canonicalJson`, `computePayloadFingerprint`).

**Por que a chave viaja no header.** O contrato público declara
`telemetryCycleData.additionalProperties: false`: acrescentar um campo de idempotência ao
payload violaria o contrato que estamos preservando. O header é o único lugar disponível —
e, de quebra, mantém o transporte separado do dado. Para rastreabilidade, o mesmo valor
pode ser copiado em `metadata.cycleId`, cujo objeto aceita propriedades adicionais.

### Matriz de comportamento

| Chave enviada | Conteúdo | Resposta | Efeito no banco |
|---|---|---|---|
| nova | inédito | `201` `duplicate:false` | ciclo, séries e amostras criados |
| conhecida | idêntico ao daquela chave | `200` `duplicate:true` | nenhum |
| nova | idêntico a um ciclo já ingerido | `200` `duplicate:true` | nenhum |
| conhecida | **diferente** | `409 IDEMPOTENCY_KEY_REUSED` (+ `existingCycleId`) | nenhum |
| ausente | inédito | `201` | o fingerprint vira a chave |
| ausente | repetido | `200` `duplicate:true` | nenhum |

A última linha é a mais útil na prática: **sem nenhuma configuração do cliente**,
reprocessar o mesmo lote é reconhecido como repetição. É o que permite ao sensor twin
reexecutar `plant baseline` e receber 100% de `duplicate:true`, e ao replay de um artefato
ROS provar que reconstruiu exatamente a mesma aquisição
([`../05-simulation/ros-integration.md`](../05-simulation/ros-integration.md)).

A resposta de uma repetição é **igual** à da ingestão original (`cycleId`,
`measurementCount`, `sampleCount`, `timeSeriesIds`) porque o ciclo guarda esses valores —
nada é recalculado.

### Duplicatas concorrentes

Duas requisições idênticas simultâneas passam pela verificação prévia ao mesmo tempo e as
duas tentam inserir. A perdedora recebe `P2002` do PostgreSQL; `resolveUniqueViolation`
verifica **qual** índice foi violado: se foi a identidade do ciclo (fingerprint ou chave),
ela relê o ciclo vencedor e devolve a mesma resposta de duplicata; se foi
`(timeSeriesId, timestamp)`, vira `409 SAMPLE_TIMESTAMP_CONFLICT`; qualquer outro alvo é
repropagado. Uma violação de unicidade em outra coluna nunca é confundida com duplicata.

## Da medição à série

As medições do ciclo são agrupadas por **identidade de série** (`grandeza` + `eixo`) antes
de qualquer escrita, porque duas medições do mesmo ciclo podem apontar para a mesma série
— e a detecção de instantes repetidos só é confiável depois do agrupamento.

Durante o agrupamento:

- grandeza vetorial (`acceleration`, `velocity`) exige eixo; escalar (`temperature`,
  `rotationalSpeed`) recusa eixo → `422 QUANTITY_AXIS_MISMATCH` (regra em `libs/domain`);
- duas unidades diferentes para a mesma série no mesmo payload → `409 SERIES_UNIT_CONFLICT`;
- o mesmo instante repetido na mesma série dentro do payload → `409
  SAMPLE_TIMESTAMP_CONFLICT`, antes de qualquer escrita.

Na transação, para cada grupo: a série é buscada por `(sensor, grandeza, eixo)`; se já
existe com **outra unidade**, `409` — reetiquetar a unidade mudaria o significado de todas
as amostras já gravadas, sem conversão. Se não existe, é criada com `Axis.NONE` para
grandezas escalares.

Antes de inserir, o serviço consulta os instantes que já existem na série. Havendo
colisão, `409` com os instantes conflitantes no corpo. A inserção usa `createMany`
**sem** `skipDuplicates`: uma colisão precisa abortar a transação inteira, e não
desaparecer como amostra silenciosamente descartada.

## Validações de identidade

Dentro da transação (nunca antes — validar fora deixaria janela para exclusão ou
desassociação concorrente):

| Verificação | Falha |
|---|---|
| existe sensor com `measuringSystemUniqueIdentifier`? | `404 SENSOR_NOT_FOUND` |
| o sensor está associado a um ponto? | `422 SENSOR_NOT_ASSOCIATED` |
| todo `resourceId` do ciclo é o `externalResourceId` desse ponto? | `422 RESOURCE_ID_MISMATCH` |

O `resourceId` é o que amarra o dado ao ponto físico correto: sem essa checagem, um ciclo
de um sensor poderia gravar amostras "no lugar" de outro ponto — o erro mais caro possível
num sistema de monitoramento de condição.

`metadata.origin` é gravado como enum `IngestionOrigin` no ciclo, preservando a procedência
(`SIMULATION`, `ROSBAG_REPLAY`, `SEED`, `MANUAL`) — ver
[`../04-contracts/telemetry-contract.md`](../04-contracts/telemetry-contract.md).

## Fronteira da transação

Uma transação cobre **tudo** que altera estado: criação do ciclo, criação/reuso das séries,
inserção das amostras e a atualização final do ciclo com `sampleCount` e `timeSeriesIds`.
Ou o ciclo inteiro existe, ou nada dele existe — não há ciclo "meio ingerido".

A leitura de séries usa o mesmo cuidado do lado da consulta: página e `total` de amostras
saem do mesmo snapshot (`RepeatableRead`), então a varredura completa por `offset` nunca
mistura dois estados do banco.

## O que as suítes provam aqui

- `apps/api/test/telemetry.e2e-spec.ts` — a matriz completa contra PostgreSQL real:
  `201`, `200 duplicate`, `409` por chave reusada com o banco **inalterado**, rejeição de
  payload fora do contrato com lista de violações, timestamp submilissegundo, instante
  repetido no próprio payload, grandeza escalar com eixo, sensor desconhecido sem escrita
  parcial, e duas ingestões idênticas **concorrentes** produzindo um único ciclo.
- `apps/api/test/contract.spec.ts` — o fingerprint é estável e ignora ordem de
  propriedades, de medições, de amostras e de tags; valores diferentes produzem hashes
  diferentes.
- `simulation/sensor-twin/test/*.integration.spec.ts` — a mesma idempotência vista do lado
  do produtor: reexecutar a frota inteira devolve `duplicate:true` para todos os ciclos.
