/**
 * Seeds do histórico sintético — tudo derivado da seed do sensor por funções puras
 * (rng.ts); nenhum acaso do runtime. Cada aquisição do histórico recebe a própria
 * realização de ruído: com a seed constante do sensor, as 60 janelas repetiriam o
 * mesmo perfil em toda aquisição (o ruído é função pura de (seed, t)).
 */
import { createLcg, mixSeed } from '../rng';

/** 'HIST' em ASCII — separa o espaço de seeds do histórico do das fases da planta. */
export const HISTORY_SALT = 0x48495354;
const PERSONALITY_VIBRATION_SALT = 0x50;
const PERSONALITY_TEMPERATURE_SALT = 0x54;

/**
 * Seed da aquisição: depende do MINUTO ABSOLUTO do slot, não da época nem do índice da
 * grade — duas execuções com épocas diferentes concordam na realização de ruído.
 */
export function slotSeed(sensorSeed: number, startMs: number): number {
  const minuteOfEpoch = Math.floor(startMs / 60_000) % 0x7fffffff;
  return mixSeed(mixSeed(sensorSeed, HISTORY_SALT), minuteOfEpoch);
}

export interface SensorPersonality {
  /** Multiplicador da vibração radial: a frota não é doze cópias do mesmo sensor. */
  vibration: number;
  /** Deslocamento fixo de temperatura do mancal (°C). */
  temperatureOffsetC: number;
}

export function personality(sensorSeed: number): SensorPersonality {
  const vibration = createLcg(mixSeed(sensorSeed, PERSONALITY_VIBRATION_SALT))();
  const temperature = createLcg(mixSeed(sensorSeed, PERSONALITY_TEMPERATURE_SALT))();
  return {
    vibration: round(0.92 + 0.16 * vibration, 4),
    temperatureOffsetC: round(-1 + 2 * temperature, 3),
  };
}

/** Fator determinístico do dia (±3 %): dias não são cópias periódicas perfeitas. */
export function dayFactor(dayIndex: number): number {
  const draw = createLcg(mixSeed(0x44, dayIndex))();
  return round(1 + 0.03 * (2 * draw - 1), 4);
}

export function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
