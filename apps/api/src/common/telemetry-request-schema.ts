import { loadTelemetryCycleSchema } from '@dynamox/contracts';
import type { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { jsonSchemaToOpenApi } from './json-schema-to-openapi';

/**
 * Schema do corpo de POST /telemetry-cycles publicado no OpenAPI.
 *
 * Deriva de `loadTelemetryCycleSchema()` — a mesma leitura que alimenta o Ajv — para que
 * o contrato publicado não possa afirmar regra que o validador não aplica, nem omitir
 * regra que ele aplica.
 */
let cached: SchemaObject | null = null;

export function telemetryCycleRequestSchema(): SchemaObject {
  // O documento é lido do disco uma vez: o schema é imutável em runtime e o Swagger o
  // resolve a cada geração do documento.
  cached ??= jsonSchemaToOpenApi(loadTelemetryCycleSchema());
  return cached;
}
