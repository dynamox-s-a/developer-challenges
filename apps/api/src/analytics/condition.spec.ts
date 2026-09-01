/**
 * CHARACTERIZATION TESTS da regra de condição.
 *
 * Escritos ANTES de mover a regra para um lugar só: congelam o comportamento atual nas
 * fronteiras exatas, de modo que a centralização seja provadamente neutra. Cada número aqui
 * é o que o painel mostra hoje — não o que gostaríamos que mostrasse.
 */
import {
  ATTENTION_RATIO,
  FUTURE_TOLERANCE_MS,
  OBSERVATION_RATIO,
  STALE_AFTER_MS,
  classifyCondition,
  classifyFreshness,
  deviationRatio,
} from './analytics.service';

describe('regra de condição — fronteiras congeladas', () => {
  it('mantém os limiares didáticos publicados no contrato', () => {
    expect(OBSERVATION_RATIO).toBe(1.5);
    expect(ATTENTION_RATIO).toBe(2);
    expect(STALE_AFTER_MS).toBe(24 * 60 * 60 * 1000);
    expect(FUTURE_TOLERANCE_MS).toBe(5 * 60 * 1000);
  });

  it.each([
    [1.4999, 'normal'],
    [1.5, 'observation'],
    [1.9999, 'observation'],
    [2.0, 'attention'],
    [3.49, 'attention'],
    [0.5, 'normal'],
  ] as const)('razão %s classifica como %s (limiar inclusivo)', (ratio, expected) => {
    expect(classifyCondition(true, true, ratio)).toBe(expected);
  });

  it('ausência de sensor e ausência de leitura vêm antes de qualquer razão', () => {
    expect(classifyCondition(false, false, 3)).toBe('no-sensor');
    expect(classifyCondition(false, true, 3)).toBe('no-sensor');
    expect(classifyCondition(true, false, 3)).toBe('no-data');
  });

  it('razão inexistente ou não finita é "sem classificação", nunca normal', () => {
    expect(classifyCondition(true, true, null)).toBe('unclassified');
    expect(classifyCondition(true, true, Number.NaN)).toBe('unclassified');
    expect(classifyCondition(true, true, Number.POSITIVE_INFINITY)).toBe('unclassified');
  });

  it('a razão exige referência positiva; nunca divide por zero', () => {
    expect(deviationRatio(0.04, 0.02)).toBeCloseTo(2, 12);
    expect(deviationRatio(0.04, 0)).toBeNull();
    expect(deviationRatio(0.04, -0.01)).toBeNull();
    expect(deviationRatio(0.04, null)).toBeNull();
    expect(deviationRatio(null, 0.02)).toBeNull();
  });

  describe('recência', () => {
    const now = Date.parse('2026-08-31T12:00:00.000Z');

    it('desatualizado só ACIMA de 24 h — o limite exato ainda é atual', () => {
      expect(classifyFreshness(new Date(now - STALE_AFTER_MS), now)).toBe('current');
      expect(classifyFreshness(new Date(now - STALE_AFTER_MS - 1), now)).toBe('stale');
    });

    it('futuro só ALÉM da tolerância de 5 min — o limite exato ainda é atual', () => {
      expect(classifyFreshness(new Date(now + FUTURE_TOLERANCE_MS), now)).toBe('current');
      expect(classifyFreshness(new Date(now + FUTURE_TOLERANCE_MS + 1), now)).toBe('future');
    });

    it('sem leitura é desconhecido, não desatualizado', () => {
      expect(classifyFreshness(null, now)).toBe('unknown');
      expect(classifyFreshness(new Date(now), now)).toBe('current');
    });
  });
});
