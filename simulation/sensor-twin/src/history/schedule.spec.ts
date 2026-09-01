import { PLANT, plantSensors } from '../plant';
import { NARRATIVE } from './narrative';
import {
  ACQUISITION_SPAN_MS,
  DAY_MS,
  assertOutsideReservedWindows,
  buildHistorySchedule,
  floorUtcMidnight,
  machinePhaseMinutes,
  regimeGaps,
  reservedWindows,
  resolveRange,
} from './schedule';

const SENSORS = plantSensors(PLANT);
const HF001 = SENSORS.filter((s) => s.sensorSerial === 'SIM-HF-001');
const ANCHOR = Date.parse('2026-08-30T18:00:00.000Z'); // domingo, bloco de 6 h alinhado

function range(anchorMs: number, days: number, extra: Partial<Parameters<typeof resolveRange>[0]> = {}) {
  return resolveRange({ anchorMs, days, everyMinutes: 15, untilOffsetHours: 4, ...extra });
}

describe('grade do histórico', () => {
  it('um dia útil rende 96 slots por sensor; um domingo, 72 (parada 02–08 h)', () => {
    // fim = anchor − 4 h = meia-noite ⇒ a faixa cobre exatamente o dia anterior.
    const weekday = buildHistorySchedule(range(Date.parse('2026-08-29T04:00:00.000Z'), 1), NARRATIVE, HF001);
    expect(new Date(weekday.range.epochMs).getUTCDay()).toBe(5); // sexta 28/08
    expect(weekday.slots).toHaveLength(96);

    const sunday = buildHistorySchedule(range(Date.parse('2026-08-31T04:00:00.000Z'), 1), NARRATIVE, HF001);
    expect(new Date(sunday.range.epochMs).getUTCDay()).toBe(0); // domingo 30/08
    expect(sunday.slots).toHaveLength(72);
    expect(sunday.skippedByGap['weekly-stop']).toBe(24);
  });

  it('a faixa padrão de 30 dias começa numa meia-noite UTC e termina em anchor − 4 h', () => {
    const r = range(ANCHOR, 30);
    expect(r.epochMs % DAY_MS).toBe(0);
    expect(r.endMs).toBe(ANCHOR - 4 * 3_600_000);
    expect(r.endMs - r.epochMs).toBeGreaterThanOrEqual(30 * DAY_MS);
  });

  it('lacunas: paradas em todos os domingos, trip da frota e sensor mudo por 3 dias', () => {
    const schedule = buildHistorySchedule(range(ANCHOR, 30), NARRATIVE, SENSORS);
    const sundays = schedule.gaps.filter((g) => g.kind === 'weekly-stop');
    const mute = schedule.gaps.find((g) => g.kind === 'mute')!;
    // Um domingo dentro da janela de silêncio: esses 24 slots do sensor mudo são
    // atribuídos ao mudo (primeira lacuna que se aplica), não à parada.
    const sundaysInMute = sundays.filter((g) => g.fromMs >= mute.fromMs && g.toMs <= mute.toMs).length;
    expect(sundays.length).toBeGreaterThanOrEqual(4);
    expect(schedule.skippedByGap['weekly-stop']).toBe(sundays.length * 24 * SENSORS.length - sundaysInMute * 24);
    expect(schedule.skippedByGap.trip).toBe(24 * SENSORS.length);
    expect(schedule.skippedByGap.mute).toBe(3 * 96);
    const counts = [...schedule.perSensor.entries()];
    const muteCount = schedule.perSensor.get(NARRATIVE.mute.sensor)!;
    const muteOnlyLoss = 3 * 96 - sundaysInMute * 24;
    for (const [serial, count] of counts) {
      expect(count).toBe(serial === NARRATIVE.mute.sensor ? muteCount : muteCount + muteOnlyLoss);
    }
    expect(schedule.slots.length).toBe(counts.reduce((sum, [, n]) => sum + n, 0));
  });

  it('todo slot começa em segundo 0, no minuto da fase da máquina, e os dois sensores do ativo compartilham o início', () => {
    const schedule = buildHistorySchedule(range(ANCHOR, 2), NARRATIVE, SENSORS);
    const byStart = new Map<number, Set<string>>();
    for (const slot of schedule.slots) {
      const date = new Date(slot.startMs);
      expect(date.getUTCSeconds()).toBe(0);
      expect(slot.startMs % 1000).toBe(0);
      expect(date.getUTCMinutes() % 15).toBe(machinePhaseMinutes(slot.machineIndex));
      byStart.set(slot.startMs, (byStart.get(slot.startMs) ?? new Set()).add(slot.machineName));
    }
    for (const machines of byStart.values()) expect(machines.size).toBe(1);
  });

  it('nenhum slot cruza instante reservado, para âncoras alinhadas e não alinhadas', () => {
    for (const anchor of [ANCHOR, Date.parse('2026-08-30T12:34:56.000Z'), Date.parse('2026-09-01T00:00:00.000Z')]) {
      const schedule = buildHistorySchedule(range(anchor, 30), NARRATIVE, SENSORS);
      expect(() => assertOutsideReservedWindows(schedule, anchor)).not.toThrow();
    }
    // e a guarda realmente morde: um slot dentro de uma janela da planta é rejeitado.
    const schedule = buildHistorySchedule(range(ANCHOR, 1), NARRATIVE, HF001);
    const window = reservedWindows(ANCHOR).find((w) => w.label.includes('−3 h'))!;
    schedule.slots.push({ ...schedule.slots[0], startMs: window.fromMs + 5_000, startIso: new Date(window.fromMs + 5_000).toISOString() });
    expect(() => assertOutsideReservedWindows(schedule, ANCHOR)).toThrow(/janela da planta/);
  });

  it('grade absoluta: com a mesma época, a âncora 6 h depois só acrescenta slots novos', () => {
    const a = range(ANCHOR, 30);
    const b = range(ANCHOR + 6 * 3_600_000, 30, { epochMs: a.epochMs });
    const sa = buildHistorySchedule(a, NARRATIVE, SENSORS);
    const sb = buildHistorySchedule(b, NARRATIVE, SENSORS);
    const key = (s: { sensorSerial: string; startMs: number }) => `${s.sensorSerial}|${s.startMs}`;
    const inB = new Set(sb.slots.map(key));
    for (const slot of sa.slots) expect(inB.has(key(slot))).toBe(true);
    const extra = sb.slots.filter((s) => s.startMs >= a.endMs);
    expect(extra.length).toBe(sb.slots.length - sa.slots.length);
    expect(extra.every((s) => s.startMs + ACQUISITION_SPAN_MS <= b.endMs)).toBe(true);
  });

  it('rejeita parâmetros que quebrariam as garantias', () => {
    expect(() => range(ANCHOR, 30, { untilOffsetHours: 2 })).toThrow(/until-offset/);
    expect(() => range(ANCHOR, 30, { everyMinutes: 7 })).toThrow(/divisor/);
    expect(() => range(ANCHOR, 30, { everyMinutes: 5 })).toThrow(/fases por máquina/);
    expect(() => range(ANCHOR, 30, { epochMs: floorUtcMidnight(ANCHOR) + 1 })).toThrow(/meia-noite/);
    expect(() => range(ANCHOR, 0)).toThrow(/days/);
  });

  it('regimeGaps só devolve lacunas que tocam a faixa', () => {
    const r = range(Date.parse('2026-08-29T04:00:00.000Z'), 1); // sexta
    const gaps = regimeGaps(r, NARRATIVE);
    expect(gaps.filter((g) => g.kind === 'weekly-stop')).toHaveLength(0);
    expect(gaps.filter((g) => g.kind === 'trip')).toHaveLength(0);
  });
});
