# ADR-0006 — Fonte única para o validador e para o OpenAPI

**Status:** Aceito

## Contexto

O contrato de telemetria existia em dois lugares: o JSON Schema aplicado pelo Ajv em
runtime e um schema **escrito à mão** no decorator `@ApiBody` do controller, que alimentava
`/api/docs-json`.

As duas cópias divergiram. A divergência foi encontrada por uma revisão adversarial e
**reproduzida em runtime**: um payload que o contrato publicado declarava inválido era
aceito pela API com `201`. Entre outras diferenças, o documento exigia `metadata.cycleId`,
`metadata.synthetic` e `displayName` (todos opcionais de verdade), declarava `profile` como
enum fechado (era string livre), `version` como `integer` (era `number`) e omitia o padrão
de `resourceId` e a precisão exigida do timestamp.

Um cliente gerado a partir daquele documento recusaria payloads bons e aceitaria payloads
ruins — que é o pior tipo de documentação: a que parece confiável.

## Decisão

O schema publicado é **derivado** do mesmo arquivo que o Ajv valida, por um conversor
determinístico de dialeto (JSON Schema 2020-12 → OpenAPI 3.0), e uma suíte diferencial
compara as duas portas.

O conversor trata explicitamente as três diferenças de dialeto que este documento usa
(união com `null` → `nullable`; `exclusiveMinimum` numérico → `minimum` + flag booleana;
remoção de palavras de metadado do documento) e **lança erro** diante de qualquer
construção que não saiba representar, em vez de emitir algo aproximado.

## Alternativas consideradas

- **Transcrever com mais cuidado (e revisar em PR).** Rejeitada: é a solução que já havia
  falhado. Duas cópias divergem por construção; a pergunta é só quando.
- **Gerar o Ajv a partir do OpenAPI.** Rejeitada: inverteria a direção da verdade. O
  contrato é um JSON Schema versionado, compartilhado por backend, produtor e testes; o
  OpenAPI é uma *publicação* dele.
- **Abandonar o schema publicado** (documentar só em prosa). Rejeitada: o contrato deixaria
  de ser executável no Swagger e o consumidor perderia o único artefato acionável.
- **Adotar um gerador de DTO/validador de terceiros.** Rejeitada: dependência nova para um
  problema que um conversor de ~50 linhas, com teste de reversibilidade, resolve.

## Consequências

- Alterar o contrato passa a ser **um** commit em **um** arquivo; documento e validação
  acompanham sozinhos.
- A suíte de paridade é a rede de segurança: ela reconverte o schema publicado e exige
  veredito idêntico ao do Ajv para conjuntos válidos e inválidos. Reintroduzir qualquer
  divergência antiga quebra a suíte — isso foi verificado reintroduzindo o defeito.
- Um dialeto novo (por exemplo, um `oneOf` complexo) pode exigir estender o conversor; ele
  falha alto, o que é o comportamento desejado.
- Os exemplos publicados passaram a ser validados pelo Ajv real e checados contra colisão
  de instante entre si, para permanecerem executáveis pelo Swagger.

## Evidência

- `apps/api/src/common/telemetry-request-schema.ts` — derivação com cache.
- `apps/api/src/common/json-schema-to-openapi.ts` — conversor determinístico.
- `apps/api/test/telemetry-schema-parity.e2e-spec.ts` — conversão inversa e comparação de
  vereditos entre contrato publicado e validador.
- `apps/api/test/openapi-contract.e2e-spec.ts` — forma do documento final servido em
  `/api/docs-json`.
- Documento irmão: [`../02-api/openapi.md`](../02-api/openapi.md).
