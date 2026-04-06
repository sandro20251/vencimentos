const express = require('express');
const router = express.Router();
const vencimentosController = require('../controller/vencimentosController');

router.get('/novoVencimento', vencimentosController.abrirNovoVencimento);
router.post('/addVencimento', vencimentosController.add);
module.exports = router;