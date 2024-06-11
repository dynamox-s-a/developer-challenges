import express from 'express';
const createMachine = () => {};
const deleteMachineByID = () => {};
const findAllMachines = () => {};
const findByMachineID = () => {};
const postValidation = () => {};

const machinesRouter = express.Router();

machinesRouter
  .get('/', findAllMachines)
  .get('/:id', findByMachineID)
  .post('/', postValidation, createMachine)
  .delete('/:id', deleteMachineByID);

export default machinesRouter;
