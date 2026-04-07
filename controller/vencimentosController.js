const UserModels = require('../models/UserModels');
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

    static async ver(req, res) {

        const meusVencimentos = await vencimentos.findAll({ raw: true, where: { UserModelId: req.session.userid } });
        req.flash('m', 'Aqui estão seus vencimentos cadastrados');
        res.render('vencimentos/meusVencimentos', { meusVencimentos });



    }

    static async abrirVencimento(req, res) {
        const id = req.params.id;

        const vencimento = await vencimentos.findOne({
            raw: true,
            where: {
                id: id
            }
        })

        res.render('vencimentos/verVencimento', { vencimento });
    }

    static async excluirVencimento(req, res) {
        const id = req.params.id;

        await vencimentos.destroy({ where: { id: id } });
        req.flash('m', 'Vencimento excluído com sucesso!');
        res.redirect('/vencimentos/verVencimentos');
    }
}