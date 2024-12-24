const express = require('express');
const pointController = require('../controller/pointController');

const router = express.Router();

router.get('/', pointController.getAllPoints);
router.get('/:idPoint', pointController.getPointById);
router.post('/', pointController.postAddNewPoint);
router.put('/:idPoint', pointController.putEditPointById);
router.delete('/:idPoint', pointController.deletePointById);

module.exports = router;
