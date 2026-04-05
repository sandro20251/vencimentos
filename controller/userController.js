const UserModels = require('../models/UserModels');

module.exports = class userController {
    static inicio(req, res) {
        res.render('vencimentos/inicio');
    }
}