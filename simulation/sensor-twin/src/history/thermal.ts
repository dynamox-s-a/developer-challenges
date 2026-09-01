/**
 * Modelo térmico do mancal para o histórico — puro e declaradamente didático.
 * Temperatura = ambiente diurno + personalidade + elevação por carga (com aquecimento
 * após parada) + deslocamento do evento. Cada aquisição sai PLANA: o gerador recebe
 * `ambientC = T` e `riseC = scenarioOffsetC = 0`, para não reiniciar o transiente de
 * 300 s a cada ciclo (dente-de-serra irreal).
 */
import { DEMO_HOUR_MS } from '@dynamox/contracts';

import { DAY_MS, MINUTE_MS, type HistoryGap } from './schedule-time';

export const AMBIENT_MEAN_C = 24;
export const AMBIENT_AMPLITUDE_C = 4;
export const AMBIENT_PEAK_HOUR_UTC = 15;
/** Mesma elevação nominal do gerador (TEMPERATURE_BASE.riseC). */
export const LOAD_RISE_C = 18;
/** Após parada/trip, quanto tempo olhar para trás procurando o religamento. */
const RESTART_LOOKBACK_MS = 6 * DEMO_HOUR_MS;

export function ambientC(tMs: number): number {
  const hour = (tMs % DAY_MS) / DEMO_HOUR_MS;
  return AMBIENT_MEAN_C + AMBIENT_AMPLITUDE_C * Math.cos((2 * Math.PI * (hour - AMBIENT_PEAK_HOUR_UTC)) / 24);
}

export function warmupFactor(minutesSinceRestart: number | null, tauMinutes: number): number {
  if (minutesSinceRestart === null) return 1;
  return 1 - Math.exp(-minutesSinceRestart / tauMinutes);
}

/** Minutos desde o último religamento (parada semanal ou trip) — null se a máquina não parou há pouco. */
export function minutesSinceRestart(startMs: number, gaps: readonly HistoryGap[]): { minutes: number; after: HistoryGap } | null {
  let best: HistoryGap | null = null;
  for (const gap of gaps) {
    if (gap.kind === 'mute') continue; // sensor mudo ≠ máquina parada
    if (gap.toMs <= startMs && startMs - gap.toMs < RESTART_LOOKBACK_MS && (!best || gap.toMs > best.toMs)) {
      best = gap;
    }
  }
  return best ? { minutes: (startMs - best.toMs) / MINUTE_MS, after: best } : null;
}

export interface ThermalInputs {
  tMs: number;
  loadPercent: number;
  personalityOffsetC: number;
  warmup: number;
  eventOffsetC: number;
}

export function bearingTemperatureC(input: ThermalInputs): number {
  return (
    ambientC(input.tMs) +
    input.personalityOffsetC +
    LOAD_RISE_C * (input.loadPercent / 100) * input.warmup +
    input.eventOffsetC
  );
}
