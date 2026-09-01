/**
 * Integração end-to-end do gêmeo contra a API REAL (B4). Exige a infraestrutura local
 * no ar (npm run db:up && npm run dev:api) e roda SOMENTE via `npm run twin:integration`
 * — nunca no `npm run test` convencional.
 *
 * Sobre limpeza (§11): este teste NÃO cria fixtures descartáveis — ele ingere os DOIS
 * ciclos canônicos do gêmeo (30/08 09:00 e 10:00), que são exatamente o dado de
 * demonstração previsto no plano e ficam no banco de propósito. O design é idempotente:
 * na primeira execução em banco limpo o POST devolve 201; nas seguintes, 200
 * duplicate:true — e as contagens provadamente não mudam. Nada do seed é tocado e
 * nenhuma série é excluída (as séries de aceleração/temperatura são compartilhadas com
 * o seed; apagá-las destruiria dados que não pertencem ao teste).
 */
import {
  fetchAllSamples,
  fetchSeries,
  ingestCycle,
  loadTwinConfig,
  login,
  type TwinApiConfig,
} from '../src/ingest';
import { buildCycle, type BuiltCycle } from '../src/payload';
import { TWIN_IDENTITY } from '../src/scenarios';

describe('BON-06 — vertical slice real: sensor sintético → API → PostgreSQL → leitura', () => {
  let config: TwinApiConfig;
  let token: string;
  let normal: BuiltCycle;
  let imbalance: BuiltCycle;

  const twinSeries = async () =>
    (await fetchSeries(config, token)).filter(
      (series) => series.sensorSerialNumber === TWIN_IDENTITY.sensorSerial,
    );

  beforeAll(async () => {
    config = loadTwinConfig();
    normal = buildCycle('normal');
    imbalance = buildCycle('imbalance');
    // 1. login real — falha aqui aborta a suíte com mensagem útil do cliente.
    token = await login(config);
  });

  it('2. ingere o ciclo NORMAL (aquisição nova em banco limpo; repetição legítima depois)', async () => {
    const { status, body } = await ingestCycle(config, token, normal);

    expect([200, 201]).toContain(status);
    expect(body.duplicate).toBe(status === 200);
    expect(body.payloadFingerprint).toBe(normal.fingerprint);
    expect(body.idempotencyKey).toBe(normal.idempotencyKey);
    expect(body.measurementCount).toBe(5);
    expect(body.sampleCount).toBe(300);
    expect(body.timeSeriesIds).toHaveLength(5);
  });

  it('3. a persistência é legível de volta pela própria API, com os timestamps do ciclo', async () => {
    const series = await twinSeries();
    const accelerationY = series.find((s) => s.physicalQuantity === 'acceleration' && s.axis === 'y');
    const rotational = series.find((s) => s.physicalQuantity === 'rotationalSpeed');
    expect(accelerationY).toBeDefined();
    expect(rotational).toBeDefined();
    expect(rotational!.unit).toBe('rpm');

    const windowStart = normal.payload.telemetryCycleData.measurements[1].dataPoints[0];
    const samples = await fetchAllSamples(config, token, accelerationY!.id);
    const persisted = samples.find((s) => s.timestamp === windowStart.timestamp);
    expect(persisted).toBeDefined();
    // O valor lido de volta é EXATAMENTE o RMS de 6 casas enviado.
    expect(persisted!.value).toBe(windowStart.value);

    const inCycle = samples.filter(
      (s) =>
        s.timestamp >= windowStart.timestamp &&
        s.timestamp <= normal.payload.telemetryCycleData.measurements[1].dataPoints[59].timestamp,
    );
    expect(inCycle).toHaveLength(60);
  });

  it('4–5. replay NORMAL: duplicate:true, mesmo resultado, contagens intactas', async () => {
    const before = await twinSeries();
    const countsBefore = new Map(before.map((s) => [s.id, s.sampleCount]));

    const first = await ingestCycle(config, token, normal);
    const replay = await ingestCycle(config, token, normal);

    expect(replay.status).toBe(200);
    expect(replay.body.duplicate).toBe(true);
    expect(replay.body.cycleId).toBe(first.body.cycleId);
    expect(replay.body.payloadFingerprint).toBe(normal.fingerprint);

    const after = await twinSeries();
    expect(after).toHaveLength(before.length);
    for (const series of after) {
      expect(series.sampleCount).toBe(countsBefore.get(series.id));
    }
  });

  it('6–7. IMBALANCE persiste como ciclo próprio, distinguível do NORMAL', async () => {
    const { body } = await ingestCycle(config, token, imbalance);

    expect(body.payloadFingerprint).toBe(imbalance.fingerprint);
    expect(body.payloadFingerprint).not.toBe(normal.fingerprint);
    expect(body.idempotencyKey).not.toBe(normal.idempotencyKey);

    // Os dois períodos são recuperáveis e carregam assinaturas diferentes (≥ 2× no RMS).
    const series = await twinSeries();
    const accelerationY = series.find((s) => s.physicalQuantity === 'acceleration' && s.axis === 'y')!;
    const samples = await fetchAllSamples(config, token, accelerationY.id);

    const meanIn = (cycle: BuiltCycle) => {
      const points = cycle.payload.telemetryCycleData.measurements[1].dataPoints;
      const start = points[0].timestamp;
      const end = points[points.length - 1].timestamp;
      const values = samples
        .filter((s) => s.timestamp >= start && s.timestamp <= end)
        .map((s) => s.value);
      expect(values).toHaveLength(60);
      return values.reduce((sum, v) => sum + v, 0) / values.length;
    };

    expect(meanIn(imbalance) / meanIn(normal)).toBeGreaterThanOrEqual(2);
  });

  it('8. erro HTTP interrompe o fluxo com mensagem útil (senha errada nunca ingere)', async () => {
    await expect(
      login({ ...config, password: 'senha-errada-de-proposito' }),
    ).rejects.toThrow(/Credencial inválida/);
  });

  it('reuso da chave com conteúdo DIFERENTE é recusado pela API (409), não aceito em silêncio', async () => {
    const tampered: BuiltCycle = {
      ...buildCycle('normal', { seed: 4242 }),
      idempotencyKey: normal.idempotencyKey,
    };
    let failure: Error | null = null;
    try {
      await ingestCycle(config, token, tampered);
    } catch (error) {
      failure = error as Error;
    }
    expect(failure).not.toBeNull();
    expect(failure!.message).toMatch(/HTTP 409/);
    expect(failure!.message).toMatch(/IDEMPOTENCY_KEY_REUSED/);
  });
});
