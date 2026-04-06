const VencimentosModels = require('../models/VencimentosModels');
const vencimentos = require('../models/VencimentosModels');

module.exports = class vencimentosController {
    static abrirNovoVencimento(req, res) {
        res.render('vencimentos/novoVencimento')
    }

    static async add(req, res) {
        const { codigo, produto, fornecedor, quantidade, data } = req.body;

        const novoVencimento = {
            codigo,
            produto,
            fornecedor,
            quantidade,
            vencimento: data,
            UserModelId: req.session.userid,
        }

        try {
            const vencimento = await vencimentos.create(novoVencimento);
            req.flash('m', 'Vencimento adicionado com sucesso');
            req.session.save(() => {
                res.redirect('/vencimentos/novoVencimento');
            })


        } catch (err) {
            console.log(err);
        }
    }
}