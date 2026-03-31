import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { KafkaProducerService } from '../src/infrastructure/messaging/kafka-producer.service';

describe('TimeSeries API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(KafkaProducerService)
      .useValue({ publishRawSignal: jest.fn().mockResolvedValue(null) })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const sampleData = {
    name: 'acceleration/z',
    sensorId: 'sensor-99',
    sampleRate: 1000,
    unit: 'm/s2',
    data: [
      { datetime: '2024-01-01T10:00:00.000Z', value: 10 },
      { datetime: '2024-01-01T10:00:01.000Z', value: 20 },
    ],
  };

  it('US1 -> POST /api/time-series (Store)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/time-series')
      .send(sampleData)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.id).toBe('sensor-99');
  });

  it('US4 -> GET /api/time-series/count (Count)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/time-series/count')
      .expect(200);

    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('US5 -> GET /api/time-series/:id (Retrieve Full)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/time-series/sensor-99')
      .expect(200);

    expect(res.body.name).toBe('acceleration/z');
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].value).toBe(10);
  });

  it('US2 -> GET /api/time-series/:id/metrics (Analysis)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/time-series/sensor-99/metrics`)
      .expect(200);

    // Business Logic Validation (Domain comparison)
    // [10, 20] -> max: 20, rms: sqrt((10^2 + 20^2)/2) = sqrt(250) = 15.811
    expect(Array.isArray(res.body)).toBe(true);
    const series = res.body.find(s => s.name === 'acceleration/z');
    expect(series).toBeDefined();
    
    const metric = series.data[0];
    expect(metric.max).toBe(20);
    expect(metric.rms).toBeCloseTo(15.811, 2);
  });

  it('US3 -> DELETE /api/time-series/:id (Delete)', async () => {
    await request(app.getHttpServer())
      .delete('/api/time-series/sensor-99')
      .expect(204);

    await request(app.getHttpServer())
      .get('/api/time-series/sensor-99')
      .expect(404);
  });
});
