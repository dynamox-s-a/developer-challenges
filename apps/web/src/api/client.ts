import type {
  AcquisitionDetailDto,
  AcquisitionPageDto,
  AlertDetailDto,
  AlertLevel,
  AlertListResponseDto,
  AlertListSortColumn,
  AlertStatusFilter,
  AlertType,
  ConditionKind,
  MachineListResponseDto,
  MachineListSortColumn,
  MachineSummaryDto,
  FleetConditionResponseDto,
  PointSummaryDto,
  HeatmapResponseDto,
  MachineType,
  RawSamplePageDto,
  SensorModel,
  SeriesMetrics,
  SeriesPointsResponseDto,
  TimeSeriesSamplePage,
  TimeWindowResponseDto,
  TimeSeriesSummary,
  UserRole,
} from '@dynamox/domain';

export interface MachineDto {
  id: string;
  name: string;
  type: MachineType;
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringPointDto {
  id: string;
  name: string;
  machine: { id: string; name: string; type: MachineType };
  sensor: { id: string; serialNumber: string; model: SensorModel } | null;
  createdAt: string;
  updatedAt: string;
}

export type MonitoringPointSortColumn =
  | 'machineName'
  | 'machineType'
  | 'pointName'
  | 'sensorModel';

export interface MonitoringPointPageDto {
  items: MonitoringPointDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy: MonitoringPointSortColumn;
  sortDir: 'asc' | 'desc';
  search: string | null;
  machineType: MachineType | null;
  sensorModel: SensorModel | null;
  hasSensor: boolean | null;
}

/** Recorte da listagem resolvido pelo servidor; ausência é null, nunca string vazia. */
export interface MonitoringPointFilters {
  search: string | null;
  machineType: MachineType | null;
  sensorModel: SensorModel | null;
  hasSensor: boolean | null;
}

export interface MonitoringPointListParams extends Partial<MonitoringPointFilters> {
  page: number;
  pageSize?: number;
  sortBy: MonitoringPointSortColumn;
  sortDir: 'asc' | 'desc';
}

export interface HealthStatus {
  status: 'ok' | 'degraded';
  database: 'up' | 'down';
  version: string;
  timestamp: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const DEFAULT_BASE_URL = 'http://localhost:3000/api';

/**
 * O frontend nunca pode falar com a plataforma produtiva da Dynamox: os dados deste
 * projeto são sintéticos e a API de destino é sempre o backend local do desafio.
 */
export function assertLocalApiBaseUrl(baseUrl: string): string {
  let parsed: URL;

  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error(`VITE_API_BASE_URL inválida: "${baseUrl}".`);
  }

  if (/(^|\.)dynamox\.(solutions|net)$/i.test(parsed.hostname)) {
    throw new Error(
      `VITE_API_BASE_URL aponta para um domínio da Dynamox ("${parsed.hostname}"). Esta aplicação só pode consumir a API local.`,
    );
  }

  return baseUrl.replace(/\/$/, '');
}

export const API_BASE_URL = assertLocalApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
);

/**
 * Token em sessionStorage: sobrevive a reload da aba (sessão restaurável via /auth/me),
 * mas não a fechar o navegador. Trade-off aceito: mais simples que cookie httpOnly e
 * menos persistente que localStorage; sem refresh token, a sessão dura o JWT_EXPIRES_IN.
 */
const TOKEN_KEY = 'dynamox.jwt';

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // sessionStorage indisponível (ex.: modo privado restrito): sessão vive só em memória.
  }
}

/** Tratamento central de 401: registrado uma vez pelo bootstrap da aplicação. */
let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export class UnauthorizedError extends Error {}

/**
 * Erro de API com o status preservado. As páginas de investigação precisam distinguir
 * "janela inválida" (400) de "recurso inexistente" (404) — com uma Error genérica o
 * status se perdia e toda falha virava a mesma mensagem.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** O login trata o próprio 401 (credencial inválida ≠ sessão expirada). */
  skipUnauthorizedHandler?: boolean;
}

function apiErrorMessage(payload: unknown): string | null {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message;
  }
  return null;
}

async function request(path: string, options: RequestOptions = {}): Promise<Response> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    // Só derruba a sessão se o token desta requisição ainda for o atual: um 401 atrasado
    // de uma chamada feita com token antigo não pode apagar o token de um login novo.
    if (!options.skipUnauthorizedHandler && token === getToken()) onUnauthorized?.();
    const payload: unknown = await response.json().catch(() => null);
    throw new UnauthorizedError(apiErrorMessage(payload) ?? 'Não autorizado.');
  }

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const code =
      typeof payload === 'object' && payload !== null && 'code' in payload && typeof payload.code === 'string'
        ? payload.code
        : null;
    throw new ApiError(
      apiErrorMessage(payload) ?? `Falha ao consultar ${path}: HTTP ${response.status}`,
      response.status,
      code,
    );
  }

  return response;
}

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await request(path, options);
  if (response.status === 204) {
    throw new Error(`A API respondeu sem conteúdo para ${path}.`);
  }

  // Os DTOs são definidos pelo contrato local da API; o payload continua desconhecido
  // até cruzar esta única fronteira de desserialização.
  return response.json() as Promise<T>;
}

async function requestVoid(path: string, options: RequestOptions): Promise<void> {
  await request(path, options);
}

async function getAllMonitoringPoints(): Promise<MonitoringPointDto[]> {
  const pageSize = 50;
  const readPage = (page: number) => {
    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sortBy: 'machineName',
      sortDir: 'asc',
    });
    return requestJson<MonitoringPointPageDto>(`/monitoring-points?${query.toString()}`);
  };

  const first = await readPage(1);
  const items = [...first.items];
  const pageCount = Math.ceil(first.total / first.pageSize);
  for (let page = 2; page <= pageCount; page += 1) {
    items.push(...(await readPage(page)).items);
  }
  return items;
}

async function getAllSamples(id: string): Promise<TimeSeriesSamplePage['items']> {
  const limit = 5000;
  const readPage = (offset: number) =>
    requestJson<TimeSeriesSamplePage>(
      `/time-series/${id}/samples?${new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      }).toString()}`,
    );

  const first = await readPage(0);
  const items = [...first.items];
  for (let offset = first.items.length; offset < first.total; offset += limit) {
    items.push(...(await readPage(offset)).items);
  }
  return items;
}

/** Recorte da listagem de alertas — tudo opcional; a URL da tela é a fonte. */
export interface AlertListParams {
  status?: AlertStatusFilter | null;
  level?: AlertLevel | null;
  type?: AlertType | null;
  machine?: string | null;
  sensor?: string | null;
  search?: string | null;
  from?: string | null;
  to?: string | null;
  page?: number;
  pageSize?: number;
  sortBy?: AlertListSortColumn;
  sortDir?: 'asc' | 'desc';
}

export function alertListQuery(params: AlertListParams): string {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.level) query.set('level', params.level);
  if (params.type) query.set('type', params.type);
  if (params.machine) query.set('machine', params.machine);
  if (params.sensor) query.set('sensor', params.sensor);
  if (params.search) query.set('search', params.search);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.pageSize !== undefined) query.set('pageSize', String(params.pageSize));
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortDir) query.set('sortDir', params.sortDir);
  return query.toString();
}

/** Janela temporal de uma consulta analítica; `to` é exclusivo. */
export interface AnalyticsRange {
  from: string;
  to: string;
}

function rangeQuery(range: AnalyticsRange, extra: Record<string, string> = {}): string {
  const query = new URLSearchParams({ from: range.from, to: range.to, ...extra });
  return query.toString();
}

export const api = {
  health: () => requestJson<HealthStatus>('/health'),
  login: (email: string, password: string) =>
    requestJson<{ token: string; user: SessionUser }>('/auth/login', {
      method: 'POST',
      body: { email, password },
      skipUnauthorizedHandler: true,
    }),
  me: () => requestJson<SessionUser>('/auth/me'),
  machines: () => requestJson<MachineDto[]>('/machines'),
  createMachine: (name: string, type: MachineType) =>
    requestJson<MachineDto>('/machines', { method: 'POST', body: { name, type } }),
  updateMachine: (id: string, changes: { name?: string; type?: MachineType }) =>
    requestJson<MachineDto>(`/machines/${id}`, { method: 'PATCH', body: changes }),
  deleteMachine: (id: string) =>
    requestVoid(`/machines/${id}`, { method: 'DELETE' }),
  monitoringPoints: (params: MonitoringPointListParams) => {
    // URLSearchParams codifica os valores: sem isso o '+' de "HF+" viraria espaço.
    const query = new URLSearchParams({
      page: String(params.page),
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    });
    if (params.pageSize !== undefined) query.set('pageSize', String(params.pageSize));
    if (params.search) query.set('search', params.search);
    if (params.machineType) query.set('machineType', params.machineType);
    if (params.sensorModel) query.set('sensorModel', params.sensorModel);
    if (params.hasSensor !== null && params.hasSensor !== undefined) {
      query.set('hasSensor', String(params.hasSensor));
    }
    return requestJson<MonitoringPointPageDto>(`/monitoring-points?${query.toString()}`);
  },
  /**
   * O cadastro usa paginação de cinco itens, mas o dashboard precisa do inventário
   * completo. Percorremos o contrato público existente em páginas de até 50, sem
   * pressupor que a primeira resposta contenha toda a planta.
   */
  allMonitoringPoints: getAllMonitoringPoints,
  createMonitoringPoint: (machineId: string, name: string) =>
    requestJson<MonitoringPointDto>('/monitoring-points', {
      method: 'POST',
      body: { machineId, name },
    }),
  assignSensor: (pointId: string, serialNumber: string, model: SensorModel) =>
    requestJson<MonitoringPointDto>(`/monitoring-points/${pointId}/sensor`, {
      method: 'POST',
      body: { serialNumber, model },
    }),
  timeSeries: () => requestJson<TimeSeriesSummary[]>('/time-series'),
  samples: (id: string, options: { limit?: number; offset?: number } = {}) => {
    const query = new URLSearchParams();
    if (options.limit !== undefined) query.set('limit', String(options.limit));
    if (options.offset !== undefined) query.set('offset', String(options.offset));
    const suffix = query.size > 0 ? `?${query.toString()}` : '';
    return requestJson<TimeSeriesSamplePage>(`/time-series/${id}/samples${suffix}`);
  },
  /** Recupera a série inteira usando a paginação existente; nunca trunca em silêncio. */
  allSamples: getAllSamples,
  deleteTimeSeries: (id: string) =>
    requestVoid(`/time-series/${id}`, { method: 'DELETE' }),
  /**
   * Condição da frota calculada no BANCO. Substitui o download das séries radiais inteiras:
   * eram ~840 requisições e centenas de MB para chegar à mesma classificação.
   */
  fleetCondition: (
    range: AnalyticsRange,
    options: { includeTrend?: boolean; condition?: ConditionKind | null } = {},
  ) =>
    requestJson<FleetConditionResponseDto>(
      `/analytics/fleet-condition?${rangeQuery(range, {
        ...(options.includeTrend ? { includeTrend: 'true' } : {}),
        ...(options.condition ? { condition: options.condition } : {}),
      })}`,
    ),

  /**
   * Listagem operacional de máquinas: recorte por condição, busca, ordenação e paginação
   * resolvidos no servidor. Condição é derivada — não existe coluna para filtrar —, então
   * é a camada analítica que responde, e não um `filter()` sobre tudo o que foi baixado.
   */
  machineList: (
    range: AnalyticsRange,
    options: {
      condition?: ConditionKind | null;
      search?: string | null;
      page?: number;
      pageSize?: number;
      sortBy?: MachineListSortColumn;
      sortDir?: 'asc' | 'desc';
    } = {},
  ) =>
    requestJson<MachineListResponseDto>(
      `/analytics/machines?${rangeQuery(range, {
        ...(options.condition ? { condition: options.condition } : {}),
        ...(options.search ? { search: options.search } : {}),
        ...(options.page ? { page: String(options.page) } : {}),
        ...(options.pageSize ? { pageSize: String(options.pageSize) } : {}),
        ...(options.sortBy ? { sortBy: options.sortBy } : {}),
        ...(options.sortDir ? { sortDir: options.sortDir } : {}),
      })}`,
    ),

  /** Resumo analítico da máquina: cabeçalho, indicadores e uma linha por ponto. */
  machineSummary: (
    machineKey: string,
    range: AnalyticsRange,
    options: { condition?: ConditionKind | null } = {},
  ) =>
    requestJson<MachineSummaryDto>(
      `/analytics/machines/${encodeURIComponent(machineKey)}?${rangeQuery(
        range,
        options.condition ? { condition: options.condition } : {},
      )}`,
    ),

  /** Resumo analítico do ponto — o contexto entre o ativo e o sensor. */
  pointSummary: (machineKey: string, pointKey: string, range: AnalyticsRange) =>
    requestJson<PointSummaryDto>(
      `/analytics/machines/${encodeURIComponent(machineKey)}/points/${encodeURIComponent(pointKey)}?${rangeQuery(range)}`,
    ),

  /** Mapa de atividade por data × hora, agregado no banco. */
  heatmap: (range: AnalyticsRange, bucket: 'hour' | 'day' = 'hour') =>
    requestJson<HeatmapResponseDto>(`/analytics/heatmap?${rangeQuery(range, { bucket })}`),

  /** Série já agregada por bucket — o gráfico recebe pontos, não amostras. */
  seriesPoints: (seriesId: string, range: AnalyticsRange, bucket: string) =>
    requestJson<SeriesPointsResponseDto>(
      `/analytics/series/${seriesId}/points?${rangeQuery(range, { bucket })}`,
    ),

  /** Resumo por sensor de uma janela temporal (nível "hora" da investigação). */
  timeWindow: (range: AnalyticsRange, page: number, pageSize: number) =>
    requestJson<TimeWindowResponseDto>(
      `/analytics/time-windows?${rangeQuery(range, { page: String(page), pageSize: String(pageSize) })}`,
    ),

  /**
   * ALERTAS — episódios persistidos pelo motor, distintos da condição derivada. A listagem
   * recorta no servidor; `from`/`to` é interseção com o período em que o alerta esteve ativo.
   */
  alerts: (params: AlertListParams = {}) => {
    const query = alertListQuery(params);
    return requestJson<AlertListResponseDto>(`/alerts${query ? `?${query}` : ''}`);
  },
  alert: (id: string) => requestJson<AlertDetailDto>(`/alerts/${encodeURIComponent(id)}`),
  /** Reconhecer não resolve: registra quem viu; idempotente no servidor. */
  acknowledgeAlert: (id: string, note: string | null = null) =>
    requestJson<AlertDetailDto>(`/alerts/${encodeURIComponent(id)}/acknowledge`, {
      method: 'POST',
      body: note ? { note } : {},
    }),

  /** Aquisições do sensor, paginadas no servidor. `includeTotal` custa uma contagem. */
  sensorAcquisitions: (
    serialNumber: string,
    range: AnalyticsRange,
    options: { page: number; pageSize: number; includeTotal?: boolean },
  ) =>
    requestJson<AcquisitionPageDto>(
      `/analytics/sensors/${encodeURIComponent(serialNumber)}/acquisitions?${rangeQuery(range, {
        page: String(options.page),
        pageSize: String(options.pageSize),
        ...(options.includeTotal ? { includeTotal: 'true' } : {}),
      })}`,
    ),

  acquisition: (cycleId: string) =>
    requestJson<AcquisitionDetailDto>(`/analytics/acquisitions/${cycleId}`),

  /** Nível folha: amostras brutas de UMA aquisição, por cursor keyset. */
  acquisitionSamples: (
    cycleId: string,
    options: { limit: number; cursor?: string | null; quantity?: string | null; axis?: string | null },
  ) => {
    const query = new URLSearchParams({ limit: String(options.limit) });
    if (options.cursor) query.set('cursor', options.cursor);
    if (options.quantity) query.set('quantity', options.quantity);
    if (options.axis) query.set('axis', options.axis);
    return requestJson<RawSamplePageDto>(
      `/analytics/acquisitions/${cycleId}/samples?${query.toString()}`,
    );
  },

  metrics: (id: string) => requestJson<SeriesMetrics>(`/time-series/${id}/metrics`),
};
