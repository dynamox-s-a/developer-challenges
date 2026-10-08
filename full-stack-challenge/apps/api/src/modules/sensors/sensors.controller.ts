import type { Request, Response } from 'express';
import type { AttachSensorInput } from './sensors.schemas';
import * as sensorsService from './sensors.service';

// Params and body were already parsed by validate() in the routes.

export async function attach(req: Request<{ pointId: string }>, res: Response) {
  const sensor = await sensorsService.attachSensor(
    req.params.pointId,
    req.body as AttachSensorInput,
  );
  res.status(201).json(sensor);
}

export async function remove(req: Request<{ id: string }>, res: Response) {
  await sensorsService.removeSensor(req.params.id);
  res.status(204).end();
}
