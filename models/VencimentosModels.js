const { DataTypes } = require('sequelize');
const db = require('../db/conn');
const UserModels = require('../models/UserModels');

const VencimentosModels = db.define('VencimentosModels', {
    codigo: {
        type: DataTypes.STRING
    },
    produto: {
        type: DataTypes.STRING
    },
    fornecedor: {
        type: DataTypes.STRING
    },
    quantidade: {
        type: DataTypes.STRING
    },
    vencimento: {
        type: DataTypes.STRING
    }
})
UserModels.hasMany(VencimentosModels);
VencimentosModels.belongsTo(UserModels);

module.exports = VencimentosModels;