/**
 * Integração F8 — round-trip REAL pelo rosbag + replay pela API viva (critérios 8, 10,
 * 11 e 12 da fase). Roda SOMENTE via npm run twin:ros: requer a API local no ar E o
 * runtime ROS Noetic instalado. A suíte convencional (npm run test) não passa por aqui.
 *
 * A distinção arquitetural sob prova: a CONFIRMAÇÃO (F6) foi uma aquisição nova
 * (HTTP 201, seed e fingerprint próprios); o replay do bag REPRODUZ aquela aquisição —
 * mesmo payloadFingerprint, duplicate:true, zero amostras novas.
 */
import { mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { computePayloadFingerprint, canonicalJson } from '@dynamox/contracts';

import { assessFleet } from '../src/assess';
import { resolveResourceIds } from '../src/bootstrap';
import { buildConfirmatoryCycle } from '../src/fleet';
import {
  fetchSeries,
  ingestPayload,
  loadTwinConfig,
  login,
  type SeriesSummary,
  type TwinApiConfig,
} from '../src/ingest';
import { PLANT, plantSensors } from '../src/plant';
import {
  acquisitionRecords,
  parseProvenance,
  payloadFromRecords,
  type ProvenanceRecord,
} from '../src/provenance';
import { ROS_REQUIREMENTS, rosAvailable, runRosBridge, type BridgeStats } from '../src/rosbridge';
import type { BuiltCycle } from '../src/payload';

const fleetSerials = new Set(plantSensors().map((s) => s.sensorSerial));
const fleetOnly = (series: SeriesSummary[]) =>
  series.filter((s) => fleetSerials.has(s.sensorSerialNumber));

describe('F8 — proveniência ROS da aquisição confirmatória (API + rosbag reais)', () => {
  let config: TwinApiConfig;
  let token: string;
  let cycle: BuiltCycle;
  let records: ProvenanceRecord[];
  let reconstructed: ProvenanceRecord[];
  let toBagStats: BridgeStats;
  let fromBagStats: BridgeStats;
  let bagBytes: number;
  let seriesBefore: SeriesSummary[];

  beforeAll(async () => {
    if (!rosAvailable()) {
      throw new Error(`Runtime ROS indisponível para twin:ros. ${ROS_REQUIREMENTS}`);
    }
    config = loadTwinConfig();
    token = await login(config);

    // O alvo NUNCA é hardcoded aqui: vem do assessment observacional do supervisor.
    const assessment = await assessFleet(config, token, PLANT);
    if (!assessment.selected) {
      throw new Error('Nenhum sensor acima do limiar — rode os snapshots da planta antes do twin:ros.');
    }
    const serial = assessment.selected.sensorSerial;
    const sensor = plantSensors().find((s) => s.sensorSerial === serial)!;

    const resourceIds = await resolveResourceIds(config, token, PLANT);
    cycle = buildConfirmatoryCycle(PLANT, resourceIds, serial);
    records = acquisitionRecords(cycle, sensor.machineType);

    const dir = mkdtempSync(join(tmpdir(), 'twin-rosbag-'));
    const jsonlPath = join(dir, 'confirm.jsonl');
    const bagPath = join(dir, 'confirm.bag');
    const backPath = join(dir, 'confirm.reconstructed.jsonl');

    writeFileSync(jsonlPath, records.map((r) => canonicalJson(r)).join('\n') + '\n', 'utf8');
    toBagStats = runRosBridge('to-bag', jsonlPath, bagPath);
    bagBytes = statSync(bagPath).size;
    fromBagStats = runRosBridge('from-bag', bagPath, backPath);
    reconstructed = parseProvenance(readFileSync(backPath, 'utf8'));

    seriesBefore = fleetOnly(await fetchSeries(config, token));
  }, 120000);

  it('8. o bag preserva TODAS as observações: registros canônicos idênticos 1:1', () => {
    expect(reconstructed).toHaveLength(records.length);
    const original = records.map((r) => canonicalJson(r));
    const roundTripped = reconstructed.map((r) => canonicalJson(r));
    expect(roundTripped).toEqual(original);
  });

  it('bag mínimo e auditável: 181 mensagens em exatamente 4 tópicos, tamanho sano', () => {
    // 1 provenance + 60 Imu + 60 Temperature + 60 Float64 (rpm).
    expect(toBagStats.messages).toBe(181);
    expect(fromBagStats.messages).toBe(181);
    const ns = `/sensors/${cycle.identity.sensorSerial.toLowerCase().replace(/-/g, '_')}`;
    expect(toBagStats.topics.sort()).toEqual(
      ['/pump_p101/rpm', `${ns}/imu`, `${ns}/provenance`, `${ns}/temperature`].sort(),
    );
    expect(bagBytes).toBeGreaterThan(0);
    expect(bagBytes).toBeLessThan(1_000_000);
  });

  it('10. identidade semântica: fingerprint recomputado do payload do bag == original', () => {
    const { payload, acquisition } = payloadFromRecords(reconstructed);
    expect(acquisition.telemetry.metadata.origin).toBe('simulation');
    expect(computePayloadFingerprint(payload)).toBe(cycle.fingerprint);
  });

  it('11. replay do payload reconstruído na API: duplicate:true com o mesmo fingerprint', async () => {
    const { payload, acquisition } = payloadFromRecords(reconstructed);
    expect(acquisition.telemetry.metadata.cycleId).toBe(cycle.idempotencyKey);

    const replay = await ingestPayload(config, token, payload, cycle.idempotencyKey);
    expect(replay.status).toBe(200);
    expect(replay.body.duplicate).toBe(true);
    expect(replay.body.payloadFingerprint).toBe(cycle.fingerprint);
  }, 60000);

  it('12. o replay não criou NENHUMA amostra: séries e contagens idênticas', async () => {
    const seriesAfter = fleetOnly(await fetchSeries(config, token));
    expect(new Set(seriesAfter.map((s) => s.id))).toEqual(new Set(seriesBefore.map((s) => s.id)));
    for (const series of seriesAfter) {
      expect(series.sampleCount).toBe(seriesBefore.find((b) => b.id === series.id)?.sampleCount);
    }
  }, 60000);
});
