const UserModels = require('../models/UserModels');
const bcrypt = require('bcryptjs');

module.exports = class userController {
    static inicio(req, res) {
        res.render('vencimentos/inicio');
    }

    static abrirRegistro(req, res) {
        res.render('usuarios/registro');
    }

    static abrirLogin(req, res) {
        res.render('usuarios/login');
    }

    static async postRegistro(req, res) {
        const { nome, email, senha, senha2 } = req.body;

        if (senha != senha2) {
            req.flash('m', 'As senhas não conferem!');
            res.render('usuarios/registro');
            return;
        }

        const user = await UserModels.findOne({ where: { email: email } });

        if (user) {
            req.flash('m', 'O e-mail já está sendo usado');
            res.render('usuarios/registro');
            return;
        }

        const salt = bcrypt.genSaltSync(11);
        const hash = bcrypt.hashSync(senha, salt);

        const usuario = {
            nome,
            email,
            senha: hash
        }

        try {
            const novoUsuario = await UserModels.create(usuario);
            req.flash('m', 'Usuário criado com sucesso');
            req.session.userid = novoUsuario.isSoftDeleted;
            req.session.save(() => {
                res.redirect('/');
            })
        } catch (err) {
            console.log(err);
        }
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/abrirLogin');
    }

    
}