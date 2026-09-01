import { ALERT_POLICY_V1_RULES } from '@dynamox/domain';

import { baselineFor, hourOfDayUtc, stepThreshold } from './decision';
import { type ActiveEpisode, type CycleSample, EMPTY_THRESHOLD_STATE, type RuleParams, type ThresholdState } from './types';

const INTERVAL_MS = 15 * 60_000;
const T0 = Date.parse('2026-08-01T00:00:00.000Z');

function rule(key: string): RuleParams {
  const definition = ALERT_POLICY_V1_RULES.find((candidate) => candidate.key === key);
  if (!definition) throw new Error(`regra ${key} ausente na política v1`);
  return { id: `rule-${key}`, family: 'condition', ...definition };
}

const VIBRATION = rule('vibration-radial');
const TEMPERATURE = rule('temperature-delta');

/** Estado já comissionado: baseline 1,0 em todas as horas, para que medida = valor. */
function established(overrides: Partial<ThresholdState> = {}): ThresholdState {
  return {
    ...EMPTY_THRESHOLD_STATE,
    baselineStatus: 'established',
    baselineSensorId: 'sensor-a',
    learningCount: 192,
    baselineValue: 1,
    baselineProfile: Array.from({ length: 24 }, () => 1),
    baselineBinCounts: Array.from({ length: 24 }, () => 8),
    ...overrides,
  };
}

function sample(index: number, value: number | null, sensorId = 'sensor-a'): CycleSample {
  const startedAtMs = T0 + index * INTERVAL_MS;
  return { cycleId: `cycle-${index}`, sensorId, startedAtMs, endedAtMs: startedAtMs + 60_000, value };
}

/** Reproduz uma sequência de leituras e devolve as decisões, mantendo o episódio ativo em memória. */
function replay(
  ruleParams: RuleParams,
  initial: ThresholdState,
  values: Array<number | null>,
): { state: ThresholdState; active: ActiveEpisode | null; decisions: string[] } {
  let state = initial;
  let active: ActiveEpisode | null = null;
  const decisions: string[] = [];
  values.forEach((value, index) => {
    const result = stepThreshold(ruleParams, state, active, sample(index + 1, value));
    state = result.state;
    if (result.decision.kind === 'open') {
      active = { id: `ep-${index}`, level: result.decision.level, acknowledgedAtMs: null, peakMeasure: result.measure };
      decisions.push(`open:${result.decision.level}`);
    } else if (result.decision.kind === 'escalate' && active) {
      active = { ...active, level: 'A2', acknowledgedAtMs: null };
      decisions.push('escalate:A2');
    } else if (result.decision.kind === 'resolve') {
      active = null;
      decisions.push('resolve');
    }
  });
  return { state, active, decisions };
}

describe('stepThreshold — regra de vibração (razão sobre a baseline)', () => {
  it.each([
    [1.4999, 0, 0, 0],
    [1.5, 1, 0, 0],
    [1.9999, 1, 0, 0],
    [2, 1, 1, 0],
    [1.3999, 0, 0, 1],
    [1.4, 0, 0, 0],
  ])('medida %p → streaks a1=%i a2=%i clear=%i', (value, a1, a2, clear) => {
    const result = stepThreshold(VIBRATION, established(), null, sample(1, value));
    expect(result.outcome).toBe('evaluated');
    expect(result.measure).toBeCloseTo(value, 6);
    expect(result.state.aboveA1Streak).toBe(a1);
    expect(result.state.aboveA2Streak).toBe(a2);
    expect(result.state.belowClearStreak).toBe(clear);
    expect(result.decision).toEqual({ kind: 'none' });
  });

  it('abre A1 na segunda leitura consecutiva ≥ 1,5 — nunca na primeira', () => {
    const { decisions } = replay(VIBRATION, established(), [1.6, 1.6]);
    expect(decisions).toEqual(['open:A1']);
  });

  it('um pico isolado de 2,49× (transiente) não abre episódio', () => {
    const { decisions, state } = replay(VIBRATION, established(), [1.0, 2.49, 1.0, 1.0]);
    expect(decisions).toEqual([]);
    expect(state.aboveA1Streak).toBe(0);
  });

  it('abre direto em A2 quando duas leituras consecutivas já estão ≥ 2,0', () => {
    expect(replay(VIBRATION, established(), [3.5, 3.5]).decisions).toEqual(['open:A2']);
  });

  it('alternar 1,6 / 3,5 nunca escalona: o streak de A2 exige consecutividade própria', () => {
    const { decisions, active } = replay(VIBRATION, established(), [1.6, 3.5, 1.6, 3.5, 1.6, 3.5]);
    expect(decisions).toEqual(['open:A1']);
    expect(active?.level).toBe('A1');
  });

  it('escala A1 → A2 quando duas leituras consecutivas ≥ 2,0 chegam com o episódio aberto', () => {
    expect(replay(VIBRATION, established(), [1.6, 1.6, 2.5, 2.5]).decisions).toEqual(['open:A1', 'escalate:A2']);
  });

  it('A2 é latched: voltar à faixa de A1 não rebaixa o nível', () => {
    const { decisions, active } = replay(VIBRATION, established(), [2.5, 2.5, 1.6, 1.6, 1.6]);
    expect(decisions).toEqual(['open:A2']);
    expect(active?.level).toBe('A2');
  });

  it('resolve só na quarta leitura consecutiva abaixo do clear (1,4)', () => {
    expect(replay(VIBRATION, established(), [1.6, 1.6, 1.0, 1.0, 1.0]).decisions).toEqual(['open:A1']);
    expect(replay(VIBRATION, established(), [1.6, 1.6, 1.0, 1.0, 1.0, 1.0]).decisions).toEqual(['open:A1', 'resolve']);
  });

  it('a zona morta [1,4; 1,5) zera o streak de clear: histerese impede chattering', () => {
    const { decisions } = replay(VIBRATION, established(), [1.6, 1.6, 1.0, 1.0, 1.0, 1.45, 1.0, 1.0, 1.0]);
    expect(decisions).toEqual(['open:A1']);
  });

  it('a decisão de escalar é a mesma com episódio reconhecido — o chamador limpa o ACK', () => {
    const state = established({ aboveA1Streak: 2, aboveA2Streak: 1 });
    const acknowledged: ActiveEpisode = { id: 'ep', level: 'A1', acknowledgedAtMs: T0, peakMeasure: 2.1 };
    const result = stepThreshold(VIBRATION, state, acknowledged, sample(3, 2.2));
    expect(result.decision).toEqual({ kind: 'escalate', toLevel: 'A2' });
  });

  it('leitura sem evidência não reseta streaks nem a marca d\'água regride', () => {
    const state = established({ aboveA1Streak: 1, lastEvaluatedAtMs: T0 });
    const result = stepThreshold(VIBRATION, state, null, sample(1, null));
    expect(result.outcome).toBe('no-evidence');
    expect(result.state.aboveA1Streak).toBe(1);
    expect(result.state.lastEvaluatedAtMs).toBe(T0 + INTERVAL_MS);
    expect(result.state.lastEvaluatedCycleId).toBe('cycle-1');
  });

  it('ciclo mais antigo que a marca d\'água é OUT_OF_ORDER e não altera nada', () => {
    const state = established({ aboveA1Streak: 1, lastEvaluatedAtMs: T0 + 5 * INTERVAL_MS, lastEvaluatedCycleId: 'cycle-5' });
    const result = stepThreshold(VIBRATION, state, null, sample(2, 3.5));
    expect(result.outcome).toBe('out-of-order');
    expect(result.state).toBe(state);
    expect(result.decision).toEqual({ kind: 'none' });
  });

  it('a mesma marca d\'água (reenvio do último ciclo) também é OUT_OF_ORDER', () => {
    const state = established({ lastEvaluatedAtMs: T0 + 2 * INTERVAL_MS });
    expect(stepThreshold(VIBRATION, state, null, sample(2, 3.5)).outcome).toBe('out-of-order');
  });

  it('usa o bin da hora UTC do início do ciclo, não a baseline global', () => {
    const profile = Array.from({ length: 24 }, (_, hour) => (hour === 13 ? 2 : 1));
    const state = established({ baselineProfile: profile, baselineValue: 1 });
    const at = Date.parse('2026-08-10T13:30:00.000Z');
    expect(hourOfDayUtc(at)).toBe(13);
    expect(baselineFor(state, at)).toBe(2);
    const result = stepThreshold(VIBRATION, state, null, { cycleId: 'c', sensorId: 'sensor-a', startedAtMs: at, endedAtMs: at + 60_000, value: 3 });
    expect(result.baseline).toBe(2);
    expect(result.measure).toBeCloseTo(1.5, 9);
  });

  it('baseline ≤ 0 não produz razão: NO_EVIDENCE, sem divisão por zero', () => {
    const state = established({ baselineProfile: [], baselineValue: 0 });
    const result = stepThreshold(VIBRATION, state, null, sample(1, 0.5));
    expect(result.outcome).toBe('no-evidence');
    expect(result.measure).toBeNull();
  });
});

describe('stepThreshold — aprendizado da baseline', () => {
  it('conta só leituras com evidência e pede o perfil exatamente no 192.º ciclo', () => {
    let state: ThresholdState = { ...EMPTY_THRESHOLD_STATE };
    let established = 0;
    let index = 0;
    for (let learned = 0; learned < 192; ) {
      index += 1;
      const value = index % 7 === 0 ? null : 0.05;
      const result = stepThreshold(VIBRATION, state, null, sample(index, value));
      state = result.state;
      if (value === null) {
        expect(result.outcome).toBe('no-evidence');
        continue;
      }
      learned += 1;
      expect(result.outcome).toBe('learning');
      expect(result.decision).toEqual({ kind: 'none' });
      if (result.establishBaseline) established += 1;
    }
    expect(state.learningCount).toBe(192);
    expect(established).toBe(1);
    expect(state.baselineStatus).toBe('learning');
  });

  it('a primeira leitura fixa o sensor dono da baseline', () => {
    const result = stepThreshold(VIBRATION, EMPTY_THRESHOLD_STATE, null, sample(1, 0.05, 'sensor-z'));
    expect(result.state.baselineSensorId).toBe('sensor-z');
  });

  it('troca de sensor no ponto reinicia o aprendizado e zera os streaks', () => {
    const state = established({ aboveA1Streak: 1, learningCount: 192 });
    const result = stepThreshold(VIBRATION, state, null, sample(1, 3.0, 'sensor-b'));
    expect(result.outcome).toBe('learning');
    expect(result.state.baselineStatus).toBe('learning');
    expect(result.state.baselineSensorId).toBe('sensor-b');
    expect(result.state.learningCount).toBe(1);
    expect(result.state.baselineProfile).toEqual([]);
    expect(result.state.aboveA1Streak).toBe(0);
    expect(result.decision).toEqual({ kind: 'none' });
  });

  it('ponto sem sensor identificado não dispara a troca', () => {
    const state = established({ aboveA1Streak: 1 });
    const result = stepThreshold(VIBRATION, state, null, sample(1, 1.6, null as never));
    expect(result.outcome).toBe('evaluated');
    expect(result.state.baselineSensorId).toBe('sensor-a');
  });
});

describe('stepThreshold — regra de temperatura (delta sobre a baseline por hora)', () => {
  const baseline = established({ baselineProfile: Array.from({ length: 24 }, () => 40), baselineValue: 40 });

  it.each([
    [44.99, 0, 0, 0],
    [45, 1, 0, 0],
    [49.99, 1, 0, 0],
    [50, 1, 1, 0],
    [42.99, 0, 0, 1],
    [43, 0, 0, 0],
  ])('%p °C sobre baseline 40 → a1=%i a2=%i clear=%i', (value, a1, a2, clear) => {
    const result = stepThreshold(TEMPERATURE, baseline, null, sample(1, value));
    expect(result.outcome).toBe('evaluated');
    expect(result.measure).toBeCloseTo(value - 40, 6);
    expect(result.state.aboveA1Streak).toBe(a1);
    expect(result.state.aboveA2Streak).toBe(a2);
    expect(result.state.belowClearStreak).toBe(clear);
  });

  it('uma deriva de +8 °C abre A1 e nunca chega a A2 (+10)', () => {
    const { decisions, active } = replay(TEMPERATURE, baseline, [48, 48, 48, 48, 48, 48]);
    expect(decisions).toEqual(['open:A1']);
    expect(active?.level).toBe('A1');
  });

  it('lacuna de 6 h suprime 120 min (8 ciclos) de leituras frias no retorno, com streaks congelados', () => {
    const before: ThresholdState = { ...baseline, aboveA1Streak: 1, lastSeenAtMs: T0 + 60_000, lastEvaluatedAtMs: T0 };
    const resumeIndex = 24; // 6 h depois
    let state: ThresholdState = before;
    const outcomes: string[] = [];
    for (let index = resumeIndex; index < resumeIndex + 10; index += 1) {
      const result = stepThreshold(TEMPERATURE, state, null, sample(index, 25));
      state = result.state;
      outcomes.push(result.outcome);
    }
    expect(outcomes).toEqual([...Array.from({ length: 8 }, () => 'suppressed'), 'evaluated', 'evaluated']);
    expect(state.suppressedUntilMs).toBeNull();
    // As oito suprimidas não tocaram os streaks; a 9.ª (25 °C, clear) começou o clear do zero.
    expect(state.belowClearStreak).toBe(2);
    expect(state.aboveA1Streak).toBe(0);
  });

  it('a supressão não conta ciclos para o aprendizado', () => {
    const learning: ThresholdState = { ...EMPTY_THRESHOLD_STATE, learningCount: 10, baselineSensorId: 'sensor-a', lastSeenAtMs: T0 + 60_000, lastEvaluatedAtMs: T0 };
    const result = stepThreshold(TEMPERATURE, learning, null, sample(24, 30));
    expect(result.outcome).toBe('suppressed');
    expect(result.state.learningCount).toBe(10);
  });

  it('a regra de vibração não tem supressão pós-lacuna: o retorno é avaliado normalmente', () => {
    const state = established({ lastSeenAtMs: T0 + 60_000, lastEvaluatedAtMs: T0 });
    expect(stepThreshold(VIBRATION, state, null, sample(24, 1.0)).outcome).toBe('evaluated');
  });
});
