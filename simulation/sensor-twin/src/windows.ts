/**
 * Janelamento do stream (B3): 60 janelas de 1 s sobre o stream de 128 Hz, com RMS
 * explícito por eixo — RMS = sqrt(Σx²/N) — e uma leitura de temperatura/RPM por janela.
 *
 * Política ÚNICA de arredondamento: os valores são arredondados a 6 casas decimais
 * exatamente UMA vez, aqui, no ponto em que viram dado do contrato. Nenhuma etapa
 * anterior arredonda (evita erro acumulado) e nenhuma posterior re-arredonda — isso é
 * o que torna estável o fingerprint do ciclo, inclusive no futuro round-trip ROS.
 */
import type { SyntheticStream } from './signal';
import type { ScenarioConfig } from './scenarios';

export interface CycleWindows {
  config: ScenarioConfig;
  /** Início de cada janela em UTC canônico com milissegundos (timestamp do dataPoint). */
  windowTimestamps: string[];
  rmsG: { x: number[]; y: number[]; z: number[] };
  temperaturesC: number[];
  rpms: number[];
}

/** Arredondamento canônico do contrato: 6 casas, uma única vez. */
export function round6(value: number): number {
  return Number(value.toFixed(6));
}

function rmsOfWindow(values: number[]): number {
  let sumOfSquares = 0;
  for (const value of values) {
    sumOfSquares += value * value;
  }
  return Math.sqrt(sumOfSquares / values.length);
}

export function windowStream(stream: SyntheticStream): CycleWindows {
  const { config } = stream;
  const samplesPerWindow = config.streamRateHz * config.windowSeconds;
  const windowCount = config.durationSeconds / config.windowSeconds;
  const baseMs = Date.parse(config.baseTimestamp);

  const windowTimestamps: string[] = [];
  const rmsG = { x: [] as number[], y: [] as number[], z: [] as number[] };
  const temperaturesC: number[] = [];
  const rpms: number[] = [];

  for (let w = 0; w < windowCount; w += 1) {
    const frames = stream.frames.slice(w * samplesPerWindow, (w + 1) * samplesPerWindow);

    windowTimestamps.push(new Date(baseMs + w * config.windowSeconds * 1000).toISOString());
    rmsG.x.push(round6(rmsOfWindow(frames.map((f) => f.axG))));
    rmsG.y.push(round6(rmsOfWindow(frames.map((f) => f.ayG))));
    rmsG.z.push(round6(rmsOfWindow(frames.map((f) => f.azG))));
    temperaturesC.push(round6(stream.temperaturesC[w]));
    rpms.push(round6(stream.rpms[w]));
  }

  return { config, windowTimestamps, rmsG, temperaturesC, rpms };
}
