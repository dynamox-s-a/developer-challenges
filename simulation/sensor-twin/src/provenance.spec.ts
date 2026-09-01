/**
 * Unitários do F8 (proveniência ROS) — parte PURA: JSONL determinístico, preservação
 * campo a campo, origin obrigatório, ausência de segredos e identidade por fingerprint
 * recomputado. O round-trip pelo rosbag REAL vive em test-ros/ (npm run twin:ros);
 * nada aqui toca Python, rede ou banco — a suíte convencional fica verde sem ROS.
 */
import { computePayloadFingerprint } from '@dynamox/contracts';

import { buildConfirmatoryCycle } from './fleet';
import { PLANT } from './plant';
import {
  acquisitionRecords,
  parseProvenance,
  payloadFromRecords,
  rosTopicPlan,
  serializeProvenance,
  type AcquisitionRecord,
  type ProvenanceRecord,
  type SampleRecord,
} from './provenance';

// O alvo canônico usa resourceId FIXO do seed — construível offline, sem bootstrap.
const cycle = buildConfirmatoryCycle(PLANT, new Map(), PLANT.conditionTarget.sensorSerial);
const records = acquisitionRecords(cycle, 'Pump');
const jsonl = serializeProvenance(records);

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('F8 — artefato canônico determinístico (critérios 1–3)', () => {
  it('1. aquisição canônica → JSONL determinístico com 306 registros (1+5+300)', () => {
    const again = serializeProvenance(
      acquisitionRecords(buildConfirmatoryCycle(PLANT, new Map(), 'SIM-HF-002'), 'Pump'),
    );
    expect(again).toBe(jsonl);
    expect(jsonl.trimEnd().split('\n')).toHaveLength(306);
    expect(records.filter((r) => r.type === 'acquisition')).toHaveLength(1);
    expect(records.filter((r) => r.type === 'series')).toHaveLength(5);
    expect(records.filter((r) => r.type === 'sample')).toHaveLength(300);
  });

  it('2. origin = simulation nas DUAS camadas; artefato sem origin é recusado alto', () => {
    const acquisition = records[0] as AcquisitionRecord;
    expect(acquisition.origin).toBe('simulation');
    expect(acquisition.telemetry.metadata.origin).toBe('simulation');

    const tamperedHeader = clone(records);
    (tamperedHeader[0] as { origin: string }).origin = 'hardware';
    expect(() => payloadFromRecords(tamperedHeader)).toThrow(/origin = simulation/);

    const tamperedMetadata = clone(records);
    ((tamperedMetadata[0] as AcquisitionRecord).telemetry.metadata as { origin: string }).origin =
      'production';
    expect(() => payloadFromRecords(tamperedMetadata)).toThrow(/origin = simulation/);
  });

  it('3. nenhum segredo no artefato; campo fora do contrato do formato é rejeitado', () => {
    expect(jsonl).not.toMatch(/password|secret|authorization|bearer|token/i);
    expect(jsonl).not.toMatch(/@dynamox\.local/);

    const smuggled = jsonl + '{"type":"sample","series":0,"timestamp":"x","value":1,"extra":1}\n';
    expect(() => parseProvenance(smuggled)).toThrow(/campo inesperado "extra"/);
    expect(() => parseProvenance(jsonl + '{"type":"mystery"}\n')).toThrow(/desconhecido/);
  });
});

describe('F8 — preservação campo a campo (critérios 4–7)', () => {
  const samples = records.filter((r): r is SampleRecord => r.type === 'sample');
  const original = cycle.payload.telemetryCycleData;

  it('4. timestamps preservados: 60 por série, conjunto idêntico ao payload', () => {
    for (let index = 0; index < 5; index += 1) {
      const ofSeries = samples.filter((s) => s.series === index).map((s) => s.timestamp);
      expect(ofSeries).toHaveLength(60);
      expect(new Set(ofSeries)).toEqual(
        new Set(original.measurements[index].dataPoints.map((p) => p.timestamp)),
      );
    }
  });

  it('5–6. unidades e eixos preservados na ordem canônica das séries', () => {
    const attrs = records
      .filter((r) => r.type === 'series')
      .map((r) => (r as { attributes: { unit: string; axis?: string } }).attributes);
    expect(attrs.map((a) => a.unit)).toEqual(['g', 'g', 'g', 'degC', 'rpm']);
    expect(attrs.map((a) => a.axis)).toEqual(['x', 'y', 'z', undefined, undefined]);
  });

  it('7. valores preservados exatamente: payload reconstruído == payload original', () => {
    const { payload } = payloadFromRecords(parseProvenance(jsonl));
    expect(payload).toEqual(cycle.payload);
  });
});

describe('F8 — identidade semântica (critérios 9–10)', () => {
  it('9. o payload reconstruído valida no Ajv REAL; corrupção falha alto', () => {
    const { payload } = payloadFromRecords(records);
    expect(computePayloadFingerprint(payload)).toBeDefined();

    const corrupted = clone(records);
    const sample = corrupted.find((r) => r.type === 'sample') as { value: unknown };
    sample.value = 'not-a-number';
    expect(() => payloadFromRecords(corrupted as ProvenanceRecord[])).toThrow(/contrato real/);
  });

  it('10. fingerprint recomputado do reconstruído == fingerprint original; valor adulterado diverge', () => {
    const { payload } = payloadFromRecords(parseProvenance(jsonl));
    expect(computePayloadFingerprint(payload)).toBe(cycle.fingerprint);

    const tampered = clone(records);
    const sample = tampered.find((r) => r.type === 'sample') as SampleRecord;
    sample.value += 0.000001;
    const { payload: tamperedPayload } = payloadFromRecords(tampered);
    expect(computePayloadFingerprint(tamperedPayload)).not.toBe(cycle.fingerprint);
  });
});

describe('F8 — plano de tópicos derivado da identidade', () => {
  it('máquinas Pump/Fan geram tópicos mínimos e determinísticos', () => {
    expect(rosTopicPlan('P-101', 'Pump', 'SIM-HF-002')).toEqual({
      sensorNamespace: 'sensors/sim_hf_002',
      machineTopic: 'pump_p101',
      frameId: 'sim_hf_002',
    });
    expect(rosTopicPlan('VE-201 — Ventilador de tiragem', 'Fan', 'SIM-TCAG-001')).toEqual({
      sensorNamespace: 'sensors/sim_tcag_001',
      machineTopic: 'fan_ve201',
      frameId: 'sim_tcag_001',
    });
  });
});
