/**
 * SCP-05 — Inventário reproduzível das 18 operações públicas relevantes ao sensor digital.
 *
 * Princípios:
 * 1. Extração fiel: o subtree de cada operação é copiado do snapshot com $ref resolvido
 *    por JSON Pointer completo (escapes ~0/~1, detecção de ciclo). Nada é resumido à mão.
 * 2. Sem truncamento silencioso: toda estrutura que não puder ser expandida vira um
 *    marcador { truncated: true, reason, sourcePointer, ref? }, e a lista completa de
 *    truncamentos aparece em `truncations` na raiz do arquivo.
 * 3. Separação extraído × curado: o que veio do snapshot fica em `extracted`; papel local,
 *    confiança e notas ficam em `curated`. Derivações (tabela de sampling por modelo,
 *    Nyquist) ficam em `derived`, com o ponteiro de origem.
 * 4. Determinismo: sem relógio de parede, sem locale, chaves ordenadas por comparação
 *    binária. Regerar com o mesmo snapshot produz exatamente os mesmos bytes — inclusive
 *    nas tabelas injetadas nos relatórios Markdown entre marcadores GENERATED.
 *
 * Uso:  npm run analysis:inventory
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { findRepositoryRoot } from '@dynamox/contracts';

const SNAPSHOT = join('contracts', 'dynamox', 'dynamox-public-api.openapi.json');
const OUTPUT = join('docs', 'analysis', '04-contracts', 'dynamox-endpoint-inventory.json');
const MAPPING_MD = join('docs', 'analysis', '04-contracts', 'dynamox-sensor-api-mapping.md');
const BLUEPRINT_MD = join('docs', 'analysis', 'archive', 'scp05', 'dynamox-digital-sensor-blueprint.md');
const SOURCE_CONSULTED_AT = '2026-08-26';

type Json = Record<string, unknown>;

const rec = (value: unknown): Json =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Json) : {};
const arr = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const str = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

/** Comparação binária explícita: determinismo independente de locale e runtime. */
const byCodeUnit = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

// ---------------------------------------------------------------------------
// JSON Pointer (RFC 6901)
// ---------------------------------------------------------------------------

const unescapeSegment = (segment: string): string =>
  segment.replace(/~1/g, '/').replace(/~0/g, '~');
const escapeSegment = (segment: string): string =>
  segment.replace(/~/g, '~0').replace(/\//g, '~1');

function resolvePointer(doc: unknown, pointer: string): { found: boolean; value?: unknown } {
  if (!pointer.startsWith('#')) return { found: false };
  const body = pointer.slice(1);
  // RFC 6901: '#' é a raiz; '#/' referencia a propriedade de nome vazio (cai no laço abaixo).
  if (body === '') return { found: true, value: doc };
  let current: unknown = doc;
  for (const rawSegment of body.split('/').slice(1)) {
    const segment = unescapeSegment(rawSegment);
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) {
        return { found: false };
      }
      current = current[index];
    } else if (current !== null && typeof current === 'object') {
      if (!Object.hasOwn(current as Json, segment)) return { found: false };
      current = (current as Json)[segment];
    } else {
      return { found: false };
    }
  }
  return { found: true, value: current };
}

// ---------------------------------------------------------------------------
// Normalização fiel do snapshot (refs resolvidos, chaves ordenadas, sem perdas)
// ---------------------------------------------------------------------------

interface TruncationMarker {
  truncated: true;
  reason: string;
  sourcePointer: string;
  ref?: string;
}

const truncations: TruncationMarker[] = [];

function truncate(reason: string, sourcePointer: string, ref?: string): TruncationMarker {
  const entry: TruncationMarker = { truncated: true, reason, sourcePointer, ...(ref ? { ref } : {}) };
  truncations.push(entry);
  return entry;
}

/**
 * Profundidade muito acima de qualquer schema real do snapshot: só é atingida por
 * estrutura patológica, e nesse caso o corte é explícito, nunca silencioso.
 */
const MAX_DEPTH = 60;

function normalize(spec: Json, node: unknown, pointer: string, refStack: readonly string[], depth: number): unknown {
  if (depth > MAX_DEPTH) return truncate('profundidade máxima excedida', pointer);
  if (Array.isArray(node)) {
    return node.map((item, index) => normalize(spec, item, `${pointer}/${index}`, refStack, depth + 1));
  }
  if (node === null || typeof node !== 'object') return node;

  const obj = node as Json;
  const ref = str(obj.$ref);
  if (ref) {
    if (!ref.startsWith('#')) return truncate('referência externa ao documento não suportada', pointer, ref);
    if (refStack.includes(ref)) return truncate('referência circular', pointer, ref);
    const target = resolvePointer(spec, ref);
    if (!target.found) return truncate('referência não resolvida no documento', pointer, ref);
    const resolved = normalize(spec, target.value, ref, [...refStack, ref], depth + 1);
    if (resolved !== null && typeof resolved === 'object' && !Array.isArray(resolved)) {
      return { $resolvedFrom: ref, ...(resolved as Json) };
    }
    return resolved;
  }

  const out: Json = {};
  for (const key of Object.keys(obj).sort(byCodeUnit)) {
    out[key] = normalize(spec, obj[key], `${pointer}/${escapeSegment(key)}`, refStack, depth + 1);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Curadoria (papel local e confiança) — decisões nossas, separadas do extraído
// ---------------------------------------------------------------------------

interface Curated {
  group: string;
  localRole: 'usar' | 'adaptar' | 'ignorar' | 'investigar';
  confidence: 'confirmado' | 'ambiguo' | 'nao-confirmado';
  localNote: string;
}

const CURATED: Record<string, Curated> = {
  'GET /v1/workspaces': {
    group: 'A. Contexto e hierarquia',
    localRole: 'ignorar',
    confidence: 'confirmado',
    localNote:
      'O desafio não tem multi-tenant. Workspace é a raiz da hierarquia produtiva e não tem equivalente local.',
  },
  'GET /v1/workspaces/{workspaceId}/assets': {
    group: 'A. Contexto e hierarquia',
    localRole: 'adaptar',
    confidence: 'confirmado',
    localNote: 'Asset é o análogo público de Machine. Confirma a cardinalidade workspace -> asset.',
  },
  'GET /v1/assets/:assetId/monitoring-points': {
    group: 'A. Contexto e hierarquia',
    localRole: 'adaptar',
    confidence: 'ambiguo',
    localNote:
      'Fonte de spotCharacteristics (rpm anulável, monitoringPositionSlug com enum que inclui bearinghousing, mechanicalSettings) e de sensors[].axesOrientation (x/y/z em axial|radial|tangential|horizontal|vertical). O path usa :assetId em estilo Express apesar de declarar o parâmetro de path.',
  },
  'POST /v1/measuring-systems': {
    group: 'B. Provisionamento do sensor',
    localRole: 'adaptar',
    confidence: 'confirmado',
    localNote:
      'Measuring System é o análogo público de Sensor. As respostas 400/403/404 confirmam textualmente a dependência de Resource Model instanciável e de permissões de workspace.',
  },
  'POST /v1/configuration-slots': {
    group: 'B. Provisionamento do sensor',
    localRole: 'investigar',
    confidence: 'ambiguo',
    localNote:
      'Separa configuração disponível de sensor associado. Contém a inconsistência monitoringLocationMap (required) vs monitoringLocationMapSchema (properties).',
  },
  'PATCH /v1/configuration-slots/{configurationSlotId}:associate': {
    group: 'B. Provisionamento do sensor',
    localRole: 'adaptar',
    confidence: 'confirmado',
    localNote:
      'Confirma que associar sensor ao ponto é operação distinta de criar a configuração. Local resolve com Sensor.monitoringPointId único.',
  },
  'POST /v1/telemetry-cycles': {
    group: 'C. Ingestão',
    localRole: 'usar',
    confidence: 'confirmado',
    localNote:
      'Base do contrato interno do SCP-04 e do endpoint local POST /api/telemetry-cycles. A description de measurements fala em "array de identificadores", mas os itens são objetos — o schema foi seguido, não a description.',
  },
  'GET /v1/telemetry/metric-descriptor': {
    group: 'D. Telemetria escalar',
    localRole: 'usar',
    confidence: 'ambiguo',
    localNote:
      'Identidade semântica da métrica. Atenção: attributes é um objeto SEM properties nem required no schema; axis e physicalQuantity aparecem apenas em examples. Tratar axis como convenção observada, não como contrato estrutural.',
  },
  'GET /v1beta/telemetry/data-points/raw': {
    group: 'D. Telemetria escalar',
    localRole: 'adaptar',
    confidence: 'ambiguo',
    localNote:
      'Leitura paginada por cursor (limit + pageToken; resposta traz next anulável). O ponto de dado usa o nome datetime na leitura, enquanto a escrita usa timestamp; o value de leitura aceita boolean | integer | number.',
  },
  'GET /v1/telemetry/data-points/aggregation': {
    group: 'D. Telemetria escalar',
    localRole: 'adaptar',
    confidence: 'confirmado',
    localNote:
      'Agregação por bucket temporal com max, avg, min e count por datetime. Origem da forma do endpoint local de métricas.',
  },
  'GET /v1/waveforms/': {
    group: 'E. Waveform e análise vibracional',
    localRole: 'investigar',
    confidence: 'ambiguo',
    localNote:
      'Fonte dos parâmetros de aquisição (settings: samplingRate, samples, duration, axis {x,y,z} booleanos, autoRange) e da tabela nominal de sampling por modelo nas descriptions. O summary promete lista e os query params exigem monitoringPointIds/fromTime/toTime com page/limit/sort, mas o schema 200 é um objeto único — divergência registrada.',
  },
  'GET /v1/waveform/{waveformId}/raw': {
    group: 'E. Waveform e análise vibracional',
    localRole: 'ignorar',
    confidence: 'confirmado',
    localNote:
      'Sinal denso no tempo: x/y/z são array | null, time é obrigatório, e physicalQuantity/unit são enums travados em acceleration/g. Fora do MVP; documenta o formato-alvo do sensor digital.',
  },
  'GET /v1/waveform/{waveformId}/spectrum': {
    group: 'E. Waveform e análise vibracional',
    localRole: 'ignorar',
    confidence: 'confirmado',
    localNote:
      'Espectro: x/y/z array | null, frequency obrigatório, physicalQuantity/unit travados em acceleration/g. Fora do MVP pelo mesmo motivo do sinal bruto.',
  },
  'GET /v1/waveform/{waveformId}/metrics': {
    group: 'E. Waveform e análise vibracional',
    localRole: 'usar',
    confidence: 'confirmado',
    localNote:
      'Features espectrais: attributes exige physicalQuantity, statisticalProcessing e band (strings livres); unit é string | null (métricas adimensionais têm unit null); value exige x, y e z, cada um number | null. Não existe atributo axis — normalizar exige explodir por eixo preservando nulos.',
  },
  'GET /v1/automatic-diagnostics/{waveformId}': {
    group: 'F. Diagnóstico e alertas',
    localRole: 'adaptar',
    confidence: 'confirmado',
    localNote:
      'Hipótese de falha com status detected | notEvaluated | notDetected e displayName multilíngue. Base do faultStatus do ConditionAssessment.',
  },
  'GET /v1/alert-policies/status': {
    group: 'F. Diagnóstico e alertas',
    localRole: 'adaptar',
    confidence: 'confirmado',
    localNote: 'Severidade corrente por política: no-alert | a1 | a2 (anulável). Base do suggestedSeverity.',
  },
  'GET /v1/alert-policies/{policyId}': {
    group: 'F. Diagnóstico e alertas',
    localRole: 'adaptar',
    confidence: 'confirmado',
    localNote:
      'Estrutura das condições: cada elemento de conditions[] tem um combinator (and | or) que combina as alertFunctions daquela condição; cada função tem evaluator (string anulável, domínio não documentado), threshold (> 0, anulável) e consecutive (inteiro >= 1, default 1 — persistência/debounce, não histerese).',
  },
  'GET /v1/alert-policies/{policyId}/history': {
    group: 'F. Diagnóstico e alertas',
    localRole: 'investigar',
    confidence: 'confirmado',
    localNote: 'Histórico de transições de severidade. Sem equivalente local nesta fase.',
  },
};

// ---------------------------------------------------------------------------
// Derivações explícitas (tabela de sampling por modelo → Nyquist)
// ---------------------------------------------------------------------------

interface ProfileRow {
  model: string;
  samplingRatesHz: number[];
  samplesOptions: number[];
}

function parseModelTable(description: string): ProfileRow[] {
  const rows: ProfileRow[] = [];
  const numbers = (cell: string): number[] => (cell.match(/\d+/g) ?? []).map(Number);

  for (const line of description.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    const cells = trimmed.split('|').map((cell) => cell.trim());
    const model = cells[1] ?? '';
    if (model === 'Model' || /^-+$/.test(model)) continue;

    const rates = numbers(cells[2] ?? '');
    const samples = numbers(cells[3] ?? '');
    if (model !== '') {
      rows.push({ model, samplingRatesHz: rates, samplesOptions: samples });
    } else if (rows.length > 0) {
      // Linha de continuação da mesma célula (modelos com listas longas quebram em duas linhas).
      rows[rows.length - 1].samplingRatesHz.push(...rates);
      rows[rows.length - 1].samplesOptions.push(...samples);
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Injeção de tabelas geradas nos relatórios Markdown
// ---------------------------------------------------------------------------

function injectGenerated(root: string, relativePath: string, name: string, content: string): string {
  const absolute = join(root, relativePath);
  if (!existsSync(absolute)) return `pulado (${relativePath} não existe)`;
  const original = readFileSync(absolute, 'utf8');
  const begin = `<!-- BEGIN GENERATED:${name} -->`;
  const end = `<!-- END GENERATED:${name} -->`;
  const beginAt = original.indexOf(begin);
  const endAt = original.indexOf(end);
  if (beginAt === -1 || endAt === -1 || endAt < beginAt) {
    return `pulado (marcadores GENERATED:${name} ausentes em ${relativePath})`;
  }
  const updated =
    original.slice(0, beginAt + begin.length) + '\n' + content + '\n' + original.slice(endAt);
  if (updated !== original) writeFileSync(absolute, updated, 'utf8');
  return updated === original ? `inalterado (${relativePath})` : `atualizado (${relativePath})`;
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

const root = findRepositoryRoot();
const rawSnapshot = readFileSync(join(root, SNAPSHOT));
const spec = JSON.parse(rawSnapshot.toString('utf8')) as Json;
const specPaths = rec(spec.paths);

const HTTP_METHODS = ['delete', 'get', 'patch', 'post', 'put'] as const;

// Censo de segurança sobre TODAS as operações do snapshot (não só as 18).
const securityCensus: Record<string, number> = {};
let totalOperations = 0;
for (const path of Object.keys(specPaths).sort(byCodeUnit)) {
  const item = rec(specPaths[path]);
  for (const method of HTTP_METHODS) {
    if (!Object.hasOwn(item, method)) continue;
    totalOperations += 1;
    const security = arr(rec(item[method]).security)
      .flatMap((entry) => Object.keys(rec(entry)))
      .sort(byCodeUnit);
    const label = security.length > 0 ? security.join('+') : '(sem bloco security)';
    securityCensus[label] = (securityCensus[label] ?? 0) + 1;
  }
}

const PAGINATION_HINTS = ['cursor', 'direction', 'limit', 'offset', 'order', 'page', 'pagetoken', 'sort'];
const TIME_WINDOW_HINTS = ['end', 'from', 'fromtime', 'insertedfromtime', 'insertedtotime', 'start', 'to', 'totime'];

const operations = Object.keys(CURATED)
  .sort(byCodeUnit)
  .map((key) => {
    const spaceAt = key.indexOf(' ');
    const method = key.slice(0, spaceAt);
    const path = key.slice(spaceAt + 1);
    const methodKey = method.toLowerCase();
    const opNode = rec(rec(specPaths[path])[methodKey]);
    if (Object.keys(opNode).length === 0) {
      throw new Error(`Operação ausente no snapshot: ${key}`);
    }

    const opPointer = `#/paths/${escapeSegment(path)}/${methodKey}`;
    const extractedOp = rec(normalize(spec, opNode, opPointer, [], 0));

    const paramNames = arr(opNode.parameters)
      .map((p) => (str(rec(p).name) ?? '').toLowerCase())
      .filter((name) => name.length > 0)
      .sort(byCodeUnit);

    const responseCodes = Object.keys(rec(opNode.responses)).sort(byCodeUnit);

    return {
      key,
      method,
      path,
      sourcePointer: opPointer,
      extracted: {
        operation: extractedOp,
        responseCodes: {
          success: responseCodes.filter((code) => /^2\d\d$/.test(code)),
          documentedErrors: responseCodes.filter((code) => /^[45]\d\d$/.test(code)),
        },
        paginationParams: paramNames.filter((name) => PAGINATION_HINTS.includes(name)),
        timeWindowParams: paramNames.filter((name) => TIME_WINDOW_HINTS.includes(name)),
      },
      curated: CURATED[key],
    };
  })
  .sort(
    (a, b) =>
      byCodeUnit(a.curated.group, b.curated.group) ||
      byCodeUnit(a.path, b.path) ||
      byCodeUnit(a.method, b.method),
  );

// Derivação: tabela nominal de sampling por modelo, extraída da description de
// settings[].samplingRate em GET /v1/waveforms/.
const samplingPointer =
  '#/paths/~1v1~1waveforms~1/get/responses/200/content/application~1json/schema/properties/settings/items/properties/samplingRate/description';
const samplingDescription = resolvePointer(spec, samplingPointer);
const profileRows = parseModelTable(str(samplingDescription.value) ?? '');

const derivedProfiles = profileRows.map((row) => ({
  model: row.model,
  samplingRatesHz: row.samplingRatesHz,
  samplesOptions: row.samplesOptions,
  maxSamplingRateHz: row.samplingRatesHz.length > 0 ? Math.max(...row.samplingRatesHz) : null,
  // Nyquist = fs/2. É um TETO teórico de frequência analisável, DERIVADO da taxa nominal;
  // a banda útil real depende de filtro anti-aliasing e NÃO está no snapshot.
  nyquistMaxHz:
    row.samplingRatesHz.length > 0 ? Math.max(...row.samplingRatesHz) / 2 : null,
}));

const inventory = {
  $comment:
    'Gerado por tools/extract-endpoint-inventory.ts a partir do snapshot versionado. Não editar à mão. Determinístico: sem relógio de parede; chaves em ordem binária; $ref resolvido por JSON Pointer com $resolvedFrom; estruturas não expandíveis viram {truncated:true,...} e aparecem também na lista `truncations`.',
  source: {
    file: SNAPSHOT,
    url: 'https://api.dynamox.solutions/openapi.json',
    apiVersion: rec(spec.info).version ?? null,
    openapiVersion: spec.openapi ?? null,
    sha256: createHash('sha256').update(rawSnapshot).digest('hex'),
    bytes: rawSnapshot.length,
    consultedAt: SOURCE_CONSULTED_AT,
    totalPathsInSnapshot: Object.keys(specPaths).length,
    totalOperationsInSnapshot: totalOperations,
    generatedBy: 'npm run analysis:inventory',
  },
  security: {
    schemesDeclaredInComponents: Object.keys(rec(rec(spec.components).securitySchemes)).sort(byCodeUnit),
    operationsBySecurityRequirement: Object.fromEntries(
      Object.entries(securityCensus).sort(([a], [b]) => byCodeUnit(a, b)),
    ),
    note: 'Os nomes referenciados pelas operações não possuem definição em components.securitySchemes (objeto vazio): são referências pendentes, não apenas nomenclatura divergente.',
  },
  derived: {
    profileSamplingTable: {
      derivedFrom: samplingPointer,
      note: 'CONFIRMADO: taxas e amostras nominais por modelo constam literalmente na description. DERIVADO: maxSamplingRateHz e nyquistMaxHz (fs/2) são calculados; banda útil real é DESCONHECIDA (depende de filtro anti-aliasing não documentado).',
      models: derivedProfiles,
    },
  },
  operationCount: operations.length,
  operations,
  truncations,
};

const outputJson = `${JSON.stringify(inventory, null, 2)}\n`;
writeFileSync(join(root, OUTPUT), outputJson, 'utf8');

// ---------------------------------------------------------------------------
// Tabelas geradas para os relatórios (fonte única: este inventário)
// ---------------------------------------------------------------------------

const endpointTableLines = [
  '| Grupo | Operação | Papel local (curadoria) | Confiança (curadoria) |',
  '|---|---|---|---|',
  ...operations.map(
    (op) =>
      `| ${op.curated.group} | \`${op.method} ${op.path}\` | ${op.curated.localRole} | ${op.curated.confidence} |`,
  ),
];

const formatList = (values: number[]): string => values.join(', ');
const profileTableLines = [
  '| Modelo (snapshot) | Sampling rates (Hz) — CONFIRMADO | Samples — CONFIRMADO | Nyquist máx. fs/2 (Hz) — DERIVADO |',
  '|---|---|---|---|',
  ...derivedProfiles.map(
    (p) =>
      `| ${p.model} | ${formatList(p.samplingRatesHz)} | ${formatList(p.samplesOptions)} | ${p.nyquistMaxHz ?? '—'} |`,
  ),
];

const injections = [
  injectGenerated(root, MAPPING_MD, 'endpoint-table', endpointTableLines.join('\n')),
  injectGenerated(root, MAPPING_MD, 'profile-sampling-table', profileTableLines.join('\n')),
  injectGenerated(root, BLUEPRINT_MD, 'profile-sampling-table', profileTableLines.join('\n')),
];

console.log(`Inventário gerado: ${OUTPUT}`);
console.log(`  operações: ${operations.length} de ${totalOperations} no snapshot`);
console.log(`  snapshot : API ${String(inventory.source.apiVersion)} (sha256 ${inventory.source.sha256.slice(0, 16)}…)`);
console.log(`  truncamentos explícitos: ${truncations.length}`);
console.log(`  modelos na tabela de sampling: ${derivedProfiles.map((p) => p.model).join(', ')}`);
for (const result of injections) console.log(`  injeção: ${result}`);
console.log(`  sha256 do inventário: ${createHash('sha256').update(outputJson).digest('hex')}`);
