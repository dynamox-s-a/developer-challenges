# ADR-0004 — Ingestão idempotente: chave no header + fingerprint do conteúdo

**Status:** Aceito

## Contexto

Telemetria chega por rede instável. Um produtor que não recebe a resposta reenvia o mesmo
ciclo; um replay de artefato reprocessa dados antigos; um job pode rodar duas vezes. Sem
tratamento, cada uma dessas situações duplica histórico — e histórico duplicado de
vibração é pior do que dado ausente, porque parece verdade.

Duas restrições delimitam a solução:

1. `telemetryCycleData` do contrato público declara `additionalProperties: false` —
   nenhum campo novo pode ser acrescentado ao payload
   ([ADR-0005](./adr-0005-internal-contract-reduction.md));
2. a própria API pública já trata duplicata por conteúdo: a resposta `200` dela é
   *"TelemetryCycleV2 with same hash already exists"*.

## Decisão

Idempotência com **duas identidades separadas**:

- **`Idempotency-Key`**, no header HTTP — a *intenção* do cliente;
- **`payloadFingerprint`**, SHA-256 de uma serialização canônica do ciclo inteiro — o
  *conteúdo*.

Ambas são colunas únicas. Quando o header não vem, **o fingerprint vira a chave**, de modo
que reprocessar o mesmo lote é reconhecido como repetição sem nenhuma configuração do
cliente.

| Chave | Conteúdo | Resposta |
|---|---|---|
| qualquer | já ingerido | `200` `duplicate:true`, resposta idêntica à original |
| conhecida | diferente | `409 IDEMPOTENCY_KEY_REUSED` |
| nova/ausente | inédito | `201` |

## Alternativas consideradas

- **Chave no corpo do payload.** Rejeitada: violaria o `additionalProperties: false` que
  estamos preservando do contrato público.
- **Só a chave, sem fingerprint.** Rejeitada: um cliente que reusasse a chave para outro
  conteúdo receberia `200` e perderia dado em silêncio — o pior desfecho possível.
- **Só o fingerprint, sem chave.** Rejeitada: perde a intenção do cliente e impede detectar
  reúso indevido; também impede que o produtor correlacione a operação (a chave é ecoada
  no header da resposta e pode viajar em `metadata.cycleId`).
- **Upsert de amostras (`skipDuplicates`).** Rejeitada: transformaria conflito de instante
  em descarte silencioso. Preferimos `409` e transação abortada.

## Consequências

- A resposta de uma repetição é **igual** à da ingestão original, porque o ciclo guarda
  `timeSeriesIds`, `measurementCount` e `sampleCount`.
- Duas ingestões idênticas concorrentes convergem: a perdedora recebe `P2002`, relê o ciclo
  vencedor e devolve a mesma resposta — comportamento coberto por teste.
- O fingerprint precisa ser canônico de verdade (ordenação recursiva de chaves, medições,
  amostras e tags; JSON puro como separador). Um hash frágil quebraria a igualdade.
- O produtor determinístico do bônus ganha uma propriedade forte: mesma seed ⇒ mesmo
  payload ⇒ mesmo fingerprint ⇒ `duplicate:true` garantido.
- Custo: duas consultas antes de persistir e uma coluna `Char(64)` por ciclo.

## Evidência

- `apps/api/src/telemetry/telemetry.service.ts` — verificação prévia, `resolveUniqueViolation`
  e `duplicateOf`.
- `libs/contracts/src/index.ts` — `canonicalJson`, `computePayloadFingerprint`,
  `IDEMPOTENCY_KEY_PATTERN`.
- `prisma/schema.prisma` — `idempotencyKey` e `payloadFingerprint` únicos em `IngestionCycle`.
- `apps/api/test/telemetry.e2e-spec.ts` — matriz completa e ingestões concorrentes.
- Documento irmão: [`../02-api/telemetry-ingestion.md`](../02-api/telemetry-ingestion.md).
