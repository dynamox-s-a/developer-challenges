/**
 * VOCABULÁRIO DE ALERTAS — o que é público entre API e web.
 *
 * ALERTA ≠ CONDIÇÃO. Condição é o estado derivado da telemetria (recalculável, sem memória).
 * Alerta é um EPISÓDIO persistido: nasceu de uma regra versionada, num ciclo concreto, com
 * evidência guardada, e tem ciclo de vida próprio (ativo → resolvido) e reconhecimento humano
 * ortogonal a esse ciclo. Os dois conceitos compartilham números (1,5×/2,0×), não natureza.
 *
 * Também não é notificação (e-mail, push), insight (tendência preditiva) nem diagnóstico
 * (desbalanceamento, rolamento) — um limiar de RMS não sabe qual falha produziu o desvio, e
 * o tipo do alerta diz só o que foi medido.
 */

import type { MachineType, SensorModel } from './index';

/** Versão da Alert Policy deste projeto. Muda quando um parâmetro de regra muda. */
export const ALERT_POLICY_VERSION = 1;

export const ALERT_TYPES = [
  'vibration-threshold',
  'temperature-threshold',
  'sensor-silent',
  'fleet-silent',
] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export function isAlertType(value: unknown): value is AlertType {
  return typeof value === 'string' && (ALERT_TYPES as readonly string[]).includes(value);
}

/**
 * Família: condição (a telemetria diz algo sobre a máquina) ou qualidade de dado (a
 * telemetria deixou de chegar). Ausência de dado não prova defeito mecânico — por isso a
 * família é explícita, e a interface nunca pinta silêncio com a cor de vibração.
 */
export const ALERT_FAMILIES = ['condition', 'data-quality'] as const;
export type AlertFamily = (typeof ALERT_FAMILIES)[number];

export function alertFamily(type: AlertType): AlertFamily {
  return type === 'sensor-silent' || type === 'fleet-silent' ? 'data-quality' : 'condition';
}

/** Dois níveis, como na plataforma de referência: A2 é o mais crítico. */
export const ALERT_LEVELS = ['A1', 'A2'] as const;
export type AlertLevel = (typeof ALERT_LEVELS)[number];

export function isAlertLevel(value: unknown): value is AlertLevel {
  return typeof value === 'string' && (ALERT_LEVELS as readonly string[]).includes(value);
}

export const ALERT_LEVEL_SEVERITY: Record<AlertLevel, number> = { A1: 1, A2: 2 };

/**
 * Estado PERSISTIDO do episódio: a anomalia existe ou deixou de existir. O reconhecimento
 * humano não mora aqui — "alguém viu" e "a condição física passou" são perguntas diferentes.
 */
export const ALERT_STATES = ['active', 'resolved'] as const;
export type AlertState = (typeof ALERT_STATES)[number];

/** Estado DERIVADO para a interface: estado do episódio × reconhecimento. */
export const ALERT_STATUSES = ['open', 'acknowledged', 'resolved'] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export function deriveAlertStatus(state: AlertState, acknowledgedAt: string | null): AlertStatus {
  if (state === 'resolved') return 'resolved';
  return acknowledgedAt ? 'acknowledged' : 'open';
}

/** Recortes aceitos pela listagem; `active` = aberto ∪ reconhecido. */
export const ALERT_STATUS_FILTERS = ['open', 'acknowledged', 'resolved', 'active'] as const;
export type AlertStatusFilter = (typeof ALERT_STATUS_FILTERS)[number];

export function isAlertStatusFilter(value: unknown): value is AlertStatusFilter {
  return (
    typeof value === 'string' && (ALERT_STATUS_FILTERS as readonly string[]).includes(value)
  );
}

export const ALERT_EVENT_TYPES = ['opened', 'escalated', 'acknowledged', 'resolved'] as const;
export type AlertEventType = (typeof ALERT_EVENT_TYPES)[number];

export const ALERT_SCOPES = ['point', 'fleet'] as const;
export type AlertScope = (typeof ALERT_SCOPES)[number];

export const ALERT_THRESHOLD_MODES = [
  'ratio-to-baseline',
  'delta-from-baseline',
  'elapsed-intervals',
] as const;
export type AlertThresholdMode = (typeof ALERT_THRESHOLD_MODES)[number];

export const ALERT_RESOLUTION_REASONS = ['condition-cleared', 'telemetry-resumed'] as const;
export type AlertResolutionReason = (typeof ALERT_RESOLUTION_REASONS)[number];

export const ALERT_LIST_SORT_COLUMNS = ['openedAt', 'lastEvaluatedAt', 'level'] as const;
export type AlertListSortColumn = (typeof ALERT_LIST_SORT_COLUMNS)[number];

/** Regra como a API a publica — parâmetros explícitos, nunca um JSON de configuração. */
export interface AlertRuleDto {
  id: string;
  key: string;
  type: AlertType;
  family: AlertFamily;
  enabled: boolean;
  metric: string;
  unit: string;
  thresholdMode: AlertThresholdMode;
  a1Threshold: number;
  a2Threshold: number | null;
  clearThreshold: number;
  consecutiveTrigger: number;
  consecutiveClear: number;
  learningCycles: number | null;
  minBinCount: number | null;
  expectedIntervalSeconds: number | null;
  postGapSuppressionMinutes: number | null;
  fleetCollapseFraction: number | null;
  policyVersion: number;
}

/**
 * Uma leitura que sustenta o alerta. `measure` é a grandeza comparada ao limiar: razão
 * (vibração), delta em °C (temperatura) ou intervalos decorridos (presença).
 */
export interface AlertReadingDto {
  cycleId: string | null;
  at: string | null;
  value: number | null;
  baseline: number | null;
  measure: number | null;
}

export interface AlertTriggerDto extends AlertReadingDto {
  threshold: number;
  /** Quantas avaliações consecutivas acima do limiar existiam quando o episódio abriu. */
  consecutiveEvaluations: number;
}

export interface AlertOccurrenceDto {
  id: string;
  ruleId: string;
  ruleKey: string;
  type: AlertType;
  family: AlertFamily;
  scope: AlertScope;
  level: AlertLevel;
  state: AlertState;
  status: AlertStatus;
  machineId: string | null;
  machineName: string | null;
  machineType: MachineType | null;
  monitoringPointId: string | null;
  monitoringPointName: string | null;
  sensorId: string | null;
  sensorSerialNumber: string | null;
  sensorModel: SensorModel | null;
  openedAt: string;
  lastEvaluatedAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  /** Nível que estava vigente quando o reconhecimento foi feito; escalar exige novo ACK. */
  acknowledgedLevel: AlertLevel | null;
  acknowledgeNote: string | null;
  resolvedAt: string | null;
  resolutionReason: AlertResolutionReason | null;
  metric: string;
  unit: string;
  thresholdMode: AlertThresholdMode;
  trigger: AlertTriggerDto;
  peak: AlertReadingDto;
  last: AlertReadingDto;
  /** Pontos cobertos por um episódio de frota; `null` no escopo de ponto. */
  affectedCount: number | null;
  policyVersion: number;
}

export interface AlertEventDto {
  id: string;
  type: AlertEventType;
  fromState: AlertState | null;
  toState: AlertState;
  fromLevel: AlertLevel | null;
  toLevel: AlertLevel | null;
  occurredAt: string;
  cycleId: string | null;
  value: number | null;
  measure: number | null;
  threshold: number | null;
  actor: string | null;
  note: string | null;
}

/**
 * A baseline que o motor aprendeu para o par (regra, ponto) — a referência contra a qual
 * este alerta foi avaliado. É o que responde "por que 1,5× e não 1,5 g": o limiar é
 * relativo a ISTO, medido no próprio ponto durante o comissionamento.
 */
export interface AlertBaselineDto {
  status: 'learning' | 'established';
  /** Mediana global do período de aprendizado, na unidade da métrica. */
  value: number | null;
  learningCycles: number;
  /** Janela em que o aprendizado ocorreu (tempo do dado). */
  learnedFrom: string | null;
  learnedTo: string | null;
  establishedAt: string | null;
  /** Menor e maior contagem entre os 24 bins de hora UTC — expõe baseline esparsa. */
  minBinCount: number | null;
  maxBinCount: number | null;
  /** Sensor a que a baseline pertence; trocar o sensor do ponto reinicia o aprendizado. */
  sensorSerialNumber: string | null;
}

export interface AlertDetailDto extends AlertOccurrenceDto {
  rule: AlertRuleDto;
  /** Nulo em escopo de frota (a regra de presença não aprende baseline). */
  baseline: AlertBaselineDto | null;
  events: AlertEventDto[];
}

/** Contagem do universo consultado ANTES do recorte por status — para o seletor se desenhar. */
export interface AlertCounts {
  total: number;
  open: number;
  acknowledged: number;
  resolved: number;
  activeA1: number;
  activeA2: number;
}

export const EMPTY_ALERT_COUNTS: AlertCounts = {
  total: 0,
  open: 0,
  acknowledged: 0,
  resolved: 0,
  activeA1: 0,
  activeA2: 0,
};

/**
 * Listagem paginada. `from`/`to` recortam por INTERSEÇÃO: um alerta entra se esteve ativo em
 * algum instante da janela (`openedAt < to AND (resolvedAt IS NULL OR resolvedAt >= from)`),
 * não só se abriu dentro dela — é a pergunta operacional ("o que estava acontecendo").
 */
export interface AlertListResponseDto {
  items: AlertOccurrenceDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: AlertCounts;
  status: AlertStatusFilter | null;
  level: AlertLevel | null;
  type: AlertType | null;
  machine: string | null;
  sensor: string | null;
  /** Busca textual ecoada (sensor, máquina ou ponto). */
  search: string | null;
  from: string | null;
  to: string | null;
  sortBy: AlertListSortColumn;
  sortDir: 'asc' | 'desc';
}

/**
 * ALERT POLICY v1 DESTE PROJETO.
 *
 * Os números abaixo não são prescrição de norma: são a política deste produto, orientada
 * pela literatura industrial (ISO 20816-3 e SKF sustentam avaliar MUDANÇA contra uma baseline
 * de comissionamento; ISA-18.2 sustenta deadband, atraso de disparo e latching; a plataforma
 * Dynamox usa dois níveis A1/A2 e gatilho por medições consecutivas) e calibrada pelo
 * comportamento MEDIDO do dataset sintético (ruído por bin de hora ≈ 0,7 %, ciclo térmico
 * diário de ~11 °C, cadência de 15 min). Mudar qualquer valor exige nova `policyVersion`.
 */
export type AlertRuleDefinition = Omit<AlertRuleDto, 'id' | 'family'>;

export const ALERT_POLICY_V1_RULES: readonly AlertRuleDefinition[] = Object.freeze([
  {
    key: 'vibration-radial',
    type: 'vibration-threshold',
    enabled: true,
    metric: 'radial_rms_g',
    unit: 'g',
    thresholdMode: 'ratio-to-baseline',
    // Mesmos números da política de condição (1,5×/2,0×) — a REFERÊNCIA é outra: baseline
    // aprendida do ponto, não a aquisição sincronizada anterior (que não vê rampa lenta).
    a1Threshold: 1.5,
    a2Threshold: 2.0,
    // Deadband de ~7 % abaixo de A1: ≈ 15 σ do ruído por bin; evita abrir/fechar em 1,49/1,51.
    clearThreshold: 1.4,
    consecutiveTrigger: 2,
    consecutiveClear: 4,
    // 192 ciclos = 48 h na cadência nominal; por CONTAGEM, para um sensor com ciclos esparsos
    // não estabelecer baseline com meia dúzia de leituras.
    learningCycles: 192,
    minBinCount: 4,
    expectedIntervalSeconds: 900,
    postGapSuppressionMinutes: null,
    fleetCollapseFraction: null,
    policyVersion: ALERT_POLICY_VERSION,
  },
  {
    key: 'temperature-delta',
    type: 'temperature-threshold',
    enabled: true,
    metric: 'temperature_c',
    unit: '°C',
    thresholdMode: 'delta-from-baseline',
    // Delta contra a baseline da MESMA hora do dia: o ciclo térmico diário (~11 °C) é maior
    // que o próprio limiar, e um valor absoluto sem contexto não diz nada sobre o mancal.
    a1Threshold: 5,
    a2Threshold: 10,
    clearThreshold: 3,
    consecutiveTrigger: 2,
    consecutiveClear: 4,
    learningCycles: 192,
    minBinCount: 4,
    expectedIntervalSeconds: 900,
    // Após uma lacuna (parada), o mancal volta frio e aquece por ~100 min: ciclos suprimidos
    // para o retorno não parecer resfriamento anômalo nem contaminar a baseline.
    postGapSuppressionMinutes: 120,
    fleetCollapseFraction: null,
    policyVersion: ALERT_POLICY_VERSION,
  },
  {
    key: 'telemetry-presence',
    type: 'sensor-silent',
    enabled: true,
    metric: 'telemetry_interval_s',
    unit: 's',
    thresholdMode: 'elapsed-intervals',
    // Medida = intervalos esperados decorridos desde a última aquisição: A1 após 1 h de
    // silêncio, A2 após 24 h. Não reutiliza o "desatualizado" da tela por acaso: é uma
    // regra de operação, com cadência declarada.
    a1Threshold: 4,
    a2Threshold: 96,
    clearThreshold: 1,
    consecutiveTrigger: 1,
    consecutiveClear: 1,
    learningCycles: null,
    minBinCount: null,
    expectedIntervalSeconds: 900,
    postGapSuppressionMinutes: null,
    // Se mais da metade dos pontos silencia junto, é a planta (parada, gateway), não um
    // sensor: vira UM episódio de frota em vez de doze de sensor.
    fleetCollapseFraction: 0.5,
    policyVersion: ALERT_POLICY_VERSION,
  },
]);
