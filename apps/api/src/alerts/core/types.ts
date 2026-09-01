/**
 * Tipos do NÚCLEO PURO do motor de alertas.
 *
 * Nada aqui conhece Nest, Prisma ou relógio de parede: o núcleo recebe regra, estado e uma
 * leitura, e devolve o próximo estado e uma decisão. É o que permite testá-lo com tabelas
 * de casos e reexecutá-lo sobre 30 dias de histórico com um relógio replayado.
 */
import type { AlertLevel, AlertRuleDto } from '@dynamox/domain';

export type RuleParams = AlertRuleDto;

export type BaselineStatus = 'learning' | 'established';

/** Estado do motor para um par (regra, ponto) — o espelho em memória de `alert_rule_states`. */
export interface ThresholdState {
  baselineStatus: BaselineStatus;
  /** Sensor a que a baseline pertence: trocar o sensor do ponto reinicia o aprendizado. */
  baselineSensorId: string | null;
  learningCount: number;
  baselineValue: number | null;
  /** 24 medianas por hora UTC; vazio enquanto aprende. */
  baselineProfile: number[];
  baselineBinCounts: number[];
  aboveA1Streak: number;
  aboveA2Streak: number;
  belowClearStreak: number;
  suppressedUntilMs: number | null;
  /** Fim do último ciclo avaliado — a fonte da regra de presença. */
  lastSeenAtMs: number | null;
  /** Marca d'água: início do último ciclo aplicado em ordem. */
  lastEvaluatedAtMs: number | null;
  lastEvaluatedCycleId: string | null;
  lastValue: number | null;
  lastMeasure: number | null;
}

export const EMPTY_THRESHOLD_STATE: Readonly<ThresholdState> = Object.freeze({
  baselineStatus: 'learning',
  baselineSensorId: null,
  learningCount: 0,
  baselineValue: null,
  baselineProfile: [],
  baselineBinCounts: [],
  aboveA1Streak: 0,
  aboveA2Streak: 0,
  belowClearStreak: 0,
  suppressedUntilMs: null,
  lastSeenAtMs: null,
  lastEvaluatedAtMs: null,
  lastEvaluatedCycleId: null,
  lastValue: null,
  lastMeasure: null,
});

/** A leitura de UM ciclo para UMA regra, já reduzida à grandeza que a regra avalia. */
export interface CycleSample {
  cycleId: string;
  sensorId: string | null;
  startedAtMs: number;
  endedAtMs: number;
  /** RMS radial (g) ou temperatura média (°C); `null` quando o ciclo não trouxe a grandeza. */
  value: number | null;
}

/** O que o núcleo precisa saber de um episódio já aberto. */
export interface ActiveEpisode {
  id: string;
  level: AlertLevel;
  acknowledgedAtMs: number | null;
  peakMeasure: number | null;
}

export type Decision =
  | { kind: 'none' }
  | { kind: 'open'; level: AlertLevel }
  | { kind: 'escalate'; toLevel: 'A2' }
  | { kind: 'resolve' };

/**
 * Desfecho de uma avaliação. `out-of-order` NÃO é descarte: a evidência fica gravada e a
 * avaliação é detectável para reconciliação por backfill — o que não pode acontecer é um
 * ciclo antigo mexer em streaks que já avançaram.
 */
export type StepOutcome = 'evaluated' | 'learning' | 'suppressed' | 'no-evidence' | 'out-of-order';

export interface StepResult {
  outcome: StepOutcome;
  state: ThresholdState;
  /** Grandeza comparada ao limiar (razão ou delta); `null` sem avaliação. */
  measure: number | null;
  /** Baseline usada nesta leitura (o bin da hora, ou a global). */
  baseline: number | null;
  decision: Decision;
  /** O aprendizado completou nesta leitura: o chamador deve calcular e gravar o perfil. */
  establishBaseline: boolean;
}
