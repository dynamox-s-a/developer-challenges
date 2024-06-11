import { Router } from 'express';
import machinesRouter from './machinesRouter';
import usersRouter from './usersRouter';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/machines', machinesRouter);

export default routes;
