import { Router, type Request } from 'express';
import { monitoringPointSchema } from '@dynapredict/shared';
import { requireAuth } from '../../middlewares/require-auth.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import {
  createMonitoringPoint,
  deleteMonitoringPoint,
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

// Um ponto que já existe: /api/monitoring-points/:id
export const monitoringPointsRouter = Router();

monitoringPointsRouter.use(requireAuth);

monitoringPointsRouter.delete('/:id', async (req, res) => {
  await deleteMonitoringPoint(req.params.id);
  res.status(204).end();
});
