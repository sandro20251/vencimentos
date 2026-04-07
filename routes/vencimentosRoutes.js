const express = require('express');
const router = express.Router();
const vencimentosController = require('../controller/vencimentosController');

router.get('/novoVencimento', vencimentosController.abrirNovoVencimento);
router.post('/addVencimento', vencimentosController.add);
router.get('/verVencimentos', vencimentosController.ver);
router.get('/abrirVencimento/:id', vencimentosController.abrirVencimento);
router.post('/excluir/:id' ,vencimentosController.excluirVencimento);
router.get('/editarVencimento/:id', vencimentosController.abrirEdicao);
router.post('/atualizarVencimento', vencimentosController.atualizarVencimento);
module.exports = router;