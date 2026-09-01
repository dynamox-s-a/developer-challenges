/**
 * Unitários dos parâmetros do gêmeo: defaults do plano (§3), vocabulário fechado de
 * cenários e invariantes que o gerador assume.
 */
import {
  InvalidScenarioError,
  SCENARIOS,
  TWIN_IDENTITY,
  assertValidConfig,
  getScenarioConfig,
  rotationFrequencyHz,
} from './scenarios';

describe('cenários — vocabulário e identidade', () => {
  it('aceita exatamente os cenários do contrato congelado: normal e imbalance', () => {
    expect([...SCENARIOS]).toEqual(['normal', 'imbalance']);
    expect(() => getScenarioConfig('misalignment')).toThrow(InvalidScenarioError);
    expect(() => getScenarioConfig('IMBALANCE')).toThrow(InvalidScenarioError);
    expect(() => getScenarioConfig(undefined)).toThrow(InvalidScenarioError);
  });

  it('a identidade casa com o seed do banco e o exemplo oficial do contrato', () => {
    expect(TWIN_IDENTITY).toMatchObject({
      machineName: 'P-101',
      machineType: 'Pump',
      monitoringPointName: 'Mancal lado acoplamento',
      sensorSerial: 'SIM-HF-001',
      sensorProfile: 'HF+',
    });
  });
});

describe('cenários — defaults do plano', () => {
  it('normal: RPM 1750, carga 70%, seed 42, 60 s, 1024→128 Hz, ruído 2–50 Hz', () => {
    const config = getScenarioConfig('normal');
    expect(config).toMatchObject({
      rpm: 1750,
      loadPercent: 70,
      seed: 42,
      durationSeconds: 60,
      synthesisRateHz: 1024,
      streamRateHz: 128,
      windowSeconds: 1,
      noiseBandHz: { min: 2, max: 50 },
      noiseComponentCount: 16,
    });
    expect(config.amplitudes).toEqual({
      radial1xG: 0.02,
      radial2xG: 0.008,
      axialFactor: 0.4,
      noiseSigmaG: 0.006,
    });
    expect(rotationFrequencyHz(config)).toBeCloseTo(29.16667, 4);
  });

  it('imbalance: 1× radial amplificado 4× e radiais em quadratura (90°)', () => {
    const normal = getScenarioConfig('normal');
    const imbalance = getScenarioConfig('imbalance');

    expect(imbalance.amplitudes.radial1xG).toBeCloseTo(4 * normal.amplitudes.radial1xG, 12);
    expect(imbalance.radialPhaseYRad).toBe(0);
    expect(imbalance.radialPhaseZRad).toBeCloseTo(Math.PI / 2, 12);
    expect(imbalance.temperature.scenarioOffsetC).toBe(3);
  });

  it('as janelas temporais dos cenários são disjuntas entre si e do dado existente', () => {
    const normal = getScenarioConfig('normal');
    const imbalance = getScenarioConfig('imbalance');

    const normalEnd = Date.parse(normal.baseTimestamp) + normal.durationSeconds * 1000;
    expect(Date.parse(imbalance.baseTimestamp)).toBeGreaterThan(normalEnd);
    // O seed/exemplo do banco vive em 2026-08-26; o gêmeo começa dias depois.
    expect(Date.parse(normal.baseTimestamp)).toBeGreaterThan(Date.parse('2026-08-27T00:00:00.000Z'));
  });

  it('a config devolvida é imutável', () => {
    const config = getScenarioConfig('normal');
    expect(() => {
      (config as { rpm: number }).rpm = 3600;
    }).toThrow();
  });
});

describe('cenários — invariantes de validade', () => {
  it('recusa stream que não divide a síntese exatamente', () => {
    expect(() => getScenarioConfig('normal', { streamRateHz: 100 })).toThrow(/decimação inteira/);
  });

  it('recusa conteúdo acima de Nyquist do stream (2×f_rot e banda de ruído)', () => {
    // 3600 rpm ⇒ 2× = 120 Hz ≥ 64 Hz de Nyquist do stream de 128 Hz.
    expect(() => getScenarioConfig('normal', { rpm: 3600 })).toThrow(/Nyquist/);
    expect(() =>
      getScenarioConfig('normal', { noiseBandHz: { min: 2, max: 80 } }),
    ).toThrow(/Nyquist/);
  });

  it('recusa duração não múltipla da janela e timestamp fora do formato canônico', () => {
    expect(() => getScenarioConfig('normal', { durationSeconds: 60.5 })).toThrow(/janela|window|dividir/i);
    expect(() =>
      getScenarioConfig('normal', { baseTimestamp: '2026-08-30 09:00:00' }),
    ).toThrow(/canônico/);
  });

  it('assertValidConfig aceita os dois defaults sem reclamar', () => {
    for (const name of SCENARIOS) {
      expect(() => assertValidConfig(getScenarioConfig(name))).not.toThrow();
    }
  });
});
