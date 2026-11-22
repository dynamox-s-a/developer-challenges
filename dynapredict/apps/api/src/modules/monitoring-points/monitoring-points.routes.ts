import { Router, type Request } from 'express';
import {
  monitoringPointListQuerySchema,
  monitoringPointSchema,
  sensorSchema,
} from '@dynapredict/shared';
import { parseQuery } from '../../lib/parse-query.ts';
import { requireAuth } from '../../middlewares/require-auth.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import {
  createMonitoringPoint,
  deleteMonitoringPoint,
  listMonitoringPoints,
  removeSensor,
  setSensor,
} from './monitoring-points.service.ts';

// Os pontos de UMA máquina: /api/machines/:machineId/monitoring-points.
// O :machineId está no caminho usado no app.ts, e não nas rotas daqui.
// O mergeParams: true é o que deixa este router enxergar esse parâmetro
export const machineMonitoringPointsRouter = Router({ mergeParams: true });

machineMonitoringPointsRouter.use(requireAuth);

machineMonitoringPointsRouter.post(
  '/',
  validateBody(monitoringPointSchema),
  async (req: Request<{ machineId: string }>, res) => {
    const point = await createMonitoringPoint(req.params.machineId, req.body);
    res.status(201).json(point);
  },
);

// A lista de todos os pontos (/api/monitoring-points) e um ponto que já
// existe (/api/monitoring-points/:id)
export const monitoringPointsRouter = Router();

monitoringPointsRouter.use(requireAuth);

// Ex.: GET /api/monitoring-points?page=2&sortBy=machineName&order=desc
monitoringPointsRouter.get('/', async (req, res) => {
  const query = parseQuery(monitoringPointListQuerySchema, req.query);
  res.json(await listMonitoringPoints(query));
});

monitoringPointsRouter.delete('/:id', async (req, res) => {
  await deleteMonitoringPoint(req.params.id);
  res.status(204).end();
});

// O sensor do ponto: /api/monitoring-points/:id/sensor. No singular porque
// cada ponto tem no máximo um. PUT porque coloca ou troca: mandar o mesmo
// pedido duas vezes deixa o ponto do mesmo jeito
monitoringPointsRouter.put(
  '/:id/sensor',
  validateBody(sensorSchema),
  async (req: Request<{ id: string }>, res) => {
    res.json(await setSensor(req.params.id, req.body));
  },
);

monitoringPointsRouter.delete('/:id/sensor', async (req, res) => {
  await removeSensor(req.params.id);
  res.status(204).end();
});
