import express, { Request, Response } from 'express';
import { timeSeriesRouter } from './routes/timeSeries.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'time-series-api',
  });
});

app.use('/time-series', timeSeriesRouter);

app.use(errorMiddleware);

export { app };