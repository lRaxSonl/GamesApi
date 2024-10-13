const { Sequelize } = require('sequelize');
const db = require('../config/database');
const Game = require('./game');
const User = require('./user')

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
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
});

module.exports = Review;