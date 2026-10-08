import type { Request, Response } from 'express';
import type {
  ListMonitoringPointsQuery,
  MonitoringPointInput,
} from './monitoring-points.schemas';
import * as monitoringPointsService from './monitoring-points.service';

// Params, query and body were already parsed by validate() in the routes.

export async function list(req: Request, res: Response) {
  res.json(
    await monitoringPointsService.listMonitoringPoints(
      req.query as unknown as ListMonitoringPointsQuery,
    ),
  );
}

export async function get(req: Request<{ id: string }>, res: Response) {
  res.json(await monitoringPointsService.getMonitoringPoint(req.params.id));
}

export async function create(
  req: Request<{ machineId: string }>,
  res: Response,
) {
  const point = await monitoringPointsService.createMonitoringPoint(
    req.params.machineId,
    req.body as MonitoringPointInput,
  );
  res.status(201).json(point);
}

export async function update(req: Request<{ id: string }>, res: Response) {
  res.json(
    await monitoringPointsService.updateMonitoringPoint(
      req.params.id,
      req.body as MonitoringPointInput,
    ),
  );
}

export async function remove(req: Request<{ id: string }>, res: Response) {
  await monitoringPointsService.deleteMonitoringPoint(req.params.id);
  res.status(204).end();
}
