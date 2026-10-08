import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { errorHandler } from './errorHandler';
import { validate } from './validate';

/** Echoes what the handler sees after validation, behind the real errorHandler. */
function echoApp(...middlewares: express.RequestHandler[]) {
  const app = express();
  app.use(express.json());
  app.post('/items/:id', ...middlewares, (req, res) => {
    res.json({ body: req.body, query: req.query, params: req.params });
  });
  app.use(errorHandler);
  return app;
}

const bodySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['Pump', 'Fan']),
});

describe('validate', () => {
  describe('body (default source)', () => {
    it('passes valid input through and strips unknown keys', async () => {
      const res = await request(echoApp(validate(bodySchema)))
        .post('/items/1')
        .send({ name: 'Bomba 01', type: 'Pump', extra: 'ignored' });

      expect(res.status).toBe(200);
      expect(res.body.body).toEqual({ name: 'Bomba 01', type: 'Pump' });
    });

    it('rejects invalid input with 400 and the failing fields', async () => {
      const res = await request(echoApp(validate(bodySchema)))
        .post('/items/1')
        .send({ name: '', type: 'Compressor' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(
        res.body.error.details.map((d: { path: string }) => d.path),
      ).toEqual(['name', 'type']);
    });

    it('rejects a missing body', async () => {
      const res = await request(echoApp(validate(bodySchema))).post('/items/1');

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('query', () => {
    const querySchema = z.object({
      page: z.coerce.number().int().min(1).default(1),
      sortDir: z.enum(['asc', 'desc']).default('asc'),
    });

    it('replaces req.query with coerced values and defaults', async () => {
      const res = await request(echoApp(validate(querySchema, 'query'))).post(
        '/items/1?page=3',
      );

      expect(res.status).toBe(200);
      expect(res.body.query).toEqual({ page: 3, sortDir: 'asc' });
    });

    it('rejects an invalid query', async () => {
      const res = await request(echoApp(validate(querySchema, 'query'))).post(
        '/items/1?page=0&sortDir=sideways',
      );

      expect(res.status).toBe(400);
      expect(
        res.body.error.details.map((d: { path: string }) => d.path),
      ).toEqual(['page', 'sortDir']);
    });
  });

  describe('params', () => {
    const paramsSchema = z.object({ id: z.uuid() });

    it('accepts valid params', async () => {
      const id = '2f1c7a52-1b9e-4d2a-9a4e-6a0f6c3b5d11';
      const res = await request(echoApp(validate(paramsSchema, 'params'))).post(
        `/items/${id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.params).toEqual({ id });
    });

    it('rejects invalid params', async () => {
      const res = await request(echoApp(validate(paramsSchema, 'params'))).post(
        '/items/not-a-uuid',
      );

      expect(res.status).toBe(400);
      expect(res.body.error.details[0].path).toBe('id');
    });
  });

  it('validates several sources when chained', async () => {
    const app = echoApp(
      validate(z.object({ id: z.coerce.number() }), 'params'),
      validate(bodySchema),
    );

    const res = await request(app)
      .post('/items/7')
      .send({ name: 'Ventilador', type: 'Fan' });

    expect(res.status).toBe(200);
    expect(res.body.params).toEqual({ id: 7 });
    expect(res.body.body).toEqual({ name: 'Ventilador', type: 'Fan' });
  });
});
