const express = require('express');
const machineController = require('../controller/machineController');

const router = express.Router();

router.get('/', machineController.getAllMachines);
router.get('/:idMachine', machineController.getMachineById);
router.post('/', machineController.postAddNewMachine);
router.put('/:idMachine', machineController.putEditMachineById);
router.delete('/:idMachine', machineController.deleteMachineById);

module.exports = router;
