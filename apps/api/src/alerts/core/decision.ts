/**
 * A função de decisão do motor — pura.
 *
 * Uma leitura entra, o próximo estado e uma decisão saem. A ordem dos passos é a semântica:
 *  0. ciclo mais antigo que a marca d'água → OUT_OF_ORDER (nada muda);
 *  1. sensor trocou no ponto → baseline volta a aprender;
 *  2. lacuna longa em regra com supressão pós-lacuna → ciclos suprimidos (streaks congelados);
 *  3. aprendendo → conta a leitura; ao completar, pede o perfil;
 *  4. sem evidência ou sem baseline → NO_EVIDENCE (streaks intactos: silêncio não reseta);
 *  5. medida, streaks e transição.
 *
 * Transições (nível "latched": A2 permanece A2 até resolver; escalar reabre um episódio
 * reconhecido — mudança de prioridade exige novo reconhecimento, como em ISA-18.2):
 *   sem episódio → OPEN A2 se a2 ≥ gatilho, senão OPEN A1 se a1 ≥ gatilho;
 *   episódio ativo → RESOLVE se clear ≥ consecutiveClear;
 *   episódio A1 e a2 ≥ gatilho → ESCALATE.
 */
import type {
  ActiveEpisode,
  CycleSample,
  Decision,
  RuleParams,
  StepResult,
  ThresholdState,
} from './types';

const MINUTE_MS = 60_000;

export function hourOfDayUtc(ms: number): number {
  return new Date(ms).getUTCHours();
}

/** Baseline aplicável a um instante: o bin da hora quando o perfil existe, senão a global. */
export function baselineFor(state: ThresholdState, atMs: number): number | null {
  if (state.baselineProfile.length === 24) {
    const bin = state.baselineProfile[hourOfDayUtc(atMs)];
    if (Number.isFinite(bin)) return bin;
  }
  return state.baselineValue;
}

/** Grandeza comparada ao limiar, conforme o modo da regra. */
export function measureOf(rule: RuleParams, value: number, baseline: number): number | null {
  switch (rule.thresholdMode) {
    case 'ratio-to-baseline':
      return baseline > 0 ? value / baseline : null;
    case 'delta-from-baseline':
      return value - baseline;
    default:
      return null;
  }
}

function resetBaseline(state: ThresholdState, sensorId: string | null): ThresholdState {
  return {
    ...state,
    baselineStatus: 'learning',
    baselineSensorId: sensorId,
    learningCount: 0,
    baselineValue: null,
    baselineProfile: [],
    baselineBinCounts: [],
    aboveA1Streak: 0,
    aboveA2Streak: 0,
    belowClearStreak: 0,
  };
}

function advanced(state: ThresholdState, sample: CycleSample): ThresholdState {
  return {
    ...state,
    lastSeenAtMs: sample.endedAtMs,
    lastEvaluatedAtMs: sample.startedAtMs,
    lastEvaluatedCycleId: sample.cycleId,
  };
}

function none(state: ThresholdState, outcome: StepResult['outcome']): StepResult {
  return { outcome, state, measure: null, baseline: null, decision: { kind: 'none' }, establishBaseline: false };
}

export function stepThreshold(
  rule: RuleParams,
  previous: ThresholdState,
  active: ActiveEpisode | null,
  sample: CycleSample,
): StepResult {
  // 0. Marca d'água: um ciclo mais antigo que o último aplicado não pode mexer nos streaks.
  if (previous.lastEvaluatedAtMs !== null && sample.startedAtMs <= previous.lastEvaluatedAtMs) {
    return none(previous, 'out-of-order');
  }

  // 1. Troca de sensor no ponto: personalidade (±8 %) é maior que o deadband — reaprende.
  let state = previous;
  if (
    rule.learningCycles !== null &&
    sample.sensorId !== null &&
    state.baselineSensorId !== null &&
    state.baselineSensorId !== sample.sensorId
  ) {
    state = resetBaseline(state, sample.sensorId);
  }

  // 2. Lacuna longa: o retorno não pode parecer anomalia nem contaminar a baseline.
  let suppressedUntilMs = state.suppressedUntilMs;
  if (
    rule.postGapSuppressionMinutes !== null &&
    rule.expectedIntervalSeconds !== null &&
    state.lastSeenAtMs !== null &&
    sample.startedAtMs - state.lastSeenAtMs > 2 * rule.expectedIntervalSeconds * 1000
  ) {
    suppressedUntilMs = sample.startedAtMs + rule.postGapSuppressionMinutes * MINUTE_MS;
  }
  if (suppressedUntilMs !== null && sample.startedAtMs < suppressedUntilMs) {
    return none(advanced({ ...state, suppressedUntilMs }, sample), 'suppressed');
  }
  state = { ...state, suppressedUntilMs: null };

  // 3. Aprendizado por contagem de leituras COM evidência.
  if (rule.learningCycles !== null && state.baselineStatus === 'learning') {
    if (sample.value === null) return none(advanced(state, sample), 'no-evidence');
    const learningCount = state.learningCount + 1;
    const learned = advanced(
      {
        ...state,
        learningCount,
        baselineSensorId: state.baselineSensorId ?? sample.sensorId,
        lastValue: sample.value,
      },
      sample,
    );
    return {
      outcome: 'learning',
      state: learned,
      measure: null,
      baseline: null,
      decision: { kind: 'none' },
      establishBaseline: learningCount >= rule.learningCycles,
    };
  }

  // 4. Sem evidência ou sem baseline aplicável: streaks intactos — silêncio não reseta.
  if (sample.value === null) return none(advanced(state, sample), 'no-evidence');
  const baseline = rule.learningCycles === null ? 0 : baselineFor(state, sample.startedAtMs);
  const measure = baseline === null ? null : measureOf(rule, sample.value, baseline);
  if (measure === null || !Number.isFinite(measure)) {
    return none(advanced({ ...state, lastValue: sample.value }, sample), 'no-evidence');
  }

  // 5. Streaks: os dois "acima" avançam na mesma leitura; a zona morta zera tudo.
  let a1 = state.aboveA1Streak;
  let a2 = state.aboveA2Streak;
  let clear = state.belowClearStreak;
  if (rule.a2Threshold !== null && measure >= rule.a2Threshold) {
    a1 += 1;
    a2 += 1;
    clear = 0;
  } else if (measure >= rule.a1Threshold) {
    a1 += 1;
    a2 = 0;
    clear = 0;
  } else if (measure < rule.clearThreshold) {
    a1 = 0;
    a2 = 0;
    clear += 1;
  } else {
    a1 = 0;
    a2 = 0;
    clear = 0;
  }

  let decision: Decision = { kind: 'none' };
  if (active === null) {
    if (rule.a2Threshold !== null && a2 >= rule.consecutiveTrigger) {
      decision = { kind: 'open', level: 'A2' };
    } else if (a1 >= rule.consecutiveTrigger) {
      decision = { kind: 'open', level: 'A1' };
    }
  } else if (clear >= rule.consecutiveClear) {
    decision = { kind: 'resolve' };
  } else if (active.level === 'A1' && rule.a2Threshold !== null && a2 >= rule.consecutiveTrigger) {
    decision = { kind: 'escalate', toLevel: 'A2' };
  }

  const next = advanced(
    {
      ...state,
      aboveA1Streak: a1,
      aboveA2Streak: a2,
      belowClearStreak: clear,
      lastValue: sample.value,
      lastMeasure: measure,
    },
    sample,
  );
  return { outcome: 'evaluated', state: next, measure, baseline, decision, establishBaseline: false };
}
