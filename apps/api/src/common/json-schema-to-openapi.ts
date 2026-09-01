import type { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/**
 * Converte o JSON Schema oficial (draft 2020-12) para o dialeto do OpenAPI 3.0.
 *
 * Existe para que o contrato publicado e o validador Ajv partam da MESMA definição: o
 * schema da telemetria já era aplicado em runtime a partir de `contracts/dynamox/`, mas
 * o Swagger repetia essa estrutura à mão — e as duas cópias divergiram em required,
 * tipos e patterns. Transcrever de novo só adiaria o mesmo defeito.
 *
 * OpenAPI 3.0 não é JSON Schema: as diferenças que este documento realmente usa são
 * tratadas abaixo, e qualquer outra passa intacta.
 */

/** Palavras que descrevem o documento, não o dado: não existem em OpenAPI. */
const METADATA_KEYWORDS = new Set(['$schema', '$id', 'title']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Diferenças de dialeto tratadas:
 *
 * 1. `type: ['string', 'null']` — união com null. OpenAPI 3.0 só aceita um tipo, e
 *    representa o nulo com a flag `nullable`.
 * 2. `exclusiveMinimum: 0` numérico (draft 2020-12) — em OpenAPI 3.0 o limite vai em
 *    `minimum` e `exclusiveMinimum` volta a ser booleano. O mesmo vale para o máximo.
 * 3. Palavras de metadado do documento, removidas.
 */
export function jsonSchemaToOpenApi(schema: unknown): SchemaObject {
  if (!isRecord(schema)) {
    throw new Error('jsonSchemaToOpenApi: esperado um objeto de schema.');
  }

  const converted: Record<string, unknown> = {};

  for (const [keyword, value] of Object.entries(schema)) {
    if (METADATA_KEYWORDS.has(keyword)) continue;

    if (keyword === 'type' && Array.isArray(value)) {
      const types = value.filter((entry): entry is string => typeof entry === 'string');
      const concrete = types.filter((entry) => entry !== 'null');
      if (concrete.length !== 1) {
        throw new Error(
          `jsonSchemaToOpenApi: união de tipos não representável em OpenAPI 3.0: ${JSON.stringify(value)}.`,
        );
      }
      converted.type = concrete[0];
      if (types.length !== concrete.length) converted.nullable = true;
      continue;
    }

    if ((keyword === 'exclusiveMinimum' || keyword === 'exclusiveMaximum') && typeof value === 'number') {
      converted[keyword === 'exclusiveMinimum' ? 'minimum' : 'maximum'] = value;
      converted[keyword] = true;
      continue;
    }

    if (keyword === 'properties' && isRecord(value)) {
      converted.properties = Object.fromEntries(
        Object.entries(value).map(([property, subSchema]) => [property, jsonSchemaToOpenApi(subSchema)]),
      );
      continue;
    }

    if (keyword === 'items') {
      converted.items = jsonSchemaToOpenApi(value);
      continue;
    }

    if ((keyword === 'allOf' || keyword === 'anyOf' || keyword === 'oneOf') && Array.isArray(value)) {
      converted[keyword] = value.map((entry) => jsonSchemaToOpenApi(entry));
      continue;
    }

    if (keyword === 'additionalProperties' && isRecord(value)) {
      converted.additionalProperties = jsonSchemaToOpenApi(value);
      continue;
    }

    converted[keyword] = value;
  }

  return converted as SchemaObject;
}
