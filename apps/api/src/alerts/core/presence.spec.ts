import { ALERT_POLICY_V1_RULES } from '@dynamox/domain';

import { type PresencePoint, sweepPresence } from './presence';
import type { RuleParams } from './types';

const INTERVAL_MS = 900_000;
const NOW = Date.parse('2026-08-16T04:00:00.000Z');

const definition = ALERT_POLICY_V1_RULES.find((rule) => rule.key === 'telemetry-presence');
if (!definition) throw new Error('regra telemetry-presence ausente na política v1');
const PRESENCE: RuleParams = { id: 'rule-presence', family: 'data-quality', ...definition };

function fleet(count: number, lastSeenAtMs: number | ((index: number) => number)): PresencePoint[] {
  return Array.from({ length: count }, (_, index) => ({
    monitoringPointId: `point-${index}`,
    sensorId: `sensor-${index}`,
    lastSeenAtMs: typeof lastSeenAtMs === 'function' ? lastSeenAtMs(index) : lastSeenAtMs,
    active: null,
  }));
}

const kinds = (sweep: ReturnType<typeof sweepPresence>) => sweep.points.map((point) => point.decision.kind);

describe('sweepPresence — silêncio por ponto', () => {
  it('ponto que reportou há exatamente 4 intervalos ainda não está mudo; 1 ms além, está', () => {
    const boundary = fleet(2, NOW - 4 * INTERVAL_MS);
    expect(kinds(sweepPresence(PRESENCE, boundary, null, NOW))).toEqual(['none', 'none']);
    const beyond = fleet(2, NOW - 4 * INTERVAL_MS - 1);
    beyond[1].lastSeenAtMs = NOW; // só um dos dois mudo: não colapsa
    expect(kinds(sweepPresence(PRESENCE, beyond, null, NOW))).toEqual(['open', 'none']);
  });

  it('abre A1 entre 4 e 96 intervalos e A2 a partir de 96 (24 h)', () => {
    const points = fleet(6, NOW); // 2 de 6 mudos: abaixo da fração de colapso
    points[0].lastSeenAtMs = NOW - 10 * INTERVAL_MS;
    points[1].lastSeenAtMs = NOW - 96 * INTERVAL_MS;
    const sweep = sweepPresence(PRESENCE, points, null, NOW);
    expect(sweep.points[0].decision).toMatchObject({ kind: 'open', level: 'A1', elapsedIntervals: 10 });
    expect(sweep.points[1].decision).toMatchObject({ kind: 'open', level: 'A2', elapsedIntervals: 96 });
    expect(kinds(sweep).slice(2)).toEqual(['none', 'none', 'none', 'none']);
    expect(sweep.fleet).toEqual({ kind: 'none' });
  });

  it('escala um SENSOR_SILENT A1 quando o silêncio cruza 96 intervalos', () => {
    const points = fleet(3, NOW);
    points[0].lastSeenAtMs = NOW - 100 * INTERVAL_MS;
    points[0].active = { id: 'ep', level: 'A1', acknowledgedAtMs: null, peakMeasure: 95 };
    const sweep = sweepPresence(PRESENCE, points, null, NOW);
    expect(sweep.points[0].decision).toMatchObject({ kind: 'escalate', toLevel: 'A2' });
  });

  it('resolve o episódio de um ponto que voltou a reportar', () => {
    const points = fleet(2, NOW);
    points[0].active = { id: 'ep', level: 'A2', acknowledgedAtMs: null, peakMeasure: 200 };
    expect(sweepPresence(PRESENCE, points, null, NOW).points[0].decision).toEqual({ kind: 'resolve' });
  });
});

describe('sweepPresence — colapso de frota', () => {
  it('12/12 mudos → UM FLEET_SILENT, nenhum alerta por ponto', () => {
    const stoppedAt = NOW - 6 * INTERVAL_MS;
    const points = fleet(12, (index) => stoppedAt + index * 30_000); // dentro de um intervalo
    const sweep = sweepPresence(PRESENCE, points, null, NOW);
    expect(sweep.fleet).toMatchObject({ kind: 'open', level: 'A1', affectedCount: 12 });
    expect(kinds(sweep)).toEqual(Array.from({ length: 12 }, () => 'none'));
  });

  it('1/12 mudo é um sensor, não a planta', () => {
    const points = fleet(12, NOW);
    points[3].lastSeenAtMs = NOW - 8 * INTERVAL_MS;
    const sweep = sweepPresence(PRESENCE, points, null, NOW);
    expect(sweep.fleet).toEqual({ kind: 'none' });
    expect(sweep.points[3].decision).toMatchObject({ kind: 'open', level: 'A1' });
  });

  it('7/12 mudos em momentos diferentes (desligamento máquina a máquina) ainda é a planta', () => {
    const points = fleet(12, NOW);
    for (let index = 0; index < 7; index += 1) points[index].lastSeenAtMs = NOW - (5 + index * 8) * INTERVAL_MS;
    const sweep = sweepPresence(PRESENCE, points, null, NOW);
    // "Desde" é a última leitura que calou — o momento em que a planta ficou sem telemetria.
    expect(sweep.fleet).toMatchObject({ kind: 'open', affectedCount: 7, silentSinceMs: NOW - 5 * INTERVAL_MS });
    expect(kinds(sweep).filter((kind) => kind === 'open')).toHaveLength(0);
  });

  it('sensores que morreram um a um (cada um com episódio próprio) não viram planta muda no sétimo', () => {
    const points = fleet(12, NOW);
    for (let index = 0; index < 6; index += 1) {
      points[index].lastSeenAtMs = NOW - (200 + index) * INTERVAL_MS;
      points[index].active = { id: `ep-${index}`, level: 'A2', acknowledgedAtMs: null, peakMeasure: 199 };
    }
    points[6].lastSeenAtMs = NOW - 5 * INTERVAL_MS;
    const sweep = sweepPresence(PRESENCE, points, null, NOW);
    expect(sweep.fleet).toEqual({ kind: 'none' });
    expect(sweep.points[6].decision).toMatchObject({ kind: 'open', level: 'A1' });
  });

  it('exatamente metade (6/12) não é "mais que a fração": sem colapso', () => {
    const stoppedAt = NOW - 6 * INTERVAL_MS;
    const points = fleet(12, NOW);
    for (let index = 0; index < 6; index += 1) points[index].lastSeenAtMs = stoppedAt;
    expect(sweepPresence(PRESENCE, points, null, NOW).fleet).toEqual({ kind: 'none' });
  });

  it('um SENSOR_SILENT antigo não impede reconhecer a parada de hoje e é preservado', () => {
    const stoppedAt = NOW - 6 * INTERVAL_MS;
    const points = fleet(12, stoppedAt);
    points[0].lastSeenAtMs = NOW - 3 * 96 * INTERVAL_MS; // mudo há 3 dias
    points[0].active = { id: 'ep-old', level: 'A2', acknowledgedAtMs: null, peakMeasure: 250 };
    const sweep = sweepPresence(PRESENCE, points, null, NOW);
    expect(sweep.fleet).toMatchObject({ kind: 'open', affectedCount: 11 });
    expect(sweep.points[0].decision).toEqual({ kind: 'none' });
  });

  it('FLEET_SILENT escala para A2 após 24 h e resolve quando a fração cai', () => {
    const stoppedAt = NOW - 97 * INTERVAL_MS;
    const points = fleet(12, stoppedAt);
    const activeFleet = { id: 'fleet', level: 'A1' as const, acknowledgedAtMs: null, peakMeasure: 50 };
    expect(sweepPresence(PRESENCE, points, activeFleet, NOW).fleet).toMatchObject({ kind: 'update', level: 'A2', escalate: true });

    const resumed = fleet(12, NOW);
    resumed[0].lastSeenAtMs = stoppedAt;
    const after = sweepPresence(PRESENCE, resumed, activeFleet, NOW);
    expect(after.fleet).toEqual({ kind: 'resolve' });
    // O retardatário passa a ser um caso individual.
    expect(after.points[0].decision).toMatchObject({ kind: 'open', level: 'A2' });
  });

  it('frota de um ponto só nunca colapsa', () => {
    const sweep = sweepPresence(PRESENCE, fleet(1, NOW - 10 * INTERVAL_MS), null, NOW);
    expect(sweep.fleet).toEqual({ kind: 'none' });
    expect(sweep.points[0].decision).toMatchObject({ kind: 'open' });
  });
});
