const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const UserModels = db.define('UserModels', {
    nome: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    senha: {
        type: DataTypes.STRING
    }
})

module.exports = UserModels;