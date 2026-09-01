/**
 * Cliente da API REAL (B4): login com a credencial de demonstração já documentada pelo
 * projeto, guarda anti-produção e POST no endpoint de ingestão existente — o twin
 * consome o P0, nunca o contorna.
 *
 * Configuração (nesta ordem): TWIN_API_URL / TWIN_EMAIL / TWIN_PASSWORD do ambiente →
 * SEED_USER_EMAIL / SEED_USER_PASSWORD do `.env` da raiz → defaults públicos de
 * demonstração do README. Nenhum segredo real vive aqui.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { findRepositoryRoot } from '@dynamox/contracts';

import type { BuiltCycle } from './payload';

export interface TwinApiConfig {
  baseUrl: string;
  email: string;
  password: string;
}

/** Toda chamada tem prazo: servidor que aceita e trava não pendura a CLI. */
const HTTP_TIMEOUT_MS = Number(process.env.TWIN_HTTP_TIMEOUT_MS ?? 15_000);

function httpSignal(): AbortSignal {
  return AbortSignal.timeout(HTTP_TIMEOUT_MS);
}

/** Parser mínimo de .env (KEY=VALUE, sem interpolação) — só para ler a credencial demo. */
function readRootDotEnv(): Record<string, string> {
  try {
    const path = join(findRepositoryRoot(), '.env');
    if (!existsSync(path)) return {};
    const entries: Record<string, string> = {};
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (match) entries[match[1]] = match[2];
    }
    return entries;
  } catch {
    return {};
  }
}

/**
 * O twin só fala com a API local do desafio: recusa fatalmente domínios da Dynamox e
 * qualquer host que não seja loopback. Dados sintéticos jamais tocam produção.
 */
export function assertLocalBaseUrl(baseUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error(`TWIN_API_URL inválida: "${baseUrl}".`);
  }
  if (/(^|\.)dynamox\.(solutions|net)$/i.test(parsed.hostname)) {
    throw new Error(
      `TWIN_API_URL aponta para um domínio da Dynamox ("${parsed.hostname}"). O gêmeo só pode falar com a API local.`,
    );
  }
  if (!['localhost', '127.0.0.1'].includes(parsed.hostname)) {
    throw new Error(
      `TWIN_API_URL precisa ser local (localhost/127.0.0.1); recebido "${parsed.hostname}".`,
    );
  }
  return baseUrl.replace(/\/$/, '');
}

export function loadTwinConfig(env: NodeJS.ProcessEnv = process.env): TwinApiConfig {
  const dotEnv = readRootDotEnv();
  return {
    baseUrl: assertLocalBaseUrl(env.TWIN_API_URL ?? 'http://localhost:3000/api'),
    email: env.TWIN_EMAIL ?? dotEnv.SEED_USER_EMAIL ?? 'analista@dynamox.local',
    password: env.TWIN_PASSWORD ?? dotEnv.SEED_USER_PASSWORD ?? 'Dynamox@2026',
  };
}

async function parseJson(response: Response, context: string): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new Error(`${context}: resposta não é JSON válido (HTTP ${response.status}).`);
  }
}

export async function login(config: TwinApiConfig): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: config.email, password: config.password }),
      signal: httpSignal(),
    });
  } catch {
    throw new Error(
      `API indisponível em ${config.baseUrl}. Suba com: npm run db:up && npm run dev:api`,
    );
  }
  if (response.status === 401) {
    throw new Error('Credencial inválida. Rode o seed primeiro: npm run seed');
  }
  if (!response.ok) {
    throw new Error(`Login falhou: HTTP ${response.status}.`);
  }
  const body = (await parseJson(response, 'Login')) as { token?: string };
  if (typeof body.token !== 'string' || body.token.length === 0) {
    throw new Error('Login respondeu sem token — contrato inesperado.');
  }
  return body.token;
}

/** Forma real da resposta de POST /api/telemetry-cycles (TS-06). */
export interface IngestionResponse {
  duplicate: boolean;
  cycleId: string;
  idempotencyKey: string;
  payloadFingerprint: string;
  measurementCount: number;
  sampleCount: number;
  timeSeriesIds: string[];
}

export async function ingestCycle(
  config: TwinApiConfig,
  token: string,
  cycle: BuiltCycle,
): Promise<{ status: number; body: IngestionResponse }> {
  return ingestPayload(config, token, cycle.payload, cycle.idempotencyKey);
}

/** POST de um payload arbitrário (ex.: reconstruído do bag ROS) com a chave dada. */
export async function ingestPayload(
  config: TwinApiConfig,
  token: string,
  payload: unknown,
  idempotencyKey: string,
): Promise<{ status: number; body: IngestionResponse }> {
  const response = await fetch(`${config.baseUrl}/telemetry-cycles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
    signal: httpSignal(),
  });

  // 201 = aquisição nova; 200 = repetição legítima. Qualquer outro status interrompe.
  if (response.status !== 200 && response.status !== 201) {
    const detail = JSON.stringify(await parseJson(response, 'Ingestão').catch(() => null));
    throw new Error(`Ingestão recusada: HTTP ${response.status} — ${detail}`);
  }
  const body = (await parseJson(response, 'Ingestão')) as IngestionResponse;
  return { status: response.status, body };
}

/** Resultado bruto de uma tentativa de ingestão — nunca lança por status HTTP. */
export interface IngestAttempt {
  /** 0 quando a requisição nem completou (rede/timeout). */
  status: number;
  body: IngestionResponse | null;
  errorCode: string | null;
  errorBody: unknown;
  networkError?: string;
}

/**
 * Variante NÃO lançadora de `ingestPayload`, para quem precisa classificar cada
 * resposta (retry, duplicata, conflito). Aceita o corpo já serializado para não
 * stringificar duas vezes em cargas grandes.
 */
export async function tryIngestPayload(
  config: TwinApiConfig,
  token: string,
  payload: unknown,
  idempotencyKey: string,
  options: { timeoutMs?: number } = {},
): Promise<IngestAttempt> {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}/telemetry-cycles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body,
      signal: AbortSignal.timeout(options.timeoutMs ?? HTTP_TIMEOUT_MS),
    });
  } catch (error) {
    return { status: 0, body: null, errorCode: null, errorBody: null, networkError: String((error as Error).message ?? error) };
  }
  const parsed = await parseJson(response, 'Ingestão').catch(() => null);
  if (response.status === 200 || response.status === 201) {
    return { status: response.status, body: parsed as IngestionResponse, errorCode: null, errorBody: null };
  }
  const code = parsed && typeof parsed === 'object' && 'code' in parsed ? String((parsed as { code: unknown }).code) : null;
  return { status: response.status, body: null, errorCode: code, errorBody: parsed };
}

export interface SeriesSummary {
  id: string;
  sensorSerialNumber: string;
  physicalQuantity: string;
  axis: string | null;
  unit: string;
  sampleCount: number;
}

export async function fetchSeries(config: TwinApiConfig, token: string): Promise<SeriesSummary[]> {
  const response = await fetch(`${config.baseUrl}/time-series`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: httpSignal(),
  });
  if (!response.ok) throw new Error(`GET /time-series falhou: HTTP ${response.status}.`);
  return (await parseJson(response, 'Séries')) as SeriesSummary[];
}

export interface SamplesPage {
  items: Array<{ timestamp: string; value: number }>;
  total: number;
  limit: number;
  offset: number;
}

export async function fetchSamples(
  config: TwinApiConfig,
  token: string,
  seriesId: string,
  options: { limit?: number; offset?: number } = {},
): Promise<SamplesPage> {
  const query = new URLSearchParams();
  if (options.limit !== undefined) query.set('limit', String(options.limit));
  if (options.offset !== undefined) query.set('offset', String(options.offset));
  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  const response = await fetch(`${config.baseUrl}/time-series/${seriesId}/samples${suffix}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: httpSignal(),
  });
  if (!response.ok) throw new Error(`GET samples falhou: HTTP ${response.status}.`);
  return (await parseJson(response, 'Amostras')) as SamplesPage;
}

/** Varre TODAS as páginas: a prova de persistência nunca depende de caber em uma. */
export async function fetchAllSamples(
  config: TwinApiConfig,
  token: string,
  seriesId: string,
): Promise<Array<{ timestamp: string; value: number }>> {
  const pageSize = 5000;
  const all: Array<{ timestamp: string; value: number }> = [];
  for (let offset = 0; ; offset += pageSize) {
    const page = await fetchSamples(config, token, seriesId, { limit: pageSize, offset });
    all.push(...page.items);
    if (offset + pageSize >= page.total || page.items.length === 0) return all;
  }
}

// ————— Cliente da API de gestão (usado pelo bootstrap da planta, F2) —————

export interface MachineItem {
  id: string;
  name: string;
  type: string;
}

export async function listMachines(config: TwinApiConfig, token: string): Promise<MachineItem[]> {
  const response = await fetch(`${config.baseUrl}/machines`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: httpSignal(),
  });
  if (!response.ok) throw new Error(`GET /machines falhou: HTTP ${response.status}.`);
  return (await parseJson(response, 'Máquinas')) as MachineItem[];
}

export interface ApiAttempt<T> {
  status: number;
  body: T | null;
}

async function postJson<T>(
  config: TwinApiConfig,
  token: string,
  path: string,
  payload: unknown,
): Promise<ApiAttempt<T>> {
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: httpSignal(),
  });
  const body = (await response.json().catch(() => null)) as T | null;
  return { status: response.status, body };
}

export function createMachineApi(
  config: TwinApiConfig,
  token: string,
  name: string,
  type: string,
): Promise<ApiAttempt<MachineItem>> {
  return postJson<MachineItem>(config, token, '/machines', { name, type });
}

export interface MonitoringPointItem {
  id: string;
  name: string;
  machine: { id: string; name: string; type: string };
  sensor: { id: string; serialNumber: string; model: string } | null;
}

export function createMonitoringPointApi(
  config: TwinApiConfig,
  token: string,
  machineId: string,
  name: string,
): Promise<ApiAttempt<MonitoringPointItem>> {
  return postJson<MonitoringPointItem>(config, token, '/monitoring-points', { machineId, name });
}

export function assignSensorApi(
  config: TwinApiConfig,
  token: string,
  pointId: string,
  serialNumber: string,
  model: string,
): Promise<ApiAttempt<MonitoringPointItem>> {
  return postJson<MonitoringPointItem>(config, token, `/monitoring-points/${pointId}/sensor`, {
    serialNumber,
    model,
  });
}

/** Varre TODAS as páginas de pontos: pageSize máximo nunca é tratado como prova. */
export async function fetchAllMonitoringPoints(
  config: TwinApiConfig,
  token: string,
): Promise<MonitoringPointItem[]> {
  const pageSize = 50;
  const all: MonitoringPointItem[] = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(
      `${config.baseUrl}/monitoring-points?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` }, signal: httpSignal() },
    );
    if (!response.ok) throw new Error(`GET /monitoring-points falhou: HTTP ${response.status}.`);
    const body = (await parseJson(response, 'Pontos')) as {
      items: MonitoringPointItem[];
      total: number;
      pageSize: number;
    };
    all.push(...body.items);
    if (body.items.length === 0 || page * body.pageSize >= body.total) return all;
  }
}
