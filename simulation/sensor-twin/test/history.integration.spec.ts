/**
 * Integração do histórico contra a API viva (npm run twin:integration).
 * Faixa FIXA e disjunta de qualquer execução padrão (época 2026-06-01, uma segunda-feira),
 * um sensor, 24 ciclos: prova que o driver cria pelo contrato, que reexecutar é 100 %
 * duplicate e que nada toca as janelas da planta.
 */
import { demoAnchorMs } from '@dynamox/contracts';

import { resolveResourceIds } from '../src/bootstrap';
import { buildHistoryCycle } from '../src/history/build';
import { runHistory } from '../src/history/driver';
import { NARRATIVE } from '../src/history/narrative';
import { assertOutsideReservedWindows, buildHistorySchedule, resolveRange } from '../src/history/schedule';
import { fetchSamples, fetchSeries, loadTwinConfig, login, tryIngestPayload } from '../src/ingest';
import { PLANT, plantSensors } from '../src/plant';

const SERIAL = 'SIM-HF-003';
const EPOCH = Date.parse('2026-06-01T00:00:00.000Z');
const LIMIT = 24;

describe('histórico sintético — fatia de integração', () => {
  const config = loadTwinConfig();
  let token = '';
  const sensor = plantSensors(PLANT).find((s) => s.sensorSerial === SERIAL)!;

  beforeAll(async () => {
    token = await login(config);
  });

  async function run() {
    const resourceIds = await resolveResourceIds(config, token, PLANT);
    const anchorMs = demoAnchorMs();
    const range = resolveRange({ anchorMs, days: 1, everyMinutes: 15, untilOffsetHours: 4, epochMs: EPOCH, toMs: EPOCH + 86_400_000 });
    const schedule = buildHistorySchedule(range, NARRATIVE, [sensor]);
    assertOutsideReservedWindows(schedule, anchorMs);
    return runHistory(schedule, [sensor], resourceIds, {
      generate: async (job) => buildHistoryCycle(job),
      post: (cycle) => tryIngestPayload(config, token, cycle.body, cycle.idempotencyKey, { timeoutMs: 60_000 }),
      reauth: async () => {
        token = await login(config);
      },
      now: () => Date.now(),
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      log: () => undefined,
    }, { concurrency: 3, retries: 2, limit: LIMIT, progressEveryMs: 60_000 });
  }

  it('cria pelo contrato e reexecutar devolve só duplicatas, sem tocar as janelas da planta', async () => {
    const seriesBefore = (await fetchSeries(config, token)).filter((s) => s.sensorSerialNumber === SERIAL);
    const first = await run();
    expect(first.aborted).toBeUndefined();
    expect(first.totals.failed).toBe(0);
    expect(first.totals.created + first.totals.duplicate).toBe(LIMIT);

    const second = await run();
    expect(second.totals).toMatchObject({ created: 0, duplicate: LIMIT, failed: 0 });

    const seriesAfter = (await fetchSeries(config, token)).filter((s) => s.sensorSerialNumber === SERIAL);
    expect(seriesAfter).toHaveLength(seriesBefore.length === 0 ? 5 : seriesBefore.length);
    const y = seriesAfter.find((s) => s.physicalQuantity === 'acceleration' && s.axis === 'y')!;
    const page = await fetchSamples(config, token, y.id, { limit: 5000, offset: 0 });
    const inRange = page.items.filter((s) => s.timestamp >= '2026-06-01T00:00:00.000Z' && s.timestamp < '2026-06-02T00:00:00.000Z');
    expect(inRange.length).toBe(LIMIT * 60);
    expect(inRange.every((s) => new Date(s.timestamp).getUTCMinutes() % 15 === 3)).toBe(true); // P-102 acorda em :03
    const inPlantWindow = page.items.filter((s) => s.timestamp >= PLANT.windows.baseline && s.timestamp < new Date(Date.parse(PLANT.windows.baseline) + 60_000).toISOString());
    expect(inPlantWindow.length === 0 || inPlantWindow.length === 60).toBe(true);
  }, 120_000);
});
