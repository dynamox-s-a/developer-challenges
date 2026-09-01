/**
 * Síntese determinística do sinal do sensor virtual (modelo da §4 do plano):
 *
 *   radiais (Y, Z):  a_r(t) = A1·sin(2π f_rot t + φ_r) + A2·sin(4π f_rot t) + n_r(t)
 *   axial (X):       a_x(t) = axialFactor·A1_normal·sin(2π f_rot t) + n_x(t)
 *
 * No cenário `imbalance`, A1 radial vem amplificado (k=4 nos defaults) e as radiais
 * ficam em quadratura (φ_Z − φ_Y = 90°): a assinatura sintética do vetor girante do
 * desbalanceamento. O axial é deliberadamente pouco sensível ao cenário —
 * simplificação documentada, não física certificada.
 *
 * A síntese acontece a `synthesisRateHz` (1024 Hz) e o stream público é a decimação
 * inteira exata (÷8 → 128 Hz). Todo o conteúdo é banda-limitado por construção
 * (2×f_rot ≈ 58,3 Hz e ruído ≤ 50 Hz, ambos < Nyquist do stream = 64 Hz), então a
 * decimação por subamostragem é livre de aliasing sem nenhum filtro.
 */
import { createHash } from 'node:crypto';

import { canonicalJson } from '@dynamox/contracts';

import { createDeterministicNoise, createLcg, mixSeed, type NoiseComponent } from './rng';
import { rotationFrequencyHz, type ScenarioConfig } from './scenarios';

export interface StreamFrame {
  /** Segundos desde baseTimestamp. */
  tSeconds: number;
  axG: number;
  ayG: number;
  azG: number;
}

export interface SyntheticStream {
  config: ScenarioConfig;
  /** Aceleração nos três eixos a streamRateHz. */
  frames: StreamFrame[];
  /** Uma leitura por segundo (alinhada às janelas de RMS). */
  temperaturesC: number[];
  rpms: number[];
  /** Frequências efetivamente presentes no stream — verificáveis contra Nyquist. */
  contentFrequenciesHz: number[];
  noiseComponents: { x: NoiseComponent[]; y: NoiseComponent[]; z: NoiseComponent[] };
}

const AXIS_SALTS = { x: 1, y: 2, z: 3 } as const;

/** A amplitude axial referencia sempre o 1× "normal": o eixo não acompanha o cenário. */
const NORMAL_RADIAL_1X_G = 0.02;

export function generateStream(config: ScenarioConfig): SyntheticStream {
  const fRot = rotationFrequencyHz(config);
  const { radial1xG, radial2xG, axialFactor, noiseSigmaG } = config.amplitudes;

  const noiseFor = (axis: keyof typeof AXIS_SALTS) =>
    createDeterministicNoise(mixSeed(config.seed, AXIS_SALTS[axis]), {
      count: config.noiseComponentCount,
      bandMinHz: config.noiseBandHz.min,
      bandMaxHz: config.noiseBandHz.max,
      sigmaG: noiseSigmaG,
    });
  const noise = { x: noiseFor('x'), y: noiseFor('y'), z: noiseFor('z') };

  // Síntese na taxa interna…
  const totalSynthSamples = config.durationSeconds * config.synthesisRateHz;
  const synthesized: Array<{ axG: number; ayG: number; azG: number }> = new Array(
    totalSynthSamples,
  );
  for (let n = 0; n < totalSynthSamples; n += 1) {
    const t = n / config.synthesisRateHz;
    const one = 2 * Math.PI * fRot * t;
    const two = 4 * Math.PI * fRot * t;

    synthesized[n] = {
      axG: axialFactor * NORMAL_RADIAL_1X_G * Math.sin(one) + noise.x.sampleAt(t),
      ayG:
        radial1xG * Math.sin(one + config.radialPhaseYRad) +
        radial2xG * Math.sin(two) +
        noise.y.sampleAt(t),
      azG:
        radial1xG * Math.sin(one + config.radialPhaseZRad) +
        radial2xG * Math.sin(two) +
        noise.z.sampleAt(t),
    };
  }

  // …e decimação inteira exata para o stream público.
  const decimation = config.synthesisRateHz / config.streamRateHz;
  const frames: StreamFrame[] = [];
  for (let n = 0; n < totalSynthSamples; n += decimation) {
    frames.push({ tSeconds: n / config.synthesisRateHz, ...synthesized[n] });
  }

  // Temperatura (1ª ordem) e RPM (oscilação lenta determinística), 1 leitura/segundo.
  const rpmPhase = createLcg(mixSeed(config.seed, 7))() * 2 * Math.PI;
  const temperaturesC: number[] = [];
  const rpms: number[] = [];
  for (let s = 0; s < config.durationSeconds; s += 1) {
    const rise =
      config.temperature.riseC * (config.loadPercent / 100) * (1 - Math.exp(-s / config.temperature.tauSeconds));
    const scenarioRise =
      config.temperature.scenarioOffsetC * (1 - Math.exp(-s / config.temperature.tauSeconds));
    temperaturesC.push(config.temperature.ambientC + rise + scenarioRise);
    rpms.push(config.rpm + 0.5 * Math.sin(2 * Math.PI * 0.05 * s + rpmPhase));
  }

  const contentFrequenciesHz = [
    fRot,
    2 * fRot,
    ...noise.x.components.map((c) => c.frequencyHz),
    ...noise.y.components.map((c) => c.frequencyHz),
    ...noise.z.components.map((c) => c.frequencyHz),
  ];

  return {
    config,
    frames,
    temperaturesC,
    rpms,
    contentFrequenciesHz,
    noiseComponents: {
      x: noise.x.components,
      y: noise.y.components,
      z: noise.z.components,
    },
  };
}

/** Hash semântico do stream: SHA-256 sobre a serialização canônica (chaves ordenadas). */
export function streamDigest(stream: SyntheticStream): string {
  const canonical = canonicalJson({
    config: stream.config,
    frames: stream.frames,
    temperaturesC: stream.temperaturesC,
    rpms: stream.rpms,
  });
  return createHash('sha256').update(canonical).digest('hex');
}

export function rmsOf(values: number[]): number {
  const sumOfSquares = values.reduce((sum, value) => sum + value * value, 0);
  return Math.sqrt(sumOfSquares / values.length);
}

/**
 * Fase de uma frequência via DFT de bin único. Com os defaults a amostragem é coerente
 * (1750 rpm ⇒ exatamente 1750 ciclos em 60 s ⇒ bin inteiro), então a estimativa é
 * limpa, sem janela nem leakage relevante.
 */
export function phaseAtFrequencyRad(
  values: number[],
  sampleRateHz: number,
  frequencyHz: number,
): number {
  let real = 0;
  let imaginary = 0;
  for (let n = 0; n < values.length; n += 1) {
    const angle = (2 * Math.PI * frequencyHz * n) / sampleRateHz;
    real += values[n] * Math.cos(angle);
    imaginary -= values[n] * Math.sin(angle);
  }
  return Math.atan2(imaginary, real);
}
