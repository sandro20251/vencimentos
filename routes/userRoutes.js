const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.inicio);
router.get('/abrirRegistro', userController.abrirRegistro);
router.get('/abrirLogin', userController.abrirLogin);

module.exports = router;