/**
 * Unitários do mapeamento para o contrato REAL (os 10 obrigatórios do B3):
 * validação pelo Ajv da aplicação, canonicidade, unicidade temporal, unidades e
 * ausência de campos inventados.
 */
import { validateTelemetryCycle } from '@dynamox/contracts';

import { isValidIdempotencyKey } from '@dynamox/contracts';

import {
  acquisitionIntentId,
  buildCycle,
  DEFAULT_IDENTITY,
  monitoringPointResourceId,
} from './payload';
import { getScenarioConfig } from './scenarios';

describe('payload × contrato real', () => {
  const normal = buildCycle('normal');
  const imbalance = buildCycle('imbalance');

  it('1–2. NORMAL e IMBALANCE validam no MESMO Ajv usado pelo backend', () => {
    expect(validateTelemetryCycle(normal.payload).valid).toBe(true);
    expect(validateTelemetryCycle(imbalance.payload).valid).toBe(true);
  });

  it('3. mesmo input ⇒ fingerprint canônico idêntico (o da aplicação)', () => {
    const again = buildCycle('normal');
    expect(again.fingerprint).toBe(normal.fingerprint);
    expect(normal.fingerprint).toMatch(/^[0-9a-f]{64}$/);
  });

  it('4. cenários diferentes ⇒ payloads, fingerprints e chaves diferentes', () => {
    expect(imbalance.fingerprint).not.toBe(normal.fingerprint);
    expect(imbalance.idempotencyKey).not.toBe(normal.idempotencyKey);
  });

  it('5. cinco measurements (acc x/y/z, temperatura, rotação), 60 pontos cada = 300', () => {
    const { measurements } = normal.payload.telemetryCycleData;
    expect(measurements).toHaveLength(5);
    for (const measurement of measurements) {
      expect(measurement.dataPoints).toHaveLength(60);
    }
    const total = measurements.reduce((sum, m) => sum + m.dataPoints.length, 0);
    expect(total).toBe(300);
  });

  it('6–7. timestamps estritamente crescentes e sem duplicação interna', () => {
    for (const measurement of normal.payload.telemetryCycleData.measurements) {
      const timestamps = measurement.dataPoints.map((p) => p.timestamp);
      for (let i = 1; i < timestamps.length; i += 1) {
        expect(timestamps[i] > timestamps[i - 1]).toBe(true);
      }
      expect(new Set(timestamps).size).toBe(timestamps.length);
    }
  });

  it('8. todos os valores são finitos', () => {
    for (const measurement of normal.payload.telemetryCycleData.measurements) {
      for (const point of measurement.dataPoints) {
        expect(Number.isFinite(point.value)).toBe(true);
      }
    }
  });

  it('9. unidades e grandezas pertencem ao vocabulário aceito; eixo só nas vetoriais', () => {
    const expected = new Map<string, { unit: string; hasAxis: boolean }>([
      ['acceleration', { unit: 'g', hasAxis: true }],
      ['temperature', { unit: 'degC', hasAxis: false }],
      ['rotationalSpeed', { unit: 'rpm', hasAxis: false }],
    ]);
    for (const measurement of normal.payload.telemetryCycleData.measurements) {
      const spec = expected.get(measurement.attributes.physicalQuantity);
      expect(spec).toBeDefined();
      expect(measurement.attributes.unit).toBe(spec!.unit);
      expect(measurement.attributes.axis !== undefined).toBe(spec!.hasAxis);
    }
  });

  it('10. nenhum campo inventado: chaves exatamente as do contrato', () => {
    expect(Object.keys(normal.payload).sort()).toEqual(['configuration', 'telemetryCycleData']);
    expect(Object.keys(normal.payload.telemetryCycleData).sort()).toEqual([
      'measurements',
      'measuringSystemModel',
      'measuringSystemUniqueIdentifier',
      'metadata',
      'tags',
    ]);
    for (const measurement of normal.payload.telemetryCycleData.measurements) {
      for (const key of Object.keys(measurement.attributes)) {
        expect(['physicalQuantity', 'axis', 'unit', 'displayName']).toContain(key);
      }
      for (const point of measurement.dataPoints) {
        expect(Object.keys(point).sort()).toEqual(['timestamp', 'value']);
      }
    }
  });
});

describe('identidades: intenção, artefato, chave e cycleId', () => {
  it('o resourceId derivado é o MESMO do seed do banco (42d726ba…)', () => {
    expect(monitoringPointResourceId()).toBe('42d726ba50f8645df08dba9f');
  });

  it('a INTENÇÃO segue o formato do plano; a CHAVE é intent.fp8 e passa no charset da API', () => {
    expect(acquisitionIntentId(getScenarioConfig('normal'), DEFAULT_IDENTITY)).toBe(
      'sim.SIM-HF-001.normal.s42.20260830T090000Z',
    );
    expect(acquisitionIntentId(getScenarioConfig('imbalance'), DEFAULT_IDENTITY)).toBe(
      'sim.SIM-HF-001.imbalance.s42.20260830T100000Z',
    );

    const cycle = buildCycle('normal');
    expect(cycle.idempotencyKey).toMatch(
      /^sim\.SIM-HF-001\.normal\.s42\.20260830T090000Z\.[0-9a-f]{8}$/,
    );
    expect(isValidIdempotencyKey(cycle.idempotencyKey)).toBe(true);
    // cycleId = chave (cópia rastreável, como o schema documenta).
    expect(cycle.payload.telemetryCycleData.metadata.cycleId).toBe(cycle.idempotencyKey);
  });

  it('a mesma aquisição gera sempre a mesma chave; gerador alterado geraria chave nova', () => {
    expect(buildCycle('normal').idempotencyKey).toBe(buildCycle('normal').idempotencyKey);
    // Seed diferente ⇒ intenção diferente E fp8 diferente.
    expect(buildCycle('normal', { seed: 43 }).idempotencyKey).not.toBe(
      buildCycle('normal').idempotencyKey,
    );
  });

  it('a assinatura dos cenários sobrevive ao janelamento: RMS radial ≥ 2×', () => {
    const normal = buildCycle('normal');
    const imbalance = buildCycle('imbalance');
    const meanY = (cycle: typeof normal) => {
      const points = cycle.payload.telemetryCycleData.measurements[1].dataPoints;
      return points.reduce((sum, p) => sum + p.value, 0) / points.length;
    };
    expect(meanY(imbalance) / meanY(normal)).toBeGreaterThanOrEqual(2);
  });
});
