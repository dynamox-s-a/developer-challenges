/**
 * Grade temporal do histórico sintético.
 *
 * ABSOLUTA: os instantes são múltiplos UTC do intervalo (15 min) desde a época Unix,
 * mais a fase da máquina — nunca derivam da âncora do bloco de 6 h. Só o FIM da faixa
 * depende da âncora (`anchor − untilOffset`). Reexecutar hoje reproduz exatamente os
 * mesmos instantes (⇒ `duplicate:true` na API); reexecutar dias depois acrescenta
 * apenas os slots novos. Ancorar a grade no bloco de 6 h deslocaria o mês inteiro a
 * cada bloco e dobraria os dados — armadilha evitada por construção.
 *
 * FASE POR MÁQUINA: a máquina i (ordem do manifest) acorda em `:(2+i)` de cada quarto —
 * os dois sensores de um ativo compartilham o início (gateway por ativo) e o minuto
 * nunca é 0 nem ≥ 55, logo a grade jamais toca as janelas da planta (`HH:00:00–:59`),
 * a seed (`:55…:00`), o exemplo versionado nem as janelas canônicas do gerador.
 */
import { DEMO_HOUR_MS } from '@dynamox/contracts';

import { PLANT, plantSensors, type PlantManifest, type PlantSensor } from '../plant';
import { getScenarioConfig } from '../scenarios';

import { DAY_MS, MACHINE_PHASE_BASE_MINUTES, MINUTE_MS, machinePhaseMinutes } from './schedule-time';

export { DAY_MS, MACHINE_PHASE_BASE_MINUTES, MINUTE_MS, machinePhaseMinutes };
/** Uma aquisição ocupa 60 janelas de 1 s. */
export const ACQUISITION_SPAN_MS = 60_000;
/** O histórico termina, no mínimo, 4 h antes da âncora: as janelas da planta (−3/−2/−1 h) ficam como cauda "ao vivo". */
export const HISTORY_MIN_UNTIL_OFFSET_HOURS = 4;

export type GapKind = 'weekly-stop' | 'trip' | 'mute';

export interface HistoryGap {
  kind: GapKind;
  fromMs: number;
  toMs: number;
  /** 'all' = frota inteira parada; lista = só aqueles sensores ficam em silêncio. */
  sensors: 'all' | readonly string[];
}

/** Parte do regime que a grade precisa conhecer (o restante vive na narrativa). */
export interface RegimeGapsSpec {
  weeklyStop: { weekdayUtc: number; fromHour: number; toHour: number };
  trip: { day: number; fromHourUtc: number; hours: number };
  mute: { sensor: string; fromDay: number; toDay: number };
}

export interface HistoryRange {
  /** Meia-noite UTC que abre o dataset; a narrativa é relativa a ela. */
  epochMs: number;
  /** Fim exclusivo da faixa (≤ anchor − 4 h). */
  endMs: number;
  everyMs: number;
  anchorMs: number;
  days: number;
}

export interface HistorySlot {
  sensorSerial: string;
  machineName: string;
  machineIndex: number;
  sensorSeed: number;
  /** Índice do quarto de hora desde a época do dataset (só para relatório). */
  gridIndex: number;
  startMs: number;
  startIso: string;
  dayIndex: number;
}

export interface HistorySchedule {
  range: HistoryRange;
  slots: HistorySlot[];
  gaps: HistoryGap[];
  perSensor: Map<string, number>;
  skippedByGap: Record<GapKind, number>;
}

export function floorUtcMidnight(ms: number): number {
  return Math.floor(ms / DAY_MS) * DAY_MS;
}

export function machineIndexOf(sensor: PlantSensor, plant: PlantManifest = PLANT): number {
  const index = plant.assets.findIndex((asset) => asset.machineName === sensor.machineName);
  if (index < 0) throw new Error(`Sensor "${sensor.sensorSerial}" não pertence a nenhuma máquina do manifest.`);
  return index;
}

export interface ResolveRangeOptions {
  anchorMs: number;
  days: number;
  everyMinutes: number;
  untilOffsetHours: number;
  epochMs?: number;
  toMs?: number;
}

export function resolveRange(options: ResolveRangeOptions): HistoryRange {
  const { anchorMs, days, everyMinutes, untilOffsetHours } = options;
  if (!Number.isInteger(days) || days < 1) throw new Error('days precisa ser inteiro ≥ 1.');
  if (!Number.isInteger(everyMinutes) || everyMinutes < 1 || 60 % everyMinutes !== 0) {
    throw new Error('every precisa ser um divisor inteiro de 60 minutos.');
  }
  // 6 máquinas em fase de 1 min a partir de :02 exigem pelo menos 8 min entre quartos.
  if (everyMinutes < MACHINE_PHASE_BASE_MINUTES + PLANT.assets.length + 1) {
    throw new Error(`every precisa ser ≥ ${MACHINE_PHASE_BASE_MINUTES + PLANT.assets.length + 1} min para as fases por máquina não se sobreporem.`);
  }
  if (!(untilOffsetHours >= HISTORY_MIN_UNTIL_OFFSET_HOURS)) {
    throw new Error(`until-offset precisa ser ≥ ${HISTORY_MIN_UNTIL_OFFSET_HOURS} h: o histórico termina antes das janelas da planta.`);
  }
  const cap = anchorMs - untilOffsetHours * DEMO_HOUR_MS;
  const endMs = options.toMs !== undefined ? Math.min(options.toMs, cap) : cap;
  const epochMs = options.epochMs ?? floorUtcMidnight(endMs - days * DAY_MS);
  if (epochMs % DAY_MS !== 0) throw new Error('epoch precisa ser uma meia-noite UTC.');
  if (epochMs >= endMs) throw new Error('epoch precisa ser anterior ao fim da faixa.');
  return { epochMs, endMs, everyMs: everyMinutes * MINUTE_MS, anchorMs, days };
}

/** Lacunas do regime, na faixa: parada semanal (frota), trip (frota) e sensor mudo. */
export function regimeGaps(range: HistoryRange, regime: RegimeGapsSpec): HistoryGap[] {
  const gaps: HistoryGap[] = [];
  for (let day = range.epochMs; day < range.endMs; day += DAY_MS) {
    if (new Date(day).getUTCDay() === regime.weeklyStop.weekdayUtc) {
      gaps.push({
        kind: 'weekly-stop',
        fromMs: day + regime.weeklyStop.fromHour * DEMO_HOUR_MS,
        toMs: day + regime.weeklyStop.toHour * DEMO_HOUR_MS,
        sensors: 'all',
      });
    }
  }
  const tripFrom = range.epochMs + regime.trip.day * DAY_MS + regime.trip.fromHourUtc * DEMO_HOUR_MS;
  gaps.push({ kind: 'trip', fromMs: tripFrom, toMs: tripFrom + regime.trip.hours * DEMO_HOUR_MS, sensors: 'all' });
  gaps.push({
    kind: 'mute',
    fromMs: range.epochMs + regime.mute.fromDay * DAY_MS,
    toMs: range.epochMs + regime.mute.toDay * DAY_MS,
    sensors: [regime.mute.sensor],
  });
  return gaps.filter((gap) => gap.toMs > range.epochMs && gap.fromMs < range.endMs).sort((a, b) => a.fromMs - b.fromMs);
}

function gapApplies(gap: HistoryGap, sensorSerial: string, startMs: number): boolean {
  if (startMs < gap.fromMs || startMs >= gap.toMs) return false;
  return gap.sensors === 'all' || gap.sensors.includes(sensorSerial);
}

export function buildHistorySchedule(
  range: HistoryRange,
  regime: RegimeGapsSpec,
  sensors: readonly PlantSensor[] = plantSensors(PLANT),
  plant: PlantManifest = PLANT,
): HistorySchedule {
  const gaps = regimeGaps(range, regime);
  const slots: HistorySlot[] = [];
  const perSensor = new Map<string, number>();
  const skippedByGap: Record<GapKind, number> = { 'weekly-stop': 0, trip: 0, mute: 0 };
  const indexed = sensors.map((sensor) => ({ sensor, machineIndex: machineIndexOf(sensor, plant) }));

  for (let gridStart = range.epochMs, gridIndex = 0; gridStart < range.endMs; gridStart += range.everyMs, gridIndex += 1) {
    for (const { sensor, machineIndex } of indexed) {
      const startMs = gridStart + machinePhaseMinutes(machineIndex) * MINUTE_MS;
      if (startMs + ACQUISITION_SPAN_MS > range.endMs) continue;
      const gap = gaps.find((candidate) => gapApplies(candidate, sensor.sensorSerial, startMs));
      if (gap) {
        skippedByGap[gap.kind] += 1;
        continue;
      }
      slots.push({
        sensorSerial: sensor.sensorSerial,
        machineName: sensor.machineName,
        machineIndex,
        sensorSeed: sensor.seed,
        gridIndex,
        startMs,
        startIso: new Date(startMs).toISOString(),
        dayIndex: Math.floor((startMs - range.epochMs) / DAY_MS),
      });
      perSensor.set(sensor.sensorSerial, (perSensor.get(sensor.sensorSerial) ?? 0) + 1);
    }
  }
  return { range, slots, gaps, perSensor, skippedByGap };
}

export interface ReservedWindow {
  label: string;
  fromMs: number;
  /** Fim exclusivo. */
  toMs: number;
  /** undefined = qualquer sensor. */
  sensors?: readonly string[];
}

/** Instantes já ocupados (ou reservados) por outros produtores de dados de demonstração. */
export function reservedWindows(anchorMs: number): ReservedWindow[] {
  const seedSensor = ['SIM-HF-001'];
  const windows: ReservedWindow[] = [
    // prisma/seed.ts: 30 amostras a cada 10 s terminando exatamente na âncora.
    { label: 'seed (prisma/seed.ts)', fromMs: anchorMs - 29 * 10_000, toMs: anchorMs + 1, sensors: seedSensor },
    // contracts/dynamox/examples: 12:00:00–12:00:20 de 26/08/2026 no ponto do seed.
    {
      label: 'exemplo versionado do contrato',
      fromMs: Date.parse('2026-08-26T12:00:00.000Z'),
      toMs: Date.parse('2026-08-26T12:00:21.000Z'),
      sensors: seedSensor,
    },
  ];
  for (const hours of [3, 2, 1]) {
    const from = anchorMs - hours * DEMO_HOUR_MS;
    windows.push({ label: `janela da planta (anchor −${hours} h)`, fromMs: from, toMs: from + ACQUISITION_SPAN_MS });
  }
  for (const scenario of ['normal', 'imbalance'] as const) {
    const from = Date.parse(getScenarioConfig(scenario).baseTimestamp);
    windows.push({ label: `janela canônica do gerador (${scenario})`, fromMs: from, toMs: from + ACQUISITION_SPAN_MS, sensors: seedSensor });
  }
  return windows;
}

/** Falha alto se algum slot tocar instante reservado ou se a faixa invadir a cauda da planta. */
export function assertOutsideReservedWindows(schedule: HistorySchedule, anchorMs: number): void {
  const problems: string[] = [];
  if (schedule.range.endMs > anchorMs - HISTORY_MIN_UNTIL_OFFSET_HOURS * DEMO_HOUR_MS) {
    problems.push('a faixa termina depois de anchor − 4 h');
  }
  const reserved = reservedWindows(anchorMs);
  for (const slot of schedule.slots) {
    const minute = new Date(slot.startMs).getUTCMinutes() % 15;
    if (minute < MACHINE_PHASE_BASE_MINUTES || minute > MACHINE_PHASE_BASE_MINUTES + PLANT.assets.length - 1) {
      problems.push(`${slot.sensorSerial} @ ${slot.startIso}: minuto fora da fase por máquina`);
    }
    const slotEnd = slot.startMs + ACQUISITION_SPAN_MS;
    for (const window of reserved) {
      if (window.sensors && !window.sensors.includes(slot.sensorSerial)) continue;
      if (slot.startMs < window.toMs && slotEnd > window.fromMs) {
        problems.push(`${slot.sensorSerial} @ ${slot.startIso} cruza ${window.label}`);
      }
    }
    if (problems.length >= 10) break;
  }
  if (problems.length > 0) {
    throw new Error(`Grade do histórico inválida: ${problems.join('; ')}.`);
  }
}
