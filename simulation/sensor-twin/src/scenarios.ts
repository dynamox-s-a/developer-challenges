/**
 * Parâmetros determinísticos do gêmeo digital (BON-06 v2, §3 do plano).
 *
 * Tudo aqui é sintético e didático: as amplitudes são pedagógicas e nenhum valor
 * infere severidade real (ISO 10816), banda real do HF+ ou diagnóstico físico. Os nomes
 * de cenário seguem o vocabulário do contrato congelado (`configuration.scenario`):
 * apenas `normal` e `imbalance`.
 */

export const SCENARIOS = ['normal', 'imbalance'] as const;
export type ScenarioName = (typeof SCENARIOS)[number];

/** Identidade do gêmeo — casa com o seed do banco e com o exemplo oficial do contrato. */
export const TWIN_IDENTITY = {
  machineName: 'P-101',
  machineType: 'Pump',
  monitoringPointName: 'Mancal lado acoplamento',
  sensorSerial: 'SIM-HF-001',
  sensorProfile: 'HF+',
  generatorName: 'industrial-condition-sensor-sim',
  generatorVersion: '0.2.0',
} as const;

export interface AmplitudeConfig {
  /** Amplitude do 1× f_rot nos eixos radiais (g). */
  radial1xG: number;
  /** Amplitude do 2× f_rot nos eixos radiais (g). */
  radial2xG: number;
  /** Fração do 1× radial presente no eixo axial (simplificação declarada). */
  axialFactor: number;
  /** Desvio-padrão alvo do ruído banda-limitado (g). */
  noiseSigmaG: number;
}

export interface TemperatureConfig {
  ambientC: number;
  riseC: number;
  tauSeconds: number;
  /** Deslocamento assintótico adicional do cenário (°C). */
  scenarioOffsetC: number;
}

export interface ScenarioConfig {
  scenario: ScenarioName;
  seed: number;
  rpm: number;
  loadPercent: number;
  durationSeconds: number;
  /** Taxa interna de síntese (Hz). */
  synthesisRateHz: number;
  /** Taxa do stream publicado/janelado (Hz); precisa dividir a síntese exatamente. */
  streamRateHz: number;
  windowSeconds: number;
  /** Início determinístico do ciclo (UTC canônico com milissegundos). */
  baseTimestamp: string;
  amplitudes: AmplitudeConfig;
  /** Fases do 1× nos radiais (rad): no imbalance, quadratura (vetor girante). */
  radialPhaseYRad: number;
  radialPhaseZRad: number;
  temperature: TemperatureConfig;
  /** Ruído banda-limitado por construção: [minHz, maxHz]. */
  noiseBandHz: { min: number; max: number };
  noiseComponentCount: number;
}

const BASE: Omit<
  ScenarioConfig,
  'scenario' | 'baseTimestamp' | 'amplitudes' | 'radialPhaseZRad' | 'temperature'
> = {
  seed: 42,
  rpm: 1750,
  loadPercent: 70,
  durationSeconds: 60,
  synthesisRateHz: 1024,
  streamRateHz: 128,
  windowSeconds: 1,
  radialPhaseYRad: 0,
  noiseBandHz: { min: 2, max: 50 },
  noiseComponentCount: 16,
};

const TEMPERATURE_BASE = { ambientC: 25, riseC: 18, tauSeconds: 300 };

/**
 * Janelas temporais disjuntas entre cenários E disjuntas dos dados já existentes no
 * banco de demonstração (26/08 12:00–12:15): colisão de timestamp na mesma série é um
 * 409 explícito da API, então cada cenário vive no seu próprio intervalo.
 */
const DEFAULTS: Record<ScenarioName, ScenarioConfig> = {
  normal: {
    ...BASE,
    scenario: 'normal',
    baseTimestamp: '2026-08-30T09:00:00.000Z',
    amplitudes: { radial1xG: 0.02, radial2xG: 0.008, axialFactor: 0.4, noiseSigmaG: 0.006 },
    // Em operação normal as radiais ficam em fase (escolha sintética documentada);
    // a quadratura é a assinatura reservada ao vetor girante do desbalanceamento.
    radialPhaseZRad: 0,
    temperature: { ...TEMPERATURE_BASE, scenarioOffsetC: 0 },
  },
  imbalance: {
    ...BASE,
    scenario: 'imbalance',
    baseTimestamp: '2026-08-30T10:00:00.000Z',
    // k = 4 sobre o 1× radial: RMS ≈ 3,5× o do normal, visível a olho nu no gráfico.
    // axialFactor idêntico ao normal DE PROPÓSITO: o desbalanceamento puro é força
    // radial girante — o eixo axial não acompanha o cenário (claim validado por teste).
    amplitudes: { radial1xG: 0.08, radial2xG: 0.008, axialFactor: 0.4, noiseSigmaG: 0.006 },
    // Força centrífuga rotativa: radiais em quadratura (Z adiantado 90°).
    radialPhaseZRad: Math.PI / 2,
    temperature: { ...TEMPERATURE_BASE, scenarioOffsetC: 3 },
  },
};

export function isScenarioName(value: unknown): value is ScenarioName {
  return typeof value === 'string' && (SCENARIOS as readonly string[]).includes(value);
}

export class InvalidScenarioError extends Error {
  constructor(requested: unknown) {
    super(
      `Cenário desconhecido: "${String(requested)}". O contrato congelado aceita apenas: ${SCENARIOS.join(', ')}.`,
    );
    this.name = 'InvalidScenarioError';
  }
}

/** Invariantes que o restante do gerador assume; falhar cedo e alto se alguém mexer. */
export function assertValidConfig(config: ScenarioConfig): void {
  const problems: string[] = [];

  if (!isScenarioName(config.scenario)) problems.push('scenario fora do vocabulário');
  if (!Number.isSafeInteger(config.seed)) problems.push('seed deve ser inteiro');
  if (config.rpm <= 0) problems.push('rpm deve ser positivo');
  if (config.durationSeconds <= 0) problems.push('durationSeconds deve ser positivo');
  if (config.synthesisRateHz % config.streamRateHz !== 0) {
    problems.push('streamRateHz precisa dividir synthesisRateHz exatamente (decimação inteira)');
  }
  if (config.durationSeconds % config.windowSeconds !== 0) {
    problems.push('windowSeconds precisa dividir durationSeconds exatamente');
  }

  const streamNyquist = config.streamRateHz / 2;
  const rotational2x = (config.rpm / 60) * 2;
  if (rotational2x >= streamNyquist) {
    problems.push(`2×f_rot (${rotational2x.toFixed(2)} Hz) precisa ficar abaixo de Nyquist do stream (${streamNyquist} Hz)`);
  }
  if (config.noiseBandHz.min <= 0 || config.noiseBandHz.max <= config.noiseBandHz.min) {
    problems.push('banda de ruído inválida');
  }
  if (config.noiseBandHz.max >= streamNyquist) {
    problems.push(`ruído (${config.noiseBandHz.max} Hz) precisa ficar abaixo de Nyquist do stream (${streamNyquist} Hz)`);
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(config.baseTimestamp)) {
    problems.push('baseTimestamp fora do formato canônico UTC com milissegundos');
  }

  if (problems.length > 0) {
    throw new Error(`Configuração de cenário inválida: ${problems.join('; ')}.`);
  }
}

/** Config imutável do cenário; `overrides` existe para testes e experimentos locais. */
export function getScenarioConfig(
  name: unknown,
  overrides: Partial<Omit<ScenarioConfig, 'scenario'>> = {},
): ScenarioConfig {
  if (!isScenarioName(name)) throw new InvalidScenarioError(name);

  const config: ScenarioConfig = {
    ...DEFAULTS[name],
    ...overrides,
    amplitudes: { ...DEFAULTS[name].amplitudes, ...(overrides.amplitudes ?? {}) },
    temperature: { ...DEFAULTS[name].temperature, ...(overrides.temperature ?? {}) },
    noiseBandHz: { ...DEFAULTS[name].noiseBandHz, ...(overrides.noiseBandHz ?? {}) },
  };
  assertValidConfig(config);
  return Object.freeze(config);
}

/** Frequência de rotação (Hz) — 1750 rpm ⇒ 29,1667 Hz. */
export function rotationFrequencyHz(config: ScenarioConfig): number {
  return config.rpm / 60;
}
