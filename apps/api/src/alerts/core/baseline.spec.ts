import { buildBaselineProfile, median } from './baseline';

const HOUR_MS = 3_600_000;
const DAY_START = Date.parse('2026-08-01T00:00:00.000Z');

describe('median', () => {
  it.each([
    [[3], 3],
    [[1, 3], 2],
    [[5, 1, 3], 3],
    [[4, 1, 3, 2], 2.5],
  ])('%p → %p (semântica de percentile_cont(0.5))', (values, expected) => {
    expect(median(values)).toBe(expected);
  });

  it('vazio → NaN', () => {
    expect(median([])).toBeNaN();
  });
});

describe('buildBaselineProfile', () => {
  it('sem amostras finitas não há baseline', () => {
    expect(buildBaselineProfile([], 4)).toBeNull();
    expect(buildBaselineProfile([{ startedAtMs: DAY_START, value: Number.NaN }], 4)).toBeNull();
  });

  it('agrupa por hora UTC do início do ciclo e usa a mediana de cada bin', () => {
    const samples = [
      ...[10, 12, 11, 100].map((value, i) => ({ startedAtMs: DAY_START + i * 60_000, value })), // hora 0
      ...[20, 22, 21, 23].map((value, i) => ({ startedAtMs: DAY_START + 13 * HOUR_MS + i * 60_000, value })), // hora 13
    ];
    const built = buildBaselineProfile(samples, 4);
    expect(built).not.toBeNull();
    expect(built?.profile[0]).toBe(11.5);
    expect(built?.profile[13]).toBe(21.5);
    expect(built?.binCounts[0]).toBe(4);
    expect(built?.binCounts[13]).toBe(4);
    expect(built?.sampleCount).toBe(8);
  });

  it('bins com menos amostras que o mínimo recebem a mediana global, não NaN', () => {
    const samples = [
      ...[1, 1, 1, 1].map((value, i) => ({ startedAtMs: DAY_START + i * 60_000, value })), // hora 0 completa
      { startedAtMs: DAY_START + 5 * HOUR_MS, value: 50 }, // hora 5 com uma só amostra
    ];
    const built = buildBaselineProfile(samples, 4);
    expect(built?.overall).toBe(1);
    expect(built?.profile[5]).toBe(1);
    expect(built?.binCounts[5]).toBe(1);
    expect(built?.profile.every((bin) => Number.isFinite(bin))).toBe(true);
    expect(built?.profile).toHaveLength(24);
  });

  it('a mediana é robusta a uma leitura atípica dentro da janela de aprendizado', () => {
    const samples = [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.9].map((value, i) => ({
      startedAtMs: DAY_START + i * 60_000,
      value,
    }));
    expect(buildBaselineProfile(samples, 4)?.profile[0]).toBe(0.05);
  });
});
