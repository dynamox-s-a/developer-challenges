import { Router } from 'express';
import machinesRouter from './machinesRouter';
import usersRouter from './usersRouter';
import loginRouter from './loginRouter';
import sensorsRouter from './sensorsRouter';
import monitorRouter from './monitorRouter';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/login', loginRouter);
routes.use('/machines', machinesRouter);
routes.use('/sensors', sensorsRouter);
routes.use('/monitor', monitorRouter);

export default routes;
