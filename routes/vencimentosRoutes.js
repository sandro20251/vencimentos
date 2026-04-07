const express = require('express');
const router = express.Router();
const vencimentosController = require('../controller/vencimentosController');

router.get('/novoVencimento', vencimentosController.abrirNovoVencimento);
router.post('/addVencimento', vencimentosController.add);
router.get('/verVencimentos', vencimentosController.ver);
router.get('/abrirVencimento/:id', vencimentosController.abrirVencimento);
router.post('/excluir/:id' ,vencimentosController.excluirVencimento);
module.exports = router;