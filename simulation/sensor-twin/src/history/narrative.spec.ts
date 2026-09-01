import { PLANT, plantSensors } from '../plant';
import { getScenarioConfig } from '../scenarios';
import {
  HISTORY_TAG,
  NARRATIVE,
  NORMAL_RADIAL_RMS_G,
  planSlot,
  radial1xForRatio,
  rampSeverity,
} from './narrative';
import { DAY_MS, buildHistorySchedule, resolveRange } from './schedule';

const SENSORS = plantSensors(PLANT);
const ANCHOR = Date.parse('2026-08-30T18:00:00.000Z');
const FULL = buildHistorySchedule(
  resolveRange({ anchorMs: ANCHOR, days: 30, everyMinutes: 15, untilOffsetHours: 4 }),
  NARRATIVE,
  SENSORS,
);
const sensor = (serial: string) => SENSORS.find((s) => s.sensorSerial === serial)!;
const slotsOf = (serial: string) => FULL.slots.filter((s) => s.sensorSerial === serial);

describe('narrativa do histórico', () => {
  it('a forma fechada do RMS radial bate com o cenário normal e com os alvos da narrativa', () => {
    expect(NORMAL_RADIAL_RMS_G).toBeCloseTo(0.016371, 6);
    expect(radial1xForRatio(1)).toBeCloseTo(0.02, 9);
    expect(radial1xForRatio(1.6)).toBeCloseTo(0.035159, 5);
    expect(radial1xForRatio(2.5)).toBeCloseTo(0.056692, 5);
    expect(() => radial1xForRatio(0.3)).toThrow(/piso/);
  });

  it('a rampa é monótona, parte de zero e satura em 1 após 30 dias', () => {
    const epoch = FULL.range.epochMs;
    expect(rampSeverity(epoch, epoch)).toBe(0);
    expect(rampSeverity(epoch + 30 * DAY_MS, epoch)).toBe(1);
    expect(rampSeverity(epoch + 45 * DAY_MS, epoch)).toBe(1);
    let previous = -1;
    for (let d = 0; d <= 30; d += 0.5) {
      const s = rampSeverity(epoch + d * DAY_MS, epoch);
      expect(s).toBeGreaterThanOrEqual(previous);
      previous = s;
    }
  });

  it('SIM-HF-002 termina o mês em observação (≈1,6×) com alerta vibratório esperado; começa normal', () => {
    const slots = slotsOf(NARRATIVE.ramp.sensor);
    const first = planSlot(slots[0], sensor(NARRATIVE.ramp.sensor), FULL);
    const last = planSlot(slots[slots.length - 1], sensor(NARRATIVE.ramp.sensor), FULL);
    expect(first.history.groundTruth.expectedState).toBe('normal');
    expect(first.history.groundTruth.expectedAlert).toBe(false);
    expect(last.history.groundTruth.eventRatio).toBeCloseTo(1.6, 3);
    expect(last.history.groundTruth).toMatchObject({ physicalEvent: 'imbalance', fault: true, expectedState: 'observation', expectedAlert: true, alertKind: 'vibration' });
    expect(last.overrides.radialPhaseZRad).toBeCloseTo(Math.PI / 2, 5);
    // cruza 1,5× em algum ponto do mês, e só depois disso há alerta
    const firstAlert = slots.map((s) => planSlot(s, sensor(NARRATIVE.ramp.sensor), FULL)).find((p) => p.history.groundTruth.expectedAlert)!;
    expect(firstAlert.history.groundTruth.eventRatio).toBeGreaterThanOrEqual(1.5);
    expect(firstAlert.history.dayIndex).toBeGreaterThan(20);
  });

  it('o pico transiente acontece em exatamente um slot de SIM-HF-005 e não é falha nem alerta', () => {
    const planned = slotsOf(NARRATIVE.spike.sensor).map((s) => planSlot(s, sensor(NARRATIVE.spike.sensor), FULL));
    const spikes = planned.filter((p) => p.history.groundTruth.events.some((e) => e.type === 'transient-spike'));
    expect(spikes).toHaveLength(1);
    expect(spikes[0].history.groundTruth).toMatchObject({ physicalEvent: 'transient', fault: false, expectedState: 'normal', expectedAlert: false, alertKind: null, eventRatio: 2.5 });
    expect(spikes[0].history.slotStart).toMatch(/T11:04:00\.000Z$/);
    const index = planned.indexOf(spikes[0]);
    expect(planned[index - 1].history.groundTruth.eventRatio).toBe(1);
    expect(planned[index + 1].history.groundTruth.eventRatio).toBe(1);
  });

  it('a deriva térmica de SIM-HF-007 chega a +8 °C sem tocar a vibração; o vizinho SIM-TCAG-002 fica plano', () => {
    const drift = slotsOf(NARRATIVE.thermal.sensor).map((s) => planSlot(s, sensor(NARRATIVE.thermal.sensor), FULL));
    const last = drift[drift.length - 1];
    expect(last.history.groundTruth.events).toEqual([{ type: 'thermal-drift', severity: 1, deltaC: 8 }]);
    expect(last.history.groundTruth).toMatchObject({ physicalEvent: 'thermal-drift', fault: true, expectedState: 'observation', expectedAlert: true, alertKind: 'thermal' });
    expect(drift.every((p) => p.history.groundTruth.eventRatio === 1 && p.overrides.radialPhaseZRad === undefined)).toBe(true);
    const before = drift.find((p) => p.history.dayIndex === 19)!;
    expect(before.history.groundTruth.events).toEqual([]);
    const neighbour = slotsOf('SIM-TCAG-002').map((s) => planSlot(s, sensor('SIM-TCAG-002'), FULL));
    expect(neighbour.every((p) => p.history.groundTruth.events.length === 0 && p.history.groundTruth.physicalEvent !== 'thermal-drift')).toBe(true);
  });

  it('todo override de todos os sensores passa na validação do gerador (dia útil + domingo)', () => {
    for (const anchor of ['2026-08-29T04:00:00.000Z', '2026-08-31T04:00:00.000Z']) {
      const schedule = buildHistorySchedule(
        resolveRange({ anchorMs: Date.parse(anchor), days: 1, everyMinutes: 15, untilOffsetHours: 4 }),
        NARRATIVE,
        SENSORS,
      );
      for (const slot of schedule.slots) {
        const planned = planSlot(slot, sensor(slot.sensorSerial), schedule);
        const config = getScenarioConfig('normal', planned.overrides);
        expect(config.baseTimestamp).toBe(slot.startIso);
        expect(config.loadPercent).toBeGreaterThan(0);
        expect(config.loadPercent).toBeLessThanOrEqual(100);
        if (sensor(slot.sensorSerial).machineType === 'Fan') {
          expect(config.rpm).toBeGreaterThanOrEqual(1140);
          expect(config.rpm).toBeLessThanOrEqual(1215);
        } else {
          expect(config.rpm).toBe(1750);
        }
        expect(config.temperature.riseC).toBe(0);
        expect(config.temperature.scenarioOffsetC).toBe(0);
      }
    }
  });

  it('aquecimento: os primeiros slots depois da parada de domingo saem frios e sem alerta', () => {
    const sunday = buildHistorySchedule(
      resolveRange({ anchorMs: Date.parse('2026-08-31T04:00:00.000Z'), days: 1, everyMinutes: 15, untilOffsetHours: 4 }),
      NARRATIVE,
      [sensor('SIM-HF-001')],
    );
    const planned = sunday.slots.map((s) => planSlot(s, sensor('SIM-HF-001'), sunday));
    const afterStop = planned.find((p) => p.history.slotStart.endsWith('T08:02:00.000Z'))!;
    const settled = planned.find((p) => p.history.slotStart.endsWith('T12:02:00.000Z'))!;
    expect(afterStop.history.regime.phase).toBe('post-stop');
    expect(afterStop.history.groundTruth.expectedState).toBe('warmup');
    expect(afterStop.history.groundTruth.temperatureC).toBeLessThan(settled.history.groundTruth.temperatureC - 5);
    expect(settled.history.regime.phase).toBe('run');
  });

  it('planSlot é determinístico e não grava campos voláteis', () => {
    const slot = slotsOf('SIM-HF-003')[10];
    const a = planSlot(slot, sensor('SIM-HF-003'), FULL);
    const b = planSlot(slot, sensor('SIM-HF-003'), FULL);
    expect(a).toEqual(b);
    expect(a.extras.tags).toEqual([HISTORY_TAG]);
    expect(Object.keys(a.history).sort()).toEqual(
      ['dataset', 'dayIndex', 'epoch', 'everyMinutes', 'gridIndex', 'groundTruth', 'narrativeVersion', 'regime', 'sensorSeed', 'slotSeed', 'slotStart'].sort(),
    );
  });
});
