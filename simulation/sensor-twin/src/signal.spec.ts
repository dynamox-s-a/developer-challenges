/**
 * Unitários da síntese (testes obrigatórios do B2): determinismo por hash,
 * diferenciação de cenários, quadratura das radiais, limites de Nyquist e volumetria.
 */
import {
  generateStream,
  phaseAtFrequencyRad,
  rmsOf,
  streamDigest,
} from './signal';
import { getScenarioConfig, rotationFrequencyHz } from './scenarios';

describe('determinismo', () => {
  it('mesma seed + mesmos parâmetros ⇒ SHA-256 idêntico do stream (execuções repetidas)', () => {
    const first = streamDigest(generateStream(getScenarioConfig('normal')));
    const second = streamDigest(generateStream(getScenarioConfig('normal')));
    const third = streamDigest(generateStream(getScenarioConfig('normal')));
    expect(second).toBe(first);
    expect(third).toBe(first);
    expect(first).toMatch(/^[0-9a-f]{64}$/);
  });

  it('seed diferente ⇒ hash diferente', () => {
    const seed42 = streamDigest(generateStream(getScenarioConfig('normal')));
    const seed43 = streamDigest(generateStream(getScenarioConfig('normal', { seed: 43 })));
    expect(seed43).not.toBe(seed42);
  });

  it('NORMAL e IMBALANCE produzem streams diferentes', () => {
    const normal = streamDigest(generateStream(getScenarioConfig('normal')));
    const imbalance = streamDigest(generateStream(getScenarioConfig('imbalance')));
    expect(imbalance).not.toBe(normal);
  });
});

describe('assinatura dos cenários', () => {
  const normal = generateStream(getScenarioConfig('normal'));
  const imbalance = generateStream(getScenarioConfig('imbalance'));

  it('RMS radial do imbalance ≥ 2× o do normal (esperado ≈ 3,5×)', () => {
    const rmsNormalY = rmsOf(normal.frames.map((f) => f.ayG));
    const rmsImbalanceY = rmsOf(imbalance.frames.map((f) => f.ayG));
    const rmsNormalZ = rmsOf(normal.frames.map((f) => f.azG));
    const rmsImbalanceZ = rmsOf(imbalance.frames.map((f) => f.azG));

    expect(rmsImbalanceY / rmsNormalY).toBeGreaterThanOrEqual(2);
    expect(rmsImbalanceZ / rmsNormalZ).toBeGreaterThanOrEqual(2);
  });

  it('no imbalance, Y e Z ficam em quadratura (~90°) no 1×; no normal, em fase', () => {
    const fRot = rotationFrequencyHz(imbalance.config);
    const rate = imbalance.config.streamRateHz;

    const phaseDiffImbalance =
      phaseAtFrequencyRad(imbalance.frames.map((f) => f.ayG), rate, fRot) -
      phaseAtFrequencyRad(imbalance.frames.map((f) => f.azG), rate, fRot);
    expect(Math.abs(Math.abs(phaseDiffImbalance) - Math.PI / 2)).toBeLessThan(0.15);

    const phaseDiffNormal =
      phaseAtFrequencyRad(normal.frames.map((f) => f.ayG), rate, fRot) -
      phaseAtFrequencyRad(normal.frames.map((f) => f.azG), rate, fRot);
    expect(Math.abs(phaseDiffNormal)).toBeLessThan(0.15);
  });

  it('o eixo axial é invariável entre cenários, por construção', () => {
    const rmsNormalX = rmsOf(normal.frames.map((f) => f.axG));
    const rmsImbalanceX = rmsOf(imbalance.frames.map((f) => f.axG));
    // Mesma amplitude axial e mesma sub-seed de ruído nos dois cenários: a razão é ~1
    // exata — se alguém tornar o axial sensível de novo, este assert grita.
    expect(Math.abs(rmsImbalanceX / rmsNormalX - 1)).toBeLessThan(0.01);
  });

  it('a temperatura do imbalance termina mais quente (deriva assintótica declarada)', () => {
    const lastNormal = normal.temperaturesC[normal.temperaturesC.length - 1];
    const lastImbalance = imbalance.temperaturesC[imbalance.temperaturesC.length - 1];
    expect(lastImbalance).toBeGreaterThan(lastNormal);
  });
});

describe('limites e volumetria', () => {
  it('nenhuma frequência do stream excede Nyquist (64 Hz): 1×, 2× e todo o ruído', () => {
    for (const scenario of ['normal', 'imbalance'] as const) {
      const stream = generateStream(getScenarioConfig(scenario));
      const nyquist = stream.config.streamRateHz / 2;
      for (const frequency of stream.contentFrequenciesHz) {
        expect(frequency).toBeLessThan(nyquist);
      }
      // Os defaults do plano: 1× ≈ 29,17 Hz, 2× ≈ 58,33 Hz, ruído ≤ 50 Hz.
      expect(Math.max(...stream.contentFrequenciesHz)).toBeLessThan(64);
    }
  });

  it('volumetria exata: duração × taxa de stream, e leituras 1/s alinhadas às janelas', () => {
    const stream = generateStream(getScenarioConfig('normal'));
    expect(stream.frames).toHaveLength(60 * 128);
    expect(stream.temperaturesC).toHaveLength(60);
    expect(stream.rpms).toHaveLength(60);
    // Decimação exata ÷8: instantes do stream caem na grade de 128 Hz.
    expect(stream.frames[1].tSeconds).toBeCloseTo(1 / 128, 12);
    expect(stream.frames[128].tSeconds).toBeCloseTo(1, 12);
  });

  it('o RMS radial do normal fica na ordem prevista pelo modelo (≈ 0,016 g)', () => {
    const stream = generateStream(getScenarioConfig('normal'));
    const rms = rmsOf(stream.frames.map((f) => f.ayG));
    expect(rms).toBeGreaterThan(0.012);
    expect(rms).toBeLessThan(0.02);
  });
});
