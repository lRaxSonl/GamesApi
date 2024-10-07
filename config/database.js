const { Sequelize } = require("sequelize");

const database = new Sequelize(
    'test',
    'root',
    '', 
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);


module.exports = database;