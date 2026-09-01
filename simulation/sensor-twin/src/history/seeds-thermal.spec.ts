import { PLANT, plantSensors } from '../plant';
import { NARRATIVE } from './narrative';
import { buildHistorySchedule, resolveRange } from './schedule';
import { personality, slotSeed } from './seeds';
import { ambientC, minutesSinceRestart, warmupFactor } from './thermal';

describe('seeds do histórico', () => {
  it('cada (sensor, slot) recebe seed única, inteira e independente da época', () => {
    const schedule = buildHistorySchedule(
      resolveRange({ anchorMs: Date.parse('2026-08-29T04:00:00.000Z'), days: 1, everyMinutes: 15, untilOffsetHours: 4 }),
      NARRATIVE,
      plantSensors(PLANT),
    );
    const seeds = schedule.slots.map((s) => slotSeed(s.sensorSeed, s.startMs));
    expect(new Set(seeds).size).toBe(seeds.length);
    expect(seeds.every((seed) => Number.isSafeInteger(seed) && seed >= 0)).toBe(true);
    expect(slotSeed(42, Date.parse('2026-08-10T10:02:00.000Z'))).toBe(slotSeed(42, Date.parse('2026-08-10T10:02:00.000Z')));
    expect(slotSeed(42, Date.parse('2026-08-10T10:02:00.000Z'))).not.toBe(slotSeed(43, Date.parse('2026-08-10T10:02:00.000Z')));
  });

  it('a personalidade fica nas faixas declaradas e varia entre sensores', () => {
    const all = plantSensors(PLANT).map((s) => personality(s.seed));
    for (const p of all) {
      expect(p.vibration).toBeGreaterThanOrEqual(0.92);
      expect(p.vibration).toBeLessThanOrEqual(1.08);
      expect(Math.abs(p.temperatureOffsetC)).toBeLessThanOrEqual(1);
    }
    expect(new Set(all.map((p) => p.vibration)).size).toBeGreaterThan(6);
  });
});

describe('modelo térmico', () => {
  it('aquecimento: quase frio nos primeiros minutos, > 90 % após 2 h; sem parada recente, 1', () => {
    expect(warmupFactor(null, 45)).toBe(1);
    expect(warmupFactor(2, 45)).toBeLessThan(0.05);
    expect(warmupFactor(120, 45)).toBeGreaterThan(0.9);
  });

  it('o ambiente tem pico às 15 h UTC e vale às 3 h', () => {
    const day = Date.parse('2026-08-10T00:00:00.000Z');
    expect(ambientC(day + 15 * 3_600_000)).toBeCloseTo(28, 5);
    expect(ambientC(day + 3 * 3_600_000)).toBeCloseTo(20, 5);
  });

  it('só parada semanal e trip contam como religamento; sensor mudo não', () => {
    const t = Date.parse('2026-08-10T09:00:00.000Z');
    const gaps = [
      { kind: 'mute' as const, fromMs: t - 3 * 3_600_000, toMs: t - 60_000, sensors: ['SIM-TCAS-001'] },
      { kind: 'trip' as const, fromMs: t - 8 * 3_600_000, toMs: t - 2 * 3_600_000, sensors: 'all' as const },
    ];
    const restart = minutesSinceRestart(t, gaps);
    expect(restart?.after.kind).toBe('trip');
    expect(restart?.minutes).toBe(120);
    expect(minutesSinceRestart(t + 7 * 3_600_000, gaps)).toBeNull();
  });
});
