const route = require('express').Router();
const { userController } = require('../controllers');

route.post('/sign_in', userController.login)
route.post('/sign_up', userController.createUser);

module.exports = route;
