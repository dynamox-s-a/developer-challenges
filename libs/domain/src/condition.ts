/**
 * POLÍTICA DE CONDIÇÃO — a única implementação da regra que classifica um ponto.
 *
 * Condição é um estado DERIVADO da telemetria: a aquisição atual comparada a uma aquisição
 * de referência, recalculável a qualquer momento. Não é alerta (episódio persistido, com
 * ciclo de vida próprio) — os dois conceitos se tocam nos números, não na natureza.
 *
 * Por que aqui: API (via `dist`) e web (via alias para a fonte) consomem este pacote, que não
 * tem dependência alguma. Antes, a mesma regra existia em sete lugares e o cliente descartava
 * a classificação do servidor para refazê-la a partir dos números; qualquer divergência de
 * limiar produziria "UI = normal, motor = atenção" para a mesma evidência.
 *
 * `CONDITION_POLICY_VERSION` existe porque uma avaliação histórica precisa dizer sob qual
 * regra foi feita. Mudar um limiar aqui exige nova versão — nunca reinterpretar o passado.
 */

export type ConditionKind =
  | 'normal'
  | 'observation'
  | 'attention'
  | 'unclassified'
  | 'no-data'
  | 'no-sensor';

export type FreshnessKind = 'current' | 'stale' | 'future' | 'unknown';

export const CONDITION_POLICY_VERSION = 1;

/**
 * Parâmetros da política v1. São os limiares didáticos que o painel sempre aplicou —
 * publicados no contrato OpenAPI e protegidos por teste — e a forma como a janela de
 * avaliação é escolhida no banco.
 */
export interface ConditionPolicy {
  version: number;
  /** Razão atual/referência a partir da qual o ponto entra em observação (inclusivo). */
  observationRatio: number;
  /** Razão a partir da qual o ponto entra em atenção (inclusivo). */
  attentionRatio: number;
  /** Leitura mais velha que isto é "desatualizada" (limite exclusivo). */
  staleAfterMs: number;
  /** Leitura à frente do relógio além disto é "relógio divergente" (limite exclusivo). */
  futureToleranceMs: number;
  /** Amostras mínimas para uma aquisição valer como janela de comparação. */
  minWindowSamples: number;
  /** Sensores que precisam compartilhar o instante de início para a aquisição ser "sincronizada". */
  fleetAgreement: number;
  /** A classificação nunca olha mais para trás que isto dentro do recorte pedido. */
  lookbackMs: number;
  /** Aquisições recentes inspecionadas por sensor ao procurar as sincronizadas. */
  recentCyclesPerSensor: number;
}

export const DEFAULT_CONDITION_POLICY: Readonly<ConditionPolicy> = Object.freeze({
  version: CONDITION_POLICY_VERSION,
  observationRatio: 1.5,
  attentionRatio: 2,
  staleAfterMs: 24 * 60 * 60 * 1000,
  futureToleranceMs: 5 * 60 * 1000,
  minWindowSamples: 3,
  fleetAgreement: 2,
  lookbackMs: 24 * 60 * 60 * 1000,
  recentCyclesPerSensor: 4,
});

/** Vocabulário fechado das condições — o que o filtro aceita, nem mais nem menos. */
export const CONDITION_KINDS: readonly ConditionKind[] = [
  'attention',
  'observation',
  'normal',
  'unclassified',
  'no-data',
  'no-sensor',
];

export function isConditionKind(value: unknown): value is ConditionKind {
  return typeof value === 'string' && (CONDITION_KINDS as readonly string[]).includes(value);
}

/** Condições que pedem inspeção: o "conjunto de exceção" que fila, KPI e filtro compartilham. */
export const CONDITION_EXCEPTIONS: readonly ConditionKind[] = ['attention', 'observation'];

export function isConditionException(kind: ConditionKind): boolean {
  return CONDITION_EXCEPTIONS.includes(kind);
}

/**
 * Gravidade relativa de uma condição. Serve para eleger a condição de um AGREGADO (uma
 * máquina é a sua pior leitura, nunca a média das leituras) e para ordenar filas de
 * inspeção. Ausência de dado fica abaixo de "normal" de propósito: é um problema de
 * cobertura, não de condição, e não deve competir por atenção com um desvio real.
 */
export const CONDITION_SEVERITY: Record<ConditionKind, number> = {
  attention: 5,
  observation: 4,
  normal: 3,
  unclassified: 2,
  'no-data': 1,
  'no-sensor': 0,
};

/** Condição de um agregado: a pior entre as partes. Vazio não vira "normal" por omissão. */
export function worstCondition(conditions: readonly ConditionKind[]): ConditionKind | null {
  return conditions.reduce<ConditionKind | null>(
    (worst, kind) =>
      worst === null || CONDITION_SEVERITY[kind] > CONDITION_SEVERITY[worst] ? kind : worst,
    null,
  );
}

/**
 * Contagem por condição do recorte consultado.
 *
 * Vem junto da própria resposta para que o seletor de condição mostre quantos itens cada
 * estado tem sem uma segunda ida ao servidor — e para que a interface só ofereça os
 * estados que realmente ocorrem na janela, em vez de um seletor com opções mortas.
 *
 * As chaves são camelCase porque `no-data` não é um identificador válido; a tradução para
 * o vocabulário do domínio fica em `conditionCountKey`.
 */
export interface ConditionCounts {
  total: number;
  attention: number;
  observation: number;
  normal: number;
  unclassified: number;
  noData: number;
  noSensor: number;
}

export const EMPTY_CONDITION_COUNTS: ConditionCounts = {
  total: 0,
  attention: 0,
  observation: 0,
  normal: 0,
  unclassified: 0,
  noData: 0,
  noSensor: 0,
};

export function conditionCountKey(kind: ConditionKind): keyof Omit<ConditionCounts, 'total'> {
  if (kind === 'no-data') return 'noData';
  if (kind === 'no-sensor') return 'noSensor';
  return kind;
}

export function countConditions(conditions: readonly ConditionKind[]): ConditionCounts {
  const counts: ConditionCounts = { ...EMPTY_CONDITION_COUNTS, total: conditions.length };
  for (const kind of conditions) counts[conditionCountKey(kind)] += 1;
  return counts;
}

// ————— Avaliação pura —————

/** Instante aceito pelas funções de recência: epoch em ms, `Date` ou ausência. */
export type ConditionInstant = number | Date | null | undefined;

function instantMs(value: ConditionInstant): number | null {
  if (value === null || value === undefined) return null;
  const ms = typeof value === 'number' ? value : value.getTime();
  return Number.isFinite(ms) ? ms : null;
}

/** Razão entre a aquisição atual e a de referência; `null` quando falta uma das duas. */
export function deviationRatio(current: number | null, baseline: number | null): number | null {
  if (current === null || baseline === null || baseline <= 0) return null;
  return current / baseline;
}

/**
 * Classifica um ponto. A ordem importa: ausência de sensor e ausência de leitura vêm antes
 * de qualquer razão, e razão inexistente ou não finita é "sem classificação" — nunca normal.
 */
export function classifyCondition(
  hasSensor: boolean,
  hasReading: boolean,
  ratio: number | null,
  policy: Readonly<ConditionPolicy> = DEFAULT_CONDITION_POLICY,
): ConditionKind {
  if (!hasSensor) return 'no-sensor';
  if (!hasReading) return 'no-data';
  if (ratio === null || !Number.isFinite(ratio)) return 'unclassified';
  if (ratio >= policy.attentionRatio) return 'attention';
  if (ratio >= policy.observationRatio) return 'observation';
  return 'normal';
}

/** Recência de uma leitura: limites exclusivos nos dois sentidos, ausência é "desconhecido". */
export function classifyFreshness(
  at: ConditionInstant,
  nowMs: number,
  policy: Readonly<ConditionPolicy> = DEFAULT_CONDITION_POLICY,
): FreshnessKind {
  const atMs = instantMs(at);
  if (atMs === null) return 'unknown';
  const age = nowMs - atMs;
  if (age < -policy.futureToleranceMs) return 'future';
  if (age > policy.staleAfterMs) return 'stale';
  return 'current';
}

/**
 * RMS radial de um par de eixos: `sqrt(avg((y² + z²) / 2))` sobre amostras pareadas pelo
 * MESMO instante. É a fórmula que o banco aplica (média quadrática) — a referência canônica.
 */
export function radialRms(pairs: ReadonlyArray<{ y: number; z: number }>): number | null {
  if (pairs.length === 0) return null;
  const meanSquare =
    pairs.reduce((sum, pair) => sum + (pair.y * pair.y + pair.z * pair.z) / 2, 0) / pairs.length;
  return Math.sqrt(meanSquare);
}

/** O que a política precisa saber de um ponto para classificá-lo. */
export interface ConditionEvidence {
  hasSensor: boolean;
  /** RMS radial da aquisição atual; `null` quando não há leitura comparável. */
  currentValue: number | null;
  baselineValue: number | null;
  currentAt: ConditionInstant;
  baselineAt: ConditionInstant;
  currentCycleId: string | null;
  baselineCycleId: string | null;
  /** Última leitura conhecida do sensor, independente do pareamento. */
  lastSeenAt: ConditionInstant;
}

export interface ConditionEvaluation {
  kind: ConditionKind;
  freshness: FreshnessKind;
  ratio: number | null;
  currentValue: number | null;
  baselineValue: number | null;
  currentAt: string | null;
  baselineAt: string | null;
  currentCycleId: string | null;
  baselineCycleId: string | null;
  policyVersion: number;
}

function iso(value: ConditionInstant): string | null {
  const ms = instantMs(value);
  return ms === null ? null : new Date(ms).toISOString();
}

/** Avaliação completa de um ponto sob a política — a mesma para API e web. */
export function evaluateCondition(
  evidence: ConditionEvidence,
  nowMs: number,
  policy: Readonly<ConditionPolicy> = DEFAULT_CONDITION_POLICY,
): ConditionEvaluation {
  const ratio = deviationRatio(evidence.currentValue, evidence.baselineValue);
  return {
    kind: classifyCondition(evidence.hasSensor, evidence.currentValue !== null, ratio, policy),
    freshness: classifyFreshness(evidence.lastSeenAt ?? evidence.currentAt, nowMs, policy),
    ratio,
    currentValue: evidence.currentValue,
    baselineValue: evidence.baselineValue,
    currentAt: iso(evidence.currentAt),
    baselineAt: iso(evidence.baselineAt),
    currentCycleId: evidence.currentCycleId,
    baselineCycleId: evidence.baselineCycleId,
    policyVersion: policy.version,
  };
}
