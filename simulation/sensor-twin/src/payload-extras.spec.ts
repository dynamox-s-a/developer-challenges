import { validateTelemetryCycle } from '@dynamox/contracts';

import { DEFAULT_IDENTITY, assertExtrasAreAdditive, buildCycle } from './payload';

describe('extras aditivos do ciclo', () => {
  const extras = { tags: ['dataset:history', 'simulated'], metadata: { history: { dataset: 'history', groundTruth: { expectedAlert: false } } } };

  it('sem extras, o ciclo é byte a byte o de sempre (fingerprint idêntico)', () => {
    expect(buildCycle('normal').fingerprint).toBe(buildCycle('normal', {}, DEFAULT_IDENTITY, {}).fingerprint);
  });

  it('extras entram só nos objetos abertos, validam no Ajv real e mudam o fingerprint', () => {
    const plain = buildCycle('normal');
    const withExtras = buildCycle('normal', {}, DEFAULT_IDENTITY, extras);
    const data = withExtras.payload.telemetryCycleData;
    expect(Object.keys(data).sort()).toEqual(Object.keys(plain.payload.telemetryCycleData).sort());
    expect(data.tags).toEqual([...plain.payload.telemetryCycleData.tags, 'dataset:history']); // deduplicado, ordem estável
    expect((data.metadata as Record<string, unknown>).history).toEqual(extras.metadata.history);
    expect(data.metadata.origin).toBe('simulation');
    expect(validateTelemetryCycle(withExtras.payload).valid).toBe(true);
    expect(withExtras.fingerprint).not.toBe(plain.fingerprint);
    expect(withExtras.acquisitionIntentId).toBe(plain.acquisitionIntentId);
    expect(withExtras.payload.telemetryCycleData.metadata.cycleId).toBe(withExtras.idempotencyKey);
  });

  it('recusa sobrescrever chaves canônicas', () => {
    expect(() => assertExtrasAreAdditive({ metadata: { origin: 'manual' } })).toThrow(/metadata\.origin/);
    expect(() => assertExtrasAreAdditive({ configuration: { scenario: 'x' } })).toThrow(/configuration\.scenario/);
    expect(() => buildCycle('normal', {}, DEFAULT_IDENTITY, { metadata: { cycleId: 'x' } })).toThrow(/canônicas/);
  });
});
