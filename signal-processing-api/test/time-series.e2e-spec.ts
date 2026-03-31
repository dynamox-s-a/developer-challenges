import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('TimeSeries API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const sampleData = {
    name: 'accelerationRms/x',
    sensorId: 'test-sensor-e2e',
    sampleRate: 1000,
    unit: 'g',
    data: [
      { datetime: '2023-11-07T11:53:38.187Z', value: 0.5 },
      { datetime: '2023-11-07T11:53:38.188Z', value: 0.8 },
    ],
  };

  it('should store a new time series (POST /api/time-series)', async () => {
    return request(app.getHttpServer())
      .post('/api/time-series')
      .send(sampleData)
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.id).toBe('test-sensor-e2e');
      });
  });

  it('should get count of series (GET /api/time-series/count)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/time-series/count')
      .expect(200);
    
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('should get metrics (GET /api/time-series/:id/metrics)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/time-series/test-sensor-e2e/metrics`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('accelerationRms/x');
    expect(res.body[0].data[0]).toHaveProperty('max');
  });

  it('should delete a series (DELETE /api/time-series/:id)', async () => {
    await request(app.getHttpServer())
      .delete('/api/time-series/test-sensor-e2e')
      .expect(204);

    // Verify it is gone
    await request(app.getHttpServer())
      .get('/api/time-series/test-sensor-e2e/metrics')
      .expect(404);
  });
});
