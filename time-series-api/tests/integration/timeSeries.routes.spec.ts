import request from 'supertest';
import { app } from '../../src/app';
import {
  clearDatabase,
  connectDatabase,
  disconnectDatabase,
} from '../../src/config/database';

describe('TimeSeries routes', () => {
  let createdId: string;

  beforeAll(async () => {
    await connectDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('should create a time series', async () => {
    const response = await request(app)
      .post('/time-series')
      .send({
        name: 'sensor-a',
        samples: [
          { timestamp: '2026-04-11T10:00:00.000Z', value: 10 },
          { timestamp: '2026-04-11T10:00:01.000Z', value: 20 },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('sensor-a');
    expect(response.body.samples).toHaveLength(2);
  });

  it('should return a time series by id', async () => {
    const createResponse = await request(app)
      .post('/time-series')
      .send({
        name: 'sensor-a',
        samples: [
          { timestamp: '2026-04-11T10:00:00.000Z', value: 10 },
          { timestamp: '2026-04-11T10:00:01.000Z', value: 20 },
        ],
      });

    createdId = createResponse.body.id;

    const response = await request(app).get(`/time-series/${createdId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdId);
    expect(response.body.name).toBe('sensor-a');
  });

  it('should return metrics by id', async () => {
    const createResponse = await request(app)
      .post('/time-series')
      .send({
        name: 'sensor-a',
        samples: [
          { timestamp: '2026-04-11T10:00:00.000Z', value: 10 },
          { timestamp: '2026-04-11T10:00:01.000Z', value: 20 },
        ],
      });

    createdId = createResponse.body.id;

    const response = await request(app).get(`/time-series/${createdId}/metrics`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      count: 2,
      min: 10,
      max: 20,
      sum: 30,
      average: 15,
      range: 10,
      firstTimestamp: '2026-04-11T10:00:00.000Z',
      lastTimestamp: '2026-04-11T10:00:01.000Z',
    });
  });

  it('should return the count of stored time series', async () => {
    await request(app)
      .post('/time-series')
      .send({
        name: 'sensor-a',
        samples: [{ timestamp: '2026-04-11T10:00:00.000Z', value: 10 }],
      });

    await request(app)
      .post('/time-series')
      .send({
        name: 'sensor-b',
        samples: [{ timestamp: '2026-04-11T10:00:00.000Z', value: 20 }],
      });

    const response = await request(app).get('/time-series/count');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ count: 2 });
  });

  it('should delete a time series by id', async () => {
    const createResponse = await request(app)
      .post('/time-series')
      .send({
        name: 'sensor-a',
        samples: [{ timestamp: '2026-04-11T10:00:00.000Z', value: 10 }],
      });

    createdId = createResponse.body.id;

    const deleteResponse = await request(app).delete(`/time-series/${createdId}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/time-series/${createdId}`);
    expect(getResponse.status).toBe(404);
  });

  it('should return 400 for invalid id format', async () => {
    const response = await request(app).get('/time-series/invalid-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid request data');
  });
});