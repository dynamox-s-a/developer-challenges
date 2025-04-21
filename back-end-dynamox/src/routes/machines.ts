import express from 'express';
import MachinesController from '../controllers/machinesController';

const router = express.Router();

router.get('/', MachinesController.listAllMachines);
router.post('/', MachinesController.registerMachine);
router.put('/:id', MachinesController.editMachine);
router.delete('/:id', MachinesController.deleteMachine);

export default router;
