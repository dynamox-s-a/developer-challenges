/**
 * Testes de integração do TS-06. Exigem o PostgreSQL local do docker-compose com as
 * migrações aplicadas: `npm run db:up && npm run prisma:deploy`.
 */
import { randomBytes, scryptSync } from 'node:crypto';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { deterministicResourceId, type TelemetryCyclePayload } from '@dynamox/contracts';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const MACHINE_NAME = 'P-101-E2E';
const MONITORING_POINT_NAME = 'Mancal E2E';
const SENSOR_SERIAL = 'E2E-HF-001';

const RESOURCE_ID = deterministicResourceId(
  'dynamox-challenge',
  'monitoring-point',
  MACHINE_NAME,
  MONITORING_POINT_NAME,
);

function buildPayload(): TelemetryCyclePayload {
  return {
    telemetryCycleData: {
      measuringSystemUniqueIdentifier: SENSOR_SERIAL,
      measuringSystemModel: { name: 'industrial-condition-sensor-sim', version: 1 },
      measurements: [
        {
          resourceId: RESOURCE_ID,
          attributes: { physicalQuantity: 'acceleration', axis: 'y', unit: 'g' },
          dataPoints: [
            { timestamp: '2026-08-26T12:00:00.000Z', value: 0.0204 },
            { timestamp: '2026-08-26T12:00:10.000Z', value: 0.0209 },
            { timestamp: '2026-08-26T12:00:20.000Z', value: 0.0201 },
          ],
        },
        {
          resourceId: RESOURCE_ID,
          attributes: { physicalQuantity: 'temperature', unit: 'degC' },
          dataPoints: [
            { timestamp: '2026-08-26T12:00:00.000Z', value: 38.4 },
            { timestamp: '2026-08-26T12:00:10.000Z', value: 38.6 },
          ],
        },
      ],
      metadata: {
        origin: 'simulation',
        generator: { name: 'industrial-condition-sensor-sim', version: '0.1.0' },
        profile: 'HF+',
        cycleId: 'e2e-cycle-0001',
        synthetic: true,
      },
      tags: ['simulated', 'e2e'],
    },
    configuration: {
      monitoringLocationMap: [{ mapLabel: MONITORING_POINT_NAME, mapValue: RESOURCE_ID }],
      rpm: 1750,
      scenario: 'normal',
      seed: 20260826,
    },
  };
}

/** Desloca a janela para produzir um ciclo com conteúdo novo, sem colidir com o anterior. */
function shiftedPayload(offsetMinutes: number): TelemetryCyclePayload {
  const payload = buildPayload();
  for (const measurement of payload.telemetryCycleData.measurements) {
    for (const point of measurement.dataPoints) {
      const shifted = new Date(new Date(point.timestamp).getTime() + offsetMinutes * 60_000);
      point.timestamp = shifted.toISOString();
    }
  }
  payload.telemetryCycleData.metadata.cycleId = `e2e-cycle-${offsetMinutes}`;
  return payload;
}

const TOTAL_SAMPLES = buildPayload().telemetryCycleData.measurements.reduce(
  (total, measurement) => total + measurement.dataPoints.length,
  0,
);

describe('TS-06 — ingestão idempotente de ciclos de telemetria', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const http = () => request(app.getHttpServer());

  // Todas as rotas de telemetria agora exigem JWT (guard global do AUT-01).
  let bearer = '';
  const authed = {
    get: (url: string) => http().get(url).set('Authorization', bearer),
    post: (url: string) => http().post(url).set('Authorization', bearer),
    delete: (url: string) => http().delete(url).set('Authorization', bearer),
  };

  async function counts(): Promise<{ cycles: number; samples: number; series: number }> {
    const [cycles, samples, series] = await Promise.all([
      prisma.ingestionCycle.count({ where: { measuringSystemUid: SENSOR_SERIAL } }),
      prisma.timeSeriesSample.count(),
      prisma.timeSeries.count(),
    ]);
    return { cycles, samples, series };
  }

  async function removeFixtures(): Promise<void> {
    await prisma.ingestionCycle.deleteMany({ where: { measuringSystemUid: SENSOR_SERIAL } });
    await prisma.sensor.deleteMany({ where: { serialNumber: SENSOR_SERIAL } });
    await prisma.machine.deleteMany({ where: { name: MACHINE_NAME } });
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get(PrismaService);
    await removeFixtures();

    const machine = await prisma.machine.create({ data: { name: MACHINE_NAME, type: 'PUMP' } });
    const point = await prisma.monitoringPoint.create({
      data: { name: MONITORING_POINT_NAME, machineId: machine.id, externalResourceId: RESOURCE_ID },
    });
    await prisma.sensor.create({
      data: { serialNumber: SENSOR_SERIAL, model: 'HF_PLUS', monitoringPointId: point.id },
    });

    const salt = randomBytes(16).toString('hex');
    await prisma.user.upsert({
      where: { email: 'telemetry-e2e@dynamox.local' },
      update: {},
      create: {
        email: 'telemetry-e2e@dynamox.local',
        name: 'Telemetria E2E',
        passwordHash: `scrypt$${salt}$${scryptSync('Senha-E2E@2026', salt, 64).toString('hex')}`,
        // Estas suítes exercitam mutações: o usuário de fixture precisa do perfil que as permite.
        role: 'ADMIN',
      },
    });
    const login = await http()
      .post('/api/auth/login')
      .send({ email: 'telemetry-e2e@dynamox.local', password: 'Senha-E2E@2026' })
      .expect(201);
    bearer = `Bearer ${login.body.token}`;
  });

  afterAll(async () => {
    await removeFixtures();
    await prisma.user.deleteMany({ where: { email: 'telemetry-e2e@dynamox.local' } });
    await app.close();
  });

  it('GET /api/health responde com o banco disponível', async () => {
    const response = await http().get('/api/health').expect(200);
    expect(response.body).toEqual(expect.objectContaining({ status: 'ok', database: 'up' }));
  });

  it('rejeita payload fora do contrato com 400 e lista de violações', async () => {
    const response = await authed
      .post('/api/telemetry-cycles')
      .send({ telemetryCycleData: { measuringSystemUniqueIdentifier: SENSOR_SERIAL } })
      .expect(400);

    expect(response.body.code).toBe('CONTRACT_VIOLATION');
    expect(response.body.violations?.length).toBeGreaterThan(0);
  });

  it('rejeita Idempotency-Key fora do formato seguro', async () => {
    const response = await authed
      .post('/api/telemetry-cycles')
      .set('Idempotency-Key', 'a'.repeat(129))
      .send(buildPayload())
      .expect(400);

    expect(response.body.code).toBe('INVALID_IDEMPOTENCY_KEY');
  });

  it('rejeita timestamp com precisão submilissegundo', async () => {
    const payload = buildPayload();
    payload.telemetryCycleData.measurements[0].dataPoints[0].timestamp =
      '2026-08-26T12:00:00.0001Z';

    const response = await authed.post('/api/telemetry-cycles').send(payload).expect(400);
    expect(response.body.code).toBe('CONTRACT_VIOLATION');
  });

  it('rejeita atomicamente payload com instante repetido na mesma série', async () => {
    const before = await counts();

    const payload = buildPayload();
    payload.telemetryCycleData.measurements[0].dataPoints.push({
      timestamp: '2026-08-26T12:00:10.000Z',
      value: 0.0777,
    });

    const response = await authed.post('/api/telemetry-cycles').send(payload).expect(409);
    expect(response.body.code).toBe('SAMPLE_TIMESTAMP_CONFLICT');

    expect(await counts()).toEqual(before);
  });

  it('rejeita grandeza escalar com eixo', async () => {
    const payload = buildPayload();
    payload.telemetryCycleData.measurements[1].attributes.axis = 'x';

    const response = await authed.post('/api/telemetry-cycles').send(payload).expect(422);
    expect(response.body.code).toBe('QUANTITY_AXIS_MISMATCH');
  });

  it('rejeita ciclo de sensor desconhecido com 404 e sem escrita parcial', async () => {
    const before = await counts();

    const payload = buildPayload();
    payload.telemetryCycleData.measuringSystemUniqueIdentifier = 'SENSOR-INEXISTENTE';

    const response = await authed
      .post('/api/telemetry-cycles')
      .set('Idempotency-Key', 'chave-sensor-inexistente')
      .send(payload)
      .expect(404);

    expect(response.body.code).toBe('SENSOR_NOT_FOUND');
    expect(await counts()).toEqual(before);
  });

  it('persiste o ciclo na primeira ingestão e devolve 201', async () => {
    const response = await authed
      .post('/api/telemetry-cycles')
      .set('Idempotency-Key', 'e2e-idempotency-key')
      .send(buildPayload())
      .expect(201);

    expect(response.body.duplicate).toBe(false);
    expect(response.body.measurementCount).toBe(2);
    expect(response.body.sampleCount).toBe(TOTAL_SAMPLES);
    expect(response.body.payloadFingerprint).toMatch(/^[0-9a-f]{64}$/);
    expect(response.body.timeSeriesIds).toHaveLength(2);

    const persisted = await prisma.timeSeriesSample.count({
      where: { ingestionCycleId: response.body.cycleId },
    });
    expect(persisted).toBe(TOTAL_SAMPLES);
  });

  it('mesma chave e mesmo payload: 200 duplicate:true com o resultado original', async () => {
    const before = await counts();

    const response = await authed
      .post('/api/telemetry-cycles')
      .set('Idempotency-Key', 'e2e-idempotency-key')
      .send(buildPayload())
      .expect(200);

    expect(response.body.duplicate).toBe(true);
    expect(response.body.sampleCount).toBe(TOTAL_SAMPLES);
    expect(response.body.timeSeriesIds).toHaveLength(2);
    expect(await counts()).toEqual(before);
  });

  it('mesma chave com um valor alterado: 409 IDEMPOTENCY_KEY_REUSED e banco inalterado', async () => {
    const before = await counts();

    const payload = buildPayload();
    payload.telemetryCycleData.measurements[0].dataPoints[1].value = 0.9999;

    const response = await authed
      .post('/api/telemetry-cycles')
      .set('Idempotency-Key', 'e2e-idempotency-key')
      .send(payload)
      .expect(409);

    expect(response.body.code).toBe('IDEMPOTENCY_KEY_REUSED');
    expect(await counts()).toEqual(before);
  });

  it('mesmos limites e quantidade, valor intermediário diferente: não é falsa duplicata', async () => {
    const payload = shiftedPayload(30);
    payload.telemetryCycleData.measurements[0].dataPoints[1].value = 0.0777;

    const first = await authed
      .post('/api/telemetry-cycles')
      .set('Idempotency-Key', 'e2e-janela-30')
      .send(payload)
      .expect(201);

    // Mesma janela, mesma contagem, apenas o valor do meio muda: precisa ser aceito
    // como conteúdo novo, e não descartado como repetição.
    const variant = shiftedPayload(30);
    variant.telemetryCycleData.measurements[0].dataPoints[1].value = 0.0888;

    const second = await authed
      .post('/api/telemetry-cycles')
      .set('Idempotency-Key', 'e2e-janela-30-variante')
      .send(variant)
      .expect(409);

    expect(first.body.duplicate).toBe(false);
    // O conteúdo é novo (fingerprint diferente), mas ocuparia instantes já gravados:
    // o conflito é de amostra, jamais uma duplicata silenciosa.
    expect(second.body.code).toBe('SAMPLE_TIMESTAMP_CONFLICT');
  });

  it('chave diferente com payload idêntico: 200 duplicate:true e nenhum ciclo novo', async () => {
    const before = await counts();

    const response = await authed
      .post('/api/telemetry-cycles')
      .set('Idempotency-Key', 'e2e-outra-chave-mesmo-conteudo')
      .send(buildPayload())
      .expect(200);

    expect(response.body.duplicate).toBe(true);
    expect(response.body.idempotencyKey).toBe('e2e-idempotency-key');
    expect(await counts()).toEqual(before);
  });

  it('mesmo request sem header enviado duas vezes: um ciclo e um conjunto de amostras', async () => {
    const payload = shiftedPayload(60);
    const before = await counts();

    const first = await authed.post('/api/telemetry-cycles').send(payload).expect(201);
    const afterFirst = await counts();

    const second = await authed.post('/api/telemetry-cycles').send(payload).expect(200);
    const afterSecond = await counts();

    expect(first.body.duplicate).toBe(false);
    expect(second.body.duplicate).toBe(true);
    expect(second.body.cycleId).toBe(first.body.cycleId);
    expect(afterFirst.cycles).toBe(before.cycles + 1);
    expect(afterSecond).toEqual(afterFirst);
  });

  it('recusa mudança de unidade em série existente sem alterar o histórico', async () => {
    const before = await counts();
    const seriesBefore = await prisma.timeSeries.findFirst({
      where: { sensor: { serialNumber: SENSOR_SERIAL }, physicalQuantity: 'ACCELERATION' },
    });

    const payload = shiftedPayload(90);
    for (const measurement of payload.telemetryCycleData.measurements) {
      if (measurement.attributes.physicalQuantity === 'acceleration') {
        measurement.attributes.unit = 'm/s2';
      }
    }

    const response = await authed.post('/api/telemetry-cycles').send(payload).expect(409);
    expect(response.body.code).toBe('SERIES_UNIT_CONFLICT');

    const seriesAfter = await prisma.timeSeries.findUnique({ where: { id: seriesBefore!.id } });
    expect(seriesAfter?.unit).toBe('g');
    expect(await counts()).toEqual(before);
  });

  it('duas ingestões idênticas concorrentes: um único ciclo e respostas consistentes', async () => {
    const payload = shiftedPayload(120);
    const before = await counts();

    const [left, right] = await Promise.all([
      authed.post('/api/telemetry-cycles').send(payload),
      authed.post('/api/telemetry-cycles').send(payload),
    ]);

    const statuses = [left.status, right.status].sort();
    expect(statuses).toEqual([200, 201]);

    expect(left.body.cycleId).toBe(right.body.cycleId);
    expect(left.body.payloadFingerprint).toBe(right.body.payloadFingerprint);
    expect(left.body.timeSeriesIds.sort()).toEqual(right.body.timeSeriesIds.sort());

    const after = await counts();
    expect(after.cycles).toBe(before.cycles + 1);
    expect(after.samples).toBe(before.samples + TOTAL_SAMPLES);
  });

  it('recupera a série persistida, suas amostras e suas métricas', async () => {
    // withCounts: sampleCount é opcional na listagem (count(*) por série é caro no
    // caminho do painel) e este teste compara a contagem com a página e com /metrics.
    const list = await authed.get('/api/time-series?withCounts=true').expect(200);

    const series = (list.body as Array<Record<string, unknown>>).find(
      (item) => item.sensorSerialNumber === SENSOR_SERIAL && item.axis === 'y',
    );

    expect(series).toEqual(
      expect.objectContaining({
        machineName: MACHINE_NAME,
        machineType: 'Pump',
        sensorModel: 'HF+',
        physicalQuantity: 'acceleration',
        unit: 'g',
      }),
    );

    const samples = await authed
      .get(`/api/time-series/${series!.id as string}/samples`)
      .expect(200);

    // TS-03: envelope com total — nada de truncamento silencioso.
    expect(samples.body.total).toBe(series!.sampleCount);
    expect(samples.body.items.length).toBe(series!.sampleCount);
    expect(samples.body.limit).toBe(500);
    expect(samples.body.offset).toBe(0);
    const items = samples.body.items as Array<{ timestamp: string; value: number }>;
    expect(items[0].timestamp < items[items.length - 1].timestamp).toBe(true);

    const metrics = await authed
      .get(`/api/time-series/${series!.id as string}/metrics`)
      .expect(200);

    expect(metrics.body.count).toBe(series!.sampleCount);

    // A última leitura vem no RESUMO da coleção, e não só em /metrics: é o que permite a
    // um painel de frota desenhar todas as séries sem uma chamada por série. Precisa
    // coincidir com a métrica e com a última amostra paginada — mesma fonte, mesmo valor.
    const ultima = items[items.length - 1] as { timestamp: string; value: number };
    expect(series!.lastTimestamp).toBe(ultima.timestamp);
    expect(series!.lastValue).toBe(ultima.value);
    expect(series!.lastTimestamp).toBe(metrics.body.lastTimestamp);
    expect(series!.lastValue).toBe(metrics.body.last);
  });

  it('responde 404 ao consultar série inexistente', async () => {
    await authed
      .get('/api/time-series/00000000-0000-0000-0000-000000000000/samples')
      .expect(404);
  });

  it('TS-03: pagina as amostras por offset e a união das páginas é a série inteira', async () => {
    const list = await authed.get('/api/time-series').expect(200);
    const series = (list.body as Array<Record<string, unknown>>).find(
      (item) => item.sensorSerialNumber === SENSOR_SERIAL && item.axis === 'y',
    );
    const id = series!.id as string;

    const full = await authed.get(`/api/time-series/${id}/samples`).expect(200);
    const total = full.body.total as number;
    expect(total).toBeGreaterThan(2);
    expect(full.body.items).toHaveLength(total);

    // Varre a série em páginas de 5 e reconstrói o conjunto completo, na ordem.
    const pageSize = 5;
    const collected: unknown[] = [];
    for (let offset = 0; offset < total; offset += pageSize) {
      const page = await authed
        .get(`/api/time-series/${id}/samples?limit=${pageSize}&offset=${offset}`)
        .expect(200);
      expect(page.body.total).toBe(total);
      expect(page.body.limit).toBe(pageSize);
      expect(page.body.offset).toBe(offset);
      expect(page.body.items.length).toBeLessThanOrEqual(pageSize);
      collected.push(...page.body.items);
    }
    expect(collected).toEqual(full.body.items);
  });

  it('TS-03: parâmetros inválidos ou desconhecidos retornam 400, nunca 500', async () => {
    const list = await authed.get('/api/time-series').expect(200);
    const id = (list.body as Array<Record<string, unknown>>).find(
      (item) => item.sensorSerialNumber === SENSOR_SERIAL,
    )!.id as string;

    for (const query of [
      'limit=0',
      'limit=5001',
      'limit=abc',
      'offset=-1',
      `offset=${'9'.repeat(400)}`,
      'foo=1',
    ]) {
      const response = await authed.get(`/api/time-series/${id}/samples?${query}`).expect(400);
      expect(response.body.code).toBe('INVALID_SAMPLES_QUERY');
    }
  });

  it('TS-05: DELETE remove a série e as amostras em cascata; repetir é 404', async () => {
    const list = await authed.get('/api/time-series').expect(200);
    const series = (list.body as Array<Record<string, unknown>>).find(
      (item) => item.sensorSerialNumber === SENSOR_SERIAL && item.axis === 'y',
    );
    const id = series!.id as string;

    await authed.delete(`/api/time-series/${id}`).expect(204);

    // A série sumiu das rotas de leitura e nenhuma amostra órfã ficou no banco.
    await authed.get(`/api/time-series/${id}/samples`).expect(404);
    const orphans = await prisma.timeSeriesSample.count({ where: { timeSeriesId: id } });
    expect(orphans).toBe(0);

    const after = await authed.get('/api/time-series').expect(200);
    expect((after.body as Array<Record<string, unknown>>).some((item) => item.id === id)).toBe(
      false,
    );

    const repeat = await authed.delete(`/api/time-series/${id}`).expect(404);
    expect(repeat.body.code).toBe('TIME_SERIES_NOT_FOUND');
  });

  it('TS-05: exclusão sem token é 401', async () => {
    await http().delete('/api/time-series/qualquer').expect(401);
  });
});
