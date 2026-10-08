import { Router } from 'express';
import * as healthController from './health.controller';

/** Public: used by the Docker HEALTHCHECK, compose and Render. */
export const healthRoutes = Router();

healthRoutes.get('/', healthController.check);
