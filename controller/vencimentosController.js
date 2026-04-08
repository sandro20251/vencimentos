const UserModels = require('../models/UserModels');
const VencimentosModels = require('../models/VencimentosModels');
const vencimentos = require('../models/VencimentosModels');
const { Op } = require('sequelize');

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

    static async abrirEdicao(req, res) {
        const id = req.params.id;

        const vencimento = await vencimentos.findOne({ raw: true, where: { id: id } });
        res.render('vencimentos/editarVencimento', { vencimento });
    }

    static async atualizarVencimento(req, res) {
        const { id, codigo, produto, fornecedor, quantidade, data } = req.body

        const objeto = {
            codigo,
            produto,
            fornecedor,
            quantidade,
            vencimento: data
        }

        await vencimentos.update(objeto, { where: { id: id } });
        req.flash('m', 'Vencimento atualizado com sucesso!');
        res.redirect('/vencimentos/verVencimentos');
    }

    static async abrirBuscaFornecedor(req, res) {
        res.render('vencimentos/filtroPorFornecedor');
    }

    static async buscaFornecedor(req, res) {
        const fornecedor = req.body.buscaFornecedor;
        const meusVencimentos = await vencimentos.findAll({
            raw: true, where: {
                fornecedor: {
                    [Op.like]: `%${fornecedor}%`
                }
            }
        })

        res.render('vencimentos/meusVencimentos', { meusVencimentos })
    }

    static async abrirBuscaProduto(req, res) {
        res.render('vencimentos/filtroPorProdutos');
    }

    static async buscaProduto(req, res) {
        const produto = req.body.buscaProduto;

        const meusVencimentos = await vencimentos.findAll({
            raw: true, where: {
                produto: {
                    [Op.like]: `%${produto}%`
                }
            }
        })

        res.render('vencimentos/meusVencimentos', { meusVencimentos });
    }

    static async abrirBuscaData(req, res) {
        res.render('vencimentos/filtroPorData')
    }

    static async buscarData(req, res) {
        const data = req.body.buscaData;

        const meusVencimentos = await vencimentos.findAll({
            raw: true, where: {
                vencimento:{
                    [Op.like]: `%${data}%`
            }}
        })
        res.render('vencimentos/meusVencimentos', { meusVencimentos })
    }
}