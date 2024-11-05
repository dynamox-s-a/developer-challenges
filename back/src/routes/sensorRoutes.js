const route = require('express').Router();
const { sensorController } = require('../controllers');

route.post('/register', sensorController.registerSensor);

module.exports = route;