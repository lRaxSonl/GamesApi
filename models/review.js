const { Sequelize } = require('sequelize');
const db = require('../config/database');
const Game = require('./game');

const Review = db.define("Review", {
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gameId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Game,
            key: 'id'
        }
    }
});

module.exports = Review;