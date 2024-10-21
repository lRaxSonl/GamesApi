const { Sequelize } = require("sequelize");

const database = new Sequelize(
    'test2',
    'root',
    '', 
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);


module.exports = database;