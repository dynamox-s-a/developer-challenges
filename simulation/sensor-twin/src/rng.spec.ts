/**
 * Unitários do RNG determinístico e do ruído banda-limitado.
 */
import { createDeterministicNoise, createLcg, mixSeed } from './rng';

describe('LCG determinístico', () => {
  it('mesma seed produz exatamente a mesma sequência', () => {
    const a = createLcg(42);
    const b = createLcg(42);
    for (let i = 0; i < 100; i += 1) {
      expect(a()).toBe(b());
    }
  });

  it('seeds diferentes divergem imediatamente e sub-seeds por eixo são distintas', () => {
    expect(createLcg(42)()).not.toBe(createLcg(43)());
    expect(new Set([mixSeed(42, 1), mixSeed(42, 2), mixSeed(42, 3)]).size).toBe(3);
  });
});

describe('ruído determinístico banda-limitado', () => {
  const options = { count: 16, bandMinHz: 2, bandMaxHz: 50, sigmaG: 0.006 };

  it('tem exatamente 16 componentes, todas dentro de [2, 50] Hz', () => {
    const noise = createDeterministicNoise(42, options);
    expect(noise.components).toHaveLength(16);
    for (const component of noise.components) {
      expect(component.frequencyHz).toBeGreaterThanOrEqual(2);
      expect(component.frequencyHz).toBeLessThanOrEqual(50);
    }
  });

  it('o σ observado no tempo fica próximo do σ alvo (normalização por construção)', () => {
    const noise = createDeterministicNoise(42, options);
    const sampleRateHz = 1024;
    const samples: number[] = [];
    for (let n = 0; n < 60 * sampleRateHz; n += 1) {
      samples.push(noise.sampleAt(n / sampleRateHz));
    }
    const variance = samples.reduce((sum, v) => sum + v * v, 0) / samples.length;
    const sigma = Math.sqrt(variance);
    expect(sigma).toBeGreaterThan(options.sigmaG * 0.7);
    expect(sigma).toBeLessThan(options.sigmaG * 1.3);
  });

  it('é uma função pura do tempo: reavaliar o mesmo instante dá o mesmo valor', () => {
    const noise = createDeterministicNoise(42, options);
    expect(noise.sampleAt(1.2345)).toBe(noise.sampleAt(1.2345));
  });
});
