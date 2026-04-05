const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.inicio);
router.get('/abrirRegistro', userController.abrirRegistro);
router.post('/abrirRegistro', userController.postRegistro);
router.get('/abrirLogin', userController.abrirLogin);
router.post('/abrirLogin', userController.loginOpen);
router.get('/logout', userController.logout);

module.exports = router;