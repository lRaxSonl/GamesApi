const { Sequelize } = require('sequelize');
const db = require('../config/database');


const Developer = db.define('Developer', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Developer;