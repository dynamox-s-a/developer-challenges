import { Router } from 'express';
import machinesRouter from './machinesRouter';
import usersRouter from './usersRouter';
import loginRouter from './loginRouter';
import sensorsRouter from './sensorsRouter';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/login', loginRouter);
routes.use('/machines', machinesRouter);
routes.use('/sensors', sensorsRouter);

export default routes;
