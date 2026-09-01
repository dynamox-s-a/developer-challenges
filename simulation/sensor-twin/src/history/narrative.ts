/**
 * Narrativa do mês sintético — DADOS congelados + funções puras. É a verdade-terreno
 * que a análise vai reencontrar e que a futura modelagem de alertas precisa distinguir:
 * degradação real, aquecimento, transiente e falso positivo. Tudo relativo à ÉPOCA do
 * dataset (dias-calendário); nada depende do relógio de quem executa.
 *
 * Limiares (1,5×, +4 °C, 1,1×) são DIDÁTICOS — declarados aqui, não validados
 * industrialmente. Mudar qualquer constante muda os payloads: com dados existentes a
 * API responde 409 e o purge é obrigatório antes de regenerar.
 */
import type { CycleExtras } from '../payload';
import type { PlantSensor } from '../plant';
import type { ScenarioConfig } from '../scenarios';
import { dayFactor, personality, round, slotSeed } from './seeds';
import { DAY_MS, DEMO_HOUR, MINUTE_MS, machinePhaseMinutes, type HistoryGap, type HistorySchedule, type HistorySlot } from './schedule-time';
import { bearingTemperatureC, minutesSinceRestart, warmupFactor } from './thermal';

export const NARRATIVE = Object.freeze({
  version: 1,
  dataset: 'history',
  diurnal: { amplitude: 0.15, peakHourUtc: 14 },
  weekendLoadFactor: 0.95,
  /** kLoad = 1 + loadCoupling·(L/Lnom − 1) → ±3,75 % de vibração para ±15 % de carga. */
  loadCoupling: 0.25,
  fanRpm: { base: 1180, floor: 0.88, span: 0.12 },
  weeklyStop: { weekdayUtc: 0, fromHour: 2, toHour: 8 },
  trip: { day: 12, fromHourUtc: 13.25, hours: 6 },
  ramp: { sensor: 'SIM-HF-002', days: 30, targetRatio: 1.6, exponent: 2.2, temperatureC: 3 },
  thermal: { sensor: 'SIM-HF-007', startDay: 20, days: 10, deltaC: 8 },
  mute: { sensor: 'SIM-TCAS-001', fromDay: 14, toDay: 17 },
  spike: { sensor: 'SIM-HF-005', day: 9, hourUtc: 11, ratio: 2.5 },
  warmupTauMinutes: 45,
  thresholds: { observationRatio: 1.5, detectableRatio: 1.1, thermalAlertC: 4, thermalDetectableC: 1, warmupFactor: 0.9 },
});

/** RMS radial nominal do cenário normal: √(0,02²/2 + 0,008²/2 + 0,006²). */
export const NORMAL_RADIAL_RMS_G = Math.sqrt(0.02 ** 2 / 2 + 0.008 ** 2 / 2 + 0.006 ** 2);
const NON_1X_POWER = 0.008 ** 2 / 2 + 0.006 ** 2;

/** Amplitude do 1× radial que produz `ratio` × o RMS radial nominal (forma fechada). */
export function radial1xForRatio(ratio: number): number {
  const power = ratio ** 2 * NORMAL_RADIAL_RMS_G ** 2 - NON_1X_POWER;
  if (power <= 0) throw new Error(`ratio ${ratio} abaixo do piso físico do modelo (só ruído e 2×).`);
  return Math.sqrt(2 * power);
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function nominalLoad(sensor: PlantSensor): number {
  return sensor.loadPercent;
}

/** Carga instantânea (%): perfil diurno × fator do dia × fim de semana. */
export function loadAt(slot: HistorySlot, sensor: PlantSensor): number {
  const hour = (slot.startMs % DAY_MS) / DEMO_HOUR;
  const diurnal = 1 + NARRATIVE.diurnal.amplitude * Math.cos((2 * Math.PI * (hour - NARRATIVE.diurnal.peakHourUtc)) / 24);
  const weekday = new Date(slot.startMs).getUTCDay();
  const weekend = weekday === 0 || weekday === 6 ? NARRATIVE.weekendLoadFactor : 1;
  return round(nominalLoad(sensor) * diurnal * dayFactor(slot.dayIndex) * weekend, 2);
}

export function rampSeverity(tMs: number, epochMs: number): number {
  return clamp01((tMs - epochMs) / (NARRATIVE.ramp.days * DAY_MS)) ** NARRATIVE.ramp.exponent;
}

export function thermalDriftC(tMs: number, epochMs: number): number {
  const start = epochMs + NARRATIVE.thermal.startDay * DAY_MS;
  return NARRATIVE.thermal.deltaC * clamp01((tMs - start) / (NARRATIVE.thermal.days * DAY_MS));
}

export function spikeStartMs(epochMs: number, machineIndex: number): number {
  return epochMs + NARRATIVE.spike.day * DAY_MS + NARRATIVE.spike.hourUtc * DEMO_HOUR + machinePhaseMinutes(machineIndex) * MINUTE_MS;
}

export function isSpikeSlot(slot: HistorySlot, epochMs: number): boolean {
  return slot.sensorSerial === NARRATIVE.spike.sensor && slot.startMs === spikeStartMs(epochMs, slot.machineIndex);
}

export type PhysicalEvent = 'none' | 'warmup' | 'imbalance' | 'thermal-drift' | 'transient';
export type ExpectedState = 'normal' | 'warmup' | 'degrading' | 'observation';
export type AlertKind = 'vibration' | 'thermal';

export interface SlotEvent {
  type: 'imbalance-ramp' | 'thermal-drift' | 'transient-spike';
  severity: number;
  ratio?: number;
  deltaC?: number;
}

export interface GroundTruth {
  physicalEvent: PhysicalEvent;
  fault: boolean;
  expectedState: ExpectedState;
  expectedAlert: boolean;
  alertKind: AlertKind | null;
  radialRatio: number;
  eventRatio: number;
  expectedRadialRmsG: number;
  temperatureC: number;
  events: SlotEvent[];
}

export interface SlotRegime {
  loadPercent: number;
  rpm: number;
  ambientC: number;
  warmupFactor: number;
  minutesSinceRestart: number | null;
  phase: 'run' | 'post-stop' | 'post-trip';
}

export interface HistoryMetadata {
  dataset: string;
  narrativeVersion: number;
  epoch: string;
  everyMinutes: number;
  gridIndex: number;
  slotStart: string;
  dayIndex: number;
  sensorSeed: number;
  slotSeed: number;
  regime: SlotRegime;
  groundTruth: GroundTruth;
}

export type HistoryOverrides = Partial<Omit<ScenarioConfig, 'scenario'>>;

export interface PlannedSlot {
  overrides: HistoryOverrides;
  extras: CycleExtras;
  history: HistoryMetadata;
}

export const HISTORY_TAG = `dataset:${NARRATIVE.dataset}`;

/** Slot + sensor → overrides do gerador + extras do contrato + verdade-terreno. Determinístico. */
export function planSlot(slot: HistorySlot, sensor: PlantSensor, schedule: HistorySchedule): PlannedSlot {
  const { epochMs } = schedule.range;
  const person = personality(sensor.seed);
  const loadPercent = loadAt(slot, sensor);
  const loadRatio = loadPercent / nominalLoad(sensor);
  const kLoad = 1 + NARRATIVE.loadCoupling * (loadRatio - 1);

  const restart = minutesSinceRestart(slot.startMs, schedule.gaps as readonly HistoryGap[]);
  const warmup = warmupFactor(restart?.minutes ?? null, NARRATIVE.warmupTauMinutes);

  const events: SlotEvent[] = [];
  let eventRatio = 1;
  let eventOffsetC = 0;
  let radialPhaseZRad: number | undefined;
  let physicalEvent: PhysicalEvent = 'none';
  let fault = false;
  let expectedState: ExpectedState = 'normal';
  let expectedAlert = false;
  let alertKind: AlertKind | null = null;

  if (restart && warmup < NARRATIVE.thresholds.warmupFactor) {
    physicalEvent = 'warmup';
    expectedState = 'warmup';
  }

  if (sensor.sensorSerial === NARRATIVE.ramp.sensor) {
    const severity = rampSeverity(slot.startMs, epochMs);
    if (severity > 0) {
      eventRatio = 1 + (NARRATIVE.ramp.targetRatio - 1) * severity;
      eventOffsetC = NARRATIVE.ramp.temperatureC * severity;
      radialPhaseZRad = (Math.PI / 2) * severity;
      physicalEvent = 'imbalance';
      fault = true;
      if (eventRatio >= NARRATIVE.thresholds.observationRatio) {
        expectedState = 'observation';
        expectedAlert = true;
        alertKind = 'vibration';
      } else if (eventRatio >= NARRATIVE.thresholds.detectableRatio) {
        expectedState = 'degrading';
      }
      events.push({ type: 'imbalance-ramp', severity: round(severity, 6), ratio: round(eventRatio, 4) });
    }
  }

  if (sensor.sensorSerial === NARRATIVE.thermal.sensor) {
    const deltaC = thermalDriftC(slot.startMs, epochMs);
    if (deltaC > 0) {
      eventOffsetC += deltaC;
      physicalEvent = 'thermal-drift';
      fault = true;
      if (deltaC >= NARRATIVE.thresholds.thermalAlertC) {
        expectedState = 'observation';
        expectedAlert = true;
        alertKind = 'thermal';
      } else if (deltaC >= NARRATIVE.thresholds.thermalDetectableC) {
        expectedState = 'degrading';
      }
      events.push({ type: 'thermal-drift', severity: round(deltaC / NARRATIVE.thermal.deltaC, 6), deltaC: round(deltaC, 3) });
    }
  }

  if (isSpikeSlot(slot, epochMs)) {
    eventRatio = NARRATIVE.spike.ratio;
    radialPhaseZRad = Math.PI / 2;
    // Transiente: fisicamente real, mas NÃO é falha — e não deve gerar alerta.
    physicalEvent = 'transient';
    fault = false;
    expectedState = 'normal';
    expectedAlert = false;
    alertKind = null;
    events.push({ type: 'transient-spike', severity: 1, ratio: NARRATIVE.spike.ratio });
  }

  const radialRatio = round(person.vibration * kLoad * eventRatio, 6);
  const temperatureC = round(
    bearingTemperatureC({
      tMs: slot.startMs,
      loadPercent,
      personalityOffsetC: person.temperatureOffsetC,
      warmup,
      eventOffsetC,
    }),
    3,
  );
  const rpm =
    sensor.machineType === 'Fan'
      ? round(NARRATIVE.fanRpm.base * (NARRATIVE.fanRpm.floor + NARRATIVE.fanRpm.span * loadRatio), 1)
      : sensor.rpm;

  const overrides: HistoryOverrides = {
    seed: slotSeed(sensor.seed, slot.startMs),
    rpm,
    loadPercent,
    baseTimestamp: slot.startIso,
    amplitudes: { radial1xG: round(radial1xForRatio(radialRatio), 9) } as ScenarioConfig['amplitudes'],
    temperature: { ambientC: temperatureC, riseC: 0, scenarioOffsetC: 0 } as ScenarioConfig['temperature'],
    ...(radialPhaseZRad !== undefined ? { radialPhaseZRad: round(radialPhaseZRad, 6) } : {}),
  };

  const regime: SlotRegime = {
    loadPercent,
    rpm,
    ambientC: round(temperatureC - eventOffsetC, 3),
    warmupFactor: round(warmup, 4),
    minutesSinceRestart: restart ? round(restart.minutes, 1) : null,
    phase:
      restart && warmup < NARRATIVE.thresholds.warmupFactor
        ? restart.after.kind === 'trip'
          ? 'post-trip'
          : 'post-stop'
        : 'run',
  };

  const history: HistoryMetadata = {
    dataset: NARRATIVE.dataset,
    narrativeVersion: NARRATIVE.version,
    epoch: new Date(epochMs).toISOString(),
    everyMinutes: schedule.range.everyMs / MINUTE_MS,
    gridIndex: slot.gridIndex,
    slotStart: slot.startIso,
    dayIndex: slot.dayIndex,
    sensorSeed: sensor.seed,
    slotSeed: overrides.seed as number,
    regime,
    groundTruth: {
      physicalEvent,
      fault,
      expectedState,
      expectedAlert,
      alertKind,
      radialRatio,
      eventRatio: round(eventRatio, 4),
      expectedRadialRmsG: round(radialRatio * NORMAL_RADIAL_RMS_G, 6),
      temperatureC,
      events,
    },
  };

  return {
    overrides,
    extras: { tags: [HISTORY_TAG], metadata: { history } },
    history,
  };
}
