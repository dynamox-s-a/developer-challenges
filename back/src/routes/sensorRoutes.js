const route = require('express').Router();
const { sensorController } = require('../controllers');

route.post('/register', sensorController.registerSensor);
route.get('/show', sensorController.showSensor);

module.exports = route;