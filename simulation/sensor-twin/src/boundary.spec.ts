/**
 * Guarda de FRONTEIRA do supervisor (achado da revisão F4–F6): os módulos do supervisor
 * (assess.ts, deliberate.ts) não podem importar nem referenciar a maquinaria de cenário
 * do simulador. Se alguém reintroduzir o vazamento, este spec grita.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FORBIDDEN = [
  'scenarioForSensor',
  'CONFIRM_SEED_OFFSET',
  'conditionTarget',
  'buildCycle',
  "'imbalance'",
  '"imbalance"',
];

describe('fronteira supervisor × simulador', () => {
  for (const file of ['assess.ts', 'deliberate.ts']) {
    it(`${file} não referencia cenário/seed/realidade do simulador`, () => {
      const source = readFileSync(join(__dirname, file), 'utf8');
      const offenders = FORBIDDEN.filter((token) => source.includes(token));
      expect(offenders).toEqual([]);
    });
  }

  it('a porta de aquisição vive no lado do simulador (fleet.ts)', () => {
    const source = readFileSync(join(__dirname, 'fleet.ts'), 'utf8');
    expect(source).toContain('requestConfirmatoryAcquisition');
    expect(source).toContain('scenarioForSensor');
  });
});
