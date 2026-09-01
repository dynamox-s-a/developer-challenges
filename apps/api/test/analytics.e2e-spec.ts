/**
 * Camada analítica contra a API real.
 *
 * Isolamento: fixtures com prefixo ANL- e limpeza apenas desse prefixo — o seed, a planta
 * e o histórico permanecem intactos. As asserções que dependem de dados usam as fixtures
 * próprias; as que exercitam contrato (janela obrigatória, paginação, cursor) valem para
 * qualquer base.
 */
import { randomBytes, scryptSync } from 'node:crypto';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const PREFIX = 'ANL-';
const USER_EMAIL = 'analytics-e2e@dynamox.local';
const USER_PASSWORD = 'Senha-E2E@2026';
const SENSOR_A = `${PREFIX}HF-001`;
const SENSOR_B = `${PREFIX}HF-002`;

/** Janela fixa e antiga: não colide com o histórico nem com as fases da planta. */
const WINDOW_FROM = '2026-03-02T00:00:00.000Z';
const WINDOW_TO = '2026-03-03T00:00:00.000Z';
const BASELINE_START = Date.parse('2026-03-02T10:00:00.000Z');
const CURRENT_START = Date.parse('2026-03-02T11:00:00.000Z');
/** Aquisição posterior de UM sensor só — o que o twin chama de confirmatória. */
const CONFIRM_START = Date.parse('2026-03-02T12:00:00.000Z');

describe('Analytics (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let bearer: string;
  const cycles: Record<string, string> = {};

  const http = () => request(app.getHttpServer());
  const authed = (path: string) => http().get(path).set('Authorization', bearer);

  async function removeFixtures(): Promise<void> {
    const sensors = await prisma.sensor.findMany({
      where: { serialNumber: { startsWith: PREFIX } },
      select: { id: true },
    });
    const series = await prisma.timeSeries.findMany({
      where: { sensorId: { in: sensors.map((s) => s.id) } },
      select: { id: true },
    });
    await prisma.timeSeriesSample.deleteMany({
      where: { timeSeriesId: { in: series.map((s) => s.id) } },
    });
    await prisma.ingestionCycle.deleteMany({
      where: { measuringSystemUid: { startsWith: PREFIX } },
    });
    await prisma.timeSeries.deleteMany({ where: { id: { in: series.map((s) => s.id) } } });
    await prisma.sensor.deleteMany({ where: { serialNumber: { startsWith: PREFIX } } });
    await prisma.machine.deleteMany({ where: { name: { startsWith: PREFIX } } });
  }

  /** Duas aquisições sincronizadas por sensor: a segunda com o dobro da amplitude em A. */
  async function seedFixtures(): Promise<void> {
    const machine = await prisma.machine.create({
      data: { name: `${PREFIX}P-900`, type: 'PUMP' },
    });

    for (const [index, serial] of [SENSOR_A, SENSOR_B].entries()) {
      const point = await prisma.monitoringPoint.create({
        data: {
          name: `${PREFIX}Ponto ${index}`,
          machineId: machine.id,
          externalResourceId: `${'a'.repeat(23)}${index}`,
        },
      });
      const sensor = await prisma.sensor.create({
        data: { serialNumber: serial, model: 'HF_PLUS', monitoringPointId: point.id },
      });

      for (const axis of ['Y', 'Z'] as const) {
        const series = await prisma.timeSeries.create({
          data: { sensorId: sensor.id, physicalQuantity: 'ACCELERATION', axis, unit: 'g' },
        });

        for (const [phase, start] of [
          ['baseline', BASELINE_START],
          ['current', CURRENT_START],
        ] as const) {
          const key = `${serial}-${phase}`;
          const cycle =
            cycles[key] ??
            (
              await prisma.ingestionCycle.create({
                data: {
                  idempotencyKey: `${PREFIX}${serial}-${phase}`,
                  payloadFingerprint: randomBytes(32).toString('hex'),
                  measuringSystemUid: serial,
                  modelName: 'analytics-e2e',
                  modelVersion: 1,
                  origin: 'MANUAL',
                  tags: [`${PREFIX}fixture`],
                  metadata: {},
                  configuration: { rpm: 1750, loadPercent: 70 },
                  measurementCount: 2,
                  sampleCount: 120,
                  timeSeriesIds: [],
                },
              })
            ).id;
          cycles[key] = cycle;

          // Sensor A dobra na aquisição atual; B permanece estável.
          const amplitude = serial === SENSOR_A && phase === 'current' ? 0.04 : 0.02;
          await prisma.timeSeriesSample.createMany({
            data: Array.from({ length: 6 }, (_, second) => ({
              timeSeriesId: series.id,
              timestamp: new Date(start + second * 1000),
              value: amplitude,
              ingestionCycleId: cycle,
            })),
          });
        }
      }
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get(PrismaService);
    await removeFixtures();
    await seedFixtures();

    const salt = randomBytes(16).toString('hex');
    await prisma.user.upsert({
      where: { email: USER_EMAIL },
      update: {},
      create: {
        email: USER_EMAIL,
        name: 'Analytics E2E',
        passwordHash: `scrypt$${salt}$${scryptSync(USER_PASSWORD, salt, 64).toString('hex')}`,
        role: 'VIEWER',
      },
    });
    const login = await http()
      .post('/api/auth/login')
      .send({ email: USER_EMAIL, password: USER_PASSWORD })
      .expect(201);
    bearer = `Bearer ${login.body.token}`;
  }, 60000);

  afterAll(async () => {
    await removeFixtures();
    await prisma.user.deleteMany({ where: { email: USER_EMAIL } });
    await app.close();
  });

  it('exige janela temporal válida em toda rota analítica', async () => {
    await authed('/api/analytics/fleet-condition').expect(400);
    await authed(`/api/analytics/fleet-condition?from=${WINDOW_FROM}`).expect(400);
    await authed(`/api/analytics/fleet-condition?from=${WINDOW_TO}&to=${WINDOW_FROM}`).expect(400);
    await authed('/api/analytics/fleet-condition?from=abc&to=xyz').expect(400);
    // Janela maior que o teto (90 dias) é recusada: nenhuma rota varre o histórico inteiro.
    await authed('/api/analytics/heatmap?from=2025-01-01T00:00:00.000Z&to=2026-06-01T00:00:00.000Z').expect(400);
    const recusa = await authed(
      `/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}&inventado=1`,
    ).expect(400);
    expect(recusa.body.code).toBe('INVALID_ANALYTICS_QUERY');
  });

  it('leitura é liberada para VIEWER e barrada sem token', async () => {
    await authed(`/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}`).expect(200);
    await http().get(`/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}`).expect(401);
  });

  it('classifica a condição comparando as duas últimas aquisições sincronizadas', async () => {
    const response = await authed(
      `/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
    ).expect(200);

    const a = response.body.points.find((p: { sensorSerialNumber: string }) => p.sensorSerialNumber === SENSOR_A);
    const b = response.body.points.find((p: { sensorSerialNumber: string }) => p.sensorSerialNumber === SENSOR_B);

    // A dobrou: razão 2,0 é exatamente o limiar de atenção.
    expect(a.deviationRatio).toBeCloseTo(2, 5);
    expect(a.condition).toBe('attention');
    expect(a.currentValue).toBeCloseTo(0.04, 5);
    expect(a.baselineValue).toBeCloseTo(0.02, 5);
    // A referência é uma aquisição concreta, nunca a média do período.
    expect(a.currentCycleId).not.toBe(a.baselineCycleId);
    expect(a.currentAt).not.toBe(a.baselineAt);

    expect(b.deviationRatio).toBeCloseTo(1, 5);
    expect(b.condition).toBe('normal');
  });

  it('o mapa data × hora traz severidade, não só cobertura', async () => {
    const mapa = await authed(`/api/analytics/heatmap?from=${WINDOW_FROM}&to=${WINDOW_TO}&bucket=hour`).expect(200);

    // Cobertura continua respondida — é o que distingue "hora calma" de "hora sem dado".
    expect(mapa.body.expectedSensors).toBeGreaterThan(0);
    const buckets: Array<Record<string, unknown>> = mapa.body.buckets;
    expect(buckets.length).toBeGreaterThan(0);
    for (const bucket of buckets) {
      expect(bucket).toHaveProperty('coveragePercent');
      // A severidade é sempre declarada: ou o número, ou null explícito quando não há
      // baseline aprendida para o ponto — nunca ausente do contrato.
      expect(bucket).toHaveProperty('maxDeviationRatio');
      expect(bucket).toHaveProperty('maxDeviationSensor');
      expect(bucket).toHaveProperty('maxDeviationValue');
    }

    /*
     * As fixtures ANL- não passam pelo motor de alertas, então não têm baseline aprendida:
     * o desvio delas é null e a interface as desenha como ausência. Isso é a garantia de
     * que o mapa nunca inventa uma severidade sem referência para compará-la.
     */
    const semBaseline = buckets.filter((bucket) => bucket.maxDeviationRatio === null);
    expect(semBaseline.length).toBeGreaterThan(0);
    for (const bucket of semBaseline) {
      expect(bucket.maxDeviationSensor).toBeNull();
      expect(bucket.maxDeviationValue).toBeNull();
    }
  });

  it('lista máquinas com recorte por condição resolvido no servidor', async () => {
    const listagem = await authed(
      `/api/analytics/machines?from=${WINDOW_FROM}&to=${WINDOW_TO}&pageSize=100`,
    ).expect(200);

    const nossa = listagem.body.items.find(
      (item: { machineName: string }) => item.machineName === `${PREFIX}P-900`,
    );
    // A condição da máquina é a PIOR entre os seus pontos, nunca uma média.
    expect(nossa.condition).toBe('attention');
    expect(nossa.pointCount).toBe(2);
    expect(nossa.sensorCount).toBe(2);
    expect(nossa.attentionCount).toBe(1);
    expect(nossa.maxDeviationRatio).toBeCloseTo(2, 5);
    expect(listagem.body.counts.total).toBe(listagem.body.total);

    // O recorte é do servidor: o cliente não recebe o que não pediu.
    const recorte = await authed(
      `/api/analytics/machines?from=${WINDOW_FROM}&to=${WINDOW_TO}&condition=attention&pageSize=100`,
    ).expect(200);
    expect(
      recorte.body.items.every((item: { condition: string }) => item.condition === 'attention'),
    ).toBe(true);
    expect(recorte.body.items.length).toBeLessThan(listagem.body.items.length);
    // A contagem continua descrevendo o universo inteiro — é o que o seletor precisa.
    expect(recorte.body.counts.total).toBe(listagem.body.counts.total);

    // Busca sem acento e sem caixa, ordenação e paginação também no servidor.
    const busca = await authed(
      `/api/analytics/machines?from=${WINDOW_FROM}&to=${WINDOW_TO}&search=${PREFIX.toLowerCase()}p-900`,
    ).expect(200);
    expect(busca.body.total).toBe(1);
    expect(busca.body.search).toBe(`${PREFIX.toLowerCase()}p-900`);

    const paginada = await authed(
      `/api/analytics/machines?from=${WINDOW_FROM}&to=${WINDOW_TO}&page=1&pageSize=1&sortBy=deviation&sortDir=desc`,
    ).expect(200);
    expect(paginada.body.items).toHaveLength(1);
    expect(paginada.body.sortBy).toBe('deviation');
    expect(paginada.body.totalPages).toBeGreaterThan(1);

    // Vocabulário fechado: "crítico" não existe na regra de condição deste domínio.
    const invalida = await authed(
      `/api/analytics/machines?from=${WINDOW_FROM}&to=${WINDOW_TO}&condition=critical`,
    ).expect(400);
    expect(invalida.body.code).toBe('INVALID_ANALYTICS_QUERY');
    await authed(`/api/analytics/machines?from=${WINDOW_FROM}&to=${WINDOW_TO}&sortBy=inventado`).expect(400);
    await authed('/api/analytics/machines').expect(400);
  });

  it('o recorte por condição vale para a frota e para os pontos de uma máquina', async () => {
    const frota = await authed(
      `/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}&condition=attention`,
    ).expect(200);
    expect(frota.body.points.every((p: { condition: string }) => p.condition === 'attention')).toBe(true);
    expect(frota.body.condition).toBe('attention');
    expect(frota.body.counts.total).toBeGreaterThan(frota.body.points.length);

    const maquina = await authed(
      `/api/analytics/machines/${PREFIX}P-900?from=${WINDOW_FROM}&to=${WINDOW_TO}&condition=attention`,
    ).expect(200);
    expect(maquina.body.points).toHaveLength(1);
    expect(maquina.body.points[0].sensorSerialNumber).toBe(SENSOR_A);
    // Indicadores continuam descrevendo a máquina inteira, não o recorte.
    expect(maquina.body.kpis.points).toBe(2);
    expect(maquina.body.counts.total).toBe(2);
    expect(maquina.body.counts.attention).toBe(1);

    // O ponto é um só: não faz sentido recortá-lo por condição.
    await authed(
      `/api/analytics/machines/${PREFIX}P-900/points/anl-ponto-0?from=${WINDOW_FROM}&to=${WINDOW_TO}&condition=attention`,
    ).expect(400);
  });

  it('resume o ativo pelo identificador legível, reaproveitando a classificação da frota', async () => {
    const response = await authed(
      `/api/analytics/machines/${PREFIX}P-900?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
    ).expect(200);

    expect(response.body.machineName).toBe(`${PREFIX}P-900`);
    expect(response.body.kpis.points).toBe(2);
    expect(response.body.kpis.sensors).toBe(2);
    expect(response.body.kpis.attention).toBe(1);
    expect(response.body.kpis.maxDeviationRatio).toBeCloseTo(2, 5);

    // A MESMA razão que a condição da frota publica: a página do ativo não recalcula
    // com outra referência só porque olha uma máquina de cada vez.
    const frota = await authed(
      `/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
    ).expect(200);
    const daFrota = frota.body.points.find(
      (point: { sensorSerialNumber: string }) => point.sensorSerialNumber === SENSOR_A,
    );
    const doAtivo = response.body.points.find(
      (point: { sensorSerialNumber: string }) => point.sensorSerialNumber === SENSOR_A,
    );
    expect(doAtivo.deviationRatio).toBeCloseTo(daFrota.deviationRatio, 10);
    expect(doAtivo.currentValue).toBeCloseTo(daFrota.currentValue, 10);
    // Agregados da janela vêm junto, sem uma segunda ida do cliente.
    expect(doAtivo.acquisitionCount).toBe(2);
    expect(doAtivo.sampleCount).toBe(12);

    // Identificador é case-insensitive; inexistente é 404, nunca 200 vazio.
    await authed(
      `/api/analytics/machines/${PREFIX.toLowerCase()}p-900?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
    ).expect(200);
    const ausente = await authed(
      `/api/analytics/machines/nao-existe?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
    ).expect(404);
    expect(ausente.body.code).toBe('MACHINE_NOT_FOUND');
  });

  it('resume o ponto com condição, janela e séries — sem amostra bruta', async () => {
    const response = await authed(
      `/api/analytics/machines/${PREFIX}P-900/points/anl-ponto-0?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
    ).expect(200);

    expect(response.body.monitoringPointName).toBe(`${PREFIX}Ponto 0`);
    expect(response.body.sensorSerialNumber).toBe(SENSOR_A);
    expect(response.body.deviationRatio).toBeCloseTo(2, 5);
    expect(response.body.currentCycleId).not.toBe(response.body.baselineCycleId);
    expect(response.body.window.acquisitionCount).toBe(2);
    // Inventário de séries: uma linha por grandeza, com a última leitura da janela.
    expect(response.body.series).toHaveLength(2);
    expect(response.body.series.every((item: { seriesId: string }) => item.seriesId)).toBe(true);
    // TESTE-GUARDA: rota de resumo não pode devolver telemetria individual.
    expect(JSON.stringify(response.body)).not.toContain('"items"');

    await authed(
      `/api/analytics/machines/${PREFIX}P-900/points/inexistente?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
    ).expect(404);
    await authed(`/api/analytics/machines/${PREFIX}P-900/points/anl-ponto-0`).expect(400);
  });

  it('a tendência curta só vem quando pedida, e é agregada', async () => {
    const semTendencia = await authed(
      `/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
    ).expect(200);
    const ponto = (body: { points: Array<{ sensorSerialNumber: string; trend: unknown[] }> }) =>
      body.points.find((item) => item.sensorSerialNumber === SENSOR_A)!;
    expect(ponto(semTendencia.body).trend).toEqual([]);

    const comTendencia = await authed(
      `/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}&includeTrend=true`,
    ).expect(200);
    const trend = ponto(comTendencia.body).trend as Array<{ timestamp: string; value: number }>;
    // Poucos buckets, nunca as amostras: é o suficiente para dizer a direção.
    expect(trend.length).toBeGreaterThan(0);
    expect(trend.length).toBeLessThanOrEqual(12);
    // Cada valor é o RMS do bucket — entre a referência (0,02) e a condição (0,04), nunca
    // uma amostra solta: a fixture cabe em um bucket e o valor agregado prova a redução.
    expect(trend.every((point) => point.value > 0.02 && point.value <= 0.04)).toBe(true);
    expect(trend.every((point) => typeof point.timestamp === 'string')).toBe(true);

    await authed(
      `/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}&includeTrend=talvez`,
    ).expect(400);
  });

  it('uma aquisição posterior de um sensor só não vira a referência nem a atual', async () => {
    // CHARACTERIZATION da regra "duas últimas aquisições sincronizadas por ≥2 sensores":
    // uma aquisição mais nova, mas de UM sensor apenas, é persistida e listada — e ainda
    // assim ignorada pela classificação. É o que mantém o 3,49× do painel estável quando a
    // planta emite a confirmatória.
    const series = await prisma.timeSeries.findMany({
      where: { sensor: { serialNumber: SENSOR_A }, axis: { in: ['Y', 'Z'] } },
      select: { id: true },
    });
    const confirm = await prisma.ingestionCycle.create({
      data: {
        idempotencyKey: `${PREFIX}${SENSOR_A}-confirm`,
        payloadFingerprint: randomBytes(32).toString('hex'),
        measuringSystemUid: SENSOR_A,
        modelName: 'analytics-e2e',
        modelVersion: 1,
        origin: 'MANUAL',
        tags: [`${PREFIX}fixture`],
        metadata: {},
        configuration: { rpm: 1750, loadPercent: 70 },
        measurementCount: 2,
        sampleCount: 12,
        timeSeriesIds: [],
      },
    });
    for (const item of series) {
      await prisma.timeSeriesSample.createMany({
        data: Array.from({ length: 6 }, (_, second) => ({
          timeSeriesId: item.id,
          timestamp: new Date(CONFIRM_START + second * 1000),
          // Se entrasse como "atual", a razão seria 3,0; como "referência", 0,67.
          value: 0.06,
          ingestionCycleId: confirm.id,
        })),
      });
    }

    try {
      const listed = await authed(
        `/api/analytics/sensors/${SENSOR_A}/acquisitions?from=${WINDOW_FROM}&to=${WINDOW_TO}&includeTotal=true`,
      ).expect(200);
      expect(listed.body.total).toBe(3);

      const response = await authed(
        `/api/analytics/fleet-condition?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
      ).expect(200);
      const a = response.body.points.find(
        (p: { sensorSerialNumber: string }) => p.sensorSerialNumber === SENSOR_A,
      );
      expect(a.deviationRatio).toBeCloseTo(2, 5);
      expect(a.condition).toBe('attention');
      expect(a.currentCycleId).toBe(cycles[`${SENSOR_A}-current`]);
      expect(a.baselineCycleId).toBe(cycles[`${SENSOR_A}-baseline`]);
      // A recência, essa sim, enxerga a aquisição mais nova.
      expect(Date.parse(a.currentAt)).toBeLessThan(CONFIRM_START);
    } finally {
      await prisma.timeSeriesSample.deleteMany({ where: { ingestionCycleId: confirm.id } });
      await prisma.ingestionCycle.delete({ where: { id: confirm.id } });
    }
  });

  it('agrega a série em buckets e nunca devolve amostra bruta', async () => {
    const series = await prisma.timeSeries.findFirst({
      where: { sensor: { serialNumber: SENSOR_A }, axis: 'Y' },
      select: { id: true },
    });
    const response = await authed(
      `/api/analytics/series/${series!.id}/points?from=${WINDOW_FROM}&to=${WINDOW_TO}&bucket=1h`,
    ).expect(200);

    expect(response.body.bucket).toBe('1h');
    expect(response.body.stats.sampleCount).toBe(12);
    expect(response.body.points).toHaveLength(2);
    expect(response.body.points[0].avg).toBeCloseTo(0.02, 5);
    expect(response.body.points[1].avg).toBeCloseTo(0.04, 5);
    // O corpo agregado não carrega telemetria individual.
    expect(JSON.stringify(response.body)).not.toContain('"items"');

    await authed(`/api/analytics/series/${series!.id}/points?from=${WINDOW_FROM}&to=${WINDOW_TO}&bucket=9m`).expect(400);
    await authed(`/api/analytics/series/nao-e-uuid/points?from=${WINDOW_FROM}&to=${WINDOW_TO}`).expect(400);
    await authed(
      `/api/analytics/series/11111111-1111-4111-8111-111111111111/points?from=${WINDOW_FROM}&to=${WINDOW_TO}`,
    ).expect(404);
  });

  it('resume a janela por sensor com KPIs e paginação', async () => {
    const response = await authed(
      `/api/analytics/time-windows?from=${WINDOW_FROM}&to=${WINDOW_TO}&page=1&pageSize=25`,
    ).expect(200);

    expect(response.body.kpis.expectedSensors).toBeGreaterThanOrEqual(2);
    const nossos = response.body.items.filter((item: { sensorSerialNumber: string }) =>
      item.sensorSerialNumber.startsWith(PREFIX),
    );
    expect(nossos).toHaveLength(2);
    expect(nossos[0].acquisitionCount).toBe(2);
    expect(nossos[0].sampleCount).toBe(12);

    await authed(`/api/analytics/time-windows?from=${WINDOW_FROM}&to=${WINDOW_TO}&page=0`).expect(400);
    await authed(`/api/analytics/time-windows?from=${WINDOW_FROM}&to=${WINDOW_TO}&pageSize=999`).expect(400);
  });

  it('pagina aquisições no servidor e só conta o total quando pedido', async () => {
    const primeira = await authed(
      `/api/analytics/sensors/${SENSOR_A}/acquisitions?from=${WINDOW_FROM}&to=${WINDOW_TO}&page=1&pageSize=1`,
    ).expect(200);

    expect(primeira.body.items).toHaveLength(1);
    expect(primeira.body.hasNextPage).toBe(true);
    // Sem includeTotal não há count(*): o cliente navega por hasNextPage.
    expect(primeira.body.total).toBeNull();
    expect(primeira.body.totalPages).toBeNull();

    const segunda = await authed(
      `/api/analytics/sensors/${SENSOR_A}/acquisitions?from=${WINDOW_FROM}&to=${WINDOW_TO}&page=2&pageSize=1`,
    ).expect(200);
    expect(segunda.body.items).toHaveLength(1);
    expect(segunda.body.hasNextPage).toBe(false);
    // Mais recentes primeiro, sem repetir item entre páginas.
    expect(Date.parse(primeira.body.items[0].startedAt)).toBeGreaterThan(
      Date.parse(segunda.body.items[0].startedAt),
    );

    const comTotal = await authed(
      `/api/analytics/sensors/${SENSOR_A}/acquisitions?from=${WINDOW_FROM}&to=${WINDOW_TO}&pageSize=1&includeTotal=true`,
    ).expect(200);
    expect(comTotal.body.total).toBe(2);
    expect(comTotal.body.totalPages).toBe(2);

    await authed(`/api/analytics/sensors/NAO-EXISTE/acquisitions?from=${WINDOW_FROM}&to=${WINDOW_TO}`).expect(404);
  });

  it('detalha a aquisição por série sem devolver amostras', async () => {
    const cycleId = cycles[`${SENSOR_A}-current`];
    const response = await authed(`/api/analytics/acquisitions/${cycleId}`).expect(200);

    expect(response.body.sensorSerialNumber).toBe(SENSOR_A);
    expect(response.body.series).toHaveLength(2);
    const y = response.body.series.find((s: { axis: string }) => s.axis === 'y');
    expect(y.sampleCount).toBe(6);
    expect(y.rms).toBeCloseTo(0.04, 5);
    expect(JSON.stringify(response.body)).not.toContain('"timestamp"');

    await authed('/api/analytics/acquisitions/nao-e-uuid').expect(400);
    await authed('/api/analytics/acquisitions/11111111-1111-4111-8111-111111111111').expect(404);
  });

  it('entrega amostras brutas por cursor keyset, com filtros', async () => {
    const cycleId = cycles[`${SENSOR_A}-current`];

    const primeira = await authed(`/api/analytics/acquisitions/${cycleId}/samples?limit=5`).expect(200);
    expect(primeira.body.items).toHaveLength(5);
    expect(primeira.body.nextCursor).not.toBeNull();

    // Percorre a aquisição inteira pelo cursor: 12 amostras (Y e Z), sem repetir nenhuma
    // e sem OFFSET — a última página encerra com nextCursor nulo.
    const vistos: string[] = [...primeira.body.items.map((s: { id: string }) => s.id)];
    let cursor: string | null = primeira.body.nextCursor;
    let paginas = 1;
    while (cursor) {
      const proxima = await authed(
        `/api/analytics/acquisitions/${cycleId}/samples?limit=5&cursor=${encodeURIComponent(cursor)}`,
      ).expect(200);
      expect(proxima.body.items.length).toBeGreaterThan(0);
      for (const sample of proxima.body.items as Array<{ id: string }>) {
        expect(vistos).not.toContain(sample.id);
        vistos.push(sample.id);
      }
      cursor = proxima.body.nextCursor;
      paginas += 1;
      expect(paginas).toBeLessThan(10);
    }
    expect(vistos).toHaveLength(12);

    const filtrada = await authed(
      `/api/analytics/acquisitions/${cycleId}/samples?limit=50&quantity=ACCELERATION&axis=Y`,
    ).expect(200);
    expect(filtrada.body.items).toHaveLength(6);
    expect(filtrada.body.items.every((s: { axis: string }) => s.axis === 'y')).toBe(true);

    await authed(`/api/analytics/acquisitions/${cycleId}/samples?axis=W`).expect(400);
    await authed(`/api/analytics/acquisitions/${cycleId}/samples?limit=99999`).expect(400);
  });

  it('GET /time-series responde sem contagem por padrão e com ela sob demanda', async () => {
    const semContagem = await authed('/api/time-series').expect(200);
    const nossa = semContagem.body.find(
      (s: { sensorSerialNumber: string; axis: string }) =>
        s.sensorSerialNumber === SENSOR_A && s.axis === 'y',
    );
    // sampleCount é opcional: o painel usa lastTimestamp para saber se há dado.
    expect(nossa.sampleCount).toBeNull();
    expect(nossa.lastValue).toBeCloseTo(0.04, 5);
    expect(nossa.lastTimestamp).not.toBeNull();

    const comContagem = await authed('/api/time-series?withCounts=true').expect(200);
    const contada = comContagem.body.find(
      (s: { sensorSerialNumber: string; axis: string }) =>
        s.sensorSerialNumber === SENSOR_A && s.axis === 'y',
    );
    expect(contada.sampleCount).toBe(12);

    await authed('/api/time-series?withCounts=talvez').expect(400);
    await authed('/api/time-series?inventado=1').expect(400);
  });
});
