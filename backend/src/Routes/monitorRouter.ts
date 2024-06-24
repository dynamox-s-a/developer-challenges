import express from 'express';
import MonitorController from '../Controllers/MonitorController';

const monitorRouter = express.Router();

monitorRouter.get('/:id', (req, res, next) =>
  new MonitorController(req, res, next).listAll()
);

export default monitorRouter;
