const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/', userController.postAddNewUser);
router.put('/:idUsuario', userController.putEditUserById);

module.exports = router;
