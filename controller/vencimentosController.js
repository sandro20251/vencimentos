const UserModels = require('../models/UserModels');
const VencimentosModels = require('../models/VencimentosModels');
const vencimentos = require('../models/VencimentosModels');
const { Op } = require('sequelize');

const puppeteer = require('puppeteer');

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

        res.render('vencimentos/fornecedor', { meusVencimentos, fornecedor })
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

        res.render('vencimentos/produto', { meusVencimentos, produto });
    }

    static async abrirBuscaData(req, res) {
        res.render('vencimentos/filtroPorData')
    }

    static async buscarData(req, res) {
        const data = req.body.buscaData;

        const meusVencimentos = await vencimentos.findAll({
            raw: true, where: {
                vencimento: {
                    [Op.like]: `%${data}%`
                }
            }
        })
        res.render('vencimentos/data', { meusVencimentos, data })
    }

    static async PdfFornecedor(req, res) {


        const fornecedor = req.query.fornecedor;

        const meusVencimentos = await vencimentos.findAll({
            raw: true,
            where: {
                fornecedor: {
                    [Op.like]: `%${fornecedor}%`
                }
            }
        });

        let html = `
        <h1>Relatório - ${fornecedor}</h1>
        <ul>
    `;

        meusVencimentos.forEach(v => {
            html += `<li>${v.produto} - ${v.fornecedor} - ${v.vencimento}</li>`;
        });

        html += `</ul>`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);

        const pdf = await page.pdf({ format: 'A4' });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=relatorio.pdf'
        });

        res.send(pdf);
    }

    static async PdfProduto(req, res) {

        const produto = req.query.produto;

        const meusVencimentos = await vencimentos.findAll({
            raw: true,
            where: {
                produto: {
                    [Op.like]: `%${produto}%`
                },
                UserModelId: req.session.userid // 👈 segurança (opcional, mas recomendado)
            }
        });

        let html = `
        <h1>Relatório - Produto: ${produto}</h1>
        <table border="1" cellspacing="0" cellpadding="5">
            <tr>
                <th>Produto</th>
                <th>Fornecedor</th>
                <th>Vencimento</th>
            </tr>
    `;

        meusVencimentos.forEach(v => {
            html += `
            <tr>
                <td>${v.produto}</td>
                <td>${v.fornecedor}</td>
                <td>${v.vencimento}</td>
            </tr>
        `;
        });

        html += `</table>`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);

        const pdf = await page.pdf({ format: 'A4' });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=relatorio_produto.pdf'
        });

        res.send(pdf);
    }

    static async PdfData(req, res) {

        const data = req.query.data;

        const meusVencimentos = await vencimentos.findAll({
            raw: true,
            where: {
                vencimento: {
                    [Op.like]: `%${data}%`
                },
                UserModelId: req.session.userid // 👈 opcional (recomendado)
            }
        });

        let html = `
        <h1>Relatório - Data: ${data}</h1>
        <table border="1" cellspacing="0" cellpadding="5">
            <tr>
                <th>Produto</th>
                <th>Fornecedor</th>
                <th>Vencimento</th>
            </tr>
    `;

        meusVencimentos.forEach(v => {
            html += `
            <tr>
                <td>${v.produto}</td>
                <td>${v.fornecedor}</td>
                <td>${v.vencimento}</td>
            </tr>
        `;
        });

        html += `</table>`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);

        const pdf = await page.pdf({ format: 'A4' });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=relatorio_data.pdf'
        });

        res.send(pdf);
    }
    static async PdfTodos(req, res) {

        const meusVencimentos = await vencimentos.findAll({
            raw: true,
            where: {
                UserModelId: req.session.userid
            }
        });

        let html = `
        <h1>Relatório Completo de Vencimentos</h1>
        <table border="1" cellspacing="0" cellpadding="5">
            <tr>
                <th>Produto</th>
                <th>Fornecedor</th>
                <th>Vencimento</th>
            </tr>
    `;

        meusVencimentos.forEach(v => {
            html += `
            <tr>
                <td>${v.produto}</td>
                <td>${v.fornecedor}</td>
                <td>${v.vencimento}</td>
            </tr>
        `;
        });

        html += `</table>`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);

        const pdf = await page.pdf({ format: 'A4' });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=relatorio_completo.pdf'
        });

        res.send(pdf);
    }
}