const route = require('express').Router();
const { assetController } = require('../controllers');

route.post('/register', assetController.registerAsset);

module.exports = route;