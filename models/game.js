const { Sequelize } = require('sequelize');
const db = require('../config/database');


const Game = db.define('Game', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    release_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    rating: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    number_of_reviews: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    summary: {
        type: Sequelize.STRING,
        allowNull: true
    },
    plays: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    playing:{
        type: Sequelize.INTEGER,
        allowNull: true
    },
    backlogs: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    wishlist: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

module.exports = Game;