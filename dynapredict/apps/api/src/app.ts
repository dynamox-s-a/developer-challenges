import express from 'express';
import { errorHandler } from './middlewares/error-handler.ts';
import { notFoundHandler } from './middlewares/not-found.ts';
import { authRouter } from './modules/auth/auth.routes.ts';
import { healthRouter } from './modules/health/health.routes.ts';
import { machinesRouter } from './modules/machines/machines.routes.ts';
import {
  machineMonitoringPointsRouter,
  monitoringPointsRouter,
} from './modules/monitoring-points/monitoring-points.routes.ts';
import {
  pointTimeSeriesRouter,
  timeSeriesRouter,
} from './modules/time-series/time-series.routes.ts';

export const app = express();

// Permite que a API leia JSON enviado no corpo das requisições.
// Até 2 MB (o padrão é 100 KB): uma série com 10.000 medições tem uns 700 KB
app.use(express.json({ limit: '2mb' }));

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
// Antes do machinesRouter: o caminho mais específico vem primeiro
app.use(
  '/api/machines/:machineId/monitoring-points',
  machineMonitoringPointsRouter,
);
app.use('/api/machines', machinesRouter);
// Antes do monitoringPointsRouter, pelo mesmo motivo
app.use('/api/monitoring-points/:pointId/time-series', pointTimeSeriesRouter);
app.use('/api/monitoring-points', monitoringPointsRouter);
app.use('/api/time-series', timeSeriesRouter);

// Nenhuma rota acima respondeu: 404 em JSON
app.use(notFoundHandler);

// Precisa ser o último: recebe os erros de todas as rotas acima
app.use(errorHandler);
