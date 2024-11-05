const route = require('express').Router();
const { assetController } = require('../controllers');

route.post('/register', assetController.registerAsset);
route.get('/show', assetController.showAssets);
route.delete('/delete/:id', assetController.deleteAssets);

module.exports = route;