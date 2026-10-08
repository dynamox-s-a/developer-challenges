import type { Request, Response } from 'express';
import type {
  TimeRangeQuery,
  CreateReadingsBody,
  ListReadingsQuery,
  PredictionQuery,
} from './readings.schemas';
import * as readingsService from './readings.service';

// Params, query and body were already parsed by validate() in the routes.

export async function list(req: Request<{ sensorId: string }>, res: Response) {
  res.json(
    await readingsService.listReadings(
      req.params.sensorId,
      req.query as unknown as ListReadingsQuery,
    ),
  );
}

export async function count(req: Request<{ sensorId: string }>, res: Response) {
  res.json(
    await readingsService.countReadings(
      req.params.sensorId,
      req.query as unknown as TimeRangeQuery,
    ),
  );
}

export async function metrics(
  req: Request<{ sensorId: string }>,
  res: Response,
) {
  res.json(
    await readingsService.getReadingsMetrics(
      req.params.sensorId,
      req.query as unknown as TimeRangeQuery,
    ),
  );
}

export async function create(
  req: Request<{ sensorId: string }>,
  res: Response,
) {
  const result = await readingsService.createReadings(
    req.params.sensorId,
    req.body as CreateReadingsBody,
  );
  // A batch made only of duplicates created nothing.
  res.status(result.inserted > 0 ? 201 : 200).json(result);
}

export async function remove(
  req: Request<{ sensorId: string }>,
  res: Response,
) {
  // 200 with the count (not 204), so the UI can confirm what was erased.
  res.json(
    await readingsService.deleteReadings(
      req.params.sensorId,
      req.query as unknown as TimeRangeQuery,
    ),
  );
}

export async function predict(
  req: Request<{ sensorId: string }>,
  res: Response,
) {
  res.json(
    await readingsService.predictReadings(
      req.params.sensorId,
      req.query as unknown as PredictionQuery,
    ),
  );
}
