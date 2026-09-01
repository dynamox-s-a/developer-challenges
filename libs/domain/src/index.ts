import type { ConditionCounts, ConditionKind, FreshnessKind } from './condition';

/**
 * Perfis de acesso do desafio. Deliberadamente mínimos: o enunciado usa credenciais
 * fixas, então não há administração de usuários — apenas a distinção entre quem pode
 * alterar o estado persistido (ADMIN) e quem só consulta (VIEWER).
 */
export const USER_ROLES = ['ADMIN', 'VIEWER'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);
}

/** Perfis autorizados a alterar estado persistido (POST/PATCH/PUT/DELETE). */
export const ROLES_ALLOWED_TO_MUTATE: readonly UserRole[] = ['ADMIN'];

export function canMutate(role: UserRole): boolean {
  return ROLES_ALLOWED_TO_MUTATE.includes(role);
}

export const MACHINE_TYPES = ['Pump', 'Fan'] as const;
export type MachineType = (typeof MACHINE_TYPES)[number];

export const SENSOR_MODELS = ['TcAg', 'TcAs', 'HF+'] as const;
export type SensorModel = (typeof SENSOR_MODELS)[number];

export const PHYSICAL_QUANTITIES = [
  'acceleration',
  'velocity',
  'temperature',
  'rotationalSpeed',
] as const;
export type PhysicalQuantity = (typeof PHYSICAL_QUANTITIES)[number];

export const AXES = ['x', 'y', 'z'] as const;
export type Axis = (typeof AXES)[number];

/** Grandezas vetoriais só fazem sentido acompanhadas de um eixo de medição. */
export const VECTOR_QUANTITIES: readonly PhysicalQuantity[] = ['acceleration', 'velocity'];

/** Grandezas escalares nunca têm eixo; são persistidas com Axis.NONE, jamais com NULL. */
export const SCALAR_QUANTITIES: readonly PhysicalQuantity[] = ['temperature', 'rotationalSpeed'];

export function isAxisValidForQuantity(
  physicalQuantity: PhysicalQuantity,
  axis: Axis | undefined,
): boolean {
  if (VECTOR_QUANTITIES.includes(physicalQuantity)) {
    return axis !== undefined;
  }
  return axis === undefined;
}

export class QuantityAxisMismatchError extends Error {
  constructor(
    readonly physicalQuantity: PhysicalQuantity,
    readonly axis: Axis | undefined,
  ) {
    super(
      VECTOR_QUANTITIES.includes(physicalQuantity)
        ? `A grandeza "${physicalQuantity}" é vetorial e exige um eixo (x, y ou z).`
        : `A grandeza "${physicalQuantity}" é escalar e não aceita eixo (recebido "${axis}").`,
    );
    this.name = 'QuantityAxisMismatchError';
  }
}

export function assertAxisValidForQuantity(
  physicalQuantity: PhysicalQuantity,
  axis: Axis | undefined,
): void {
  if (!isAxisValidForQuantity(physicalQuantity, axis)) {
    throw new QuantityAxisMismatchError(physicalQuantity, axis);
  }
}

/**
 * Sensores TcAg e TcAs não suportam a faixa de vibração exigida por bombas, por isso o
 * enunciado proíbe associá-los a máquinas do tipo Pump. A regra vive aqui, e não no
 * controller, para que API, seed e frontend apliquem exatamente o mesmo critério.
 */
export const SENSOR_MODELS_BLOCKED_FOR_PUMP: readonly SensorModel[] = ['TcAg', 'TcAs'];

export function isSensorModelAllowedForMachine(
  machineType: MachineType,
  sensorModel: SensorModel,
): boolean {
  if (machineType === 'Pump') {
    return !SENSOR_MODELS_BLOCKED_FOR_PUMP.includes(sensorModel);
  }
  return true;
}

export function assertSensorModelAllowedForMachine(
  machineType: MachineType,
  sensorModel: SensorModel,
): void {
  if (!isSensorModelAllowedForMachine(machineType, sensorModel)) {
    throw new SensorModelNotAllowedError(machineType, sensorModel);
  }
}

export class SensorModelNotAllowedError extends Error {
  constructor(
    readonly machineType: MachineType,
    readonly sensorModel: SensorModel,
  ) {
    super(
      `O modelo de sensor "${sensorModel}" não pode ser associado a uma máquina do tipo "${machineType}".`,
    );
    this.name = 'SensorModelNotAllowedError';
  }
}

export function isMachineType(value: unknown): value is MachineType {
  return typeof value === 'string' && (MACHINE_TYPES as readonly string[]).includes(value);
}

export function isSensorModel(value: unknown): value is SensorModel {
  return typeof value === 'string' && (SENSOR_MODELS as readonly string[]).includes(value);
}

/**
 * IDENTIFICADORES NATURAIS EM URL
 *
 * A aplicação já tem chaves únicas de domínio: o nome da máquina, o nome do ponto dentro
 * da máquina e o serial do sensor. Elas são o que a URL carrega — nada de UUID visível e
 * nenhuma coluna nova de "slug", que só existiria para ser mantida em sincronia.
 *
 * A comparação é normalizada (sem acento, sem caixa, hífen entre termos) para que
 * `/assets/P-101` e `/assets/p-101` abram o mesmo ativo, e a etiqueta curta da máquina
 * ("P-102 — Bomba de recirculação" → "P-102") também resolve — é o identificador que a
 * planta usa no dia a dia e o que a interface já mostrava nas tabelas.
 */
export function naturalKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Etiqueta curta da máquina: o trecho antes do travessão, quando existe. */
export function machineTag(name: string): string {
  const [tag] = name.split('—');
  return (tag ?? name).trim() || name.trim();
}

/** Segmento de URL de uma máquina — a etiqueta, quando ela já é segura em URL. */
export function machineSlug(name: string): string {
  const tag = machineTag(name);
  return /^[A-Za-z0-9._~-]+$/.test(tag) ? tag : naturalKey(name);
}

/** Segmento de URL de um ponto de monitoramento. */
export function pointSlug(name: string): string {
  return naturalKey(name);
}

/** O identificador da URL casa com o nome inteiro OU com a etiqueta curta da máquina. */
export function matchesMachineKey(name: string, key: string): boolean {
  const wanted = naturalKey(key);
  return naturalKey(name) === wanted || naturalKey(machineTag(name)) === wanted;
}

export function matchesPointKey(name: string, key: string): boolean {
  return naturalKey(name) === naturalKey(key);
}

/**
 * Resolve um identificador de URL contra uma coleção pequena (a planta tem unidades, não
 * milhares). Empate é reportado como ambiguidade em vez de escolher em silêncio: duas
 * máquinas resolvíveis pela mesma etiqueta é um problema de cadastro, não do link.
 */
export type NaturalKeyResolution<T> =
  | { kind: 'found'; item: T }
  | { kind: 'not-found' }
  | { kind: 'ambiguous'; items: T[] };

export function resolveByNaturalKey<T>(
  items: readonly T[],
  key: string,
  nameOf: (item: T) => string,
  matches: (name: string, key: string) => boolean = matchesMachineKey,
): NaturalKeyResolution<T> {
  const wanted = naturalKey(key);
  if (wanted === '') return { kind: 'not-found' };
  // Nome completo tem precedência sobre a etiqueta: quem digitou o nome inteiro decidiu.
  const exact = items.filter((item) => naturalKey(nameOf(item)) === wanted);
  const candidates = exact.length > 0 ? exact : items.filter((item) => matches(nameOf(item), key));
  if (candidates.length === 0) return { kind: 'not-found' };
  if (candidates.length > 1) return { kind: 'ambiguous', items: candidates };
  return { kind: 'found', item: candidates[0] };
}

export interface SeriesMetrics {
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  last: number | null;
  firstTimestamp: string | null;
  lastTimestamp: string | null;
}

export const EMPTY_SERIES_METRICS: SeriesMetrics = {
  count: 0,
  min: null,
  max: null,
  avg: null,
  last: null,
  firstTimestamp: null,
  lastTimestamp: null,
};

export interface TimeSeriesSummary {
  id: string;
  sensorSerialNumber: string;
  sensorModel: SensorModel;
  /**
   * Nulos quando o sensor não está associado a um ponto de monitoramento. Inventar um
   * valor padrão aqui faria a API afirmar um tipo de máquina que não existe.
   */
  machineName: string | null;
  machineType: MachineType | null;
  monitoringPointName: string | null;
  physicalQuantity: PhysicalQuantity;
  axis: Axis | null;
  unit: string;
  displayName: Record<string, string> | null;
  /**
   * Total de amostras da série. `null` quando a listagem foi pedida sem contagem
   * (`withCounts=false`, o padrão): é um `count(*)` por série, caro no caminho do painel.
   * Para saber se a série tem dado, use `lastTimestamp`.
   */
  sampleCount: number | null;
  /**
   * Última leitura da série. Vem no resumo — e não só em `/metrics` — porque um painel
   * de frota precisa do valor e do instante de TODAS as séries para desenhar a matriz;
   * buscar métrica por série transformava uma tela em dezenas de requisições.
   */
  lastValue: number | null;
  lastTimestamp: string | null;
}

export interface TimeSeriesSampleDto {
  timestamp: string;
  value: number;
}

/** Página de amostras: recuperação completa por offset, nunca truncamento silencioso. */
export interface TimeSeriesSamplePage {
  items: TimeSeriesSampleDto[];
  total: number;
  limit: number;
  offset: number;
}

// ————— Camada analítica: resultados agregados, nunca telemetria bruta —————

// A política de condição (vocabulário, limiares, avaliação pura) mora em `condition.ts`;
// o vocabulário de alertas (episódio persistido, A1/A2, ciclo de vida) em `alerts.ts`.
export * from './condition';
export * from './alerts';

/**
 * Condição de um ponto na janela consultada.
 *
 * `currentCycleId`/`baselineCycleId` deixam explícito QUAIS aquisições produziram a razão:
 * a atual é a mais recente da janela, a referência é a primeira da mesma janela — nunca
 * uma média do período inteiro, que já conteria a própria degradação.
 */
export interface FleetConditionPoint {
  machineName: string;
  machineType: MachineType | null;
  monitoringPointId: string;
  monitoringPointName: string;
  sensorSerialNumber: string | null;
  sensorModel: SensorModel | null;
  condition: ConditionKind;
  freshness: FreshnessKind;
  /** RMS radial (Y/Z pareados) da aquisição mais recente da janela. */
  currentValue: number | null;
  baselineValue: number | null;
  deviationRatio: number | null;
  currentAt: string | null;
  baselineAt: string | null;
  currentSampleCount: number | null;
  currentCycleId: string | null;
  baselineCycleId: string | null;
  unit: string;
  /**
   * Tendência curta do ponto — poucos valores agregados, o bastante para a miniatura
   * responder "subindo, estável ou caindo". Vazia quando não foi pedida (`includeTrend`).
   */
  trend: TrendPointDto[];
}

/** Valor agregado de tendência. Nunca amostra bruta: é um bucket já reduzido no banco. */
export interface TrendPointDto {
  timestamp: string;
  value: number;
}

export interface FleetConditionResponseDto {
  from: string;
  to: string;
  generatedAt: string;
  points: FleetConditionPoint[];
  /** Contagem por condição ANTES do filtro — é o que o seletor precisa para se desenhar. */
  counts: ConditionCounts;
  /** Eco do recorte aplicado; `null` quando nenhum foi pedido. */
  condition: ConditionKind | null;
}

/** Ponto de uma série já agregado no banco — a unidade que os gráficos consomem. */
export interface SeriesBucketPoint {
  bucketStart: string;
  sampleCount: number;
  acquisitionCount: number;
  avg: number | null;
  min: number | null;
  max: number | null;
  lastAt: string | null;
}

export interface SeriesPointsResponseDto {
  seriesId: string;
  from: string;
  to: string;
  bucket: string;
  /** Estatísticas da janela inteira, calculadas no banco. */
  stats: {
    sampleCount: number;
    acquisitionCount: number;
    min: number | null;
    max: number | null;
    avg: number | null;
    firstAt: string | null;
    lastAt: string | null;
  };
  points: SeriesBucketPoint[];
}

/** Célula do mapa de atividade: um bucket temporal com cobertura da frota. */
export interface HeatmapBucketDto {
  bucketStart: string;
  bucketEnd: string;
  day: string;
  hour: number;
  sampleCount: number;
  acquisitionCount: number;
  reportingSensors: number;
  expectedSensors: number;
  coveragePercent: number;
  /**
   * Maior desvio radial da frota no bucket — a leitura mais alta dividida pela baseline
   * saudável do próprio ponto naquela hora do dia. É a magnitude que a célula pinta.
   * `null` quando nenhum ponto do bucket tem baseline estabelecida.
   */
  maxDeviationRatio: number | null;
  /** RMS radial (g) que produziu esse desvio. */
  maxDeviationValue: number | null;
  /** Quem produziu — o destino do clique na célula mais quente. */
  maxDeviationSensor: string | null;
  maxDeviationMachine: string | null;
  maxDeviationPoint: string | null;
}

export interface HeatmapResponseDto {
  from: string;
  to: string;
  bucket: string;
  expectedSensors: number;
  buckets: HeatmapBucketDto[];
}

/** Linha da janela temporal: o que um sensor fez no intervalo investigado. */
export interface TimeWindowSensorDto {
  sensorSerialNumber: string;
  sensorModel: SensorModel;
  seriesId: string;
  machineName: string | null;
  machineType: MachineType | null;
  monitoringPointId: string | null;
  monitoringPointName: string | null;
  sampleCount: number;
  acquisitionCount: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  lastValue: number | null;
  lastAt: string | null;
  unit: string;
}

export interface TimeWindowResponseDto {
  from: string;
  to: string;
  kpis: {
    reportingSensors: number;
    silentSensors: number;
    expectedSensors: number;
    acquisitionCount: number;
    sampleCount: number;
    maxValue: number | null;
    maxValueSensor: string | null;
  };
  items: TimeWindowSensorDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Uma aquisição (ciclo de ingestão) na listagem do sensor. */
export interface AcquisitionListItemDto {
  cycleId: string;
  externalCycleId: string | null;
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
  rpm: number | null;
  loadPercent: number | null;
  scenario: string | null;
  sampleCount: number;
  anchorSampleCount: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  event: string | null;
  expectedState: string | null;
  unit: string;
}

export interface AcquisitionPageDto {
  serialNumber: string;
  from: string;
  to: string;
  items: AcquisitionListItemDto[];
  page: number;
  pageSize: number;
  /** `null` quando não foi pedido (`includeTotal=false`): a contagem custa uma varredura. */
  total: number | null;
  totalPages: number | null;
  hasNextPage: boolean;
}

/** Resumo de uma série dentro de uma aquisição. */
export interface AcquisitionSeriesSummaryDto {
  seriesId: string;
  physicalQuantity: PhysicalQuantity;
  axis: Axis | null;
  unit: string;
  sampleCount: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  rms: number | null;
  startedAt: string | null;
  endedAt: string | null;
}

export interface AcquisitionDetailDto {
  cycleId: string;
  externalCycleId: string | null;
  sensorSerialNumber: string;
  sensorModel: SensorModel | null;
  machineName: string | null;
  monitoringPointName: string | null;
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
  rpm: number | null;
  loadPercent: number | null;
  scenario: string | null;
  origin: string;
  tags: string[];
  ingestedAt: string;
  sampleCount: number;
  measurementCount: number;
  groundTruth: Record<string, unknown> | null;
  series: AcquisitionSeriesSummaryDto[];
}

/** Amostra bruta — o nível folha, alcançado só sob pedido explícito. */
export interface RawSampleDto {
  id: string;
  timestamp: string;
  value: number;
  physicalQuantity: PhysicalQuantity;
  axis: Axis | null;
  unit: string;
}

export interface RawSamplePageDto {
  cycleId: string;
  items: RawSampleDto[];
  limit: number;
  /** Cursor keyset da próxima página; `null` quando acabou. */
  nextCursor: string | null;
  quantity: string | null;
  axis: string | null;
}

// ————— Máquina e ponto: o mesmo recorte da frota, restrito a uma máquina —————

/** Linha de ponto na página da máquina: identidade, condição e o que aconteceu na janela. */
export interface MachinePointSummaryDto {
  monitoringPointId: string;
  monitoringPointName: string;
  /** Segmento de URL do ponto dentro do ativo. */
  slug: string;
  sensorSerialNumber: string | null;
  sensorModel: SensorModel | null;
  condition: ConditionKind;
  freshness: FreshnessKind;
  currentValue: number | null;
  baselineValue: number | null;
  deviationRatio: number | null;
  lastAt: string | null;
  /** Agregados da janela consultada (não das últimas 24 h da classificação). */
  acquisitionCount: number;
  sampleCount: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  unit: string;
  trend: TrendPointDto[];
}

export interface MachineSummaryDto {
  machineId: string;
  machineName: string;
  machineType: MachineType;
  /** Segmento de URL do ativo. */
  slug: string;
  /** Identidade cadastral — a página da máquina é canônica, então ela não omite o cadastro. */
  createdAt: string;
  updatedAt: string;
  from: string;
  to: string;
  kpis: {
    points: number;
    sensors: number;
    /** Pontos classificados em atenção ou observação. */
    attention: number;
    acquisitionCount: number;
    /** Pontos instrumentados que reportaram na janela, sobre o total de pontos. */
    coveragePercent: number;
    maxDeviationRatio: number | null;
    maxDeviationPoint: string | null;
  };
  lastAt: string | null;
  points: MachinePointSummaryDto[];
  /** Contagem por condição dos pontos da máquina, antes do filtro. */
  counts: ConditionCounts;
  condition: ConditionKind | null;
}

/** Linha da listagem operacional de máquinas. */
export interface MachineListItemDto {
  machineId: string;
  machineName: string;
  machineType: MachineType;
  slug: string;
  pointCount: number;
  sensorCount: number;
  /** Pontos em atenção ou observação — o número que decide se a linha merece um clique. */
  attentionCount: number;
  /** Condição da máquina: a pior entre os seus pontos. */
  condition: ConditionKind;
  lastAt: string | null;
  maxDeviationRatio: number | null;
  maxDeviationPoint: string | null;
}

export const MACHINE_LIST_SORT_COLUMNS = ['name', 'condition', 'deviation', 'lastAt'] as const;
export type MachineListSortColumn = (typeof MACHINE_LIST_SORT_COLUMNS)[number];

export interface MachineListResponseDto {
  from: string;
  to: string;
  items: MachineListItemDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: ConditionCounts;
  condition: ConditionKind | null;
  search: string | null;
  sortBy: MachineListSortColumn;
  sortDir: 'asc' | 'desc';
}

/** Série disponível num ponto — o inventário de grandezas, sem trazer amostra. */
export interface PointSeriesDto {
  seriesId: string;
  physicalQuantity: PhysicalQuantity;
  axis: Axis | null;
  unit: string;
  lastValue: number | null;
  lastAt: string | null;
}

export interface PointSummaryDto {
  machineId: string;
  machineName: string;
  machineType: MachineType;
  machineSlug: string;
  monitoringPointId: string;
  monitoringPointName: string;
  slug: string;
  from: string;
  to: string;
  sensorSerialNumber: string | null;
  sensorModel: SensorModel | null;
  condition: ConditionKind;
  freshness: FreshnessKind;
  currentValue: number | null;
  baselineValue: number | null;
  deviationRatio: number | null;
  currentAt: string | null;
  baselineAt: string | null;
  currentCycleId: string | null;
  baselineCycleId: string | null;
  unit: string;
  window: {
    acquisitionCount: number;
    sampleCount: number;
    min: number | null;
    max: number | null;
    avg: number | null;
    lastValue: number | null;
    lastAt: string | null;
  };
  trend: TrendPointDto[];
  series: PointSeriesDto[];
}
