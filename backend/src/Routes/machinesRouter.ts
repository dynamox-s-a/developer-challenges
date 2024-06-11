import express from 'express';
import MachinesController from '../Controllers/MachinesController';

const machinesRouter = express.Router();

machinesRouter
  .get('/:id',  (req, res, next) =>
    new MachinesController(req, res, next).listAll() )
  .post('/', (req, res, next) =>
    new MachinesController(req, res, next).create()
  );

export default machinesRouter;
