/**
 * Validação dos artefatos do SCP-04: sintaxe dos JSONs, integridade do snapshot público
 * e conformidade do exemplo contra o contrato interno.
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

import {
  EXAMPLE_RELATIVE_PATH,
  SCHEMA_RELATIVE_PATH,
  findRepositoryRoot,
  validateTelemetryCycle,
} from '@dynamox/contracts';

const OPENAPI_RELATIVE_PATH = join('contracts', 'dynamox', 'dynamox-public-api.openapi.json');
const EXPECTED_OPENAPI_SHA256 =
  'cc6e0f07f9a2c16336a30acf09acdf56d97d64a01e0e90fceac9c30c04b225dd';

const root = findRepositoryRoot();
const failures: string[] = [];

function readJson(relativePath: string): unknown {
  const raw = readFileSync(join(root, relativePath), 'utf8');
  return JSON.parse(raw);
}

console.log('SCP-04 — validação dos contratos\n');

// 1. Sintaxe dos três JSONs.
for (const relativePath of [OPENAPI_RELATIVE_PATH, SCHEMA_RELATIVE_PATH, EXAMPLE_RELATIVE_PATH]) {
  try {
    readJson(relativePath);
    console.log(`  [ok]    JSON válido: ${relativePath}`);
  } catch (error) {
    failures.push(`JSON inválido em ${relativePath}: ${(error as Error).message}`);
    console.log(`  [FALHA] JSON inválido: ${relativePath}`);
  }
}

// 2. Integridade e versão do snapshot público.
const openapiBuffer = readFileSync(join(root, OPENAPI_RELATIVE_PATH));
const actualSha256 = createHash('sha256').update(openapiBuffer).digest('hex');
if (actualSha256 === EXPECTED_OPENAPI_SHA256) {
  console.log(`  [ok]    SHA-256 do snapshot confere: ${actualSha256}`);
} else {
  failures.push(
    `SHA-256 do snapshot divergente. Esperado ${EXPECTED_OPENAPI_SHA256}, obtido ${actualSha256}.`,
  );
  console.log(`  [FALHA] SHA-256 do snapshot divergente: ${actualSha256}`);
}

const openapi = readJson(OPENAPI_RELATIVE_PATH) as {
  info?: { version?: string };
  paths?: Record<string, unknown>;
};
console.log(
  `  [ok]    OpenAPI info.version=${openapi.info?.version} com ${Object.keys(openapi.paths ?? {}).length} rotas`,
);

// 3. Ausência de credenciais nos artefatos versionados.
const credentialPattern = /(bearer\s+[A-Za-z0-9._-]{16,})|("x-api-key"\s*:\s*"[^"]+")/i;
for (const relativePath of [SCHEMA_RELATIVE_PATH, EXAMPLE_RELATIVE_PATH]) {
  const raw = readFileSync(join(root, relativePath), 'utf8');
  if (credentialPattern.test(raw)) {
    failures.push(`Possível credencial encontrada em ${relativePath}`);
    console.log(`  [FALHA] possível credencial em ${relativePath}`);
  } else {
    console.log(`  [ok]    sem credenciais literais: ${relativePath}`);
  }
}

// 4. Exemplo contra o contrato interno.
const example = readJson(EXAMPLE_RELATIVE_PATH);
const result = validateTelemetryCycle(example);
if (result.valid) {
  const measurements = result.payload.telemetryCycleData.measurements;
  const samples = measurements.reduce((total, m) => total + m.dataPoints.length, 0);
  console.log(
    `  [ok]    exemplo válido contra o schema interno (${measurements.length} medições, ${samples} amostras)`,
  );
} else {
  for (const violation of result.violations) {
    failures.push(`Exemplo inválido em ${violation.path}: ${violation.message}`);
    console.log(`  [FALHA] exemplo inválido em ${violation.path}: ${violation.message}`);
  }
}

// 5. O campo canônico interno é monitoringLocationMap.
const schema = readJson(SCHEMA_RELATIVE_PATH) as {
  properties?: { configuration?: { required?: string[]; properties?: Record<string, unknown> } };
};
const configurationRequired = schema.properties?.configuration?.required ?? [];
if (configurationRequired.includes('monitoringLocationMap')) {
  console.log('  [ok]    campo canônico interno monitoringLocationMap exigido em configuration');
} else {
  failures.push('O contrato interno deveria exigir monitoringLocationMap em configuration.');
  console.log('  [FALHA] monitoringLocationMap não é exigido em configuration');
}

if (Object.hasOwn(schema.properties?.configuration?.properties ?? {}, 'monitoringLocationMapSchema')) {
  failures.push(
    'monitoringLocationMapSchema não deve aparecer no contrato interno; é apenas alias/inconsistência da especificação pública.',
  );
  console.log('  [FALHA] monitoringLocationMapSchema presente no contrato interno');
} else {
  console.log('  [ok]    monitoringLocationMapSchema ausente do contrato interno (apenas alias público)');
}

console.log('');
if (failures.length > 0) {
  console.error(`SCP-04: ${failures.length} falha(s).`);
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log('SCP-04: todos os contratos válidos.');
