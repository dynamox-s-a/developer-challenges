import { Router } from 'express';
import machinesRouter from './machinesRouter';
import usersRouter from './usersRouter';
import loginRouter from './loginRouter';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/login', loginRouter);
routes.use('/machines', machinesRouter);

export default routes;
