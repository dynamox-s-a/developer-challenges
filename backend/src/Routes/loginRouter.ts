import express from 'express';
import UsersController from '../Controllers/UsersController';

const loginRouter = express.Router();

loginRouter.post('/', (req, res, next) =>
  new UsersController(req, res, next).login()
);

export default loginRouter;
