const express = require('express');
const sensorController = require('../controller/sensorController');

const router = express.Router();

router.post('/', sensorController.postAddSensor);
router.delete('/:idSensor', sensorController.deleteSensorById);

module.exports = router;
