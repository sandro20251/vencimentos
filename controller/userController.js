const UserModels = require('../models/UserModels');

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
}