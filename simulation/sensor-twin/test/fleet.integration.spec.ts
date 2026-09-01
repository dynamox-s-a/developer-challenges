/**
 * Integração F4–F6: snapshots da frota, assessment por dados persistidos e loop
 * deliberativo — tudo contra a API/PostgreSQL reais. Roda só via twin:integration.
 *
 * Idempotente por design (re-execuções não criam dados novos); as asserções nunca
 * dependem de totais globais do banco — somente das janelas e identidades da planta.
 */
import { SYNTHETIC_ATTENTION_RATIO, assessFleet } from '../src/assess';
import { ensurePlant, type PlantBootstrapResult } from '../src/bootstrap';
import { deliberate } from '../src/deliberate';
import { buildFleetCycles, runFleetPhase } from '../src/fleet';
import { fetchAllSamples, fetchSeries, loadTwinConfig, login, type TwinApiConfig } from '../src/ingest';
import { PLANT, plantSensors } from '../src/plant';

describe('F4–F6 — snapshots, assessment e deliberação contra a API real', () => {
  let config: TwinApiConfig;
  let token: string;
  let bootstrap: PlantBootstrapResult;

  beforeAll(async () => {
    config = loadTwinConfig();
    token = await login(config);
    bootstrap = await ensurePlant(config, token, PLANT);
  }, 60000);

  it('1–5. baseline e condition ingerem 12 ciclos cada; replays são 100% duplicate', async () => {
    for (const phase of ['baseline', 'condition'] as const) {
      const first = await runFleetPhase(config, token, PLANT, phase, bootstrap.resourceIds);
      expect(first).toHaveLength(12);
      for (const r of first) {
        expect([200, 201]).toContain(r.status);
        expect(r.body.duplicate).toBe(r.status === 200);
        expect(r.body.sampleCount).toBe(300);
      }

      const replay = await runFleetPhase(config, token, PLANT, phase, bootstrap.resourceIds);
      expect(replay.every((r) => r.status === 200 && r.body.duplicate)).toBe(true);
      // Mesmos artefatos: fingerprints do replay batem 1:1 com os da primeira rodada.
      expect(replay.map((r) => r.body.payloadFingerprint)).toEqual(
        first.map((r) => r.body.payloadFingerprint),
      );
    }
  }, 120000);

  it('as 60 séries da frota existem e cada janela tem exatamente 60 amostras por série radial', async () => {
    const series = await fetchSeries(config, token);
    const fleetSeries = series.filter((s) =>
      plantSensors().some((p) => p.sensorSerial === s.sensorSerialNumber),
    );
    // 12 sensores × 5 identidades de métrica = 60; snapshots reutilizam, não recriam.
    expect(fleetSeries).toHaveLength(60);

    const inWindow = (samples: Array<{ timestamp: string }>, start: string) => {
      const end = new Date(Date.parse(start) + 59_000).toISOString();
      return samples.filter((s) => s.timestamp >= start && s.timestamp <= end).length;
    };

    for (const sensor of plantSensors()) {
      const ySeries = fleetSeries.find(
        (s) =>
          s.sensorSerialNumber === sensor.sensorSerial &&
          s.physicalQuantity === 'acceleration' &&
          s.axis === 'y',
      )!;
      const samples = await fetchAllSamples(config, token, ySeries.id);
      expect(inWindow(samples, PLANT.windows.baseline)).toBe(60);
      expect(inWindow(samples, PLANT.windows.condition)).toBe(60);
    }
  }, 120000);

  it('6–8. assess observa os 12 sensores e seleciona o alvo PELOS DADOS (SUSPECT)', async () => {
    const assessment = await assessFleet(config, token, PLANT);

    expect(assessment.sensors).toHaveLength(12);
    expect(assessment.sensors.filter((s) => s.state === 'STABLE')).toHaveLength(11);
    expect(assessment.sensors.filter((s) => s.state === 'SUSPECT')).toHaveLength(1);

    expect(assessment.ranked[0].sensorSerial).toBe(PLANT.conditionTarget.sensorSerial);
    expect(assessment.ranked[0].deviationRatio).toBeGreaterThan(3);
    expect(assessment.ranked[1].deviationRatio).toBeLessThan(1.1);
    expect(assessment.selected?.state).toBe('SUSPECT');
    expect(assessment.selectedAction).toBe('CONFIRM_ACQUISITION');
  }, 120000);

  it('9–12. deliberate age: confirmação própria, re-observação e CONFIRMED_ATTENTION', async () => {
    const result = await deliberate(config, token, PLANT, bootstrap.resourceIds);

    expect(result.action).toBe('CONFIRM_ACQUISITION');
    expect(result.confirmation).not.toBeNull();
    const confirmation = result.confirmation!;

    // 10. a confirmação é artefato PRÓPRIO: fingerprint difere do ciclo de condition.
    const conditionTarget = buildFleetCycles(PLANT, 'condition', bootstrap.resourceIds).find(
      (c) => c.identity.sensorSerial === PLANT.conditionTarget.sensorSerial,
    )!;
    expect(confirmation.fingerprint).not.toBe(conditionTarget.fingerprint);

    // 11–12. razão re-observada pelo banco acima do limiar ⇒ transição confirmada.
    expect(confirmation.confirmRatio).toBeGreaterThanOrEqual(SYNTHETIC_ATTENTION_RATIO);
    expect(result.finalState).toBe('CONFIRMED_ATTENTION');
    expect(result.recommendation).toMatch(/Prioritize inspection/);
    expect(result.recommendation).not.toMatch(/bearing|failure|RUL|diagnos/i);
  }, 120000);

  it('13–14. segundo deliberate: mesma conclusão, nenhum crescimento indevido', async () => {
    const seriesBefore = await fetchSeries(config, token);
    const countsBefore = new Map(
      seriesBefore
        .filter((s) => plantSensors().some((p) => p.sensorSerial === s.sensorSerialNumber))
        .map((s) => [s.id, s.sampleCount]),
    );

    const second = await deliberate(config, token, PLANT, bootstrap.resourceIds);

    // Replay do MESMO artefato confirmatório canônico é aceitável (duplicate); a
    // conclusão continua nascendo do banco e é idêntica.
    expect(second.confirmation?.ingestDuplicate).toBe(true);
    expect(second.finalState).toBe('CONFIRMED_ATTENTION');
    expect(second.assessment.ranked[0].sensorSerial).toBe(PLANT.conditionTarget.sensorSerial);
    expect(second.assessment.ranked.map((s) => s.sensorSerial)).toEqual(
      (await assessFleet(config, token, PLANT)).ranked.map((s) => s.sensorSerial),
    );

    const seriesAfter = await fetchSeries(config, token);
    const fleetAfter = seriesAfter.filter((s) =>
      plantSensors().some((p) => p.sensorSerial === s.sensorSerialNumber),
    );
    // Nem contagens crescem, NEM séries novas aparecem (conjunto idêntico de ids).
    expect(new Set(fleetAfter.map((s) => s.id))).toEqual(new Set(countsBefore.keys()));
    for (const s of fleetAfter) {
      expect(s.sampleCount).toBe(countsBefore.get(s.id));
    }
  }, 120000);
});
