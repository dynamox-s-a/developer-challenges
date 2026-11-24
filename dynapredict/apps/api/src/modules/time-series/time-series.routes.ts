import { Router, type Request } from 'express';
import { timeSeriesSchema } from '@dynapredict/shared';
import { requireAuth } from '../../middlewares/require-auth.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import {
  countTimeSeries,
  createTimeSeries,
  deleteTimeSeries,
  getTimeSeries,
  getTimeSeriesMetrics,
  listTimeSeries,
} from './time-series.service.ts';

// As séries de UM ponto: /api/monitoring-points/:pointId/time-series.
// Como nos pontos de uma máquina, o :pointId está no caminho do app.ts,
// e o mergeParams: true deixa este router enxergá-lo
export const pointTimeSeriesRouter = Router({ mergeParams: true });

pointTimeSeriesRouter.use(requireAuth);

pointTimeSeriesRouter.get(
  '/',
  async (req: Request<{ pointId: string }>, res) => {
    res.json(await listTimeSeries(req.params.pointId));
  },
);

pointTimeSeriesRouter.post(
  '/',
  validateBody(timeSeriesSchema),
  async (req: Request<{ pointId: string }>, res) => {
    const series = await createTimeSeries(req.params.pointId, req.body);
    res.status(201).json(series);
  },
);

// Uma série que já existe (/api/time-series/:id) e o total de séries
export const timeSeriesRouter = Router();

timeSeriesRouter.use(requireAuth);

// Antes do '/:id': senão o "count" seria lido como o id de uma série
timeSeriesRouter.get('/count', async (_req, res) => {
  res.json({ count: await countTimeSeries() });
});

timeSeriesRouter.get('/:id', async (req, res) => {
  res.json(await getTimeSeries(req.params.id));
});

timeSeriesRouter.get('/:id/metrics', async (req, res) => {
  res.json(await getTimeSeriesMetrics(req.params.id));
});

timeSeriesRouter.delete('/:id', async (req, res) => {
  await deleteTimeSeries(req.params.id);
  res.status(204).end();
});
