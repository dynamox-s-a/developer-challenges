# ADR-0005 — Contrato interno como redução rastreável do contrato público

**Status:** Aceito

## Contexto

O desafio pede um sistema de telemetria; a Dynamox publica a especificação de uma API que
faz exatamente isso. Havia três caminhos: ignorar a especificação e desenhar um formato
próprio, copiá-la integralmente, ou derivar dela um subconjunto.

Copiar integralmente é inviável — a aceitação real depende do *Resource Model* do
workspace, que não é público, e vários campos não têm produtor nem consumidor aqui.
Ignorá-la desperdiçaria a única fonte de verdade externa disponível e deixaria o projeto
sem resposta para "vocês implementaram a Dynamox ou inventaram um formato?".

## Decisão

O contrato interno (`contracts/dynamox/telemetry-cycle.schema.json`) é derivado do corpo do
`POST /v1/telemetry-cycles` do snapshot público e **reduzido**, com cada diferença
classificada e registrada como PRESERVADO, REDUÇÃO ou ADAPTAÇÃO.

Duas regras acompanham a decisão:

- **O snapshot público nunca é editado** — nem para corrigir as inconsistências que ele
  tem. As decisões ficam do nosso lado, o que torna a diferença auditável.
- **Só reduzimos, nunca ampliamos**: não há campo que o contrato interno aceite e o público
  recuse.

## Alternativas consideradas

- **Formato próprio, sem relação com o público.** Rejeitada: perderia a rastreabilidade e
  tornaria a integração futura com um sensor real uma reescrita.
- **Espelhar o público sem reduzir.** Rejeitada: aceitaríamos `value` booleano,
  `physicalQuantity` livre e timestamps de precisão arbitrária, sem produtor que os gere e
  com persistência que não os suporta — validação que não valida nada.
- **Reduzir sem registrar.** Rejeitada: é o caminho que produz "drift acidental"
  indistinguível de decisão.

## Consequências

- Cada restrição a mais precisa de justificativa. A tabela campo a campo em
  [`../04-contracts/telemetry-contract.md`](../04-contracts/telemetry-contract.md) é o
  registro, e ela expõe inclusive o ponto fraco: `metadata.required` exige `origin`
  (necessário à persistência, `CONFIRMADO`) **e** `generator`, cujo racional não é
  recuperável do repositório e fica registrado como assumption do projeto — item a
  reconfirmar antes de qualquer uso fora do desafio.
- Onde a especificação pública é inconsistente (`monitoringLocationMap` ×
  `monitoringLocationMapSchema`), a escolha do campo canônico é decisão registrada e
  coberta por teste que impede o alias vazar.
- Um produtor que respeite o contrato público pode ser recusado aqui pelas reduções — o que
  é aceitável para um protótipo local e precisaria ser revisto numa integração real.
- Ganho direto: a resposta honesta e verificável para "isto é a Dynamox?" — sim, na
  estrutura; reduzido, com a lista das diferenças.

## Evidência

- `contracts/dynamox/telemetry-cycle.schema.json` — o contrato, com as descrições de cada
  restrição.
- `contracts/dynamox/dynamox-public-api.openapi.json` — snapshot preservado (hash em
  [`../04-contracts/dynamox-upstream.md`](../04-contracts/dynamox-upstream.md)).
- `contracts/dynamox/README.md` — tabela de diferenças deliberadas e a inconsistência
  registrada.
- `apps/api/test/contract.spec.ts` — o alias público não existe no contrato interno.
- Documento irmão: [`../04-contracts/telemetry-contract.md`](../04-contracts/telemetry-contract.md).
