import express from 'express';
import MachinesController from '../Controllers/MachinesController';

const machinesRouter = express.Router();

machinesRouter
  .get('/:id', (req, res, next) =>
    new MachinesController(req, res, next).listAll()
  )
  .post('/', (req, res, next) =>
    new MachinesController(req, res, next).create()
  )
  .patch('/:id', (req, res, next) =>
    new MachinesController(req, res, next).update()
  )
  .delete('/:id', (req, res, next) =>
    new MachinesController(req, res, next).delete()
  );

export default machinesRouter;
