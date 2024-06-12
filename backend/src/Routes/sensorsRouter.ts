import express from 'express';
import SensorsController from '../Controllers/SensorsController';

const sensorsRouter = express.Router();

sensorsRouter
  .get('/:id',  (req, res, next) =>
    new SensorsController(req, res, next).listAll() )
  .post('/', (req, res, next) =>
    new SensorsController(req, res, next).create()
  )
  .patch('/:id', (req, res, next) =>
    new SensorsController(req, res, next).update()
  )
  .delete('/:id', (req, res, next) =>
    new SensorsController(req, res, next).delete()
  );

export default sensorsRouter;
