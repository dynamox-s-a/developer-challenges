import express from 'express';
import UsersController from '../Controllers/UsersController';

const usersRouter = express.Router();

usersRouter.post('/', (req, res, next) =>
  new UsersController(req, res, next).create()
);

export default usersRouter;
