/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes';
import machinesRoutes from './routes/machines.routes';
import { auth } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error.middleware';
import monitoringPointsRoutes from './routes/monitoringPoints.routes';
import timeseriesRoutes from './routes/timeseries.routes';

export const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);

// private

app.use('/', auth, timeseriesRoutes);

app.use('/machines', auth, machinesRoutes);

app.use('/monitoring-points', auth, monitoringPointsRoutes);

// app.get('/api', (req, res) => {
//     res.send({ message: 'Welcome to api!' });
// });

// error last
app.use(errorHandler);
